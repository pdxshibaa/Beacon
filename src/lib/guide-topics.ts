import { htmlHeadingId, htmlHeadingText, htmlToText } from "@/lib/html-text";

export const CARD_TOPIC_SLUGS = new Set([
  "emergency-services",
  "continuing-care",
  "system-constraints",
]);

export type GuideTopic = {
  id: string;
  title: string;
  bodyHtml: string;
  preview: string;
  children?: GuideTopic[];
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

function splitByHeading(html: string, tag: "h4" | "h5") {
  const parts = html
    .split(new RegExp(`(?=<${tag}\\b)`, "i"))
    .map((part) => part.trim())
    .filter(Boolean);
  const introParts: string[] = [];
  const blocks: { headingHtml: string; bodyHtml: string }[] = [];
  const headingRe = new RegExp(`^<${tag}\\b[^>]*>[\\s\\S]*?</${tag}>`, "i");

  for (const part of parts) {
    if (!new RegExp(`^<${tag}\\b`, "i").test(part)) {
      introParts.push(part);
      continue;
    }
    const headingMatch = part.match(headingRe);
    const headingHtml = headingMatch?.[0] ?? "";
    blocks.push({
      headingHtml,
      bodyHtml: part.slice(headingHtml.length).trim(),
    });
  }

  return { introHtml: introParts.join("\n"), blocks };
}

function topicFromBlock(
  block: { headingHtml: string; bodyHtml: string },
  nestedTag?: "h5"
): GuideTopic {
  const title = htmlHeadingText(block.headingHtml);
  const id = htmlHeadingId(block.headingHtml) ?? title;

  if (nestedTag) {
    const nested = splitByHeading(block.bodyHtml, nestedTag);
    if (nested.blocks.length > 0) {
      const preview = leadSentence(nested.introHtml);
      return {
        id,
        title,
        preview,
        bodyHtml: restAfterPreview(nested.introHtml, preview),
        children: nested.blocks.map((child) => topicFromBlock(child)),
      };
    }
  }

  const preview = leadSentence(block.bodyHtml);
  return {
    id,
    title,
    preview,
    bodyHtml: restAfterPreview(block.bodyHtml, preview),
  };
}

function applyPageOptions(topics: GuideTopic[], slug: string): GuideTopic[] {
  if (slug !== "system-constraints") {
    return topics;
  }

  return topics.map((topic) => {
    const title = /^Hospitalization$/i.test(topic.title)
      ? "Hospitalization (voluntary/involuntary)"
      : topic.title;

    if (!topic.children?.length || !/^Privacy$/i.test(topic.title)) {
      return { ...topic, title };
    }

    const hipaa = topic.children.find((child) => /^HIPAA$/i.test(child.title));
    const ferpa = topic.children.find((child) => /^FERPA$/i.test(child.title));
    const others = topic.children.filter(
      (child) => child !== hipaa && child !== ferpa
    );

    return {
      ...topic,
      title,
      children: [hipaa, ferpa, ...others].filter(
        (child): child is GuideTopic => Boolean(child)
      ),
    };
  });
}

export function splitGuideTopics(html: string, slug?: string): SplitGuideHtml {
  const { introHtml, blocks } = splitByHeading(html, "h4");
  const topics = applyPageOptions(
    blocks.map((block) => topicFromBlock(block, "h5")),
    slug ?? ""
  );

  return { introHtml, topics };
}
