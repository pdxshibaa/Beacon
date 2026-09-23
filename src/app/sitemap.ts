import type { MetadataRoute } from "next";

import { topicSections } from "@/lib/paper";
import { site } from "@/lib/site";

export const dynamic = "force-static";

function pageUrl(path: string): string {
  const origin = site.url.replace(/\/$/, "");
  if (path === "/") {
    return `${origin}/`;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalized.replace(/\/?$/, "/")}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/about/", "/feedback/", ...topicSections.map(
    (section) => `/guide/${section.slug}/`
  )];

  return pages.map((path) => ({ url: pageUrl(path) }));
}
