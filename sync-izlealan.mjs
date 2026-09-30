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
  process.env.IZLEALAN_MANIFEST_URL ?? "https://izlelan.com/manifest.json";
const SOURCE_DOMAINS_URL =
  process.env.IZLEALAN_DOMAINS_URL ?? "https://izlelan.com/domains.json";
const SOURCE_ORIGIN = new URL(SOURCE_MANIFEST_URL).origin;

const RAW_BASE =
  process.env.HANS_RAW_BASE ??
  "https://raw.githubusercontent.com/pnthancyb/hans-mega/main";
const USER_AGENT =
  process.env.IZLEALAN_USER_AGENT ??
  "hans-mega-updater/2.0 (+https://github.com/pnthancyb/hans-mega)";

const root = new URL("./", import.meta.url);
const manifestPath = new URL("./manifest.json", root);
const mapPath = new URL("./sources/izlealan-provider-map.json", root);
const providersDirectory = new URL("./providers/", root);
const sourceNotePath = new URL("./sources/izlealan.md", root);
const readmePath = new URL("./README.md", root);
const upstreamManifestPath = new URL("./sources/upstream-manifest.json", root);
const upstreamDomainsPath = new URL("./sources/upstream-domains.json", root);

const CHARACTER_ID_NAMES = {
  imu: "Imu",
  joyboy: "JoyBoy",
  enel: "Enel",
  crocodile: "Crocodile",
  xebec: "Xebec",
  kidd: "Kidd",
  shiki: "Shiki",
  emeth: "Emeth",
  saul: "Saul",
  garp: "Garp",
  ryuma: "Ryuma",
  rouge: "Rouge",
  turkdizi: "TurkDizi",
  kalgara: "Kalgara",
  sakazuki: "Sakazuki",
  shanks: "Shanks",
  bogard: "Bogard",
  katakuri: "Katakuri",
  mihawk: "Mihawk",
  kizaru: "Kizaru",
  smoker: "Smoker",
  noland: "Noland",
  zunesha: "Zunesha",
  oden: "Oden",
  clover: "Clover",
  doflamingo: "Doflamingo",
  teach: "Teach",
  kuzan: "Kuzan",
  garling: "Garling",
  dragon: "Dragon",
  vegapunk: "Vegapunk",
  toki: "Toki",
  fujitora: "Fujitora",
  lili: "Lili",
  sabo: "Sabo",
  shamrock: "Shamrock",
  rayleigh: "Rayleigh",
  gorosei: "Gorosei",
  ace: "Ace",
  hiriluk: "Hiriluk",
  urouge: "Urouge",
  gaban: "Gaban",
  yamato: "Yamato",
  roger: "Roger",
};

function cacheBustedUrl(url) {
  const cacheBusted = new URL(url);
  cacheBusted.searchParams.set("_hans_update", Date.now().toString());
  return cacheBusted.toString();
}

async function fetchText(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/javascript, application/json, text/plain, */*",
        "cache-control": "no-cache",
        "user-agent": USER_AGENT,
      },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Failed to download ${url}: HTTP ${response.status}`);
    }
    return await response.text();
  } finally {
    clearTimeout(timeoutId);
  }
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

function providerUrl(filename) {
  const url = new URL(filename, SOURCE_ORIGIN);
  return url.toString();
}

function transformProviderSource(code, number, source, liveDomains) {
  const targetName = "han's " + number;
  let transformed = code;

  // Clean previous wrappers or boost headers
  transformed = transformed.replace(/;\(\(\)\s*=>\s*\{[\s\S]*\}\)\(\);\s*$/, "");
  transformed = transformed.replace(/\/\/\s*\[HANS-SPEED-BOOST\][\s\S]*?\/\/\s*\[END-HANS-SPEED-BOOST\]\r?\n?/g, "");

  const charNames = new Set();
  if (source?.id && CHARACTER_ID_NAMES[source.id]) {
    charNames.add(CHARACTER_ID_NAMES[source.id]);
  }
  if (source?.name && typeof source.name === "string") {
    charNames.add(source.name.trim());
  }
  if (source?.id && typeof source.id === "string") {
    charNames.add(source.id.charAt(0).toUpperCase() + source.id.slice(1));
  }

  // Replace previous "han's X" logs/names
  transformed = transformed.replace(/han's\s+\d+/g, targetName);

  for (const charName of charNames) {
    if (!charName) continue;
    transformed = transformed.replaceAll(new RegExp(`\\b${charName}\\b`, "g"), targetName);
  }

  transformed = transformed.replace(/name:[a-z]\.name,title:/g, "name:\"" + targetName + "\",provider:\"" + targetName + "\",title:");
  transformed = transformed.replace(/name:[a-z]\.source_name\|\|\"[^\"]+\",/g, "name:\"" + targetName + "\",provider:\"" + targetName + "\",");
  transformed = transformed.replace(/name:[a-z]\.source_name,/g, "name:\"" + targetName + "\",provider:\"" + targetName + "\",");
  transformed = transformed.replace(
    /if \(typeof module !== "undefined" && module\.exports\) \{ if \(_gs\) module\.exports\.getStreams = _gs; if \(_sub\) module\.exports\.getSubtitles = _sub; \}/g,
    `if (typeof module !== "undefined" && module.exports) { try { if (_gs) module.exports.getStreams = _gs; } catch {} try { if (_sub) module.exports.getSubtitles = _sub; } catch {} }`
  );

  // Pre-populate with live domain data from izlelan.com for instant 0ms domain resolution
  const speedBoostHeader = `// [HANS-SPEED-BOOST] Pre-populate domains and config state for 0ms lookup latency
var _g = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this;
var _DEFAULT_DOMAINS = ${JSON.stringify(liveDomains)};
if (!_g.__NUVIO_CONFIG_STATE__) {
  _g.__NUVIO_CONFIG_STATE__ = {
    cachedDomains: _DEFAULT_DOMAINS,
    cachedCookies: {},
    cachedTmdbKeys: ["a2f888b27315e62e471b2d587048f32e","68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"],
    lastFetchTime: Date.now() + 86400000,
    activeFetchPromise: null
  };
} else if (!_g.__NUVIO_CONFIG_STATE__.cachedDomains || Object.keys(_g.__NUVIO_CONFIG_STATE__.cachedDomains).length === 0) {
  _g.__NUVIO_CONFIG_STATE__.cachedDomains = Object.assign({}, _DEFAULT_DOMAINS, _g.__NUVIO_CONFIG_STATE__.cachedDomains || {});
}
// [END-HANS-SPEED-BOOST]
`;

  return `${speedBoostHeader}\n${transformed.trim()}`;
}

function streamWrapper(number) {
  return `
;(()=>{const n="han's ${number}",g=typeof globalThis!=="undefined"?globalThis:typeof global!=="undefined"?global:this,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;g.__HANS_CACHE__=g.__HANS_CACHE__||new Map();const c=g.__HANS_CACHE__,TTL=600000,w=async(...a)=>{let k;try{k=n+":"+JSON.stringify(a)}catch{k=null}const now=Date.now();if(k&&c.has(k)){const e=c.get(k);if(e&&now-e.t<TTL)return e.d;}let t;const tp=new Promise(res=>{t=setTimeout(()=>res([]),5500);}),ep=(async()=>{try{const r=await f(...a);if(t)clearTimeout(t);const res=Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):(r||[]);if(k&&Array.isArray(res)&&res.length>0)c.set(k,{d:res,t:Date.now()});return res;}catch{if(t)clearTimeout(t);return [];}})();return Promise.race([ep,tp]);};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports.getStreams=w;}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true});}catch(e){m.exports.getStreams=w;}}})();
`;
}

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sourceNote(sourceManifest, assignments) {
  const rows = assignments
    .map(
      ({ source, number }) =>
        `| ${number} | \`${source.id}\` | \`${source.name}\` | \`${source.filename}\` |`,
    )
    .join("\n");
  return `# izlelan.com kaynak eşlemesi

- Kaynak manifest: ${SOURCE_MANIFEST_URL}
- Kaynak sürüm: ${sourceManifest.version ?? "unknown"}
- Aktif kaynak sayısı: ${assignments.length}
- Nuvio manifestindeki provider adları: \`han's 1\` – \`han's ${assignments.length}\`

Tüm sağlayıcı dosyaları izlelan.com üzerindeki güncel kaynaklardan çekilmiş, Han markalı ve önbellekli olarak yeniden yapılandırılmıştır.
Tüm eklentiler 1'den ${assignments.length}'e kadar atlama olmaksızın ardışık (contiguous) olarak numaralandırılmıştır.

| Han numarası | Kaynak ID | Kaynak Adı | Kaynak dosyası |
| ---: | --- | --- | --- |
${rows}

Bu dosya \`sync-izlealan.mjs\` ve GitHub Actions tarafından otomatik güncellenir.
`;
}

function readme(providerCount, sourceVersion) {
  return `# hans-mega

Nuvio için ${providerCount} provider içeren yüksek performanslı Han markalı birleşik depo.

## Manifest

\`\`\`text
https://raw.githubusercontent.com/pnthancyb/hans-mega/main/manifest.json
\`\`\`

Tüm sağlayıcı adları \`han's 1\` ile \`han's ${providerCount}\` arasında eksiksiz ve ardışıktır.
İzlelan (izlelan.com) güncel kaynaklarından (v${sourceVersion}) beslenir.

## Özellikler & Performans
- **Atlamasız Sıralama:** Provider numaralandırmaları hiçbir zaman atlamaz, her zaman ardışık 1..${providerCount} sıralıdır.
- **Ultra Hızlı Akış:** Sağlayıcı domainleri izlelan.com/domains.json üzerinden önceden çözümlenir (0ms gecikme), askıda kalan sunucular Nuvio'yu dondurmaz (5.5s timeout).
- **10 Dakikalık TTL Akış Önbelleği:** Aynı içerik için tekrarlanan istekler anında yanıtlanır.
- **Otomatik Senkronizasyon:** GitHub Actions upstream kaynakları periyodik kontrol eder ve yeni eklentileri ardışık sıraya dahil eder.
`;
}

// 1. Fetch live source manifest and domains
console.log(`Downloading fresh manifest from ${SOURCE_MANIFEST_URL}...`);
const sourceManifest = await fetchJson(cacheBustedUrl(SOURCE_MANIFEST_URL));
if (!Array.isArray(sourceManifest?.scrapers) || sourceManifest.scrapers.length === 0) {
  throw new Error("The izlelan manifest does not contain any scrapers.");
}

console.log(`Downloading fresh domains from ${SOURCE_DOMAINS_URL}...`);
let liveDomains = {};
try {
  const domainsData = await fetchJson(cacheBustedUrl(SOURCE_DOMAINS_URL));
  liveDomains = domainsData?.data?.domains || domainsData?.domains || {};
  await writeFile(upstreamDomainsPath, json(domainsData));
} catch (e) {
  console.warn("Could not fetch domains.json, using fallback dictionary:", e.message);
}

await writeFile(upstreamManifestPath, json(sourceManifest));

// 2. Clean out old JS files from providers directory
await mkdir(providersDirectory, { recursive: true });
const oldFiles = await readdir(providersDirectory);
for (const file of oldFiles) {
  if (file.endsWith(".js")) {
    await unlink(new URL(`./${file}`, providersDirectory));
  }
}
console.log(`Deleted ${oldFiles.filter((f) => f.endsWith(".js")).length} old provider JS files.`);

// 3. Sequential 1..N Assignment for all scrapers
const newMappings = {};
const assignments = [];

sourceManifest.scrapers.forEach((source, index) => {
  const number = index + 1; // 1-indexed strictly sequential
  newMappings[source.id] = {
    number,
    name: source.name || source.id,
    firstSeenVersion: sourceManifest.version ?? "1.14.606",
    lastSeenVersion: sourceManifest.version ?? "1.14.606",
    sourceFilename: source.filename,
  };
  assignments.push({ source, number });
});

// 4. Download each provider freshly from izlelan.com and apply transformations
console.log(`Downloading and optimizing ${assignments.length} fresh providers from izlelan.com...`);

for (const { source, number } of assignments) {
  const sourceUrl = providerUrl(source.filename);
  const rawSource = await fetchText(cacheBustedUrl(sourceUrl));
  const transformed = transformProviderSource(rawSource, number, source, liveDomains);
  const output = `${transformed.trim()}\n${streamWrapper(number)}`;
  await writeFile(new URL(`./hans-${number}.js`, providersDirectory), output);
  console.log(`✓ han's ${number} -> ${source.id} (${source.filename})`);
}

// 5. Build manifest.json
const sourceVersion = sourceManifest.version ?? "1.14.606";
const manifest = {
  name: "han's mega",
  version: sourceVersion,
  description: `han's ${assignments.length} providerlı yüksek performanslı nuvio deposu`,
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
      supportedTypes: source.supportedTypes ?? ["movie", "tv"],
      filename: `${RAW_BASE}/providers/hans-${number}.js`,
      enabled: source.enabled !== false,
    };
  }),
};

// 6. Save updated provider map
const map = {
  sourceManifestUrl: SOURCE_MANIFEST_URL,
  sourceDomainsUrl: SOURCE_DOMAINS_URL,
  sourceManifestVersion: sourceVersion,
  totalProviders: assignments.length,
  providers: Object.fromEntries(
    Object.entries(newMappings).sort(([, a], [, b]) => a.number - b.number),
  ),
};

await writeFile(manifestPath, json(manifest));
await writeFile(mapPath, json(map));
await writeFile(sourceNotePath, sourceNote(sourceManifest, assignments));
await writeFile(readmePath, readme(assignments.length, sourceVersion));

console.log(
  `\nSUCCESS: Synchronized ${assignments.length} Han providers strictly numbered han's 1 to han's ${assignments.length} from izlelan.com v${sourceVersion}.`
);
