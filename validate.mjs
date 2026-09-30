import { access, constants, readFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile(new URL("./manifest.json", import.meta.url), "utf8"));
if (!Array.isArray(manifest.scrapers) || !manifest.scrapers.length) throw new Error("manifest.scrapers must be a non-empty array");

const ids = new Set();
for (let i = 0; i < manifest.scrapers.length; i++) {
  const item = manifest.scrapers[i];
  for (const field of ["id", "name", "filename"]) {
    if (typeof item[field] !== "string" || !item[field]) throw new Error(`Invalid ${field}`);
  }
  if (ids.has(item.id)) throw new Error(`Duplicate provider id: ${item.id}`);
  ids.add(item.id);

  const expectedNumber = i + 1;
  const expectedId = `hans-${expectedNumber}`;
  if (item.id !== expectedId) {
    throw new Error(`Non-contiguous provider id at index ${i}: expected ${expectedId}, got ${item.id}`);
  }

  if (!/^https:\/\/(?:izlelan\.com|nuvio\.ayruki\.workers\.dev|raw\.githubusercontent\.com\/pnthancyb\/hans-mega\/main)\/providers\/[a-z0-9-]+\.js$/.test(item.filename)) {
    throw new Error(`Provider must use an approved source URL: ${item.filename}`);
  }
  const expectedName = `han's ${expectedNumber}`;
  if (item.name !== expectedName) throw new Error(`Unexpected provider name for ${item.id}: ${item.name}`);
  if (item.author !== "han") throw new Error(`Unexpected author for ${item.id}`);

  const providerPath = new URL(`./providers/hans-${expectedNumber}.js`, import.meta.url);
  try {
    await access(providerPath, constants.F_OK);
  } catch {
    throw new Error(`Missing local provider file: ${providerPath.pathname}`);
  }
  const providerSource = await readFile(providerPath, "utf8");
  if (!providerSource.includes(`const n="han's ${expectedNumber}"`)) {
    throw new Error(`Missing Han stream wrapper in ${providerPath.pathname}`);
  }
}

console.log(`Validated ${manifest.scrapers.length} Han providers; strictly sequential 1 to ${manifest.scrapers.length}.`);
