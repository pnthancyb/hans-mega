
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

"use strict";var j=Object.defineProperty;var ee=Object.getOwnPropertyDescriptor;var ae=Object.getOwnPropertyNames;var ne=Object.prototype.hasOwnProperty;var ie=(e,i)=>{for(var s in i)j(e,s,{get:i[s],enumerable:!0})},te=(e,i,s,l)=>{if(i&&typeof i=="object"||typeof i=="function")for(let c of ae(i))!ne.call(e,c)&&c!==s&&j(e,c,{get:()=>i[c],enumerable:!(l=ee(i,c))||l.enumerable});return e};var se=e=>te(j({},"__esModule",{value:!0}),e);var fe={};ie(fe,{getStreams:()=>Z});module.exports=se(fe);var oe=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(i=>String.fromCharCode(i^42)).join(""),D={REMOTE_CONFIG_URL:oe,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},I=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},K="__NUVIO_CONFIG_CACHE__",N=60*60*1e3,R=2*60*1e3;if(!I.__NUVIO_CONFIG_STATE__){I.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null};try{if(typeof localStorage<"u"&&localStorage&&typeof localStorage.getItem=="function"){let e=localStorage.getItem(K);if(e){let i=JSON.parse(e);i&&i.timestamp&&Date.now()-i.timestamp<N&&(i.domains&&typeof i.domains=="object"&&(I.__NUVIO_CONFIG_STATE__.cachedDomains=i.domains),i.cookies&&typeof i.cookies=="object"&&(I.__NUVIO_CONFIG_STATE__.cachedCookies=i.cookies),Array.isArray(i.tmdbKeys)&&i.tmdbKeys.length>0&&(I.__NUVIO_CONFIG_STATE__.cachedTmdbKeys=i.tmdbKeys),I.__NUVIO_CONFIG_STATE__.lastFetchTime=i.timestamp)}}}catch{}}var A=I.__NUVIO_CONFIG_STATE__;function re(e){try{typeof localStorage<"u"&&localStorage&&typeof localStorage.setItem=="function"&&localStorage.setItem(K,JSON.stringify({timestamp:e,domains:A.cachedDomains,cookies:A.cachedCookies,tmdbKeys:A.cachedTmdbKeys}))}catch{}}async function le(){let e=Date.now();try{let i={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let l=AbortSignal.timeout(8e3);l&&(i.signal=l)}catch{}let s=await fetch(D.REMOTE_CONFIG_URL,i);if(s.ok){let l=await s.json(),c=l?.data??l,n=c.domains||c,d=c.cookies,b=c.tmdb_keys||c.tmdbKeys;n&&typeof n=="object"&&(A.cachedDomains={...A.cachedDomains,...n}),d&&typeof d=="object"&&(A.cachedCookies={...A.cachedCookies,...d}),Array.isArray(b)&&b.length>0&&(A.cachedTmdbKeys=b),A.lastFetchTime=e,re(e)}else A.lastFetchTime=e-N+R}catch{A.lastFetchTime=e-N+R}}async function x(){let e=Date.now();(!(Object.keys(A.cachedDomains).length>0)||e-A.lastFetchTime>N)&&(A.activeFetchPromise||(A.activeFetchPromise=le().finally(()=>{A.activeFetchPromise=null})),await A.activeFetchPromise)}async function $(e){return await x(),A.cachedDomains[e]||""}async function H(){return await x(),A.cachedTmdbKeys||[]}var ce="a2f888b27315e62e471b2d587048f32e",q=[ce,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function G(e){let i=await H(),s=i.length>0?[...i,...q]:q;for(let l=0;l<s.length;l++){let c=s[l],n=e.includes("?")?"&":"?",d=`https://api.themoviedb.org/3/${e}${n}api_key=${c}`;try{let b=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,t=await fetch(d,{signal:b});if(t.ok)return await t.json();if(t.status===429)continue}catch{}}return null}var O=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};O.__NUVIO_TMDB_CACHE__||(O.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var P=O.__NUVIO_TMDB_CACHE__,U=P.imdbIdCache,F=P.tmdbTitlesCache,ye=P.tmdbImageCache,ke=P.episodeGroupCache,_e=P.absoluteEpCache;async function Y(e,i){let s=String(e||"").replace(/^tmdb:/i,"").trim();if(!s)return null;if(s.startsWith("tt"))return s;let l=`${i}:${s}`;if(U.has(l))return U.get(l);let c=(async()=>{try{let d=await G(`${i==="tv"||i==="series"?"tv":"movie"}/${s}/external_ids`);if(d&&d.imdb_id)return d.imdb_id}catch{}return null})();return U.set(l,c),c}async function V(e,i){let s=String(e||"").replace(/^tmdb:/i,"").trim();if(!s)return{titles:[]};let l=`${i}:${s}`;if(F.has(l))return F.get(l);let c=(async()=>{let n=[],d,b,t=[],w=[],f,g=[];try{let z=i==="tv"||i==="series",y=z?"tv":"movie";if(s.startsWith("tt")){let a=await G(`find/${s}?external_source=imdb_id`);if(a){let h=z?a?.tv_results?.[0]:a?.movie_results?.[0];h&&(d=h.id,h.overview&&(f=h.overview))}}else d=parseInt(s,10);if(d&&!isNaN(d)){let a=await G(`${y}/${d}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(a){if(a.overview&&(f=a.overview),a.title&&(n.push(a.title),a.title.includes(":"))){let o=a.title.split(":")[0].trim();o.length>2&&n.push(o)}if(a.name&&(n.push(a.name),a.name.includes(":"))){let o=a.name.split(":")[0].trim();o.length>2&&n.push(o)}if(a.original_title&&a.original_title!==a.title&&(n.push(a.original_title),a.original_title.includes(":"))){let o=a.original_title.split(":")[0].trim();o.length>2&&n.push(o)}if(a.original_name&&a.original_name!==a.name&&(n.push(a.original_name),a.original_name.includes(":"))){let o=a.original_name.split(":")[0].trim();o.length>2&&n.push(o)}if(a.translations?.translations&&Array.isArray(a.translations.translations))for(let o of a.translations.translations){let r=o.data?.name||o.data?.title;if(r&&typeof r=="string"&&(n.push(r),r.includes(":"))){let p=r.split(":")[0].trim();p.length>2&&n.push(p)}}let h=(a.alternative_titles?.results||a.alternative_titles?.titles||[]).map(o=>o.title).filter(Boolean);n.push(...h);let m=a.release_date||a.first_air_date;m&&(b=parseInt(m.split("-")[0],10)),a.genres&&Array.isArray(a.genres)&&(g=a.genres.map(o=>o.name).filter(Boolean)),a.credits?.cast&&Array.isArray(a.credits.cast)&&(t=a.credits.cast.slice(0,10).map(o=>o.name).filter(Boolean));let u=[];a.created_by&&Array.isArray(a.created_by)&&u.push(...a.created_by.map(o=>o.name).filter(Boolean)),a.credits?.crew&&Array.isArray(a.credits.crew)&&u.push(...a.credits.crew.filter(o=>o.job==="Director"||o.department==="Directing").map(o=>o.name).filter(Boolean)),w=Array.from(new Set(u))}}}catch{}return{numericId:d,titles:Array.from(new Set(n.filter(Boolean))),year:b,cast:t,creators:w,overview:f,genres:g}})();return F.set(l,c),c}function C(e,i,s="info",l){let c=`[${e}]`;s==="error"?console.error(c,i,l||""):s==="warn"?console.warn(c,i,l||""):console.log(c,i,l||"");try{let d=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof d=="string"&&d.startsWith("http")&&fetch(d,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:s,message:i,details:l})}).catch(()=>{})}catch{}}var ue=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],W=["tr","tur","ota"],ge=["english","ingilizce","original","orijinal","audio-en"],J=["en","eng","und"];function de(e,i){let s=!1,l=!1,c=[],n,d,b,t=(i||"").toLowerCase();if(t.includes("trdual")||t.includes("dual")||t.includes("trdub")||t.includes("dublaj")?(s=!0,l=!0):(t.includes("ses-tr")||t.includes("turkcedublaj")||t.includes("turkce-dublaj"))&&(s=!0),t.includes("2160p")||t.includes("4k")||t.includes("uhd")?n="4K":t.includes("1080p")||t.includes("1920x1080")||t.includes("fhd")?n="1080p":t.includes("720p")||t.includes("1280x720")||t.includes("hd")?n="720p":(t.includes("480p")||t.includes("854x480")||t.includes("sd"))&&(n="480p"),t.includes("hevc")||t.includes("h265")||t.includes("x265")?d="HEVC":t.includes("av1")?d="AV1":(t.includes("h264")||t.includes("x264")||t.includes("avc"))&&(d="H.264"),t.includes("5.1")||t.includes("eac3")||t.includes("ac3")||t.includes("ddp")?b="Dolby 5.1":(t.includes("7.1")||t.includes("atmos"))&&(b="Dolby Atmos 7.1"),e&&typeof e=="string"){let f=e.split(/\r?\n/),g=0;for(let z of f){let y=z.trim();if(y.startsWith("#EXT-X-MEDIA:")&&y.includes("TYPE=AUDIO")){let a=y.match(/NAME=["']([^"']+)["']/i),h=y.match(/LANGUAGE=["']([^"']+)["']/i),m=y.match(/GROUP-ID=["']([^"']+)["']/i),u=(a?a[1]:"").toLowerCase(),o=(h?h[1]:"").toLowerCase(),r=(m?m[1]:"").toLowerCase(),p=u.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),_=r.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),k=W.includes(o)||W.some(T=>p.includes(T)||_.includes(T))||ue.some(T=>u.includes(T)||r.includes(T))||u.includes("t\xFCrk")||u.includes("turk")||r.includes("dual"),S=J.includes(o)||J.some(T=>p.includes(T)||_.includes(T))||ge.some(T=>u.includes(T)||r.includes(T))||u.includes("orig")||u.includes("ing")||u.includes("eng");k&&(s=!0),S&&(l=!0)}if(y.startsWith("#EXT-X-MEDIA:")&&y.includes("TYPE=SUBTITLES")){let a=y.match(/URI=["']([^"']+)["']/i),h=y.match(/NAME=["']([^"']+)["']/i),m=y.match(/LANGUAGE=["']([^"']+)["']/i);if(a&&a[1]){let u=a[1];if(i&&!u.startsWith("http"))try{u=new URL(u,i).toString()}catch{}let o=h?h[1]:"Altyaz\u0131",r=m?m[1].toLowerCase():"";r==="st"||r==="sot"||o.toLowerCase().includes("sotho")||o.toLowerCase().includes("sesotho")||u.toLowerCase().includes("sub_st")?(r="tr",o="T\xFCrk\xE7e"):r||(r=o.toLowerCase().includes("t\xFCrk")?"tr":"und");let _=me(r,o);c.push({label:_.name||o,url:u,lang:_.code||r})}}if(y.startsWith("#EXT-X-STREAM-INF:")){let a=y.match(/RESOLUTION=(\d+)x(\d+)/i);if(a){let h=parseInt(a[1],10),m=parseInt(a[2],10),u=Math.min(h,m),o=Math.max(h,m),r=u>=2100||o>=3800?2160:u>=1400||o>=2500?1440:u>=1e3||o>=1900?1080:u>=700||o>=1200?720:u>=450?480:u;r>g&&(g=r)}else{let h=y.match(/NAME=["']?([^"',\s]+)["']?/i);if(h){let m=h[1].toLowerCase();m.includes("2160")||m.includes("4k")?2160>g&&(g=2160):m.includes("1440")||m.includes("2k")?1440>g&&(g=1440):m.includes("1080")?1080>g&&(g=1080):m.includes("720")&&720>g&&(g=720)}}}}g>=2160?n="4K":g>=1440?n="2K":g>=1080?n="1080p":g>=720?n="720p":g>=480&&(n="480p")}let w=s&&l||t.includes("dual")||t.includes("trdual");return{hasTurkishAudio:s,hasOriginalAudio:l,isDual:w,embeddedSubtitles:c,detectedQuality:n,detectedCodec:d,detectedAudio:b}}var L={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function me(e,i,s){let l=m=>(m||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),c=l(e||""),n=l(i||""),d=!!s||c.includes("forced")||n.includes("forced")||c.includes("zorunlu")||n.includes("zorunlu"),b=c.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),t=n.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),w=m=>{let u=m.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return d?`${u} (Zorunlu)`:u};if(b==="st"||b==="sot"||b.includes("sotho")||t.includes("sotho")||t.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:d?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let f=L[c]||L[n]||L[b]||L[t];if(!f){let m=(t+" "+b).split(/\s+/).filter(Boolean);for(let u of m)if(L[u]){f=L[u];break}}if(!f){for(let[m,u]of Object.entries(L))if(m.length>=4&&(t.includes(m)||b.includes(m))){f=u;break}}if(f)return{code:f.code,iso3:f.iso3,language:f.language,name:w(f.name)};let g=(i||e||"Altyaz\u0131").trim();g=g.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let z=g.charAt(0).toUpperCase()+g.slice(1),y=w(z),a=c&&c.length===2?c:n&&n.length===2?n:"und",h=c&&c.length===3?c:n&&n.length===3?n:"und";return{code:a,iso3:h,language:z,name:y}}function Q(e){let i=e.url?de(void 0,e.url):{},s=e.quality||e.inspection?.detectedQuality||i.detectedQuality||"1080p";s.includes("\u2022")&&(s=s.split("\u2022")[0].trim()),!s.includes("p")&&!s.includes("K")&&!s.includes("k")&&(s=`${s}p`);let l=e.subtitles||e.inspection?.subtitles,c=!!(e.inspection?.hasTurkishSubtitles||l?.some(r=>{let p=(r.lang||r.code||"").toLowerCase(),_=(r.langCode||r.iso3||"").toLowerCase(),k=(r.name||r.label||r.title||"").toLowerCase();return p==="tr"||p==="st"||_==="tur"||_==="sot"||k.includes("t\xFCrk")||k.includes("turk")||k.includes("sotho")})),n=(e.languageTitle||e.inspection?.languageTitle||"").toLowerCase().trim(),d=n.includes("dub")||n.includes("ses")||n.includes("dual")||!!i.hasTurkishAudio||!!e.inspection?.hasTurkishAudio,b=n.includes("dual")||n.includes("dub")&&(n.includes("alt")||n.includes("sub"))||d&&c,t="Orijinal";n.includes("yerli")||e.inspection?.isYerli?t="Yerli":b?t="Dublaj / Altyaz\u0131l\u0131":d?t="Dublaj":c||n.includes("alt")||n.includes("sub")?t="Altyaz\u0131l\u0131":(n.includes("orijinal")||n.includes("yabanc\u0131")||n.includes("original"))&&(t="Orijinal");let w=e.format==="m3u8"||e.url.includes(".m3u8")||e.url.includes("/master.")||e.url.includes("/hls/")||e.url.includes("/txt/"),f=e.format||(w?"m3u8":e.url.includes(".mp4")?"mp4":"m3u8"),g=f==="m3u8"?"HLS":f.toUpperCase(),z=[s],y=e.codec||e.inspection?.detectedCodec||i.detectedCodec;y&&y!=="H.264"&&z.push(y),z.push(g),e.bitrate&&z.push(e.bitrate);let a=e.audio||e.inspection?.detectedAudio||i.detectedAudio;a&&a!=="AAC 2.0"&&z.push(a);let h=e.details||z.join(" \u2022 "),m=`${t}
${h}`,u=`${s} \u2022 ${t}`,o={name:"han's 35",provider:"han's 35",title:t,description:m,url:e.url,quality:u,format:f};return e.headers&&Object.keys(e.headers).length>0&&(o.headers=e.headers),l&&l.length>0&&(o.subtitles=l),o}var X=["1080p","720p","480p"];async function Z(e,i,s,l){let c=Date.now();C("han's 35",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${e}, T\xFCr: ${i}, Sezon: ${s}, B\xF6l\xFCm: ${l}`);try{let n=String(i||"").toLowerCase().trim(),d=n==="tv"||n==="series",b=d?"tv":"movie",t=s!=null&&s!==""?parseInt(String(s),10):1,w=l!=null&&l!==""?parseInt(String(l),10):1,f=String(e||"").trim();C("han's 35",`[Ad\u0131m 1/3] Metadata \xE7\xF6z\xFCmleniyor (${f})...`);let g=null;f.startsWith("tt")?g=f:g=await Y(f,b);let z=await V(f,b),y=z?.numericId||(f.startsWith("tt")?void 0:parseInt(f,10)),a=z?.titles||[],h=await $("urouge");if(!h)return C("han's 35","Domain not resolved","warn"),[];let m=h.replace(/\/+$/,""),u={};if(d){let r=[];g&&r.push(g);for(let v of a)v&&!r.includes(v)&&r.push(v);let p=[];for(let v of r){let M=`${m}/v1/shows?filters[q]=${encodeURIComponent(v)}&expand=episodes.streams`;C("han's 35",`[Ad\u0131m 2/3] Dizi API sorgulan\u0131yor (${v})...`);try{let E=await fetch(M,{headers:{"User-Agent":D.DEFAULT_USER_AGENT,Accept:"application/json, text/plain, */*"}});if(E.ok){let B=await E.json();if(Array.isArray(B.items)&&B.items.length>0){p=B.items;break}}}catch(E){C("han's 35",`Dizi sorgu hatas\u0131: ${E}`,"warn")}}if(p.length===0)return C("han's 35",`Dizi ar\u015Fivde bulunamad\u0131: ${f}`,"info"),[];let _=g?g.replace(/^tt0*/,""):null,k=_?p.find(v=>v.imdb_id?String(v.imdb_id).replace(/^tt0*/,"")===_:!1):void 0;if(!k)return C("han's 35",`Dizi ar\u015Fivde e\u015Fle\u015Fmedi: ${f}`,"info"),[];let T=(k.episodes||[]).find(v=>Number(v.season)===t&&Number(v.episode)===w);if(!T||!T.streams||typeof T.streams!="object")return C("han's 35",`\u0130stenen b\xF6l\xFCm bulunamad\u0131 (S${t}E${w})`,"warn"),[];Object.assign(u,T.streams)}else{let r=[];for(let S of a)S&&!r.includes(S)&&r.push(S);g&&!r.includes(g)&&r.push(g);let p=[];for(let S of r){let T=`${m}/v1/movies?filters[q]=${encodeURIComponent(S)}&expand=streams`;C("han's 35",`[Ad\u0131m 2/3] Film API sorgulan\u0131yor (${S})...`);try{let v=await fetch(T,{headers:{"User-Agent":D.DEFAULT_USER_AGENT,Accept:"application/json, text/plain, */*"}});if(v.ok){let M=await v.json();if(Array.isArray(M.items)&&M.items.length>0){p=M.items;break}}}catch(v){C("han's 35",`Film sorgu hatas\u0131: ${v}`,"warn")}}if(p.length===0)return C("han's 35",`Film ar\u015Fivde bulunamad\u0131: ${f}`,"info"),[];let _=g?g.replace(/^tt0*/,""):null,k=y?p.find(S=>S.tmdb_prefix&&Number(S.tmdb_prefix)===Number(y)):void 0;if(!k&&_&&(k=p.find(S=>S.imdb_id?String(S.imdb_id).replace(/^tt0*/,"")===_:!1)),!k)return C("han's 35",`Film ar\u015Fivde e\u015Fle\u015Fmedi: ${f}`,"info"),[];if(!k.streams||typeof k.streams!="object")return C("han's 35","Film i\xE7in yay\u0131n ak\u0131\u015F\u0131 bulunamad\u0131.","warn"),[];Object.assign(u,k.streams)}let o=Object.keys(u);if(o.length===0)return C("han's 35","Kullan\u0131labilir ak\u0131\u015F kalitesi bulunamad\u0131.","info"),[];o.sort((r,p)=>{let _=X.indexOf(r.toLowerCase()),k=X.indexOf(p.toLowerCase());return _!==-1&&k!==-1?_-k:_!==-1?-1:k!==-1?1:p.localeCompare(r)});for(let r of o){let p=u[r]?.trim();if(!p||!p.startsWith("http"))continue;let _=r.includes("p")?r:`${r}p`,k=Q({name:"han's 35",url:p,languageTitle:"Orijinal",quality:_,details:`${_} \u2022 HLS`,format:"m3u8",headers:{"User-Agent":D.DEFAULT_USER_AGENT}});k.type="hls";let S=[k],T=((Date.now()-c)/1e3).toFixed(2);return C("han's 35",`[Ad\u0131m 3/3] TAMAMLANDI: 1 ak\u0131\u015F haz\u0131rland\u0131 (${T}s)`,"success",S.map(v=>({title:v.title,quality:v.quality||"1080p",format:"m3u8"}))),S}return[]}catch(n){return C("han's 35",`Hata: ${n?.message||n}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=Z);

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
