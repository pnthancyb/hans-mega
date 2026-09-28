
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

"use strict";var A=Object.defineProperty;var O=Object.getOwnPropertyDescriptor;var U=Object.getOwnPropertyNames;var x=Object.prototype.hasOwnProperty;var R=(s,e)=>{for(var n in e)A(s,n,{get:e[n],enumerable:!0})},F=(s,e,n,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of U(e))!x.call(s,r)&&r!==n&&A(s,r,{get:()=>e[r],enumerable:!(t=O(e,r))||t.enumerable});return s};var G=s=>F(A({},"__esModule",{value:!0}),s);var Y={};R(Y,{getStreams:()=>k});module.exports=G(Y);function u(s,e,n="info",t){let r=`[${s}]`;n==="error"?console.error(r,e,t||""):n==="warn"?console.warn(r,e,t||""):console.log(r,e,t||"");try{let a=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof a=="string"&&a.startsWith("http")&&fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:s,level:n,message:e,details:t})}).catch(()=>{})}catch{}}var K=[66,94,94,90,89,16,5,5,78,69,71,75,67,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89].map(e=>String.fromCharCode(e^42)).join(""),B=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(e=>String.fromCharCode(e^42)).join(""),w={REMOTE_CONFIG_URL:K,FALLBACK_CONFIG_URL:B,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},C=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},P=2*60*1e3,j=15*1e3;if(!C.__NUVIO_CONFIG_STATE__){let s={},e={},n=[],t=0;try{if(typeof localStorage<"u"&&localStorage){let r=localStorage.getItem("__NUVIO_DOMAINS_CACHE_V3__");if(r){let i=JSON.parse(r);i&&typeof i.domains=="object"&&(s=i.domains,e=i.cookies||{},n=i.tmdbKeys||[],t=typeof i.time=="number"?i.time:0)}}}catch{}C.__NUVIO_CONFIG_STATE__={cachedDomains:s,cachedCookies:e,cachedTmdbKeys:n,lastFetchTime:t,activeFetchPromise:null}}var c=C.__NUVIO_CONFIG_STATE__;async function V(s=!1){let e=Date.now(),n=[];try{let t=C.__NUVIO_DEV_LOG_URL__;typeof t=="string"&&t.includes("/api/log")&&n.push(t.replace("/api/log","/domains"))}catch{}n.push(w.REMOTE_CONFIG_URL),n.push(w.FALLBACK_CONFIG_URL);for(let t of n)try{let r=await fetch(t);if(r.ok){let i=await r.json(),a=i?.data??i,p=a.domains||a,o=a.cookies,d=a.tmdb_keys||a.tmdbKeys;p&&typeof p=="object"&&(c.cachedDomains={...c.cachedDomains,...p}),o&&typeof o=="object"&&(c.cachedCookies={...c.cachedCookies,...o}),Array.isArray(d)&&d.length>0&&(c.cachedTmdbKeys=d),c.lastFetchTime=e,c.lastFetchSource=t,u("Config",`Domainler basariyla cekildi: ${t}`,"info");try{typeof localStorage<"u"&&localStorage&&localStorage.setItem("__NUVIO_DOMAINS_CACHE_V3__",JSON.stringify({domains:c.cachedDomains,cookies:c.cachedCookies,tmdbKeys:c.cachedTmdbKeys,time:e}))}catch{}return}}catch(r){u("Config",`Domain alinamadi (${t}): ${r.message}`,"warn")}c.lastFetchTime=e-P+j}async function E(s=!1){let e=Date.now(),n=Object.keys(c.cachedDomains).length>0;(s||!n||e-c.lastFetchTime>P)&&(c.activeFetchPromise||(c.activeFetchPromise=V(s).finally(()=>{c.activeFetchPromise=null})),await c.activeFetchPromise)}async function D(s){return await E(),c.cachedDomains[s]||""}async function L(){return await E(),c.cachedTmdbKeys||[]}var H="a2f888b27315e62e471b2d587048f32e",$=[H,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function W(s){let e=await L(),n=e.length>0?[...e,...$]:$;for(let t=0;t<n.length;t++){let r=n[t],i=s.includes("?")?"&":"?",a=`https://api.themoviedb.org/3/${s}${i}api_key=${r}`;try{let p=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,o=await fetch(a,{signal:p});if(o.ok)return await o.json();if(o.status===429)continue}catch{}}return null}var S=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};S.__NUVIO_TMDB_CACHE__||(S.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var b=S.__NUVIO_TMDB_CACHE__,v=b.imdbIdCache,te=b.tmdbTitlesCache,ne=b.tmdbImageCache,se=b.episodeGroupCache,re=b.absoluteEpCache;async function M(s,e){let n=String(s||"").replace(/^tmdb:/i,"").trim();if(!n)return null;if(n.startsWith("tt"))return n;let t=`${e}:${n}`;if(v.has(t))return v.get(t);let r=(async()=>{try{let a=await W(`${e==="tv"||e==="series"?"tv":"movie"}/${n}/external_ids`);if(a&&a.imdb_id)return a.imdb_id}catch{}return null})();return v.set(t,r),r}function z(s){let e=!1,n=!1,t=!1,r=["t\xFCrk\xE7e","turkish","turkce","dublaj","tr","tur","dual","ses-tr"],i=["english","ingilizce","original","orijinal","en","eng"];if(s){let a=s.split(/\r?\n/);for(let p of a){let o=p.trim();if(o.startsWith("#EXT-X-MEDIA:")&&o.includes("TYPE=AUDIO")){let d=o.match(/NAME=["']([^"']+)["']/i),g=o.match(/LANGUAGE=["']([^"']+)["']/i),l=o.match(/GROUP-ID=["']([^"']+)["']/i),m=(d?d[1]:"").toLowerCase(),_=(g?g[1]:"").toLowerCase(),y=(l?l[1]:"").toLowerCase();r.some(f=>m.includes(f)||_===f||y.includes(f))&&(e=!0),i.some(f=>m.includes(f)||_===f||y.includes(f))&&(n=!0)}if(o.startsWith("#EXT-X-MEDIA:")&&o.includes("TYPE=SUBTITLES")){let d=o.match(/NAME=["']([^"']+)["']/i),g=o.match(/LANGUAGE=["']([^"']+)["']/i),l=(d?d[1]:"").toLowerCase(),m=(g?g[1]:"").toLowerCase();(m==="tr"||m==="tur"||m==="st"||m==="sot"||l.includes("t\xFCrk")||l.includes("sotho"))&&(t=!0)}}}return e&&n||e&&t?"Dublaj / Altyaz\u0131l\u0131":e?"Dublaj":t?"Altyaz\u0131l\u0131":"Orijinal"}async function k(s,e,n,t){let r=Date.now();u("han's 1",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${s}, T\xFCr: ${e}, Sezon: ${n}, B\xF6l\xFCm: ${t}`);try{let i=String(s||"").trim(),a=String(e||"").toLowerCase()==="tv"?"tv":"movie",p=a==="tv",o=n?parseInt(String(n),10):1,d=t?parseInt(String(t),10):1,g=i.startsWith("tt")?i:await M(i,a);if(!g)return u("han's 1","IMDb ID bulunamad\u0131.","warn"),[];let l=await D("imu");(!l||l.includes("vidmody.com"))&&(l="https://ha.vixolity.com");let m="";if(p){let h=d.toString().padStart(2,"0");m=`${l}/vs/${g}/s${o}/e${h}`}else m=`${l}/vs/${g}`;u("han's 1","[Ad\u0131m 2/3] Ak\u0131\u015F sunucusu kontrol ediliyor...");let _=l.includes("vixolity.com")?"https://pl.vixolity.com/":`${l}/`,y=l.includes("vixolity.com")?"https://pl.vixolity.com":l,f={Referer:_,Origin:y,"User-Agent":w.DEFAULT_USER_AGENT},T="";try{let h=await fetch(m,{method:"GET",headers:f});if(!h.ok&&h.status!==200)return u("han's 1",`Sunucuda bu i\xE7erik mevcut de\u011Fil (HTTP ${h.status}).`,"warn"),[];T=await h.text()}catch(h){return u("han's 1",`Ba\u011Flant\u0131 kontrol\xFC ge\xE7ilemedi: ${h.message}`,"warn"),[]}if(!T||!T.includes("#EXTM3U"))return u("han's 1","Ge\xE7erli bir HLS ak\u0131\u015F\u0131 bulunamad\u0131.","warn"),[];let I=z(T),N=((Date.now()-r)/1e3).toFixed(2);return u("han's 1",`[Ad\u0131m 3/3] han's 1 ak\u0131\u015F\u0131 haz\u0131r! (${N}s)`,"success",{dil:I}),[{name:"han's 1",title:I,description:`${I}
1080p \u2022 HLS`,url:m,quality:`1080p \u2022 ${I}`,format:"m3u8",headers:f}]}catch(i){return u("han's 1",`Hata: ${i.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=k);

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

;(()=>{const n="han's 1",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
