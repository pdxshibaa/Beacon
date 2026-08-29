import Link from "next/link";

import { topicSections } from "@/lib/paper";
import { cn } from "@/lib/utils";

export function ContentsNav({
  currentSlug,
  className,
}: {
  currentSlug?: string;
  className?: string;
}) {
  return (
    <nav aria-label="Topics" className={className}>
      <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Topics
      </p>
      <ol className="space-y-1.5 text-sm">
        <li>
          <Link
            href="/"
            className={cn(
              "block rounded-md px-2 py-1 leading-snug transition-colors hover:bg-muted hover:text-foreground",
              !currentSlug
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground"
            )}
          >
            Start here
          </Link>
        </li>
        {topicSections.map((section) => {
          const href = `/guide/${section.slug}`;
          const active = section.slug === currentSlug;
          return (
            <li key={section.slug}>
              <Link
                href={href}
                className={cn(
                  "block rounded-md px-2 py-1 leading-snug transition-colors hover:bg-muted hover:text-foreground",
                  active
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground"
                )}
                aria-current={active ? "page" : undefined}
              >
                {section.title}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
