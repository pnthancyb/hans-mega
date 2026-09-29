
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

"use strict";var R=Object.defineProperty;var ne=Object.getOwnPropertyDescriptor;var ie=Object.getOwnPropertyNames;var se=Object.prototype.hasOwnProperty;var te=(e,t)=>{for(var s in t)R(e,s,{get:t[s],enumerable:!0})},oe=(e,t,s,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of ie(t))!se.call(e,r)&&r!==s&&R(e,r,{get:()=>t[r],enumerable:!(o=ne(t,r))||o.enumerable});return e};var le=e=>oe(R({},"__esModule",{value:!0}),e);var ye={};te(ye,{getStreams:()=>ee});module.exports=le(ye);function C(e,t,s="info",o){let r=`[${e}]`;s==="error"?console.error(r,t,o||""):s==="warn"?console.warn(r,t,o||""):console.log(r,t,o||"");try{let g=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof g=="string"&&g.startsWith("http")&&fetch(g,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:s,message:t,details:o})}).catch(()=>{})}catch{}}var re=[66,94,94,90,89,16,5,5,78,69,71,75,67,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89].map(t=>String.fromCharCode(t^42)).join(""),ce=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(t=>String.fromCharCode(t^42)).join(""),U={REMOTE_CONFIG_URL:re,FALLBACK_CONFIG_URL:ce,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},E=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},$=2*60*60*1e3,ue=30*1e3;if(!E.__NUVIO_CONFIG_STATE__){let e={},t={},s=[],o=0;try{if(typeof localStorage<"u"&&localStorage){let r=localStorage.getItem("__NUVIO_DOMAINS_CACHE_V3__");if(r){let a=JSON.parse(r);a&&typeof a.domains=="object"&&(e=a.domains,t=a.cookies||{},s=a.tmdbKeys||[],o=typeof a.time=="number"?a.time:0)}}}catch{}E.__NUVIO_CONFIG_STATE__={cachedDomains:e,cachedCookies:t,cachedTmdbKeys:s,lastFetchTime:o,activeFetchPromise:null}}var _=E.__NUVIO_CONFIG_STATE__;async function de(e=!1){let t=Date.now(),s=[];try{let o=E.__NUVIO_DEV_LOG_URL__;typeof o=="string"&&o.includes("/api/log")&&s.push(o.replace("/api/log","/domains"))}catch{}s.push(U.REMOTE_CONFIG_URL),s.push(U.FALLBACK_CONFIG_URL);for(let o of s)try{let r=await fetch(o);if(r.ok){let a=await r.json(),g=a?.data??a,p=g.domains||g,n=g.cookies,S=g.tmdb_keys||g.tmdbKeys;p&&typeof p=="object"&&(_.cachedDomains={..._.cachedDomains,...p}),n&&typeof n=="object"&&(_.cachedCookies={..._.cachedCookies,...n}),Array.isArray(S)&&S.length>0&&(_.cachedTmdbKeys=S),_.lastFetchTime=t,_.lastFetchSource=o,C("Config",`Domainler basariyla cekildi: ${o}`,"info");try{typeof localStorage<"u"&&localStorage&&localStorage.setItem("__NUVIO_DOMAINS_CACHE_V3__",JSON.stringify({domains:_.cachedDomains,cookies:_.cachedCookies,tmdbKeys:_.cachedTmdbKeys,time:t}))}catch{}return}}catch(r){C("Config",`Domain alinamadi (${o}): ${r.message}`,"warn")}_.lastFetchTime=t-$+ue}async function x(e=!1){let t=Date.now(),s=Object.keys(_.cachedDomains).length>0;(e||!s||t-_.lastFetchTime>$)&&(_.activeFetchPromise||(_.activeFetchPromise=de(e).finally(()=>{_.activeFetchPromise=null})),await _.activeFetchPromise)}async function H(e){return await x(),_.cachedDomains[e]||""}async function V(){return await x(),_.cachedTmdbKeys||[]}var ge="a2f888b27315e62e471b2d587048f32e",q=[ge,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function Y(e){let t=await V(),s=t.length>0?[...t,...q]:q;for(let o=0;o<s.length;o++){let r=s[o],a=e.includes("?")?"&":"?",g=`https://api.themoviedb.org/3/${e}${a}api_key=${r}`;try{let p=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,n=await fetch(g,{signal:p});if(n.ok)return await n.json();if(n.status===429)continue}catch{}}return null}var G=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};G.__NUVIO_TMDB_CACHE__||(G.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var B=G.__NUVIO_TMDB_CACHE__,Se=B.imdbIdCache,F=B.tmdbTitlesCache,ze=B.tmdbImageCache,we=B.episodeGroupCache,Le=B.absoluteEpCache;async function W(e,t){let s=String(e||"").replace(/^tmdb:/i,"").trim();if(!s)return{titles:[]};let o=`${t}:${s}`;if(F.has(o))return F.get(o);let r=(async()=>{let a=[],g,p,n=[],S=[],b,m=[];try{let z=t==="tv"||t==="series",k=z?"tv":"movie";if(s.startsWith("tt")){let i=await Y(`find/${s}?external_source=imdb_id`);if(i){let h=z?i?.tv_results?.[0]:i?.movie_results?.[0];h&&(g=h.id,h.overview&&(b=h.overview))}}else g=parseInt(s,10);if(g&&!isNaN(g)){let i=await Y(`${k}/${g}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(i){if(i.overview&&(b=i.overview),i.title&&(a.push(i.title),i.title.includes(":"))){let l=i.title.split(":")[0].trim();l.length>2&&a.push(l)}if(i.name&&(a.push(i.name),i.name.includes(":"))){let l=i.name.split(":")[0].trim();l.length>2&&a.push(l)}if(i.original_title&&i.original_title!==i.title&&(a.push(i.original_title),i.original_title.includes(":"))){let l=i.original_title.split(":")[0].trim();l.length>2&&a.push(l)}if(i.original_name&&i.original_name!==i.name&&(a.push(i.original_name),i.original_name.includes(":"))){let l=i.original_name.split(":")[0].trim();l.length>2&&a.push(l)}if(i.translations?.translations&&Array.isArray(i.translations.translations))for(let l of i.translations.translations){let u=l.data?.name||l.data?.title;if(u&&typeof u=="string"&&(a.push(u),u.includes(":"))){let A=u.split(":")[0].trim();A.length>2&&a.push(A)}}let h=(i.alternative_titles?.results||i.alternative_titles?.titles||[]).map(l=>l.title).filter(Boolean);a.push(...h);let d=i.release_date||i.first_air_date;if(d&&(p=parseInt(d.split("-")[0],10)),i.genres&&Array.isArray(i.genres)&&(m=i.genres.map(l=>l.name).filter(Boolean)),i.credits?.cast&&Array.isArray(i.credits.cast)){let l=new Set;i.credits.cast.slice(0,15).forEach(u=>{u.name&&l.add(u.name),u.original_name&&l.add(u.original_name)}),n=Array.from(l)}let c=[];i.created_by&&Array.isArray(i.created_by)&&c.push(...i.created_by.map(l=>l.name).filter(Boolean)),i.credits?.crew&&Array.isArray(i.credits.crew)&&c.push(...i.credits.crew.filter(l=>l.job==="Director"||l.department==="Directing").map(l=>l.name).filter(Boolean)),S=Array.from(new Set(c))}}}catch{}return{numericId:g,titles:Array.from(new Set(a.filter(Boolean))),year:p,cast:n,creators:S,overview:b,genres:m}})();return F.set(o,r),r}var me=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],J=["tr","tur","ota"],fe=["english","ingilizce","original","orijinal","audio-en"],Q=["en","eng","und"];function he(e,t){let s=!1,o=!1,r=[],a,g,p,n=(t||"").toLowerCase();if(n.includes("trdual")||n.includes("dual")||n.includes("trdub")||n.includes("dublaj")?(s=!0,o=!0):(n.includes("ses-tr")||n.includes("turkcedublaj")||n.includes("turkce-dublaj"))&&(s=!0),n.includes("2160p")||n.includes("4k")||n.includes("uhd")||n.includes("-2160.")?a="4K":n.includes("1080p")||n.includes("1920x1080")||n.includes("fhd")||n.includes("-1080.")?a="1080p":n.includes("720p")||n.includes("1280x720")||n.includes("hd")||n.includes("-720.")?a="720p":n.includes("480p")||n.includes("854x480")||n.includes("sd")||n.includes("-480.")?a="480p":(n.includes("360p")||n.includes("640x360")||n.includes("-360."))&&(a="360p"),n.includes("hevc")||n.includes("h265")||n.includes("x265")?g="HEVC":n.includes("av1")?g="AV1":(n.includes("h264")||n.includes("x264")||n.includes("avc"))&&(g="H.264"),n.includes("5.1")||n.includes("eac3")||n.includes("ac3")||n.includes("ddp")?p="Dolby 5.1":(n.includes("7.1")||n.includes("atmos"))&&(p="Dolby Atmos 7.1"),e&&typeof e=="string"){let b=e.split(/\r?\n/),m=0;for(let z of b){let k=z.trim();if(k.startsWith("#EXT-X-MEDIA:")&&k.includes("TYPE=AUDIO")){let i=k.match(/NAME=["']([^"']+)["']/i),h=k.match(/LANGUAGE=["']([^"']+)["']/i),d=k.match(/GROUP-ID=["']([^"']+)["']/i),c=(i?i[1]:"").toLowerCase(),l=(h?h[1]:"").toLowerCase(),u=(d?d[1]:"").toLowerCase(),A=c.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),T=u.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),L=J.includes(l)||J.some(w=>A.includes(w)||T.includes(w))||me.some(w=>c.includes(w)||u.includes(w))||c.includes("t\xFCrk")||c.includes("turk")||u.includes("dual"),M=Q.includes(l)||Q.some(w=>A.includes(w)||T.includes(w))||fe.some(w=>c.includes(w)||u.includes(w))||c.includes("orig")||c.includes("ing")||c.includes("eng");L&&(s=!0),M&&(o=!0)}if(k.startsWith("#EXT-X-MEDIA:")&&k.includes("TYPE=SUBTITLES")){let i=k.match(/URI=["']([^"']+)["']/i),h=k.match(/NAME=["']([^"']+)["']/i),d=k.match(/LANGUAGE=["']([^"']+)["']/i);if(i&&i[1]){let c=i[1];if(t&&!c.startsWith("http"))try{c=new URL(c,t).toString()}catch{}let l=h?h[1]:"Altyaz\u0131",u=d?d[1].toLowerCase():"";u==="st"||u==="sot"||l.toLowerCase().includes("sotho")||l.toLowerCase().includes("sesotho")||c.toLowerCase().includes("sub_st")?(u="tr",l="T\xFCrk\xE7e"):u||(u=l.toLowerCase().includes("t\xFCrk")?"tr":"und");let T=pe(u,l);r.push({label:T.name||l,url:c,lang:T.code||u})}}if(k.startsWith("#EXT-X-STREAM-INF:")){let i=k.match(/RESOLUTION=(\d+)x(\d+)/i);if(i){let h=parseInt(i[1],10),d=parseInt(i[2],10),c=Math.min(h,d),l=Math.max(h,d),u=c>=2100||l>=3800?2160:c>=1400||l>=2500?1440:c>=1e3||l>=1900?1080:c>=700||l>=1200?720:c>=450?480:c;u>m&&(m=u)}else{let h=k.match(/NAME=["']?([^"',\s]+)["']?/i);if(h){let d=h[1].toLowerCase();d.includes("2160")||d.includes("4k")?2160>m&&(m=2160):d.includes("1440")||d.includes("2k")?1440>m&&(m=1440):d.includes("1080")?1080>m&&(m=1080):d.includes("720")&&720>m&&(m=720)}}}}m>=2160?a="4K":m>=1440?a="2K":m>=1080?a="1080p":m>=720?a="720p":m>=480&&(a="480p")}let S=s&&o||n.includes("dual")||n.includes("trdual");return{hasTurkishAudio:s,hasOriginalAudio:o,isDual:S,embeddedSubtitles:r,detectedQuality:a,detectedCodec:g,detectedAudio:p}}var I={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function pe(e,t,s){let o=d=>(d||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),r=o(e||""),a=o(t||""),g=!!s||r.includes("forced")||a.includes("forced")||r.includes("zorunlu")||a.includes("zorunlu"),p=r.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),n=a.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),S=d=>{let c=d.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return g?`${c} (Zorunlu)`:c};if(p==="st"||p==="sot"||p.includes("sotho")||n.includes("sotho")||n.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:g?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let b=I[r]||I[a]||I[p]||I[n];if(!b){let d=(n+" "+p).split(/\s+/).filter(Boolean);for(let c of d)if(I[c]){b=I[c];break}}if(!b){for(let[d,c]of Object.entries(I))if(d.length>=4&&(n.includes(d)||p.includes(d))){b=c;break}}if(b)return{code:b.code,iso3:b.iso3,language:b.language,name:S(b.name)};let m=(t||e||"Altyaz\u0131").trim();m=m.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let z=m.charAt(0).toUpperCase()+m.slice(1),k=S(z),i=r&&r.length===2?r:a&&a.length===2?a:"und",h=r&&r.length===3?r:a&&a.length===3?a:"und";return{code:i,iso3:h,language:z,name:k}}function X(e){let t=e.url?he(void 0,e.url):{},s=e.quality||e.inspection?.detectedQuality||t.detectedQuality||"1080p";s.includes("\u2022")&&(s=s.split("\u2022")[0].trim()),!s.includes("p")&&!s.includes("K")&&!s.includes("k")&&s!=="HD"&&s!=="FHD"&&s!=="SD"&&(s=`${s}p`);let o=e.subtitles||e.inspection?.subtitles,r=!!(e.inspection?.hasTurkishSubtitles||o?.some(u=>{let A=(u.lang||u.code||"").toLowerCase(),T=(u.langCode||u.iso3||"").toLowerCase(),L=(u.name||u.label||u.title||"").toLowerCase();return A==="tr"||A==="st"||T==="tur"||T==="sot"||L.includes("t\xFCrk")||L.includes("turk")||L.includes("sotho")})),a=(e.languageTitle||e.inspection?.languageTitle||"").toLowerCase().trim(),g=a.includes("dub")||a.includes("ses")||a.includes("dual")||!!t.hasTurkishAudio||!!e.inspection?.hasTurkishAudio,p=a.includes("dual")||a.includes("dub")&&(a.includes("alt")||a.includes("sub"))||g&&r,n="Orijinal";a.includes("yerli")||e.inspection?.isYerli?n="Yerli":p?n="Dublaj / Altyaz\u0131l\u0131":g?n="Dublaj":r||a.includes("alt")||a.includes("sub")?n="Altyaz\u0131l\u0131":(a.includes("orijinal")||a.includes("yabanc\u0131")||a.includes("original"))&&(n="Orijinal");let S=e.format==="m3u8"||e.url.includes(".m3u8")||e.url.includes("/master.")||e.url.includes("/hls/")||e.url.includes("/txt/"),b=e.format||(S?"m3u8":e.url.includes(".mp4")?"mp4":"m3u8"),m=b==="m3u8"?"HLS":b.toUpperCase(),z=[s],k=e.codec||e.inspection?.detectedCodec||t.detectedCodec;k&&k!=="H.264"&&z.push(k),z.push(m),e.bitrate&&z.push(e.bitrate);let i=e.audio||e.inspection?.detectedAudio||t.detectedAudio;i&&i!=="AAC 2.0"&&z.push(i);let h=e.details||z.join(" \u2022 "),d=`${n}
${h}`,c=`${s} \u2022 ${n}`,l={name:"han's 23",provider:"han's 23",title:n,description:d,url:e.url,quality:c,format:b};return e.headers&&Object.keys(e.headers).length>0&&(l.headers=e.headers),o&&o.length>0&&(l.subtitles=o),l}var j="9iQNC5HQwPlaFuJDkhncJ5XTJ8feGXOJatAA",be="308202c3308201aba0030201020204075cec01300d06092a864886f70d01010b050030123110300e0603550403130753696e65776978301e170d3231303932313233333334395a170d3436303931353233333334395a30123110300e0603550403130753696e6577697830820122300d06092a864886f70d01010105000382010f003082010a0282010100b0a2a1bc5c3f16f19c3b2456cfd0a6128ced9f5e2e2c4cca1a100e17b07b86256258f372e76a95a17e9e4a1c048e364835723a95e8ef6d5bdfb5694b50277c65a64f7b012fdf164e5dc93629561f6ca29b7dc82ebb3d6f3c8e8fc6795847fe331ad4a13ed6c059a83804c43d3747526d769580f3a4153752eb22dac66dd15f1582caa43305dc49f55ac7b1b89013e654d2ca8c94c30956659674cc673256c04208f09118bae14cdd72d78f9ee2aece958084a8c2e315deff45726d4fc1f18ec39569ff1abe4f36a8d01090e5f68c07c28763513b88208bcac1a6e1941f6fd8bfdd52f832098ddb2154c8f565bc5d58c7106a19e03787e75c7f34997000e3bcf30203010001a321301f301d0603551d0e04160414b545fc18e74a791d9402b53940ae38b96e9e209c300d06092a864886f70d01010b05000382010100a8a64d9e7c8b5db102af15d3caf94ff8d3e9be9008bb0021117ca2f0762e68583354b126a041bb1fb6e6308e421e4b5a71f779cde63e5d2fc5976bff966c3c4034e852c077d8e74458fbae2ec1db74b1f4082e188bf8ef7c42a44e3fbfb693bb00ee2a727096b42360ddce1bdcd3536f50c8693bcc62a7b7204bcefe2ecf1f7c820bcd63e1d7a6acc8bf6163086915fc5f607cf51bc7a8635f98bb4c65a8f24b7b5a82c7b06868f565cb0d6ac4775c4aac777536ddd1a565f990fd8cbe539185fa7aab610b7855a687a00f4e55536d72873444552c50fd10727dbf298a9be6ed6ae62148dd1de365f3729915dd31975e28a472d752ac14db3db548405cc31e1e",Z={signature:be,hash256:"f4d4bc98a3fc4600e7f2c2bab7533f1f03d8a70ff03c256bb11dc57050536bd0","User-Agent":"EasyPlex (Android 13; SM-A546E; samsung; tr)","user-agent":"EasyPlex (Android 13; SM-A546E; samsung; tr)",Accept:"application/json"};async function ke(e){if(!e.includes("mediafire.com"))return e;try{let t=await fetch(e,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}});if(t.ok){let s=await t.text(),o=s.match(/href="([^"]+)"[^>]*id="downloadButton"/)||s.match(/id="downloadButton"[^>]*href="([^"]+)"/);if(o&&o[1])return o[1]}}catch{}return e}async function ee(e,t,s,o){let r=Date.now();C("han's 23",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${e}, T\xFCr: ${t}, Sezon: ${s}, B\xF6l\xFCm: ${o}`);try{let a=String(e||"").trim(),g=String(t||"").toLowerCase().trim(),p=g==="tv"||g==="series",n=p?"tv":"movie",S=s!=null?parseInt(String(s),10):1,b=o!=null?parseInt(String(o),10):1;if(!a)return[];let m=await H("vegapunk");if(!m)return C("han's 23","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];C("han's 23",`[Ad\u0131m 1/4] TMDB bilgileri al\u0131n\u0131yor (${a})...`);let z=await W(a,n),k=(z?.titles||[]).filter(Boolean);if(k.length===0)return C("han's 23","TMDB ba\u015Fl\u0131k bilgisi al\u0131namad\u0131.","error"),[];C("han's 23",`[Ad\u0131m 2/4] Katalog taran\u0131yor (${JSON.stringify(k)})...`);let i=[];for(let f of k)try{let y=`${m}/public/api/search/${encodeURIComponent(f)}/${j}`,v=await fetch(y,{headers:Z});if(v.ok){let D=await v.json();if(Array.isArray(D.search)&&D.search.length>0){i=D.search;break}}}catch(y){C("han's 23",`Arama Hatas\u0131 (${f}): ${y.message}`,"warn")}if(i.length===0)return C("han's 23","E\u015Fle\u015Fen i\xE7erik bulunamad\u0131.","warn"),[];let h=p?i.filter(f=>f.type==="serie"||f.type==="anime"):i.filter(f=>f.type==="movie");h.length===0&&(h=i);let d=String(z?.numericId||a);C("han's 23",`[Ad\u0131m 3/4] Kesin TMDB ID (${d}) do\u011Frulamas\u0131 yap\u0131l\u0131yor (${h.length} aday)...`);let c=h.map(async f=>{let y="";f.type==="movie"?y=`${m}/public/api/media/detail/${f.id}/${j}`:f.type==="serie"?y=`${m}/public/api/series/show/${f.id}/${j}`:y=`${m}/public/api/animes/show/${f.id}/${j}`;try{let v=await fetch(y,{headers:Z});if(v.ok){let D=await v.json();return{candidate:f,data:D}}}catch{}return null}),u=(await Promise.all(c)).find(f=>{if(!f||!f.data)return!1;let y=String(f.data.tmdb_id||"");return y===d||y===String(a)});if(!u)return C("han's 23",`TMDB ID (${d}) ile tam e\u015Fle\u015Fen i\xE7erik do\u011Frulanamad\u0131.`,"warn"),[];let A=u.data;C("han's 23",` \u0130\xE7erik do\u011Fruland\u0131: ${A.title||A.name||A.originalName}`,"success");let T=null,L="Dual";if(p){if(Array.isArray(A.seasons)){let f=A.seasons.find(y=>y.season_number===S||y.seasonNumber===S);if(f&&Array.isArray(f.episodes)){let y=f.episodes.find(v=>v.episode_number===b||v.episodeNumber===b);y&&Array.isArray(y.videos)&&y.videos.length>0&&(T=y.videos[0].link,L=y.videos[0].lang||"Dual")}if(!T){for(let y of A.seasons)if(Array.isArray(y.episodes)){for(let v of y.episodes){if((v.episode_number===b||v.episodeNumber===b)&&Array.isArray(v.videos)&&v.videos.length>0){T=v.videos[0].link,L=v.videos[0].lang||"Dual";break}if(v.name){let D=v.name.match(/(\d+)\.\s*Bölüm/i);if(D&&parseInt(D[1],10)===b&&Array.isArray(v.videos)&&v.videos.length>0){T=v.videos[0].link,L=v.videos[0].lang||"Dual";break}}}if(T)break}}}}else if(Array.isArray(A.videos)&&A.videos.length>0){let f=A.videos[0];T=f.link,L=f.lang||"Dual"}if(!T)return C("han's 23","Bu b\xF6l\xFCm/film i\xE7in yay\u0131n kayna\u011F\u0131 bulunamad\u0131.","warn"),[];T.includes("mediafire.com")&&(T=await ke(T));let M=T.toLowerCase(),w="mp4";M.includes(".m3u8")||M.includes("/hls/")?w="m3u8":M.includes(".mkv")?w="mkv":M.includes(".mp4")&&(w="mp4");let P=(L||"").toLowerCase(),K=T.toLowerCase(),N="Altyaz\u0131";P.includes("dual")||P.includes("dublaj")||K.includes("dual")||K.includes("dublaj")?N="Dublaj / Altyaz\u0131":P.includes("t\xFCrk\xE7e")||P.includes("yerli")?N="T\xFCrk\xE7e":P.includes("altyaz")&&(N="Altyaz\u0131");let O=X({name:"han's 23",url:T,languageTitle:N,quality:"1080p",format:w,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}}),ae=((Date.now()-r)/1e3).toFixed(2);return C("han's 23",`[Ad\u0131m 4/4] TAMAMLANDI: 1080p ak\u0131\u015F haz\u0131rland\u0131 (${ae}s)`,"success",[O].map(f=>({server:f.name,kalite:f.quality,title:f.title}))),[O]}catch(a){return C("han's 23",`Kritik Hata: ${a.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=ee);

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

;(()=>{const n="han's 23",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
