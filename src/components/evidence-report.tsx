import { Question } from "./icons";

// Simulated report for a run where evidence can't settle the outcome.
// Amber = "can't tell", used only for the verdict and the missing source in this card.
const evidence: [string, string, boolean?][] = [
  ["Video clips", "2"],
  ["Joint state samples", "4,180"],
  ["Gripper events", "6"],
  ["Force/torque samples", "0", true],
];

export function EvidenceReport() {
  return (
    <article className="rounded-[16px] bg-white p-6 shadow-[0_1px_2px_rgba(15,27,45,0.06)]">
      <header className="flex items-baseline justify-between gap-4 text-sm">
        <span>
          <span className="font-mono text-slate">Task 2215</span> Bearing insert, cell 3
        </span>
        <span className="text-slate">Simulated</span>
      </header>

      <p className="mt-6 inline-flex items-center gap-2 rounded-[8px] bg-[#FBF0DC] px-3 py-1.5 font-display text-2xl text-[#7A4F00]">
        <Question className="size-5" /> Inconclusive
      </p>

      <dl className="mt-6 space-y-4">
        <div>
          <dt className="text-sm text-slate">Why</dt>
          <dd className="mt-1">
            A fixture clamp blocks the camera&apos;s view of the housing from 3.2 to 5.0 s, and cell 3 logs no
            force data. Seating depth can&apos;t be established from what was recorded.
          </dd>
        </div>
        <div>
          <dt className="text-sm text-slate">What would settle it</dt>
          <dd className="mt-1">Force/torque logging on cell 3, or a second camera angle on the housing.</dd>
        </div>
      </dl>

      <table className="mt-6 w-full text-sm">
        <caption className="mb-2 text-left text-slate">Evidence used</caption>
        <tbody>
          {evidence.map(([k, v, missing]) => (
            <tr key={k} className={`border-t border-navy/8 ${missing ? "bg-[#FBF0DC] text-[#7A4F00]" : ""}`}>
              <td className={`py-2 ${missing ? "pl-2 font-medium" : ""}`}>{k}</td>
              <td className={`py-2 text-right tabular-nums ${missing ? "pr-2" : ""}`}>
                <span className="font-mono">{v}</span>
                {missing && <span className="font-medium"> — Missing</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
