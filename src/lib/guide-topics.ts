import { htmlHeadingId, htmlHeadingText, htmlToText } from "@/lib/html-text";

export const CARD_TOPIC_SLUGS = new Set([
  "emergency-services",
  "continuing-care",
]);

export type GuideTopic = {
  id: string;
  title: string;
  bodyHtml: string;
  preview: string;
};

export type SplitGuideHtml = {
  introHtml: string;
  topics: GuideTopic[];
};

function leadSentence(html: string): string {
  const text = htmlToText(html);
  const match = text.match(/^[^.!?]+[.!?]/);
  return (match ? match[0] : text).trim();
}

function restAfterPreview(bodyHtml: string, preview: string): string {
  const match = bodyHtml.match(/^(<p\b[^>]*>)(\s*)([\s\S]*)$/i);
  if (!match || !preview) {
    return bodyHtml;
  }
  const [, open, space, rest] = match;
  if (!rest.startsWith(preview)) {
    return bodyHtml;
  }
  const afterPreview = rest.slice(preview.length).replace(/^\s+/, "");
  if (!htmlToText(afterPreview)) {
    return bodyHtml;
  }
  return `${open}${space}${afterPreview}`;
}

export function splitGuideTopics(html: string): SplitGuideHtml {
  const parts = html
    .split(/(?=<h4\b)/i)
    .map((part) => part.trim())
    .filter(Boolean);

  const introParts: string[] = [];
  const topics: GuideTopic[] = [];

  for (const part of parts) {
    if (!/^<h4\b/i.test(part)) {
      introParts.push(part);
      continue;
    }

    const headingMatch = part.match(/^<h4\b[^>]*>[\s\S]*?<\/h4>/i);
    const headingHtml = headingMatch?.[0] ?? "";
    const fullBody = part.slice(headingHtml.length).trim();
    const title = htmlHeadingText(headingHtml);
    const id = htmlHeadingId(headingHtml) ?? title;
    const preview = leadSentence(fullBody);

    topics.push({
      id,
      title,
      bodyHtml: restAfterPreview(fullBody, preview),
      preview,
    });
  }

  return {
    introHtml: introParts.join("\n"),
    topics,
  };
}
