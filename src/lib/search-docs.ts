import { paper } from "@/lib/paper";
import { htmlHeadingId, htmlHeadingText, htmlToText } from "@/lib/html-text";

export type SearchDoc = {
  id: string;
  href: string;
  sectionSlug: string;
  sectionTitle: string;
  heading: string;
  text: string;
  keywords: string;
};

/** Extra terms so common lookups still hit the right chunk. */
const SYNONYMS: Record<string, string[]> = {
  hipaa: [
    "HIPAA",
    "privacy",
    "PHI",
    "protected health information",
    "health records",
    "medical privacy",
  ],
  ferpa: [
    "FERPA",
    "school records",
    "education records",
    "college privacy",
    "student records",
  ],
  "988": ["988", "suicide hotline", "crisis line", "lifeline", "call 988"],
  "911": ["911", "emergency", "ambulance", "police emergency"],
  roi: [
    "ROI",
    "release of information",
    "consent form",
    "information release",
  ],
  pad: [
    "PAD",
    "MHAD",
    "psychiatric advance directive",
    "mental health advance directive",
  ],
  anosognosia: ["anosognosia", "lack of insight", "no insight", "unaware"],
  php: ["PHP", "partial hospitalization", "day program"],
  iop: ["IOP", "intensive outpatient"],
  nami: ["NAMI", "family support group", "family to family"],
  cit: ["CIT", "crisis intervention team"],
  "limited engagement": [
    "limited engagement",
    "refusing care",
    "not engaging",
    "won't talk",
  ],
  wellness: ["wellness check", "welfare check"],
};

function keywordsFor(text: string, heading: string): string {
  const haystack = `${heading} ${text}`.toLowerCase();
  const extra: string[] = [];
  for (const [key, terms] of Object.entries(SYNONYMS)) {
    if (haystack.includes(key) || terms.some((term) => haystack.toLowerCase().includes(term.toLowerCase()))) {
      extra.push(key, ...terms);
    }
  }
  return extra.join(" ");
}

function sectionHref(slug: string, fragment?: string): string {
  if (slug === "introduction") {
    return fragment ? `/#${fragment}` : "/";
  }
  return fragment ? `/guide/${slug}#${fragment}` : `/guide/${slug}`;
}

function splitBlocks(html: string): string[] {
  return html
    .split(/(?=<h[45]\b)/i)
    .map((block) => block.trim())
    .filter(Boolean);
}

export function buildSearchDocs(): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const section of paper.sections) {
    const blocks = splitBlocks(section.html);
    let part = 0;

    for (const block of blocks) {
      const isHeadingBlock = /^<h[45]\b/i.test(block);
      const headingMatch = block.match(/<h[45]\b[^>]*>[\s\S]*?<\/h[45]>/i);
      const headingHtml = headingMatch?.[0] ?? "";
      const heading = isHeadingBlock
        ? htmlHeadingText(headingHtml)
        : section.title;
      const fragment = isHeadingBlock ? htmlHeadingId(headingHtml) : undefined;
      const text = htmlToText(block);
      if (!text) {
        continue;
      }

      docs.push({
        id: `${section.slug}-${part}`,
        href: sectionHref(section.slug, fragment),
        sectionSlug: section.slug,
        sectionTitle: section.title,
        heading: heading || section.title,
        text,
        keywords: keywordsFor(text, heading || section.title),
      });
      part += 1;
    }
  }

  return docs;
}

export const searchDocs = buildSearchDocs();

export function expandQuery(query: string): string {
  const tokens = query.trim().split(/\s+/).filter(Boolean);
  const expanded = new Set<string>();
  for (const token of tokens) {
    expanded.add(token);
    const lower = token.toLowerCase();
    for (const [key, terms] of Object.entries(SYNONYMS)) {
      if (lower === key || terms.some((term) => term.toLowerCase() === lower)) {
        expanded.add(key);
        for (const term of terms) {
          expanded.add(term);
        }
      }
    }
  }
  return [...expanded].join(" ");
}

export function snippetAround(text: string, query: string, radius = 90): string {
  const haystack = text;
  const terms = query
    .trim()
    .split(/\s+/)
    .filter((term) => term.length > 1);
  let index = -1;
  let matched = "";
  for (const term of terms) {
    const found = haystack.toLowerCase().indexOf(term.toLowerCase());
    if (found >= 0) {
      index = found;
      matched = haystack.slice(found, found + term.length);
      break;
    }
  }
  if (index < 0) {
    const clipped = haystack.slice(0, radius * 2);
    return clipped.length < haystack.length ? `${clipped}…` : clipped;
  }
  const start = Math.max(0, index - radius);
  const end = Math.min(haystack.length, index + matched.length + radius);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < haystack.length ? "…" : "";
  return `${prefix}${haystack.slice(start, end)}${suffix}`;
}
