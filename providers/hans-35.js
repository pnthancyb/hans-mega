
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

"use strict";var B=Object.defineProperty;var X=Object.getOwnPropertyDescriptor;var Z=Object.getOwnPropertyNames;var ee=Object.prototype.hasOwnProperty;var ae=(n,t)=>{for(var s in t)B(n,s,{get:t[s],enumerable:!0})},ne=(n,t,s,l)=>{if(t&&typeof t=="object"||typeof t=="function")for(let c of Z(t))!ee.call(n,c)&&c!==s&&B(n,c,{get:()=>t[c],enumerable:!(l=X(t,c))||l.enumerable});return n};var ie=n=>ne(B({},"__esModule",{value:!0}),n);var me={};ae(me,{getStreams:()=>Q});module.exports=ie(me);function A(n,t,s="info",l){let c=`[${n}]`;s==="error"?console.error(c,t,l||""):s==="warn"?console.warn(c,t,l||""):console.log(c,t,l||"");try{let d=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof d=="string"&&d.startsWith("http")&&fetch(d,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:n,level:s,message:t,details:l})}).catch(()=>{})}catch{}}var se=[66,94,94,90,89,16,5,5,78,69,71,75,67,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89].map(t=>String.fromCharCode(t^42)).join(""),te=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(t=>String.fromCharCode(t^42)).join(""),M={REMOTE_CONFIG_URL:se,FALLBACK_CONFIG_URL:te,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},E=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},O=2*60*60*1e3,oe=30*1e3;if(!E.__NUVIO_CONFIG_STATE__){let n={},t={},s=[],l=0;try{if(typeof localStorage<"u"&&localStorage){let c=localStorage.getItem("__NUVIO_DOMAINS_CACHE_V3__");if(c){let e=JSON.parse(c);e&&typeof e.domains=="object"&&(n=e.domains,t=e.cookies||{},s=e.tmdbKeys||[],l=typeof e.time=="number"?e.time:0)}}}catch{}E.__NUVIO_CONFIG_STATE__={cachedDomains:n,cachedCookies:t,cachedTmdbKeys:s,lastFetchTime:l,activeFetchPromise:null}}var S=E.__NUVIO_CONFIG_STATE__;async function re(n=!1){let t=Date.now(),s=[];try{let l=E.__NUVIO_DEV_LOG_URL__;typeof l=="string"&&l.includes("/api/log")&&s.push(l.replace("/api/log","/domains"))}catch{}s.push(M.REMOTE_CONFIG_URL),s.push(M.FALLBACK_CONFIG_URL);for(let l of s)try{let c=await fetch(l);if(c.ok){let e=await c.json(),d=e?.data??e,b=d.domains||d,a=d.cookies,z=d.tmdb_keys||d.tmdbKeys;b&&typeof b=="object"&&(S.cachedDomains={...S.cachedDomains,...b}),a&&typeof a=="object"&&(S.cachedCookies={...S.cachedCookies,...a}),Array.isArray(z)&&z.length>0&&(S.cachedTmdbKeys=z),S.lastFetchTime=t,S.lastFetchSource=l,A("Config",`Domainler basariyla cekildi: ${l}`,"info");try{typeof localStorage<"u"&&localStorage&&localStorage.setItem("__NUVIO_DOMAINS_CACHE_V3__",JSON.stringify({domains:S.cachedDomains,cookies:S.cachedCookies,tmdbKeys:S.cachedTmdbKeys,time:t}))}catch{}return}}catch(c){A("Config",`Domain alinamadi (${l}): ${c.message}`,"warn")}S.lastFetchTime=t-O+oe}async function G(n=!1){let t=Date.now(),s=Object.keys(S.cachedDomains).length>0;(n||!s||t-S.lastFetchTime>O)&&(S.activeFetchPromise||(S.activeFetchPromise=re(n).finally(()=>{S.activeFetchPromise=null})),await S.activeFetchPromise)}async function x(n){return await G(),S.cachedDomains[n]||""}async function K(){return await G(),S.cachedTmdbKeys||[]}var le="a2f888b27315e62e471b2d587048f32e",$=[le,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function F(n){let t=await K(),s=t.length>0?[...t,...$]:$;for(let l=0;l<s.length;l++){let c=s[l],e=n.includes("?")?"&":"?",d=`https://api.themoviedb.org/3/${n}${e}api_key=${c}`;try{let b=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,a=await fetch(d,{signal:b});if(a.ok)return await a.json();if(a.status===429)continue}catch{}}return null}var R=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};R.__NUVIO_TMDB_CACHE__||(R.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var D=R.__NUVIO_TMDB_CACHE__,N=D.imdbIdCache,j=D.tmdbTitlesCache,ke=D.tmdbImageCache,_e=D.episodeGroupCache,Te=D.absoluteEpCache;async function H(n,t){let s=String(n||"").replace(/^tmdb:/i,"").trim();if(!s)return null;if(s.startsWith("tt"))return s;let l=`${t}:${s}`;if(N.has(l))return N.get(l);let c=(async()=>{try{let d=await F(`${t==="tv"||t==="series"?"tv":"movie"}/${s}/external_ids`);if(d&&d.imdb_id)return d.imdb_id}catch{}return null})();return N.set(l,c),c}async function q(n,t){let s=String(n||"").replace(/^tmdb:/i,"").trim();if(!s)return{titles:[]};let l=`${t}:${s}`;if(j.has(l))return j.get(l);let c=(async()=>{let e=[],d,b,a=[],z=[],f,g=[];try{let w=t==="tv"||t==="series",y=w?"tv":"movie";if(s.startsWith("tt")){let i=await F(`find/${s}?external_source=imdb_id`);if(i){let h=w?i?.tv_results?.[0]:i?.movie_results?.[0];h&&(d=h.id,h.overview&&(f=h.overview))}}else d=parseInt(s,10);if(d&&!isNaN(d)){let i=await F(`${y}/${d}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(i){if(i.overview&&(f=i.overview),i.title&&(e.push(i.title),i.title.includes(":"))){let r=i.title.split(":")[0].trim();r.length>2&&e.push(r)}if(i.name&&(e.push(i.name),i.name.includes(":"))){let r=i.name.split(":")[0].trim();r.length>2&&e.push(r)}if(i.original_title&&i.original_title!==i.title&&(e.push(i.original_title),i.original_title.includes(":"))){let r=i.original_title.split(":")[0].trim();r.length>2&&e.push(r)}if(i.original_name&&i.original_name!==i.name&&(e.push(i.original_name),i.original_name.includes(":"))){let r=i.original_name.split(":")[0].trim();r.length>2&&e.push(r)}if(i.translations?.translations&&Array.isArray(i.translations.translations))for(let r of i.translations.translations){let o=r.data?.name||r.data?.title;if(o&&typeof o=="string"&&(e.push(o),o.includes(":"))){let p=o.split(":")[0].trim();p.length>2&&e.push(p)}}let h=(i.alternative_titles?.results||i.alternative_titles?.titles||[]).map(r=>r.title).filter(Boolean);e.push(...h);let m=i.release_date||i.first_air_date;if(m&&(b=parseInt(m.split("-")[0],10)),i.genres&&Array.isArray(i.genres)&&(g=i.genres.map(r=>r.name).filter(Boolean)),i.credits?.cast&&Array.isArray(i.credits.cast)){let r=new Set;i.credits.cast.slice(0,15).forEach(o=>{o.name&&r.add(o.name),o.original_name&&r.add(o.original_name)}),a=Array.from(r)}let u=[];i.created_by&&Array.isArray(i.created_by)&&u.push(...i.created_by.map(r=>r.name).filter(Boolean)),i.credits?.crew&&Array.isArray(i.credits.crew)&&u.push(...i.credits.crew.filter(r=>r.job==="Director"||r.department==="Directing").map(r=>r.name).filter(Boolean)),z=Array.from(new Set(u))}}}catch{}return{numericId:d,titles:Array.from(new Set(e.filter(Boolean))),year:b,cast:a,creators:z,overview:f,genres:g}})();return j.set(l,c),c}var ce=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],Y=["tr","tur","ota"],ue=["english","ingilizce","original","orijinal","audio-en"],V=["en","eng","und"];function ge(n,t){let s=!1,l=!1,c=[],e,d,b,a=(t||"").toLowerCase();if(a.includes("trdual")||a.includes("dual")||a.includes("trdub")||a.includes("dublaj")?(s=!0,l=!0):(a.includes("ses-tr")||a.includes("turkcedublaj")||a.includes("turkce-dublaj"))&&(s=!0),a.includes("2160p")||a.includes("4k")||a.includes("uhd")||a.includes("-2160.")?e="4K":a.includes("1080p")||a.includes("1920x1080")||a.includes("fhd")||a.includes("-1080.")?e="1080p":a.includes("720p")||a.includes("1280x720")||a.includes("hd")||a.includes("-720.")?e="720p":a.includes("480p")||a.includes("854x480")||a.includes("sd")||a.includes("-480.")?e="480p":(a.includes("360p")||a.includes("640x360")||a.includes("-360."))&&(e="360p"),a.includes("hevc")||a.includes("h265")||a.includes("x265")?d="HEVC":a.includes("av1")?d="AV1":(a.includes("h264")||a.includes("x264")||a.includes("avc"))&&(d="H.264"),a.includes("5.1")||a.includes("eac3")||a.includes("ac3")||a.includes("ddp")?b="Dolby 5.1":(a.includes("7.1")||a.includes("atmos"))&&(b="Dolby Atmos 7.1"),n&&typeof n=="string"){let f=n.split(/\r?\n/),g=0;for(let w of f){let y=w.trim();if(y.startsWith("#EXT-X-MEDIA:")&&y.includes("TYPE=AUDIO")){let i=y.match(/NAME=["']([^"']+)["']/i),h=y.match(/LANGUAGE=["']([^"']+)["']/i),m=y.match(/GROUP-ID=["']([^"']+)["']/i),u=(i?i[1]:"").toLowerCase(),r=(h?h[1]:"").toLowerCase(),o=(m?m[1]:"").toLowerCase(),p=u.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),_=o.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),k=Y.includes(r)||Y.some(T=>p.includes(T)||_.includes(T))||ce.some(T=>u.includes(T)||o.includes(T))||u.includes("t\xFCrk")||u.includes("turk")||o.includes("dual"),C=V.includes(r)||V.some(T=>p.includes(T)||_.includes(T))||ue.some(T=>u.includes(T)||o.includes(T))||u.includes("orig")||u.includes("ing")||u.includes("eng");k&&(s=!0),C&&(l=!0)}if(y.startsWith("#EXT-X-MEDIA:")&&y.includes("TYPE=SUBTITLES")){let i=y.match(/URI=["']([^"']+)["']/i),h=y.match(/NAME=["']([^"']+)["']/i),m=y.match(/LANGUAGE=["']([^"']+)["']/i);if(i&&i[1]){let u=i[1];if(t&&!u.startsWith("http"))try{u=new URL(u,t).toString()}catch{}let r=h?h[1]:"Altyaz\u0131",o=m?m[1].toLowerCase():"";o==="st"||o==="sot"||r.toLowerCase().includes("sotho")||r.toLowerCase().includes("sesotho")||u.toLowerCase().includes("sub_st")?(o="tr",r="T\xFCrk\xE7e"):o||(o=r.toLowerCase().includes("t\xFCrk")?"tr":"und");let _=de(o,r);c.push({label:_.name||r,url:u,lang:_.code||o})}}if(y.startsWith("#EXT-X-STREAM-INF:")){let i=y.match(/RESOLUTION=(\d+)x(\d+)/i);if(i){let h=parseInt(i[1],10),m=parseInt(i[2],10),u=Math.min(h,m),r=Math.max(h,m),o=u>=2100||r>=3800?2160:u>=1400||r>=2500?1440:u>=1e3||r>=1900?1080:u>=700||r>=1200?720:u>=450?480:u;o>g&&(g=o)}else{let h=y.match(/NAME=["']?([^"',\s]+)["']?/i);if(h){let m=h[1].toLowerCase();m.includes("2160")||m.includes("4k")?2160>g&&(g=2160):m.includes("1440")||m.includes("2k")?1440>g&&(g=1440):m.includes("1080")?1080>g&&(g=1080):m.includes("720")&&720>g&&(g=720)}}}}g>=2160?e="4K":g>=1440?e="2K":g>=1080?e="1080p":g>=720?e="720p":g>=480&&(e="480p")}let z=s&&l||a.includes("dual")||a.includes("trdual");return{hasTurkishAudio:s,hasOriginalAudio:l,isDual:z,embeddedSubtitles:c,detectedQuality:e,detectedCodec:d,detectedAudio:b}}var L={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function de(n,t,s){let l=m=>(m||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),c=l(n||""),e=l(t||""),d=!!s||c.includes("forced")||e.includes("forced")||c.includes("zorunlu")||e.includes("zorunlu"),b=c.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),a=e.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),z=m=>{let u=m.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return d?`${u} (Zorunlu)`:u};if(b==="st"||b==="sot"||b.includes("sotho")||a.includes("sotho")||a.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:d?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let f=L[c]||L[e]||L[b]||L[a];if(!f){let m=(a+" "+b).split(/\s+/).filter(Boolean);for(let u of m)if(L[u]){f=L[u];break}}if(!f){for(let[m,u]of Object.entries(L))if(m.length>=4&&(a.includes(m)||b.includes(m))){f=u;break}}if(f)return{code:f.code,iso3:f.iso3,language:f.language,name:z(f.name)};let g=(t||n||"Altyaz\u0131").trim();g=g.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let w=g.charAt(0).toUpperCase()+g.slice(1),y=z(w),i=c&&c.length===2?c:e&&e.length===2?e:"und",h=c&&c.length===3?c:e&&e.length===3?e:"und";return{code:i,iso3:h,language:w,name:y}}function W(n){let t=n.url?ge(void 0,n.url):{},s=n.quality||n.inspection?.detectedQuality||t.detectedQuality||"1080p";s.includes("\u2022")&&(s=s.split("\u2022")[0].trim()),!s.includes("p")&&!s.includes("K")&&!s.includes("k")&&s!=="HD"&&s!=="FHD"&&s!=="SD"&&(s=`${s}p`);let l=n.subtitles||n.inspection?.subtitles,c=!!(n.inspection?.hasTurkishSubtitles||l?.some(o=>{let p=(o.lang||o.code||"").toLowerCase(),_=(o.langCode||o.iso3||"").toLowerCase(),k=(o.name||o.label||o.title||"").toLowerCase();return p==="tr"||p==="st"||_==="tur"||_==="sot"||k.includes("t\xFCrk")||k.includes("turk")||k.includes("sotho")})),e=(n.languageTitle||n.inspection?.languageTitle||"").toLowerCase().trim(),d=e.includes("dub")||e.includes("ses")||e.includes("dual")||!!t.hasTurkishAudio||!!n.inspection?.hasTurkishAudio,b=e.includes("dual")||e.includes("dub")&&(e.includes("alt")||e.includes("sub"))||d&&c,a="Orijinal";e.includes("yerli")||n.inspection?.isYerli?a="Yerli":b?a="Dublaj / Altyaz\u0131l\u0131":d?a="Dublaj":c||e.includes("alt")||e.includes("sub")?a="Altyaz\u0131l\u0131":(e.includes("orijinal")||e.includes("yabanc\u0131")||e.includes("original"))&&(a="Orijinal");let z=n.format==="m3u8"||n.url.includes(".m3u8")||n.url.includes("/master.")||n.url.includes("/hls/")||n.url.includes("/txt/"),f=n.format||(z?"m3u8":n.url.includes(".mp4")?"mp4":"m3u8"),g=f==="m3u8"?"HLS":f.toUpperCase(),w=[s],y=n.codec||n.inspection?.detectedCodec||t.detectedCodec;y&&y!=="H.264"&&w.push(y),w.push(g),n.bitrate&&w.push(n.bitrate);let i=n.audio||n.inspection?.detectedAudio||t.detectedAudio;i&&i!=="AAC 2.0"&&w.push(i);let h=n.details||w.join(" \u2022 "),m=`${a}
${h}`,u=`${s} \u2022 ${a}`,r={name:"han's 35",provider:"han's 35",title:a,description:m,url:n.url,quality:u,format:f};return n.headers&&Object.keys(n.headers).length>0&&(r.headers=n.headers),l&&l.length>0&&(r.subtitles=l),r}var J=["1080p","720p","480p"];async function Q(n,t,s,l){let c=Date.now();A("han's 35",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${n}, T\xFCr: ${t}, Sezon: ${s}, B\xF6l\xFCm: ${l}`);try{let e=String(t||"").toLowerCase().trim(),d=e==="tv"||e==="series",b=d?"tv":"movie",a=s!=null&&s!==""?parseInt(String(s),10):1,z=l!=null&&l!==""?parseInt(String(l),10):1,f=String(n||"").trim();A("han's 35",`[Ad\u0131m 1/3] Metadata \xE7\xF6z\xFCmleniyor (${f})...`);let g=null;f.startsWith("tt")?g=f:g=await H(f,b);let w=await q(f,b),y=w?.numericId||(f.startsWith("tt")?void 0:parseInt(f,10)),i=w?.titles||[],h=await x("urouge");if(!h)return A("han's 35","Domain not resolved","warn"),[];let m=h.replace(/\/+$/,""),u={};if(d){let o=[];g&&o.push(g);for(let v of i)v&&!o.includes(v)&&o.push(v);let p=[];for(let v of o){let I=`${m}/v1/shows?filters[q]=${encodeURIComponent(v)}&expand=episodes.streams`;A("han's 35",`[Ad\u0131m 2/3] Dizi API sorgulan\u0131yor (${v})...`);try{let P=await fetch(I,{headers:{"User-Agent":M.DEFAULT_USER_AGENT,Accept:"application/json, text/plain, */*"}});if(P.ok){let U=await P.json();if(Array.isArray(U.items)&&U.items.length>0){p=U.items;break}}}catch(P){A("han's 35",`Dizi sorgu hatas\u0131: ${P}`,"warn")}}if(p.length===0)return A("han's 35",`Dizi ar\u015Fivde bulunamad\u0131: ${f}`,"info"),[];let _=g?g.replace(/^tt0*/,""):null,k=_?p.find(v=>v.imdb_id?String(v.imdb_id).replace(/^tt0*/,"")===_:!1):void 0;if(!k)return A("han's 35",`Dizi ar\u015Fivde e\u015Fle\u015Fmedi: ${f}`,"info"),[];let T=(k.episodes||[]).find(v=>Number(v.season)===a&&Number(v.episode)===z);if(!T||!T.streams||typeof T.streams!="object")return A("han's 35",`\u0130stenen b\xF6l\xFCm bulunamad\u0131 (S${a}E${z})`,"warn"),[];Object.assign(u,T.streams)}else{let o=[];for(let C of i)C&&!o.includes(C)&&o.push(C);g&&!o.includes(g)&&o.push(g);let p=[];for(let C of o){let T=`${m}/v1/movies?filters[q]=${encodeURIComponent(C)}&expand=streams`;A("han's 35",`[Ad\u0131m 2/3] Film API sorgulan\u0131yor (${C})...`);try{let v=await fetch(T,{headers:{"User-Agent":M.DEFAULT_USER_AGENT,Accept:"application/json, text/plain, */*"}});if(v.ok){let I=await v.json();if(Array.isArray(I.items)&&I.items.length>0){p=I.items;break}}}catch(v){A("han's 35",`Film sorgu hatas\u0131: ${v}`,"warn")}}if(p.length===0)return A("han's 35",`Film ar\u015Fivde bulunamad\u0131: ${f}`,"info"),[];let _=g?g.replace(/^tt0*/,""):null,k=y?p.find(C=>C.tmdb_prefix&&Number(C.tmdb_prefix)===Number(y)):void 0;if(!k&&_&&(k=p.find(C=>C.imdb_id?String(C.imdb_id).replace(/^tt0*/,"")===_:!1)),!k)return A("han's 35",`Film ar\u015Fivde e\u015Fle\u015Fmedi: ${f}`,"info"),[];if(!k.streams||typeof k.streams!="object")return A("han's 35","Film i\xE7in yay\u0131n ak\u0131\u015F\u0131 bulunamad\u0131.","warn"),[];Object.assign(u,k.streams)}let r=Object.keys(u);if(r.length===0)return A("han's 35","Kullan\u0131labilir ak\u0131\u015F kalitesi bulunamad\u0131.","info"),[];r.sort((o,p)=>{let _=J.indexOf(o.toLowerCase()),k=J.indexOf(p.toLowerCase());return _!==-1&&k!==-1?_-k:_!==-1?-1:k!==-1?1:p.localeCompare(o)});for(let o of r){let p=u[o]?.trim();if(!p||!p.startsWith("http"))continue;let _=o.includes("p")?o:`${o}p`,k=W({name:"han's 35",url:p,languageTitle:"Orijinal",quality:_,details:`${_} \u2022 HLS`,format:"m3u8",headers:{"User-Agent":M.DEFAULT_USER_AGENT}});k.type="hls";let C=[k],T=((Date.now()-c)/1e3).toFixed(2);return A("han's 35",`[Ad\u0131m 3/3] TAMAMLANDI: 1 ak\u0131\u015F haz\u0131rland\u0131 (${T}s)`,"success",C.map(v=>({title:v.title,quality:v.quality||"1080p",format:"m3u8"}))),C}return[]}catch(e){return A("han's 35",`Hata: ${e?.message||e}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=Q);

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

;(()=>{const n="han's 35",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
