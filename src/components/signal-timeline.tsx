// Simulated connector insertion: video looks fine, force trace shows the latch never clicked.
// x: 120..620 maps 0..5.0 s. Four tracks share one clock. Force: y 272 = 0 N, 1.92 px per N.
import { Cross } from "@/components/icons";

const X0 = 120;
const X1 = 620;
const x = (s: number) => X0 + ((X1 - X0) * s) / 5;
const SEAT = 3.6;
const RELEASE = 4.1;
const f = (n: number) => 272 - n * 1.92;

const tracks = [
  { label: "Camera", y: 40 },
  { label: "Joint states", y: 110 },
  { label: "Gripper", y: 180 },
  { label: "Force (N)", y: 250 },
];

// One camera frame at time t: gripper carries the plug down into the receptacle, then lets go and lifts.
function Frame({ t, seated }: { t: number; seated: boolean }) {
  const plugY = 2 + 16 * Math.min(t, SEAT) / SEAT; // plug top, frame-local
  const held = t >= 0.8 && t < RELEASE;
  const gripY = t < RELEASE ? plugY - 2 : plugY - 2 - (t - RELEASE) * 14; // gripper lifts after release
  const fingerX = held ? 1 : 3; // fingers close on the plug
  return (
    <g transform={`translate(${x(t) + 2} 24)`}>
      <rect width="44" height="32" rx="4" fill="currentColor" fillOpacity="0.06" stroke={seated ? "currentColor" : "none"} strokeWidth="1.5" />
      {/* Receptacle */}
      <path d="M12 31 V22 H32 V31" fill="currentColor" fillOpacity="0.18" />
      {/* Plug */}
      <rect x="16" y={plugY} width="12" height="9" rx="1" fill="currentColor" fillOpacity="0.55" />
      {/* Gripper */}
      <line x1="22" y1="0" x2="22" y2={gripY} stroke="currentColor" strokeOpacity="0.5" />
      <rect x={16 - fingerX - 2} y={gripY} width="2" height="7" fill="currentColor" fillOpacity="0.7" />
      <rect x={28 + fingerX} y={gripY} width="2" height="7" fill="currentColor" fillOpacity="0.7" />
    </g>
  );
}

export function SignalTimeline() {
  return (
    <figure className="rounded-[16px] bg-white p-6 shadow-[0_1px_2px_rgba(15,27,45,0.06)]">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
        <span>
          <span className="font-mono text-slate">Task 2208</span> Insert harness connector J4
        </span>
        <span className="shrink-0 text-slate">Simulated example</span>
      </figcaption>

      <p className="mt-3 text-sm text-slate sm:hidden">Swipe to see the full 5 s.</p>
      <div className="mt-4 overflow-x-auto">
        <svg viewBox="0 0 640 310" className="min-w-[560px] w-full text-navy" role="img" aria-label="Simulated connector insertion. Camera frames show the connector seated at 3.6 seconds, but the force trace peaks at 14 N instead of the expected 24 N or more, so latch engagement is not verified.">
          <defs>
            <pattern id="deficit" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="5" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
            </pattern>
          </defs>

          {tracks.map((t) => (
            <text key={t.label} x="0" y={t.y + 4} fontSize="13" fill="var(--slate)">{t.label}</text>
          ))}

          {/* Camera: the seated frame looks identical to a good insertion */}
          {Array.from({ length: 10 }, (_, i) => (
            <Frame key={i} t={i * 0.5} seated={i === 7} />
          ))}

          {/* Joint states */}
          <path d={`M${x(0)} 128 C ${x(1)} 128, ${x(1.4)} 92, ${x(2.2)} 94 S ${x(3.2)} 118, ${x(SEAT)} 120 L ${x(5)} 120`} stroke="currentColor" strokeWidth="1.5" fill="none" />

          {/* Gripper: open, closed, open */}
          <path d={`M${x(0)} 192 H${x(0.8)} V168 H${x(RELEASE)} V192 H${x(5)}`} stroke="currentColor" strokeWidth="1.5" fill="none" />

          {/* Force: expected threshold, missing peak (hatched), measured trace */}
          <line x1={x(2.6)} y1={f(24)} x2={x(5)} y2={f(24)} stroke="currentColor" strokeOpacity="0.4" strokeDasharray="4 3" />
          <text x={x(2.6)} y={f(24) - 6} fontSize="12" fill="var(--slate)" className="tabular-nums">Expected ≥ 24 N</text>
          <path
            d={`M${x(3.2)} ${f(10)} C ${x(3.35)} ${f(16)}, ${x(3.45)} ${f(22)}, ${x(3.55)} ${f(26)} L ${x(3.65)} ${f(12)} L ${x(SEAT)} ${f(14)} Z`}
            fill="url(#deficit)"
          />
          <path d={`M${x(2.8)} 272 C ${x(3.2)} 266, ${x(3.4)} ${f(18)}, ${x(3.55)} ${f(26)} L ${x(3.65)} ${f(14)}`} stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
          <path d={`M${x(0)} 272 H${x(2.8)} C ${x(3.2)} 266, ${x(3.4)} ${f(13)}, ${x(SEAT)} ${f(14)} L ${x(RELEASE)} ${f(14)} L ${x(4.2)} 272 H${x(5)}`} stroke="currentColor" strokeWidth="2.5" fill="none" />
          <circle cx={x(SEAT)} cy={f(14)} r="3.5" fill="currentColor" />
          <text x={x(SEAT) + 10} y={f(14) - 7} fontSize="13" fontWeight="600" fill="currentColor" className="tabular-nums">Measured peak 14 N</text>

          {/* Event marker: seat */}
          <line x1={x(SEAT)} y1="62" x2={x(SEAT)} y2="284" stroke="currentColor" strokeDasharray="2 3" />
          <rect x={x(SEAT) - 52} y="70" width="104" height="20" rx="4" fill="var(--navy)" />
          <text x={x(SEAT)} y="84" fontSize="12" fill="var(--paper)" textAnchor="middle" className="tabular-nums">Seated · 3.6 s</text>

          {[0, 1, 2, 3, 4, 5].map((s) => (
            <text key={s} x={x(s)} y="304" fontSize="12" fill="var(--slate)" textAnchor="middle" className="font-mono tabular-nums">{s}.0 s</text>
          ))}
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-[16px_1fr] gap-x-3 rounded-[8px] bg-paper px-4 py-3">
        <span className="pt-1"><Cross /></span>
        <p className="font-medium">Latch engagement not verified.</p>
        <p className="col-start-2 mt-1 text-sm text-slate">
          Video shows the connector seated. Force peaked at <span className="tabular-nums">14 N</span>; a latched
          insert shows <span className="tabular-nums">≥ 24 N</span>.
        </p>
      </div>
    </figure>
  );
}
