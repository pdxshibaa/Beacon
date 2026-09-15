import { pageDescriptions } from "@/content/page-descriptions";

/** Licensing lines from the Beacon GitHub README. */
export const site = {
  name: "Beacon",
  url: "https://beaconforfamilies.org",
  /** Homepage browser tab and Google result title. Uses the guide eyebrow. */
  homeTitle:
    "When a college-age young adult is having a mental health crisis",
  /** Homepage Google snippet. Edit in src/content/page-descriptions.ts. */
  description: pageDescriptions.home,
  codeLicense: "website code is shared under the MIT license",
  contentLicense:
    "website content is shared under Creative Commons (CC BY-NC 4.0)",
  contentShare:
    "Anyone can share or adapt the content for non-commercial purposes only.",
  /** Public address on the feedback page. Shown on the page and used for mailto. */
  feedbackEmail: "hello@beaconforfamilies.org",
  limitedEngagementDefinition:
    "Limited Engagement refers to situations where a young adult is only partly engaging, inconsistently engaging, or refusing to engage with parents, providers, school supports, or some combination of these.",
} as const;
