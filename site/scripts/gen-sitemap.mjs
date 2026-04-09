import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = resolve(__dirname, "../public");

const en = JSON.parse(readFileSync(resolve(pub, "openskill.en.json"), "utf-8"));
const zh = JSON.parse(readFileSync(resolve(pub, "openskill.zh.json"), "utf-8"));
const wf = JSON.parse(readFileSync(resolve(pub, "openskill.workflows.json"), "utf-8"));
const rc = JSON.parse(readFileSync(resolve(pub, "openskill.recipes.json"), "utf-8"));

const base = "https://openagenticos.github.io/OpenSkill";
const today = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: `${base}/`, changefreq: "weekly", priority: "1.0" },
  { loc: `${base}/en/`, changefreq: "weekly", priority: "0.9" },
  { loc: `${base}/zh/`, changefreq: "weekly", priority: "0.9" },
  { loc: `${base}/en/workflows/`, changefreq: "weekly", priority: "0.8" },
  { loc: `${base}/zh/workflows/`, changefreq: "weekly", priority: "0.8" },
  { loc: `${base}/en/recipes/`, changefreq: "weekly", priority: "0.8" },
  { loc: `${base}/zh/recipes/`, changefreq: "weekly", priority: "0.8" },
];

for (const s of en.skills) {
  urls.push({ loc: `${base}/en/skill/${s.id}/`, changefreq: "monthly", priority: "0.7" });
}
for (const s of zh.skills) {
  urls.push({ loc: `${base}/zh/skill/${s.id}/`, changefreq: "monthly", priority: "0.7" });
}

for (const w of wf.workflows) {
  const slug = w.id.replace("workflow/", "");
  urls.push({ loc: `${base}/en/workflow/${slug}/`, changefreq: "monthly", priority: "0.6" });
  urls.push({ loc: `${base}/zh/workflow/${slug}/`, changefreq: "monthly", priority: "0.6" });
}

for (const r of rc.recipes) {
  const slug = r.id.replace("recipe/", "");
  urls.push({ loc: `${base}/en/recipe/${slug}/`, changefreq: "monthly", priority: "0.6" });
  urls.push({ loc: `${base}/zh/recipe/${slug}/`, changefreq: "monthly", priority: "0.6" });
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
