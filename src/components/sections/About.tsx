import { Counter } from "@/components/fx/Counter";
import { Reveal } from "@/components/fx/Reveal";
import { about } from "@/data/about";
import { Portrait } from "./Portrait";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section bg-surface">
      <div className="container-grid grid-12 gap-y-14">
        <div className="col-span-4 md:col-span-5">
          <div className="md:sticky md:top-28">
            <Portrait />
          </div>
        </div>

        <div className="col-span-4 md:col-span-6 md:col-start-7">
          <h2 id="about-title" className="display text-step-5">
            About
          </h2>
          <Reveal className="mt-8 space-y-5">
            {about.story.map((para, i) => (
              <p key={i} className={i === 0 ? "heading text-step-2" : "text-step-1 text-muted"}>
                {para}
              </p>
            ))}
          </Reveal>

          <dl className="border-line mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t pt-10">
            {about.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="text-muted mt-2">{s.label}</dt>
                <dd className="display text-step-5">
                  <Counter value={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>

          <h3 className="heading text-step-2 mt-16">So far</h3>
          <ol className="border-line mt-6 space-y-0 border-l">
            {about.milestones.map((m) => (
              <li key={m.year} className="relative grid grid-cols-[4.5rem_1fr] gap-4 py-3 pl-6">
                <span
                  aria-hidden
                  className="border-surface bg-accent absolute top-[1.35rem] -left-[5px] size-[9px] rounded-full border-2"
                />
                <span className="font-semibold tabular-nums">{m.year}</span>
                <span className="text-muted">{m.text}</span>
              </li>
            ))}
          </ol>

          <h3 className="heading text-step-2 mt-16">A few facts</h3>
          <ul className="mt-6 grid gap-3">
            {about.facts.map((f) => (
              <li key={f} className="border-line bg-bg rounded-2xl border px-5 py-4">
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
