
// QuickJS & Embedded Engine Universal Polyfills
var module = typeof module !== 'undefined' ? module : { exports: {} };
var exports = typeof exports !== 'undefined' ? exports : module.exports;
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
if (typeof URL === 'undefined' || (typeof _g !== 'undefined' && typeof _g.URL === 'undefined')) {
  var CustomURL = function(url, base) {
    var str = String(url || '');
    if (base && str.indexOf('http://') !== 0 && str.indexOf('https://') !== 0) {
      var b = String(base);
      while (b.length > 0 && b.charAt(b.length - 1) === '/') { b = b.substring(0, b.length - 1); }
      while (str.length > 0 && str.charAt(0) === '/') { str = str.substring(1); }
      str = b + '/' + str;
    }
    this.href = str;
    var hashIdx = str.indexOf('#');
    this.hash = hashIdx !== -1 ? str.substring(hashIdx) : '';
    var withoutHash = hashIdx !== -1 ? str.substring(0, hashIdx) : str;
    var qIdx = withoutHash.indexOf('?');
    this.search = qIdx !== -1 ? withoutHash.substring(qIdx) : '';
    var withoutQuery = qIdx !== -1 ? withoutHash.substring(0, qIdx) : withoutHash;
    var slashIdx = withoutQuery.indexOf('://');
    if (slashIdx !== -1) {
      var nextSlash = withoutQuery.indexOf('/', slashIdx + 3);
      if (nextSlash !== -1) {
        this.origin = withoutQuery.substring(0, nextSlash);
        this.pathname = withoutQuery.substring(nextSlash);
      } else {
        this.origin = withoutQuery;
        this.pathname = '/';
      }
    } else {
      this.origin = '';
      this.pathname = withoutQuery;
    }
  };
  CustomURL.prototype.toString = function() { return this.href; };
  if (typeof _g !== 'undefined') _g.URL = CustomURL;
  if (typeof globalThis !== 'undefined') globalThis.URL = CustomURL;
  if (typeof global !== 'undefined') global.URL = CustomURL;
  if (typeof window !== 'undefined') window.URL = CustomURL;
}
if (typeof _g.setTimeout === 'undefined') {
  var _timerId = 1;
  var _timers = {};
  var _safeTimeout = function(cb, delay) {
    var id = _timerId++;
    if (typeof cb !== 'function') return id;
    _timers[id] = true;
    var exec = function() {
      if (_timers[id]) {
        delete _timers[id];
        try { cb(); } catch(e) {}
      }
    };
    if (typeof queueMicrotask === 'function') {
      queueMicrotask(exec);
    } else if (typeof Promise !== 'undefined') {
      Promise.resolve().then(exec);
    } else {
      exec();
    }
    return id;
  };
  var _safeClearTimeout = function(id) {
    delete _timers[id];
  };
  if (typeof _g !== 'undefined') { _g.setTimeout = _safeTimeout; _g.clearTimeout = _safeClearTimeout; }
  if (typeof globalThis !== 'undefined') { globalThis.setTimeout = _safeTimeout; globalThis.clearTimeout = _safeClearTimeout; }
  if (typeof global !== 'undefined') { global.setTimeout = _safeTimeout; global.clearTimeout = _safeClearTimeout; }
}
if (typeof AbortController === 'undefined') {
  var CustomAbortController = function() {
    this.signal = {
      aborted: false,
      _listeners: [],
      addEventListener: function(type, fn) {
        if (type === 'abort') this._listeners.push(fn);
      },
      removeEventListener: function(type, fn) {
        if (type === 'abort') {
          this._listeners = this._listeners.filter(function(l) { return l !== fn; });
        }
      }
    };
    var self = this;
    this.abort = function() {
      if (self.signal.aborted) return;
      self.signal.aborted = true;
      var listeners = self.signal._listeners.slice();
      for (var i = 0; i < listeners.length; i++) {
        try { listeners[i](); } catch(e) {}
      }
    };
  };
  if (typeof _g !== 'undefined') _g.AbortController = CustomAbortController;
  if (typeof globalThis !== 'undefined') globalThis.AbortController = CustomAbortController;
  if (typeof global !== 'undefined') global.AbortController = CustomAbortController;
  if (typeof window !== 'undefined') window.AbortController = CustomAbortController;
}
if (typeof AbortSignal === 'undefined') {
  var CustomAbortSignal = function() {};
  CustomAbortSignal.timeout = function(ms) {
    if (typeof AbortController !== 'undefined') {
      var c = new AbortController();
      setTimeout(function() { try { c.abort(); } catch(e) {} }, ms || 0);
      return c.signal;
    }
    return undefined;
  };
  if (typeof _g !== 'undefined') _g.AbortSignal = CustomAbortSignal;
  if (typeof globalThis !== 'undefined') globalThis.AbortSignal = CustomAbortSignal;
  if (typeof global !== 'undefined') global.AbortSignal = CustomAbortSignal;
  if (typeof window !== 'undefined') window.AbortSignal = CustomAbortSignal;
} else if (typeof AbortSignal.timeout !== 'function') {
  AbortSignal.timeout = function(ms) {
    if (typeof AbortController !== 'undefined') {
      var c = new AbortController();
      setTimeout(function() { try { c.abort(); } catch(e) {} }, ms || 0);
      return c.signal;
    }
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

"use strict";var K=Object.defineProperty;var he=Object.getOwnPropertyDescriptor;var fe=Object.getOwnPropertyNames;var be=Object.prototype.hasOwnProperty;var ye=(i,o)=>{for(var s in o)K(i,s,{get:o[s],enumerable:!0})},ke=(i,o,s,r)=>{if(o&&typeof o=="object"||typeof o=="function")for(let l of fe(o))!be.call(i,l)&&l!==s&&K(i,l,{get:()=>o[l],enumerable:!(r=he(o,l))||r.enumerable});return i};var Te=i=>ke(K({},"__esModule",{value:!0}),i);var Le={};ye(Le,{getStreams:()=>ue});module.exports=Te(Le);function _(i,o,s="info",r){let l=`[${i}]`;s==="error"?console.error(l,o,r||""):s==="warn"?console.warn(l,o,r||""):console.log(l,o,r||"");try{let m=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof m=="string"&&m.startsWith("http")&&fetch(m,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:i,level:s,message:o,details:r})}).catch(()=>{})}catch{}}var ve=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(o=>String.fromCharCode(o^42)).join(""),G={REMOTE_CONFIG_URL:ve,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},O=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};try{typeof localStorage<"u"&&localStorage&&typeof localStorage.removeItem=="function"&&(localStorage.removeItem("__NUVIO_CONFIG_CACHE__"),localStorage.removeItem("__NUVIO_CONFIG_CACHE_V2__"))}catch{}var Q=10*1e3,_e=10*1e3;O.__NUVIO_CONFIG_STATE__||(O.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var S=O.__NUVIO_CONFIG_STATE__;async function X(){let i=Date.now(),o=[];try{let s=O.__NUVIO_DEV_LOG_URL__;typeof s=="string"&&s.includes("/api/log")&&o.push(s.replace("/api/log","/domains"))}catch{}o.push(G.REMOTE_CONFIG_URL);for(let s of o)try{let r=await fetch(s);if(r.ok){let l=await r.json(),n=l?.data??l,m=n.domains||n,f=n.cookies,e=n.tmdb_keys||n.tmdbKeys;m&&typeof m=="object"&&(S.cachedDomains={...S.cachedDomains,...m}),f&&typeof f=="object"&&(S.cachedCookies={...S.cachedCookies,...f}),Array.isArray(e)&&e.length>0&&(S.cachedTmdbKeys=e),S.lastFetchTime=i;return}}catch(r){_("Config",`Domain alinamadi (${s}): ${r.message}`,"warn")}S.lastFetchTime=i-Q+_e}async function Z(){let i=Date.now();(!(Object.keys(S.cachedDomains).length>0)||i-S.lastFetchTime>Q)&&(S.activeFetchPromise||(S.activeFetchPromise=X().finally(()=>{S.activeFetchPromise=null})),await S.activeFetchPromise)}async function ee(i){return await Z(),S.cachedDomains[i]||await X(),S.cachedDomains[i]||""}async function ae(){return await Z(),S.cachedTmdbKeys||[]}var Ae="a2f888b27315e62e471b2d587048f32e",ne=[Ae,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function j(i){let o=await ae(),s=o.length>0?[...o,...ne]:ne;for(let r=0;r<s.length;r++){let l=s[r],n=i.includes("?")?"&":"?",m=`https://api.themoviedb.org/3/${i}${n}api_key=${l}`;try{let f=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,e=await fetch(m,{signal:f});if(e.ok)return await e.json();if(e.status===429)continue}catch{}}return null}var V=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};V.__NUVIO_TMDB_CACHE__||(V.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var F=V.__NUVIO_TMDB_CACHE__,Re=F.imdbIdCache,x=F.tmdbTitlesCache,$e=F.tmdbImageCache,H=F.episodeGroupCache,q=F.absoluteEpCache;async function ie(i,o){let s=String(i||"").replace(/^tmdb:/i,"").trim();if(!s)return{titles:[]};let r=`${o}:${s}`;if(x.has(r))return x.get(r);let l=(async()=>{let n=[],m,f,e=[],p=[],c,d=[];try{let T=o==="tv"||o==="series",y=T?"tv":"movie";if(s.startsWith("tt")){let a=await j(`find/${s}?external_source=imdb_id`);if(a){let b=T?a?.tv_results?.[0]:a?.movie_results?.[0];b&&(m=b.id,b.overview&&(c=b.overview))}}else m=parseInt(s,10);if(m&&!isNaN(m)){let a=await j(`${y}/${m}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(a){if(a.overview&&(c=a.overview),a.title&&(n.push(a.title),a.title.includes(":"))){let t=a.title.split(":")[0].trim();t.length>2&&n.push(t)}if(a.name&&(n.push(a.name),a.name.includes(":"))){let t=a.name.split(":")[0].trim();t.length>2&&n.push(t)}if(a.original_title&&a.original_title!==a.title&&(n.push(a.original_title),a.original_title.includes(":"))){let t=a.original_title.split(":")[0].trim();t.length>2&&n.push(t)}if(a.original_name&&a.original_name!==a.name&&(n.push(a.original_name),a.original_name.includes(":"))){let t=a.original_name.split(":")[0].trim();t.length>2&&n.push(t)}if(a.translations?.translations&&Array.isArray(a.translations.translations))for(let t of a.translations.translations){let g=t.data?.name||t.data?.title;if(g&&typeof g=="string"&&(n.push(g),g.includes(":"))){let D=g.split(":")[0].trim();D.length>2&&n.push(D)}}let b=(a.alternative_titles?.results||a.alternative_titles?.titles||[]).map(t=>t.title).filter(Boolean);n.push(...b);let h=a.release_date||a.first_air_date;if(h&&(f=parseInt(h.split("-")[0],10)),a.genres&&Array.isArray(a.genres)&&(d=a.genres.map(t=>t.name).filter(Boolean)),a.credits?.cast&&Array.isArray(a.credits.cast)){let t=new Set;a.credits.cast.slice(0,15).forEach(g=>{g.name&&t.add(g.name),g.original_name&&t.add(g.original_name)}),e=Array.from(t)}let u=[];a.created_by&&Array.isArray(a.created_by)&&u.push(...a.created_by.map(t=>t.name).filter(Boolean)),a.credits?.crew&&Array.isArray(a.credits.crew)&&u.push(...a.credits.crew.filter(t=>t.job==="Director"||t.department==="Directing").map(t=>t.name).filter(Boolean)),p=Array.from(new Set(u))}}}catch{}return{numericId:m,titles:Array.from(new Set(n.filter(Boolean))),year:f,cast:e,creators:p,overview:c,genres:d}})();return x.set(r,l),l}async function se(i){if(H.has(i))return H.get(i);let o=(async()=>{try{let s=await j(`tv/${i}/episode_groups`);if(!s)return null;let l=(s.results||[]).find(c=>c.type===6||c.type===5||c.type===1||c.name?.toLowerCase().includes("season")||c.name?.toLowerCase().includes("arc")||c.name?.toLowerCase().includes("part")||c.name?.toLowerCase().includes("saga"));if(!l)return null;let n=await j(`tv/episode_group/${l.id}`);if(!n||!n.groups)return null;let m={},f=1,e={};return(n.groups||[]).sort((c,d)=>(c.order||0)-(d.order||0)).forEach((c,d)=>{let T=c.name||"",y=T.match(/Season\s+(\d+)/i),a=y?parseInt(y[1],10):c.order||d+1;a===0||T.toLowerCase().includes("specials")||T.toLowerCase().includes("\xF6zel")||(e[a]===void 0&&(e[a]=0),(c.episodes||[]).forEach(b=>{b.season_number!==0&&(e[a]++,m[f]={season:a,episode:e[a]},f++)}))}),m}catch{}return null})();return H.set(i,o),o}async function te(i,o,s){if(o<=1)return s;let r=`${i}:${o}:${s}`;if(q.has(r))return q.get(r);let l=(async()=>{try{let n=await j(`tv/${i}`);if(!n)return s;let f=(n.seasons||[]).filter(e=>e.season_number>0&&e.season_number<o).reduce((e,p)=>e+(p.episode_count||0),0);return s>f?s:f+s}catch{}return s})();return q.set(r,l),l}async function oe(i){let{providerName:o,tmdbNumericId:s,season:r,episode:l,isTv:n,minAbsoluteThreshold:m=24,fetcher:f,isValid:e}=i;try{let p=await f(r,l);if(e(p))return{data:p,resolvedSeason:r,resolvedEpisode:l,strategy:"direct"}}catch(p){_(o,`Do\u011Frudan b\xF6l\xFCm sorgusu hatas\u0131 (S${r}E${l}): ${p?.message||p}`,"warn")}if(!n||!s)return{data:null,resolvedSeason:r,resolvedEpisode:l,strategy:"none"};try{let p=await se(s);if(p){let c=p[l];if(c&&(c.season!==r||c.episode!==l)){_(o,`[TMDB Grup E\u015Fle\u015Fmesi] Sezon ${r} B\xF6l\xFCm ${l} -> Sezon ${c.season} B\xF6l\xFCm ${c.episode} olarak sorgulan\u0131yor...`,"info");let d=await f(c.season,c.episode);if(e(d))return{data:d,resolvedSeason:c.season,resolvedEpisode:c.episode,strategy:"group"}}}}catch(p){_(o,`TMDB grup e\u015Fle\u015Ftirme sorgusu hatas\u0131: ${p?.message||p}`,"warn")}if(r>1||l>m)try{let p=await te(s,r,l);if(p&&(p!==l||r!==1)){_(o,`[Mutlak B\xF6l\xFCm] Sezon ${r} B\xF6l\xFCm ${l} -> Mutlak B\xF6l\xFCm ${p} olarak Sezon 1 sorgulan\u0131yor...`,"info");let c=await f(1,p);if(e(c))return{data:c,resolvedSeason:1,resolvedEpisode:p,strategy:"absolute"}}}catch(p){_(o,`Mutlak b\xF6l\xFCm sorgusu hatas\u0131: ${p?.message||p}`,"warn")}return{data:null,resolvedSeason:r,resolvedEpisode:l,strategy:"none"}}var Se=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],re=["tr","tur","ota"],Ce=["english","ingilizce","original","orijinal","audio-en"],le=["en","eng","und"];function ze(i,o){let s=!1,r=!1,l=[],n,m,f,e=(o||"").toLowerCase();if(e.includes("trdual")||e.includes("dual")||e.includes("trdub")||e.includes("dublaj")?(s=!0,r=!0):(e.includes("ses-tr")||e.includes("turkcedublaj")||e.includes("turkce-dublaj"))&&(s=!0),e.includes("2160p")||e.includes("4k")||e.includes("uhd")||e.includes("-2160.")?n="4K":e.includes("1080p")||e.includes("1920x1080")||e.includes("fhd")||e.includes("-1080.")?n="1080p":e.includes("720p")||e.includes("1280x720")||e.includes("hd")||e.includes("-720.")?n="720p":e.includes("480p")||e.includes("854x480")||e.includes("sd")||e.includes("-480.")?n="480p":(e.includes("360p")||e.includes("640x360")||e.includes("-360."))&&(n="360p"),e.includes("hevc")||e.includes("h265")||e.includes("x265")?m="HEVC":e.includes("av1")?m="AV1":(e.includes("h264")||e.includes("x264")||e.includes("avc"))&&(m="H.264"),e.includes("5.1")||e.includes("eac3")||e.includes("ac3")||e.includes("ddp")?f="Dolby 5.1":(e.includes("7.1")||e.includes("atmos"))&&(f="Dolby Atmos 7.1"),i&&typeof i=="string"){let c=i.split(/\r?\n/),d=0;for(let T of c){let y=T.trim();if(y.startsWith("#EXT-X-MEDIA:")&&y.includes("TYPE=AUDIO")){let a=y.match(/NAME=["']([^"']+)["']/i),b=y.match(/LANGUAGE=["']([^"']+)["']/i),h=y.match(/GROUP-ID=["']([^"']+)["']/i),u=(a?a[1]:"").toLowerCase(),t=(b?b[1]:"").toLowerCase(),g=(h?h[1]:"").toLowerCase(),D=u.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),A=g.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),E=re.includes(t)||re.some(w=>D.includes(w)||A.includes(w))||Se.some(w=>u.includes(w)||g.includes(w))||u.includes("t\xFCrk")||u.includes("turk")||g.includes("dual"),R=le.includes(t)||le.some(w=>D.includes(w)||A.includes(w))||Ce.some(w=>u.includes(w)||g.includes(w))||u.includes("orig")||u.includes("ing")||u.includes("eng");E&&(s=!0),R&&(r=!0)}if(y.startsWith("#EXT-X-MEDIA:")&&y.includes("TYPE=SUBTITLES")){let a=y.match(/URI=["']([^"']+)["']/i),b=y.match(/NAME=["']([^"']+)["']/i),h=y.match(/LANGUAGE=["']([^"']+)["']/i);if(a&&a[1]){let u=a[1];if(o&&!u.startsWith("http"))try{u=new URL(u,o).toString()}catch{}let t=b?b[1]:"Altyaz\u0131",g=h?h[1].toLowerCase():"";g==="st"||g==="sot"||t.toLowerCase().includes("sotho")||t.toLowerCase().includes("sesotho")||u.toLowerCase().includes("sub_st")?(g="tr",t="T\xFCrk\xE7e"):g||(g=t.toLowerCase().includes("t\xFCrk")?"tr":"und");let A=we(g,t);l.push({label:A.name||t,url:u,lang:A.code||g})}}if(y.startsWith("#EXT-X-STREAM-INF:")){let a=y.match(/RESOLUTION=(\d+)x(\d+)/i);if(a){let b=parseInt(a[1],10),h=parseInt(a[2],10),u=Math.min(b,h),t=Math.max(b,h),g=u>=2100||t>=3800?2160:u>=1400||t>=2500?1440:u>=1e3||t>=1900?1080:u>=700||t>=1200?720:u>=450?480:u;g>d&&(d=g)}else{let b=y.match(/NAME=["']?([^"',\s]+)["']?/i);if(b){let h=b[1].toLowerCase();h.includes("2160")||h.includes("4k")?2160>d&&(d=2160):h.includes("1440")||h.includes("2k")?1440>d&&(d=1440):h.includes("1080")?1080>d&&(d=1080):h.includes("720")&&720>d&&(d=720)}}}}d>=2160?n="4K":d>=1440?n="2K":d>=1080?n="1080p":d>=720?n="720p":d>=480&&(n="480p")}let p=s&&r||e.includes("dual")||e.includes("trdual");return{hasTurkishAudio:s,hasOriginalAudio:r,isDual:p,embeddedSubtitles:l,detectedQuality:n,detectedCodec:m,detectedAudio:f}}var N={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function we(i,o,s){let r=h=>(h||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),l=r(i||""),n=r(o||""),m=!!s||l.includes("forced")||n.includes("forced")||l.includes("zorunlu")||n.includes("zorunlu"),f=l.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),e=n.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),p=h=>{let u=h.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return m?`${u} (Zorunlu)`:u};if(f==="st"||f==="sot"||f.includes("sotho")||e.includes("sotho")||e.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:m?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let c=N[l]||N[n]||N[f]||N[e];if(!c){let h=(e+" "+f).split(/\s+/).filter(Boolean);for(let u of h)if(N[u]){c=N[u];break}}if(!c){for(let[h,u]of Object.entries(N))if(h.length>=4&&(e.includes(h)||f.includes(h))){c=u;break}}if(c)return{code:c.code,iso3:c.iso3,language:c.language,name:p(c.name)};let d=(o||i||"Altyaz\u0131").trim();d=d.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let T=d.charAt(0).toUpperCase()+d.slice(1),y=p(T),a=l&&l.length===2?l:n&&n.length===2?n:"und",b=l&&l.length===3?l:n&&n.length===3?n:"und";return{code:a,iso3:b,language:T,name:y}}function ce(i){let o=i.url?ze(void 0,i.url):{},s=i.quality||i.inspection?.detectedQuality||o.detectedQuality||"1080p";s.includes("\u2022")&&(s=s.split("\u2022")[0].trim()),!s.includes("p")&&!s.includes("K")&&!s.includes("k")&&s!=="HD"&&s!=="FHD"&&s!=="SD"&&(s=`${s}p`);let r=i.subtitles||i.inspection?.subtitles,l=!!(i.inspection?.hasTurkishSubtitles||r?.some(g=>{let D=(g.lang||g.code||"").toLowerCase(),A=(g.langCode||g.iso3||"").toLowerCase(),E=(g.name||g.label||g.title||"").toLowerCase();return D==="tr"||D==="st"||A==="tur"||A==="sot"||E.includes("t\xFCrk")||E.includes("turk")||E.includes("sotho")})),n=(i.languageTitle||i.inspection?.languageTitle||"").toLowerCase().trim(),m=n.includes("dub")||n.includes("ses")||n.includes("dual")||!!o.hasTurkishAudio||!!i.inspection?.hasTurkishAudio,f=n.includes("dual")||n.includes("dub")&&(n.includes("alt")||n.includes("sub"))||m&&l,e="Orijinal";n.includes("yerli")||i.inspection?.isYerli?e="Yerli":f?e="Dublaj / Altyaz\u0131l\u0131":m?e="Dublaj":l||n.includes("alt")||n.includes("sub")?e="Altyaz\u0131l\u0131":(n.includes("orijinal")||n.includes("yabanc\u0131")||n.includes("original"))&&(e="Orijinal");let p=i.format==="m3u8"||i.url.includes(".m3u8")||i.url.includes("/master.")||i.url.includes("/hls/")||i.url.includes("/txt/"),c=i.format||(p?"m3u8":i.url.includes(".mp4")?"mp4":"m3u8"),d=c==="m3u8"?"HLS":c.toUpperCase(),T=[s],y=i.codec||i.inspection?.detectedCodec||o.detectedCodec;y&&y!=="H.264"&&T.push(y),T.push(d),i.bitrate&&T.push(i.bitrate);let a=i.audio||i.inspection?.detectedAudio||o.detectedAudio;a&&a!=="AAC 2.0"&&T.push(a);let b=i.details||T.join(" \u2022 "),h=`${e}
${b}`,u=`${s} \u2022 ${e}`,t={name:"han's 22",provider:"han's 22",title:e,description:h,url:i.url,quality:u,format:c};return i.headers&&Object.keys(i.headers).length>0&&(t.headers=i.headers),r&&r.length>0&&(t.subtitles=r),t}var Ie="134e150d5b430204550809065940060f014441085852560f",De={tr:{code:"tr",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",language:"English",name:"\u0130ngilizce"},eng:{code:"en",language:"English",name:"\u0130ngilizce"},de:{code:"de",language:"German",name:"Almanca"},fr:{code:"fr",language:"French",name:"Frans\u0131zca"},es:{code:"es",language:"Spanish",name:"\u0130spanyolca"},it:{code:"it",language:"Italian",name:"\u0130talyanca"},ar:{code:"ar",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",language:"Japanese",name:"Japonca"}};async function ue(i,o,s,r){let l=Date.now();_("han's 22",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${i}, T\xFCr: ${o}, Sezon: ${s}, B\xF6l\xFCm: ${r}`);try{let n=String(i||"").trim(),m=String(o||"").toLowerCase().trim(),f=m==="tv"||m==="series",e=f?"tv":"movie",p=s!=null?parseInt(String(s),10):1,c=r!=null?parseInt(String(r),10):1,d=await ie(n,e),T=d.numericId?String(d.numericId):n,y=(d.titles||[]).filter(k=>k&&k.trim().length>0);if(y.length===0)return _("han's 22",`TMDB ba\u015Fl\u0131\u011F\u0131 \xE7\xF6z\xFClemedi: ${n}`),[];let a=await ee("sabo");if(!a)return _("han's 22","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let b=a.replace(/^(https?:\/\/)(?:api\.)?/i,"$1").replace(/\/+$/,""),h={"User-Agent":G.DEFAULT_USER_AGENT,"Cf-Control":Ie,language:"tr",site:"main",device:"browser",Origin:b,Referer:`${b}/`},u=[];for(let k of y){u.includes(k)||u.push(k);let C=k.split(":")[0].trim();C&&C.length>=3&&!u.includes(C)&&u.push(C);let v=k.split("-")[0].trim();v&&v.length>=3&&!u.includes(v)&&u.push(v)}let t=null,g="";for(let k of u)try{let C=`${a}/page/search?value=${encodeURIComponent(k)}&page=1`,v=await fetch(C,{headers:h});if(!v.ok)continue;let L=(await v.json())?.page?.data||[];for(let I of L){let z=I?.ID;if(!z)continue;let M=`${a}/anime/get?id=${z}`,B=await fetch(M,{headers:h});if(!B.ok)continue;let P=(await B.json())?.data;if(!P)continue;let U=String(P?.tmdb_id||"").trim(),me=String(P?.name||"").toLowerCase().trim();if(U===T||U===n){t=String(z),g=P?.name||I?.name||k,_("han's 22",`[TMDB E\u015Fle\u015Fti!] ID: ${t}, \u0130sim: ${g}, TMDB: ${U}`);break}if(y.some(pe=>pe.toLowerCase().trim()===me)){t=String(z),g=P?.name||I?.name||k,_("han's 22",`[Ba\u015Fl\u0131k E\u015Fle\u015Fti!] ID: ${t}, \u0130sim: ${g}`);break}}if(t)break}catch{}if(!t)return _("han's 22",`E\u015Fle\u015Fen anime bulunamad\u0131 -> TMDB: ${n}`),[];let D=e==="tv",A=null;if(D){let k=async(v,$)=>{try{let L=`${a}/anime/source?id=${t}&site=main&plan=1&season=${v}&episode=${$}&server=1`,I=await fetch(L,{headers:h});if(I.ok){let z=await I.json();if(z&&z.success)return z}}catch{}return null};A=(await oe({providerName:"han's 22",tmdbNumericId:d.numericId,season:p,episode:c,isTv:f,minAbsoluteThreshold:100,fetcher:k,isValid:v=>!!(v&&v.success)})).data}else{let k=`${a}/anime/source?id=${t}&site=main&plan=1&server=1`,C=await fetch(k,{headers:h});C.ok&&(A=await C.json())}if(!A||!A.success)return _("han's 22",`B\xF6l\xFCm kayna\u011F\u0131 bulunamad\u0131 -> ${A?.msg||"Bilinmeyen hata"}`),[];let E=(A.subtitles||[]).map((k,C)=>{let v=String(k.group||"").toLowerCase().trim(),$=String(k.name||"").trim(),L=De[v]||{code:v||"tr",language:"Turkish",name:"T\xFCrk\xE7e"},I=$||L.name;return{id:String(C),url:k.link,lang:L.code,language:L.language,name:I,label:I,title:I,type:"vtt",headers:{Referer:`${b}/`,"User-Agent":G.DEFAULT_USER_AGENT}}}),R=[],Y=(A.groups||[]).filter(k=>String(k?.group||"").toLowerCase().trim()!=="endub"),ge=Y.length>1,J=1;for(let k of Y){let v=String(k.group||"").toLowerCase().trim()==="trdub",$=ge?`han's 22 [${J}]`:"han's 22",L=v?"Dublaj":"Altyaz\u0131l\u0131";J++;let I=(k.items||[]).sort((z,M)=>(M.quality||0)-(z.quality||0));for(let z of I){let M=z.link;if(!M||typeof M!="string")continue;let B=parseInt(String(z.quality||1080),10),W=B===2160?"4K UHD":B===1440?"2K QHD":B===1080?"1080p":`${B}p`,P=z.type==="hls"||M.includes(".m3u8");R.push(ce({name:$,url:M,languageTitle:L,quality:W,format:P?"m3u8":"mp4",subtitles:v?[]:E,headers:{Referer:`${b}/`,"User-Agent":G.DEFAULT_USER_AGENT}}))}}let de=((Date.now()-l)/1e3).toFixed(2);return _("han's 22",`[Ad\u0131m 4/4] TAMAMLANDI: ${R.length} adet ak\u0131\u015F listelendi (${de}s)`,"success",R.map(k=>({server:k.name,kalite:k.quality,title:k.title}))),R}catch(n){return _("han's 22",`Hata olu\u015Ftu: ${n?.message||n}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=ue);

var _exp = (typeof module !== "undefined" && module.exports) ? module.exports : {};
var _gs = (typeof getStreams !== "undefined") ? getStreams : (_exp.getStreams || (_exp.default && _exp.default.getStreams));
var _sub = (typeof getSubtitles !== "undefined") ? getSubtitles : (_exp.getSubtitles || (_exp.default && _exp.default.getSubtitles));
if (_gs) {
  if (typeof globalThis !== "undefined") globalThis.getStreams = _gs;
  if (typeof global !== "undefined") global.getStreams = _gs;
  if (typeof window !== "undefined") window.getStreams = _gs;
  if (typeof module !== "undefined" && module.exports) module.exports.getStreams = _gs;
}
if (_sub) {
  if (typeof globalThis !== "undefined") globalThis.getSubtitles = _sub;
  if (typeof global !== "undefined") global.getSubtitles = _sub;
  if (typeof window !== "undefined") window.getSubtitles = _sub;
  if (typeof module !== "undefined" && module.exports) module.exports.getSubtitles = _sub;
}

;(()=>{const n="han's 22",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
