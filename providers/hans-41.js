
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

"use strict";var F=Object.defineProperty;var ie=Object.getOwnPropertyDescriptor;var te=Object.getOwnPropertyNames;var se=Object.prototype.hasOwnProperty;var oe=(e,i)=>{for(var t in i)F(e,t,{get:i[t],enumerable:!0})},le=(e,i,t,l)=>{if(i&&typeof i=="object"||typeof i=="function")for(let s of te(i))!se.call(e,s)&&s!==t&&F(e,s,{get:()=>i[s],enumerable:!(l=ie(i,s))||l.enumerable});return e};var re=e=>le(F({},"__esModule",{value:!0}),e);var ke={};oe(ke,{getStreams:()=>ee});module.exports=re(ke);var ce=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(i=>String.fromCharCode(i^42)).join(""),z={REMOTE_CONFIG_URL:ce,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"};var j=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};j.__NUVIO_CONFIG_STATE__||(j.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var A=j.__NUVIO_CONFIG_STATE__,ue=10*60*1e3;async function O(){let e=Date.now();try{let i={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let l=AbortSignal.timeout(8e3);l&&(i.signal=l)}catch{}let t=await fetch(`${z.REMOTE_CONFIG_URL}?_t=${e}`,i);if(t.ok){let l=await t.json(),s=l?.data??l,n=s.domains||s,o=s.cookies,r=s.tmdb_keys||s.tmdbKeys;n&&typeof n=="object"&&(A.cachedDomains={...A.cachedDomains,...n}),o&&typeof o=="object"&&(A.cachedCookies={...A.cachedCookies,...o}),Array.isArray(r)&&r.length>0&&(A.cachedTmdbKeys=r),A.lastFetchTime=e}else A.lastFetchTime=0}catch{A.lastFetchTime=0}}async function K(){let e=Date.now();(!(Object.keys(A.cachedDomains).length>0)||e-A.lastFetchTime>ue)&&(A.activeFetchPromise||(A.activeFetchPromise=O().finally(()=>{A.activeFetchPromise=null})),await A.activeFetchPromise)}async function H(e){await K();let i=A.cachedDomains[e]||"";return i||(await O(),i=A.cachedDomains[e]||""),i}async function q(){return await K(),A.cachedTmdbKeys||[]}var ge="a2f888b27315e62e471b2d587048f32e",V=[ge,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function de(e){let i=await q(),t=i.length>0?[...i,...V]:V;for(let l=0;l<t.length;l++){let s=t[l],n=e.includes("?")?"&":"?",o=`https://api.themoviedb.org/3/${e}${n}api_key=${s}`;try{let r=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,a=await fetch(o,{signal:r});if(a.ok)return await a.json();if(a.status===429)continue}catch{}}return null}var x=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};x.__NUVIO_TMDB_CACHE__||(x.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var R=x.__NUVIO_TMDB_CACHE__,B=R.imdbIdCache,_e=R.tmdbTitlesCache,Se=R.tmdbImageCache,we=R.episodeGroupCache,ze=R.absoluteEpCache;async function Y(e,i){let t=String(e||"").replace(/^tmdb:/i,"").trim();if(!t)return null;if(t.startsWith("tt"))return t;let l=`${i}:${t}`;if(B.has(l))return B.get(l);let s=(async()=>{try{let o=await de(`${i==="tv"||i==="series"?"tv":"movie"}/${t}/external_ids`);if(o&&o.imdb_id)return o.imdb_id}catch{}return null})();return B.set(l,s),s}function _(e,i,t="info",l){let s=`[${e}]`;t==="error"?console.error(s,i,l||""):t==="warn"?console.warn(s,i,l||""):console.log(s,i,l||"");try{let o=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof o=="string"&&o.startsWith("http")&&fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:t,message:i,details:l})}).catch(()=>{})}catch{}}var me=["t\xFCrk\xE7e","turkish","turkce","dublaj","tr","tur","dual","trdual","trdub","ses-tr","audio-tr","tr-dub"],he=["english","ingilizce","original","orijinal","en","eng","und","audio-en"];function J(e,i){let t=!1,l=!1,s=[],n,o,r,a=(i||"").toLowerCase();if(a.includes("trdual")||a.includes("dual")||a.includes("trdub")||a.includes("dublaj")?(t=!0,l=!0):(a.includes("ses-tr")||a.includes("turkcedublaj")||a.includes("turkce-dublaj"))&&(t=!0),a.includes("2160p")||a.includes("4k")||a.includes("uhd")?n="4K":a.includes("1080p")||a.includes("1920x1080")||a.includes("fhd")?n="1080p":a.includes("720p")||a.includes("1280x720")||a.includes("hd")?n="720p":(a.includes("480p")||a.includes("854x480")||a.includes("sd"))&&(n="480p"),a.includes("hevc")||a.includes("h265")||a.includes("x265")?o="HEVC":a.includes("av1")?o="AV1":(a.includes("h264")||a.includes("x264")||a.includes("avc"))&&(o="H.264"),a.includes("5.1")||a.includes("eac3")||a.includes("ac3")||a.includes("ddp")?r="Dolby 5.1":(a.includes("7.1")||a.includes("atmos"))&&(r="Dolby Atmos 7.1"),e&&typeof e=="string"){let c=e.split(/\r?\n/);for(let T of c){let d=T.trim();if(d.startsWith("#EXT-X-MEDIA:")&&d.includes("TYPE=AUDIO")){let h=d.match(/NAME=["']([^"']+)["']/i),k=d.match(/LANGUAGE=["']([^"']+)["']/i),p=d.match(/GROUP-ID=["']([^"']+)["']/i),g=(h?h[1]:"").toLowerCase(),m=(k?k[1]:"").toLowerCase(),b=(p?p[1]:"").toLowerCase(),y=me.some(f=>g.includes(f)||m===f||b.includes(f))||g.includes("t\xFCrk")||g.includes("turk")||b.includes("dual"),w=he.some(f=>g.includes(f)||m===f||b.includes(f))||g.includes("orig")||g.includes("ing")||g.includes("eng");y&&(t=!0),w&&(l=!0)}if(d.startsWith("#EXT-X-MEDIA:")&&d.includes("TYPE=SUBTITLES")){let h=d.match(/URI=["']([^"']+)["']/i),k=d.match(/NAME=["']([^"']+)["']/i),p=d.match(/LANGUAGE=["']([^"']+)["']/i);if(h&&h[1]){let g=h[1];if(i&&!g.startsWith("http"))try{g=new URL(g,i).toString()}catch{}let m=k?k[1]:"Altyaz\u0131",b=p?p[1].toLowerCase():"";b==="st"||b==="sot"||m.toLowerCase().includes("sotho")||m.toLowerCase().includes("sesotho")||g.toLowerCase().includes("sub_st")?(b="tr",m="T\xFCrk\xE7e"):b||(b=m.toLowerCase().includes("t\xFCrk")?"tr":"und");let w=X(b,m);s.push({label:w.name||m,url:g,lang:w.code||b})}}}}let u=t&&l||a.includes("dual")||a.includes("trdual");return{hasTurkishAudio:t,hasOriginalAudio:l,isDual:u,embeddedSubtitles:s,detectedQuality:n,detectedCodec:o,detectedAudio:r}}function pe(e){let{hasTurkishAudio:i,hasOriginalAudio:t,isDual:l,hasSubtitles:s,hasTurkishSubtitles:n,isYerli:o,siteHint:r,defaultTitle:a}=e;if(o||r?.isYerli)return"Yerli";if(r?.label){let u=r.label.toLowerCase();if((u.includes("dub")||u.includes("t\xFCrk"))&&(u.includes("alt")||u.includes("sub")))return"Dublaj / Altyaz\u0131l\u0131";if(u.includes("dub")||u.includes("t\xFCrk\xE7e ses"))return"Dublaj";if(u.includes("alt")||u.includes("sub"))return"Altyaz\u0131l\u0131";if(u.includes("orijinal")||u.includes("original"))return"Orijinal"}return l||i&&(t||n)?"Dublaj / Altyaz\u0131l\u0131":i||r?.isDublaj?"Dublaj":n||r?.isAltyazi?"Altyaz\u0131l\u0131":a||(i?"Dublaj":"Orijinal")}var D={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function X(e,i,t){let l=g=>(g||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),s=l(e||""),n=l(i||""),o=!!t||s.includes("forced")||n.includes("forced")||s.includes("zorunlu")||n.includes("zorunlu"),r=s.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),a=n.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),u=g=>{let m=g.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return o?`${m} (Zorunlu)`:m};if(r==="st"||r==="sot"||r.includes("sotho")||a.includes("sotho")||a.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:o?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let c=D[s]||D[n]||D[r]||D[a];if(!c){let g=(a+" "+r).split(/\s+/).filter(Boolean);for(let m of g)if(D[m]){c=D[m];break}}if(!c){for(let[g,m]of Object.entries(D))if(g.length>=4&&(a.includes(g)||r.includes(g))){c=m;break}}if(c)return{code:c.code,iso3:c.iso3,language:c.language,name:u(c.name)};let T=(i||e||"Altyaz\u0131").trim();T=T.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let d=T.charAt(0).toUpperCase()+T.slice(1),h=u(d),k=s&&s.length===2?s:n&&n.length===2?n:"und",p=s&&s.length===3?s:n&&n.length===3?n:"und";return{code:k,iso3:p,language:d,name:h}}function W(e,i){let t=[],l=new Set,s=[...e||[],...i||[]];for(let n of s){if(!n||!n.url)continue;let o=n.url.trim();if(l.has(o))continue;l.add(o);let r=X(n.lang,n.label||n.name||n.language),a=r.name||n.label||n.name||"Altyaz\u0131";t.push({id:String(t.length),url:o,label:a,name:a,language:r.language,lang:r.code,langCode:r.iso3,headers:n.headers})}return t}function G(e){let{m3u8Text:i,m3u8Url:t,externalSubtitles:l,siteHint:s,defaultTitle:n}=e,o=J(i,t),r=W(l),a=W(l,o.embeddedSubtitles),u=a.length>0||!!s?.isAltyazi,c=a.some(p=>p.lang==="tr"||p.lang==="st"||p.lang==="sot"||p.langCode==="tur"||p.langCode==="sot"||p.label?.toLowerCase().includes("t\xFCrk")||p.label?.toLowerCase().includes("sotho")||p.language==="Turkish"||p.language?.toLowerCase().includes("sotho")),T=o.hasTurkishAudio||!!s?.isDublaj,d=o.hasOriginalAudio,h=o.isDual||T&&(c||d),k=pe({hasTurkishAudio:T,hasOriginalAudio:d,isDual:h,hasSubtitles:u,hasTurkishSubtitles:c,isYerli:s?.isYerli,siteHint:s,defaultTitle:n});return{hasTurkishAudio:T,hasOriginalAudio:d,isDual:h,hasSubtitles:u,hasTurkishSubtitles:c,isYerli:s?.isYerli,languageTitle:k,subtitles:r}}function Q(e){let i=e.url?J(void 0,e.url):{},t=e.quality||i.detectedQuality||"1080p";t.includes("\u2022")&&(t=t.split("\u2022")[0].trim()),!t.includes("p")&&!t.includes("K")&&!t.includes("k")&&(t=`${t}p`);let l=e.subtitles||e.inspection?.subtitles,s=!!(e.inspection?.hasTurkishSubtitles||l?.some(y=>{let w=(y.lang||y.code||"").toLowerCase(),f=(y.langCode||y.iso3||"").toLowerCase(),v=(y.name||y.label||y.title||"").toLowerCase();return w==="tr"||w==="st"||f==="tur"||f==="sot"||v.includes("t\xFCrk")||v.includes("turk")||v.includes("sotho")})),n=(e.languageTitle||e.inspection?.languageTitle||"").toLowerCase().trim(),o=n.includes("dub")||n.includes("ses")||n.includes("dual")||!!i.hasTurkishAudio||!!e.inspection?.hasTurkishAudio,r=n.includes("dual")||n.includes("dub")&&(n.includes("alt")||n.includes("sub"))||o&&s,a="Orijinal";n.includes("yerli")||e.inspection?.isYerli?a="Yerli":r?a="Dublaj / Altyaz\u0131l\u0131":o?a="Dublaj":s||n.includes("alt")||n.includes("sub")?a="Altyaz\u0131l\u0131":(n.includes("orijinal")||n.includes("yabanc\u0131")||n.includes("original"))&&(a="Orijinal");let u=e.format==="m3u8"||e.url.includes(".m3u8")||e.url.includes("/master.")||e.url.includes("/hls/")||e.url.includes("/txt/"),c=e.format||(u?"m3u8":e.url.includes(".mp4")?"mp4":"m3u8"),T=c==="m3u8"?"HLS":c.toUpperCase(),d=[t],h=e.codec||i.detectedCodec;h&&h!=="H.264"&&d.push(h),d.push(T),e.bitrate&&d.push(e.bitrate);let k=e.audio||i.detectedAudio;k&&k!=="AAC 2.0"&&d.push(k);let p=e.details||d.join(" \u2022 "),g=`${a}
${p}`,m=`${t} \u2022 ${a}`,b={name:"han's 41",provider:"han's 41",title:a,description:g,url:e.url,quality:m,format:c};return e.headers&&Object.keys(e.headers).length>0&&(b.headers=e.headers),l&&l.length>0&&(b.subtitles=l),b}var S="han's 41",Z="https://liderfilmizle.vip";function fe(e,i){let t=[];if(!e)return t;let l=e.split(",");for(let s of l){let n="",o=s.trim(),r=s.match(/\[(.*?)\](.*)/);r&&(n=r[1].trim(),o=r[2].trim());let a=(n+" "+o).toLowerCase(),u=a.includes("turk")||a.includes("t\xFCrk")||a.includes("_tur.")||a.includes("tr."),c=a.includes("eng")||a.includes("ing")||a.includes("_eng.")||a.includes("en."),T=u?"tr":"en",d=u?"Turkish":c?"English":n||"English",h=u?"T\xFCrk\xE7e":c?"\u0130ngilizce":n||"\u0130ngilizce",k=o.startsWith("http")?o:i+o;t.some(p=>p.url===k)||t.push({id:String(t.length),language:d,name:h,label:h,title:h,lang:T,url:k,type:"vtt",headers:{Referer:i+"/","User-Agent":z.DEFAULT_USER_AGENT}})}return t}async function be(e,i){try{let t=await fetch(e,{headers:{"User-Agent":z.DEFAULT_USER_AGENT,Referer:i,Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"}});if(!t.ok)return null;let l=await t.text(),s=l.match(/jwplayer\([^)]*\)\.setup\(\s*(\{[\s\S]*?\})\s*\);/);if(s)try{let v=s[1],L=v.match(/file:\s*["']([^"']+)["']/);if(L){let M=L[1].replace(/\\\//g,"/"),I="";if(M.includes("url=")){let E=M.split("url=")[1];I=decodeURIComponent(E.split("&")[0])}else M.startsWith("http")?I=M:I=new URL(M,e).toString();let U=[];for(let E of v.matchAll(/file:\s*["']([^"']+\.vtt[^"']*)["'][\s\S]*?label:\s*["']([^"']+)["']/g)){let N=E[1].replace(/\\\//g,"/"),C=E[2];try{C=JSON.parse(`"${C.replace(/"/g,'\\"')}"`)}catch{C=C.replace(/\\u([0-9a-fA-F]{4})/g,(ye,ne)=>String.fromCharCode(parseInt(ne,16)))}let P=C.toLowerCase().includes("t\xFCrk")||C.toLowerCase().includes("tr");U.push({id:String(U.length),language:P?"Turkish":"English",name:P?"T\xFCrk\xE7e":C,label:P?"T\xFCrk\xE7e":C,title:P?"T\xFCrk\xE7e":C,lang:P?"tr":"en",url:N.startsWith("http")?N:new URL(N,e).toString(),type:"vtt",headers:{Referer:`${new URL(e).origin}/`,"User-Agent":z.DEFAULT_USER_AGENT}})}let $="";try{let E=await fetch(I,{headers:{"User-Agent":"okhttp/4.9.2",Referer:`${new URL(e).origin}/`}});E.ok&&($=await E.text())}catch{}let ae=G({m3u8Text:$,m3u8Url:I,externalSubtitles:U});return{hlsUrl:I,inspection:ae,quality:"1080p",origin:new URL(e).origin}}}catch{}let n=l.match(/<iframe[^>]+src=["']([^"']+)["']/i);if(!n)return null;let o=n[1],r=new URL(o).origin,a=await fetch(o,{headers:{"User-Agent":z.DEFAULT_USER_AGENT,Referer:e,Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8","Sec-Fetch-Dest":"iframe","Sec-Fetch-Mode":"navigate","Sec-Fetch-Site":"cross-site"}});if(!a.ok)return null;let u=await a.text(),c=u.match(/fetch\(["'](\/dl\?[^"']+)["']\)/i);if(!c)return null;let T=u.match(/file_id['"],\s*['"](\d+)['"]/),k=[`file_id=${T?T[1]:""}`,"aff=1","ref_url=play.liderfilm.cc"].join("; "),p=r+c[1],g=await fetch(p,{headers:{"User-Agent":z.DEFAULT_USER_AGENT,Referer:o,Origin:r,Cookie:k,"X-Requested-With":"XMLHttpRequest",Accept:"application/json, text/javascript, */*; q=0.01","Sec-Fetch-Dest":"empty","Sec-Fetch-Mode":"cors","Sec-Fetch-Site":"same-origin"}});if(!g.ok)return null;let m=await g.json();if(!m||!m.url)return null;let b=[],y=u.match(/"subtitle":\s*["']([^"']+)["']/i);y&&(b=fe(y[1],r));let w="";try{let v=await fetch(m.url,{headers:{"User-Agent":"okhttp/4.9.2",Referer:r+"/",Origin:r},signal:AbortSignal.timeout?AbortSignal.timeout(4e3):void 0});v.ok&&(w=await v.text())}catch{}let f=G({m3u8Text:w,m3u8Url:m.url,externalSubtitles:b});return{hlsUrl:m.url,inspection:f,quality:"1080p",origin:r}}catch(t){return _(S,`Embed \xE7\xF6z\xFCmleme hatas\u0131: ${t.message}`,"error"),null}}async function ee(e,i,t=1,l=1){let s=Date.now();_(S,`[Ad\u0131m 1/4] Arama Ba\u015Flat\u0131ld\u0131: TMDB ID=${e}, T\xFCr=${i}, Sezon=${t}, B\xF6l\xFCm=${l}`,"info");try{let n=await Y(e,i);if(!n)return _(S,"IMDb ID bulunamad\u0131, arama iptal edildi.","warn"),[];let o=await H("garling")||Z;(!o||o.includes("liderfilmizle.com"))&&(o=Z);let r=`${o}/api/search.php?q=${encodeURIComponent(n)}`;_(S,`[Ad\u0131m 2/4] IMDb ile aran\u0131yor: ${n}`,"info");let a=await fetch(r,{headers:{"User-Agent":z.DEFAULT_USER_AGENT,"X-Requested-With":"XMLHttpRequest",Referer:o+"/",Accept:"application/json, text/javascript, */*; q=0.01"}});if(!a.ok)return _(S,`Arama ba\u015Far\u0131s\u0131z: HTTP ${a.status}`,"warn"),[];let c=(await a.json())?.results||[];if(c.length===0)return _(S,"\u0130\xE7erik bulunamad\u0131 (0 sonu\xE7).","info"),[];let T=i==="tv"||i==="series",d=T?"series":"movie",h=c.find(f=>f.matched_type==="imdb_id")||c.find(f=>f.type===d)||c[0];if(!h||!h.slug)return _(S,"E\u015Fle\u015Fen i\xE7erik slug bilgisi bulunamad\u0131.","warn"),[];_(S,`[Ad\u0131m 3/4] E\u015Fle\u015Fme bulundu: "${h.title}" (${h.slug})`,"info");let k=T?`${o}/dizi/${h.slug}/sezon-${t}/bolum-${l}`:`${o}/${h.slug}`,p=await fetch(k,{headers:{"User-Agent":z.DEFAULT_USER_AGENT,Referer:o+"/",Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"}});if(!p.ok)return _(S,`Sayfa y\xFCklenemedi: HTTP ${p.status}`,"warn"),[];let m=(await p.text()).match(/window\._vs\s*=\s*['"]([^'"]+)['"]/);if(!m)return _(S,"Oynat\u0131c\u0131 verisi (_vs) bulunamad\u0131.","warn"),[];let b=[];try{let f=atob(m[1]);b=(JSON.parse(f)||[]).filter(L=>L.url&&!L.url.includes("youtube.com"))}catch(f){return _(S,`_vs verisi \xE7\xF6z\xFCmlenemedi: ${f.message}`,"error"),[]}if(b.length===0)return _(S,"Kullan\u0131labilir video oynat\u0131c\u0131 bulunamad\u0131.","warn"),[];let y=[];for(let f of b){if(!f.url)continue;_(S,`Oynat\u0131c\u0131 \xE7\xF6z\xFCmleniyor: ${f.url}`,"info");let v=await be(f.url,k);if(v&&v.hlsUrl){let L=Q({name:S,url:v.hlsUrl,inspection:v.inspection,quality:"1080p",format:"m3u8",headers:{Referer:v.origin+"/","User-Agent":z.DEFAULT_USER_AGENT},subtitles:v.inspection?.subtitles});y.push(L);break}}if(y.length===0)return _(S,"Video ak\u0131\u015F\u0131 \xE7\xF6z\xFCmlenemedi.","warn"),[];let w=((Date.now()-s)/1e3).toFixed(2);return _(S,`[Ad\u0131m 4/4] TAMAMLANDI: ${y.length} ak\u0131\u015F haz\u0131rland\u0131 (${w}s)`,"success",{stream:y[0].url,ba\u015Fl\u0131k:y[0].title,altyaz\u0131lar:y[0].subtitles?.length||0}),y}catch(n){return _(S,`Kritik Hata: ${n.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=ee);

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

;(()=>{const n="han's 41",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
