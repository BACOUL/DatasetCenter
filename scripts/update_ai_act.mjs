// scripts/update_ai_act.mjs
// EU AI Act dataset v1 — local consistency updater
// - Recompute SHA-256 of full_text for each article JSON
// - Ensure full_text_sha256 is present
// - Regenerate datasets/ai-act/v1/index.json

import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, "datasets", "ai-act", "v1", "articles");
const INDEX_PATH = path.join(ROOT, "datasets", "ai-act", "v1", "index.json");

// Adapt if ton repo change de nom
const GITHUB_REPO = "https://github.com/BACOUL/DatasetCenter/blob/main";

async function sha256(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function inferArticleNumber(id, filename) {
  if (id && id.startsWith("AI_ACT_ART_")) {
    const n = id.replace("AI_ACT_ART_", "");
    return n.padStart(2, "0");
  }
  const m = filename.match(/^(\d+)\.json$/);
  if (m) return m[1].padStart(2, "0");
  return null;
}

async function main() {
  console.log("🔎 Updating EU AI Act dataset v1…");

  const files = (await fs.readdir(ARTICLES_DIR)).filter((f) =>
    f.endsWith(".json")
  );
  files.sort();

  const articles = [];
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(ARTICLES_DIR, file);

    let raw;
    try {
      raw = await fs.readFile(filePath, "utf8");
    } catch (err) {
      console.error(`❌ ${file}: unable to read file (${err.message}), skipping`);
      skipped++;
      continue;
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error(
        `❌ ${file}: invalid JSON (${err.message}), skipping this article`
      );
      skipped++;
      continue;
    }

    if (!data || typeof data !== "object") {
      console.warn(`⚠️  ${file}: JSON is not an object, skipping`);
      skipped++;
      continue;
    }

    if (!data.full_text || typeof data.full_text !== "string") {
      console.warn(`⚠️  ${file}: missing or invalid full_text, skipping`);
      skipped++;
      continue;
    }

    const hash = await sha256(data.full_text);

    if (data.full_text_sha256 && data.full_text_sha256 !== hash) {
      console.log(
        `♻️  ${file}: full_text_sha256 changed\n    old=${data.full_text_sha256}\n    new=${hash}`
      );
    }

    // Champ canonique dans les articles
    data.full_text_sha256 = hash;

    const number = inferArticleNumber(data.id, file);
    const relPath = `datasets/ai-act/v1/articles/${file}`;

    const record = {
      id: data.id ?? null,
      number,
      title: data.title ?? null,
      chapter: data.chapter ?? null,
      section: data.section ?? null,
      path: relPath,
      full_text_sha256: hash,
      source_url: data.source_url ?? null,
      github_path: `${GITHUB_REPO}/${relPath}`,
      last_updated: data.last_updated ?? null,
      version: data.version ?? null,
    };

    articles.push(record);

    // Réécrire le fichier article avec le hash mis à jour
    try {
      await fs.writeFile(
        filePath,
        JSON.stringify(data, null, 2) + "\n",
        "utf8"
      );
    } catch (err) {
      console.error(
        `❌ ${file}: failed to write updated JSON (${err.message})`
      );
    }
  }

  const index = {
    dataset_id: "EU_AI_ACT_V1",
    label: "EU Artificial Intelligence Act — Article-level dataset",
    version: "ai_act_dataset_v1.0.0",
    last_updated: new Date().toISOString().slice(0, 10),
    total_articles: articles.length,
    articles,
  };

  await fs.writeFile(INDEX_PATH, JSON.stringify(index, null, 2) + "\n", "utf8");

  console.log(
    `✅ Done. Updated ${articles.length} articles and wrote ${INDEX_PATH}`
  );
  if (skipped > 0) {
    console.log(`⚠️ Skipped ${skipped} article file(s) due to errors`);
  }
}

main().catch((err) => {
  console.error("❌ update_ai_act.mjs failed:", err);
  process.exit(1);
});
