
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

"use strict";var M=Object.defineProperty;var re=Object.getOwnPropertyDescriptor;var le=Object.getOwnPropertyNames;var ce=Object.prototype.hasOwnProperty;var ue=(n,s)=>{for(var t in s)M(n,t,{get:s[t],enumerable:!0})},ge=(n,s,t,o)=>{if(s&&typeof s=="object"||typeof s=="function")for(let r of le(s))!ce.call(n,r)&&r!==t&&M(n,r,{get:()=>s[r],enumerable:!(o=re(s,r))||o.enumerable});return n};var de=n=>ge(M({},"__esModule",{value:!0}),n);var ve={};ue(ve,{getStreams:()=>ie});module.exports=de(ve);function _(n,s,t="info",o){let r=`[${n}]`;t==="error"?console.error(r,s,o||""):t==="warn"?console.warn(r,s,o||""):console.log(r,s,o||"");try{let l=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof l=="string"&&l.startsWith("http")&&fetch(l,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:n,level:t,message:s,details:o})}).catch(()=>{})}catch{}}var me=[66,94,94,90,89,16,5,5,78,69,71,75,67,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89].map(s=>String.fromCharCode(s^42)).join(""),he=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(s=>String.fromCharCode(s^42)).join(""),K={REMOTE_CONFIG_URL:me,FALLBACK_CONFIG_URL:he,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},L=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},x=2*60*60*1e3,pe=30*1e3;if(!L.__NUVIO_CONFIG_STATE__){let n={},s={},t=[],o=0;try{if(typeof localStorage<"u"&&localStorage){let r=localStorage.getItem("__NUVIO_DOMAINS_CACHE_V3__");if(r){let e=JSON.parse(r);e&&typeof e.domains=="object"&&(n=e.domains,s=e.cookies||{},t=e.tmdbKeys||[],o=typeof e.time=="number"?e.time:0)}}}catch{}L.__NUVIO_CONFIG_STATE__={cachedDomains:n,cachedCookies:s,cachedTmdbKeys:t,lastFetchTime:o,activeFetchPromise:null}}var T=L.__NUVIO_CONFIG_STATE__;async function fe(n=!1){let s=Date.now(),t=[];try{let o=L.__NUVIO_DEV_LOG_URL__;typeof o=="string"&&o.includes("/api/log")&&t.push(o.replace("/api/log","/domains"))}catch{}t.push(K.REMOTE_CONFIG_URL),t.push(K.FALLBACK_CONFIG_URL);for(let o of t)try{let r=await fetch(o);if(r.ok){let e=await r.json(),l=e?.data??e,g=l.domains||l,a=l.cookies,b=l.tmdb_keys||l.tmdbKeys;g&&typeof g=="object"&&(T.cachedDomains={...T.cachedDomains,...g}),a&&typeof a=="object"&&(T.cachedCookies={...T.cachedCookies,...a}),Array.isArray(b)&&b.length>0&&(T.cachedTmdbKeys=b),T.lastFetchTime=s,T.lastFetchSource=o,_("Config",`Domainler basariyla cekildi: ${o}`,"info");try{typeof localStorage<"u"&&localStorage&&localStorage.setItem("__NUVIO_DOMAINS_CACHE_V3__",JSON.stringify({domains:T.cachedDomains,cookies:T.cachedCookies,tmdbKeys:T.cachedTmdbKeys,time:s}))}catch{}return}}catch(r){_("Config",`Domain alinamadi (${o}): ${r.message}`,"warn")}T.lastFetchTime=s-x+pe}async function H(n=!1){let s=Date.now(),t=Object.keys(T.cachedDomains).length>0;(n||!t||s-T.lastFetchTime>x)&&(T.activeFetchPromise||(T.activeFetchPromise=fe(n).finally(()=>{T.activeFetchPromise=null})),await T.activeFetchPromise)}async function $(n){return await H(),T.cachedDomains[n]||""}async function q(){return await H(),T.cachedTmdbKeys||[]}var be="a2f888b27315e62e471b2d587048f32e",V=[be,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function N(n){let s=await q(),t=s.length>0?[...s,...V]:V;for(let o=0;o<t.length;o++){let r=t[o],e=n.includes("?")?"&":"?",l=`https://api.themoviedb.org/3/${n}${e}api_key=${r}`;try{let g=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,a=await fetch(l,{signal:g});if(a.ok)return await a.json();if(a.status===429)continue}catch{}}return null}var R=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};R.__NUVIO_TMDB_CACHE__||(R.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var z=R.__NUVIO_TMDB_CACHE__,D=z.imdbIdCache,P=z.tmdbTitlesCache,Me=z.tmdbImageCache,De=z.episodeGroupCache,Pe=z.absoluteEpCache;async function Y(n,s){let t=String(n||"").replace(/^tmdb:/i,"").trim();if(!t)return null;if(t.startsWith("tt"))return t;let o=`${s}:${t}`;if(D.has(o))return D.get(o);let r=(async()=>{try{let l=await N(`${s==="tv"||s==="series"?"tv":"movie"}/${t}/external_ids`);if(l&&l.imdb_id)return l.imdb_id}catch{}return null})();return D.set(o,r),r}async function W(n,s){let t=String(n||"").replace(/^tmdb:/i,"").trim();if(!t)return{titles:[]};let o=`${s}:${t}`;if(P.has(o))return P.get(o);let r=(async()=>{let e=[],l,g,a=[],b=[],k,u=[];try{let y=s==="tv"||s==="series",h=y?"tv":"movie";if(t.startsWith("tt")){let i=await N(`find/${t}?external_source=imdb_id`);if(i){let d=y?i?.tv_results?.[0]:i?.movie_results?.[0];d&&(l=d.id,d.overview&&(k=d.overview))}}else l=parseInt(t,10);if(l&&!isNaN(l)){let i=await N(`${h}/${l}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(i){if(i.overview&&(k=i.overview),i.title&&(e.push(i.title),i.title.includes(":"))){let c=i.title.split(":")[0].trim();c.length>2&&e.push(c)}if(i.name&&(e.push(i.name),i.name.includes(":"))){let c=i.name.split(":")[0].trim();c.length>2&&e.push(c)}if(i.original_title&&i.original_title!==i.title&&(e.push(i.original_title),i.original_title.includes(":"))){let c=i.original_title.split(":")[0].trim();c.length>2&&e.push(c)}if(i.original_name&&i.original_name!==i.name&&(e.push(i.original_name),i.original_name.includes(":"))){let c=i.original_name.split(":")[0].trim();c.length>2&&e.push(c)}if(i.translations?.translations&&Array.isArray(i.translations.translations))for(let c of i.translations.translations){let p=c.data?.name||c.data?.title;if(p&&typeof p=="string"&&(e.push(p),p.includes(":"))){let C=p.split(":")[0].trim();C.length>2&&e.push(C)}}let d=(i.alternative_titles?.results||i.alternative_titles?.titles||[]).map(c=>c.title).filter(Boolean);e.push(...d);let f=i.release_date||i.first_air_date;if(f&&(g=parseInt(f.split("-")[0],10)),i.genres&&Array.isArray(i.genres)&&(u=i.genres.map(c=>c.name).filter(Boolean)),i.credits?.cast&&Array.isArray(i.credits.cast)){let c=new Set;i.credits.cast.slice(0,15).forEach(p=>{p.name&&c.add(p.name),p.original_name&&c.add(p.original_name)}),a=Array.from(c)}let m=[];i.created_by&&Array.isArray(i.created_by)&&m.push(...i.created_by.map(c=>c.name).filter(Boolean)),i.credits?.crew&&Array.isArray(i.credits.crew)&&m.push(...i.credits.crew.filter(c=>c.job==="Director"||c.department==="Directing").map(c=>c.name).filter(Boolean)),b=Array.from(new Set(m))}}}catch{}return{numericId:l,titles:Array.from(new Set(e.filter(Boolean))),year:g,cast:a,creators:b,overview:k,genres:u}})();return P.set(o,r),r}var ke=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],J=["tr","tur","ota"],ye=["english","ingilizce","original","orijinal","audio-en"],X=["en","eng","und"];function Z(n,s){let t=!1,o=!1,r=[],e,l,g,a=(s||"").toLowerCase();if(a.includes("trdual")||a.includes("dual")||a.includes("trdub")||a.includes("dublaj")?(t=!0,o=!0):(a.includes("ses-tr")||a.includes("turkcedublaj")||a.includes("turkce-dublaj"))&&(t=!0),a.includes("2160p")||a.includes("4k")||a.includes("uhd")||a.includes("-2160.")?e="4K":a.includes("1080p")||a.includes("1920x1080")||a.includes("fhd")||a.includes("-1080.")?e="1080p":a.includes("720p")||a.includes("1280x720")||a.includes("hd")||a.includes("-720.")?e="720p":a.includes("480p")||a.includes("854x480")||a.includes("sd")||a.includes("-480.")?e="480p":(a.includes("360p")||a.includes("640x360")||a.includes("-360."))&&(e="360p"),a.includes("hevc")||a.includes("h265")||a.includes("x265")?l="HEVC":a.includes("av1")?l="AV1":(a.includes("h264")||a.includes("x264")||a.includes("avc"))&&(l="H.264"),a.includes("5.1")||a.includes("eac3")||a.includes("ac3")||a.includes("ddp")?g="Dolby 5.1":(a.includes("7.1")||a.includes("atmos"))&&(g="Dolby Atmos 7.1"),n&&typeof n=="string"){let k=n.split(/\r?\n/),u=0;for(let y of k){let h=y.trim();if(h.startsWith("#EXT-X-MEDIA:")&&h.includes("TYPE=AUDIO")){let i=h.match(/NAME=["']([^"']+)["']/i),d=h.match(/LANGUAGE=["']([^"']+)["']/i),f=h.match(/GROUP-ID=["']([^"']+)["']/i),m=(i?i[1]:"").toLowerCase(),c=(d?d[1]:"").toLowerCase(),p=(f?f[1]:"").toLowerCase(),C=m.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),S=p.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),v=J.includes(c)||J.some(A=>C.includes(A)||S.includes(A))||ke.some(A=>m.includes(A)||p.includes(A))||m.includes("t\xFCrk")||m.includes("turk")||p.includes("dual"),G=X.includes(c)||X.some(A=>C.includes(A)||S.includes(A))||ye.some(A=>m.includes(A)||p.includes(A))||m.includes("orig")||m.includes("ing")||m.includes("eng");v&&(t=!0),G&&(o=!0)}if(h.startsWith("#EXT-X-MEDIA:")&&h.includes("TYPE=SUBTITLES")){let i=h.match(/URI=["']([^"']+)["']/i),d=h.match(/NAME=["']([^"']+)["']/i),f=h.match(/LANGUAGE=["']([^"']+)["']/i);if(i&&i[1]){let m=i[1];if(s&&!m.startsWith("http"))try{m=new URL(m,s).toString()}catch{}let c=d?d[1]:"Altyaz\u0131",p=f?f[1].toLowerCase():"";p==="st"||p==="sot"||c.toLowerCase().includes("sotho")||c.toLowerCase().includes("sesotho")||m.toLowerCase().includes("sub_st")?(p="tr",c="T\xFCrk\xE7e"):p||(p=c.toLowerCase().includes("t\xFCrk")?"tr":"und");let S=ee(p,c);r.push({label:S.name||c,url:m,lang:S.code||p})}}if(h.startsWith("#EXT-X-STREAM-INF:")){let i=h.match(/RESOLUTION=(\d+)x(\d+)/i);if(i){let d=parseInt(i[1],10),f=parseInt(i[2],10),m=Math.min(d,f),c=Math.max(d,f),p=m>=2100||c>=3800?2160:m>=1400||c>=2500?1440:m>=1e3||c>=1900?1080:m>=700||c>=1200?720:m>=450?480:m;p>u&&(u=p)}else{let d=h.match(/NAME=["']?([^"',\s]+)["']?/i);if(d){let f=d[1].toLowerCase();f.includes("2160")||f.includes("4k")?2160>u&&(u=2160):f.includes("1440")||f.includes("2k")?1440>u&&(u=1440):f.includes("1080")?1080>u&&(u=1080):f.includes("720")&&720>u&&(u=720)}}}}u>=2160?e="4K":u>=1440?e="2K":u>=1080?e="1080p":u>=720?e="720p":u>=480&&(e="480p")}let b=t&&o||a.includes("dual")||a.includes("trdual");return{hasTurkishAudio:t,hasOriginalAudio:o,isDual:b,embeddedSubtitles:r,detectedQuality:e,detectedCodec:l,detectedAudio:g}}function Te(n){let{hasTurkishAudio:s,hasOriginalAudio:t,isDual:o,hasSubtitles:r,hasTurkishSubtitles:e,isYerli:l,siteHint:g,defaultTitle:a}=n;if(l||g?.isYerli)return"Yerli";if(g?.label){let b=g.label.toLowerCase();if((b.includes("dub")||b.includes("t\xFCrk"))&&(b.includes("alt")||b.includes("sub")))return"Dublaj / Altyaz\u0131l\u0131";if(b.includes("dub")||b.includes("t\xFCrk\xE7e ses"))return"Dublaj";if(b.includes("alt")||b.includes("sub"))return"Altyaz\u0131l\u0131";if(b.includes("orijinal")||b.includes("original"))return"Orijinal"}return o||s&&(t||e)?"Dublaj / Altyaz\u0131l\u0131":s||g?.isDublaj?"Dublaj":e||g?.isAltyazi?"Altyaz\u0131l\u0131":a||(s?"Dublaj":"Orijinal")}var w={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function ee(n,s,t){let o=f=>(f||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),r=o(n||""),e=o(s||""),l=!!t||r.includes("forced")||e.includes("forced")||r.includes("zorunlu")||e.includes("zorunlu"),g=r.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),a=e.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),b=f=>{let m=f.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return l?`${m} (Zorunlu)`:m};if(g==="st"||g==="sot"||g.includes("sotho")||a.includes("sotho")||a.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:l?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let k=w[r]||w[e]||w[g]||w[a];if(!k){let f=(a+" "+g).split(/\s+/).filter(Boolean);for(let m of f)if(w[m]){k=w[m];break}}if(!k){for(let[f,m]of Object.entries(w))if(f.length>=4&&(a.includes(f)||g.includes(f))){k=m;break}}if(k)return{code:k.code,iso3:k.iso3,language:k.language,name:b(k.name)};let u=(s||n||"Altyaz\u0131").trim();u=u.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let y=u.charAt(0).toUpperCase()+u.slice(1),h=b(y),i=r&&r.length===2?r:e&&e.length===2?e:"und",d=r&&r.length===3?r:e&&e.length===3?e:"und";return{code:i,iso3:d,language:y,name:h}}function Q(n,s){let t=[],o=new Set,r=[...n||[],...s||[]];for(let e of r){if(!e||!e.url)continue;let l=e.url.trim();if(o.has(l))continue;o.add(l);let g=ee(e.lang,e.label||e.name||e.language),a=g.name||e.label||e.name||"Altyaz\u0131";t.push({id:String(t.length),url:l,label:a,name:a,language:g.language,lang:g.code,langCode:g.iso3,headers:e.headers})}return t}function ae(n){let{m3u8Text:s,m3u8Url:t,externalSubtitles:o,siteHint:r,defaultTitle:e}=n,l=Z(s,t),g=Q(o),a=Q(o,l.embeddedSubtitles),b=a.length>0||!!r?.isAltyazi,k=a.some(d=>d.lang==="tr"||d.lang==="st"||d.lang==="sot"||d.langCode==="tur"||d.langCode==="sot"||d.label?.toLowerCase().includes("t\xFCrk")||d.label?.toLowerCase().includes("sotho")||d.language==="Turkish"||d.language?.toLowerCase().includes("sotho")),u=l.hasTurkishAudio||!!r?.isDublaj,y=l.hasOriginalAudio,h=l.isDual||u&&(k||y),i=Te({hasTurkishAudio:u,hasOriginalAudio:y,isDual:h,hasSubtitles:b,hasTurkishSubtitles:k,isYerli:r?.isYerli,siteHint:r,defaultTitle:e});return{hasTurkishAudio:u,hasOriginalAudio:y,isDual:h,hasSubtitles:b,hasTurkishSubtitles:k,isYerli:r?.isYerli,languageTitle:i,subtitles:g,detectedQuality:l.detectedQuality,detectedCodec:l.detectedCodec,detectedAudio:l.detectedAudio}}function ne(n){let s=n.url?Z(void 0,n.url):{},t=n.quality||n.inspection?.detectedQuality||s.detectedQuality||"1080p";t.includes("\u2022")&&(t=t.split("\u2022")[0].trim()),!t.includes("p")&&!t.includes("K")&&!t.includes("k")&&t!=="HD"&&t!=="FHD"&&t!=="SD"&&(t=`${t}p`);let o=n.subtitles||n.inspection?.subtitles,r=!!(n.inspection?.hasTurkishSubtitles||o?.some(p=>{let C=(p.lang||p.code||"").toLowerCase(),S=(p.langCode||p.iso3||"").toLowerCase(),v=(p.name||p.label||p.title||"").toLowerCase();return C==="tr"||C==="st"||S==="tur"||S==="sot"||v.includes("t\xFCrk")||v.includes("turk")||v.includes("sotho")})),e=(n.languageTitle||n.inspection?.languageTitle||"").toLowerCase().trim(),l=e.includes("dub")||e.includes("ses")||e.includes("dual")||!!s.hasTurkishAudio||!!n.inspection?.hasTurkishAudio,g=e.includes("dual")||e.includes("dub")&&(e.includes("alt")||e.includes("sub"))||l&&r,a="Orijinal";e.includes("yerli")||n.inspection?.isYerli?a="Yerli":g?a="Dublaj / Altyaz\u0131l\u0131":l?a="Dublaj":r||e.includes("alt")||e.includes("sub")?a="Altyaz\u0131l\u0131":(e.includes("orijinal")||e.includes("yabanc\u0131")||e.includes("original"))&&(a="Orijinal");let b=n.format==="m3u8"||n.url.includes(".m3u8")||n.url.includes("/master.")||n.url.includes("/hls/")||n.url.includes("/txt/"),k=n.format||(b?"m3u8":n.url.includes(".mp4")?"mp4":"m3u8"),u=k==="m3u8"?"HLS":k.toUpperCase(),y=[t],h=n.codec||n.inspection?.detectedCodec||s.detectedCodec;h&&h!=="H.264"&&y.push(h),y.push(u),n.bitrate&&y.push(n.bitrate);let i=n.audio||n.inspection?.detectedAudio||s.detectedAudio;i&&i!=="AAC 2.0"&&y.push(i);let d=n.details||y.join(" \u2022 "),f=`${a}
${d}`,m=`${t} \u2022 ${a}`,c={name:"han's 10",provider:"han's 10",title:a,description:f,url:n.url,quality:m,format:k};return n.headers&&Object.keys(n.headers).length>0&&(c.headers=n.headers),o&&o.length>0&&(c.subtitles=o),c}function _e(n,s){let t=[];try{let o=n.match(/(?:tracks|baseTracks)\s*[:=]\s*\[([\s\S]*?)\]/);if(!o)return t;let e=o[1].match(/\{[\s\S]*?\}/g)||[],l=new URL(s),g=`${l.protocol}//${l.host}`;for(let a=0;a<e.length;a++){let b=e[a];if(b.toLowerCase().includes("thumbnail"))continue;let k=b.match(/file\s*:\s*["']([^"']+)["']/);if(!k)continue;let u=k[1].replace(/\\\//g,"/");u.startsWith("/")&&(u=g+u);let y=b.match(/label\s*:\s*["']([^"']+)["']/),h=y?y[1]:"T\xFCrk\xE7e";try{h=JSON.parse(`"${h}"`)}catch{}let i=h.toLowerCase().includes("turk")||h.toLowerCase().includes("t\xFCrk")||u.includes("_tr"),d=h.toLowerCase().includes("eng")||h.toLowerCase().includes("ing")||u.includes("_en");t.push({id:String(a),url:u,language:i?"Turkish":d?"English":"Turkish",name:i?"T\xFCrk\xE7e":d?"\u0130ngilizce":h,lang:i?"tur":d?"eng":"tur",label:i?"T\xFCrk\xE7e":d?"\u0130ngilizce":h,headers:{Referer:g+"/",Origin:g,"User-Agent":"okhttp/4.9.2"}})}}catch{}return t}async function ie(n,s,t,o){let r=Date.now();_("han's 10",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${n}, T\xFCr: ${s}`);try{let e=String(n||"").trim(),l=String(s||"").toLowerCase().trim();if(l==="tv"||l==="series"||l==="show")return _("han's 10","han's 10 kayna\u011F\u0131 sadece filmleri destekler (Dizi atland\u0131).","info"),[];if(!e)return[];_("han's 10",`[Ad\u0131m 1/4] IMDb ID \xE7\xF6z\xFCmleniyor (${e})...`);let a=await Y(e,"movie"),k=(await W(e,"movie"))?.titles?.[0]||"Film";if(!a)return _("han's 10",`IMDb ID bulunamad\u0131: ${e}`,"error"),[];let u=await $("garp");if(!u)return _("han's 10","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let y={"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",Referer:u+"/",Origin:u,"X-Requested-With":"XMLHttpRequest"};_("han's 10",`[Ad\u0131m 2/4] Kesin IMDb aramas\u0131 yap\u0131l\u0131yor (${a})...`);let h=`${u}/wp-admin/admin-ajax.php`,i=`action=live_search&keyword=${encodeURIComponent(a)}`,f=await(await fetch(h,{method:"POST",headers:y,body:i})).text(),m=f.match(/<a\b[^>]*href=["']([^"']+)["']/i)||f.match(/href=["'](https?:\/\/[^"']+)["']/i);if(!m)return _("han's 10",`${a} ile e\u015Fle\u015Fen film bulunamad\u0131.`,"warn"),[];let c=m[1];_("han's 10",`Film bulundu: "${k}"`,"success"),_("han's 10","[Ad\u0131m 3/4] Video oynat\u0131c\u0131 \xE7\xF6z\xFCmleniyor...");let C=await(await fetch(c,{headers:{"User-Agent":y["User-Agent"],Referer:u+"/"}})).text(),S=C.match(/<iframe[^>]+(?:data-litespeed-src|data-src|src)="([^"]+)"/i)||C.match(/(?:data-litespeed-src|data-src|src)="(\/bemoly\/[^"]+)"/i);if(!S)return _("han's 10","Film sayfas\u0131nda video iframe bulunamad\u0131.","warn"),[];let v=S[1];if(v.startsWith("/")&&(v=u+v),v.includes("bemoly.php")){let O=(await(await fetch(v,{headers:{"User-Agent":y["User-Agent"],Referer:c}})).text()).match(/<iframe[^>]+src="([^"]+)"/i);O&&(v=O[1])}let A=await(await fetch(v,{headers:{"User-Agent":y["User-Agent"],Referer:c}})).text(),B=A.match(/file\s*:\s*["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/);if(!B)return _("han's 10","Video ak\u0131\u015F\u0131 \xE7\xF6z\xFCmlenemedi.","warn"),[];let E=B[1],j=_e(A,v),I=u;try{I=new URL(v).origin}catch{}let te={Referer:I+"/",Origin:I,"User-Agent":"okhttp/4.9.2"},se=A.toLowerCase().includes("dublaj")||A.toLowerCase().includes("dual"),F=ae({m3u8Url:E,externalSubtitles:j,siteHint:{isDublaj:se,isAltyazi:j.length>0}}),U=ne({name:"han's 10",url:E,inspection:F,quality:"1080p",format:"m3u8",headers:te}),oe=((Date.now()-r)/1e3).toFixed(2);return _("han's 10",`[Ad\u0131m 4/4] TAMAMLANDI: 1080p HLS ak\u0131\u015F\u0131 haz\u0131rland\u0131 (${oe}s)`,"success",{dil:U.title,altyaz\u0131lar:F.subtitles.length}),[U]}catch(e){return _("han's 10",`Kritik Hata: ${e.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=ie);

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

;(()=>{const n="han's 10",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
