// QuickJS & Embedded Engine Universal Polyfills
var _g = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this;
if (typeof String.prototype.normalize !== 'function') {
  String.prototype.normalize = function() {
    var str = String(this);
    var map = {
      'ç':'c','Ç':'C','ğ':'g','Ğ':'G','ı':'i','İ':'I',
      'ö':'o','Ö':'O','ş':'s','Ş':'S','ü':'u','Ü':'U',
      'á':'a','à':'a','â':'a','ä':'a','ã':'a','å':'a',
      'é':'e','è':'e','ê':'e','ë':'e',
      'í':'i','ì':'i','î':'i','ï':'i',
      'ó':'o','ò':'o','ô':'o','ö':'o','õ':'o',
      'ú':'u','ù':'u','û':'u','ü':'u',
      'ñ':'n','Ñ':'N','ß':'ss'
    };
    return str.replace(/[çÇğĞıİöÖşŞüÜáàâäãåéèêëíìîïóòôöõúùûüñÑß]/g, function(c) {
      return map[c] || c;
    });
  };
}
if (typeof TextDecoder === 'undefined' && (typeof _g === 'undefined' || typeof _g.TextDecoder === 'undefined')) {
  var CustomTextDecoder = function(encoding) {
    this.encoding = encoding || 'utf-8';
  };
  CustomTextDecoder.prototype.decode = function(bytes) {
    if (!bytes) return '';
    var out = '';
    var i = 0;
    var len = bytes.length;
    while (i < len) {
      var c = bytes[i++];
      if (c < 128) {
        out += String.fromCharCode(c);
      } else if (c > 191 && c < 224) {
        var c2 = bytes[i++];
        out += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
      } else if (c > 223 && c < 240) {
        var c2 = bytes[i++];
        var c3 = bytes[i++];
        out += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      } else if (c > 239 && c < 248) {
        var c2 = bytes[i++];
        var c3 = bytes[i++];
        var c4 = bytes[i++];
        var cp = (((c & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63)) - 0x10000;
        out += String.fromCharCode(0xD800 + (cp >> 10), 0xDC00 + (cp & 0x3FF));
      }
    }
    return out;
  };
  if (typeof _g !== 'undefined') _g.TextDecoder = CustomTextDecoder;
  if (typeof globalThis !== 'undefined') globalThis.TextDecoder = CustomTextDecoder;
  if (typeof global !== 'undefined') global.TextDecoder = CustomTextDecoder;
}
if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'undefined') {
  AbortSignal.timeout = function() {
    return undefined;
  };
}
if (typeof atob === 'undefined' && (typeof _g === 'undefined' || typeof _g.atob === 'undefined')) {
  var _b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var _customAtob = function(input) {
    var str = String(input).replace(/=+$/, '');
    var out = '';
    for (var bc = 0, bs = 0, buffer, i = 0; buffer = str.charAt(i++); ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? out += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
      buffer = _b64.indexOf(buffer);
    }
    return out;
  };
  if (typeof _g !== 'undefined') _g.atob = _customAtob;
  if (typeof globalThis !== 'undefined') globalThis.atob = _customAtob;
  if (typeof global !== 'undefined') global.atob = _customAtob;
}
if (typeof btoa === 'undefined' && (typeof _g === 'undefined' || typeof _g.btoa === 'undefined')) {
  var _b64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var _customBtoa = function(input) {
    var str = String(input);
    var out = '';
    for (var block = 0, charCode, i = 0, map = _b64Chars; str.charAt(i | 0) || (map = '=', i % 1); out += map.charAt(63 & block >> 8 - i % 1 * 8)) {
      charCode = str.charCodeAt(i += 3/4);
      if (charCode > 255) return '';
      block = block << 8 | charCode;
    }
    return out;
  };
  if (typeof _g !== 'undefined') _g.btoa = _customBtoa;
  if (typeof globalThis !== 'undefined') globalThis.btoa = _customBtoa;
  if (typeof global !== 'undefined') global.btoa = _customBtoa;
}
if (typeof String.prototype.matchAll !== 'function') {
  String.prototype.matchAll = function(regex) {
    var str = String(this);
    var flags = (regex && regex.flags !== undefined) ? regex.flags : ((regex.global ? 'g' : '') + (regex.ignoreCase ? 'i' : '') + (regex.multiline ? 'm' : ''));
    if (!flags.includes('g')) flags += 'g';
    var rx = new RegExp(regex.source, flags);
    var matches = [];
    var m;
    while ((m = rx.exec(str)) !== null) {
      matches.push(m);
    }
    return matches[Symbol.iterator] ? matches[Symbol.iterator]() : matches;
  };
}

"use strict";
var U = Object.defineProperty;
var de = Object.getOwnPropertyDescriptor;
var ge = Object.getOwnPropertyNames;
var me = Object.prototype.hasOwnProperty;
var fe = (n, r) => {
  for (var i in r) U(n, i, { get: r[i], enumerable: !0 });
};
var pe = (n, r, i, s) => {
  if (r && typeof r == "object" || typeof r == "function") {
    for (let l of ge(r)) {
      !me.call(n, l) && l !== i && U(n, l, { get: () => r[l], enumerable: !(s = de(r, l)) || s.enumerable });
    }
  }
  return n;
};
var he = (n) => pe(U({}, "__esModule", { value: !0 }), n);
var Ie = {};
fe(Ie, { getStreams: () => getStreamsHandler });
if (typeof module !== "undefined" && module.exports) {
  module.exports = he(Ie);
}

// Remote configuration & state
var remoteConfigEncoded = [66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(r => String.fromCharCode(r ^ 42)).join("");
var CONFIG = {
  REMOTE_CONFIG_URL: remoteConfigEncoded,
  DEFAULT_USER_AGENT: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  DEFAULT_API_URL: "https://api.anizium.co",
  DEFAULT_SITE_URL: "https://anizium.co"
};

var globalScope = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : {};
globalScope.__NUVIO_CONFIG_STATE__ || (globalScope.__NUVIO_CONFIG_STATE__ = {
  cachedDomains: {},
  cachedCookies: {},
  cachedTmdbKeys: [],
  lastFetchTime: 0,
  activeFetchPromise: null
});
var configState = globalScope.__NUVIO_CONFIG_STATE__;
var CACHE_TTL = 10 * 60 * 1000;

async function fetchRemoteConfig() {
  let now = Date.now();
  try {
    let opts = {};
    if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
      try {
        let sig = AbortSignal.timeout(4000);
        sig && (opts.signal = sig);
      } catch {}
    }
    let res = await fetch(CONFIG.REMOTE_CONFIG_URL, opts);
    if (res.ok) {
      let json = await res.json();
      let data = json?.data ?? json;
      let domains = data.domains || data;
      let cookies = data.cookies;
      let tmdbKeys = data.tmdb_keys || data.tmdbKeys;
      domains && typeof domains === "object" && (configState.cachedDomains = { ...configState.cachedDomains, ...domains });
      cookies && typeof cookies === "object" && (configState.cachedCookies = { ...configState.cachedCookies, ...cookies });
      Array.isArray(tmdbKeys) && tmdbKeys.length > 0 && (configState.cachedTmdbKeys = tmdbKeys);
      configState.lastFetchTime = now;
    } else {
      configState.lastFetchTime = now - CACHE_TTL + 60000;
    }
  } catch {
    configState.lastFetchTime = now - CACHE_TTL + 60000;
  }
}

async function ensureConfig() {
  if (Date.now() - configState.lastFetchTime > CACHE_TTL) {
    if (!configState.activeFetchPromise) {
      configState.activeFetchPromise = fetchRemoteConfig().finally(() => {
        configState.activeFetchPromise = null;
      });
    }
    await configState.activeFetchPromise;
  }
}

async function getDomain(name) {
  await ensureConfig();
  return configState.cachedDomains[name] || CONFIG.DEFAULT_API_URL;
}

async function getTmdbKeys() {
  await ensureConfig();
  return configState.cachedTmdbKeys || [];
}

var fallbackTmdbKeys = [
  "a2f888b27315e62e471b2d587048f32e",
  "68e094699525b18a70bab2f86b1fa706",
  "246ec6ffbbd6c05d76ad714241e3dcd1",
  "1865f43a0549ca50d341dd9ab8b29f49"
];

async function fetchTmdb(endpoint) {
  let keys = await getTmdbKeys();
  let pool = keys.length > 0 ? [...keys, ...fallbackTmdbKeys] : fallbackTmdbKeys;
  for (let i = 0; i < pool.length; i++) {
    let key = pool[i];
    let sep = endpoint.includes("?") ? "&" : "?";
    let url = `https://api.themoviedb.org/3/${endpoint}${sep}api_key=${key}`;
    try {
      let sig = typeof AbortSignal !== "undefined" && AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined;
      let res = await fetch(url, { signal: sig });
      if (res.ok) return await res.json();
      if (res.status === 429) continue;
    } catch {}
  }
  return null;
}

globalScope.__NUVIO_TMDB_CACHE__ || (globalScope.__NUVIO_TMDB_CACHE__ = {
  imdbIdCache: new Map(),
  tmdbTitlesCache: new Map(),
  tmdbImageCache: new Map(),
  episodeGroupCache: new Map(),
  absoluteEpCache: new Map()
});
var tmdbCache = globalScope.__NUVIO_TMDB_CACHE__;

async function resolveTmdb(id, type) {
  let rawId = String(id || "").replace(/^tmdb:/i, "").trim();
  if (!rawId) return { titles: [] };
  let cacheKey = `${type}:${rawId}`;
  if (tmdbCache.tmdbTitlesCache.has(cacheKey)) {
    return tmdbCache.tmdbTitlesCache.get(cacheKey);
  }
  let promise = (async () => {
    let titles = [], numId, releaseYear, cast = [], creators = [], overview, genres = [];
    try {
      let isTv = type === "tv" || type === "series";
      let tmdbType = isTv ? "tv" : "movie";
      if (rawId.startsWith("tt")) {
        let findData = await fetchTmdb(`find/${rawId}?external_source=imdb_id`);
        if (findData) {
          let item = isTv ? findData?.tv_results?.[0] : findData?.movie_results?.[0];
          if (item) {
            numId = item.id;
            item.overview && (overview = item.overview);
          }
        }
      } else {
        numId = parseInt(rawId, 10);
      }
      if (numId && !isNaN(numId)) {
        let details = await fetchTmdb(`${tmdbType}/${numId}?language=tr-TR&append_to_response=credits,alternative_titles`);
        if (details) {
          details.overview && (overview = details.overview);
          if (details.title) {
            titles.push(details.title);
            if (details.title.includes(":")) {
              let p = details.title.split(":")[0].trim();
              p.length > 2 && titles.push(p);
            }
          }
          if (details.name) {
            titles.push(details.name);
            if (details.name.includes(":")) {
              let p = details.name.split(":")[0].trim();
              p.length > 2 && titles.push(p);
            }
          }
          if (details.original_title && details.original_title !== details.title) {
            titles.push(details.original_title);
            if (details.original_title.includes(":")) {
              let p = details.original_title.split(":")[0].trim();
              p.length > 2 && titles.push(p);
            }
          }
          if (details.original_name && details.original_name !== details.name) {
            titles.push(details.original_name);
            if (details.original_name.includes(":")) {
              let p = details.original_name.split(":")[0].trim();
              p.length > 2 && titles.push(p);
            }
          }
          let alt = (details.alternative_titles?.results || details.alternative_titles?.titles || []).map(o => o.title).filter(Boolean);
          titles.push(...alt);
          let dateStr = details.release_date || details.first_air_date;
          dateStr && (releaseYear = parseInt(dateStr.split("-")[0], 10));
          if (details.genres && Array.isArray(details.genres)) {
            genres = details.genres.map(o => o.name).filter(Boolean);
          }
          if (details.credits?.cast && Array.isArray(details.credits.cast)) {
            cast = details.credits.cast.slice(0, 10).map(o => o.name).filter(Boolean);
          }
        }
      }
    } catch {}
    return {
      numericId: numId,
      titles: Array.from(new Set(titles.filter(Boolean))),
      year: releaseYear,
      cast,
      creators,
      overview,
      genres
    };
  })();
  tmdbCache.tmdbTitlesCache.set(cacheKey, promise);
  return promise;
}

async function getEpisodeGroups(numId) {
  if (tmdbCache.episodeGroupCache.has(numId)) return tmdbCache.episodeGroupCache.get(numId);
  let promise = (async () => {
    try {
      let res = await fetchTmdb(`tv/${numId}/episode_groups`);
      if (!res) return null;
      let group = (res.results || []).find(u => u.type === 6 || u.type === 5 || u.type === 1 || u.name?.toLowerCase().includes("season") || u.name?.toLowerCase().includes("arc") || u.name?.toLowerCase().includes("part") || u.name?.toLowerCase().includes("saga"));
      if (!group) return null;
      let groupDetail = await fetchTmdb(`tv/episode_group/${group.id}`);
      if (!groupDetail || !groupDetail.groups) return null;
      let mapping = {};
      let totalCount = 1;
      let seasonCounter = {};
      (groupDetail.groups || []).sort((a, b) => (a.order || 0) - (b.order || 0)).forEach((grp, idx) => {
        let gname = grp.name || "";
        let match = gname.match(/Season\s+(\d+)/i);
        let sNum = match ? parseInt(match[1], 10) : grp.order || idx + 1;
        if (sNum === 0 || gname.toLowerCase().includes("specials") || gname.toLowerCase().includes("özel")) return;
        seasonCounter[sNum] === undefined && (seasonCounter[sNum] = 0);
        (grp.episodes || []).forEach(ep => {
          if (ep.season_number !== 0) {
            seasonCounter[sNum]++;
            mapping[totalCount] = { season: sNum, episode: seasonCounter[sNum] };
            totalCount++;
          }
        });
      });
      return mapping;
    } catch {
      return null;
    }
  })();
  tmdbCache.episodeGroupCache.set(numId, promise);
  return promise;
}

async function getAbsoluteEpisode(numId, season, episode) {
  if (season <= 1) return episode;
  let key = `${numId}:${season}:${episode}`;
  if (tmdbCache.absoluteEpCache.has(key)) return tmdbCache.absoluteEpCache.get(key);
  let promise = (async () => {
    try {
      let res = await fetchTmdb(`tv/${numId}`);
      if (!res) return episode;
      let countBefore = (res.seasons || []).filter(s => s.season_number > 0 && s.season_number < season).reduce((acc, s) => acc + (s.episode_count || 0), 0);
      return episode > countBefore ? episode : countBefore + episode;
    } catch {
      return episode;
    }
  })();
  tmdbCache.absoluteEpCache.set(key, promise);
  return promise;
}

function logMessage(tag, message, level = "info", details) {
  let prefix = `[${tag}]`;
  level === "error" ? console.error(prefix, message, details || "") : level === "warn" ? console.warn(prefix, message, details || "") : console.log(prefix, message, details || "");
}

// Anizium Security & Authentication Engine
function xorEncrypt(text, key) {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    let x = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    out += x.toString(16).padStart(2, "0");
  }
  return out;
}

function encryptBody(text) {
  return xorEncrypt(text, "16ghkdz5qnwinkyebwopbd94b49xhs");
}

function generateCfControl() {
  // GMT+3 weekday matching Anizium Android DEX
  const now = new Date();
  const gmt3 = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const weekday = weekdays[gmt3.getUTCDay()];
  const key = "hlxjl1c2w281ax473rt1ofgrvhyjvi_" + weekday;

  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let rand = "";
  for (let i = 0; i < 6; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const ts = Date.now();
  const rawJson = `{"${rand}":${ts}}`;
  return xorEncrypt(rawJson, key);
}

// Master VIP Credentials embedded in TurkSinema Anizium
var sessionState = {
  userSession: "",
  lastLoginTime: 0,
  loginPromise: null
};

async function getOrRenewSession(apiUrl) {
  let now = Date.now();
  if (sessionState.userSession && (now - sessionState.lastLoginTime < 12 * 60 * 60 * 1000)) {
    return sessionState.userSession;
  }
  if (sessionState.loginPromise) {
    return sessionState.loginPromise;
  }

  sessionState.loginPromise = (async () => {
    try {
      let email = "ishak.kut21@gmail.com";
      let password = "123456798aA";
      let payload = JSON.stringify({
        value: email,
        password: password,
        date: Date.now()
      });
      let encryptedBody = encryptBody(payload);
      let cfControl = generateCfControl();

      let res = await fetch(`${apiUrl}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": CONFIG.DEFAULT_USER_AGENT,
          device: "browser",
          language: "tr",
          site: "main",
          "Cf-Control": cfControl,
          Origin: CONFIG.DEFAULT_SITE_URL,
          Referer: `${CONFIG.DEFAULT_SITE_URL}/`
        },
        body: JSON.stringify({ d: encryptedBody })
      });

      if (res.ok) {
        let json = await res.json();
        if (json && json.success && json.session) {
          sessionState.userSession = json.session;
          sessionState.lastLoginTime = now;
          logMessage("Anizium", "VIP oturumu başarıyla yenilendi.");
          return json.session;
        }
      }
    } catch (e) {
      logMessage("Anizium", `VIP oturum alma uyarısı: ${e.message}`, "warn");
    } finally {
      sessionState.loginPromise = null;
    }
    return sessionState.userSession;
  })();

  return sessionState.loginPromise;
}

function buildHeaders(apiUrl, userSession) {
  let cfControl = generateCfControl();
  let origin = apiUrl.replace(/^(https?:\/\/)(?:api\.)?/i, "$1").replace(/\/+$/, "");
  let headers = {
    "User-Agent": CONFIG.DEFAULT_USER_AGENT,
    "Cf-Control": cfControl,
    language: "tr",
    site: "main",
    device: "browser",
    Origin: origin,
    Referer: `${origin}/`
  };
  if (userSession) {
    headers["user-session"] = userSession;
  }
  return headers;
}

var SUB_LANG_MAP = {
  tr: { code: "tr", language: "Turkish", name: "Türkçe" },
  tur: { code: "tr", language: "Turkish", name: "Türkçe" },
  en: { code: "en", language: "English", name: "İngilizce" },
  eng: { code: "en", language: "English", name: "İngilizce" },
  de: { code: "de", language: "German", name: "Almanca" },
  fr: { code: "fr", language: "French", name: "Fransızca" },
  es: { code: "es", language: "Spanish", name: "İspanyolca" },
  it: { code: "it", language: "Italian", name: "İtalyanca" },
  ar: { code: "ar", language: "Arabic", name: "Arapça" },
  ja: { code: "ja", language: "Japanese", name: "Japonca" }
};

// Quality label mapping ensuring 4K and 1080p are prominent
function formatQualityTag(rawQuality) {
  let q = parseInt(String(rawQuality || 1080), 10);
  if (q >= 2160) return "4K";
  if (q >= 1440) return "2K";
  if (q >= 1080) return "1080p";
  if (q >= 720) return "720p";
  if (q >= 480) return "480p";
  if (q >= 360) return "360p";
  return `${q}p`;
}

// Main getStreams implementation
async function getStreamsHandler(tmdbId, type, season, episode) {
  let startTime = Date.now();
  logMessage("Anizium", `Tarama Başlatıldı -> TMDB: ${tmdbId}, Tür: ${type}, Sezon: ${season}, Bölüm: ${episode}`);
  try {
    let idStr = String(tmdbId || "").trim();
    let typeStr = String(type || "").toLowerCase().trim();
    let isTv = typeStr === "tv" || typeStr === "series";
    let mediaType = isTv ? "tv" : "movie";
    let sNum = season != null ? parseInt(String(season), 10) : 1;
    let epNum = episode != null ? parseInt(String(episode), 10) : 1;

    let meta = await resolveTmdb(idStr, mediaType);
    let numericTmdbId = meta.numericId ? String(meta.numericId) : idStr;
    let candidateTitles = (meta.titles || []).filter(t => t && t.trim().length > 0);
    if (candidateTitles.length === 0) {
      logMessage("Anizium", `TMDB başlığı çözülemedi: ${idStr}`, "warn");
      return [];
    }

    let apiUrl = await getDomain("sabo");
    if (!apiUrl) apiUrl = CONFIG.DEFAULT_API_URL;
    let originUrl = apiUrl.replace(/^(https?:\/\/)(?:api\.)?/i, "$1").replace(/\/+$/, "");

    let userSession = await getOrRenewSession(apiUrl);
    let requestHeaders = buildHeaders(apiUrl, userSession);

    // Build search queries
    let searchQueries = [];
    for (let t of candidateTitles) {
      !searchQueries.includes(t) && searchQueries.push(t);
      if (t.includes(":")) {
        let p = t.split(":")[0].trim();
        p.length >= 3 && !searchQueries.includes(p) && searchQueries.push(p);
      }
      if (t.includes("-")) {
        let p = t.split("-")[0].trim();
        p.length >= 3 && !searchQueries.includes(p) && searchQueries.push(p);
      }
    }

    let matchedAnimeId = null;
    let matchedTitle = "";

    for (let query of searchQueries) {
      try {
        let searchUrl = `${apiUrl}/page/search?value=${encodeURIComponent(query)}&page=1`;
        let searchResp = await fetch(searchUrl, { headers: requestHeaders });
        if (!searchResp.ok) continue;
        let searchData = await searchResp.json();
        let items = searchData?.page?.data || [];
        for (let item of items) {
          let animeId = item?.ID;
          if (!animeId) continue;

          let detailUrl = `${apiUrl}/anime/get?id=${animeId}`;
          let detailResp = await fetch(detailUrl, { headers: requestHeaders });
          if (!detailResp.ok) continue;
          let detailData = (await detailResp.json())?.data;
          if (!detailData) continue;

          let tmdbMatch = String(detailData?.tmdb_id || "").trim();
          let nameLower = String(detailData?.name || "").toLowerCase().trim();

          if (tmdbMatch === numericTmdbId || tmdbMatch === idStr) {
            matchedAnimeId = String(animeId);
            matchedTitle = detailData?.name || item?.name || query;
            logMessage("Anizium", `[TMDB Eşleşti!] ID: ${matchedAnimeId}, İsim: ${matchedTitle}`);
            break;
          }

          if (candidateTitles.some(c => c.toLowerCase().trim() === nameLower)) {
            matchedAnimeId = String(animeId);
            matchedTitle = detailData?.name || item?.name || query;
            logMessage("Anizium", `[Başlık Eşleşti!] ID: ${matchedAnimeId}, İsim: ${matchedTitle}`);
            break;
          }
        }
        if (matchedAnimeId) break;
      } catch {}
    }

    if (!matchedAnimeId) {
      logMessage("Anizium", `Eşleşen anime bulunamadı -> TMDB: ${idStr}`, "warn");
      return [];
    }

    // Fetch stream source
    let sourceData = null;
    if (isTv) {
      let querySource = async (s, e) => {
        try {
          let url = `${apiUrl}/anime/source?id=${matchedAnimeId}&site=main&plan=&season=${s}&episode=${e}&server=`;
          let res = await fetch(url, { headers: requestHeaders });
          if (res.ok) {
            let json = await res.json();
            if (json && json.success) return json;
          }
        } catch {}
        try {
          let urlFallback = `${apiUrl}/anime/source?id=${matchedAnimeId}&site=main&plan=1&season=${s}&episode=${e}&server=1`;
          let resFallback = await fetch(urlFallback, { headers: requestHeaders });
          if (resFallback.ok) {
            let json = await resFallback.json();
            if (json && json.success) return json;
          }
        } catch {}
        return null;
      };

      sourceData = await querySource(sNum, epNum);

      // Episode group matching fallback
      if (!sourceData && meta.numericId) {
        let groups = await getEpisodeGroups(meta.numericId);
        if (groups && groups[epNum]) {
          let target = groups[epNum];
          if (target.season !== sNum || target.episode !== epNum) {
            logMessage("Anizium", `[TMDB Grup Eşleşmesi] Sezon ${sNum} Bölüm ${epNum} -> Sezon ${target.season} Bölüm ${target.episode}`);
            sourceData = await querySource(target.season, target.episode);
          }
        }
      }

      // Absolute episode number fallback for long-running anime
      if (!sourceData && (sNum > 1 || epNum > 100) && meta.numericId) {
        let absEp = await getAbsoluteEpisode(meta.numericId, sNum, epNum);
        if (absEp && (absEp !== epNum || sNum !== 1)) {
          logMessage("Anizium", `[Mutlak Bölüm] Sezon ${sNum} Bölüm ${epNum} -> Mutlak Bölüm ${absEp}`);
          sourceData = await querySource(1, absEp);
        }
      }
    } else {
      try {
        let movieUrl = `${apiUrl}/anime/source?id=${matchedAnimeId}&site=main&plan=&server=`;
        let res = await fetch(movieUrl, { headers: requestHeaders });
        if (res.ok) {
          sourceData = await res.json();
        }
      } catch {}
      if (!sourceData || !sourceData.success) {
        try {
          let movieUrlFallback = `${apiUrl}/anime/source?id=${matchedAnimeId}&site=main&plan=1&server=1`;
          let res = await fetch(movieUrlFallback, { headers: requestHeaders });
          if (res.ok) {
            sourceData = await res.json();
          }
        } catch {}
      }
    }

    if (!sourceData || !sourceData.success) {
      logMessage("Anizium", `Bölüm kaynağı bulunamadı -> ${sourceData?.msg || "Bilinmeyen hata"}`, "warn");
      return [];
    }

    // Subtitles extraction
    let formattedSubtitles = (sourceData.subtitles || []).map((sub, idx) => {
      let grp = String(sub.group || "").toLowerCase().trim();
      let label = String(sub.name || "").trim();
      let langObj = SUB_LANG_MAP[grp] || { code: grp || "tr", language: "Turkish", name: "Türkçe" };
      let finalName = label || langObj.name;
      return {
        id: String(idx),
        url: sub.link,
        lang: langObj.code,
        language: langObj.language,
        name: finalName,
        label: finalName,
        title: finalName,
        type: "vtt",
        headers: {
          Referer: `${originUrl}/`,
          "User-Agent": CONFIG.DEFAULT_USER_AGENT
        }
      };
    });

    // Groups & qualities extraction
    let streams = [];
    let groups = (sourceData.groups || []).filter(g => String(g?.group || "").toLowerCase().trim() !== "endub");
    let hasMultipleGroups = groups.length > 1;

    for (let grp of groups) {
      let grpName = String(grp?.group || "").toLowerCase().trim();
      let isDub = grpName === "trdub" || grpName.includes("dub");
      let audioLabel = isDub ? "Dublaj" : "Altyazılı";

      // Sort items descending: 2160 (4K) -> 1440 (2K) -> 1080 (1080p) -> 720 (720p) -> 480 (480p)
      let items = (grp.items || []).slice().sort((a, b) => (b.quality || 0) - (a.quality || 0));

      for (let item of items) {
        let streamUrl = item.link;
        if (!streamUrl || typeof streamUrl !== "string") continue;

        let qualityTag = formatQualityTag(item.quality);
        let isHls = item.type === "hls" || streamUrl.includes(".m3u8");
        let formatType = isHls ? "m3u8" : "mp4";
        let formatLabel = isHls ? "HLS" : "MP4";

        // Quality subtitle format matching other providers (e.g. 1080p • Altyazılı, 4K • Dublaj)
        let qualityDisplay = `${qualityTag} • ${audioLabel}`;
        let streamDesc = `${audioLabel}\n${qualityTag} • ${formatLabel}`;

        streams.push({
          name: "han's 37",
          title: audioLabel,
          description: streamDesc,
          quality: qualityDisplay,
          url: streamUrl,
          format: formatType,
          headers: {
            Referer: `${originUrl}/`,
            Origin: originUrl,
            "User-Agent": CONFIG.DEFAULT_USER_AGENT
          },
          subtitles: isDub ? [] : formattedSubtitles
        });
      }
    }

    let elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    logMessage("Anizium", `[Tamamlandı] ${streams.length} adet akış listelendi (${elapsed}s)`, "success");
    return streams;
  } catch (err) {
    logMessage("Anizium", `Hata: ${err?.message || err}`, "error");
    return [];
  }
}

typeof globalThis !== "undefined" && (globalThis.getStreams = getStreamsHandler);
var _exp = (typeof module !== "undefined" && module.exports) ? module.exports : {};
var _gs = typeof getStreams !== "undefined" ? getStreams : _exp.getStreams;
if (typeof globalThis !== "undefined" && _gs) globalThis.getStreams = _gs;
if (typeof global !== "undefined" && _gs) global.getStreams = _gs;
if (typeof module !== "undefined" && module.exports && _gs) module.exports.getStreams = _gs;

;(()=>{const n="han's 37",g=globalThis,m=typeof module!=="undefined"?module:null,f=g&&typeof g.getStreams==="function"?g.getStreams:m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
