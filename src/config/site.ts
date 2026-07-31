import type { SiteConfig, ThemeConfig, SettingsConfig, UmamiAnalyticsConfig, AnalyticsConfig } from "../types";

export const SITE: SiteConfig = {
    website: "https://microbemarsh.github.io/",
    author: "Austin Marshall",
    desc: "Microbiologist and bioinformatician applying long-read sequencing and computational workflows to environmental and host-associated microbiomes.",
    title: "Austin Marshall",
    ogImage: "/examples/preview.png",
    postPerPage: 5,
    favicon: "/assets/img/favicon/favicon-32x32.png",
    lang: "en",
};

export const THEME_CONFIG: ThemeConfig = {
    lightAndDark: true,
    themeLight: "light_default",
    themeDark: "dark_default",
};

export const SETTINGS: SettingsConfig = {
    showTagsInNavbar: true,
    showRSSInFooter: true,
    addDevToolsInProduction: false,
};

const umami: UmamiAnalyticsConfig = {
    websiteId: "", // e.g., 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
    src: "https://cloud.umami.is/script.js", // Default Umami cloud script URL
}

export const ANALYTICS: AnalyticsConfig = {
    // Google Analytics 4 Measurement ID (e.g., 'G-XXXXXXXXXX')
    ga4Id: "G-S0VXYTQ1T2",
    // Umami Analytics configuration
    umami: umami
};
