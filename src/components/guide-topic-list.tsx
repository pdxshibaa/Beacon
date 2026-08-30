"use client";

import { useEffect } from "react";
import { ChevronDown } from "lucide-react";

import type { GuideTopic } from "@/lib/guide-topics";

export function GuideTopicList({ topics }: { topics: GuideTopic[] }) {
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

  return (
    <div className="mt-6 space-y-3">
      {topics.map((topic) => (
        <details
          key={topic.id}
          id={topic.id}
          className="group scroll-mt-8 rounded-2xl border border-border bg-card shadow-sm open:border-primary/30 open:shadow-md"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
            <span>
              <span className="block font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {topic.title}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                {topic.preview}
              </span>
            </span>
            <ChevronDown
              aria-hidden="true"
              className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
            />
          </summary>
          <div
            className="paper-body !mt-0 border-t border-border/70 px-4 pt-3 pb-4 sm:px-5 sm:pb-5 [&_p:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: topic.bodyHtml }}
          />
        </details>
      ))}
    </div>
  );
}
