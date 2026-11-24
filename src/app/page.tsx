import { Fragment } from "react";
import Link from "next/link";
import { RunReplay } from "@/components/run-replay";
import { SignalTimeline } from "@/components/signal-timeline";
import { EvidenceReport } from "@/components/evidence-report";
import { BookCall } from "@/components/book-call";
import { ArrowRight } from "@/components/icons";

// Illustrative failure modes a robot logs as SUCCESS.
const falseSuccesses = [
  { task: "Bin pick", happened: "Part slipped during the lift. The gripper closed on air.", result: "Part still in the bin" },
  { task: "Kitting", happened: "Picked SKU 4410-B instead of 4410-C. Same shape, different bore.", result: "Wrong part shipped in kit" },
  { task: "Connector insert", happened: "Connector pushed in, latch never engaged.", result: "Disconnects under vibration" },
  { task: "Screwdriving", happened: "Torque target reached on a cross-threaded screw.", result: "Stripped thread in housing" },
];

const verdictContents = [
  "Pass, fail or inconclusive for each criterion",
  "Video and sensor evidence behind every verdict",
  "Confidence score and its limitations",
  "Failure classification and likely cause",
  "Safety rule violations",
  "Reproducible task execution record",
];

// Intended architecture. Lists name data types, not shipped connectors.
const flow = [
  {
    name: "Your robots",
    role: "Existing robot data",
    items: ["Camera recordings (MP4)", "Task descriptions and metadata", "Robot telemetry (ROS 2)", "Gripper and sensor data"],
  },
  {
    name: "Homaro Platform",
    role: "Task Assurance Intelligence",
    items: ["Data synchronisation", "Physical outcome verification", "Evidence and confidence", "Failure classification"],
  },
  {
    name: "Your operations",
    role: "Verified task outcomes",
    items: ["Pass / Fail / Inconclusive", "Evidence-backed reports", "Failure explanations", "Reproducible task records"],
  },
];

export default function Home() {
  return (
    <>
      {/* 1. Hero: the replay is the product, so it gets the larger column */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pt-12 pb-20 lg:grid-cols-12 lg:items-center lg:gap-16 lg:pt-8 lg:pb-24">
        <div className="lg:col-span-5">
          <h1 className="text-[2.5rem] leading-[1.06] font-medium tracking-[-0.03em] sm:text-6xl">
            Robots execute tasks. Homaro verifies the outcome.
          </h1>
          <p className="mt-6 max-w-[36rem] text-lg leading-[1.6] text-slate">
            Homaro verifies whether robotic tasks were actually completed correctly, within specifications, and
            without damage. When something goes wrong, Homaro identifies what happened and why.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <BookCall />
            <Link href="/how-it-works" className="inline-flex items-center gap-2 font-medium hover:underline">
              How it works <ArrowRight />
            </Link>
          </div>
        </div>
        <div className="lg:col-span-7">
          <RunReplay />
        </div>
      </section>

      {/* 2. The gap: SUCCESS is a program state, not an outcome */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-3xl leading-[1.15] font-medium tracking-[-0.02em] sm:text-4xl">
              A robot can report SUCCESS while the task has failed.
            </h2>
            <p className="mt-4 text-slate">
              A robot&apos;s controller reports what it executed. It doesn&apos;t know if the physical outcome was
              right: whether a part slipped, the wrong component was picked, or a latch actually engaged.
            </p>
          </div>
          <div className="lg:col-span-8">
            <table className="w-full text-left">
              <thead className="text-sm text-slate">
                <tr>
                  <th className="pr-6 pb-3 font-normal">Task</th>
                  <th className="hidden pr-6 pb-3 font-normal sm:table-cell">Robot reported</th>
                  <th className="pb-3 font-normal">What actually happened</th>
                </tr>
              </thead>
              <tbody>
                {falseSuccesses.map((r) => (
                  <tr key={r.task} className="border-t border-navy/10 align-baseline">
                    <td className="py-5 pr-6 font-medium">{r.task}</td>
                    <td className="hidden py-5 pr-6 font-mono text-sm sm:table-cell">SUCCESS</td>
                    <td className="py-5">
                      <p className="font-medium">{r.result}</p>
                      <p className="mt-1 text-slate">{r.happened}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. Sensor fusion */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <p className="text-sm font-medium tracking-[0.04em] text-slate">HOW HOMARO WORKS</p>
            <h2 className="mt-3 text-3xl leading-[1.15] font-medium tracking-[-0.02em] sm:text-4xl">
              One signal isn&apos;t enough to verify a physical task.
            </h2>
            <p className="mt-4 text-slate">
              Homaro synchronises video, joint states, gripper events and force/torque data on a shared timeline.
              It analyses how these signals relate to each other and checks the physical outcome against your
              acceptance criteria.
            </p>
          </div>
          <div className="lg:col-span-8">
            <SignalTimeline />
          </div>
        </div>
      </section>

      {/* 4. Evidence, including the honest "can't tell" */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5 lg:col-start-1">
            <h2 className="text-3xl leading-[1.15] font-medium tracking-[-0.02em] sm:text-4xl">
              When the evidence isn&apos;t enough, Homaro says so.
            </h2>
            <p className="mt-4 text-slate">
              Some physical outcomes can&apos;t be established from video or incomplete sensor data alone. Rather
              than guess, Homaro marks the result inconclusive, explains what&apos;s missing, and tells you what
              additional evidence would settle it. Every verdict includes:
            </p>
            <ul className="mt-6 space-y-3">
              {verdictContents.map((v) => (
                <li key={v} className="border-l-2 border-navy/15 pl-4">{v}</li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <EvidenceReport />
          </div>
        </div>
      </section>

      {/* 5. Integration */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
        <h2 className="max-w-3xl text-3xl leading-[1.15] font-medium tracking-[-0.02em] sm:text-4xl">
          Works with the robots you already run. Read-only.
        </h2>
        <p className="mt-4 max-w-2xl text-slate">
          Homaro is designed to work alongside your existing robotic systems. Start with task recordings and
          available robot data, without changing your robot&apos;s control or safety systems.
        </p>

        <ol className="mt-12 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch lg:gap-4">
          {flow.map((stage, i) => {
            const homaro = i === 1;
            return (
              <Fragment key={stage.name}>
                {i > 0 && (
                  <li aria-hidden="true" className="flex justify-center text-slate lg:items-center">
                    <ArrowRight className="rotate-90 lg:rotate-0" />
                  </li>
                )}
                <li className={`rounded-[12px] p-6 ${homaro ? "bg-navy text-paper" : "border border-navy/10"}`}>
                  <p className={`text-sm ${homaro ? "text-mist" : "text-slate"}`}>{stage.name}</p>
                  <p className="mt-1 font-display text-xl">{stage.role}</p>
                  <ul className={`mt-4 space-y-2 border-t pt-4 ${homaro ? "border-paper/15" : "border-navy/10"}`}>
                    {stage.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </li>
              </Fragment>
            );
          })}
        </ol>
      </section>
    </>
  );
}
