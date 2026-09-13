import {
  access,
  mkdir,
  readFile,
  readdir,
  unlink,
  writeFile,
} from "node:fs/promises";
import { constants } from "node:fs";

const SOURCE_MANIFEST_URL =
  process.env.IZLEALAN_MANIFEST_URL ?? "https://nuvio.ayruki.workers.dev/";
const SOURCE_ORIGIN = new URL(SOURCE_MANIFEST_URL).origin;
const RAW_BASE =
  process.env.HANS_RAW_BASE ??
  "https://raw.githubusercontent.com/pnthancyb/hans-mega/main";
const USER_AGENT =
  process.env.IZLEALAN_USER_AGENT ??
  "hans-mega-updater/1.0 (+https://github.com/pnthancyb/hans-mega)";

const root = new URL("./", import.meta.url);
const manifestPath = new URL("./manifest.json", root);
const mapPath = new URL("./sources/izlealan-provider-map.json", root);
const providersDirectory = new URL("./providers/", root);
const sourceNotePath = new URL("./sources/izlealan.md", root);
const readmePath = new URL("./README.md", root);

function cacheBustedUrl(url) {
  const cacheBusted = new URL(url);
  cacheBusted.searchParams.set("_hans_update", Date.now().toString());
  return cacheBusted.toString();
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      accept: "application/javascript, application/json, text/plain, */*",
      "cache-control": "no-cache",
      "user-agent": USER_AGENT,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: HTTP ${response.status}`);
  }
  return response.text();
}

async function fetchJson(url) {
  const text = await fetchText(url);
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON from ${url}: ${error.message}`);
  }
}

async function readJsonIfPresent(path) {
  try {
    await access(path, constants.F_OK);
  } catch {
    return null;
  }
  return JSON.parse(await readFile(path, "utf8"));
}

function numberFromHansId(id) {
  const match = /^hans-(\d+)$/.exec(id ?? "");
  return match ? Number(match[1]) : null;
}

function providerUrl(filename) {
  const url = new URL(filename, SOURCE_MANIFEST_URL);
  if (url.protocol !== "https:" || url.origin !== SOURCE_ORIGIN) {
    throw new Error(`Provider URL must stay on the izlealan origin: ${url}`);
  }
  return url.toString();
}

function streamWrapper(number) {
  const name = `han's ${number}`;
  return `
;(()=>{const n=${JSON.stringify(name)},g=globalThis,m=typeof module!=="undefined"?module:null,f=g&&typeof g.getStreams==="function"?g.getStreams:m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){m.exports={...m.exports,getStreams:w};}})();
`;
}

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sourceNote(sourceManifest, assignments) {
  const rows = assignments
    .map(
      ({ source, number }) =>
        `| ${number} | \`${source.id}\` | \`${source.filename}\` |`,
    )
    .join("\n");
  return `# izlealan kaynak eşlemesi

- Kaynak manifest: ${SOURCE_MANIFEST_URL}
- Kaynak sürüm: ${sourceManifest.version ?? "unknown"}
- Aktif kaynak sayısı: ${sourceManifest.scrapers.length}
- Nuvio manifestindeki provider adları: \`han's 1\` – \`han's ${Math.max(...assignments.map((item) => item.number))}\`

Yerel provider dosyaları kaynak JS'lerinin Han markalı aynalarıdır. Kaynak provider isimleri kullanıcıya görünen manifest metadata'sına taşınmaz.

| Han numarası | Kaynak ID | Kaynak dosyası |
| ---: | --- | --- |
${rows}

Bu dosya \`sync-izlealan.mjs\` ve GitHub Actions tarafından otomatik güncellenir.
`;
}

function readme(providerCount, maxNumber, sourceVersion) {
  return `# hans-mega

Nuvio için ${providerCount} provider içeren Han markalı birleşik depo.

## Manifest

\`\`\`text
https://raw.githubusercontent.com/pnthancyb/hans-mega/main/manifest.json
\`\`\`

Provider adları \`han's 1\` ile \`han's ${maxNumber}\` arasındadır. Provider JS dosyaları güncel izlealan manifestinden alınır, Han stream metadata wrapper'ı ile aynalanır ve GitHub raw üzerinden servis edilir.

Kaynak manifesti: ${SOURCE_MANIFEST_URL} (son senkron sürümü: ${sourceVersion ?? "unknown"})

## Otomatik güncelleme

\`sync-izlealan.mjs\` kaynak manifestini ve tüm provider JS dosyalarını indirir. Kaynak ID'leri \`sources/izlealan-provider-map.json\` içinde kalıcı olarak \`han's N\` numaralarına bağlanır. Yeni bir kaynak provider mevcut en yüksek numaranın sonrasına eklenir; silinen provider numarası tekrar kullanılmaz.

GitHub Actions, kaynağı günde dört kez ve manuel çalıştırma isteğiyle kontrol eder. Değişiklik olduğunda manifest, provider dosyaları, eşleme ve kaynak notu tek commit olarak güncellenir.
`;
}

const sourceManifest = await fetchJson(cacheBustedUrl(SOURCE_MANIFEST_URL));
if (!Array.isArray(sourceManifest.scrapers) || sourceManifest.scrapers.length === 0) {
  throw new Error("The izlealan manifest does not contain any scrapers.");
}

const currentManifest = await readJsonIfPresent(manifestPath);
const currentMap = (await readJsonIfPresent(mapPath)) ?? {
  nextNumber: 0,
  providers: {},
};
const mappings = currentMap.providers ?? {};
const usedNumbers = new Set(
  Object.values(mappings)
    .map((entry) => Number(entry.number))
    .filter((number) => Number.isInteger(number) && number > 0),
);

const legacyNumbers = (currentManifest?.scrapers ?? [])
  .map((item) => numberFromHansId(item.id))
  .filter((number) => number !== null);
let nextNumber = Math.max(
  Number(currentMap.nextNumber) || 0,
  ...usedNumbers,
  ...legacyNumbers,
);
const seenSourceIds = new Set();

for (const [index, source] of sourceManifest.scrapers.entries()) {
  if (!source || typeof source.id !== "string" || !source.id) {
    throw new Error(`Source scraper ${index + 1} has no stable id.`);
  }
  if (seenSourceIds.has(source.id)) {
    throw new Error(`Duplicate source scraper id: ${source.id}`);
  }
  seenSourceIds.add(source.id);
  if (typeof source.filename !== "string" || !source.filename) {
    throw new Error(`Source scraper ${source.id} has no filename.`);
  }

  if (!mappings[source.id]) {
    const legacyNumber = legacyNumbers[index];
    if (legacyNumber && !usedNumbers.has(legacyNumber)) {
      mappings[source.id] = {
        number: legacyNumber,
        firstSeenVersion: sourceManifest.version ?? null,
      };
      usedNumbers.add(legacyNumber);
      nextNumber = Math.max(nextNumber, legacyNumber);
    } else {
      nextNumber += 1;
      while (usedNumbers.has(nextNumber)) nextNumber += 1;
      mappings[source.id] = {
        number: nextNumber,
        firstSeenVersion: sourceManifest.version ?? null,
      };
      usedNumbers.add(nextNumber);
    }
  }

  const number = Number(mappings[source.id].number);
  if (!Number.isInteger(number) || number < 1) {
    throw new Error(`Invalid Han number for source scraper ${source.id}`);
  }
  mappings[source.id] = {
    ...mappings[source.id],
    number,
    lastSeenVersion: sourceManifest.version ?? null,
    sourceFilename: source.filename,
  };
}

const assignments = sourceManifest.scrapers
  .map((source) => ({ source, number: mappings[source.id].number }))
  .sort((a, b) => a.number - b.number);

await mkdir(providersDirectory, { recursive: true });
for (const { source, number } of assignments) {
  const sourceUrl = providerUrl(source.filename);
  const providerSource = await fetchText(cacheBustedUrl(sourceUrl));
  const output = `${providerSource.replace(/\s+$/, "")}\n${streamWrapper(number)}`;
  await writeFile(new URL(`./hans-${number}.js`, providersDirectory), output);
}

const activeNumbers = new Set(assignments.map((item) => item.number));
for (const file of await readdir(providersDirectory)) {
  const match = /^hans-(\d+)\.js$/.exec(file);
  if (match && !activeNumbers.has(Number(match[1]))) {
    await unlink(new URL(`./${file}`, providersDirectory));
  }
}

const sourceVersion = sourceManifest.version ?? "0.0.0";
const manifest = {
  name: "han's mega",
  version: sourceVersion,
  description: `han's ${assignments.length} providerlı nuvio deposu`,
  repository: "https://github.com/pnthancyb/hans-mega",
  resources: sourceManifest.resources ?? ["stream", "subtitles"],
  types: sourceManifest.types ?? ["movie", "series", "tv"],
  scrapers: assignments.map(({ source, number }) => {
    const name = `han's ${number}`;
    return {
      id: `hans-${number}`,
      name,
      description: `${name} provider`,
      version: sourceVersion,
      author: "han",
      supportedTypes: source.supportedTypes ?? sourceManifest.types ?? ["movie", "series", "tv"],
      filename: `${RAW_BASE}/providers/hans-${number}.js`,
      enabled: source.enabled !== false,
    };
  }),
};

const map = {
  sourceManifestUrl: SOURCE_MANIFEST_URL,
  sourceManifestVersion: sourceVersion,
  nextNumber,
  providers: Object.fromEntries(
    Object.entries(mappings).sort(([, a], [, b]) => a.number - b.number),
  ),
};

await writeFile(manifestPath, json(manifest));
await writeFile(mapPath, json(map));
await writeFile(sourceNotePath, sourceNote(sourceManifest, assignments));
await writeFile(
  readmePath,
  readme(assignments.length, Math.max(...assignments.map((item) => item.number)), sourceVersion),
);

console.log(
  `Synchronized ${assignments.length} provider(s) from izlealan ${sourceVersion}; ` +
    `${assignments.filter(({ number }) => number > legacyNumbers.length).length} provider(s) are beyond the legacy range.`,
);