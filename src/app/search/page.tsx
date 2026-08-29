import type { Metadata } from "next";

import { SearchBox } from "@/components/search-box";
import { SearchResults } from "@/components/search-results";

export const metadata: Metadata = {
  title: "Search",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-3">
          <h1 className="font-heading text-3xl tracking-tight">Search</h1>
          <SearchBox size="hero" initialQuery={query} />
        </div>
        {query ? (
          <p className="text-sm text-muted-foreground">
            Results for “{query}”
          </p>
        ) : null}
        <SearchResults query={query} />
      </div>
    </div>
  );
}
