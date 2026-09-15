import paperJson from "@/content/paper.json";
import { htmlToText } from "@/lib/html-text";

export type PaperSection = {
  slug: string;
  number: string;
  title: string;
  heading: string;
  html: string;
};

export type Paper = {
  eyebrow: string;
  title: string;
  subtitle: string;
  authors: string;
  year: string;
  draftNotice: string;
  sections: PaperSection[];
};

type PaperJson = Omit<Paper, "sections"> & {
  sections: Array<Omit<PaperSection, "html"> & { html: string | string[] }>;
};

function htmlFromJson(html: string | string[]): string {
  return (Array.isArray(html) ? html.join("\n") : html).trim();
}

const source = paperJson as PaperJson;

export const paper: Paper = {
  ...source,
  sections: source.sections.map((section) => ({
    ...section,
    html: htmlFromJson(section.html),
  })),
};

export const introduction = paper.sections.find(
  (section) => section.slug === "introduction"
);

export const topicSections = paper.sections.filter(
  (section) => section.slug !== "introduction"
);

export function getSection(slug: string): PaperSection | undefined {
  return paper.sections.find((section) => section.slug === slug);
}

export function firstSentence(html: string): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const match = text.match(/^[^.!?]+[.!?]/);
  const sentence = (match ? match[0] : text).trim();
  if (sentence.length <= 140) {
    return sentence;
  }
  return `${sentence.slice(0, 137).replace(/\s+\S*$/, "")}…`;
}

const META_DESCRIPTION_MAX = 160;

/** First paragraphs on a page, trimmed to a Google-length snippet. */
export function pageDescription(html: string): string {
  const paragraphs = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => htmlToText(match[1]))
    .filter(Boolean);
  const text = paragraphs.join(" ");
  if (!text) {
    return "";
  }
  if (text.length <= META_DESCRIPTION_MAX) {
    return text;
  }
  const truncated = text.slice(0, META_DESCRIPTION_MAX);
  const sentenceEnd = truncated.lastIndexOf(". ");
  if (sentenceEnd >= 80) {
    return truncated.slice(0, sentenceEnd + 1);
  }
  return `${truncated.replace(/\s+\S*$/, "")}…`;
}

export function getNeighbors(slug: string): {
  previous: PaperSection | null;
  next: PaperSection | null;
} {
  const index = topicSections.findIndex((section) => section.slug === slug);
  if (index < 0) {
    return { previous: null, next: null };
  }
  return {
    previous: index > 0 ? topicSections[index - 1] : null,
    next: index < topicSections.length - 1 ? topicSections[index + 1] : null,
  };
}
