import MiniSearch from "minisearch";

import {
  expandQuery,
  searchDocs,
  snippetAround,
  type SearchDoc,
} from "@/lib/search-docs";

export type SearchHit = SearchDoc & {
  score: number;
  snippet: string;
};

let index: MiniSearch<SearchDoc> | null = null;

function getIndex(): MiniSearch<SearchDoc> {
  if (!index) {
    index = new MiniSearch({
      fields: ["heading", "sectionTitle", "text", "keywords"],
      storeFields: [
        "href",
        "sectionSlug",
        "sectionTitle",
        "heading",
        "text",
        "keywords",
      ],
      searchOptions: {
        boost: { heading: 4, sectionTitle: 3, keywords: 2.5, text: 1 },
        fuzzy: 0.2,
        prefix: true,
        combineWith: "AND",
      },
    });
    index.addAll(searchDocs);
  }
  return index;
}

function uniqueByHref(hits: SearchHit[]): SearchHit[] {
  const seen = new Set<string>();
  const unique: SearchHit[] = [];
  for (const hit of hits) {
    if (seen.has(hit.href)) {
      continue;
    }
    seen.add(hit.href);
    unique.push(hit);
  }
  return unique;
}

export function searchGuide(query: string, limit = 12): SearchHit[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const mini = getIndex();
  const expanded = expandQuery(trimmed);
  const raw = mini.search(expanded, {
    fuzzy: 0.2,
    prefix: true,
    combineWith: "OR",
  });

  const hits: SearchHit[] = raw.map((result) => {
    const doc = searchDocs.find((item) => item.id === result.id);
    if (!doc) {
      throw new Error(`Missing search doc ${result.id}`);
    }
    return {
      ...doc,
      score: result.score,
      snippet: snippetAround(doc.text, trimmed),
    };
  });

  return uniqueByHref(hits).slice(0, limit);
}
