import type { SocialLink } from "../types";

export const SOCIALS: SocialLink[] = [
    {
        name: "Github",
        href: "https://github.com/microbemarsh",
        linkTitle: `Austin Marshall on GitHub`,
        isActive: true,
    },
    {
        name: "Mail",
        href: "mailto:ag.marshall@ufl.edu",
        linkTitle: `Email Austin Marshall`,
        isActive: true,
    },
    {
        name: "LinkedIn",
        href: "https://www.linkedin.com/in/austin-marshall-006038193/",
        linkTitle: `Austin Marshall on LinkedIn`,
        isActive: true,
    },
    {
        name: "Twitter",
        href: "https://twitter.com/microbemarsh/",
        linkTitle: `Austin Marshall on X / Twitter`,
        isActive: true,
    },
];

export const SOCIAL_ICONS: Record<string, string> = {
    Github: "Github",
    Mail: "Mail",
    Linkedin: "LinkedIn",
    LinkedIn: "LinkedIn",
    Twitter: "Twitter",
    "Google Scholar": "GoogleScholar",
    ORCID: "ORCID",
    RSS: "RSS",
};
