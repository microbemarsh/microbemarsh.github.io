#!/usr/bin/env node

import { readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ORCID_ID = process.env.ORCID_ID || "0000-0001-5749-1558";
const API_ROOT = "https://pub.orcid.org/v3.0";
const PUBLICATIONS_DIR = path.resolve("src/content/publications");
const GENERATED_PREFIX = "orcid-";
const INCLUDED_TYPES = new Set([
    "book",
    "book-chapter",
    "dissertation-thesis",
    "journal-article",
    "preprint",
    "report",
    "review",
    "working-paper",
]);

function valueAt(value) {
    return value?.value?.trim?.() || "";
}

function normalizeTitle(title) {
    return title
        .normalize("NFKD")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();
}

function normalizeDoi(value) {
    return value
        .trim()
        .replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "")
        .replace(/^doi:\s*/i, "")
        .toLowerCase();
}

function getDoi(work) {
    const ids = work["external-ids"]?.["external-id"] || [];
    const doi = ids.find((id) => id["external-id-type"]?.toLowerCase() === "doi");
    return doi ? normalizeDoi(doi["external-id-normalized"]?.value || doi["external-id-value"] || "") : "";
}

function getDate(work) {
    const publicationDate = work["publication-date"];
    const year = valueAt(publicationDate?.year);
    const month = valueAt(publicationDate?.month);
    const day = valueAt(publicationDate?.day);

    if (!year) return "";
    if (!month) return year;
    if (!day) return `${year}-${month.padStart(2, "0")}`;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function titleForType(type) {
    return type
        .split("-")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ");
}

function slugify(value) {
    return value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80)
        .replace(/-$/g, "");
}

function yamlString(value) {
    return JSON.stringify(value);
}

async function fetchOrcidJson(endpoint, attempt = 0) {
    const response = await fetch(`${API_ROOT}${endpoint}`, {
        headers: {
            Accept: "application/vnd.orcid+json",
            "User-Agent": "microbemarsh.github.io publication sync",
        },
    });

    if (!response.ok) {
        if ((response.status === 429 || response.status >= 500) && attempt < 3) {
            const retryAfter = Number(response.headers.get("retry-after"));
            const delayMs = Number.isFinite(retryAfter)
                ? retryAfter * 1_000
                : 1_000 * 2 ** attempt;
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            return fetchOrcidJson(endpoint, attempt + 1);
        }
        throw new Error(`ORCID request failed (${response.status} ${response.statusText}): ${endpoint}`);
    }

    return response.json();
}

async function getManualMetadata() {
    const manualDois = new Set();
    const manualTitles = new Set();
    const entries = await readdir(PUBLICATIONS_DIR, { withFileTypes: true });

    for (const entry of entries) {
        if (
            !entry.isFile() ||
            !entry.name.endsWith(".md") ||
            entry.name.startsWith(GENERATED_PREFIX)
        ) {
            continue;
        }

        const content = await readFile(path.join(PUBLICATIONS_DIR, entry.name), "utf8");
        const title = content.match(/^title:\s*["']?(.*?)["']?\s*$/m)?.[1];
        const explicitDoi = content.match(/^doi:\s*["']?(.*?)["']?\s*$/mi)?.[1];
        const doiUrl = content.match(/https?:\/\/(?:dx\.)?doi\.org\/([^"'\s)]+)/i)?.[1];

        if (title) manualTitles.add(normalizeTitle(title));
        if (explicitDoi) manualDois.add(normalizeDoi(explicitDoi));
        if (doiUrl) manualDois.add(normalizeDoi(doiUrl));
    }

    return { manualDois, manualTitles };
}

function chooseSummary(group) {
    return [...(group["work-summary"] || [])].sort(
        (a, b) => Number(b["display-index"] || 0) - Number(a["display-index"] || 0),
    )[0];
}

function renderMarkdown(work) {
    const title = valueAt(work.title?.title);
    const type = work.type || "other";
    const doi = getDoi(work);
    const externalUrl = doi ? `https://doi.org/${doi}` : valueAt(work.url);
    const contributors = (work.contributors?.contributor || [])
        .filter((contributor) => contributor["contributor-attributes"]?.["contributor-role"] !== "editor")
        .map((contributor) => valueAt(contributor["credit-name"]))
        .filter(Boolean);
    const authors = contributors.length ? contributors.join(", ") : "Austin Marshall";
    const journal = valueAt(work["journal-title"]) || titleForType(type);
    const date = getDate(work);
    const typeLabel = titleForType(type);

    const lines = [
        "---",
        `title: ${yamlString(title)}`,
        `author: ${yamlString(authors)}`,
    ];

    if (date) lines.push(`date: ${yamlString(date)}`);
    if (journal) lines.push(`journal: ${yamlString(journal)}`);
    if (externalUrl) lines.push(`external_url: ${yamlString(externalUrl)}`);
    if (doi) lines.push(`doi: ${yamlString(doi)}`);
    lines.push(`orcid_put_code: ${work["put-code"]}`);
    lines.push(`publication_type: ${yamlString(type)}`);
    lines.push("generated: true");
    lines.push(`description: ${yamlString(`${typeLabel} synchronized from Austin Marshall's ORCID record.`)}`);
    lines.push("tags:");
    lines.push(`  - ${yamlString(typeLabel)}`);
    lines.push("  - \"ORCID\"");
    lines.push("---", "");
    lines.push(
        externalUrl
            ? `[View this ${typeLabel.toLowerCase()}](${externalUrl}).`
            : `This ${typeLabel.toLowerCase()} is listed on [Austin Marshall's ORCID record](https://orcid.org/${ORCID_ID}).`,
    );
    lines.push("", `*Metadata automatically synchronized from [ORCID](https://orcid.org/${ORCID_ID}).*`, "");

    return lines.join("\n");
}

async function main() {
    if (!/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(ORCID_ID)) {
        throw new Error(`Invalid ORCID iD: ${ORCID_ID}`);
    }

    const [{ manualDois, manualTitles }, worksResponse] = await Promise.all([
        getManualMetadata(),
        fetchOrcidJson(`/${ORCID_ID}/works`),
    ]);

    const summaries = (worksResponse.group || [])
        .map(chooseSummary)
        .filter(Boolean)
        .filter((summary) => INCLUDED_TYPES.has(summary.type));

    const works = await Promise.all(
        summaries.map((summary) => fetchOrcidJson(`/${ORCID_ID}/work/${summary["put-code"]}`)),
    );

    const generated = [];
    const seenDois = new Set(manualDois);
    const seenTitles = new Set(manualTitles);
    const usedSlugs = new Set();

    for (const work of works) {
        const title = valueAt(work.title?.title);
        const normalizedTitle = normalizeTitle(title);
        const doi = getDoi(work);

        if (!title || (doi && seenDois.has(doi)) || seenTitles.has(normalizedTitle)) continue;

        if (doi) seenDois.add(doi);
        seenTitles.add(normalizedTitle);

        const baseSlug = slugify(title) || `orcid-${work["put-code"]}`;
        let slug = baseSlug;
        if (usedSlugs.has(slug)) slug = `${baseSlug}-${work["put-code"]}`;
        usedSlugs.add(slug);
        generated.push({ slug, markdown: renderMarkdown(work) });
    }

    const oldGeneratedFiles = (await readdir(PUBLICATIONS_DIR, { withFileTypes: true }))
        .filter(
            (entry) =>
                entry.isFile() &&
                entry.name.startsWith(GENERATED_PREFIX) &&
                entry.name.endsWith(".md"),
        )
        .map((entry) => rm(path.join(PUBLICATIONS_DIR, entry.name)));
    await Promise.all(oldGeneratedFiles);
    await Promise.all(
        generated.map(({ slug, markdown }) =>
            writeFile(path.join(PUBLICATIONS_DIR, `${GENERATED_PREFIX}${slug}.md`), markdown, "utf8"),
        ),
    );

    console.log(
        `ORCID sync complete: ${works.length} eligible works, ${generated.length} generated, ` +
            `${works.length - generated.length} already maintained manually.`,
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
