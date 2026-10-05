import { certifications } from "../content/site";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { Eyebrow, Heading } from "./Section";

const rowCls =
  "group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-line px-4 py-6 transition-colors duration-300 hover:bg-ink hover:text-on-ink focus-visible:bg-ink focus-visible:text-on-ink sm:px-6";

export function Certifications() {
  return (
    <section id="certifications" aria-labelledby="certifications-title" className="relative outline-none">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow number="04" label="Certifications" />
          <div className="mt-6">
            <Heading id="certifications-title" lead="Always" accent="learning." />
          </div>
          <p className="mt-6 max-w-sm text-muted">
            Cloud data engineering, algorithms and the data engineering fundamentals I keep building on.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ol className="border-t border-line">
            {certifications.map((c, i) => {
              const body = (
                <>
                  <span className="font-mono text-xs text-muted transition-colors duration-300 group-hover:text-on-ink/70 group-focus-visible:text-on-ink/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-xl font-bold tracking-tight sm:text-2xl">{c.name}</span>
                    <span className="mt-0.5 block text-sm text-muted transition-colors duration-300 group-hover:text-on-ink/75 group-focus-visible:text-on-ink/75">
                      {c.issuer}
                    </span>
                  </span>
                  {c.link ? (
                    <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <Icon name="external" />
                    </span>
                  ) : (
                    <span />
                  )}
                </>
              );
              return (
                <li key={c.name}>
                  {c.link ? (
                    <a href={c.link} target="_blank" rel="noopener noreferrer" className={`${rowCls} rounded-none`}>
                      {body}
                      <span className="sr-only">(credential, opens in a new tab)</span>
                    </a>
                  ) : (
                    <div className={rowCls}>{body}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
