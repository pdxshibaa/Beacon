import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SearchBox } from "@/components/search-box";
import { TopicCards } from "@/components/topic-cards";
import { getSection, paper } from "@/lib/paper";

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
  return (
    <div className="w-full">
      <div className="border-b border-primary/20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <Link
            href="/guide/emergency-services"
            className="inline-flex flex-col gap-1 text-sm sm:flex-row sm:items-baseline sm:gap-3"
          >
            <span className="font-medium">
              If someone is not safe right now
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline">
              Open emergency services
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </div>
      </div>

      <section className="home-hero border-b border-border/70">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            {paper.eyebrow}
          </p>
          <h1 className="mt-2 max-w-2xl font-heading text-3xl leading-[1.15] tracking-tight text-foreground sm:text-4xl">
            Our college-age young adult is having a mental health crisis
          </h1>
          <p className="mt-3 max-w-2xl text-foreground/80">
            Whether you’re new to mental health crises or have been navigating the system for years, this site offers a roadmap of key resources and considerations for supporting a young adult, ages 18–25.
          </p>
          <p className="mt-3 max-w-2xl text-foreground/80">
            Families, friends, and others who are supporting a young adult: choose a topic below, search for what you need, or explore the references to learn more.
          </p>
          <p className="mt-3">
  <Link
    href="/about"
    className="text-sm font-small text-primary text-right underline-offset-4 hover:underline"
  >
    Read more about this guide
  </Link>
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
            return (
              <li key={item.slug}>
                <Link
                  href={`/guide/${item.slug}`}
                  className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 text-foreground transition-all hover:-translate-y-0.5 hover:shadow-md visited:border-border/80 visited:text-muted-foreground"
                >
                  <span className="font-heading text-lg font-semibold tracking-tight">
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
    </div>
  );
}