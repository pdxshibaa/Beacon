"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { site } from "@/lib/site";

type TipPlace = {
  top: number;
  left: number;
  width: number;
  flip: boolean;
};

function placeTip(el: HTMLElement): TipPlace {
  const rect = el.getBoundingClientRect();
  const width = Math.min(22 * 16, window.innerWidth - 24);
  let left = rect.left;
  if (left + width > window.innerWidth - 12) {
    left = window.innerWidth - 12 - width;
  }
  if (left < 12) {
    left = 12;
  }
  const flip = window.innerHeight - rect.bottom < 140;
  return {
    top: flip ? rect.top - 8 : rect.bottom + 8,
    left,
    width,
    flip,
  };
}

export function LimitedEngagementTips() {
  const definitionId = useId();
  const [tip, setTip] = useState<TipPlace | null>(null);

  useEffect(() => {
    function decorate() {
      document.querySelectorAll(".limited-engagement").forEach((node) => {
        if (!(node instanceof HTMLElement) || node.dataset.leReady) {
          return;
        }
        node.dataset.leReady = "true";
        if (!node.hasAttribute("tabindex")) {
          node.tabIndex = 0;
        }
        node.setAttribute("aria-describedby", definitionId);
      });
    }

    function fromEvent(event: Event) {
      const target = event.target;
      if (!(target instanceof Element)) {
        return null;
      }
      const match = target.closest(".limited-engagement");
      return match instanceof HTMLElement ? match : null;
    }

    function show(el: HTMLElement) {
      setTip(placeTip(el));
    }

    function hide() {
      setTip(null);
    }

    function onPointerOver(event: PointerEvent) {
      const el = fromEvent(event);
      if (el) {
        show(el);
      }
    }

    function onPointerOut(event: PointerEvent) {
      const current = fromEvent(event);
      const next =
        event.relatedTarget instanceof Element
          ? event.relatedTarget.closest(".limited-engagement")
          : null;
      if (current && current !== next) {
        hide();
      }
    }

    function onFocusIn(event: FocusEvent) {
      const el = fromEvent(event);
      if (el) {
        show(el);
      }
    }

    function onFocusOut(event: FocusEvent) {
      const current = fromEvent(event);
      const next =
        event.relatedTarget instanceof Element
          ? event.relatedTarget.closest(".limited-engagement")
          : null;
      if (current && current !== next) {
        hide();
      }
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        hide();
      }
    }

    function onScroll() {
      hide();
    }

    decorate();
    const observer = new MutationObserver(decorate);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);

    return () => {
      observer.disconnect();
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [definitionId]);

  return (
    <>
      <p id={definitionId} className="sr-only">
        Definition. {site.limitedEngagementDefinition}
      </p>
      {tip
        ? createPortal(
            <div
              role="tooltip"
              className="pointer-events-none fixed z-[80] max-w-sm rounded-xl border border-border bg-card px-3.5 py-3 text-foreground shadow-lg"
              style={{
                top: tip.top,
                left: tip.left,
                width: tip.width,
                transform: tip.flip ? "translateY(-100%)" : undefined,
              }}
            >
              <p className="text-xs font-medium tracking-wide text-primary uppercase">
                Definition
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
                {site.limitedEngagementDefinition}
              </p>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
