
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

"use strict";var $=Object.defineProperty;var fe=Object.getOwnPropertyDescriptor;var pe=Object.getOwnPropertyNames;var be=Object.prototype.hasOwnProperty;var ke=(n,t)=>{for(var i in t)$(n,i,{get:t[i],enumerable:!0})},ye=(n,t,i,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of pe(t))!be.call(n,o)&&o!==i&&$(n,o,{get:()=>t[o],enumerable:!(s=fe(t,o))||s.enumerable});return n};var Ae=n=>ye($({},"__esModule",{value:!0}),n);var Pe={};ke(Pe,{default:()=>De,getStreams:()=>Y});module.exports=Ae(Pe);function y(n,t,i="info",s){let o=`[${n}]`;i==="error"?console.error(o,t,s||""):i==="warn"?console.warn(o,t,s||""):console.log(o,t,s||"");try{let l=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof l=="string"&&l.startsWith("http")&&fetch(l,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:n,level:i,message:t,details:s})}).catch(()=>{})}catch{}}var Te=[66,94,94,90,89,16,5,5,78,69,71,75,67,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89].map(t=>String.fromCharCode(t^42)).join(""),ve=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(t=>String.fromCharCode(t^42)).join(""),Z={REMOTE_CONFIG_URL:Te,FALLBACK_CONFIG_URL:ve,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},F=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},ee=2*60*1e3,_e=15*1e3;if(!F.__NUVIO_CONFIG_STATE__){let n={},t={},i=[],s=0;try{if(typeof localStorage<"u"&&localStorage){let o=localStorage.getItem("__NUVIO_DOMAINS_CACHE_V3__");if(o){let a=JSON.parse(o);a&&typeof a.domains=="object"&&(n=a.domains,t=a.cookies||{},i=a.tmdbKeys||[],s=typeof a.time=="number"?a.time:0)}}}catch{}F.__NUVIO_CONFIG_STATE__={cachedDomains:n,cachedCookies:t,cachedTmdbKeys:i,lastFetchTime:s,activeFetchPromise:null}}var v=F.__NUVIO_CONFIG_STATE__;async function Se(n=!1){let t=Date.now(),i=[];try{let s=F.__NUVIO_DEV_LOG_URL__;typeof s=="string"&&s.includes("/api/log")&&i.push(s.replace("/api/log","/domains"))}catch{}i.push(Z.REMOTE_CONFIG_URL),i.push(Z.FALLBACK_CONFIG_URL);for(let s of i)try{let o=await fetch(s);if(o.ok){let a=await o.json(),l=a?.data??a,r=l.domains||l,e=l.cookies,d=l.tmdb_keys||l.tmdbKeys;r&&typeof r=="object"&&(v.cachedDomains={...v.cachedDomains,...r}),e&&typeof e=="object"&&(v.cachedCookies={...v.cachedCookies,...e}),Array.isArray(d)&&d.length>0&&(v.cachedTmdbKeys=d),v.lastFetchTime=t,v.lastFetchSource=s,y("Config",`Domainler basariyla cekildi: ${s}`,"info");try{typeof localStorage<"u"&&localStorage&&localStorage.setItem("__NUVIO_DOMAINS_CACHE_V3__",JSON.stringify({domains:v.cachedDomains,cookies:v.cachedCookies,tmdbKeys:v.cachedTmdbKeys,time:t}))}catch{}return}}catch(o){y("Config",`Domain alinamadi (${s}): ${o.message}`,"warn")}v.lastFetchTime=t-ee+_e}async function ae(n=!1){let t=Date.now(),i=Object.keys(v.cachedDomains).length>0;(n||!i||t-v.lastFetchTime>ee)&&(v.activeFetchPromise||(v.activeFetchPromise=Se(n).finally(()=>{v.activeFetchPromise=null})),await v.activeFetchPromise)}async function ne(n){return await ae(),v.cachedDomains[n]||""}async function ie(){return await ae(),v.cachedTmdbKeys||[]}var we="a2f888b27315e62e471b2d587048f32e",te=[we,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function Ce(n){let t=await ie(),i=t.length>0?[...t,...te]:te;for(let s=0;s<i.length;s++){let o=i[s],a=n.includes("?")?"&":"?",l=`https://api.themoviedb.org/3/${n}${a}api_key=${o}`;try{let r=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,e=await fetch(l,{signal:r});if(e.ok)return await e.json();if(e.status===429)continue}catch{}}return null}var q=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};q.__NUVIO_TMDB_CACHE__||(q.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var B=q.__NUVIO_TMDB_CACHE__,H=B.imdbIdCache,Oe=B.tmdbTitlesCache,Fe=B.tmdbImageCache,xe=B.episodeGroupCache,Ge=B.absoluteEpCache;async function se(n,t){let i=String(n||"").replace(/^tmdb:/i,"").trim();if(!i)return null;if(i.startsWith("tt"))return i;let s=`${t}:${i}`;if(H.has(s))return H.get(s);let o=(async()=>{try{let l=await Ce(`${t==="tv"||t==="series"?"tv":"movie"}/${i}/external_ids`);if(l&&l.imdb_id)return l.imdb_id}catch{}return null})();return H.set(s,o),o}var ze=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],oe=["tr","tur","ota"],Le=["english","ingilizce","original","orijinal","audio-en"],le=["en","eng","und"];function ce(n,t){let i=!1,s=!1,o=[],a,l,r,e=(t||"").toLowerCase();if(e.includes("trdual")||e.includes("dual")||e.includes("trdub")||e.includes("dublaj")?(i=!0,s=!0):(e.includes("ses-tr")||e.includes("turkcedublaj")||e.includes("turkce-dublaj"))&&(i=!0),e.includes("2160p")||e.includes("4k")||e.includes("uhd")||e.includes("-2160.")?a="4K":e.includes("1080p")||e.includes("1920x1080")||e.includes("fhd")||e.includes("-1080.")?a="1080p":e.includes("720p")||e.includes("1280x720")||e.includes("hd")||e.includes("-720.")?a="720p":e.includes("480p")||e.includes("854x480")||e.includes("sd")||e.includes("-480.")?a="480p":(e.includes("360p")||e.includes("640x360")||e.includes("-360."))&&(a="360p"),e.includes("hevc")||e.includes("h265")||e.includes("x265")?l="HEVC":e.includes("av1")?l="AV1":(e.includes("h264")||e.includes("x264")||e.includes("avc"))&&(l="H.264"),e.includes("5.1")||e.includes("eac3")||e.includes("ac3")||e.includes("ddp")?r="Dolby 5.1":(e.includes("7.1")||e.includes("atmos"))&&(r="Dolby Atmos 7.1"),n&&typeof n=="string"){let b=n.split(/\r?\n/),c=0;for(let m of b){let k=m.trim();if(k.startsWith("#EXT-X-MEDIA:")&&k.includes("TYPE=AUDIO")){let A=k.match(/NAME=["']([^"']+)["']/i),h=k.match(/LANGUAGE=["']([^"']+)["']/i),u=k.match(/GROUP-ID=["']([^"']+)["']/i),g=(A?A[1]:"").toLowerCase(),T=(h?h[1]:"").toLowerCase(),p=(u?u[1]:"").toLowerCase(),M=g.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),w=p.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),L=oe.includes(T)||oe.some(S=>M.includes(S)||w.includes(S))||ze.some(S=>g.includes(S)||p.includes(S))||g.includes("t\xFCrk")||g.includes("turk")||p.includes("dual"),P=le.includes(T)||le.some(S=>M.includes(S)||w.includes(S))||Le.some(S=>g.includes(S)||p.includes(S))||g.includes("orig")||g.includes("ing")||g.includes("eng");L&&(i=!0),P&&(s=!0)}if(k.startsWith("#EXT-X-MEDIA:")&&k.includes("TYPE=SUBTITLES")){let A=k.match(/URI=["']([^"']+)["']/i),h=k.match(/NAME=["']([^"']+)["']/i),u=k.match(/LANGUAGE=["']([^"']+)["']/i);if(A&&A[1]){let g=A[1];if(t&&!g.startsWith("http"))try{g=new URL(g,t).toString()}catch{}let T=h?h[1]:"Altyaz\u0131",p=u?u[1].toLowerCase():"";p==="st"||p==="sot"||T.toLowerCase().includes("sotho")||T.toLowerCase().includes("sesotho")||g.toLowerCase().includes("sub_st")?(p="tr",T="T\xFCrk\xE7e"):p||(p=T.toLowerCase().includes("t\xFCrk")?"tr":"und");let w=j(p,T);o.push({label:w.name||T,url:g,lang:w.code||p})}}if(k.startsWith("#EXT-X-STREAM-INF:")){let A=k.match(/RESOLUTION=(\d+)x(\d+)/i);if(A){let h=parseInt(A[1],10),u=parseInt(A[2],10),g=Math.min(h,u),T=Math.max(h,u),p=g>=2100||T>=3800?2160:g>=1400||T>=2500?1440:g>=1e3||T>=1900?1080:g>=700||T>=1200?720:g>=450?480:g;p>c&&(c=p)}else{let h=k.match(/NAME=["']?([^"',\s]+)["']?/i);if(h){let u=h[1].toLowerCase();u.includes("2160")||u.includes("4k")?2160>c&&(c=2160):u.includes("1440")||u.includes("2k")?1440>c&&(c=1440):u.includes("1080")?1080>c&&(c=1080):u.includes("720")&&720>c&&(c=720)}}}}c>=2160?a="4K":c>=1440?a="2K":c>=1080?a="1080p":c>=720?a="720p":c>=480&&(a="480p")}let d=i&&s||e.includes("dual")||e.includes("trdual");return{hasTurkishAudio:i,hasOriginalAudio:s,isDual:d,embeddedSubtitles:o,detectedQuality:a,detectedCodec:l,detectedAudio:r}}function Me(n){let{hasTurkishAudio:t,hasOriginalAudio:i,isDual:s,hasSubtitles:o,hasTurkishSubtitles:a,isYerli:l,siteHint:r,defaultTitle:e}=n;if(l||r?.isYerli)return"Yerli";if(r?.label){let d=r.label.toLowerCase();if((d.includes("dub")||d.includes("t\xFCrk"))&&(d.includes("alt")||d.includes("sub")))return"Dublaj / Altyaz\u0131l\u0131";if(d.includes("dub")||d.includes("t\xFCrk\xE7e ses"))return"Dublaj";if(d.includes("alt")||d.includes("sub"))return"Altyaz\u0131l\u0131";if(d.includes("orijinal")||d.includes("original"))return"Orijinal"}return s||t&&(i||a)?"Dublaj / Altyaz\u0131l\u0131":t||r?.isDublaj?"Dublaj":a||r?.isAltyazi?"Altyaz\u0131l\u0131":e||(t?"Dublaj":"Orijinal")}var D={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function j(n,t,i){let s=u=>(u||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),o=s(n||""),a=s(t||""),l=!!i||o.includes("forced")||a.includes("forced")||o.includes("zorunlu")||a.includes("zorunlu"),r=o.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),e=a.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),d=u=>{let g=u.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return l?`${g} (Zorunlu)`:g};if(r==="st"||r==="sot"||r.includes("sotho")||e.includes("sotho")||e.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:l?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let b=D[o]||D[a]||D[r]||D[e];if(!b){let u=(e+" "+r).split(/\s+/).filter(Boolean);for(let g of u)if(D[g]){b=D[g];break}}if(!b){for(let[u,g]of Object.entries(D))if(u.length>=4&&(e.includes(u)||r.includes(u))){b=g;break}}if(b)return{code:b.code,iso3:b.iso3,language:b.language,name:d(b.name)};let c=(t||n||"Altyaz\u0131").trim();c=c.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let m=c.charAt(0).toUpperCase()+c.slice(1),k=d(m),A=o&&o.length===2?o:a&&a.length===2?a:"und",h=o&&o.length===3?o:a&&a.length===3?a:"und";return{code:A,iso3:h,language:m,name:k}}function re(n,t){let i=[],s=new Set,o=[...n||[],...t||[]];for(let a of o){if(!a||!a.url)continue;let l=a.url.trim();if(s.has(l))continue;s.add(l);let r=j(a.lang,a.label||a.name||a.language),e=r.name||a.label||a.name||"Altyaz\u0131";i.push({id:String(i.length),url:l,label:e,name:e,language:r.language,lang:r.code,langCode:r.iso3,headers:a.headers})}return i}function ue(n){let{m3u8Text:t,m3u8Url:i,externalSubtitles:s,siteHint:o,defaultTitle:a}=n,l=ce(t,i),r=re(s),e=re(s,l.embeddedSubtitles),d=e.length>0||!!o?.isAltyazi,b=e.some(h=>h.lang==="tr"||h.lang==="st"||h.lang==="sot"||h.langCode==="tur"||h.langCode==="sot"||h.label?.toLowerCase().includes("t\xFCrk")||h.label?.toLowerCase().includes("sotho")||h.language==="Turkish"||h.language?.toLowerCase().includes("sotho")),c=l.hasTurkishAudio||!!o?.isDublaj,m=l.hasOriginalAudio,k=l.isDual||c&&(b||m),A=Me({hasTurkishAudio:c,hasOriginalAudio:m,isDual:k,hasSubtitles:d,hasTurkishSubtitles:b,isYerli:o?.isYerli,siteHint:o,defaultTitle:a});return{hasTurkishAudio:c,hasOriginalAudio:m,isDual:k,hasSubtitles:d,hasTurkishSubtitles:b,isYerli:o?.isYerli,languageTitle:A,subtitles:r,detectedQuality:l.detectedQuality,detectedCodec:l.detectedCodec,detectedAudio:l.detectedAudio}}function ge(n){let t=n.url?ce(void 0,n.url):{},i=n.quality||n.inspection?.detectedQuality||t.detectedQuality||"1080p";i.includes("\u2022")&&(i=i.split("\u2022")[0].trim()),!i.includes("p")&&!i.includes("K")&&!i.includes("k")&&i!=="HD"&&i!=="FHD"&&i!=="SD"&&(i=`${i}p`);let s=n.subtitles||n.inspection?.subtitles,o=!!(n.inspection?.hasTurkishSubtitles||s?.some(p=>{let M=(p.lang||p.code||"").toLowerCase(),w=(p.langCode||p.iso3||"").toLowerCase(),L=(p.name||p.label||p.title||"").toLowerCase();return M==="tr"||M==="st"||w==="tur"||w==="sot"||L.includes("t\xFCrk")||L.includes("turk")||L.includes("sotho")})),a=(n.languageTitle||n.inspection?.languageTitle||"").toLowerCase().trim(),l=a.includes("dub")||a.includes("ses")||a.includes("dual")||!!t.hasTurkishAudio||!!n.inspection?.hasTurkishAudio,r=a.includes("dual")||a.includes("dub")&&(a.includes("alt")||a.includes("sub"))||l&&o,e="Orijinal";a.includes("yerli")||n.inspection?.isYerli?e="Yerli":r?e="Dublaj / Altyaz\u0131l\u0131":l?e="Dublaj":o||a.includes("alt")||a.includes("sub")?e="Altyaz\u0131l\u0131":(a.includes("orijinal")||a.includes("yabanc\u0131")||a.includes("original"))&&(e="Orijinal");let d=n.format==="m3u8"||n.url.includes(".m3u8")||n.url.includes("/master.")||n.url.includes("/hls/")||n.url.includes("/txt/"),b=n.format||(d?"m3u8":n.url.includes(".mp4")?"mp4":"m3u8"),c=b==="m3u8"?"HLS":b.toUpperCase(),m=[i],k=n.codec||n.inspection?.detectedCodec||t.detectedCodec;k&&k!=="H.264"&&m.push(k),m.push(c),n.bitrate&&m.push(n.bitrate);let A=n.audio||n.inspection?.detectedAudio||t.detectedAudio;A&&A!=="AAC 2.0"&&m.push(A);let h=n.details||m.join(" \u2022 "),u=`${e}
${h}`,g=`${i} \u2022 ${e}`,T={name:"han's 33",provider:"han's 33",title:e,description:u,url:n.url,quality:g,format:b};return n.headers&&Object.keys(n.headers).length>0&&(T.headers=n.headers),s&&s.length>0&&(T.subtitles=s),T}var U="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",V="okhttp/4.9.2";function Ie(n,t){let i=[];try{let s=n.match(/(?:tracks|baseTracks)\s*[:=]\s*\[([\s\S]*?)\]/);if(!s)return i;let o=s[1].match(/\{[\s\S]*?\}/g)||[],a=new URL(t).origin;for(let l=0;l<o.length;l++){let r=o[l];if(r.toLowerCase().includes("thumbnail"))continue;let e=r.match(/file\s*:\s*["']([^"']+)["']/);if(!e)continue;let d=e[1].replace(/\\\//g,"/");d.startsWith("/")&&(d=a+d);let b=r.match(/label\s*:\s*["']([^"']+)["']/),c=b?b[1]:"";try{c=JSON.parse(`"${c}"`)}catch{}let m=j("",c||d);i.push({id:String(l),url:d,language:m.language,name:m.name,lang:m.code,langCode:m.iso3,label:m.name,headers:{Referer:a+"/",Origin:a,"User-Agent":V}})}}catch{}return i}async function Y(n,t,i,s){let o=Date.now(),a=String(n||"").trim(),l=String(t||"").toLowerCase().trim(),r=l==="tv"||l==="series",e=r?"tv":"movie",d=i!=null?Math.max(1,Number(i)):1,b=s!=null?Math.max(1,Number(s)):1;if(!a)return[];y("han's 33",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${a}, T\xFCr: ${e}, Sezon: ${d}, B\xF6l\xFCm: ${b}`);try{y("han's 33",`[Ad\u0131m 1/4] IMDb ID \xE7\xF6z\xFCmleniyor (${a})...`);let c=await se(a,e);if(!c||!c.startsWith("tt"))return y("han's 33",`IMDb ID bulunamad\u0131: ${a}`,"warn"),[];let m=await ne("ace");if(!m)return y("han's 33","Domain not resolved","warn"),[];y("han's 33",`[Ad\u0131m 2/4] Kesin IMDb aramas\u0131 yap\u0131l\u0131yor (${c})...`);let k=`${m}/search?keyword=${encodeURIComponent(c)}`,A=await fetch(k,{headers:{"User-Agent":U,Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",Referer:m+"/"},signal:AbortSignal.timeout?AbortSignal.timeout(4e3):void 0});if(!A.ok)return y("han's 33",`Arama ba\u015Far\u0131s\u0131z: HTTP ${A.status}`,"warn"),[];let h=await A.text(),u="";if(r){let f=h.match(/href=["']((?:https?:\/\/[^\/]+)?\/watch-series\/[^"']+)["']/i);if(!f)return y("han's 33","Dizi arama sonu\xE7lar\u0131nda bulunamad\u0131.","warn"),[];let _=f[1];_.startsWith("/")&&(_=m+_);let C=_.match(/watch-series\/([^/]+)/),z=C?C[1]:"";if(!z)return y("han's 33","Dizi slug bulunamad\u0131.","warn"),[];let K=String(d).padStart(2,"0"),I=String(b).padStart(2,"0");u=`${m}/episode/${z}/s${K}-e${I}/`,y("han's 33"," \u0130\xE7erik bulundu (Dizi B\xF6l\xFCm\xFC)","success")}else{let f=h.match(/href=["']((?:https?:\/\/[^\/]+)?\/watch-movie\/[^"']+)["']/i);if(!f)return y("han's 33","Film arama sonu\xE7lar\u0131nda bulunamad\u0131.","warn"),[];u=f[1],u.startsWith("/")&&(u=m+u),y("han's 33"," \u0130\xE7erik bulundu (Film)","success")}y("han's 33","[Ad\u0131m 3/4] Oynat\u0131c\u0131 sayfas\u0131 taran\u0131yor...");let g=await fetch(u,{headers:{"User-Agent":U,Referer:k},signal:AbortSignal.timeout?AbortSignal.timeout(4500):void 0});if(!g.ok)return y("han's 33",`Oynat\u0131c\u0131 sayfas\u0131 y\xFCklenemedi: HTTP ${g.status}`,"warn"),[];let p=(await g.text()).match(/data-token=["']([^"']+)["']/i);if(!p)return y("han's 33","Oynat\u0131c\u0131 belirteci (data-token) bulunamad\u0131.","warn"),[];let M=p[1],w=new URLSearchParams;r?w.append("players_show",M):w.append("players",M);let L=await fetch(`${m}/ajax/ajax.php`,{method:"POST",headers:{"User-Agent":U,Referer:u,Origin:m,"X-Requested-With":"XMLHttpRequest","Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},body:w.toString(),signal:AbortSignal.timeout?AbortSignal.timeout(4500):void 0});if(!L.ok)return y("han's 33",`Sunucu listesi iste\u011Fi ba\u015Far\u0131s\u0131z: HTTP ${L.status}`,"warn"),[];let P=await L.json();if(!Array.isArray(P)||P.length===0)return y("han's 33","Kullan\u0131labilir video sunucusu bulunamad\u0131.","warn"),[];y("han's 33",`[Ad\u0131m 4/4] Video ak\u0131\u015F\u0131 \xE7\xF6z\xFCmleniyor (${P.length} sunucu)...`);let S=[...P].sort((f,_)=>{let C=f.name?.toLowerCase().includes("vidmoly")||f.link?.includes("kaembed")||f.link?.includes("vidmoly");return(_.name?.toLowerCase().includes("vidmoly")||_.link?.includes("kaembed")||_.link?.includes("vidmoly")?1:0)-(C?1:0)}),R=null,x="",E=null;for(let f of S)if(f.link)try{let _=await fetch(f.link,{headers:{"User-Agent":U,Referer:u},signal:AbortSignal.timeout?AbortSignal.timeout(5e3):void 0});if(_.ok){let C=await _.text(),z=C.match(/file\s*:\s*["']([^"']+\.m3u8[^"']*)["']/i)||C.match(/sources\s*:\s*\[\s*\{\s*file\s*:\s*["']([^"']+)["']/i)||C.match(/https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*/i);if(z){R=f,x=C,E=z;break}}}catch{}if(!R||!E)return y("han's 33","m3u8 video ak\u0131\u015F\u0131 bulunamad\u0131.","warn"),[];let W=E[1]||E[0],N=[],O=new Set,J=R.link.match(/sub(?:get|\.info)=([^&]+)/i);if(J)try{let f=decodeURIComponent(J[1]),_=await fetch(f,{headers:{"User-Agent":U},signal:AbortSignal.timeout?AbortSignal.timeout(3e3):void 0});if(_.ok){let C=await _.json();if(Array.isArray(C)){for(let z of C)if(z.file&&!O.has(z.file)){O.add(z.file);let K=z.label||"",I=j("",K);N.push({id:String(N.length),url:z.file,language:I.language,name:I.name,lang:I.code,langCode:I.iso3,label:I.name,headers:{"User-Agent":V,Referer:m+"/",Origin:m}})}}}}catch{}let de=Ie(x,R.link);for(let f of de)O.has(f.url)||(O.add(f.url),N.push(f));let X=N.some(f=>f.lang==="tr"||f.langCode==="tur"||f.label?.toLowerCase().includes("t\xFCrk")||f.language==="Turkish"),me=ue({m3u8Text:x,m3u8Url:W,externalSubtitles:N,siteHint:{isDublaj:!1,isAltyazi:X,label:X?"Altyaz\u0131l\u0131":"Orijinal"}}),G="https://kaembed.net";try{R?.link&&(G=new URL(R.link).origin)}catch{}let Q=[ge({name:"han's 33",url:W,inspection:me,quality:"1080p",format:"m3u8",headers:{"User-Agent":V,Referer:`${G}/`,Origin:G}})],he=((Date.now()-o)/1e3).toFixed(2);return y("han's 33",`[Ad\u0131m 4/4] TAMAMLANDI: 1 ak\u0131\u015F haz\u0131rland\u0131 (${he}s)`,"success",Q.map(f=>({title:f.title,quality:f.quality||"1080p",format:"m3u8"}))),Q}catch(c){return y("han's 33",`Hata: ${c.message||"Scrape error"}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=Y);var De={getStreams:Y};

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

;(()=>{const n="han's 33",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
