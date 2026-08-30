import type { Metadata } from "next";
import Link from "next/link";

import { FeedbackForm } from "@/components/feedback-form";

export const metadata: Metadata = {
  title: "Help improve Project Beacon",
};

const NOTES = [
  "Do not use Project Beacon as a crisis line or a source of personal or medical advice.",
  "Do not email to ask for help with an immediate crisis or for advice about a specific situation.",
  "Do not send names, medical or legal records, or a detailed account of your family’s situation. This is not a confidential email, and I cannot maintain confidential information. You do not need to share identifying or private details for your feedback to be useful.",
  "Please keep your feedback focused on the site, its information, and your experience using it. Thank you for helping make Project Beacon better.",
];

const TOPICS = [
  "A page or topic that was confusing or difficult to find",
  "Something important that is missing",
  "An error or outdated information",
  "Information that doesn’t match your experience",
  "A resource or perspective that should be included",
  "Anything else that could make the site more useful",
];

export default function FeedbackPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="underline-offset-4 hover:underline">
          Back to start
        </Link>
      </p>
      <h1 className="mt-4 font-heading text-3xl tracking-tight text-foreground sm:text-4xl">
        Help Improve Project Beacon
      </h1>
      <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground/90">
        <p>
          Project Beacon is a public draft and is still being revised. If
          you’ve used the site, your feedback can help make it more useful and
          easier to navigate for the people who need it.
        </p>
        <aside className="rounded-2xl border border-primary/25 bg-primary/8 px-4 py-4 sm:px-5 sm:py-5">
          <p className="text-xs font-medium tracking-wide text-primary uppercase">
            Notes
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {NOTES.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </aside>
        <p>Please email us about any of the following feedback:</p>
        <ul className="list-disc space-y-2 pl-5">
          {TOPICS.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </div>
      <FeedbackForm />
    </div>
  );
}
