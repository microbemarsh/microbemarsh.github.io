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
