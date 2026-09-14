import type { ReactNode } from "react";

export function markLimitedEngagement(text: string): ReactNode {
  const parts = text.split(/(limited engagement)/gi);
  if (parts.length === 1) {
    return text;
  }
  return parts.map((part, index) =>
    /^limited engagement$/i.test(part) ? (
      <span key={`${part}-${index}`} className="limited-engagement">
        {part}
      </span>
    ) : (
      part
    )
  );
}
