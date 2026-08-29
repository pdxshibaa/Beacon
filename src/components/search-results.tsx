import Link from "next/link";

import { searchGuide } from "@/lib/search";

function highlight(text: string, query: string) {
  const terms = query
    .trim()
    .split(/\s+/)
    .filter((term) => term.length > 1);
  if (!terms.length) {
    return text;
  }
  const escaped = terms.map((term) =>
    term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const pattern = new RegExp(`(${escaped.join("|")})`, "ig");
  const parts = text.split(pattern);
  return parts.map((part, index) => {
    const isMatch = terms.some(
      (term) => term.toLowerCase() === part.toLowerCase()
    );
    return isMatch ? (
      <mark
        key={`${part}-${index}`}
        className="rounded-sm bg-accent px-0.5 text-foreground"
      >
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    );
  });
}

const SUGGESTIONS = ["HIPAA", "FERPA", "988", "911", "NAMI", "hospitalization"];

export function SearchResults({ query }: { query: string }) {
  const trimmed = query.trim();
  const hits = trimmed ? searchGuide(trimmed, 20) : [];

  if (!trimmed) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Type a word or phrase. Try one of these:
        </p>
        <ul className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((term) => (
            <li key={term}>
              <Link
                href={`/search?q=${encodeURIComponent(term)}`}
                className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-sm hover:border-primary/40 hover:shadow-sm"
              >
                {term}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!hits.length) {
    return (
      <div className="space-y-3">
        <p className="text-muted-foreground">
          No matches for “{trimmed}”. Check the spelling, try a shorter word, or
          browse topics from the home page.
        </p>
        <p>
          <Link href="/" className="text-primary underline underline-offset-4">
            Back to start
          </Link>
        </p>
      </div>
    );
  }

  return (
    <ol className="space-y-3">
      {hits.map((hit) => (
        <li key={hit.id}>
          <Link
            href={hit.href}
            className="block rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <p className="font-heading text-lg font-semibold tracking-tight text-foreground">
              {hit.heading}
            </p>
            {hit.heading !== hit.sectionTitle ? (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {hit.sectionTitle}
              </p>
            ) : null}
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              {highlight(hit.snippet, trimmed)}
            </p>
          </Link>
        </li>
      ))}
    </ol>
  );
}
