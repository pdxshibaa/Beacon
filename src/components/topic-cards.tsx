import Link from "next/link";

import { firstSentence, topicSections } from "@/lib/paper";

export function TopicCards() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {topicSections.map((section) => (
        <li key={section.slug}>
          <Link
            href={`/guide/${section.slug}`}
            className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <span className="font-heading text-lg leading-snug font-semibold tracking-tight text-foreground group-hover:text-primary">
              {section.title}
            </span>
            <span className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {firstSentence(section.html)}
            </span>
            <span className="mt-auto pt-4 text-sm font-medium text-primary">
              Open topic
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
