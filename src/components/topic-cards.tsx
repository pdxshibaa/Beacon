import Link from "next/link";

import { firstSentence, topicSections } from "@/lib/paper";
import { cn } from "@/lib/utils";

export function TopicCards({ compact = false }: { compact?: boolean }) {
  return (
    <ul
      className={cn(
        "grid gap-3",
        compact ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 xl:grid-cols-3"
      )}
    >
      {topicSections.map((section) => (
        <li key={section.slug}>
          <Link
            href={`/guide/${section.slug}`}
            className={cn(
              "group flex h-full flex-col rounded-2xl border border-border bg-card shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              compact ? "px-4 py-3" : "p-5"
            )}
          >
            <span
              className={cn(
                "font-heading leading-snug font-semibold tracking-tight text-foreground group-hover:text-primary",
                compact ? "text-base" : "text-lg"
              )}
            >
              {section.title}
            </span>
            {compact ? null : (
              <span className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {firstSentence(section.html)}
              </span>
            )}
            {compact ? null : (
              <span className="mt-auto pt-4 text-sm font-medium text-primary">
                Open topic
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
