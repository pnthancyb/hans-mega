
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

"use strict";var w=Object.defineProperty;var O=Object.getOwnPropertyDescriptor;var G=Object.getOwnPropertyNames;var R=Object.prototype.hasOwnProperty;var U=(e,t)=>{for(var s in t)w(e,s,{get:t[s],enumerable:!0})},F=(e,t,s,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of G(t))!R.call(e,i)&&i!==s&&w(e,i,{get:()=>t[i],enumerable:!(n=O(t,i))||n.enumerable});return e};var B=e=>F(w({},"__esModule",{value:!0}),e);var W={};U(W,{getStreams:()=>N});module.exports=B(W);var K=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(t=>String.fromCharCode(t^42)).join(""),v={REMOTE_CONFIG_URL:K,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},S={imu:"https://ha.vixolity.com",kalgara:"https://dizibal.org",garling:"https://liderfilmizle.vip"},A=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};A.__NUVIO_CONFIG_STATE__||(A.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var a=A.__NUVIO_CONFIG_STATE__,j=10*60*1e3;async function E(){let e=Date.now();try{let t={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let n=AbortSignal.timeout(8e3);n&&(t.signal=n)}catch{}let s=await fetch(`${v.REMOTE_CONFIG_URL}?_t=${e}`,t);if(s.ok){let n=await s.json(),i=n?.data??n,o=i.domains||i,r=i.cookies,d=i.tmdb_keys||i.tmdbKeys;o&&typeof o=="object"&&(a.cachedDomains={...a.cachedDomains,...o}),r&&typeof r=="object"&&(a.cachedCookies={...a.cachedCookies,...r}),Array.isArray(d)&&d.length>0&&(a.cachedTmdbKeys=d),a.lastFetchTime=e}else a.lastFetchTime=0}catch{a.lastFetchTime=0}}async function $(){let e=Date.now();(!(Object.keys(a.cachedDomains).length>0)||e-a.lastFetchTime>j)&&(a.activeFetchPromise||(a.activeFetchPromise=E().finally(()=>{a.activeFetchPromise=null})),await a.activeFetchPromise)}async function D(e){await $();let t=a.cachedDomains[e]||S[e]||"";return t||(await E(),t=a.cachedDomains[e]||S[e]||""),t}async function M(){return await $(),a.cachedTmdbKeys||[]}var H="a2f888b27315e62e471b2d587048f32e",k=[H,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function z(e){let t=await M(),s=t.length>0?[...t,...k]:k;for(let n=0;n<s.length;n++){let i=s[n],o=e.includes("?")?"&":"?",r=`https://api.themoviedb.org/3/${e}${o}api_key=${i}`;try{let d=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,l=await fetch(r,{signal:d});if(l.ok)return await l.json();if(l.status===429)continue}catch{}}return null}var P=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};P.__NUVIO_TMDB_CACHE__||(P.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var y=P.__NUVIO_TMDB_CACHE__,C=y.imdbIdCache,Z=y.tmdbTitlesCache,Q=y.tmdbImageCache,tt=y.episodeGroupCache,et=y.absoluteEpCache;async function L(e,t){let s=String(e||"").replace(/^tmdb:/i,"").trim();if(!s)return null;if(s.startsWith("tt"))return s;let n=`${t}:${s}`;if(C.has(n))return C.get(n);let i=(async()=>{try{let r=await z(`${t==="tv"||t==="series"?"tv":"movie"}/${s}/external_ids`);if(r&&r.imdb_id)return r.imdb_id}catch{}return null})();return C.set(n,i),i}function p(e,t,s="info",n){let i=`[${e}]`;s==="error"?console.error(i,t,n||""):s==="warn"?console.warn(i,t,n||""):console.log(i,t,n||"");try{let r=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof r=="string"&&r.startsWith("http")&&fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:s,message:t,details:n})}).catch(()=>{})}catch{}}function V(e){let t=!1,s=!1,n=!1,i=["t\xFCrk\xE7e","turkish","turkce","dublaj","tr","tur","dual","ses-tr"],o=["english","ingilizce","original","orijinal","en","eng"];if(e){let r=e.split(/\r?\n/);for(let d of r){let l=d.trim();if(l.startsWith("#EXT-X-MEDIA:")&&l.includes("TYPE=AUDIO")){let h=l.match(/NAME=["']([^"']+)["']/i),f=l.match(/LANGUAGE=["']([^"']+)["']/i),c=l.match(/GROUP-ID=["']([^"']+)["']/i),m=(h?h[1]:"").toLowerCase(),b=(f?f[1]:"").toLowerCase(),_=(c?c[1]:"").toLowerCase();i.some(u=>m.includes(u)||b===u||_.includes(u))&&(t=!0),o.some(u=>m.includes(u)||b===u||_.includes(u))&&(s=!0)}if(l.startsWith("#EXT-X-MEDIA:")&&l.includes("TYPE=SUBTITLES")){let h=l.match(/NAME=["']([^"']+)["']/i),f=l.match(/LANGUAGE=["']([^"']+)["']/i),c=(h?h[1]:"").toLowerCase(),m=(f?f[1]:"").toLowerCase();(m==="tr"||m==="tur"||m==="st"||m==="sot"||c.includes("t\xFCrk")||c.includes("sotho"))&&(n=!0)}}}return t&&s||t&&n?"Dublaj / Altyaz\u0131l\u0131":t?"Dublaj":n?"Altyaz\u0131l\u0131":"Orijinal"}async function N(e,t,s,n){let i=Date.now();p("han's 1",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${e}, T\xFCr: ${t}, Sezon: ${s}, B\xF6l\xFCm: ${n}`);try{let o=String(e||"").trim(),r=String(t||"").toLowerCase()==="tv"?"tv":"movie",d=r==="tv",l=s?parseInt(String(s),10):1,h=n?parseInt(String(n),10):1,f=o.startsWith("tt")?o:await L(o,r);if(!f)return p("han's 1","IMDb ID bulunamad\u0131.","warn"),[];let c=await D("imu");(!c||c.includes("vidmody.com"))&&(c="https://ha.vixolity.com");let m="";if(d){let g=h.toString().padStart(2,"0");m=`${c}/vs/${f}/s${l}/e${g}`}else m=`${c}/vs/${f}`;p("han's 1","[Ad\u0131m 2/3] Ak\u0131\u015F sunucusu kontrol ediliyor...");let b=c.includes("vixolity.com")?"https://pl.vixolity.com/":`${c}/`,_=c.includes("vixolity.com")?"https://pl.vixolity.com":c,u={Referer:b,Origin:_,"User-Agent":v.DEFAULT_USER_AGENT},T="";try{let g=await fetch(m,{method:"GET",headers:u});if(!g.ok&&g.status!==200)return p("han's 1",`Sunucuda bu i\xE7erik mevcut de\u011Fil (HTTP ${g.status}).`,"warn"),[];T=await g.text()}catch(g){return p("han's 1",`Ba\u011Flant\u0131 kontrol\xFC ge\xE7ilemedi: ${g.message}`,"warn"),[]}if(!T||!T.includes("#EXTM3U"))return p("han's 1","Ge\xE7erli bir HLS ak\u0131\u015F\u0131 bulunamad\u0131.","warn"),[];let I=V(T),x=((Date.now()-i)/1e3).toFixed(2);return p("han's 1",`[Ad\u0131m 3/3] han's 1 ak\u0131\u015F\u0131 haz\u0131r! (${x}s)`,"success",{dil:I}),[{name:"han's 1",title:I,description:`${I}
1080p \u2022 HLS`,url:m,quality:`1080p \u2022 ${I}`,format:"m3u8",headers:u}]}catch(o){return p("han's 1",`Hata: ${o.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=N);

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
