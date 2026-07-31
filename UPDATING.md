# Updating Austin's portfolio

The website content is stored in ordinary Markdown files under `src/content/`.

## Add a blog post

Create a file such as `src/content/posts/my-first-post.md`:

```md
---
title: "Hello world"
date: "2026-08-15"
description: "A one-sentence summary."
author: "Austin Marshall"
tags:
  - "Microbiome"
  - "Nanopore"
---

Eventually I'll add some writing here
```

## Add other content

- Publications: `src/content/publications/`
- Research projects: `src/content/projects/`
- Talks: `src/content/talks/`
- Teaching: `src/content/teaching/`
- Biography and research interests: `src/content/bio.md`
- Experience and education: `src/content/cv.md`

Place static downloads, images, and standalone HTML visualizations in `public/`.

## Publication updates from ORCID

Journal articles, preprints, books, chapters, theses, reports, reviews, and
working papers are synchronized from
[ORCID 0000-0001-5749-1558](https://orcid.org/0000-0001-5749-1558) every Monday.
The generated Markdown filenames begin with `orcid-` and are stored alongside
the other files in `src/content/publications/`.

Files directly inside `src/content/publications/` remain manually maintained.
When a manual file has the same DOI or title as an ORCID work, the manual file
wins, so its description, tags, image, and other custom text are preserved.
Conference posters are not imported into publications. Do not edit files whose
names begin with `orcid-`, because the next sync replaces them.

Run the sync locally at any time:

```bash
npm run sync:publications
```

The **Deploy to GitHub Pages** workflow can also be run manually from GitHub's
Actions tab. A manual run synchronizes ORCID before building and deploying.
