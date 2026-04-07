import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = resolve(__dirname, "../public");

const en = JSON.parse(readFileSync(resolve(pub, "openskill.en.json"), "utf-8"));
const zh = JSON.parse(readFileSync(resolve(pub, "openskill.zh.json"), "utf-8"));

const base = "https://openagenticos.github.io/OpenSkill";
const today = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: `${base}/`, changefreq: "weekly", priority: "1.0" },
  { loc: `${base}/en/`, changefreq: "weekly", priority: "0.9" },
  { loc: `${base}/zh/`, changefreq: "weekly", priority: "0.9" },
];

for (const s of en.skills) {
  urls.push({ loc: `${base}/en/skill/${s.id}/`, changefreq: "monthly", priority: "0.7" });
}
for (const s of zh.skills) {
  urls.push({ loc: `${base}/zh/skill/${s.id}/`, changefreq: "monthly", priority: "0.7" });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

writeFileSync(resolve(pub, "sitemap.xml"), xml);
console.log(`Sitemap generated: ${urls.length} URLs`);
