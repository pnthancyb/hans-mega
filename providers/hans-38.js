
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

"use strict";var U=Object.defineProperty;var pe=Object.getOwnPropertyDescriptor;var be=Object.getOwnPropertyNames;var ke=Object.prototype.hasOwnProperty;var ye=(n,t)=>{for(var e in t)U(n,e,{get:t[e],enumerable:!0})},Te=(n,t,e,l)=>{if(t&&typeof t=="object"||typeof t=="function")for(let c of be(t))!ke.call(n,c)&&c!==e&&U(n,c,{get:()=>t[c],enumerable:!(l=pe(t,c))||l.enumerable});return n};var _e=n=>Te(U({},"__esModule",{value:!0}),n);var Pe={};ye(Pe,{default:()=>Me,getStreams:()=>P});module.exports=_e(Pe);function S(n,t,e="info",l){let c=`[${n}]`;e==="error"?console.error(c,t,l||""):e==="warn"?console.warn(c,t,l||""):console.log(c,t,l||"");try{let d=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof d=="string"&&d.startsWith("http")&&fetch(d,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:n,level:e,message:t,details:l})}).catch(()=>{})}catch{}}var ve=[66,94,94,90,89,16,5,5,78,69,71,75,67,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89].map(t=>String.fromCharCode(t^42)).join(""),Ae=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(t=>String.fromCharCode(t^42)).join(""),X={REMOTE_CONFIG_URL:ve,FALLBACK_CONFIG_URL:Ae,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},F=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},Z=2*60*60*1e3,Se=30*1e3;if(!F.__NUVIO_CONFIG_STATE__){let n={},t={},e=[],l=0;try{if(typeof localStorage<"u"&&localStorage){let c=localStorage.getItem("__NUVIO_DOMAINS_CACHE_V3__");if(c){let s=JSON.parse(c);s&&typeof s.domains=="object"&&(n=s.domains,t=s.cookies||{},e=s.tmdbKeys||[],l=typeof s.time=="number"?s.time:0)}}}catch{}F.__NUVIO_CONFIG_STATE__={cachedDomains:n,cachedCookies:t,cachedTmdbKeys:e,lastFetchTime:l,activeFetchPromise:null}}var k=F.__NUVIO_CONFIG_STATE__;async function Ce(n=!1){let t=Date.now(),e=[];try{let l=F.__NUVIO_DEV_LOG_URL__;typeof l=="string"&&l.includes("/api/log")&&e.push(l.replace("/api/log","/domains"))}catch{}e.push(X.REMOTE_CONFIG_URL),e.push(X.FALLBACK_CONFIG_URL);for(let l of e)try{let c=await fetch(l);if(c.ok){let s=await c.json(),d=s?.data??s,f=d.domains||d,i=d.cookies,y=d.tmdb_keys||d.tmdbKeys;f&&typeof f=="object"&&(k.cachedDomains={...k.cachedDomains,...f}),i&&typeof i=="object"&&(k.cachedCookies={...k.cachedCookies,...i}),Array.isArray(y)&&y.length>0&&(k.cachedTmdbKeys=y),k.lastFetchTime=t,k.lastFetchSource=l,S("Config",`Domainler basariyla cekildi: ${l}`,"info");try{typeof localStorage<"u"&&localStorage&&localStorage.setItem("__NUVIO_DOMAINS_CACHE_V3__",JSON.stringify({domains:k.cachedDomains,cookies:k.cachedCookies,tmdbKeys:k.cachedTmdbKeys,time:t}))}catch{}return}}catch(c){S("Config",`Domain alinamadi (${l}): ${c.message}`,"warn")}k.lastFetchTime=t-Z+Se}async function ee(n=!1){let t=Date.now(),e=Object.keys(k.cachedDomains).length>0;(n||!e||t-k.lastFetchTime>Z)&&(k.activeFetchPromise||(k.activeFetchPromise=Ce(n).finally(()=>{k.activeFetchPromise=null})),await k.activeFetchPromise)}async function ae(n){return await ee(),k.cachedDomains[n]||""}async function ne(){return await ee(),k.cachedTmdbKeys||[]}var ze="a2f888b27315e62e471b2d587048f32e",ie=[ze,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function te(n){let t=await ne(),e=t.length>0?[...t,...ie]:ie;for(let l=0;l<e.length;l++){let c=e[l],s=n.includes("?")?"&":"?",d=`https://api.themoviedb.org/3/${n}${s}api_key=${c}`;try{let f=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,i=await fetch(d,{signal:f});if(i.ok)return await i.json();if(i.status===429)continue}catch{}}return null}var x=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};x.__NUVIO_TMDB_CACHE__||(x.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var M=x.__NUVIO_TMDB_CACHE__,Fe=M.imdbIdCache,K=M.tmdbTitlesCache,Ge=M.tmdbImageCache,Oe=M.episodeGroupCache,Ue=M.absoluteEpCache;async function se(n,t){let e=String(n||"").replace(/^tmdb:/i,"").trim();if(!e)return{titles:[]};let l=`${t}:${e}`;if(K.has(l))return K.get(l);let c=(async()=>{let s=[],d,f,i=[],y=[],b,h=[];try{let _=t==="tv"||t==="series",r=_?"tv":"movie";if(e.startsWith("tt")){let a=await te(`find/${e}?external_source=imdb_id`);if(a){let p=_?a?.tv_results?.[0]:a?.movie_results?.[0];p&&(d=p.id,p.overview&&(b=p.overview))}}else d=parseInt(e,10);if(d&&!isNaN(d)){let a=await te(`${r}/${d}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(a){if(a.overview&&(b=a.overview),a.title&&(s.push(a.title),a.title.includes(":"))){let o=a.title.split(":")[0].trim();o.length>2&&s.push(o)}if(a.name&&(s.push(a.name),a.name.includes(":"))){let o=a.name.split(":")[0].trim();o.length>2&&s.push(o)}if(a.original_title&&a.original_title!==a.title&&(s.push(a.original_title),a.original_title.includes(":"))){let o=a.original_title.split(":")[0].trim();o.length>2&&s.push(o)}if(a.original_name&&a.original_name!==a.name&&(s.push(a.original_name),a.original_name.includes(":"))){let o=a.original_name.split(":")[0].trim();o.length>2&&s.push(o)}if(a.translations?.translations&&Array.isArray(a.translations.translations))for(let o of a.translations.translations){let g=o.data?.name||o.data?.title;if(g&&typeof g=="string"&&(s.push(g),g.includes(":"))){let T=g.split(":")[0].trim();T.length>2&&s.push(T)}}let p=(a.alternative_titles?.results||a.alternative_titles?.titles||[]).map(o=>o.title).filter(Boolean);s.push(...p);let m=a.release_date||a.first_air_date;if(m&&(f=parseInt(m.split("-")[0],10)),a.genres&&Array.isArray(a.genres)&&(h=a.genres.map(o=>o.name).filter(Boolean)),a.credits?.cast&&Array.isArray(a.credits.cast)){let o=new Set;a.credits.cast.slice(0,15).forEach(g=>{g.name&&o.add(g.name),g.original_name&&o.add(g.original_name)}),i=Array.from(o)}let u=[];a.created_by&&Array.isArray(a.created_by)&&u.push(...a.created_by.map(o=>o.name).filter(Boolean)),a.credits?.crew&&Array.isArray(a.credits.crew)&&u.push(...a.credits.crew.filter(o=>o.job==="Director"||o.department==="Directing").map(o=>o.name).filter(Boolean)),y=Array.from(new Set(u))}}}catch{}return{numericId:d,titles:Array.from(new Set(s.filter(Boolean))),year:f,cast:i,creators:y,overview:b,genres:h}})();return K.set(l,c),c}var we=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],oe=["tr","tur","ota"],Le=["english","ingilizce","original","orijinal","audio-en"],le=["en","eng","und"];function Ie(n,t){let e=!1,l=!1,c=[],s,d,f,i=(t||"").toLowerCase();if(i.includes("trdual")||i.includes("dual")||i.includes("trdub")||i.includes("dublaj")?(e=!0,l=!0):(i.includes("ses-tr")||i.includes("turkcedublaj")||i.includes("turkce-dublaj"))&&(e=!0),i.includes("2160p")||i.includes("4k")||i.includes("uhd")||i.includes("-2160.")?s="4K":i.includes("1080p")||i.includes("1920x1080")||i.includes("fhd")||i.includes("-1080.")?s="1080p":i.includes("720p")||i.includes("1280x720")||i.includes("hd")||i.includes("-720.")?s="720p":i.includes("480p")||i.includes("854x480")||i.includes("sd")||i.includes("-480.")?s="480p":(i.includes("360p")||i.includes("640x360")||i.includes("-360."))&&(s="360p"),i.includes("hevc")||i.includes("h265")||i.includes("x265")?d="HEVC":i.includes("av1")?d="AV1":(i.includes("h264")||i.includes("x264")||i.includes("avc"))&&(d="H.264"),i.includes("5.1")||i.includes("eac3")||i.includes("ac3")||i.includes("ddp")?f="Dolby 5.1":(i.includes("7.1")||i.includes("atmos"))&&(f="Dolby Atmos 7.1"),n&&typeof n=="string"){let b=n.split(/\r?\n/),h=0;for(let _ of b){let r=_.trim();if(r.startsWith("#EXT-X-MEDIA:")&&r.includes("TYPE=AUDIO")){let a=r.match(/NAME=["']([^"']+)["']/i),p=r.match(/LANGUAGE=["']([^"']+)["']/i),m=r.match(/GROUP-ID=["']([^"']+)["']/i),u=(a?a[1]:"").toLowerCase(),o=(p?p[1]:"").toLowerCase(),g=(m?m[1]:"").toLowerCase(),T=u.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),z=g.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),w=oe.includes(o)||oe.some(A=>T.includes(A)||z.includes(A))||we.some(A=>u.includes(A)||g.includes(A))||u.includes("t\xFCrk")||u.includes("turk")||g.includes("dual"),B=le.includes(o)||le.some(A=>T.includes(A)||z.includes(A))||Le.some(A=>u.includes(A)||g.includes(A))||u.includes("orig")||u.includes("ing")||u.includes("eng");w&&(e=!0),B&&(l=!0)}if(r.startsWith("#EXT-X-MEDIA:")&&r.includes("TYPE=SUBTITLES")){let a=r.match(/URI=["']([^"']+)["']/i),p=r.match(/NAME=["']([^"']+)["']/i),m=r.match(/LANGUAGE=["']([^"']+)["']/i);if(a&&a[1]){let u=a[1];if(t&&!u.startsWith("http"))try{u=new URL(u,t).toString()}catch{}let o=p?p[1]:"Altyaz\u0131",g=m?m[1].toLowerCase():"";g==="st"||g==="sot"||o.toLowerCase().includes("sotho")||o.toLowerCase().includes("sesotho")||u.toLowerCase().includes("sub_st")?(g="tr",o="T\xFCrk\xE7e"):g||(g=o.toLowerCase().includes("t\xFCrk")?"tr":"und");let z=$(g,o);c.push({label:z.name||o,url:u,lang:z.code||g})}}if(r.startsWith("#EXT-X-STREAM-INF:")){let a=r.match(/RESOLUTION=(\d+)x(\d+)/i);if(a){let p=parseInt(a[1],10),m=parseInt(a[2],10),u=Math.min(p,m),o=Math.max(p,m),g=u>=2100||o>=3800?2160:u>=1400||o>=2500?1440:u>=1e3||o>=1900?1080:u>=700||o>=1200?720:u>=450?480:u;g>h&&(h=g)}else{let p=r.match(/NAME=["']?([^"',\s]+)["']?/i);if(p){let m=p[1].toLowerCase();m.includes("2160")||m.includes("4k")?2160>h&&(h=2160):m.includes("1440")||m.includes("2k")?1440>h&&(h=1440):m.includes("1080")?1080>h&&(h=1080):m.includes("720")&&720>h&&(h=720)}}}}h>=2160?s="4K":h>=1440?s="2K":h>=1080?s="1080p":h>=720?s="720p":h>=480&&(s="480p")}let y=e&&l||i.includes("dual")||i.includes("trdual");return{hasTurkishAudio:e,hasOriginalAudio:l,isDual:y,embeddedSubtitles:c,detectedQuality:s,detectedCodec:d,detectedAudio:f}}var D={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function $(n,t,e){let l=m=>(m||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),c=l(n||""),s=l(t||""),d=!!e||c.includes("forced")||s.includes("forced")||c.includes("zorunlu")||s.includes("zorunlu"),f=c.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),i=s.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),y=m=>{let u=m.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return d?`${u} (Zorunlu)`:u};if(f==="st"||f==="sot"||f.includes("sotho")||i.includes("sotho")||i.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:d?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let b=D[c]||D[s]||D[f]||D[i];if(!b){let m=(i+" "+f).split(/\s+/).filter(Boolean);for(let u of m)if(D[u]){b=D[u];break}}if(!b){for(let[m,u]of Object.entries(D))if(m.length>=4&&(i.includes(m)||f.includes(m))){b=u;break}}if(b)return{code:b.code,iso3:b.iso3,language:b.language,name:y(b.name)};let h=(t||n||"Altyaz\u0131").trim();h=h.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let _=h.charAt(0).toUpperCase()+h.slice(1),r=y(_),a=c&&c.length===2?c:s&&s.length===2?s:"und",p=c&&c.length===3?c:s&&s.length===3?s:"und";return{code:a,iso3:p,language:_,name:r}}function re(n){let t=n.url?Ie(void 0,n.url):{},e=n.quality||n.inspection?.detectedQuality||t.detectedQuality||"1080p";e.includes("\u2022")&&(e=e.split("\u2022")[0].trim()),!e.includes("p")&&!e.includes("K")&&!e.includes("k")&&e!=="HD"&&e!=="FHD"&&e!=="SD"&&(e=`${e}p`);let l=n.subtitles||n.inspection?.subtitles,c=!!(n.inspection?.hasTurkishSubtitles||l?.some(g=>{let T=(g.lang||g.code||"").toLowerCase(),z=(g.langCode||g.iso3||"").toLowerCase(),w=(g.name||g.label||g.title||"").toLowerCase();return T==="tr"||T==="st"||z==="tur"||z==="sot"||w.includes("t\xFCrk")||w.includes("turk")||w.includes("sotho")})),s=(n.languageTitle||n.inspection?.languageTitle||"").toLowerCase().trim(),d=s.includes("dub")||s.includes("ses")||s.includes("dual")||!!t.hasTurkishAudio||!!n.inspection?.hasTurkishAudio,f=s.includes("dual")||s.includes("dub")&&(s.includes("alt")||s.includes("sub"))||d&&c,i="Orijinal";s.includes("yerli")||n.inspection?.isYerli?i="Yerli":f?i="Dublaj / Altyaz\u0131l\u0131":d?i="Dublaj":c||s.includes("alt")||s.includes("sub")?i="Altyaz\u0131l\u0131":(s.includes("orijinal")||s.includes("yabanc\u0131")||s.includes("original"))&&(i="Orijinal");let y=n.format==="m3u8"||n.url.includes(".m3u8")||n.url.includes("/master.")||n.url.includes("/hls/")||n.url.includes("/txt/"),b=n.format||(y?"m3u8":n.url.includes(".mp4")?"mp4":"m3u8"),h=b==="m3u8"?"HLS":b.toUpperCase(),_=[e],r=n.codec||n.inspection?.detectedCodec||t.detectedCodec;r&&r!=="H.264"&&_.push(r),_.push(h),n.bitrate&&_.push(n.bitrate);let a=n.audio||n.inspection?.detectedAudio||t.detectedAudio;a&&a!=="AAC 2.0"&&_.push(a);let p=n.details||_.join(" \u2022 "),m=`${i}
${p}`,u=`${e} \u2022 ${i}`,o={name:"han's 38",provider:"han's 38",title:i,description:m,url:n.url,quality:u,format:b};return n.headers&&Object.keys(n.headers).length>0&&(o.headers=n.headers),l&&l.length>0&&(o.subtitles=l),o}function ce(n){return[...n].sort((t,e)=>{let l=(t.label||t.name||"").toLowerCase().includes("forced")||(t.label||t.name||"").toLowerCase().includes("zorunlu"),c=(e.label||e.name||"").toLowerCase().includes("forced")||(e.label||e.name||"").toLowerCase().includes("zorunlu"),s=t.lang==="tr"||t.lang==="tur"||t.lang==="st"||t.langCode==="tur"||t.langCode==="sot"||(t.label||t.name||"").toLowerCase().includes("t\xFCrk")||(t.label||t.name||"").toLowerCase().includes("sotho"),d=e.lang==="tr"||e.lang==="tur"||e.lang==="st"||e.langCode==="tur"||e.langCode==="sot"||(e.label||e.name||"").toLowerCase().includes("t\xFCrk")||(e.label||e.name||"").toLowerCase().includes("sotho");if(s&&d)return!l&&c?-1:l&&!c?1:0;if(s&&!d)return-1;if(!s&&d)return 1;let f=t.lang==="en"||t.lang==="eng"||t.langCode==="eng"||(t.label||t.name||"").toLowerCase().includes("ing"),i=e.lang==="en"||e.lang==="eng"||e.langCode==="eng"||(e.label||e.name||"").toLowerCase().includes("ing");if(f&&!i)return-1;if(!f&&i)return 1;let y=t.label||t.name||t.title||"",b=e.label||e.name||e.title||"";return y.localeCompare(b,"tr")})}var H="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";function De(n){try{if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")return AbortSignal.timeout(n)}catch{}}async function P(n,t,e,l){if(typeof n=="object"&&n!==null){let r=n;n=r.id||r.tmdbId||r.tmdb_id||r.imdbId||r.imdb_id||"",!t&&(r.type||r.mediaType)&&(t=r.type||r.mediaType),e===void 0&&(r.season!==void 0||r.seasonNum!==void 0)&&(e=r.season??r.seasonNum),l===void 0&&(r.episode!==void 0||r.episodeNum!==void 0)&&(l=r.episode??r.episodeNum)}let c=String(n||"").trim();c.toLowerCase().startsWith("tmdb:")&&(c=c.slice(5));let s=c.split(":"),d=s[0].trim();s.length>=3&&e==null&&(e=parseInt(s[1],10),l=parseInt(s[2],10));let f=String(t||"").toLowerCase().trim(),i=f==="tv"||f==="series"||f==="show"||f==="dizi",y=i?"tv":"movie",b=e!=null?parseInt(String(e),10):1,h=l!=null?parseInt(String(l),10):1,_=Date.now();S("han's 38",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${d}, T\xFCr: ${y}${i?` (S${b}E${h})`:""}`);try{let r=d;if(r.startsWith("tt")){let v=await se(r,y);v&&v.numericId&&(r=String(v.numericId))}if(!r)return S("han's 38","Ge\xE7erli bir TMDB ID bulunamad\u0131.","warn"),[];let a=await ae("bogard");if(!a)return S("han's 38","Domain not resolved","warn"),[];a=a.replace(/\/+$/,"");let p=i?`${a}/dizi/${encodeURIComponent(r)}/${b}/${h}`:`${a}/film/${encodeURIComponent(r)}/`;S("han's 38",`[Ad\u0131m 1/3] Oynat\u0131c\u0131 sayfas\u0131na ba\u011Flan\u0131l\u0131yor: ${p}`);let m={"User-Agent":H,Referer:`${a}/`,Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},u=await fetch(p,{headers:m,signal:De(8e3)});if(!u.ok)return S("han's 38",`Oynat\u0131c\u0131 sayfas\u0131 a\xE7\u0131lamad\u0131: HTTP ${u.status}`,"warn"),[];let o=await u.text(),g=o.match(/const\s+src\s*=\s*['"]([^'"]+)['"]/);if(!g||!g[1])return S("han's 38","\u0130\xE7erik kaynakta bulunamad\u0131.","info"),[];let T=g[1],z=T.startsWith("http")?T:`${a}${T.startsWith("/")?"":"/"}${T}`,w=o.match(/const\s+videoId\s*=\s*(\d+)/),B=T.match(/[?&]id=(\d+)/),A=w?w[1]:B?B[1]:"",q=o.match(/const\s+tokenParams\s*=\s*['"]([^'"]+)['"]/),ue=q?q[1]:T.includes("&token=")?T.substring(T.indexOf("&token=")):"",I=null,Y=o.match(/tracksData\s*=\s*(\{[\s\S]+?\});/);if(Y)try{I=JSON.parse(Y[1])}catch{}let V=I&&Array.isArray(I.subtitles)?I.subtitles:[],j=[];for(let v=0;v<V.length;v++){let C=V[v];if(!C||!C.url)continue;let L=C.url;L.startsWith("http")||(L=`${a}/play.m3u8?id=${A}&p=${encodeURIComponent(C.url)}${ue}`);let Q=(C.name||"").trim(),me=(C.lang||C.name||"").trim(),fe=!!C.forced||Q.toLowerCase().includes("forced")||L.toLowerCase().includes("forced"),R=$(me,Q,fe),O=R.name;j.some(he=>he.url===L)||j.push({id:String(j.length),language:R.language,name:O,label:O,title:O,lang:R.code,langCode:R.iso3,url:L,type:"vtt",headers:{"User-Agent":H,Referer:`${a}/`}})}let W=ce(j),ge=I&&Array.isArray(I.audio)?I.audio:[],G=!1;for(let v of ge){let C=(v.lang||"").toLowerCase(),L=(v.name||"").toLowerCase();if(C==="tur"||C==="tr"||L.includes("t\xFCrk")||L.includes("turk")){G=!0;break}}let J=W.some(v=>v.lang==="tr"||v.langCode==="tur"),N="Orijinal";G&&J?N="Dublaj / Altyaz\u0131l\u0131":G?N="Dublaj":J&&(N="Altyaz\u0131l\u0131");let E=re({name:"han's 38",url:z,quality:"1080p",format:"m3u8",languageTitle:N,subtitles:W,headers:{"User-Agent":H,Referer:`${a}/`,Origin:a}}),de=((Date.now()-_)/1e3).toFixed(2);return S("han's 38",`TAMAMLANDI: 1 ak\u0131\u015F haz\u0131rland\u0131 (${de}s)`,"success",[{quality:E.quality,title:E.title,format:E.format}]),[E]}catch(r){return S("han's 38",`Hata olu\u015Ftu: ${r?.message||"Bilinmeyen hata"}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=P);typeof global<"u"&&(global.getStreams=P);typeof window<"u"&&(window.getStreams=P);var Me={getStreams:P};

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

;(()=>{const n="han's 38",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
