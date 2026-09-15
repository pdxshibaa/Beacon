/**
 * Google result snippets (and browser tab descriptions).
 *
 * Edit these strings anytime. They do not change the page a family sees —
 * only the short line under the title in search results.
 *
 * Aim for one or two sentences, about 150 characters. Use wording from the
 * page; do not add new advice.
 */
export const pageDescriptions = {
  home: "A guide for parents and caregivers of college-aged young adults (18–25) on mental health crises, 911 and 988, hospitalization, HIPAA and FERPA, and limited engagement.",
  about:
    "This guide was written for parents and caregivers of college-aged young adults (roughly ages 18–25) who want to learn how to respond to a mental health crisis.",
  search:
    "Search this guide for HIPAA, FERPA, 988, 911, hospitalization, limited engagement, and other topics.",
  feedback:
    "Share feedback about this guide. Project Beacon is not a crisis line or a source of personal or medical advice.",
  "warning-signs":
    "Early warning signs can be easy to miss at this age. Young adults may mask or minimize symptoms, or seem fine while struggling.",
  "emergency-services":
    "When to use 911, 988, and other emergency services if a young adult is not safe or in a mental health crisis.",
  "decision-tree":
    "An example decision tree of choices families may face when a young adult is in crisis. Every situation is different.",
  hospitalization:
    "What to expect during a psychiatric hospitalization, including privacy, releases of information, and how families can share information even when staff cannot share back.",
  "system-constraints":
    "How HIPAA, FERPA, and other legal limits affect what schools and clinicians can share with families during a mental health crisis.",
  "continuing-care":
    "Options for continuing mental health care after an ER visit or hospitalization, and what to ask the care team.",
  "ongoing-crisis":
    "Some mental health crises last longer than a single event. Communication, engagement, and safety over a longer period of instability.",
  "campus-resources":
    "Mental health resources on college campuses, including university police, counseling, and the Dean of Students office.",
  "off-campus-resources":
    "Off-campus resources for young adults who do not live on a college campus, including 911 and 988.",
  "complicating-factors":
    "Clinical complexity and other factors that can make a mental health crisis harder to navigate. Knowing they exist may reduce the emotional toll.",
  "caregiver-strategies":
    "Caregiver strategies for a young adult in crisis: be someone they can count on, with reasonable boundaries, rather than trying to fix or control.",
  "caregiver-wellbeing":
    "Routines and support that help caregivers sustain sleep, nutrition, medical care, and employment during a crisis.",
  planning:
    "Planning before, during, and after a crisis, including HIPAA and FERPA releases, emergency contacts, and local resources.",
  references:
    "Sources and links used in this guide, including 988, FERPA, and related crisis resources.",
} as const;

export type PageDescriptionKey = keyof typeof pageDescriptions;

export function descriptionFor(key: string): string | undefined {
  if (key in pageDescriptions) {
    return pageDescriptions[key as PageDescriptionKey];
  }
  return undefined;
}
