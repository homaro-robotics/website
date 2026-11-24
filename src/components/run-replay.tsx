"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Cross, Pending, Spinner } from "./icons";

// Simulated run: arm places a bearing that stops short of its seat.
// Homaro checks each criterion live, as its evidence arrives during the run. Seating depth fails
// at FLAGGED_AT, before the robot logs SUCCESS at RUN_END, where the verdict lands alongside it.

// Shoulder sits left of both tray and housing so the elbow never has to flip sides
// (a flip would swing the arm straight up, out of frame).
const SHOULDER = [110, 230] as const;
const L1 = 130;
const L2 = 120;
const RUN_END = 6.4;
const VERDICT_AT = RUN_END;
const FLAGGED_AT = 4.9;
const HOLD = 5; // seconds the verdict stays up before the run restarts

type Pose = [q1: number, q2: number];

// Elbow-up IK for targets right of the shoulder.
function ik(x: number, y: number): Pose {
  const dx = x - SHOULDER[0];
  const dy = y - SHOULDER[1];
  const c = (dx * dx + dy * dy - L1 * L1 - L2 * L2) / (2 * L1 * L2);
  const q2 = Math.acos(Math.max(-1, Math.min(1, c)));
  const q1 = Math.atan2(dy, dx) - Math.atan2(L2 * Math.sin(q2), L1 + L2 * Math.cos(q2));
  return [q1, q2];
}

// Rounded so server and browser trig render identical attributes (avoids hydration mismatch).
const r2 = (n: number) => Math.round(n * 100) / 100;

function fk([q1, q2]: Pose) {
  const e = [SHOULDER[0] + L1 * Math.cos(q1), SHOULDER[1] + L1 * Math.sin(q1)];
  const w = [e[0] + L2 * Math.cos(q1 + q2), e[1] + L2 * Math.sin(q1 + q2)];
  return { elbow: e.map(r2), wrist: w.map(r2) };
}

// [time s, wrist x, wrist y]. Interpolated in joint space, like a real arm.
const KEYS: [number, number, number][] = [
  [0, 200, 110],
  [1.0, 340, 150],
  [1.6, 340, 196],
  [1.9, 340, 196],
  [2.5, 340, 150],
  [3.9, 240, 140],
  [4.6, 240, 200],
  [4.9, 240, 200],
  [5.6, 240, 140],
  [6.4, 200, 110],
];
const POSES = KEYS.map(([, x, y]) => ik(x, y));

const ease = (u: number) => u * u * (3 - 2 * u);

function poseAt(t: number): Pose {
  if (t <= 0) return POSES[0];
  if (t >= KEYS[KEYS.length - 1][0]) return POSES[POSES.length - 1];
  const i = KEYS.findIndex((k, j) => t >= k[0] && t < KEYS[j + 1][0]);
  const u = ease((t - KEYS[i][0]) / (KEYS[i + 1][0] - KEYS[i][0]));
  const [a, b] = [POSES[i], POSES[i + 1]];
  return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
}

// from: when the check starts watching; at: when its evidence settles it.
const CHECKS = [
  { name: "Correct part picked", detail: "BRG-6204, as specified", pass: true, from: 0.8, at: 1.9 },
  { name: "Placed in housing B-12", detail: "0.3 mm off centre", pass: true, from: 3.6, at: 4.6 },
  { name: "Seating depth", detail: "2.1 mm proud · max 0.5", pass: false, from: 4.2, at: FLAGGED_AT },
  { name: "No damage to housing", detail: "Peak 31 N · limit 60", pass: true, from: 4.2, at: 5.3 },
];

const fmt = (s: number) => s.toFixed(1).padStart(4, "0");

export function RunReplay() {
  const [t, setT] = useState(0);
  const start = useRef(0);

  useEffect(() => {
    // Reduced motion: show the verdict, no loop.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    start.current = performance.now();
    const tick = (now: number) => {
      // Loop: run, verdict, hold, restart. Same-value setT during the hold is a no-op render.
      const elapsed = Math.max(0, (now - start.current) / 1000) % (VERDICT_AT + HOLD);
      setT(reduced ? VERDICT_AT : Math.min(elapsed, VERDICT_AT));
      if (!reduced) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const { elbow, wrist } = fk(poseAt(t));
  const gripping = t >= 1.8 && t < 4.8;
  const bearing = t < 1.8 ? [340, 216] : gripping ? [wrist[0], wrist[1] + 20] : [240, 220];
  const finger = gripping ? 15 : 19;
  const runDone = t >= RUN_END;
  const done = t >= VERDICT_AT;

  return (
    <figure className="rounded-[16px] bg-navy p-2 text-paper">
      {/* Scene: inner radius 16 - 8 = 8 */}
      <div className="rounded-[8px] bg-navy-raised">
        <div className="flex items-baseline justify-between gap-4 px-4 pt-4 text-sm">
          <span>
            <span className="font-mono text-mist">Task 4471</span> Insert bearing into housing B-12
          </span>
          <span className="text-mist">Simulated</span>
        </div>

        <svg viewBox="40 80 380 185" className="w-full lg:max-h-[max(10rem,calc(100svh-31rem))]" role="img" aria-label="Robot arm placing a bearing into a housing">
          <line x1="40" y1="250" x2="420" y2="250" stroke="currentColor" strokeOpacity="0.15" />
          {/* Tray */}
          <rect x="305" y="222" width="70" height="12" rx="2" fill="currentColor" fillOpacity="0.12" />
          <rect x="325" y="234" width="6" height="16" fill="currentColor" fillOpacity="0.12" />
          <rect x="349" y="234" width="6" height="16" fill="currentColor" fillOpacity="0.12" />
          {/* Housing with bore; bore floor at y=232 */}
          <path d="M200 250V200H224V232H256V200H280V250Z" fill="currentColor" fillOpacity="0.12" stroke="var(--mist)" strokeOpacity="0.5" />
          {/* Bearing */}
          <rect x={bearing[0] - 14} y={bearing[1] - 6} width="28" height="12" rx="2" fill="var(--paper)" />
          <rect x={bearing[0] - 5} y={bearing[1] - 6} width="10" height="12" fill="var(--navy-raised)" />
          {/* Arm */}
          <rect x="92" y="232" width="36" height="18" rx="3" fill="currentColor" fillOpacity="0.2" />
          <g stroke="var(--mist)" strokeLinecap="round">
            <line x1={SHOULDER[0]} y1={SHOULDER[1]} x2={elbow[0]} y2={elbow[1]} strokeWidth="12" />
            <line x1={elbow[0]} y1={elbow[1]} x2={wrist[0]} y2={wrist[1]} strokeWidth="9" />
            <line x1={wrist[0] - finger} y1={wrist[1] + 2} x2={wrist[0] + finger} y2={wrist[1] + 2} strokeWidth="4" />
            <line x1={wrist[0] - finger} y1={wrist[1] + 2} x2={wrist[0] - finger} y2={wrist[1] + 26} strokeWidth="3" />
            <line x1={wrist[0] + finger} y1={wrist[1] + 2} x2={wrist[0] + finger} y2={wrist[1] + 26} strokeWidth="3" />
          </g>
          <circle cx={SHOULDER[0]} cy={SHOULDER[1]} r="7" fill="var(--paper)" />
          <circle cx={elbow[0]} cy={elbow[1]} r="5" fill="var(--paper)" />
          {/* Evidence callout: gap between bearing underside and bore floor */}
          {t >= FLAGGED_AT && (
            <g className="animate-[fade_300ms_cubic-bezier(0.22,1,0.36,1)]">
              <line x1="256" y1="226" x2="298" y2="226" stroke="var(--paper)" strokeOpacity="0.4" />
              <line x1="280" y1="232" x2="298" y2="232" stroke="var(--paper)" strokeOpacity="0.4" />
              <line x1="292" y1="220" x2="292" y2="238" stroke="var(--paper)" />
              <text x="270" y="196" fill="var(--paper)" fontSize="13" className="font-mono">2.1 mm proud</text>
            </g>
          )}
        </svg>

        <div className="flex items-center gap-3 px-4 pb-4">
          {/* Ticks mark when each check was settled, during the run */}
          <div className="relative h-1 flex-1 rounded-full bg-paper/10">
            <div className="h-full rounded-full bg-mist" style={{ width: `${(Math.min(t, RUN_END) / RUN_END) * 100}%` }} />
            {CHECKS.filter((c) => t >= c.at).map((c) => (
              <span
                key={c.name}
                className={`absolute -top-1 h-3 w-0.5 rounded-full ${c.pass ? "bg-mist" : "bg-paper"}`}
                style={{ left: `${(c.at / RUN_END) * 100}%` }}
              />
            ))}
          </div>
          <span className="font-mono text-sm tabular-nums text-mist">
            {fmt(Math.min(t, RUN_END))} / {fmt(RUN_END)} s
          </span>
        </div>
      </div>

      {/* Signature: what the robot reported vs what Homaro verified */}
      <div className="grid gap-6 px-4 pt-5 pb-3 sm:grid-cols-[9rem_1fr]">
        <div>
          <p className="text-sm text-mist">Robot reported</p>
          <p className="mt-2 font-mono text-lg" aria-live="polite">
            {runDone ? "SUCCESS" : <span className="text-mist">Running</span>}
          </p>
          {runDone && <p className="font-mono text-sm tabular-nums text-mist">at {fmt(RUN_END)} s</p>}
        </div>

        <div>
          <p className="text-sm text-mist">Homaro verified</p>
          <ul className="mt-2 space-y-1">
            {CHECKS.map((c) => {
              const state = t < c.from ? "wait" : t < c.at ? "busy" : c.pass ? "pass" : "fail";
              return (
                <li
                  key={c.name}
                  className={`grid grid-cols-[16px_1fr] gap-x-3 rounded-[6px] px-2 py-1 transition-colors duration-300 sm:grid-cols-[16px_1fr_auto] ${
                    state === "fail" ? "bg-paper text-navy" : ""
                  }`}
                >
                  <span className="pt-0.5">
                    {state === "pass" ? <Check /> : state === "fail" ? <Cross /> : state === "busy" ? <Spinner /> : <Pending />}
                  </span>
                  <span className={state === "wait" ? "text-mist" : ""}>{c.name}</span>
                  <span className={`col-start-2 font-mono text-sm tabular-nums sm:col-start-3 ${state === "fail" ? "" : "text-mist"}`}>
                    {state === "pass" || state === "fail" ? c.detail : ""}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* Reserved height so the verdict doesn't shift the layout */}
          <div className="mt-3 min-h-20 border-t border-paper/10 pt-3" aria-live="polite">
            {done ? (
              <div className="animate-[rise_400ms_cubic-bezier(0.22,1,0.36,1)]">
                <p className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-xl">Fail: bearing not fully seated</span>
                  <span className="text-sm text-mist">
                    Confidence <span className="font-mono tabular-nums text-paper">94%</span>
                  </span>
                </p>
                <p className="mt-1 text-sm text-mist">
                  Flagged at <span className="font-mono tabular-nums text-paper">{fmt(FLAGGED_AT)} s</span>, before
                  the robot reported SUCCESS. Press hit its 32&nbsp;N limit short of the bore floor.
                </p>
              </div>
            ) : t >= FLAGGED_AT ? (
              <p className="flex items-center gap-2 text-sm text-mist">
                <Spinner /> Seating depth out of spec. Run still in progress.
              </p>
            ) : (
              <p className="flex items-center gap-2 text-sm text-mist">
                <Spinner /> Checking live against task spec: video, joint states, force
              </p>
            )}
          </div>

        </div>
      </div>
    </figure>
  );
}
