import { getIntroContent } from "@/lib/intro";
import { paper } from "@/lib/paper";

function Html({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return <p className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function GuideAbout() {
  const intro = getIntroContent();

  if (!intro) {
    return (
      <p className="text-muted-foreground">
        About text for this guide is not available.
      </p>
    );
  }

  return (
    <div className="space-y-5 text-base leading-relaxed text-foreground/90">
      <Html html={intro.leadHtml} />
      <div>
        <h2 className="font-heading text-xl tracking-tight text-foreground">
          Why this is hard
        </h2>
        <p className="mt-2">{intro.factorLead}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
          {intro.factors.map((factor) => (
            <li key={factor.label}>{factor.text}</li>
          ))}
        </ul>
      </div>
      <Html html={intro.purposeHtml} />
      <Html html={intro.sourceHtml} />
      <div className="rounded-2xl border border-primary/20 bg-card p-5">
        <p className="text-xs font-medium tracking-wide text-primary uppercase">
          What we mean by a crisis
        </p>
        <Html html={intro.crisisHtml} className="mt-3" />
      </div>
      <Html html={intro.scopeHtml} />
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Limited engagement
        </p>
        <Html html={intro.limitedHtml} className="mt-3" />
      </div>
      <Html
        html={intro.disclaimerHtml}
        className="text-sm text-muted-foreground"
      />
      <p className="text-sm text-muted-foreground">{paper.authors}</p>
    </div>
  );
}
