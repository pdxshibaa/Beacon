import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

import { SearchBox } from "@/components/search-box";
import { TopicCards } from "@/components/topic-cards";
import { buttonVariants } from "@/components/ui/button";
import { getIntroContent } from "@/lib/intro";
import { paper } from "@/lib/paper";
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

export function HomeIntro() {
  const intro = getIntroContent();

  return (
    <div className="w-full">
      <section className="home-hero border-b border-border/70">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            {paper.eyebrow}
          </p>
          <h1 className="mt-3 max-w-3xl font-heading text-4xl leading-[1.12] tracking-tight text-foreground sm:text-5xl">
            Recognizing and responding to a mental health crisis
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-foreground/80 sm:text-xl">
            {paper.subtitle}
          </p>
          {intro ? (
            <Html
              html={intro.leadHtml}
              className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/85 sm:text-lg"
            />
          ) : null}
          <div className="mt-8 max-w-xl">
            <SearchBox size="hero" />
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/guide/emergency-services"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 justify-center px-4 no-underline"
              )}
            >
              <Phone className="size-4" />
              If someone is not safe
            </Link>
            <Link
              href="#topics"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 justify-center bg-card/80 px-4 no-underline"
              )}
            >
              Browse topics
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
            {paper.authors}
          </p>
        </div>
      </section>

      {intro ? (
        <>
          <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
            <h2 className="font-heading text-2xl tracking-tight text-foreground sm:text-3xl">
              Why this is hard
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              {intro.factorLead}
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {intro.factors.map((factor) => {
                const Icon = factor.icon;
                return (
                  <li
                    key={factor.label}
                    className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                  >
                    <Icon className="size-5 text-primary" aria-hidden />
                    <p className="mt-3 font-heading text-base font-semibold tracking-tight">
                      {factor.label}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {factor.text}
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="border-y border-border/70 bg-card/60">
            <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10">
              <div className="space-y-4 text-base leading-relaxed text-foreground/90">
                <h2 className="font-heading text-2xl tracking-tight text-foreground sm:text-3xl">
                  Who this is for
                </h2>
                <Html html={intro.purposeHtml} />
                <Html html={intro.sourceHtml} />
                <Html
                  html={intro.scopeHtml}
                  className="text-muted-foreground"
                />
              </div>
              <aside className="space-y-4">
                <div className="rounded-2xl border border-primary/20 bg-background p-5 shadow-sm">
                  <p className="text-xs font-medium tracking-wide text-primary uppercase">
                    What we mean by a crisis
                  </p>
                  <Html
                    html={intro.crisisHtml}
                    className="mt-3 text-sm leading-relaxed sm:text-base"
                  />
                </div>
                <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Look for this mark
                  </p>
                  <Html
                    html={intro.limitedHtml}
                    className="mt-3 text-sm leading-relaxed sm:text-base"
                  />
                </div>
              </aside>
            </div>
          </section>
        </>
      ) : null}

      <section
        id="topics"
        className="mx-auto max-w-6xl scroll-mt-8 px-4 py-12 sm:px-6 sm:py-16"
      >
        <h2 className="font-heading text-2xl tracking-tight text-foreground sm:text-3xl">
          Topics
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Open a topic when you need it. You do not have to read this in order.
        </p>
        <div className="mt-6">
          <TopicCards />
        </div>
        {intro ? (
          <Html
            html={intro.disclaimerHtml}
            className="mt-10 max-w-3xl rounded-2xl border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground"
          />
        ) : null}
      </section>
    </div>
  );
}
