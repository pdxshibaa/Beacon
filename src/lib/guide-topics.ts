import { htmlHeadingId, htmlHeadingText, htmlToText } from "@/lib/html-text";

export const CARD_TOPIC_SLUGS = new Set([
  "emergency-services",
  "continuing-care",
  "system-constraints",
  "ongoing-crisis",
  "campus-resources",
  "off-campus-resources",
  "complicating-factors",
  "planning",
]);

export const GLANCE_CARD_SLUGS = new Set([
  "campus-resources",
  "off-campus-resources",
]);

export const STACK_CARD_SLUGS = new Set(["planning"]);

export type GuideTopic = {
  id: string;
  title: string;
  bodyHtml: string;
  preview: string;
  children?: GuideTopic[];
  banner?: boolean;
  static?: boolean;
};

export type SplitGuideHtml = {
  introHtml: string;
  topics: GuideTopic[];
  outroHtml: string;
};

function normalizeText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s+([.!?])/g, "$1")
    .trim();
}

function leadSentence(html: string): string {
  const text = normalizeText(htmlToText(html));
  const match = text.match(/^[^.!?]+[.!?]+(?:["”'’])?/);
  return (match ? match[0] : text).trim();
}

function consumePreviewFromHtml(innerHtml: string, preview: string): string | null {
  const target = normalizeText(preview);
  if (!target) {
    return null;
  }
  for (let i = 1; i <= innerHtml.length; i++) {
    const text = normalizeText(htmlToText(innerHtml.slice(0, i)));
    if (text === target) {
      return innerHtml.slice(i);
    }
  }
  return null;
}

function restAfterPreview(bodyHtml: string, preview: string): string {
  const match = bodyHtml.match(/^(<p\b[^>]*>)(\s*)([\s\S]*)$/i);
  if (!match || !preview) {
    return bodyHtml;
  }
  const [, open, space, rest] = match;
  const close = rest.match(/<\/p>/i);
  if (!close || close.index === undefined) {
    return bodyHtml;
  }
  const leftoverInner = consumePreviewFromHtml(rest.slice(0, close.index), preview);
  if (leftoverInner === null) {
    return bodyHtml;
  }
  const afterP = rest.slice(close.index);
  const leftover = leftoverInner.replace(/^\s+/, "");
  if (!htmlToText(leftover)) {
    const remainder = afterP.replace(/^<\/p>\s*/i, "");
    return htmlToText(remainder) ? remainder : "";
  }
  return `${open}${space}${leftover}${afterP}`;
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

export type PulledHeading = {
  id: string;
  title: string;
  bodyHtml: string;
};

export function pullHeadingSection(
  html: string,
  titleMatch: RegExp
): { pulled: PulledHeading | null; remainderHtml: string } {
  const { introHtml, blocks } = splitByHeading(html, "h4");
  const index = blocks.findIndex((block) =>
    titleMatch.test(htmlHeadingText(block.headingHtml))
  );
  if (index < 0) {
    return { pulled: null, remainderHtml: html };
  }

  const block = blocks[index];
  const remainderHtml = [
    introHtml,
    ...blocks
      .filter((_, i) => i !== index)
      .map((item) => `${item.headingHtml}\n${item.bodyHtml}`),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    pulled: {
      id: htmlHeadingId(block.headingHtml) ?? htmlHeadingText(block.headingHtml),
      title: htmlHeadingText(block.headingHtml),
      bodyHtml: block.bodyHtml,
    },
    remainderHtml,
  };
}

export function pullParagraphContaining(
  html: string,
  needle: RegExp
): { pulledHtml: string | null; remainderHtml: string } {
  const match = [...html.matchAll(/<p\b[^>]*>[\s\S]*?<\/p>/gi)].find((item) =>
    needle.test(item[0])
  );
  if (!match || match.index === undefined) {
    return { pulledHtml: null, remainderHtml: html };
  }

  const remainderHtml = `${html.slice(0, match.index)}${html.slice(match.index + match[0].length)}`
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { pulledHtml: match[0], remainderHtml };
}

export function getHospitalizationLayout(html: string) {
  const caregiver = pullHeadingSection(
    html,
    /^Caregiver Input During Hospitalization$/i
  );
  const safety = pullParagraphContaining(
    caregiver.remainderHtml,
    /<strong>safety plan<\/strong>/i
  );

  return {
    caregiver: caregiver.pulled,
    safety: safety.pulledHtml
      ? {
          id: "safety-plan",
          title: "Safety plan",
          bodyHtml: safety.pulledHtml,
        }
      : null,
    remainderHtml: safety.remainderHtml,
  };
}

function fullBodyTopic(block: {
  headingHtml: string;
  bodyHtml: string;
}): GuideTopic {
  const title = htmlHeadingText(block.headingHtml).trim();
  return {
    id: htmlHeadingId(block.headingHtml) ?? slugFromTitle(title),
    title,
    preview: "",
    bodyHtml: block.bodyHtml,
  };
}

export function getCaregiverStrategiesLayout(html: string) {
  const { introHtml, blocks } = splitByHeading(html, "h4");
  const chartIndex = blocks.findIndex((block) =>
    /Communication Strategies/i.test(htmlHeadingText(block.headingHtml))
  );
  const chartBlock = chartIndex >= 0 ? blocks[chartIndex] : null;
  const rest = blocks.filter((_, index) => index !== chartIndex);

  return {
    introHtml,
    chartHtml: chartBlock
      ? `${chartBlock.headingHtml}\n${chartBlock.bodyHtml}`
      : "",
    topics: rest.map(fullBodyTopic),
  };
}

const WELLBEING_TOPIC_ORDER = [
  /^Resources$/i,
  /^Support\b/i,
  /^Burnout/i,
  /^What Fills Your Bucket/i,
  /^Limited Engagement Situations$/i,
];

export function getCaregiverWellbeingLayout(html: string) {
  const { introHtml, blocks } = splitByHeading(html, "h4");
  const used = new Set<number>();
  const topics: GuideTopic[] = [];

  for (const pattern of WELLBEING_TOPIC_ORDER) {
    const index = blocks.findIndex(
      (block, i) =>
        !used.has(i) && pattern.test(htmlHeadingText(block.headingHtml).trim())
    );
    if (index < 0) {
      continue;
    }
    used.add(index);
    topics.push(fullBodyTopic(blocks[index]));
  }

  blocks.forEach((block, index) => {
    if (!used.has(index)) {
      topics.push(fullBodyTopic(block));
    }
  });

  return { introHtml, topics };
}

function topicFromBlock(
  block: { headingHtml: string; bodyHtml: string },
  nestedTag?: "h5"
): GuideTopic {
  const title = htmlHeadingText(block.headingHtml);
  const id = htmlHeadingId(block.headingHtml) ?? slugFromTitle(title);

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
  if (slug === "ongoing-crisis") {
    return topics.map((topic) => {
      if (!/Communication/i.test(topic.title)) {
        return topic;
      }
      const { pulledHtml, remainderHtml } = pullParagraphContaining(
        topic.bodyHtml,
        /limited-engagement/i
      );
      if (!pulledHtml) {
        return topic;
      }
      return {
        ...topic,
        bodyHtml: `${remainderHtml}\n${pulledHtml}`.replace(/\n{3,}/g, "\n\n").trim(),
      };
    });
  }

  if (slug === "complicating-factors") {
    return topics.map((topic) => {
      const title = /^Daily Life Impacts$/i.test(topic.title)
        ? "Impact on Daily Life"
        : topic.title.trim();

      if (!topic.children?.length || !/^Treatment Complexity$/i.test(title)) {
        return { ...topic, title };
      }

      return {
        ...topic,
        title,
        children: topic.children.map((child) =>
          /^Insight\/Awareness$/i.test(child.title)
            ? { ...child, static: true }
            : child
        ),
      };
    });
  }

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
  if (slug === "campus-resources" || slug === "off-campus-resources" || slug === "planning") {
    const split = splitStrongTopics(html);
    if (slug === "off-campus-resources") {
      split.topics = split.topics.map((topic) =>
        /^911/.test(topic.title) ? { ...topic, banner: true } : topic
      );
    }
    return split;
  }

  const { introHtml, blocks } = splitByHeading(html, "h4");
  const topics = applyPageOptions(
    blocks.map((block) => topicFromBlock(block, "h5")),
    slug ?? ""
  );

  return { introHtml, topics, outroHtml: "" };
}

function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isStrongTitleParagraph(html: string): boolean {
  const trimmed = html.trim();
  if (!/^<p\b[^>]*>\s*<strong>/i.test(trimmed)) {
    return false;
  }
  const text = htmlToText(trimmed);
  return text.length > 0 && text.length < 100 && !/[.!?]./.test(text);
}

function isLinkOnlyParagraph(html: string): boolean {
  return /^<p\b[^>]*>\s*<a\b[\s\S]*<\/a>\s*<\/p>$/i.test(html.trim());
}

function splitStrongTopics(html: string): SplitGuideHtml {
  const blocks = [...html.matchAll(/<(p|ul|ol)\b[\s\S]*?<\/\1>/gi)].map(
    (match) => match[0]
  );
  const introParts: string[] = [];
  const topics: GuideTopic[] = [];
  const outroParts: string[] = [];
  let current: GuideTopic | null = null;
  let pastTitles = false;

  for (const block of blocks) {
    if (isStrongTitleParagraph(block)) {
      pastTitles = true;
      if (current) {
        topics.push(current);
      }
      const title = htmlHeadingText(block);
      current = {
        id: slugFromTitle(title),
        title,
        preview: "",
        bodyHtml: "",
      };
      continue;
    }
    if (!pastTitles) {
      introParts.push(block);
      continue;
    }
    if (current) {
      current.bodyHtml = current.bodyHtml
        ? `${current.bodyHtml}\n${block}`
        : block;
      continue;
    }
    outroParts.push(block);
  }
  if (current) {
    topics.push(current);
  }

  const last = topics.at(-1);
  if (last?.bodyHtml) {
    const paras = [...last.bodyHtml.matchAll(/<p\b[^>]*>[\s\S]*?<\/p>/gi)].map(
      (match) => match[0]
    );
    if (paras.length > 1) {
      const kept = [paras[0]];
      const trailing: string[] = [];
      for (const paragraph of paras.slice(1)) {
        if (isLinkOnlyParagraph(paragraph)) {
          kept.push(paragraph);
        } else {
          trailing.push(paragraph);
        }
      }
      last.bodyHtml = kept.join("\n");
      outroParts.unshift(...trailing);
    }
  }

  return {
    introHtml: introParts.join("\n"),
    topics,
    outroHtml: outroParts.join("\n"),
  };
}
