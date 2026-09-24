
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

"use strict";var C=Object.defineProperty;var U=Object.getOwnPropertyDescriptor;var x=Object.getOwnPropertyNames;var F=Object.prototype.hasOwnProperty;var K=(t,e)=>{for(var n in e)C(t,n,{get:e[n],enumerable:!0})},R=(t,e,n,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of x(e))!F.call(t,i)&&i!==n&&C(t,i,{get:()=>e[i],enumerable:!(s=U(e,i))||s.enumerable});return t};var B=t=>R(C({},"__esModule",{value:!0}),t);var Y={};K(Y,{getStreams:()=>L});module.exports=B(Y);var j=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(e=>String.fromCharCode(e^42)).join(""),v={REMOTE_CONFIG_URL:j,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},_=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},k="__NUVIO_CONFIG_CACHE__",w=60*60*1e3,P=2*60*1e3;if(!_.__NUVIO_CONFIG_STATE__){_.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null};try{if(typeof localStorage<"u"&&localStorage&&typeof localStorage.getItem=="function"){let t=localStorage.getItem(k);if(t){let e=JSON.parse(t);e&&e.timestamp&&Date.now()-e.timestamp<w&&(e.domains&&typeof e.domains=="object"&&(_.__NUVIO_CONFIG_STATE__.cachedDomains=e.domains),e.cookies&&typeof e.cookies=="object"&&(_.__NUVIO_CONFIG_STATE__.cachedCookies=e.cookies),Array.isArray(e.tmdbKeys)&&e.tmdbKeys.length>0&&(_.__NUVIO_CONFIG_STATE__.cachedTmdbKeys=e.tmdbKeys),_.__NUVIO_CONFIG_STATE__.lastFetchTime=e.timestamp)}}}catch{}}var r=_.__NUVIO_CONFIG_STATE__;function V(t){try{typeof localStorage<"u"&&localStorage&&typeof localStorage.setItem=="function"&&localStorage.setItem(k,JSON.stringify({timestamp:t,domains:r.cachedDomains,cookies:r.cachedCookies,tmdbKeys:r.cachedTmdbKeys}))}catch{}}async function H(){let t=Date.now();try{let e={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let s=AbortSignal.timeout(8e3);s&&(e.signal=s)}catch{}let n=await fetch(v.REMOTE_CONFIG_URL,e);if(n.ok){let s=await n.json(),i=s?.data??s,o=i.domains||i,a=i.cookies,d=i.tmdb_keys||i.tmdbKeys;o&&typeof o=="object"&&(r.cachedDomains={...r.cachedDomains,...o}),a&&typeof a=="object"&&(r.cachedCookies={...r.cachedCookies,...a}),Array.isArray(d)&&d.length>0&&(r.cachedTmdbKeys=d),r.lastFetchTime=t,V(t)}else r.lastFetchTime=t-w+P}catch{r.lastFetchTime=t-w+P}}async function D(){let t=Date.now();(!(Object.keys(r.cachedDomains).length>0)||t-r.lastFetchTime>w)&&(r.activeFetchPromise||(r.activeFetchPromise=H().finally(()=>{r.activeFetchPromise=null})),await r.activeFetchPromise)}async function N(t){return await D(),r.cachedDomains[t]||""}async function $(){return await D(),r.cachedTmdbKeys||[]}var W="a2f888b27315e62e471b2d587048f32e",O=[W,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function z(t){let e=await $(),n=e.length>0?[...e,...O]:O;for(let s=0;s<n.length;s++){let i=n[s],o=t.includes("?")?"&":"?",a=`https://api.themoviedb.org/3/${t}${o}api_key=${i}`;try{let d=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,c=await fetch(a,{signal:d});if(c.ok)return await c.json();if(c.status===429)continue}catch{}}return null}var E=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};E.__NUVIO_TMDB_CACHE__||(E.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var y=E.__NUVIO_TMDB_CACHE__,S=y.imdbIdCache,ee=y.tmdbTitlesCache,te=y.tmdbImageCache,se=y.episodeGroupCache,ne=y.absoluteEpCache;async function M(t,e){let n=String(t||"").replace(/^tmdb:/i,"").trim();if(!n)return null;if(n.startsWith("tt"))return n;let s=`${e}:${n}`;if(S.has(s))return S.get(s);let i=(async()=>{try{let a=await z(`${e==="tv"||e==="series"?"tv":"movie"}/${n}/external_ids`);if(a&&a.imdb_id)return a.imdb_id}catch{}return null})();return S.set(s,i),i}function p(t,e,n="info",s){let i=`[${t}]`;n==="error"?console.error(i,e,s||""):n==="warn"?console.warn(i,e,s||""):console.log(i,e,s||"");try{let a=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof a=="string"&&a.startsWith("http")&&fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:t,level:n,message:e,details:s})}).catch(()=>{})}catch{}}function X(t){let e=!1,n=!1,s=!1,i=["t\xFCrk\xE7e","turkish","turkce","dublaj","tr","tur","dual","ses-tr"],o=["english","ingilizce","original","orijinal","en","eng"];if(t){let a=t.split(/\r?\n/);for(let d of a){let c=d.trim();if(c.startsWith("#EXT-X-MEDIA:")&&c.includes("TYPE=AUDIO")){let h=c.match(/NAME=["']([^"']+)["']/i),f=c.match(/LANGUAGE=["']([^"']+)["']/i),l=c.match(/GROUP-ID=["']([^"']+)["']/i),m=(h?h[1]:"").toLowerCase(),b=(f?f[1]:"").toLowerCase(),T=(l?l[1]:"").toLowerCase();i.some(u=>m.includes(u)||b===u||T.includes(u))&&(e=!0),o.some(u=>m.includes(u)||b===u||T.includes(u))&&(n=!0)}if(c.startsWith("#EXT-X-MEDIA:")&&c.includes("TYPE=SUBTITLES")){let h=c.match(/NAME=["']([^"']+)["']/i),f=c.match(/LANGUAGE=["']([^"']+)["']/i),l=(h?h[1]:"").toLowerCase(),m=(f?f[1]:"").toLowerCase();(m==="tr"||m==="tur"||m==="st"||m==="sot"||l.includes("t\xFCrk")||l.includes("sotho"))&&(s=!0)}}}return e&&n||e&&s?"Dublaj / Altyaz\u0131l\u0131":e?"Dublaj":s?"Altyaz\u0131l\u0131":"Orijinal"}async function L(t,e,n,s){let i=Date.now();p("han's 1",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${t}, T\xFCr: ${e}, Sezon: ${n}, B\xF6l\xFCm: ${s}`);try{let o=String(t||"").trim(),a=String(e||"").toLowerCase()==="tv"?"tv":"movie",d=a==="tv",c=n?parseInt(String(n),10):1,h=s?parseInt(String(s),10):1,f=o.startsWith("tt")?o:await M(o,a);if(!f)return p("han's 1","IMDb ID bulunamad\u0131.","warn"),[];let l=await N("imu");(!l||l.includes("vidmody.com"))&&(l="https://ha.vixolity.com");let m="";if(d){let g=h.toString().padStart(2,"0");m=`${l}/vs/${f}/s${c}/e${g}`}else m=`${l}/vs/${f}`;p("han's 1","[Ad\u0131m 2/3] Ak\u0131\u015F sunucusu kontrol ediliyor...");let b=l.includes("vixolity.com")?"https://pl.vixolity.com/":`${l}/`,T=l.includes("vixolity.com")?"https://pl.vixolity.com":l,u={Referer:b,Origin:T,"User-Agent":v.DEFAULT_USER_AGENT},I="";try{let g=await fetch(m,{method:"GET",headers:u});if(!g.ok&&g.status!==200)return p("han's 1",`Sunucuda bu i\xE7erik mevcut de\u011Fil (HTTP ${g.status}).`,"warn"),[];I=await g.text()}catch(g){return p("han's 1",`Ba\u011Flant\u0131 kontrol\xFC ge\xE7ilemedi: ${g.message}`,"warn"),[]}if(!I||!I.includes("#EXTM3U"))return p("han's 1","Ge\xE7erli bir HLS ak\u0131\u015F\u0131 bulunamad\u0131.","warn"),[];let A=X(I),G=((Date.now()-i)/1e3).toFixed(2);return p("han's 1",`[Ad\u0131m 3/3] han's 1 ak\u0131\u015F\u0131 haz\u0131r! (${G}s)`,"success",{dil:A}),[{name:"han's 1",title:A,description:`${A}
1080p \u2022 HLS`,url:m,quality:`1080p \u2022 ${A}`,format:"m3u8",headers:u}]}catch(o){return p("han's 1",`Hata: ${o.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=L);

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
