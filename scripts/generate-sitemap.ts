import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://teamfokus.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/fuer-mitarbeitende", changefreq: "monthly", priority: "0.9" },
  { path: "/fuer-arbeitgeber", changefreq: "monthly", priority: "0.9" },
  { path: "/fuer-betriebsrat", changefreq: "monthly", priority: "0.9" },
  { path: "/datenschutz", changefreq: "monthly", priority: "0.8" },
  { path: "/einfuehrung", changefreq: "monthly", priority: "0.8" },
  { path: "/demo/employee", changefreq: "monthly", priority: "0.7" },
  { path: "/demo/manager", changefreq: "monthly", priority: "0.7" },
  { path: "/waitlist", changefreq: "monthly", priority: "0.6" },
  { path: "/impressum", changefreq: "yearly", priority: "0.3" },
  { path: "/login", changefreq: "yearly", priority: "0.3" },
  { path: "/register", changefreq: "yearly", priority: "0.3" },
];

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ].filter(Boolean).join("\n")
  ),
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${entries.length} entries)`);
