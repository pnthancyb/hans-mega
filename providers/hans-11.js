
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

"use strict";var I=Object.defineProperty;var Q=Object.getOwnPropertyDescriptor;var Z=Object.getOwnPropertyNames;var ee=Object.prototype.hasOwnProperty;var ae=(e,s)=>{for(var t in s)I(e,t,{get:s[t],enumerable:!0})},ne=(e,s,t,l)=>{if(s&&typeof s=="object"||typeof s=="function")for(let r of Z(s))!ee.call(e,r)&&r!==t&&I(e,r,{get:()=>s[r],enumerable:!(l=Q(s,r))||l.enumerable});return e};var ie=e=>ne(I({},"__esModule",{value:!0}),e);var me={};ae(me,{getStreams:()=>X});module.exports=ie(me);function T(e,s,t="info",l){let r=`[${e}]`;t==="error"?console.error(r,s,l||""):t==="warn"?console.warn(r,s,l||""):console.log(r,s,l||"");try{let o=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof o=="string"&&o.startsWith("http")&&fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:t,message:s,details:l})}).catch(()=>{})}catch{}}var te=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(s=>String.fromCharCode(s^42)).join(""),se={REMOTE_CONFIG_URL:te,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},M=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};try{typeof localStorage<"u"&&localStorage&&typeof localStorage.removeItem=="function"&&(localStorage.removeItem("__NUVIO_CONFIG_CACHE__"),localStorage.removeItem("__NUVIO_CONFIG_CACHE_V2__"))}catch{}var E=10*1e3,oe=10*1e3;M.__NUVIO_CONFIG_STATE__||(M.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var _=M.__NUVIO_CONFIG_STATE__;async function j(){let e=Date.now(),s=[];try{let t=M.__NUVIO_DEV_LOG_URL__;typeof t=="string"&&t.includes("/api/log")&&s.push(t.replace("/api/log","/domains"))}catch{}s.push(se.REMOTE_CONFIG_URL);for(let t of s)try{let l=await fetch(t);if(l.ok){let r=await l.json(),a=r?.data??r,o=a.domains||a,g=a.cookies,n=a.tmdb_keys||a.tmdbKeys;o&&typeof o=="object"&&(_.cachedDomains={..._.cachedDomains,...o}),g&&typeof g=="object"&&(_.cachedCookies={..._.cachedCookies,...g}),Array.isArray(n)&&n.length>0&&(_.cachedTmdbKeys=n),_.lastFetchTime=e;return}}catch(l){T("Config",`Domain alinamadi (${t}): ${l.message}`,"warn")}_.lastFetchTime=e-E+oe}async function U(){let e=Date.now();(!(Object.keys(_.cachedDomains).length>0)||e-_.lastFetchTime>E)&&(_.activeFetchPromise||(_.activeFetchPromise=j().finally(()=>{_.activeFetchPromise=null})),await _.activeFetchPromise)}async function F(e){return await U(),_.cachedDomains[e]||await j(),_.cachedDomains[e]||""}async function G(){return await U(),_.cachedTmdbKeys||[]}var le="a2f888b27315e62e471b2d587048f32e",O=[le,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function R(e){let s=await G(),t=s.length>0?[...s,...O]:O;for(let l=0;l<t.length;l++){let r=t[l],a=e.includes("?")?"&":"?",o=`https://api.themoviedb.org/3/${e}${a}api_key=${r}`;try{let g=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,n=await fetch(o,{signal:g});if(n.ok)return await n.json();if(n.status===429)continue}catch{}}return null}var N=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};N.__NUVIO_TMDB_CACHE__||(N.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var L=N.__NUVIO_TMDB_CACHE__,D=L.imdbIdCache,P=L.tmdbTitlesCache,ye=L.tmdbImageCache,Te=L.episodeGroupCache,ve=L.absoluteEpCache;async function x(e,s){let t=String(e||"").replace(/^tmdb:/i,"").trim();if(!t)return null;if(t.startsWith("tt"))return t;let l=`${s}:${t}`;if(D.has(l))return D.get(l);let r=(async()=>{try{let o=await R(`${s==="tv"||s==="series"?"tv":"movie"}/${t}/external_ids`);if(o&&o.imdb_id)return o.imdb_id}catch{}return null})();return D.set(l,r),r}async function K(e,s){let t=String(e||"").replace(/^tmdb:/i,"").trim();if(!t)return{titles:[]};let l=`${s}:${t}`;if(P.has(l))return P.get(l);let r=(async()=>{let a=[],o,g,n=[],f=[],k,m=[];try{let y=s==="tv"||s==="series",h=y?"tv":"movie";if(t.startsWith("tt")){let i=await R(`find/${t}?external_source=imdb_id`);if(i){let u=y?i?.tv_results?.[0]:i?.movie_results?.[0];u&&(o=u.id,u.overview&&(k=u.overview))}}else o=parseInt(t,10);if(o&&!isNaN(o)){let i=await R(`${h}/${o}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(i){if(i.overview&&(k=i.overview),i.title&&(a.push(i.title),i.title.includes(":"))){let c=i.title.split(":")[0].trim();c.length>2&&a.push(c)}if(i.name&&(a.push(i.name),i.name.includes(":"))){let c=i.name.split(":")[0].trim();c.length>2&&a.push(c)}if(i.original_title&&i.original_title!==i.title&&(a.push(i.original_title),i.original_title.includes(":"))){let c=i.original_title.split(":")[0].trim();c.length>2&&a.push(c)}if(i.original_name&&i.original_name!==i.name&&(a.push(i.original_name),i.original_name.includes(":"))){let c=i.original_name.split(":")[0].trim();c.length>2&&a.push(c)}if(i.translations?.translations&&Array.isArray(i.translations.translations))for(let c of i.translations.translations){let b=c.data?.name||c.data?.title;if(b&&typeof b=="string"&&(a.push(b),b.includes(":"))){let w=b.split(":")[0].trim();w.length>2&&a.push(w)}}let u=(i.alternative_titles?.results||i.alternative_titles?.titles||[]).map(c=>c.title).filter(Boolean);a.push(...u);let p=i.release_date||i.first_air_date;p&&(g=parseInt(p.split("-")[0],10)),i.genres&&Array.isArray(i.genres)&&(m=i.genres.map(c=>c.name).filter(Boolean)),i.credits?.cast&&Array.isArray(i.credits.cast)&&(n=i.credits.cast.slice(0,10).map(c=>c.name).filter(Boolean));let d=[];i.created_by&&Array.isArray(i.created_by)&&d.push(...i.created_by.map(c=>c.name).filter(Boolean)),i.credits?.crew&&Array.isArray(i.credits.crew)&&d.push(...i.credits.crew.filter(c=>c.job==="Director"||c.department==="Directing").map(c=>c.name).filter(Boolean)),f=Array.from(new Set(d))}}}catch{}return{numericId:o,titles:Array.from(new Set(a.filter(Boolean))),year:g,cast:n,creators:f,overview:k,genres:m}})();return P.set(l,r),r}var re=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],$=["tr","tur","ota"],ce=["english","ingilizce","original","orijinal","audio-en"],H=["en","eng","und"];function V(e,s){let t=!1,l=!1,r=[],a,o,g,n=(s||"").toLowerCase();if(n.includes("trdual")||n.includes("dual")||n.includes("trdub")||n.includes("dublaj")?(t=!0,l=!0):(n.includes("ses-tr")||n.includes("turkcedublaj")||n.includes("turkce-dublaj"))&&(t=!0),n.includes("2160p")||n.includes("4k")||n.includes("uhd")?a="4K":n.includes("1080p")||n.includes("1920x1080")||n.includes("fhd")?a="1080p":n.includes("720p")||n.includes("1280x720")||n.includes("hd")?a="720p":(n.includes("480p")||n.includes("854x480")||n.includes("sd"))&&(a="480p"),n.includes("hevc")||n.includes("h265")||n.includes("x265")?o="HEVC":n.includes("av1")?o="AV1":(n.includes("h264")||n.includes("x264")||n.includes("avc"))&&(o="H.264"),n.includes("5.1")||n.includes("eac3")||n.includes("ac3")||n.includes("ddp")?g="Dolby 5.1":(n.includes("7.1")||n.includes("atmos"))&&(g="Dolby Atmos 7.1"),e&&typeof e=="string"){let k=e.split(/\r?\n/),m=0;for(let y of k){let h=y.trim();if(h.startsWith("#EXT-X-MEDIA:")&&h.includes("TYPE=AUDIO")){let i=h.match(/NAME=["']([^"']+)["']/i),u=h.match(/LANGUAGE=["']([^"']+)["']/i),p=h.match(/GROUP-ID=["']([^"']+)["']/i),d=(i?i[1]:"").toLowerCase(),c=(u?u[1]:"").toLowerCase(),b=(p?p[1]:"").toLowerCase(),w=d.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),v=b.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),z=$.includes(c)||$.some(A=>w.includes(A)||v.includes(A))||re.some(A=>d.includes(A)||b.includes(A))||d.includes("t\xFCrk")||d.includes("turk")||b.includes("dual"),C=H.includes(c)||H.some(A=>w.includes(A)||v.includes(A))||ce.some(A=>d.includes(A)||b.includes(A))||d.includes("orig")||d.includes("ing")||d.includes("eng");z&&(t=!0),C&&(l=!0)}if(h.startsWith("#EXT-X-MEDIA:")&&h.includes("TYPE=SUBTITLES")){let i=h.match(/URI=["']([^"']+)["']/i),u=h.match(/NAME=["']([^"']+)["']/i),p=h.match(/LANGUAGE=["']([^"']+)["']/i);if(i&&i[1]){let d=i[1];if(s&&!d.startsWith("http"))try{d=new URL(d,s).toString()}catch{}let c=u?u[1]:"Altyaz\u0131",b=p?p[1].toLowerCase():"";b==="st"||b==="sot"||c.toLowerCase().includes("sotho")||c.toLowerCase().includes("sesotho")||d.toLowerCase().includes("sub_st")?(b="tr",c="T\xFCrk\xE7e"):b||(b=c.toLowerCase().includes("t\xFCrk")?"tr":"und");let v=Y(b,c);r.push({label:v.name||c,url:d,lang:v.code||b})}}if(h.startsWith("#EXT-X-STREAM-INF:")){let i=h.match(/RESOLUTION=(\d+)x(\d+)/i);if(i){let u=parseInt(i[1],10),p=parseInt(i[2],10),d=Math.min(u,p),c=Math.max(u,p),b=d>=2100||c>=3800?2160:d>=1400||c>=2500?1440:d>=1e3||c>=1900?1080:d>=700||c>=1200?720:d>=450?480:d;b>m&&(m=b)}else{let u=h.match(/NAME=["']?([^"',\s]+)["']?/i);if(u){let p=u[1].toLowerCase();p.includes("2160")||p.includes("4k")?2160>m&&(m=2160):p.includes("1440")||p.includes("2k")?1440>m&&(m=1440):p.includes("1080")?1080>m&&(m=1080):p.includes("720")&&720>m&&(m=720)}}}}m>=2160?a="4K":m>=1440?a="2K":m>=1080?a="1080p":m>=720?a="720p":m>=480&&(a="480p")}let f=t&&l||n.includes("dual")||n.includes("trdual");return{hasTurkishAudio:t,hasOriginalAudio:l,isDual:f,embeddedSubtitles:r,detectedQuality:a,detectedCodec:o,detectedAudio:g}}function ue(e){let{hasTurkishAudio:s,hasOriginalAudio:t,isDual:l,hasSubtitles:r,hasTurkishSubtitles:a,isYerli:o,siteHint:g,defaultTitle:n}=e;if(o||g?.isYerli)return"Yerli";if(g?.label){let f=g.label.toLowerCase();if((f.includes("dub")||f.includes("t\xFCrk"))&&(f.includes("alt")||f.includes("sub")))return"Dublaj / Altyaz\u0131l\u0131";if(f.includes("dub")||f.includes("t\xFCrk\xE7e ses"))return"Dublaj";if(f.includes("alt")||f.includes("sub"))return"Altyaz\u0131l\u0131";if(f.includes("orijinal")||f.includes("original"))return"Orijinal"}return l||s&&(t||a)?"Dublaj / Altyaz\u0131l\u0131":s||g?.isDublaj?"Dublaj":a||g?.isAltyazi?"Altyaz\u0131l\u0131":n||(s?"Dublaj":"Orijinal")}var S={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function Y(e,s,t){let l=p=>(p||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),r=l(e||""),a=l(s||""),o=!!t||r.includes("forced")||a.includes("forced")||r.includes("zorunlu")||a.includes("zorunlu"),g=r.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),n=a.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),f=p=>{let d=p.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return o?`${d} (Zorunlu)`:d};if(g==="st"||g==="sot"||g.includes("sotho")||n.includes("sotho")||n.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:o?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let k=S[r]||S[a]||S[g]||S[n];if(!k){let p=(n+" "+g).split(/\s+/).filter(Boolean);for(let d of p)if(S[d]){k=S[d];break}}if(!k){for(let[p,d]of Object.entries(S))if(p.length>=4&&(n.includes(p)||g.includes(p))){k=d;break}}if(k)return{code:k.code,iso3:k.iso3,language:k.language,name:f(k.name)};let m=(s||e||"Altyaz\u0131").trim();m=m.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let y=m.charAt(0).toUpperCase()+m.slice(1),h=f(y),i=r&&r.length===2?r:a&&a.length===2?a:"und",u=r&&r.length===3?r:a&&a.length===3?a:"und";return{code:i,iso3:u,language:y,name:h}}function q(e,s){let t=[],l=new Set,r=[...e||[],...s||[]];for(let a of r){if(!a||!a.url)continue;let o=a.url.trim();if(l.has(o))continue;l.add(o);let g=Y(a.lang,a.label||a.name||a.language),n=g.name||a.label||a.name||"Altyaz\u0131";t.push({id:String(t.length),url:o,label:n,name:n,language:g.language,lang:g.code,langCode:g.iso3,headers:a.headers})}return t}function W(e){let{m3u8Text:s,m3u8Url:t,externalSubtitles:l,siteHint:r,defaultTitle:a}=e,o=V(s,t),g=q(l),n=q(l,o.embeddedSubtitles),f=n.length>0||!!r?.isAltyazi,k=n.some(u=>u.lang==="tr"||u.lang==="st"||u.lang==="sot"||u.langCode==="tur"||u.langCode==="sot"||u.label?.toLowerCase().includes("t\xFCrk")||u.label?.toLowerCase().includes("sotho")||u.language==="Turkish"||u.language?.toLowerCase().includes("sotho")),m=o.hasTurkishAudio||!!r?.isDublaj,y=o.hasOriginalAudio,h=o.isDual||m&&(k||y),i=ue({hasTurkishAudio:m,hasOriginalAudio:y,isDual:h,hasSubtitles:f,hasTurkishSubtitles:k,isYerli:r?.isYerli,siteHint:r,defaultTitle:a});return{hasTurkishAudio:m,hasOriginalAudio:y,isDual:h,hasSubtitles:f,hasTurkishSubtitles:k,isYerli:r?.isYerli,languageTitle:i,subtitles:g,detectedQuality:o.detectedQuality,detectedCodec:o.detectedCodec,detectedAudio:o.detectedAudio}}function J(e){let s=e.url?V(void 0,e.url):{},t=e.quality||e.inspection?.detectedQuality||s.detectedQuality||"1080p";t.includes("\u2022")&&(t=t.split("\u2022")[0].trim()),!t.includes("p")&&!t.includes("K")&&!t.includes("k")&&(t=`${t}p`);let l=e.subtitles||e.inspection?.subtitles,r=!!(e.inspection?.hasTurkishSubtitles||l?.some(b=>{let w=(b.lang||b.code||"").toLowerCase(),v=(b.langCode||b.iso3||"").toLowerCase(),z=(b.name||b.label||b.title||"").toLowerCase();return w==="tr"||w==="st"||v==="tur"||v==="sot"||z.includes("t\xFCrk")||z.includes("turk")||z.includes("sotho")})),a=(e.languageTitle||e.inspection?.languageTitle||"").toLowerCase().trim(),o=a.includes("dub")||a.includes("ses")||a.includes("dual")||!!s.hasTurkishAudio||!!e.inspection?.hasTurkishAudio,g=a.includes("dual")||a.includes("dub")&&(a.includes("alt")||a.includes("sub"))||o&&r,n="Orijinal";a.includes("yerli")||e.inspection?.isYerli?n="Yerli":g?n="Dublaj / Altyaz\u0131l\u0131":o?n="Dublaj":r||a.includes("alt")||a.includes("sub")?n="Altyaz\u0131l\u0131":(a.includes("orijinal")||a.includes("yabanc\u0131")||a.includes("original"))&&(n="Orijinal");let f=e.format==="m3u8"||e.url.includes(".m3u8")||e.url.includes("/master.")||e.url.includes("/hls/")||e.url.includes("/txt/"),k=e.format||(f?"m3u8":e.url.includes(".mp4")?"mp4":"m3u8"),m=k==="m3u8"?"HLS":k.toUpperCase(),y=[t],h=e.codec||e.inspection?.detectedCodec||s.detectedCodec;h&&h!=="H.264"&&y.push(h),y.push(m),e.bitrate&&y.push(e.bitrate);let i=e.audio||e.inspection?.detectedAudio||s.detectedAudio;i&&i!=="AAC 2.0"&&y.push(i);let u=e.details||y.join(" \u2022 "),p=`${n}
${u}`,d=`${t} \u2022 ${n}`,c={name:"han's 11",provider:"han's 11",title:n,description:p,url:e.url,quality:d,format:k};return e.headers&&Object.keys(e.headers).length>0&&(c.headers=e.headers),l&&l.length>0&&(c.subtitles=l),c}var B="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";function ge(e,s){let t=[];try{let l=e.match(/(?:tracks|baseTracks)\s*[:=]\s*\[([\s\S]*?)\]/);if(!l)return t;let a=l[1].match(/\{[\s\S]*?\}/g)||[],o=new URL(s),g=`${o.protocol}//${o.host}`;for(let n=0;n<a.length;n++){let f=a[n];if(f.toLowerCase().includes("thumbnail"))continue;let k=f.match(/file\s*:\s*["']([^"']+)["']/);if(!k)continue;let m=k[1].replace(/\\\//g,"/");m.startsWith("/")&&(m=g+m);let y=f.match(/label\s*:\s*["']([^"']+)["']/),h=y?y[1]:"T\xFCrk\xE7e";try{h=JSON.parse(`"${h}"`)}catch{}let i=h.toLowerCase().includes("turk")||h.toLowerCase().includes("t\xFCrk")||m.includes("_tr"),u=h.toLowerCase().includes("eng")||h.toLowerCase().includes("ing")||m.includes("_en");t.push({id:String(n),url:m,language:i?"Turkish":u?"English":"Turkish",name:i?"T\xFCrk\xE7e":u?"\u0130ngilizce":h,lang:i?"tur":u?"eng":"tur",label:i?"T\xFCrk\xE7e":u?"\u0130ngilizce":h,headers:{Referer:g+"/",Origin:g,"User-Agent":"okhttp/4.9.2"}})}}catch{}return t}async function de(e,s){try{let t=await fetch(e,{headers:{"User-Agent":B,Referer:s},signal:AbortSignal.timeout?AbortSignal.timeout(6e3):void 0});if(!t.ok)return null;let l=await t.text(),r=l.match(/file\s*:\s*["']([^"']+\.m3u8[^"']*)["']/i)||l.match(/sources\s*:\s*\[\s*\{\s*file\s*:\s*["']([^"']+)["']/i);if(!r)return null;let a=ge(l,e);return{hlsUrl:r[1],m3u8Text:l,subtitles:a}}catch{return null}}async function X(e,s,t,l){let r=Date.now();if(String(s||"").toLowerCase()==="tv"||String(s||"").toLowerCase()==="series"||String(s||"").toLowerCase()==="show")return T("han's 11","han's 11 kayna\u011F\u0131 sadece filmleri destekler (Dizi atland\u0131).","info"),[];T("han's 11",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${e}, T\xFCr: movie`);try{T("han's 11",`[Ad\u0131m 1/3] IMDb ID \xE7\xF6z\xFCmleniyor (${e})...`);let o=await x(e,"movie"),n=(await K(e,"movie"))?.titles?.[0]||"Film";if(!o)return T("han's 11",`IMDb ID bulunamad\u0131: ${e}`,"warn"),[];let f=await F("ryuma");if(!f)return T("han's 11","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let k={"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","User-Agent":B,Referer:f+"/",Origin:f,"X-Requested-With":"XMLHttpRequest"};T("han's 11",`[Ad\u0131m 2/3] Kaynakta kesin IMDb aramas\u0131 yap\u0131l\u0131yor (${o})...`);let m=`${f}/wp-admin/admin-ajax.php`,y=await fetch(m,{method:"POST",headers:k,body:`action=live_search&keyword=${encodeURIComponent(o)}`,signal:AbortSignal.timeout?AbortSignal.timeout(5e3):void 0});if(!y.ok)return T("han's 11",`Arama ba\u015Far\u0131s\u0131z: HTTP ${y.status}`,"warn"),[];let h=await y.text(),i=h.match(/<a\b[^>]*href=["']((?:https?:\/\/[^\/]+)?\/[^"']+-izle\/?)["']/i)||h.match(/href=["']((?:https?:\/\/[^\/]+)?\/[^"']+-izle\/?)["']/i);if(!i)return T("han's 11",`${o} ile e\u015Fle\u015Fen film bulunamad\u0131.`,"warn"),[];let u=i[1],p=u.startsWith("http")?u:`${f}${u.startsWith("/")?"":"/"}${u}`;T("han's 11",`Film bulundu: "${n}"`,"success"),T("han's 11","[Ad\u0131m 3/3] Video oynat\u0131c\u0131 \xE7\xF6z\xFCmleniyor...");let d=await fetch(p,{headers:{"User-Agent":B,Referer:f+"/"},signal:AbortSignal.timeout?AbortSignal.timeout(6e3):void 0});if(!d.ok)return T("han's 11",`Film sayfas\u0131 y\xFCklenemedi: HTTP ${d.status}`,"warn"),[];let c=await d.text(),b=c.match(/vidmoly\.net\/embed-([a-zA-Z0-9]+)\.html/i);if(!b)return T("han's 11","Video oynat\u0131c\u0131s\u0131 bulunamad\u0131.","warn"),[];let w=`https://vidmoly.net/embed-${b[1]}.html`,v=await de(w,f+"/");if(!v||!v.hlsUrl)return T("han's 11","Video ak\u0131\u015F\u0131 \xE7\xF6z\xFCmlenemedi.","warn"),[];let z=W({m3u8Text:v.m3u8Text,m3u8Url:v.hlsUrl,externalSubtitles:v.subtitles,siteHint:{isDublaj:c.toLowerCase().includes("dublaj"),isAltyazi:c.toLowerCase().includes("altyazi")||v.subtitles.length>0}}),C=J({name:"han's 11",url:v.hlsUrl,inspection:z,quality:"1080p",format:"m3u8",headers:{Referer:"https://vidmoly.net/",Origin:"https://vidmoly.net","User-Agent":"okhttp/4.9.2"}}),A=((Date.now()-r)/1e3).toFixed(2);return T("han's 11",`TAMAMLANDI: 1080p HLS ak\u0131\u015F\u0131 haz\u0131rland\u0131 (${A}s) [${C.title}]`,"success",{dil:C.title,altyaz\u0131lar:z.subtitles?.length||0}),[C]}catch(o){return T("han's 11",`Kritik Hata: ${o.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=X);

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
