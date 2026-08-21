import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const manifest = JSON.parse(await readFile(new URL("./manifest.json", import.meta.url), "utf8"));
if (!Array.isArray(manifest.scrapers) || !manifest.scrapers.length) throw new Error("manifest.scrapers must be a non-empty array");
const ids = new Set();
for (const item of manifest.scrapers) {
  for (const field of ["id", "name", "filename"]) if (typeof item[field] !== "string" || !item[field]) throw new Error(`Invalid ${field}`);
  if (ids.has(item.id)) throw new Error(`Duplicate provider id: ${item.id}`);
  ids.add(item.id);
  if (!item.filename.startsWith("providers/")) throw new Error(`Provider outside providers/: ${item.filename}`);
  try { await readFile(new URL(`./${item.filename}`, import.meta.url)); } catch { throw new Error(`Missing provider file: ${item.filename}`); }
}
console.log(`Validated ${manifest.scrapers.length} providers; ${ids.size} unique ids.`);
