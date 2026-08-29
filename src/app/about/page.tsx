import type { Metadata } from "next";
import Link from "next/link";

import { GuideAbout } from "@/components/guide-about";

export const metadata: Metadata = {
  title: "About this guide",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="underline-offset-4 hover:underline">
          Back to start
        </Link>
      </p>
      <h1 className="mt-4 font-heading text-3xl tracking-tight text-foreground sm:text-4xl">
        About this guide
      </h1>
      <div className="mt-8">
        <GuideAbout />
      </div>
    </div>
  );
}
