import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

import { SearchBox } from "@/components/search-box";
import { TopicCards } from "@/components/topic-cards";
import { getIntroContent } from "@/lib/intro";
import { getSection, paper } from "@/lib/paper";
import { cn } from "@/lib/utils";

function Html({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return <p className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

const START_HERE = [
  {
    slug: "emergency-services",
    hint: "911, 988, and local response",
  },
  {
    slug: "warning-signs",
    hint: "What to watch for, and outpatient first",
  },
  {
    slug: "hospitalization",
    hint: "ER, admission, and what families can do",
  },
  {
    slug: "system-constraints",
    hint: "HIPAA, FERPA, and what you can still share",
  },
] as const;

export function HomeIntro() {
  const intro = getIntroContent();

  return (
    <div className="w-full">
      <div className="border-b border-primary/20 bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm font-medium">
            If someone is not safe right now
          </p>
          <Link
            href="/guide/emergency-services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
          >
            Open emergency services
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      <section className="home-hero border-b border-border/70">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            {paper.eyebrow}
          </p>
          <h1 className="mt-2 max-w-2xl font-heading text-3xl leading-[1.15] tracking-tight text-foreground sm:text-4xl">
            What To Do - My college-age young adult is having a mental health crisis
          </h1>
          <p className="mt-3 max-w-xl text-foreground/80">
            For families, friends, and other support people, whose young adult is roughly ages 18–25.
            Open a topic. You do not have to read this in order.
          </p>
          <div className="mt-6 max-w-xl">
            <SearchBox size="hero" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h2 className="font-heading text-xl tracking-tight text-foreground sm:text-2xl">
          Start here
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {START_HERE.map((item) => {
            const section = getSection(item.slug);
            if (!section) {
              return null;
            }
            const isEmergency = item.slug === "emergency-services";
            return (
              <li key={item.slug}>
                <Link
                  href={`/guide/${item.slug}`}
                  className={cn(
                    "flex h-full flex-col rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md",
                    isEmergency
                      ? "border-primary/40 bg-card"
                      : "border-border bg-card"
                  )}
                >
                  <span className="inline-flex items-center gap-2 font-heading text-lg font-semibold tracking-tight">
                    {isEmergency ? (
                      <Phone className="size-4 text-primary" aria-hidden />
                    ) : null}
                    {section.title}
                  </span>
                  <span className="mt-1 text-sm text-muted-foreground">
                    {item.hint}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section
        id="topics"
        className="mx-auto max-w-6xl scroll-mt-8 px-4 pb-10 sm:px-6 sm:pb-12"
      >
        <h2 className="font-heading text-xl tracking-tight text-foreground sm:text-2xl">
          All topics
        </h2>
        <div className="mt-4">
          <TopicCards compact />
        </div>
      </section>

      {intro ? (
        <section className="border-t border-border/70 bg-card/50">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
            {intro.disclaimerHtml ? (
              <Html
                html={intro.disclaimerHtml}
                className="text-sm text-muted-foreground"
              />
            ) : null}
            <details className="mt-4 rounded-2xl border border-border bg-background px-4 py-3">
              <summary className="cursor-pointer text-sm font-medium">
                About this guide
              </summary>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/90">
                <Html html={intro.leadHtml} />
                <p>{intro.factorLead}</p>
                <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                  {intro.factors.map((factor) => (
                    <li key={factor.label}>{factor.text}</li>
                  ))}
                </ul>
                <Html html={intro.purposeHtml} />
                <Html html={intro.sourceHtml} />
                <Html html={intro.crisisHtml} />
                <Html html={intro.scopeHtml} />
                <Html html={intro.limitedHtml} />
                <p className="text-muted-foreground">{paper.authors}</p>
              </div>
            </details>
          </div>
        </section>
      ) : null}
    </div>
  );
}
