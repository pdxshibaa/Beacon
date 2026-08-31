"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { searchGuide, type SearchHit } from "@/lib/search";

function highlight(text: string, query: string) {
  const terms = query
    .trim()
    .split(/\s+/)
    .filter((term) => term.length > 1);
  if (!terms.length) {
    return text;
  }
  const escaped = terms.map((term) =>
    term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const pattern = new RegExp(`(${escaped.join("|")})`, "ig");
  const parts = text.split(pattern);
  return parts.map((part, index) => {
    const isMatch = terms.some(
      (term) => term.toLowerCase() === part.toLowerCase()
    );
    return isMatch ? (
      <mark key={`${part}-${index}`} className="rounded-sm bg-accent px-0.5">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    );
  });
}

export function SearchBox({
  size = "header",
  initialQuery = "",
  onSearch,
  slashShortcut = false,
}: {
  size?: "header" | "hero";
  initialQuery?: string;
  onSearch?: (query: string) => void;
  slashShortcut?: boolean;
}) {
  const router = useRouter();
  const inputId = useId();
  const listId = useId();
  const rootRef = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const hits = useMemo(() => searchGuide(query, 6), [query]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (!slashShortcut) {
        return;
      }
      if (
        event.key === "/" &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault();
        const input = rootRef.current?.querySelector("input");
        input?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [slashShortcut]);

  function goToHit(hit: SearchHit) {
    setOpen(false);
    router.push(hit.href);
  }

  return (
    <form
      ref={rootRef}
      action="/search/"
      method="get"
      role="search"
      className={cn("relative w-full", size === "hero" && "max-w-2xl")}
      onSubmit={(event) => {
        const next = query.trim();
        if (!next) {
          event.preventDefault();
          return;
        }
        setOpen(false);
        if (onSearch) {
          event.preventDefault();
          onSearch(next);
        }
      }}
    >
      <label htmlFor={inputId} className="sr-only">
        Search the guide
      </label>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        id={inputId}
        type="search"
        name="q"
        value={query}
        autoComplete="off"
        placeholder="Search, for example HIPAA"
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={open && query.trim().length > 0}
        className={cn(
          "w-full rounded-xl border border-border bg-card text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          size === "hero" ? "h-12 pl-10 pr-[5.5rem] text-base" : "h-9 pl-9 pr-16 text-sm"
        )}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (!open) {
            return;
          }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive((current) =>
              Math.min(current + 1, Math.max(hits.length - 1, 0))
            );
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((current) => Math.max(current - 1, 0));
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
      />
      <button
        type="submit"
        className={cn(
          "absolute top-1/2 right-1.5 -translate-y-1/2 rounded-lg font-medium",
          size === "hero"
            ? "bg-primary px-3 py-1.5 text-sm text-primary-foreground"
            : "px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
        )}
      >
        Search
      </button>
      {open && query.trim() ? (
        <div
          id={listId}
          role="listbox"
          className="absolute z-50 mt-2 max-h-[min(24rem,70vh)] w-full overflow-y-auto rounded-xl border border-border bg-card py-1 shadow-lg"
        >
          {hits.length ? (
            hits.map((hit, index) => (
              <button
                key={hit.id}
                type="button"
                role="option"
                aria-selected={index === active}
                className={cn(
                  "block w-full px-3 py-2 text-left text-sm",
                  index === active ? "bg-muted" : "hover:bg-muted/70"
                )}
                onMouseEnter={() => setActive(index)}
                onClick={() => goToHit(hit)}
              >
                <span className="font-medium text-foreground">
                  {hit.heading}
                </span>
                {hit.heading !== hit.sectionTitle ? (
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {hit.sectionTitle}
                  </span>
                ) : null}
                <span className="mt-1 block line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {highlight(hit.snippet, query)}
                </span>
              </button>
            ))
          ) : (
            <p className="px-3 py-3 text-sm text-muted-foreground">
              No matches for “{query.trim()}”. Try another word, or press Search
              for the full list.
            </p>
          )}
          <button
            type="submit"
            className="w-full border-t border-border px-3 py-2 text-left text-xs font-medium text-primary hover:bg-muted/70"
          >
            See all results for “{query.trim()}”
          </button>
        </div>
      ) : null}
    </form>
  );
}
