import Link from "next/link";

import type { PaperSection } from "@/lib/paper";

export function SectionPager({
  previous,
  next,
}: {
  previous: PaperSection | null;
  next: PaperSection | null;
}) {
  return (
    <nav
      aria-label="Nearby topics"
      className="mt-12 grid gap-3 border-t border-border pt-6 sm:grid-cols-2"
    >
      {previous ? (
        <Link
          href={`/guide/${previous.slug}`}
          className="rounded-xl border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:shadow-sm"
        >
          <span className="block text-xs tracking-wide text-muted-foreground uppercase">
            Previous
          </span>
          <span className="mt-1 block font-medium text-foreground">
            {previous.title}
          </span>
        </Link>
      ) : (
        <Link
          href="/"
          className="rounded-xl border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:shadow-sm"
        >
          <span className="block text-xs tracking-wide text-muted-foreground uppercase">
            Previous
          </span>
          <span className="mt-1 block font-medium text-foreground">
            Start here
          </span>
        </Link>
      )}
      {next ? (
        <Link
          href={`/guide/${next.slug}`}
          className="rounded-xl border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:shadow-sm sm:text-right"
        >
          <span className="block text-xs tracking-wide text-muted-foreground uppercase">
            Next
          </span>
          <span className="mt-1 block font-medium text-foreground">
            {next.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
