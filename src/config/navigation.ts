import type { NavLink } from "../types";

export const NAV_LINKS: NavLink[] = [
    { href: "/", label: "About", isActive: true },
    { href: "/publications", label: "Publications", isActive: true },
    { href: "/talks", label: "Talks", isActive: true },
    { href: "/teaching", label: "Teaching", isActive: true },
    { href: "/projects", label: "Research", isActive: true },
    { href: "/posts", label: "Blog", isActive: true },
    { href: "/tags", label: "Tags", isActive: false },
    { href: "/cv", label: "CV", isActive: true },
];
