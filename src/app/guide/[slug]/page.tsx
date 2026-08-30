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
  STACK_CARD_SLUGS,
  getHospitalizationLayout,
  getCaregiverStrategiesLayout,
  getCaregiverWellbeingLayout,
  getWarningSignsLayout,
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
  const warningSignsLayout =
    section.slug === "warning-signs"
      ? getWarningSignsLayout(section.html)
      : null;
  const hospitalizationLayout =
    section.slug === "hospitalization"
      ? getHospitalizationLayout(section.html)
      : null;
  const caregiverStrategiesLayout =
    section.slug === "caregiver-strategies"
      ? getCaregiverStrategiesLayout(section.html)
      : null;
  const caregiverWellbeingLayout =
    section.slug === "caregiver-wellbeing"
      ? getCaregiverWellbeingLayout(section.html)
      : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 sm:py-12">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-8">
          <ContentsNav currentSlug={section.slug} />
        </div>
      </aside>
      <article
        className={
          caregiverStrategiesLayout
            ? "min-w-0 max-w-5xl flex-1"
            : "min-w-0 max-w-2xl flex-1"
        }
      >
        <h1 className="font-heading text-3xl leading-tight tracking-tight text-foreground sm:text-4xl">
          {section.title}
        </h1>
        {warningSignsLayout ? (
          <>
            {warningSignsLayout.introHtml ? (
              <div
                className="paper-body !mt-3 text-lg text-foreground/80"
                dangerouslySetInnerHTML={{
                  __html: warningSignsLayout.introHtml,
                }}
              />
            ) : null}
            {warningSignsLayout.signs ? (
              <GuideTopicList
                topics={[warningSignsLayout.signs]}
                variant="stack"
              />
            ) : null}
            {warningSignsLayout.earlySupport ? (
              <GuideHighlight heading={warningSignsLayout.earlySupport} />
            ) : null}
          </>
        ) : hospitalizationLayout ? (
          <>
            {hospitalizationLayout.caregiver ? (
              <GuideHighlight heading={hospitalizationLayout.caregiver} />
            ) : null}
            <PaperBody html={hospitalizationLayout.remainderHtml} />
            {hospitalizationLayout.safety ? (
              <GuideHighlight heading={hospitalizationLayout.safety} />
            ) : null}
          </>
        ) : caregiverStrategiesLayout ? (
          <>
            <div className="guide-split">
              {caregiverStrategiesLayout.introHtml ? (
                <div
                  className="paper-body !mt-0 text-lg text-foreground/80"
                  dangerouslySetInnerHTML={{
                    __html: caregiverStrategiesLayout.introHtml,
                  }}
                />
              ) : null}
              {caregiverStrategiesLayout.chartHtml ? (
                <div
                  className="paper-body !mt-0 overflow-x-auto [&_h4:first-of-type]:mt-0 [&_table]:mt-3 [&_table]:mb-0 [&_table]:table-fixed"
                  dangerouslySetInnerHTML={{
                    __html: caregiverStrategiesLayout.chartHtml,
                  }}
                />
              ) : null}
            </div>
            <div className="max-w-2xl">
              <GuideTopicList
                topics={caregiverStrategiesLayout.topics}
                variant="stack"
              />
            </div>
          </>
        ) : caregiverWellbeingLayout ? (
          <>
            {caregiverWellbeingLayout.introHtml ? (
              <div
                className="paper-body !mt-3 text-lg text-foreground/80"
                dangerouslySetInnerHTML={{
                  __html: caregiverWellbeingLayout.introHtml,
                }}
              />
            ) : null}
            <GuideTopicList
              topics={caregiverWellbeingLayout.topics}
              variant="stack"
            />
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
                STACK_CARD_SLUGS.has(section.slug)
                  ? "stack"
                  : GLANCE_CARD_SLUGS.has(section.slug)
                    ? "glance"
                    : "expand"
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
