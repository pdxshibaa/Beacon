import Link from "next/link";

import { ContentsNav } from "@/components/contents-nav";
import { SearchBox } from "@/components/search-box";
import { paper } from "@/lib/paper";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-border/80 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-heading text-xl tracking-tight text-foreground"
        >
          <img
            src="/images/lighthouse.webp"
            alt=""
            width={64}
            height={64}
            className="size-8 rounded-md object-cover"
            aria-hidden="true"
          />
          {site.name}
        </Link>
        <div className="order-3 w-full sm:order-2 sm:min-w-[16rem] sm:flex-1">
          <SearchBox slashShortcut />
        </div>
        <Link
          href="/#topics"
          className="order-2 ml-auto hidden text-sm font-medium text-foreground/80 hover:text-foreground lg:order-3 lg:inline"
        >
          Topics
        </Link>
        <details className="relative order-2 ml-auto sm:order-3 lg:hidden">
          <summary className="cursor-pointer list-none rounded-lg border border-border px-3 py-1.5 text-sm font-medium marker:content-none">
            Topics
          </summary>
          <div className="absolute right-0 z-40 mt-2 max-h-[70vh] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-border bg-card p-4 shadow-lg">
            <ContentsNav />
          </div>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/80">
      <div className="mx-auto max-w-6xl space-y-2 px-4 py-6 text-sm text-muted-foreground sm:px-6">
        <p>{paper.draftNotice}</p>
        <p>{site.codeLicense}</p>
        <p>{site.contentLicense}</p>
        <p>{site.contentShare}</p>
      </div>
    </footer>
  );
}
