
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

"use strict";var R=Object.defineProperty;var Q=Object.getOwnPropertyDescriptor;var ee=Object.getOwnPropertyNames;var ae=Object.prototype.hasOwnProperty;var ne=(e,n)=>{for(var i in n)R(e,i,{get:n[i],enumerable:!0})},ie=(e,n,i,s)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of ee(n))!ae.call(e,o)&&o!==i&&R(e,o,{get:()=>n[o],enumerable:!(s=Q(n,o))||s.enumerable});return e};var te=e=>ie(R({},"__esModule",{value:!0}),e);var be={};ne(be,{getStreams:()=>X});module.exports=te(be);var se=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(n=>String.fromCharCode(n^42)).join(""),oe={REMOTE_CONFIG_URL:se,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"};var B=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};B.__NUVIO_CONFIG_STATE__||(B.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var k=B.__NUVIO_CONFIG_STATE__,le=10*60*1e3;async function U(){let e=Date.now();try{let n={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let s=AbortSignal.timeout(8e3);s&&(n.signal=s)}catch{}let i=await fetch(`${oe.REMOTE_CONFIG_URL}?_t=${e}`,n);if(i.ok){let s=await i.json(),o=s?.data??s,t=o.domains||o,l=o.cookies,r=o.tmdb_keys||o.tmdbKeys;t&&typeof t=="object"&&(k.cachedDomains={...k.cachedDomains,...t}),l&&typeof l=="object"&&(k.cachedCookies={...k.cachedCookies,...l}),Array.isArray(r)&&r.length>0&&(k.cachedTmdbKeys=r),k.lastFetchTime=e}else k.lastFetchTime=0}catch{k.lastFetchTime=0}}async function x(){let e=Date.now();(!(Object.keys(k.cachedDomains).length>0)||e-k.lastFetchTime>le)&&(k.activeFetchPromise||(k.activeFetchPromise=U().finally(()=>{k.activeFetchPromise=null})),await k.activeFetchPromise)}async function K(e){await x();let n=k.cachedDomains[e]||"";return n||(await U(),n=k.cachedDomains[e]||""),n}async function N(){return await x(),k.cachedTmdbKeys||[]}var re="a2f888b27315e62e471b2d587048f32e",O=[re,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function ce(e){let n=await N(),i=n.length>0?[...n,...O]:O;for(let s=0;s<i.length;s++){let o=i[s],t=e.includes("?")?"&":"?",l=`https://api.themoviedb.org/3/${e}${t}api_key=${o}`;try{let r=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,a=await fetch(l,{signal:r});if(a.ok)return await a.json();if(a.status===429)continue}catch{}}return null}var $=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};$.__NUVIO_TMDB_CACHE__||($.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var D=$.__NUVIO_TMDB_CACHE__,j=D.imdbIdCache,ve=D.tmdbTitlesCache,_e=D.tmdbImageCache,Ae=D.episodeGroupCache,we=D.absoluteEpCache;async function H(e,n){let i=String(e||"").replace(/^tmdb:/i,"").trim();if(!i)return null;if(i.startsWith("tt"))return i;let s=`${n}:${i}`;if(j.has(s))return j.get(s);let o=(async()=>{try{let l=await ce(`${n==="tv"||n==="series"?"tv":"movie"}/${i}/external_ids`);if(l&&l.imdb_id)return l.imdb_id}catch{}return null})();return j.set(s,o),o}function y(e,n,i="info",s){let o=`[${e}]`;i==="error"?console.error(o,n,s||""):i==="warn"?console.warn(o,n,s||""):console.log(o,n,s||"");try{let l=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof l=="string"&&l.startsWith("http")&&fetch(l,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:i,message:n,details:s})}).catch(()=>{})}catch{}}var ue=["t\xFCrk\xE7e","turkish","turkce","dublaj","tr","tur","dual","trdual","trdub","ses-tr","audio-tr","tr-dub"],ge=["english","ingilizce","original","orijinal","en","eng","und","audio-en"];function Y(e,n){let i=!1,s=!1,o=[],t,l,r,a=(n||"").toLowerCase();if(a.includes("trdual")||a.includes("dual")||a.includes("trdub")||a.includes("dublaj")?(i=!0,s=!0):(a.includes("ses-tr")||a.includes("turkcedublaj")||a.includes("turkce-dublaj"))&&(i=!0),a.includes("2160p")||a.includes("4k")||a.includes("uhd")?t="4K":a.includes("1080p")||a.includes("1920x1080")||a.includes("fhd")?t="1080p":a.includes("720p")||a.includes("1280x720")||a.includes("hd")?t="720p":(a.includes("480p")||a.includes("854x480")||a.includes("sd"))&&(t="480p"),a.includes("hevc")||a.includes("h265")||a.includes("x265")?l="HEVC":a.includes("av1")?l="AV1":(a.includes("h264")||a.includes("x264")||a.includes("avc"))&&(l="H.264"),a.includes("5.1")||a.includes("eac3")||a.includes("ac3")||a.includes("ddp")?r="Dolby 5.1":(a.includes("7.1")||a.includes("atmos"))&&(r="Dolby Atmos 7.1"),e&&typeof e=="string"){let p=e.split(/\r?\n/);for(let v of p){let u=v.trim();if(u.startsWith("#EXT-X-MEDIA:")&&u.includes("TYPE=AUDIO")){let d=u.match(/NAME=["']([^"']+)["']/i),f=u.match(/LANGUAGE=["']([^"']+)["']/i),g=u.match(/GROUP-ID=["']([^"']+)["']/i),c=(d?d[1]:"").toLowerCase(),m=(f?f[1]:"").toLowerCase(),b=(g?g[1]:"").toLowerCase(),_=ue.some(T=>c.includes(T)||m===T||b.includes(T))||c.includes("t\xFCrk")||c.includes("turk")||b.includes("dual"),A=ge.some(T=>c.includes(T)||m===T||b.includes(T))||c.includes("orig")||c.includes("ing")||c.includes("eng");_&&(i=!0),A&&(s=!0)}if(u.startsWith("#EXT-X-MEDIA:")&&u.includes("TYPE=SUBTITLES")){let d=u.match(/URI=["']([^"']+)["']/i),f=u.match(/NAME=["']([^"']+)["']/i),g=u.match(/LANGUAGE=["']([^"']+)["']/i);if(d&&d[1]){let c=d[1];if(n&&!c.startsWith("http"))try{c=new URL(c,n).toString()}catch{}let m=f?f[1]:"Altyaz\u0131",b=g?g[1].toLowerCase():"";b==="st"||b==="sot"||m.toLowerCase().includes("sotho")||m.toLowerCase().includes("sesotho")||c.toLowerCase().includes("sub_st")?(b="tr",m="T\xFCrk\xE7e"):b||(b=m.toLowerCase().includes("t\xFCrk")?"tr":"und");let A=W(b,m);o.push({label:A.name||m,url:c,lang:A.code||b})}}}}let h=i&&s||a.includes("dual")||a.includes("trdual");return{hasTurkishAudio:i,hasOriginalAudio:s,isDual:h,embeddedSubtitles:o,detectedQuality:t,detectedCodec:l,detectedAudio:r}}function de(e){let{hasTurkishAudio:n,hasOriginalAudio:i,isDual:s,hasSubtitles:o,hasTurkishSubtitles:t,isYerli:l,siteHint:r,defaultTitle:a}=e;if(l||r?.isYerli)return"Yerli";if(r?.label){let h=r.label.toLowerCase();if((h.includes("dub")||h.includes("t\xFCrk"))&&(h.includes("alt")||h.includes("sub")))return"Dublaj / Altyaz\u0131l\u0131";if(h.includes("dub")||h.includes("t\xFCrk\xE7e ses"))return"Dublaj";if(h.includes("alt")||h.includes("sub"))return"Altyaz\u0131l\u0131";if(h.includes("orijinal")||h.includes("original"))return"Orijinal"}return s||n&&(i||t)?"Dublaj / Altyaz\u0131l\u0131":n||r?.isDublaj?"Dublaj":t||r?.isAltyazi?"Altyaz\u0131l\u0131":a||(n?"Dublaj":"Orijinal")}var M={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function W(e,n,i){let s=c=>(c||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),o=s(e||""),t=s(n||""),l=!!i||o.includes("forced")||t.includes("forced")||o.includes("zorunlu")||t.includes("zorunlu"),r=o.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),a=t.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),h=c=>{let m=c.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return l?`${m} (Zorunlu)`:m};if(r==="st"||r==="sot"||r.includes("sotho")||a.includes("sotho")||a.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:l?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let p=M[o]||M[t]||M[r]||M[a];if(!p){let c=(a+" "+r).split(/\s+/).filter(Boolean);for(let m of c)if(M[m]){p=M[m];break}}if(!p){for(let[c,m]of Object.entries(M))if(c.length>=4&&(a.includes(c)||r.includes(c))){p=m;break}}if(p)return{code:p.code,iso3:p.iso3,language:p.language,name:h(p.name)};let v=(n||e||"Altyaz\u0131").trim();v=v.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let u=v.charAt(0).toUpperCase()+v.slice(1),d=h(u),f=o&&o.length===2?o:t&&t.length===2?t:"und",g=o&&o.length===3?o:t&&t.length===3?t:"und";return{code:f,iso3:g,language:u,name:d}}function q(e,n){let i=[],s=new Set,o=[...e||[],...n||[]];for(let t of o){if(!t||!t.url)continue;let l=t.url.trim();if(s.has(l))continue;s.add(l);let r=W(t.lang,t.label||t.name||t.language),a=r.name||t.label||t.name||"Altyaz\u0131";i.push({id:String(i.length),url:l,label:a,name:a,language:r.language,lang:r.code,langCode:r.iso3,headers:t.headers})}return i}function V(e){let{m3u8Text:n,m3u8Url:i,externalSubtitles:s,siteHint:o,defaultTitle:t}=e,l=Y(n,i),r=q(s),a=q(s,l.embeddedSubtitles),h=a.length>0||!!o?.isAltyazi,p=a.some(g=>g.lang==="tr"||g.lang==="st"||g.lang==="sot"||g.langCode==="tur"||g.langCode==="sot"||g.label?.toLowerCase().includes("t\xFCrk")||g.label?.toLowerCase().includes("sotho")||g.language==="Turkish"||g.language?.toLowerCase().includes("sotho")),v=l.hasTurkishAudio||!!o?.isDublaj,u=l.hasOriginalAudio,d=l.isDual||v&&(p||u),f=de({hasTurkishAudio:v,hasOriginalAudio:u,isDual:d,hasSubtitles:h,hasTurkishSubtitles:p,isYerli:o?.isYerli,siteHint:o,defaultTitle:t});return{hasTurkishAudio:v,hasOriginalAudio:u,isDual:d,hasSubtitles:h,hasTurkishSubtitles:p,isYerli:o?.isYerli,languageTitle:f,subtitles:r}}function J(e){let n=e.url?Y(void 0,e.url):{},i=e.quality||n.detectedQuality||"1080p";i.includes("\u2022")&&(i=i.split("\u2022")[0].trim()),!i.includes("p")&&!i.includes("K")&&!i.includes("k")&&(i=`${i}p`);let s=e.subtitles||e.inspection?.subtitles,o=!!(e.inspection?.hasTurkishSubtitles||s?.some(_=>{let A=(_.lang||_.code||"").toLowerCase(),T=(_.langCode||_.iso3||"").toLowerCase(),I=(_.name||_.label||_.title||"").toLowerCase();return A==="tr"||A==="st"||T==="tur"||T==="sot"||I.includes("t\xFCrk")||I.includes("turk")||I.includes("sotho")})),t=(e.languageTitle||e.inspection?.languageTitle||"").toLowerCase().trim(),l=t.includes("dub")||t.includes("ses")||t.includes("dual")||!!n.hasTurkishAudio||!!e.inspection?.hasTurkishAudio,r=t.includes("dual")||t.includes("dub")&&(t.includes("alt")||t.includes("sub"))||l&&o,a="Orijinal";t.includes("yerli")||e.inspection?.isYerli?a="Yerli":r?a="Dublaj / Altyaz\u0131l\u0131":l?a="Dublaj":o||t.includes("alt")||t.includes("sub")?a="Altyaz\u0131l\u0131":(t.includes("orijinal")||t.includes("yabanc\u0131")||t.includes("original"))&&(a="Orijinal");let h=e.format==="m3u8"||e.url.includes(".m3u8")||e.url.includes("/master.")||e.url.includes("/hls/")||e.url.includes("/txt/"),p=e.format||(h?"m3u8":e.url.includes(".mp4")?"mp4":"m3u8"),v=p==="m3u8"?"HLS":p.toUpperCase(),u=[i],d=e.codec||n.detectedCodec;d&&d!=="H.264"&&u.push(d),u.push(v),e.bitrate&&u.push(e.bitrate);let f=e.audio||n.detectedAudio;f&&f!=="AAC 2.0"&&u.push(f);let g=e.details||u.join(" \u2022 "),c=`${a}
${g}`,m=`${i} \u2022 ${a}`,b={name:"han's 24",provider:"han's 24",title:a,description:c,url:e.url,quality:m,format:p};return e.headers&&Object.keys(e.headers).length>0&&(b.headers=e.headers),s&&s.length>0&&(b.subtitles=s),b}var z="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";function me(e){try{if(typeof e.headers.getSetCookie=="function"){let o=e.headers.getSetCookie();if(Array.isArray(o)&&o.length>0)return o.map(t=>t.split(";")[0].trim()).join("; ")}}catch{}let n=e.headers.get("set-cookie")||"";if(!n)return"";let i=[],s=n.split(/,\s*(?=[a-zA-Z0-9_\-]+=[^;]+)/);for(let o of s){let t=o.split(";")[0].trim();t&&t.includes("=")&&i.push(t)}return i.length>0?i.join("; "):n.split(";")[0].trim()}async function he(e,n){let i=`${e}/arama/?q=${encodeURIComponent(n)}&ajax=1`;try{let s=await fetch(i,{headers:{"User-Agent":z,Accept:"application/json","X-Requested-With":"XMLHttpRequest",Referer:`${e}/`}});return s.ok?await s.json():null}catch(s){return y("han's 24",`Arama hatas\u0131 (${n}): ${s.message}`,"warn"),null}}async function pe(e,n,i){try{let s=await fetch(n,{headers:{"User-Agent":z,Referer:i}});if(!s.ok)return null;let o=me(s),t=await s.text(),l=t.match(/name="_token"\s+value="([^"]+)"/),r=t.match(/action="([^"]+)"/);if(!l||!r)return null;let a=await fetch(r[1],{method:"POST",redirect:"follow",headers:{"User-Agent":z,Cookie:o,"Content-Type":"application/x-www-form-urlencoded",Origin:e,Referer:n},body:new URLSearchParams({_token:l[1]}).toString()});if(!a.ok)return null;let p=(await a.text()).match(/<iframe[^>]+src=["']([^"']+)["']/i);return p?p[1]:null}catch(s){return y("han's 24",`Gate yetkilendirme hatas\u0131: ${s.message}`,"warn"),null}}async function fe(e,n){try{let i=await fetch(n,{headers:{"User-Agent":z,Referer:`${e}/`}});if(!i.ok)return null;let o=(await i.text()).match(/file:\s*['"]([^'"]+\.m3u8[^'"]*)['"]/i);return o?o[1]:null}catch(i){return y("han's 24",`Embed \xE7\xF6z\xFCmleme hatas\u0131: ${i.message}`,"warn"),null}}async function X(e,n,i,s){let o=Date.now();if(typeof e=="object"&&e!==null){let a=e;e=a.id||a.tmdbId||a.imdbId,n=a.type||a.mediaType,i=a.season??a.seasonNum,s=a.episode??a.episodeNum}let t=String(e||"").trim();t.toLowerCase().startsWith("tmdb:")&&(t=t.slice(5).trim());let l=t.split(":"),r=l[0];l.length>=3&&i===void 0&&(i=parseInt(l[1],10),s=parseInt(l[2],10)),y("han's 24",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${r}, T\xFCr: ${n}, Sezon: ${i||"-"}, B\xF6l\xFCm: ${s||"-"}`);try{let a=String(n||"").toLowerCase().trim(),h=a==="tv"||a==="series",p=h?"tv":"movie",v=i!=null?parseInt(String(i),10):1,u=s!=null?parseInt(String(s),10):1;if(!r)return[];let d=await K("mihawk");if(!d)return y("han's 24","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let f=r.startsWith("tt")?r:await H(r,p);if(!f||!f.startsWith("tt"))return y("han's 24",`IMDb ID bulunamad\u0131 (TMDB: ${r}). \u0130simle arama yap\u0131lmaz, iptal edildi.`,"warn"),[];y("han's 24",`[Ad\u0131m 1/4] Kesin IMDb ID ile aran\u0131yor: ${f}`);let g=null,c=await he(d,f);if(c&&(c.redirect_url?g=c.redirect_url:c.items&&c.items.length>0&&(g=c.items[0].url||null)),!g)return y("han's 24",`\u0130\xE7erik IMDb ID ile bulunamad\u0131: ${f}`,"warn"),[];y("han's 24","[Ad\u0131m 2/4]  \u0130\xE7erik sayfas\u0131 tespit edildi.","success");let m=g;if(h&&(m=`${g.replace(/\/$/,"")}/sezon-${v}/bolum-${u}/`,(await fetch(m,{headers:{"User-Agent":z,Referer:`${d}/`}})).status===404))try{let C=await fetch(g,{headers:{"User-Agent":z,Referer:`${d}/`}});if(C.ok){let P=[...(await C.text()).matchAll(/href=["']((?:https?:\/\/[^\/]+)?\/dizi\/[^"']*bolum[^"']*)["']/gi)].map(w=>w[1].startsWith("http")?w[1]:`${d}${w[1].startsWith("/")?"":"/"}${w[1]}`).find(w=>{let L=w.match(/sezon-(\d+)\/bolum-(\d+)/i);return L&&parseInt(L[1],10)===v&&parseInt(L[2],10)===u});P&&(m=P)}}catch{}y("han's 24","[Ad\u0131m 3/4] Oynatma sayfas\u0131 sorgulan\u0131yor...","info");let b=await fetch(m,{headers:{"User-Agent":z,Referer:`${d}/`}});if(!b.ok)return y("han's 24",`Oynatma sayfas\u0131na eri\u015Filemedi (HTTP ${b.status})`,"warn"),[];let A=[...(await b.text()).matchAll(/<button[^>]+data-player-source=["']([^"']+)["'][^>]*>([\s\S]*?)<\/button>/gi)];if(A.length===0)return y("han's 24","Oynatma butonlar\u0131 bulunamad\u0131 veya telif engelli.","warn"),[];y("han's 24",`[Ad\u0131m 4/4] ${A.length} adet kaynak butonu ayr\u0131\u015Ft\u0131r\u0131l\u0131yor...`,"info");let T=[];for(let S of A){let E=S[1],C=S[2],G=C.toLowerCase().includes("dub")||C.toLowerCase().includes("dublaj"),F=C.toLowerCase().includes("sub")||C.toLowerCase().includes("altyaz"),P=await pe(d,E,m);if(!P)continue;let w=await fe(d,P);if(!w)continue;let L=V({m3u8Url:w,siteHint:{isDublaj:G,isAltyazi:F}}),Z=J({name:"han's 24",url:w,inspection:L,quality:"1080p",format:"m3u8",headers:{"User-Agent":z,Referer:`${d}/`}});T.push(Z),y("han's 24",` Ak\u0131\u015F \xC7\u0131kar\u0131ld\u0131: ${L.languageTitle}`,"success")}let I=((Date.now()-o)/1e3).toFixed(2);return y("han's 24",`[Ad\u0131m 4/4] TAMAMLANDI: ${T.length} adet ak\u0131\u015F listelendi (${I}s)`,"success",T.map(S=>({server:S.name,kalite:S.quality,title:S.title}))),T}catch(a){return y("han's 24",`Kritik Hata: ${a.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=X);

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

;(()=>{const n="han's 24",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
