import type { PagesConfig } from "../types";

export const PAGES: PagesConfig = {
    home: {
        title: "About",
        subtitle: "",
        isActive: true,
    },
    blog: {
        title: "Blog",
        subtitle: "Notes from the bench, terminal, and field.",
        isActive: true,
    },
    publications: {
        title: "Publications",
        subtitle: "Research on environmental and host-associated microbiomes, sequencing, and diagnostics.",
        isActive: true,
    },
    talks: {
        title: "Talks & Presentations",
        subtitle: "Selected conference talks and research presentations.",
        isActive: true,
    },
    projects: {
        title: "Research Projects",
        subtitle: "Interactive microbiome explorations from rivers to the International Space Station.",
        isActive: true,
    },
    teaching: {
        title: "Teaching Experience",
        subtitle: "Laboratory and classroom instruction in anatomy, physiology, and bioinformatics.",
        isActive: true,
    },
    tags: {
        title: "Tags",
        subtitle: "Explore research, writing, and projects by topic.",
        isActive: true,
    },
    cv: {
        title: "Curriculum Vitae",
        subtitle: "Academic and professional history.",
        isActive: true,
    },
};
