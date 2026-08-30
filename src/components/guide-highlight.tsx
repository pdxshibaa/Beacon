import type { PulledHeading } from "@/lib/guide-topics";

export function GuideHighlight({ heading }: { heading: PulledHeading }) {
  return (
    <aside className="mt-6 rounded-2xl border border-primary/25 bg-primary/8 px-4 py-4 sm:px-5 sm:py-5">
      <h2
        id={heading.id}
        className="scroll-mt-8 font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
      >
        {heading.title}
      </h2>
      <div
        className="paper-body !mt-3 text-[1.0625rem] leading-relaxed [&_p:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: heading.bodyHtml }}
      />
    </aside>
  );
}
