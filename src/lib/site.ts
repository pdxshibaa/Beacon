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
  /** Google Form linked from the feedback page. */
  feedbackFormUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSegV3P1kB9VdA9vJVQ3lWSv9sIa-clAS9P1PmX_ojfxBzCnig/viewform",
  /** Google Search Console HTML tag verification. */
  googleSiteVerification: "WClE6R_w-lYqwERnVTYvIVrAvd6oV19C7kWJqRO1H3Y",
  limitedEngagementDefinition:
    "Limited Engagement refers to situations where a young adult is only partly engaging, inconsistently engaging, or refusing to engage with parents, providers, school supports, or some combination of these.",
} as const;
