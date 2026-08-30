import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ContentsNav } from "@/components/contents-nav";
import { GuideHighlight } from "@/components/guide-highlight";
import { GuideTopicList } from "@/components/guide-topic-list";
import { PaperBody } from "@/components/paper-body";
import { SectionPager } from "@/components/section-pager";
import {
  CARD_TOPIC_SLUGS,
  GLANCE_CARD_SLUGS,
  getHospitalizationLayout,
  splitGuideTopics,
} from "@/lib/guide-topics";
import { getNeighbors, getSection, paper } from "@/lib/paper";

export function generateStaticParams() {
  return [
    ...paper.sections.map((section) => ({ slug: section.slug })),
    { slug: "conclusion" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "introduction") {
    return { title: "Start here" };
  }
  const section = getSection(slug);
  if (!section) {
    return { title: "Not found" };
  }
  return { title: section.title };
}

export default async function GuideSectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "introduction") {
    redirect("/");
  }
  if (slug === "conclusion") {
    redirect("/guide/closing-thoughts");
  }
  const section = getSection(slug);
  if (!section) {
    notFound();
  }
  const { previous, next } = getNeighbors(slug);
  const topicSplit = CARD_TOPIC_SLUGS.has(section.slug)
    ? splitGuideTopics(section.html, section.slug)
    : null;
  const hospitalizationLayout =
    section.slug === "hospitalization"
      ? getHospitalizationLayout(section.html)
      : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 sm:py-12">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-8">
          <ContentsNav currentSlug={section.slug} />
        </div>
      </aside>
      <article className="min-w-0 max-w-2xl flex-1">
        <h1 className="font-heading text-3xl leading-tight tracking-tight text-foreground sm:text-4xl">
          {section.title}
        </h1>
        {hospitalizationLayout ? (
          <>
            {hospitalizationLayout.caregiver ? (
              <GuideHighlight heading={hospitalizationLayout.caregiver} />
            ) : null}
            <PaperBody html={hospitalizationLayout.remainderHtml} />
            {hospitalizationLayout.safety ? (
              <GuideHighlight heading={hospitalizationLayout.safety} />
            ) : null}
          </>
        ) : topicSplit && topicSplit.topics.length > 0 ? (
          <>
            {topicSplit.introHtml ? (
              <div
                className="paper-body !mt-3 text-lg text-foreground/80"
                dangerouslySetInnerHTML={{ __html: topicSplit.introHtml }}
              />
            ) : null}
            <GuideTopicList
              topics={topicSplit.topics}
              variant={
                GLANCE_CARD_SLUGS.has(section.slug) ? "glance" : "expand"
              }
            />
            {topicSplit.outroHtml ? (
              <div
                className="paper-body"
                dangerouslySetInnerHTML={{ __html: topicSplit.outroHtml }}
              />
            ) : null}
          </>
        ) : (
          <PaperBody html={section.html} />
        )}
        <SectionPager previous={previous} next={next} />
      </article>
    </div>
  );
}
