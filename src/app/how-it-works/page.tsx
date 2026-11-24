import type { Metadata } from "next";
import { SignalTimeline } from "@/components/signal-timeline";
import { ArrowRight, Check, Cross, Question } from "@/components/icons";

export const metadata: Metadata = {
  title: "How it works",
  description: "How Homaro verifies that a robot task met its spec: define what done means, connect the data you record, check each run, get a verdict you can check.",
};

// Example acceptance spec. Shown as code, so mono is earned here.
const spec = `# Thresholds are illustrative examples
task: bearing_insert
part: BRG-6204
target: housing B-12, bore 1
accept:
  seat_depth_mm: <= 0.5
  housing_damage: none
  insertion_force_n: <= 60`;

const data = [
  ["Task description and acceptance criteria", "Essential"],
  ["Execution video with timestamps", "Core V1 input"],
  ["Task/run identification", "Needed to associate evidence"],
  ["Robot joint/motion data", "Important"],
  ["Gripper feedback", "Depends on task"],
  ["Force/torque data", "When available and relevant"],
];

const sources = ["Acceptance criteria", "Execution video", "Task/run ID", "Joint/motion data", "Gripper feedback", "Force/torque, if available"];

const outcomes = [
  ["Pass", "Available evidence supports that the acceptance criteria were met."],
  ["Fail", "Evidence indicates that one or more acceptance criteria were not met."],
  ["Inconclusive", "Available evidence is insufficient to establish the outcome."],
];

// Illustrative verdict: one result per acceptance criterion from the spec in step 1.
const verdict = [
  { criterion: "Seat depth ≤ 0.5 mm", result: "Fail", detail: "1.8 mm", Icon: Cross },
  { criterion: "No housing damage", result: "Pass", detail: "Frames 412–436", Icon: Check },
  { criterion: "Insertion force ≤ 60 N", result: "Inconclusive", detail: "No force data", Icon: Question },
];

const never = [
  "Takes control of your robot or modifies its safety systems.",
  "Requires you to replace your existing robot or controller.",
  "Processes data beyond the access and permissions you provide.",
];

function Step({ n, title, children, visual }: { n: number; title: string; children: React.ReactNode; visual: React.ReactNode }) {
  return (
    <section className="grid grid-cols-1 gap-10 py-16 lg:grid-cols-12 lg:gap-16 lg:py-20">
      <div className="lg:col-span-5">
        <p className="font-display text-xl text-slate tabular-nums">{n}</p>
        <h2 className="mt-2 text-3xl leading-[1.15] font-medium tracking-[-0.02em]">{title}</h2>
        <div className="mt-4 space-y-4 text-slate">{children}</div>
      </div>
      <div className="lg:col-span-7">{visual}</div>
    </section>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6">
        <header className="max-w-3xl pt-12 pb-8 lg:pt-20">
          <h1 className="text-[2.5rem] leading-[1.06] font-medium tracking-[-0.03em] sm:text-6xl">
            From &lsquo;the robot says done&rsquo; to knowing the task was done right.
          </h1>
          <p className="mt-6 max-w-[36rem] text-lg leading-[1.6] text-slate">
            Four steps. Using task recordings, available robot data and your acceptance criteria. No changes to your
            robot&apos;s control or safety systems.
          </p>
        </header>

        <Step
          n={1}
          title="Write down what done means"
          visual={
            <figure>
              <figcaption className="mb-2 text-sm font-medium tracking-[0.04em] text-slate">ILLUSTRATIVE TASK SPECIFICATION</figcaption>
              <pre className="overflow-x-auto rounded-[16px] bg-navy p-6 font-mono text-sm leading-[1.7] text-paper">
                <code>{spec}</code>
              </pre>
            </figure>
          }
        >
          <p>
            Define the expected outcome for each task: what needs to happen, where it needs to happen, and which
            acceptance criteria must be met. These criteria provide the reference against which Homaro evaluates
            each execution.
          </p>
        </Step>

        <Step
          n={2}
          title="Connect the data you already record"
          visual={
            <div className="space-y-10">
              <table className="w-full text-left">
                <caption className="mb-2 text-left text-sm text-slate">Data Homaro uses</caption>
                <tbody>
                  {data.map(([k, v]) => (
                    <tr key={k} className="border-t border-navy/10">
                      <td className="py-3 pr-6">{k}</td>
                      <td className="py-3 text-right text-slate">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <figure aria-label="Evidence sources feeding into Homaro">
                <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-[1fr_2rem_minmax(0,14rem)] sm:items-center">
                  <ul className="space-y-2">
                    {sources.map((src) => (
                      <li
                        key={src}
                        className="relative rounded-[8px] border border-navy/10 px-4 py-2.5 sm:after:absolute sm:after:top-1/2 sm:after:left-full sm:after:w-4 sm:after:border-t sm:after:border-navy/25"
                      >
                        {src}
                      </li>
                    ))}
                  </ul>
                  {/* Bracket joining each source, then one line into Homaro */}
                  <div aria-hidden="true" className="relative hidden self-stretch border-l border-navy/25 sm:my-[22px] sm:block">
                    <span className="absolute top-1/2 left-0 w-[calc(100%+1rem)] border-t border-navy/25" />
                  </div>
                  <div aria-hidden="true" className="flex justify-center text-slate sm:hidden">
                    <ArrowRight className="rotate-90" />
                  </div>
                  <div className="rounded-[12px] bg-navy p-5 text-paper">
                    <p className="font-display text-xl">Homaro</p>
                    <p className="mt-2 text-sm text-mist">One timeline per run, tied to its task ID and checked against your criteria.</p>
                  </div>
                </div>
              </figure>
            </div>
          }
        >
          <p>Start with recorded task executions and the robot data you already have.</p>
          <p>
            Not every task requires every sensor. The required evidence depends on what needs to be verified.
          </p>
        </Step>

        <Step n={3} title="Check every run on one clock" visual={<SignalTimeline />}>
          <p>
            Homaro synchronises available video, joint states, gripper events and sensor readings against
            timestamps and task IDs.
          </p>
          <p>
            Each signal provides a different piece of evidence. Homaro brings them together to evaluate whether the
            observed execution meets the defined acceptance criteria.
          </p>
        </Step>

        <Step
          n={4}
          title="Get a verdict you can check"
          visual={
            <figure className="rounded-[16px] bg-white p-6 shadow-[0_1px_2px_rgba(15,27,45,0.06)]">
              <figcaption className="flex items-baseline justify-between gap-4 text-sm">
                <span>
                  <span className="font-mono text-slate">Task 2215</span> Bearing insert
                </span>
                <span className="shrink-0 text-slate">Illustrative example</span>
              </figcaption>
              <ul className="mt-6">
                {verdict.map(({ criterion, result, detail, Icon }) => (
                  <li key={criterion} className="grid grid-cols-[16px_1fr] gap-x-3 border-t border-navy/10 py-3 sm:grid-cols-[16px_1fr_auto]">
                    <span className="pt-1"><Icon /></span>
                    <span>
                      {criterion}
                      <span className="block text-sm text-slate">{result}</span>
                    </span>
                    <span className="col-start-2 text-sm text-slate tabular-nums sm:col-start-3 sm:pt-0.5">{detail}</span>
                  </li>
                ))}
              </ul>
            </figure>
          }
        >
          <dl className="space-y-4">
            {outcomes.map(([k, v]) => (
              <div key={k}>
                <dt className="font-medium text-navy">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p>Each result shows the evidence behind it, so your team can review the call.</p>
        </Step>

        <section className="max-w-3xl py-16 lg:py-20">
          <h2 className="text-3xl leading-[1.15] font-medium tracking-[-0.02em]">What Homaro never does</h2>
          <ul className="mt-6 space-y-3">
            {never.map((v) => (
              <li key={v} className="border-l-2 border-navy/15 pl-4">{v}</li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
