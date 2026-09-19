
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

"use strict";var C=Object.defineProperty;var O=Object.getOwnPropertyDescriptor;var R=Object.getOwnPropertyNames;var U=Object.prototype.hasOwnProperty;var G=(t,e)=>{for(var n in e)C(t,n,{get:e[n],enumerable:!0})},x=(t,e,n,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of R(e))!U.call(t,s)&&s!==n&&C(t,s,{get:()=>e[s],enumerable:!(i=O(e,s))||i.enumerable});return t};var F=t=>x(C({},"__esModule",{value:!0}),t);var H={};G(H,{getStreams:()=>k});module.exports=F(H);var B=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(e=>String.fromCharCode(e^42)).join(""),A={REMOTE_CONFIG_URL:B,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"};var v=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};v.__NUVIO_CONFIG_STATE__||(v.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var o=v.__NUVIO_CONFIG_STATE__,K=10*60*1e3;async function E(){let t=Date.now();try{let e={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let i=AbortSignal.timeout(8e3);i&&(e.signal=i)}catch{}let n=await fetch(`${A.REMOTE_CONFIG_URL}?_t=${t}`,e);if(n.ok){let i=await n.json(),s=i?.data??i,a=s.domains||s,r=s.cookies,g=s.tmdb_keys||s.tmdbKeys;a&&typeof a=="object"&&(o.cachedDomains={...o.cachedDomains,...a}),r&&typeof r=="object"&&(o.cachedCookies={...o.cachedCookies,...r}),Array.isArray(g)&&g.length>0&&(o.cachedTmdbKeys=g),o.lastFetchTime=t}else o.lastFetchTime=0}catch{o.lastFetchTime=0}}async function D(){let t=Date.now();(!(Object.keys(o.cachedDomains).length>0)||t-o.lastFetchTime>K)&&(o.activeFetchPromise||(o.activeFetchPromise=E().finally(()=>{o.activeFetchPromise=null})),await o.activeFetchPromise)}async function $(t){await D();let e=o.cachedDomains[t]||"";return e||(await E(),e=o.cachedDomains[t]||""),e}async function M(){return await D(),o.cachedTmdbKeys||[]}var j="a2f888b27315e62e471b2d587048f32e",L=[j,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function W(t){let e=await M(),n=e.length>0?[...e,...L]:L;for(let i=0;i<n.length;i++){let s=n[i],a=t.includes("?")?"&":"?",r=`https://api.themoviedb.org/3/${t}${a}api_key=${s}`;try{let g=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,p=await fetch(r,{signal:g});if(p.ok)return await p.json();if(p.status===429)continue}catch{}}return null}var S=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};S.__NUVIO_TMDB_CACHE__||(S.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var I=S.__NUVIO_TMDB_CACHE__,P=I.imdbIdCache,q=I.tmdbTitlesCache,J=I.tmdbImageCache,Z=I.episodeGroupCache,Q=I.absoluteEpCache;async function N(t,e){let n=String(t||"").replace(/^tmdb:/i,"").trim();if(!n)return null;if(n.startsWith("tt"))return n;let i=`${e}:${n}`;if(P.has(i))return P.get(i);let s=(async()=>{try{let r=await W(`${e==="tv"||e==="series"?"tv":"movie"}/${n}/external_ids`);if(r&&r.imdb_id)return r.imdb_id}catch{}return null})();return P.set(i,s),s}function h(t,e,n="info",i){let s=`[${t}]`;n==="error"?console.error(s,e,i||""):n==="warn"?console.warn(s,e,i||""):console.log(s,e,i||"");try{let r=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof r=="string"&&r.startsWith("http")&&fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:t,level:n,message:e,details:i})}).catch(()=>{})}catch{}}function z(t,e){let n=!1,i=!1,s=!1,a=[],r=["t\xFCrk\xE7e","turkish","turkce","dublaj","tr","tur","dual","ses-tr"],g=["english","ingilizce","original","orijinal","en","eng"];if(t){let w=t.split(/\r?\n/);for(let T of w){let l=T.trim();if(l.startsWith("#EXT-X-MEDIA:")&&l.includes("TYPE=AUDIO")){let d=l.match(/NAME=["']([^"']+)["']/i),b=l.match(/LANGUAGE=["']([^"']+)["']/i),_=l.match(/GROUP-ID=["']([^"']+)["']/i),f=(d?d[1]:"").toLowerCase(),u=(b?b[1]:"").toLowerCase(),c=(_?_[1]:"").toLowerCase();r.some(m=>f.includes(m)||u===m||c.includes(m))&&(n=!0),g.some(m=>f.includes(m)||u===m||c.includes(m))&&(i=!0)}if(l.startsWith("#EXT-X-MEDIA:")&&l.includes("TYPE=SUBTITLES")){let d=l.match(/URI=["']([^"']+)["']/i),b=l.match(/NAME=["']([^"']+)["']/i),_=l.match(/LANGUAGE=["']([^"']+)["']/i);if(d&&d[1]){let f=d[1];if(!f.startsWith("http"))try{f=new URL(f,e).toString()}catch{}let u=b?b[1]:"Altyaz\u0131",c=_?_[1].toLowerCase():"",m=c==="tr"||c==="tur"||c==="st"||c==="sot"||u.toLowerCase().includes("t\xFCrk")||u.toLowerCase().includes("sotho");m?(s=!0,c="tr",u="T\xFCrk\xE7e"):(c==="en"||c==="eng"||u.toLowerCase().includes("ing"))&&(c="en",u="\u0130ngilizce"),a.push({id:String(a.length),url:f,label:u,name:u,language:m?"Turkish":c==="en"?"English":u,lang:c||"und"})}}}}let p="Orijinal";return n&&i||n&&s?p="Dublaj / Altyaz\u0131l\u0131":n?p="Dublaj":s&&(p="Altyaz\u0131l\u0131"),{langTitle:p,subtitles:a}}async function k(t,e,n,i){let s=Date.now();h("han's 1",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${t}, T\xFCr: ${e}, Sezon: ${n}, B\xF6l\xFCm: ${i}`);try{let a=String(t||"").trim(),r=String(e||"").toLowerCase()==="tv"?"tv":"movie",g=r==="tv",p=n?parseInt(String(n),10):1,w=i?parseInt(String(i),10):1,T=a.startsWith("tt")?a:await N(a,r);if(!T)return h("han's 1","IMDb ID bulunamad\u0131.","warn"),[];let l=await $("imu");if(!l)return h("han's 1","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let d="";if(g){let y=w.toString().padStart(2,"0");d=`${l}/vs/${T}/s${p}/e${y}`}else d=`${l}/vs/${T}`;h("han's 1","[Ad\u0131m 2/3] Ak\u0131\u015F sunucusu kontrol ediliyor...");let b={Referer:l+"/",Origin:l,"User-Agent":A.DEFAULT_USER_AGENT},_="";try{let y=await fetch(d,{method:"GET",headers:b});if(!y.ok&&y.status!==200)return h("han's 1",`Sunucuda bu i\xE7erik mevcut de\u011Fil (HTTP ${y.status}).`,"warn"),[];_=await y.text()}catch(y){h("han's 1",`Ba\u011Flant\u0131 kontrol\xFC ge\xE7ilemedi: ${y.message}`,"warn")}let{langTitle:f,subtitles:u}=z(_,d),c=((Date.now()-s)/1e3).toFixed(2);h("han's 1",`[Ad\u0131m 3/3] han's 1 ak\u0131\u015F\u0131 haz\u0131r! (${c}s)`,"success",{dil:f});let m={name:"han's 1",title:f,description:`${f}
1080p \u2022 HLS`,url:d,quality:`1080p \u2022 ${f}`,format:"m3u8",headers:b};return u.length>0&&(m.subtitles=u),[m]}catch(a){return h("han's 1",`Hata: ${a.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=k);

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
