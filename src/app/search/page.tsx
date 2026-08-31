import type { Metadata } from "next";
import { Suspense } from "react";

import { SearchBox } from "@/components/search-box";
import { SearchView } from "./search-view";

export const metadata: Metadata = {
  title: "Search",
};

function SearchFallback() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-3">
          <h1 className="font-heading text-3xl tracking-tight">Search</h1>
          <SearchBox size="hero" />
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchView />
    </Suspense>
  );
}
