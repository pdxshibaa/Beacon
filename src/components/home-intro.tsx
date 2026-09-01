import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

import { SearchBox } from "@/components/search-box";
import { TopicCards } from "@/components/topic-cards";
import { getSection, paper } from "@/lib/paper";

const START_HERE = [
  {
    slug: "emergency-services",
    situation: "someone who isn't safe, but I don't know who to call",
  },
  {
    slug: "hospitalization",
    situation: "the ER or the hospital",
  },
  {
    slug: "continuing-care",
    situation: "figuring out next steps after a psychiatric hospitalization",
  },
  {
    slug: "system-constraints",
    situation: "school or clinicians who won't tell me anything",
  },
  {
    slug: "warning-signs",
    situation: "behavior that seems off, but isn't an emergency yet",
  },
] as const;

export function HomeIntro() {
  return (
    <div className="w-full">
      <div className="emergency-bar border-b">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-4 sm:px-6">
          <span className="font-medium">If someone is not safe right now</span>
          <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <a
              href="tel:911"
              className="inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline"
            >
              Call 911
              <Phone className="size-4" />
            </a>
            <span>or</span>
            <Link
              href="/guide/emergency-services"
              className="inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline"
            >
              Explore emergency services
              <ArrowRight className="size-4" />
            </Link>
          </span>
        </div>
      </div>

      <section className="home-hero border-b border-border/70">
        <div className="mx-auto flex max-w-6xl items-start gap-4 px-4 py-8 sm:gap-6 sm:px-6 sm:py-10">
          <div className="min-w-0 max-w-2xl flex-1">
            <p className="text-sm font-medium tracking-wide text-primary uppercase">
              {paper.eyebrow}
            </p>
            <h1 className="mt-2 font-heading text-3xl leading-[1.15] tracking-tight text-foreground sm:text-4xl">
              There is a lot to figure out. Let's start here.
            </h1>
            <p className="mt-3 text-foreground/80">
              Whether you’re new to mental health crises or have been navigating the system for years, this site gathers key resources and considerations for supporting a young adult, ages 18–25.
            </p>
            <p className="mt-3 text-foreground/80">
              Families, friends, and others who are supporting a young adult: start from a situation below, search for a word you already have, or browse every topic.
            </p>
            <p className="mt-3">
              <Link
                href="/about"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                Read more about this guide
              </Link>
              <span className="text-muted-foreground"> · </span>
              <Link
                href="/feedback"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                Help improve Project Beacon
              </Link>
            </p>
            <div className="mt-6 max-w-xl">
              <SearchBox size="hero" />
            </div>
          </div>
          <img
            src="/images/lighthouse.png"
            alt=""
            width={800}
            height={800}
            className="mt-1 aspect-square w-[4.75rem] shrink-0 self-start rounded-xl object-cover sm:w-28 md:w-36 lg:w-44"
            aria-hidden="true"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h2 className="font-heading text-xl tracking-tight text-foreground sm:text-2xl">
          I need help with ...
        </h2>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {START_HERE.map((item) => {
            const section = getSection(item.slug);
            if (!section) {
              return null;
            }
            return (
              <li key={item.slug}>
                <Link
                  href={`/guide/${item.slug}`}
                  className="flex flex-col gap-1 py-4 text-foreground transition-colors hover:text-primary sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <span className="font-heading text-lg font-semibold tracking-tight">
                    {item.situation}
                  </span>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {section.title}
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