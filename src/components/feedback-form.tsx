"use client";

import { FormEvent } from "react";

import { site } from "@/lib/site";

export function FeedbackForm() {
  const email = site.feedbackEmail.trim();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) {
      return;
    }
    const data = new FormData(event.currentTarget);
    const page = String(data.get("page") ?? "").trim();
    const notes = String(data.get("notes") ?? "").trim();
    if (!notes) {
      return;
    }
    const body = [
      page ? `Page or topic: ${page}` : "",
      notes,
    ]
      .filter(Boolean)
      .join("\n\n");
    const href = `mailto:${email}?subject=${encodeURIComponent("Help improve Project Beacon")}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  if (!email) {
    return null;
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <div>
        <label htmlFor="feedback-page" className="block text-sm font-medium">
          Page or topic (optional)
        </label>
        <input
          id="feedback-page"
          name="page"
          type="text"
          autoComplete="off"
          className="mt-1.5 h-10 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <div>
        <label htmlFor="feedback-notes" className="block text-sm font-medium">
          Your notes
        </label>
        <textarea
          id="feedback-notes"
          name="notes"
          required
          rows={8}
          className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <button
        type="submit"
        className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Email your feedback
      </button>
      <p className="text-sm text-muted-foreground">
        If the button does not open your email, please send your feedback to{" "}
        <a
          className="text-primary underline underline-offset-4"
          href={`mailto:${email}?subject=${encodeURIComponent("Help improve Project Beacon")}`}
        >
          {email}
        </a>
        .
      </p>
    </form>
  );
}
