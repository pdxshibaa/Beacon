export function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|h[1-6]|li|tr|div)>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function htmlHeadingId(html: string): string | undefined {
  const match = html.match(/<a[^>]*id="([^"]+)"[^>]*>/i);
  return match?.[1];
}

export function htmlHeadingText(html: string): string {
  return htmlToText(html);
}
