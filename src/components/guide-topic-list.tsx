"use client";

import { useEffect } from "react";
import { ChevronDown } from "lucide-react";

import type { GuideTopic } from "@/lib/guide-topics";
import { cn } from "@/lib/utils";

function TopicBanner({ topic }: { topic: GuideTopic }) {
  return (
    <section
      id={topic.id}
      className="scroll-mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 rounded-xl border border-border bg-card px-4 py-2.5 shadow-sm sm:px-5"
    >
      <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
        {topic.title}
      </h2>
      {topic.bodyHtml ? (
        <div
          className="paper-body !mt-0 min-w-0 flex-1 text-sm leading-relaxed [&_p]:mb-0 [&_p]:inline"
          dangerouslySetInnerHTML={{ __html: topic.bodyHtml }}
        />
      ) : null}
    </section>
  );
}

function TopicGlance({
  topic,
  spacious = false,
}: {
  topic: GuideTopic;
  spacious?: boolean;
}) {
  return (
    <section
      id={topic.id}
      className="scroll-mt-8 rounded-2xl border border-border bg-card px-4 py-4 shadow-sm sm:px-5"
    >
      <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {topic.title}
      </h2>
      {topic.bodyHtml ? (
        <div
          className={cn(
            "paper-body !mt-2 leading-relaxed [&_p:last-child]:mb-0 [&_li:last-child]:mb-0",
            spacious
              ? "text-[1.0625rem] [&_li]:mb-3 [&_h5:first-child]:mt-0 [&_h5]:mt-5 [&_ul:last-child]:mb-0 [&_h5+ul_li]:mb-1"
              : "text-sm"
          )}
          dangerouslySetInnerHTML={{ __html: topic.bodyHtml }}
        />
      ) : null}
    </section>
  );
}

function TopicStatic({ topic }: { topic: GuideTopic }) {
  return (
    <section
      id={topic.id}
      className="scroll-mt-8 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm sm:px-5 sm:py-4"
    >
      <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {topic.title}
      </h3>
      {topic.preview ? (
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {topic.preview}
        </p>
      ) : null}
    </section>
  );
}

function TopicDetails({
  topic,
  nested = false,
}: {
  topic: GuideTopic;
  nested?: boolean;
}) {
  return (
    <details
      id={topic.id}
      className="group scroll-mt-8 rounded-2xl border border-border bg-card shadow-sm open:border-primary/30 open:shadow-md"
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
        <span>
          <span
            className={cn(
              "block font-heading font-semibold tracking-tight text-foreground",
              nested ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
            )}
          >
            {topic.title}
          </span>
          {topic.preview ? (
            <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
              {topic.preview}
            </span>
          ) : null}
        </span>
        <ChevronDown
          aria-hidden="true"
          className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
        />
      </summary>
      {topic.bodyHtml ? (
        <div
          className="paper-body !mt-0 border-t border-border/70 px-4 pt-3 pb-4 sm:px-5 sm:pb-5 [&_p:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: topic.bodyHtml }}
        />
      ) : null}
    </details>
  );
}

function TopicCard({ topic }: { topic: GuideTopic }) {
  if (topic.children?.length) {
    return (
      <section
        id={topic.id}
        className="scroll-mt-8 rounded-2xl border border-border bg-card px-4 py-4 shadow-sm sm:px-5"
      >
        <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {topic.title}
        </h2>
        {topic.preview ? (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {topic.preview}
          </p>
        ) : null}
        {topic.bodyHtml ? (
          <div
            className="paper-body !mt-2 text-sm [&_p:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: topic.bodyHtml }}
          />
        ) : null}
        <div className="mt-4 space-y-3">
          {topic.children.map((child) =>
            child.static ? (
              <TopicStatic key={child.id} topic={child} />
            ) : (
              <TopicDetails key={child.id} topic={child} nested />
            )
          )}
        </div>
      </section>
    );
  }

  return <TopicDetails topic={topic} />;
}

export function GuideTopicList({
  topics,
  variant = "expand",
}: {
  topics: GuideTopic[];
  variant?: "expand" | "glance" | "stack";
}) {
  useEffect(() => {
    function openFromHash() {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) {
        return;
      }
      const el = document.getElementById(id);
      if (el instanceof HTMLDetailsElement) {
        el.open = true;
      }
    }

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  if (variant === "stack") {
    return (
      <div className="mt-6 space-y-3">
        {topics.map((topic) => (
          <TopicGlance key={topic.id} topic={topic} spacious />
        ))}
      </div>
    );
  }

  if (variant === "glance") {
    const banners = topics.filter((topic) => topic.banner);
    const rest = topics.filter((topic) => !topic.banner);
    return (
      <div className="mt-6 space-y-3">
        {banners.map((topic) => (
          <TopicBanner key={topic.id} topic={topic} />
        ))}
        <div className="grid gap-3 sm:grid-cols-2">
          {rest.map((topic) => (
            <TopicGlance key={topic.id} topic={topic} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} />
      ))}
    </div>
  );
}
