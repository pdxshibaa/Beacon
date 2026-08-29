import { Brain, EyeOff, HeartHandshake, Lock, MapPin, type LucideIcon } from "lucide-react";

import { htmlToText } from "@/lib/html-text";
import { introduction } from "@/lib/paper";

export type IntroFactor = {
  label: string;
  text: string;
  icon: LucideIcon;
};

export type IntroContent = {
  leadHtml: string;
  factorLead: string;
  factors: IntroFactor[];
  purposeHtml: string;
  sourceHtml: string;
  disclaimerHtml: string;
  crisisHtml: string;
  scopeHtml: string;
  limitedHtml: string;
};

function innerParagraphs(html: string): string[] {
  return [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((match) =>
    match[1].trim()
  );
}

function sentencesFrom(html: string): string[] {
  const text = htmlToText(`<p>${html}</p>`);
  return (
    text.match(/[^.!?]+[.!?]+(?:\s|$)/g)?.map((sentence) => sentence.trim()) ??
    (text ? [text] : [])
  );
}

function factorMeta(sentence: string): Pick<IntroFactor, "label" | "icon"> {
  const lower = sentence.toLowerCase();
  if (lower.startsWith("distance")) {
    return { label: "Distance", icon: MapPin };
  }
  if (lower.startsWith("visibility")) {
    return { label: "Visibility", icon: EyeOff };
  }
  if (lower.startsWith("privacy")) {
    return { label: "Privacy laws", icon: Lock };
  }
  if (lower.includes("insight") || lower.includes("anosognosia")) {
    return { label: "Lack of insight", icon: Brain };
  }
  if (lower.startsWith("stigma")) {
    return { label: "Stigma", icon: HeartHandshake };
  }
  return {
    label: sentence.split(/\s+/).slice(0, 3).join(" "),
    icon: MapPin,
  };
}

export function getIntroContent(): IntroContent | null {
  const html = introduction?.html;
  if (!html) {
    return null;
  }
  const paragraphs = innerParagraphs(html);
  if (paragraphs.length < 8) {
    return null;
  }

  const factorSentences = sentencesFrom(paragraphs[1]);
  const factorLead = factorSentences[0] ?? "";
  const factors = factorSentences.slice(1).map((text) => ({
    text,
    ...factorMeta(text),
  }));

  return {
    leadHtml: paragraphs[0],
    factorLead,
    factors,
    purposeHtml: paragraphs[2],
    sourceHtml: paragraphs[3],
    disclaimerHtml: paragraphs[4],
    crisisHtml: paragraphs[5],
    scopeHtml: paragraphs[6],
    limitedHtml: paragraphs[7],
  };
}
