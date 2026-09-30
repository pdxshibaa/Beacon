import Link from "next/link";

import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-3xl tracking-tight">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        That page is not part of {site.name}.
      </p>
      <p className="mt-6">
        <Link href="/" className="underline underline-offset-4">
          Back to {site.name}
        </Link>
      </p>
    </div>
  );
}
