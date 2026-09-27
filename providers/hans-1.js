
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

"use strict";var v=Object.defineProperty;var U=Object.getOwnPropertyDescriptor;var x=Object.getOwnPropertyNames;var G=Object.prototype.hasOwnProperty;var R=(n,e)=>{for(var t in e)v(n,t,{get:e[t],enumerable:!0})},F=(n,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of x(e))!G.call(n,r)&&r!==t&&v(n,r,{get:()=>e[r],enumerable:!(s=U(e,r))||s.enumerable});return n};var B=n=>F(v({},"__esModule",{value:!0}),n);var z={};R(z,{getStreams:()=>N});module.exports=B(z);function u(n,e,t="info",s){let r=`[${n}]`;t==="error"?console.error(r,e,s||""):t==="warn"?console.warn(r,e,s||""):console.log(r,e,s||"");try{let a=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof a=="string"&&a.startsWith("http")&&fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:n,level:t,message:e,details:s})}).catch(()=>{})}catch{}}var K=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(e=>String.fromCharCode(e^42)).join(""),C={REMOTE_CONFIG_URL:K,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},w=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};try{typeof localStorage<"u"&&localStorage&&typeof localStorage.removeItem=="function"&&(localStorage.removeItem("__NUVIO_CONFIG_CACHE__"),localStorage.removeItem("__NUVIO_CONFIG_CACHE_V2__"))}catch{}var S=10*1e3,j=10*1e3;w.__NUVIO_CONFIG_STATE__||(w.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var l=w.__NUVIO_CONFIG_STATE__;async function E(){let n=Date.now(),e=[];try{let t=w.__NUVIO_DEV_LOG_URL__;typeof t=="string"&&t.includes("/api/log")&&e.push(t.replace("/api/log","/domains"))}catch{}e.push(C.REMOTE_CONFIG_URL);for(let t of e)try{let s=await fetch(t);if(s.ok){let r=await s.json(),o=r?.data??r,a=o.domains||o,f=o.cookies,i=o.tmdb_keys||o.tmdbKeys;a&&typeof a=="object"&&(l.cachedDomains={...l.cachedDomains,...a}),f&&typeof f=="object"&&(l.cachedCookies={...l.cachedCookies,...f}),Array.isArray(i)&&i.length>0&&(l.cachedTmdbKeys=i),l.lastFetchTime=n;return}}catch(s){u("Config",`Domain alinamadi (${t}): ${s.message}`,"warn")}l.lastFetchTime=n-S+j}async function $(){let n=Date.now();(!(Object.keys(l.cachedDomains).length>0)||n-l.lastFetchTime>S)&&(l.activeFetchPromise||(l.activeFetchPromise=E().finally(()=>{l.activeFetchPromise=null})),await l.activeFetchPromise)}async function D(n){return await $(),l.cachedDomains[n]||await E(),l.cachedDomains[n]||""}async function M(){return await $(),l.cachedTmdbKeys||[]}var V="a2f888b27315e62e471b2d587048f32e",L=[V,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function H(n){let e=await M(),t=e.length>0?[...e,...L]:L;for(let s=0;s<t.length;s++){let r=t[s],o=n.includes("?")?"&":"?",a=`https://api.themoviedb.org/3/${n}${o}api_key=${r}`;try{let f=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,i=await fetch(a,{signal:f});if(i.ok)return await i.json();if(i.status===429)continue}catch{}}return null}var P=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};P.__NUVIO_TMDB_CACHE__||(P.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var b=P.__NUVIO_TMDB_CACHE__,A=b.imdbIdCache,ee=b.tmdbTitlesCache,te=b.tmdbImageCache,ne=b.episodeGroupCache,se=b.absoluteEpCache;async function k(n,e){let t=String(n||"").replace(/^tmdb:/i,"").trim();if(!t)return null;if(t.startsWith("tt"))return t;let s=`${e}:${t}`;if(A.has(s))return A.get(s);let r=(async()=>{try{let a=await H(`${e==="tv"||e==="series"?"tv":"movie"}/${t}/external_ids`);if(a&&a.imdb_id)return a.imdb_id}catch{}return null})();return A.set(s,r),r}function W(n){let e=!1,t=!1,s=!1,r=["t\xFCrk\xE7e","turkish","turkce","dublaj","tr","tur","dual","ses-tr"],o=["english","ingilizce","original","orijinal","en","eng"];if(n){let a=n.split(/\r?\n/);for(let f of a){let i=f.trim();if(i.startsWith("#EXT-X-MEDIA:")&&i.includes("TYPE=AUDIO")){let h=i.match(/NAME=["']([^"']+)["']/i),p=i.match(/LANGUAGE=["']([^"']+)["']/i),c=i.match(/GROUP-ID=["']([^"']+)["']/i),m=(h?h[1]:"").toLowerCase(),_=(p?p[1]:"").toLowerCase(),y=(c?c[1]:"").toLowerCase();r.some(d=>m.includes(d)||_===d||y.includes(d))&&(e=!0),o.some(d=>m.includes(d)||_===d||y.includes(d))&&(t=!0)}if(i.startsWith("#EXT-X-MEDIA:")&&i.includes("TYPE=SUBTITLES")){let h=i.match(/NAME=["']([^"']+)["']/i),p=i.match(/LANGUAGE=["']([^"']+)["']/i),c=(h?h[1]:"").toLowerCase(),m=(p?p[1]:"").toLowerCase();(m==="tr"||m==="tur"||m==="st"||m==="sot"||c.includes("t\xFCrk")||c.includes("sotho"))&&(s=!0)}}}return e&&t||e&&s?"Dublaj / Altyaz\u0131l\u0131":e?"Dublaj":s?"Altyaz\u0131l\u0131":"Orijinal"}async function N(n,e,t,s){let r=Date.now();u("han's 1",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${n}, T\xFCr: ${e}, Sezon: ${t}, B\xF6l\xFCm: ${s}`);try{let o=String(n||"").trim(),a=String(e||"").toLowerCase()==="tv"?"tv":"movie",f=a==="tv",i=t?parseInt(String(t),10):1,h=s?parseInt(String(s),10):1,p=o.startsWith("tt")?o:await k(o,a);if(!p)return u("han's 1","IMDb ID bulunamad\u0131.","warn"),[];let c=await D("imu");(!c||c.includes("vidmody.com"))&&(c="https://ha.vixolity.com");let m="";if(f){let g=h.toString().padStart(2,"0");m=`${c}/vs/${p}/s${i}/e${g}`}else m=`${c}/vs/${p}`;u("han's 1","[Ad\u0131m 2/3] Ak\u0131\u015F sunucusu kontrol ediliyor...");let _=c.includes("vixolity.com")?"https://pl.vixolity.com/":`${c}/`,y=c.includes("vixolity.com")?"https://pl.vixolity.com":c,d={Referer:_,Origin:y,"User-Agent":C.DEFAULT_USER_AGENT},T="";try{let g=await fetch(m,{method:"GET",headers:d});if(!g.ok&&g.status!==200)return u("han's 1",`Sunucuda bu i\xE7erik mevcut de\u011Fil (HTTP ${g.status}).`,"warn"),[];T=await g.text()}catch(g){return u("han's 1",`Ba\u011Flant\u0131 kontrol\xFC ge\xE7ilemedi: ${g.message}`,"warn"),[]}if(!T||!T.includes("#EXTM3U"))return u("han's 1","Ge\xE7erli bir HLS ak\u0131\u015F\u0131 bulunamad\u0131.","warn"),[];let I=W(T),O=((Date.now()-r)/1e3).toFixed(2);return u("han's 1",`[Ad\u0131m 3/3] han's 1 ak\u0131\u015F\u0131 haz\u0131r! (${O}s)`,"success",{dil:I}),[{name:"han's 1",title:I,description:`${I}
1080p \u2022 HLS`,url:m,quality:`1080p \u2022 ${I}`,format:"m3u8",headers:d}]}catch(o){return u("han's 1",`Hata: ${o.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=N);

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
