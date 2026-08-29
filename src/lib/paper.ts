import paperJson from "@/content/paper.json";

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

export const paper = paperJson as Paper;

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
