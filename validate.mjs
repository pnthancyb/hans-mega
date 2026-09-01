import { readFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile(new URL("./manifest.json", import.meta.url), "utf8"));
if (!Array.isArray(manifest.scrapers) || !manifest.scrapers.length) throw new Error("manifest.scrapers must be a non-empty array");
const ids = new Set();
for (const item of manifest.scrapers) {
  for (const field of ["id", "name", "filename"]) if (typeof item[field] !== "string" || !item[field]) throw new Error(`Invalid ${field}`);
  if (ids.has(item.id)) throw new Error(`Duplicate provider id: ${item.id}`);
  ids.add(item.id);
  if (!/^https:\/\/nuvio\.ayruki\.workers\.dev\/providers\/[a-z0-9-]+\.js$/.test(item.filename)) {
    throw new Error(`Provider must use the izlealan URL: ${item.filename}`);
  }
  const expected = `han's ${item.id.replace(/^hans-/, '')}`;
  if (item.name !== expected) throw new Error(`Unexpected provider name for ${item.id}: ${item.name}`);
  if (item.author !== "han") throw new Error(`Unexpected author for ${item.id}`);
}
console.log(`Validated ${manifest.scrapers.length} Han providers; ${ids.size} unique ids.`);
