# Beacon

How to respond to a mental health crisis. Geared for parents and caregivers of college-aged young adults (roughly ages 18–25). Strategies that may help families approach with more clarity, drawn from the collective lived experience of parents, caregivers, community members, and professionals.

Live site: [https://beaconforfamilies.org](https://beaconforfamilies.org)

The homepage is a starting page: a short overview, then topics you can open in any order. Other topics have their own pages. Search is in the header and on the home page; try a term such as HIPAA.

The live guide is `src/content/paper.json`. Pages, search, and the topic list all read from that file. The original Word document is in `content/Responding-to-a-Mental-Health-Crisis.docx`; it is an archive copy, not what the site serves.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:43141](http://localhost:43141).

## Live site

The public site is [https://beaconforfamilies.org](https://beaconforfamilies.org). It is a static export, deployed from `main` to GitHub Pages.

In the GitHub repo: **Settings → Pages → Source: GitHub Actions**. Custom domain: `beaconforfamilies.org`.

## Licenses

- website code is shared under the MIT license
- website content is shared under Creative Commons (CC BY-NC 4.0)
- Anyone can share or adapt the content for non-commercial purposes only.
