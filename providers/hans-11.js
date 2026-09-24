
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

"use strict";var D=Object.defineProperty;var Z=Object.getOwnPropertyDescriptor;var ee=Object.getOwnPropertyNames;var ae=Object.prototype.hasOwnProperty;var ne=(e,n)=>{for(var s in n)D(e,s,{get:n[s],enumerable:!0})},ie=(e,n,s,o)=>{if(n&&typeof n=="object"||typeof n=="function")for(let l of ee(n))!ae.call(e,l)&&l!==s&&D(e,l,{get:()=>n[l],enumerable:!(o=Z(n,l))||o.enumerable});return e};var te=e=>ie(D({},"__esModule",{value:!0}),e);var fe={};ne(fe,{getStreams:()=>Q});module.exports=te(fe);var se=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(n=>String.fromCharCode(n^42)).join(""),oe={REMOTE_CONFIG_URL:se,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},C=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},F="__NUVIO_CONFIG_CACHE__",M=60*60*1e3,j=2*60*1e3;if(!C.__NUVIO_CONFIG_STATE__){C.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null};try{if(typeof localStorage<"u"&&localStorage&&typeof localStorage.getItem=="function"){let e=localStorage.getItem(F);if(e){let n=JSON.parse(e);n&&n.timestamp&&Date.now()-n.timestamp<M&&(n.domains&&typeof n.domains=="object"&&(C.__NUVIO_CONFIG_STATE__.cachedDomains=n.domains),n.cookies&&typeof n.cookies=="object"&&(C.__NUVIO_CONFIG_STATE__.cachedCookies=n.cookies),Array.isArray(n.tmdbKeys)&&n.tmdbKeys.length>0&&(C.__NUVIO_CONFIG_STATE__.cachedTmdbKeys=n.tmdbKeys),C.__NUVIO_CONFIG_STATE__.lastFetchTime=n.timestamp)}}}catch{}}var T=C.__NUVIO_CONFIG_STATE__;function le(e){try{typeof localStorage<"u"&&localStorage&&typeof localStorage.setItem=="function"&&localStorage.setItem(F,JSON.stringify({timestamp:e,domains:T.cachedDomains,cookies:T.cachedCookies,tmdbKeys:T.cachedTmdbKeys}))}catch{}}async function re(){let e=Date.now();try{let n={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let o=AbortSignal.timeout(8e3);o&&(n.signal=o)}catch{}let s=await fetch(oe.REMOTE_CONFIG_URL,n);if(s.ok){let o=await s.json(),l=o?.data??o,a=l.domains||l,r=l.cookies,g=l.tmdb_keys||l.tmdbKeys;a&&typeof a=="object"&&(T.cachedDomains={...T.cachedDomains,...a}),r&&typeof r=="object"&&(T.cachedCookies={...T.cachedCookies,...r}),Array.isArray(g)&&g.length>0&&(T.cachedTmdbKeys=g),T.lastFetchTime=e,le(e)}else T.lastFetchTime=e-M+j}catch{T.lastFetchTime=e-M+j}}async function O(){let e=Date.now();(!(Object.keys(T.cachedDomains).length>0)||e-T.lastFetchTime>M)&&(T.activeFetchPromise||(T.activeFetchPromise=re().finally(()=>{T.activeFetchPromise=null})),await T.activeFetchPromise)}async function G(e){return await O(),T.cachedDomains[e]||""}async function U(){return await O(),T.cachedTmdbKeys||[]}var ce="a2f888b27315e62e471b2d587048f32e",K=[ce,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function N(e){let n=await U(),s=n.length>0?[...n,...K]:K;for(let o=0;o<s.length;o++){let l=s[o],a=e.includes("?")?"&":"?",r=`https://api.themoviedb.org/3/${e}${a}api_key=${l}`;try{let g=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,t=await fetch(r,{signal:g});if(t.ok)return await t.json();if(t.status===429)continue}catch{}}return null}var E=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};E.__NUVIO_TMDB_CACHE__||(E.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var I=E.__NUVIO_TMDB_CACHE__,P=I.imdbIdCache,R=I.tmdbTitlesCache,ke=I.tmdbImageCache,Te=I.episodeGroupCache,_e=I.absoluteEpCache;async function x(e,n){let s=String(e||"").replace(/^tmdb:/i,"").trim();if(!s)return null;if(s.startsWith("tt"))return s;let o=`${n}:${s}`;if(P.has(o))return P.get(o);let l=(async()=>{try{let r=await N(`${n==="tv"||n==="series"?"tv":"movie"}/${s}/external_ids`);if(r&&r.imdb_id)return r.imdb_id}catch{}return null})();return P.set(o,l),l}async function $(e,n){let s=String(e||"").replace(/^tmdb:/i,"").trim();if(!s)return{titles:[]};let o=`${n}:${s}`;if(R.has(o))return R.get(o);let l=(async()=>{let a=[],r,g,t=[],f=[],y,m=[];try{let k=n==="tv"||n==="series",h=k?"tv":"movie";if(s.startsWith("tt")){let i=await N(`find/${s}?external_source=imdb_id`);if(i){let u=k?i?.tv_results?.[0]:i?.movie_results?.[0];u&&(r=u.id,u.overview&&(y=u.overview))}}else r=parseInt(s,10);if(r&&!isNaN(r)){let i=await N(`${h}/${r}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(i){if(i.overview&&(y=i.overview),i.title&&(a.push(i.title),i.title.includes(":"))){let c=i.title.split(":")[0].trim();c.length>2&&a.push(c)}if(i.name&&(a.push(i.name),i.name.includes(":"))){let c=i.name.split(":")[0].trim();c.length>2&&a.push(c)}if(i.original_title&&i.original_title!==i.title&&(a.push(i.original_title),i.original_title.includes(":"))){let c=i.original_title.split(":")[0].trim();c.length>2&&a.push(c)}if(i.original_name&&i.original_name!==i.name&&(a.push(i.original_name),i.original_name.includes(":"))){let c=i.original_name.split(":")[0].trim();c.length>2&&a.push(c)}if(i.translations?.translations&&Array.isArray(i.translations.translations))for(let c of i.translations.translations){let b=c.data?.name||c.data?.title;if(b&&typeof b=="string"&&(a.push(b),b.includes(":"))){let S=b.split(":")[0].trim();S.length>2&&a.push(S)}}let u=(i.alternative_titles?.results||i.alternative_titles?.titles||[]).map(c=>c.title).filter(Boolean);a.push(...u);let p=i.release_date||i.first_air_date;p&&(g=parseInt(p.split("-")[0],10)),i.genres&&Array.isArray(i.genres)&&(m=i.genres.map(c=>c.name).filter(Boolean)),i.credits?.cast&&Array.isArray(i.credits.cast)&&(t=i.credits.cast.slice(0,10).map(c=>c.name).filter(Boolean));let d=[];i.created_by&&Array.isArray(i.created_by)&&d.push(...i.created_by.map(c=>c.name).filter(Boolean)),i.credits?.crew&&Array.isArray(i.credits.crew)&&d.push(...i.credits.crew.filter(c=>c.job==="Director"||c.department==="Directing").map(c=>c.name).filter(Boolean)),f=Array.from(new Set(d))}}}catch{}return{numericId:r,titles:Array.from(new Set(a.filter(Boolean))),year:g,cast:t,creators:f,overview:y,genres:m}})();return R.set(o,l),l}function v(e,n,s="info",o){let l=`[${e}]`;s==="error"?console.error(l,n,o||""):s==="warn"?console.warn(l,n,o||""):console.log(l,n,o||"");try{let r=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof r=="string"&&r.startsWith("http")&&fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:s,message:n,details:o})}).catch(()=>{})}catch{}}var ue=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],H=["tr","tur","ota"],ge=["english","ingilizce","original","orijinal","audio-en"],q=["en","eng","und"];function Y(e,n){let s=!1,o=!1,l=[],a,r,g,t=(n||"").toLowerCase();if(t.includes("trdual")||t.includes("dual")||t.includes("trdub")||t.includes("dublaj")?(s=!0,o=!0):(t.includes("ses-tr")||t.includes("turkcedublaj")||t.includes("turkce-dublaj"))&&(s=!0),t.includes("2160p")||t.includes("4k")||t.includes("uhd")?a="4K":t.includes("1080p")||t.includes("1920x1080")||t.includes("fhd")?a="1080p":t.includes("720p")||t.includes("1280x720")||t.includes("hd")?a="720p":(t.includes("480p")||t.includes("854x480")||t.includes("sd"))&&(a="480p"),t.includes("hevc")||t.includes("h265")||t.includes("x265")?r="HEVC":t.includes("av1")?r="AV1":(t.includes("h264")||t.includes("x264")||t.includes("avc"))&&(r="H.264"),t.includes("5.1")||t.includes("eac3")||t.includes("ac3")||t.includes("ddp")?g="Dolby 5.1":(t.includes("7.1")||t.includes("atmos"))&&(g="Dolby Atmos 7.1"),e&&typeof e=="string"){let y=e.split(/\r?\n/),m=0;for(let k of y){let h=k.trim();if(h.startsWith("#EXT-X-MEDIA:")&&h.includes("TYPE=AUDIO")){let i=h.match(/NAME=["']([^"']+)["']/i),u=h.match(/LANGUAGE=["']([^"']+)["']/i),p=h.match(/GROUP-ID=["']([^"']+)["']/i),d=(i?i[1]:"").toLowerCase(),c=(u?u[1]:"").toLowerCase(),b=(p?p[1]:"").toLowerCase(),S=d.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),_=b.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),w=H.includes(c)||H.some(A=>S.includes(A)||_.includes(A))||ue.some(A=>d.includes(A)||b.includes(A))||d.includes("t\xFCrk")||d.includes("turk")||b.includes("dual"),L=q.includes(c)||q.some(A=>S.includes(A)||_.includes(A))||ge.some(A=>d.includes(A)||b.includes(A))||d.includes("orig")||d.includes("ing")||d.includes("eng");w&&(s=!0),L&&(o=!0)}if(h.startsWith("#EXT-X-MEDIA:")&&h.includes("TYPE=SUBTITLES")){let i=h.match(/URI=["']([^"']+)["']/i),u=h.match(/NAME=["']([^"']+)["']/i),p=h.match(/LANGUAGE=["']([^"']+)["']/i);if(i&&i[1]){let d=i[1];if(n&&!d.startsWith("http"))try{d=new URL(d,n).toString()}catch{}let c=u?u[1]:"Altyaz\u0131",b=p?p[1].toLowerCase():"";b==="st"||b==="sot"||c.toLowerCase().includes("sotho")||c.toLowerCase().includes("sesotho")||d.toLowerCase().includes("sub_st")?(b="tr",c="T\xFCrk\xE7e"):b||(b=c.toLowerCase().includes("t\xFCrk")?"tr":"und");let _=W(b,c);l.push({label:_.name||c,url:d,lang:_.code||b})}}if(h.startsWith("#EXT-X-STREAM-INF:")){let i=h.match(/RESOLUTION=(\d+)x(\d+)/i);if(i){let u=parseInt(i[1],10),p=parseInt(i[2],10),d=Math.min(u,p),c=Math.max(u,p),b=d>=2100||c>=3800?2160:d>=1400||c>=2500?1440:d>=1e3||c>=1900?1080:d>=700||c>=1200?720:d>=450?480:d;b>m&&(m=b)}else{let u=h.match(/NAME=["']?([^"',\s]+)["']?/i);if(u){let p=u[1].toLowerCase();p.includes("2160")||p.includes("4k")?2160>m&&(m=2160):p.includes("1440")||p.includes("2k")?1440>m&&(m=1440):p.includes("1080")?1080>m&&(m=1080):p.includes("720")&&720>m&&(m=720)}}}}m>=2160?a="4K":m>=1440?a="2K":m>=1080?a="1080p":m>=720?a="720p":m>=480&&(a="480p")}let f=s&&o||t.includes("dual")||t.includes("trdual");return{hasTurkishAudio:s,hasOriginalAudio:o,isDual:f,embeddedSubtitles:l,detectedQuality:a,detectedCodec:r,detectedAudio:g}}function de(e){let{hasTurkishAudio:n,hasOriginalAudio:s,isDual:o,hasSubtitles:l,hasTurkishSubtitles:a,isYerli:r,siteHint:g,defaultTitle:t}=e;if(r||g?.isYerli)return"Yerli";if(g?.label){let f=g.label.toLowerCase();if((f.includes("dub")||f.includes("t\xFCrk"))&&(f.includes("alt")||f.includes("sub")))return"Dublaj / Altyaz\u0131l\u0131";if(f.includes("dub")||f.includes("t\xFCrk\xE7e ses"))return"Dublaj";if(f.includes("alt")||f.includes("sub"))return"Altyaz\u0131l\u0131";if(f.includes("orijinal")||f.includes("original"))return"Orijinal"}return o||n&&(s||a)?"Dublaj / Altyaz\u0131l\u0131":n||g?.isDublaj?"Dublaj":a||g?.isAltyazi?"Altyaz\u0131l\u0131":t||(n?"Dublaj":"Orijinal")}var z={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function W(e,n,s){let o=p=>(p||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),l=o(e||""),a=o(n||""),r=!!s||l.includes("forced")||a.includes("forced")||l.includes("zorunlu")||a.includes("zorunlu"),g=l.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),t=a.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),f=p=>{let d=p.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return r?`${d} (Zorunlu)`:d};if(g==="st"||g==="sot"||g.includes("sotho")||t.includes("sotho")||t.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:r?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let y=z[l]||z[a]||z[g]||z[t];if(!y){let p=(t+" "+g).split(/\s+/).filter(Boolean);for(let d of p)if(z[d]){y=z[d];break}}if(!y){for(let[p,d]of Object.entries(z))if(p.length>=4&&(t.includes(p)||g.includes(p))){y=d;break}}if(y)return{code:y.code,iso3:y.iso3,language:y.language,name:f(y.name)};let m=(n||e||"Altyaz\u0131").trim();m=m.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let k=m.charAt(0).toUpperCase()+m.slice(1),h=f(k),i=l&&l.length===2?l:a&&a.length===2?a:"und",u=l&&l.length===3?l:a&&a.length===3?a:"und";return{code:i,iso3:u,language:k,name:h}}function V(e,n){let s=[],o=new Set,l=[...e||[],...n||[]];for(let a of l){if(!a||!a.url)continue;let r=a.url.trim();if(o.has(r))continue;o.add(r);let g=W(a.lang,a.label||a.name||a.language),t=g.name||a.label||a.name||"Altyaz\u0131";s.push({id:String(s.length),url:r,label:t,name:t,language:g.language,lang:g.code,langCode:g.iso3,headers:a.headers})}return s}function J(e){let{m3u8Text:n,m3u8Url:s,externalSubtitles:o,siteHint:l,defaultTitle:a}=e,r=Y(n,s),g=V(o),t=V(o,r.embeddedSubtitles),f=t.length>0||!!l?.isAltyazi,y=t.some(u=>u.lang==="tr"||u.lang==="st"||u.lang==="sot"||u.langCode==="tur"||u.langCode==="sot"||u.label?.toLowerCase().includes("t\xFCrk")||u.label?.toLowerCase().includes("sotho")||u.language==="Turkish"||u.language?.toLowerCase().includes("sotho")),m=r.hasTurkishAudio||!!l?.isDublaj,k=r.hasOriginalAudio,h=r.isDual||m&&(y||k),i=de({hasTurkishAudio:m,hasOriginalAudio:k,isDual:h,hasSubtitles:f,hasTurkishSubtitles:y,isYerli:l?.isYerli,siteHint:l,defaultTitle:a});return{hasTurkishAudio:m,hasOriginalAudio:k,isDual:h,hasSubtitles:f,hasTurkishSubtitles:y,isYerli:l?.isYerli,languageTitle:i,subtitles:g,detectedQuality:r.detectedQuality,detectedCodec:r.detectedCodec,detectedAudio:r.detectedAudio}}function X(e){let n=e.url?Y(void 0,e.url):{},s=e.quality||e.inspection?.detectedQuality||n.detectedQuality||"1080p";s.includes("\u2022")&&(s=s.split("\u2022")[0].trim()),!s.includes("p")&&!s.includes("K")&&!s.includes("k")&&(s=`${s}p`);let o=e.subtitles||e.inspection?.subtitles,l=!!(e.inspection?.hasTurkishSubtitles||o?.some(b=>{let S=(b.lang||b.code||"").toLowerCase(),_=(b.langCode||b.iso3||"").toLowerCase(),w=(b.name||b.label||b.title||"").toLowerCase();return S==="tr"||S==="st"||_==="tur"||_==="sot"||w.includes("t\xFCrk")||w.includes("turk")||w.includes("sotho")})),a=(e.languageTitle||e.inspection?.languageTitle||"").toLowerCase().trim(),r=a.includes("dub")||a.includes("ses")||a.includes("dual")||!!n.hasTurkishAudio||!!e.inspection?.hasTurkishAudio,g=a.includes("dual")||a.includes("dub")&&(a.includes("alt")||a.includes("sub"))||r&&l,t="Orijinal";a.includes("yerli")||e.inspection?.isYerli?t="Yerli":g?t="Dublaj / Altyaz\u0131l\u0131":r?t="Dublaj":l||a.includes("alt")||a.includes("sub")?t="Altyaz\u0131l\u0131":(a.includes("orijinal")||a.includes("yabanc\u0131")||a.includes("original"))&&(t="Orijinal");let f=e.format==="m3u8"||e.url.includes(".m3u8")||e.url.includes("/master.")||e.url.includes("/hls/")||e.url.includes("/txt/"),y=e.format||(f?"m3u8":e.url.includes(".mp4")?"mp4":"m3u8"),m=y==="m3u8"?"HLS":y.toUpperCase(),k=[s],h=e.codec||e.inspection?.detectedCodec||n.detectedCodec;h&&h!=="H.264"&&k.push(h),k.push(m),e.bitrate&&k.push(e.bitrate);let i=e.audio||e.inspection?.detectedAudio||n.detectedAudio;i&&i!=="AAC 2.0"&&k.push(i);let u=e.details||k.join(" \u2022 "),p=`${t}
${u}`,d=`${s} \u2022 ${t}`,c={name:"han's 11",provider:"han's 11",title:t,description:p,url:e.url,quality:d,format:y};return e.headers&&Object.keys(e.headers).length>0&&(c.headers=e.headers),o&&o.length>0&&(c.subtitles=o),c}var B="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";function me(e,n){let s=[];try{let o=e.match(/(?:tracks|baseTracks)\s*[:=]\s*\[([\s\S]*?)\]/);if(!o)return s;let a=o[1].match(/\{[\s\S]*?\}/g)||[],r=new URL(n),g=`${r.protocol}//${r.host}`;for(let t=0;t<a.length;t++){let f=a[t];if(f.toLowerCase().includes("thumbnail"))continue;let y=f.match(/file\s*:\s*["']([^"']+)["']/);if(!y)continue;let m=y[1].replace(/\\\//g,"/");m.startsWith("/")&&(m=g+m);let k=f.match(/label\s*:\s*["']([^"']+)["']/),h=k?k[1]:"T\xFCrk\xE7e";try{h=JSON.parse(`"${h}"`)}catch{}let i=h.toLowerCase().includes("turk")||h.toLowerCase().includes("t\xFCrk")||m.includes("_tr"),u=h.toLowerCase().includes("eng")||h.toLowerCase().includes("ing")||m.includes("_en");s.push({id:String(t),url:m,language:i?"Turkish":u?"English":"Turkish",name:i?"T\xFCrk\xE7e":u?"\u0130ngilizce":h,lang:i?"tur":u?"eng":"tur",label:i?"T\xFCrk\xE7e":u?"\u0130ngilizce":h,headers:{Referer:g+"/",Origin:g,"User-Agent":"okhttp/4.9.2"}})}}catch{}return s}async function he(e,n){try{let s=await fetch(e,{headers:{"User-Agent":B,Referer:n},signal:AbortSignal.timeout?AbortSignal.timeout(6e3):void 0});if(!s.ok)return null;let o=await s.text(),l=o.match(/file\s*:\s*["']([^"']+\.m3u8[^"']*)["']/i)||o.match(/sources\s*:\s*\[\s*\{\s*file\s*:\s*["']([^"']+)["']/i);if(!l)return null;let a=me(o,e);return{hlsUrl:l[1],m3u8Text:o,subtitles:a}}catch{return null}}async function Q(e,n,s,o){let l=Date.now();if(String(n||"").toLowerCase()==="tv"||String(n||"").toLowerCase()==="series"||String(n||"").toLowerCase()==="show")return v("han's 11","han's 11 kayna\u011F\u0131 sadece filmleri destekler (Dizi atland\u0131).","info"),[];v("han's 11",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${e}, T\xFCr: movie`);try{v("han's 11",`[Ad\u0131m 1/3] IMDb ID \xE7\xF6z\xFCmleniyor (${e})...`);let r=await x(e,"movie"),t=(await $(e,"movie"))?.titles?.[0]||"Film";if(!r)return v("han's 11",`IMDb ID bulunamad\u0131: ${e}`,"warn"),[];let f=await G("ryuma");if(!f)return v("han's 11","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let y={"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","User-Agent":B,Referer:f+"/",Origin:f,"X-Requested-With":"XMLHttpRequest"};v("han's 11",`[Ad\u0131m 2/3] Kaynakta kesin IMDb aramas\u0131 yap\u0131l\u0131yor (${r})...`);let m=`${f}/wp-admin/admin-ajax.php`,k=await fetch(m,{method:"POST",headers:y,body:`action=live_search&keyword=${encodeURIComponent(r)}`,signal:AbortSignal.timeout?AbortSignal.timeout(5e3):void 0});if(!k.ok)return v("han's 11",`Arama ba\u015Far\u0131s\u0131z: HTTP ${k.status}`,"warn"),[];let h=await k.text(),i=h.match(/<a\b[^>]*href=["']((?:https?:\/\/[^\/]+)?\/[^"']+-izle\/?)["']/i)||h.match(/href=["']((?:https?:\/\/[^\/]+)?\/[^"']+-izle\/?)["']/i);if(!i)return v("han's 11",`${r} ile e\u015Fle\u015Fen film bulunamad\u0131.`,"warn"),[];let u=i[1],p=u.startsWith("http")?u:`${f}${u.startsWith("/")?"":"/"}${u}`;v("han's 11",`Film bulundu: "${t}"`,"success"),v("han's 11","[Ad\u0131m 3/3] Video oynat\u0131c\u0131 \xE7\xF6z\xFCmleniyor...");let d=await fetch(p,{headers:{"User-Agent":B,Referer:f+"/"},signal:AbortSignal.timeout?AbortSignal.timeout(6e3):void 0});if(!d.ok)return v("han's 11",`Film sayfas\u0131 y\xFCklenemedi: HTTP ${d.status}`,"warn"),[];let c=await d.text(),b=c.match(/vidmoly\.net\/embed-([a-zA-Z0-9]+)\.html/i);if(!b)return v("han's 11","Video oynat\u0131c\u0131s\u0131 bulunamad\u0131.","warn"),[];let S=`https://vidmoly.net/embed-${b[1]}.html`,_=await he(S,f+"/");if(!_||!_.hlsUrl)return v("han's 11","Video ak\u0131\u015F\u0131 \xE7\xF6z\xFCmlenemedi.","warn"),[];let w=J({m3u8Text:_.m3u8Text,m3u8Url:_.hlsUrl,externalSubtitles:_.subtitles,siteHint:{isDublaj:c.toLowerCase().includes("dublaj"),isAltyazi:c.toLowerCase().includes("altyazi")||_.subtitles.length>0}}),L=X({name:"han's 11",url:_.hlsUrl,inspection:w,quality:"1080p",format:"m3u8",headers:{Referer:"https://vidmoly.net/",Origin:"https://vidmoly.net","User-Agent":"okhttp/4.9.2"}}),A=((Date.now()-l)/1e3).toFixed(2);return v("han's 11",`TAMAMLANDI: 1080p HLS ak\u0131\u015F\u0131 haz\u0131rland\u0131 (${A}s) [${L.title}]`,"success",{dil:L.title,altyaz\u0131lar:w.subtitles?.length||0}),[L]}catch(r){return v("han's 11",`Kritik Hata: ${r.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=Q);

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

;(()=>{const n="han's 11",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
