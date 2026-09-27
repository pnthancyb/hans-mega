
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

"use strict";var B=Object.defineProperty;var se=Object.getOwnPropertyDescriptor;var oe=Object.getOwnPropertyNames;var le=Object.prototype.hasOwnProperty;var re=(e,t)=>{for(var i in t)B(e,i,{get:t[i],enumerable:!0})},ce=(e,t,i,l)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of oe(t))!le.call(e,o)&&o!==i&&B(e,o,{get:()=>t[o],enumerable:!(l=se(t,o))||l.enumerable});return e};var ue=e=>ce(B({},"__esModule",{value:!0}),e);var Te={};re(Te,{getStreams:()=>ne});module.exports=ue(Te);function _(e,t,i="info",l){let o=`[${e}]`;i==="error"?console.error(o,t,l||""):i==="warn"?console.warn(o,t,l||""):console.log(o,t,l||"");try{let s=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof s=="string"&&s.startsWith("http")&&fetch(s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:i,message:t,details:l})}).catch(()=>{})}catch{}}var ge=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(t=>String.fromCharCode(t^42)).join(""),C={REMOTE_CONFIG_URL:ge,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},N=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};try{typeof localStorage<"u"&&localStorage&&typeof localStorage.removeItem=="function"&&(localStorage.removeItem("__NUVIO_CONFIG_CACHE__"),localStorage.removeItem("__NUVIO_CONFIG_CACHE_V2__"))}catch{}var $=10*1e3,de=10*1e3;N.__NUVIO_CONFIG_STATE__||(N.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var w=N.__NUVIO_CONFIG_STATE__;async function K(){let e=Date.now(),t=[];try{let i=N.__NUVIO_DEV_LOG_URL__;typeof i=="string"&&i.includes("/api/log")&&t.push(i.replace("/api/log","/domains"))}catch{}t.push(C.REMOTE_CONFIG_URL);for(let i of t)try{let l=await fetch(i);if(l.ok){let o=await l.json(),n=o?.data??o,s=n.domains||n,r=n.cookies,a=n.tmdb_keys||n.tmdbKeys;s&&typeof s=="object"&&(w.cachedDomains={...w.cachedDomains,...s}),r&&typeof r=="object"&&(w.cachedCookies={...w.cachedCookies,...r}),Array.isArray(a)&&a.length>0&&(w.cachedTmdbKeys=a),w.lastFetchTime=e;return}}catch(l){_("Config",`Domain alinamadi (${i}): ${l.message}`,"warn")}w.lastFetchTime=e-$+de}async function H(){let e=Date.now();(!(Object.keys(w.cachedDomains).length>0)||e-w.lastFetchTime>$)&&(w.activeFetchPromise||(w.activeFetchPromise=K().finally(()=>{w.activeFetchPromise=null})),await w.activeFetchPromise)}async function q(e){return await H(),w.cachedDomains[e]||await K(),w.cachedDomains[e]||""}async function V(){return await H(),w.cachedTmdbKeys||[]}var me="a2f888b27315e62e471b2d587048f32e",Y=[me,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function he(e){let t=await V(),i=t.length>0?[...t,...Y]:Y;for(let l=0;l<i.length;l++){let o=i[l],n=e.includes("?")?"&":"?",s=`https://api.themoviedb.org/3/${e}${n}api_key=${o}`;try{let r=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,a=await fetch(s,{signal:r});if(a.ok)return await a.json();if(a.status===429)continue}catch{}}return null}var G=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};G.__NUVIO_TMDB_CACHE__||(G.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var P=G.__NUVIO_TMDB_CACHE__,j=P.imdbIdCache,Ce=P.tmdbTitlesCache,Le=P.tmdbImageCache,Ee=P.episodeGroupCache,Ie=P.absoluteEpCache;async function W(e,t){let i=String(e||"").replace(/^tmdb:/i,"").trim();if(!i)return null;if(i.startsWith("tt"))return i;let l=`${t}:${i}`;if(j.has(l))return j.get(l);let o=(async()=>{try{let s=await he(`${t==="tv"||t==="series"?"tv":"movie"}/${i}/external_ids`);if(s&&s.imdb_id)return s.imdb_id}catch{}return null})();return j.set(l,o),o}var pe=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],J=["tr","tur","ota"],fe=["english","ingilizce","original","orijinal","audio-en"],X=["en","eng","und"];function Z(e,t){let i=!1,l=!1,o=[],n,s,r,a=(t||"").toLowerCase();if(a.includes("trdual")||a.includes("dual")||a.includes("trdub")||a.includes("dublaj")?(i=!0,l=!0):(a.includes("ses-tr")||a.includes("turkcedublaj")||a.includes("turkce-dublaj"))&&(i=!0),a.includes("2160p")||a.includes("4k")||a.includes("uhd")?n="4K":a.includes("1080p")||a.includes("1920x1080")||a.includes("fhd")?n="1080p":a.includes("720p")||a.includes("1280x720")||a.includes("hd")?n="720p":(a.includes("480p")||a.includes("854x480")||a.includes("sd"))&&(n="480p"),a.includes("hevc")||a.includes("h265")||a.includes("x265")?s="HEVC":a.includes("av1")?s="AV1":(a.includes("h264")||a.includes("x264")||a.includes("avc"))&&(s="H.264"),a.includes("5.1")||a.includes("eac3")||a.includes("ac3")||a.includes("ddp")?r="Dolby 5.1":(a.includes("7.1")||a.includes("atmos"))&&(r="Dolby Atmos 7.1"),e&&typeof e=="string"){let h=e.split(/\r?\n/),u=0;for(let v of h){let g=v.trim();if(g.startsWith("#EXT-X-MEDIA:")&&g.includes("TYPE=AUDIO")){let b=g.match(/NAME=["']([^"']+)["']/i),m=g.match(/LANGUAGE=["']([^"']+)["']/i),p=g.match(/GROUP-ID=["']([^"']+)["']/i),c=(b?b[1]:"").toLowerCase(),k=(m?m[1]:"").toLowerCase(),d=(p?p[1]:"").toLowerCase(),z=c.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),y=d.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),T=J.includes(k)||J.some(S=>z.includes(S)||y.includes(S))||pe.some(S=>c.includes(S)||d.includes(S))||c.includes("t\xFCrk")||c.includes("turk")||d.includes("dual"),L=X.includes(k)||X.some(S=>z.includes(S)||y.includes(S))||fe.some(S=>c.includes(S)||d.includes(S))||c.includes("orig")||c.includes("ing")||c.includes("eng");T&&(i=!0),L&&(l=!0)}if(g.startsWith("#EXT-X-MEDIA:")&&g.includes("TYPE=SUBTITLES")){let b=g.match(/URI=["']([^"']+)["']/i),m=g.match(/NAME=["']([^"']+)["']/i),p=g.match(/LANGUAGE=["']([^"']+)["']/i);if(b&&b[1]){let c=b[1];if(t&&!c.startsWith("http"))try{c=new URL(c,t).toString()}catch{}let k=m?m[1]:"Altyaz\u0131",d=p?p[1].toLowerCase():"";d==="st"||d==="sot"||k.toLowerCase().includes("sotho")||k.toLowerCase().includes("sesotho")||c.toLowerCase().includes("sub_st")?(d="tr",k="T\xFCrk\xE7e"):d||(d=k.toLowerCase().includes("t\xFCrk")?"tr":"und");let y=ee(d,k);o.push({label:y.name||k,url:c,lang:y.code||d})}}if(g.startsWith("#EXT-X-STREAM-INF:")){let b=g.match(/RESOLUTION=(\d+)x(\d+)/i);if(b){let m=parseInt(b[1],10),p=parseInt(b[2],10),c=Math.min(m,p),k=Math.max(m,p),d=c>=2100||k>=3800?2160:c>=1400||k>=2500?1440:c>=1e3||k>=1900?1080:c>=700||k>=1200?720:c>=450?480:c;d>u&&(u=d)}else{let m=g.match(/NAME=["']?([^"',\s]+)["']?/i);if(m){let p=m[1].toLowerCase();p.includes("2160")||p.includes("4k")?2160>u&&(u=2160):p.includes("1440")||p.includes("2k")?1440>u&&(u=1440):p.includes("1080")?1080>u&&(u=1080):p.includes("720")&&720>u&&(u=720)}}}}u>=2160?n="4K":u>=1440?n="2K":u>=1080?n="1080p":u>=720?n="720p":u>=480&&(n="480p")}let f=i&&l||a.includes("dual")||a.includes("trdual");return{hasTurkishAudio:i,hasOriginalAudio:l,isDual:f,embeddedSubtitles:o,detectedQuality:n,detectedCodec:s,detectedAudio:r}}function be(e){let{hasTurkishAudio:t,hasOriginalAudio:i,isDual:l,hasSubtitles:o,hasTurkishSubtitles:n,isYerli:s,siteHint:r,defaultTitle:a}=e;if(s||r?.isYerli)return"Yerli";if(r?.label){let f=r.label.toLowerCase();if((f.includes("dub")||f.includes("t\xFCrk"))&&(f.includes("alt")||f.includes("sub")))return"Dublaj / Altyaz\u0131l\u0131";if(f.includes("dub")||f.includes("t\xFCrk\xE7e ses"))return"Dublaj";if(f.includes("alt")||f.includes("sub"))return"Altyaz\u0131l\u0131";if(f.includes("orijinal")||f.includes("original"))return"Orijinal"}return l||t&&(i||n)?"Dublaj / Altyaz\u0131l\u0131":t||r?.isDublaj?"Dublaj":n||r?.isAltyazi?"Altyaz\u0131l\u0131":a||(t?"Dublaj":"Orijinal")}var M={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function ee(e,t,i){let l=p=>(p||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),o=l(e||""),n=l(t||""),s=!!i||o.includes("forced")||n.includes("forced")||o.includes("zorunlu")||n.includes("zorunlu"),r=o.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),a=n.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),f=p=>{let c=p.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return s?`${c} (Zorunlu)`:c};if(r==="st"||r==="sot"||r.includes("sotho")||a.includes("sotho")||a.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:s?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let h=M[o]||M[n]||M[r]||M[a];if(!h){let p=(a+" "+r).split(/\s+/).filter(Boolean);for(let c of p)if(M[c]){h=M[c];break}}if(!h){for(let[p,c]of Object.entries(M))if(p.length>=4&&(a.includes(p)||r.includes(p))){h=c;break}}if(h)return{code:h.code,iso3:h.iso3,language:h.language,name:f(h.name)};let u=(t||e||"Altyaz\u0131").trim();u=u.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let v=u.charAt(0).toUpperCase()+u.slice(1),g=f(v),b=o&&o.length===2?o:n&&n.length===2?n:"und",m=o&&o.length===3?o:n&&n.length===3?n:"und";return{code:b,iso3:m,language:v,name:g}}function Q(e,t){let i=[],l=new Set,o=[...e||[],...t||[]];for(let n of o){if(!n||!n.url)continue;let s=n.url.trim();if(l.has(s))continue;l.add(s);let r=ee(n.lang,n.label||n.name||n.language),a=r.name||n.label||n.name||"Altyaz\u0131";i.push({id:String(i.length),url:s,label:a,name:a,language:r.language,lang:r.code,langCode:r.iso3,headers:n.headers})}return i}function x(e){let{m3u8Text:t,m3u8Url:i,externalSubtitles:l,siteHint:o,defaultTitle:n}=e,s=Z(t,i),r=Q(l),a=Q(l,s.embeddedSubtitles),f=a.length>0||!!o?.isAltyazi,h=a.some(m=>m.lang==="tr"||m.lang==="st"||m.lang==="sot"||m.langCode==="tur"||m.langCode==="sot"||m.label?.toLowerCase().includes("t\xFCrk")||m.label?.toLowerCase().includes("sotho")||m.language==="Turkish"||m.language?.toLowerCase().includes("sotho")),u=s.hasTurkishAudio||!!o?.isDublaj,v=s.hasOriginalAudio,g=s.isDual||u&&(h||v),b=be({hasTurkishAudio:u,hasOriginalAudio:v,isDual:g,hasSubtitles:f,hasTurkishSubtitles:h,isYerli:o?.isYerli,siteHint:o,defaultTitle:n});return{hasTurkishAudio:u,hasOriginalAudio:v,isDual:g,hasSubtitles:f,hasTurkishSubtitles:h,isYerli:o?.isYerli,languageTitle:b,subtitles:r,detectedQuality:s.detectedQuality,detectedCodec:s.detectedCodec,detectedAudio:s.detectedAudio}}function ae(e){let t=e.url?Z(void 0,e.url):{},i=e.quality||e.inspection?.detectedQuality||t.detectedQuality||"1080p";i.includes("\u2022")&&(i=i.split("\u2022")[0].trim()),!i.includes("p")&&!i.includes("K")&&!i.includes("k")&&(i=`${i}p`);let l=e.subtitles||e.inspection?.subtitles,o=!!(e.inspection?.hasTurkishSubtitles||l?.some(d=>{let z=(d.lang||d.code||"").toLowerCase(),y=(d.langCode||d.iso3||"").toLowerCase(),T=(d.name||d.label||d.title||"").toLowerCase();return z==="tr"||z==="st"||y==="tur"||y==="sot"||T.includes("t\xFCrk")||T.includes("turk")||T.includes("sotho")})),n=(e.languageTitle||e.inspection?.languageTitle||"").toLowerCase().trim(),s=n.includes("dub")||n.includes("ses")||n.includes("dual")||!!t.hasTurkishAudio||!!e.inspection?.hasTurkishAudio,r=n.includes("dual")||n.includes("dub")&&(n.includes("alt")||n.includes("sub"))||s&&o,a="Orijinal";n.includes("yerli")||e.inspection?.isYerli?a="Yerli":r?a="Dublaj / Altyaz\u0131l\u0131":s?a="Dublaj":o||n.includes("alt")||n.includes("sub")?a="Altyaz\u0131l\u0131":(n.includes("orijinal")||n.includes("yabanc\u0131")||n.includes("original"))&&(a="Orijinal");let f=e.format==="m3u8"||e.url.includes(".m3u8")||e.url.includes("/master.")||e.url.includes("/hls/")||e.url.includes("/txt/"),h=e.format||(f?"m3u8":e.url.includes(".mp4")?"mp4":"m3u8"),u=h==="m3u8"?"HLS":h.toUpperCase(),v=[i],g=e.codec||e.inspection?.detectedCodec||t.detectedCodec;g&&g!=="H.264"&&v.push(g),v.push(u),e.bitrate&&v.push(e.bitrate);let b=e.audio||e.inspection?.detectedAudio||t.detectedAudio;b&&b!=="AAC 2.0"&&v.push(b);let m=e.details||v.join(" \u2022 "),p=`${a}
${m}`,c=`${i} \u2022 ${a}`,k={name:"han's 41",provider:"han's 41",title:a,description:p,url:e.url,quality:c,format:h};return e.headers&&Object.keys(e.headers).length>0&&(k.headers=e.headers),l&&l.length>0&&(k.subtitles=l),k}var A="han's 41";function ke(e,t){let i=[];if(!e)return i;let l=e.split(",");for(let o of l){let n="",s=o.trim(),r=o.match(/\[(.*?)\](.*)/);r&&(n=r[1].trim(),s=r[2].trim());let a=(n+" "+s).toLowerCase(),f=a.includes("turk")||a.includes("t\xFCrk")||a.includes("_tur.")||a.includes("tr."),h=a.includes("eng")||a.includes("ing")||a.includes("_eng.")||a.includes("en."),u=f?"tr":"en",v=f?"Turkish":h?"English":n||"English",g=f?"T\xFCrk\xE7e":h?"\u0130ngilizce":n||"\u0130ngilizce",b=s.startsWith("http")?s:t+s;i.some(m=>m.url===b)||i.push({id:String(i.length),language:v,name:g,label:g,title:g,lang:u,url:b,type:"vtt",headers:{Referer:t+"/","User-Agent":C.DEFAULT_USER_AGENT}})}return i}async function ye(e,t){try{let i=await fetch(e,{headers:{"User-Agent":C.DEFAULT_USER_AGENT,Referer:t,Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"}});if(!i.ok)return null;let l=await i.text(),o=l.match(/jwplayer\([^)]*\)\.setup\(\s*(\{[\s\S]*?\})\s*\);/);if(o)try{let T=o[1],L=T.match(/file:\s*["']([^"']+)["']/);if(L){let S=L[1].replace(/\\\//g,"/"),D="";if(S.includes("url=")){let I=S.split("url=")[1];D=decodeURIComponent(I.split("&")[0])}else S.startsWith("http")?D=S:D=new URL(S,e).toString();let U=[];for(let I of T.matchAll(/file:\s*["']([^"']+\.vtt[^"']*)["'][\s\S]*?label:\s*["']([^"']+)["']/g)){let F=I[1].replace(/\\\//g,"/"),E=I[2];try{E=JSON.parse(`"${E.replace(/"/g,'\\"')}"`)}catch{E=E.replace(/\\u([0-9a-fA-F]{4})/g,(_e,te)=>String.fromCharCode(parseInt(te,16)))}let R=E.toLowerCase().includes("t\xFCrk")||E.toLowerCase().includes("tr");U.push({id:String(U.length),language:R?"Turkish":"English",name:R?"T\xFCrk\xE7e":E,label:R?"T\xFCrk\xE7e":E,title:R?"T\xFCrk\xE7e":E,lang:R?"tr":"en",url:F.startsWith("http")?F:new URL(F,e).toString(),type:"vtt",headers:{Referer:`${new URL(e).origin}/`,"User-Agent":C.DEFAULT_USER_AGENT}})}let O="";try{let I=await fetch(D,{headers:{"User-Agent":"okhttp/4.9.2",Referer:`${new URL(e).origin}/`}});I.ok&&(O=await I.text())}catch{}let ie=x({m3u8Text:O,m3u8Url:D,externalSubtitles:U});return{hlsUrl:D,inspection:ie,quality:"1080p",origin:new URL(e).origin}}}catch{}let n=l.match(/<iframe[^>]+src=["']([^"']+)["']/i);if(!n)return null;let s=n[1],r=new URL(s).origin,a=await fetch(s,{headers:{"User-Agent":C.DEFAULT_USER_AGENT,Referer:e,Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8","Sec-Fetch-Dest":"iframe","Sec-Fetch-Mode":"navigate","Sec-Fetch-Site":"cross-site"}});if(!a.ok)return null;let f=await a.text(),h=f.match(/fetch\(["'](\/dl\?[^"']+)["']\)/i);if(!h)return null;let u=f.match(/file_id['"],\s*['"](\d+)['"]/),b=[`file_id=${u?u[1]:""}`,"aff=1","ref_url=play.liderfilm.cc"].join("; "),m=r+h[1],p=await fetch(m,{headers:{"User-Agent":C.DEFAULT_USER_AGENT,Referer:s,Origin:r,Cookie:b,"X-Requested-With":"XMLHttpRequest",Accept:"application/json, text/javascript, */*; q=0.01","Sec-Fetch-Dest":"empty","Sec-Fetch-Mode":"cors","Sec-Fetch-Site":"same-origin"}});if(!p.ok)return null;let c=await p.json();if(!c||!c.url)return null;let k=[],d=f.match(/"subtitle":\s*["']([^"']+)["']/i);d&&(k=ke(d[1],r));let z="";try{let T=await fetch(c.url,{headers:{"User-Agent":"okhttp/4.9.2",Referer:r+"/",Origin:r},signal:AbortSignal.timeout?AbortSignal.timeout(4e3):void 0});T.ok&&(z=await T.text())}catch{}let y=x({m3u8Text:z,m3u8Url:c.url,externalSubtitles:k});return{hlsUrl:c.url,inspection:y,quality:"1080p",origin:r}}catch(i){return _(A,`Embed \xE7\xF6z\xFCmleme hatas\u0131: ${i.message}`,"error"),null}}async function ne(e,t,i=1,l=1){let o=Date.now();_(A,`[Ad\u0131m 1/4] Arama Ba\u015Flat\u0131ld\u0131: TMDB ID=${e}, T\xFCr=${t}, Sezon=${i}, B\xF6l\xFCm=${l}`,"info");try{let n=await W(e,t);if(!n)return _(A,"IMDb ID bulunamad\u0131, arama iptal edildi.","warn"),[];let s=await q("garling");if(!s)return _(A,"Alan ad\u0131 dinamik olarak \xE7\xF6z\xFClemedi.","error"),[];let r=`${s}/api/search.php?q=${encodeURIComponent(n)}`;_(A,`[Ad\u0131m 2/4] IMDb ile aran\u0131yor: ${n}`,"info");let a=await fetch(r,{headers:{"User-Agent":C.DEFAULT_USER_AGENT,"X-Requested-With":"XMLHttpRequest",Referer:s+"/",Accept:"application/json, text/javascript, */*; q=0.01"}});if(!a.ok)return _(A,`Arama ba\u015Far\u0131s\u0131z: HTTP ${a.status}`,"warn"),[];let h=(await a.json())?.results||[];if(h.length===0)return _(A,"\u0130\xE7erik bulunamad\u0131 (0 sonu\xE7).","info"),[];let u=t==="tv"||t==="series",v=u?"series":"movie",g=h.find(y=>y.matched_type==="imdb_id")||h.find(y=>y.type===v)||h[0];if(!g||!g.slug)return _(A,"E\u015Fle\u015Fen i\xE7erik slug bilgisi bulunamad\u0131.","warn"),[];_(A,`[Ad\u0131m 3/4] E\u015Fle\u015Fme bulundu: "${g.title}" (${g.slug})`,"info");let b=u?`${s}/dizi/${g.slug}/sezon-${i}/bolum-${l}`:`${s}/${g.slug}`,m=await fetch(b,{headers:{"User-Agent":C.DEFAULT_USER_AGENT,Referer:s+"/",Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"}});if(!m.ok)return _(A,`Sayfa y\xFCklenemedi: HTTP ${m.status}`,"warn"),[];let c=(await m.text()).match(/window\._vs\s*=\s*['"]([^'"]+)['"]/);if(!c)return _(A,"Oynat\u0131c\u0131 verisi (_vs) bulunamad\u0131.","warn"),[];let k=[];try{let y=atob(c[1]);k=(JSON.parse(y)||[]).filter(L=>L.url&&!L.url.includes("youtube.com"))}catch(y){return _(A,`_vs verisi \xE7\xF6z\xFCmlenemedi: ${y.message}`,"error"),[]}if(k.length===0)return _(A,"Kullan\u0131labilir video oynat\u0131c\u0131 bulunamad\u0131.","warn"),[];let d=[];for(let y of k){if(!y.url)continue;_(A,`Oynat\u0131c\u0131 \xE7\xF6z\xFCmleniyor: ${y.url}`,"info");let T=await ye(y.url,b);if(T&&T.hlsUrl){let L=ae({name:A,url:T.hlsUrl,inspection:T.inspection,quality:"1080p",format:"m3u8",headers:{Referer:T.origin+"/","User-Agent":C.DEFAULT_USER_AGENT},subtitles:T.inspection?.subtitles});d.push(L);break}}if(d.length===0)return _(A,"Video ak\u0131\u015F\u0131 \xE7\xF6z\xFCmlenemedi.","warn"),[];let z=((Date.now()-o)/1e3).toFixed(2);return _(A,`[Ad\u0131m 4/4] TAMAMLANDI: ${d.length} ak\u0131\u015F haz\u0131rland\u0131 (${z}s)`,"success",{stream:d[0].url,ba\u015Fl\u0131k:d[0].title,altyaz\u0131lar:d[0].subtitles?.length||0}),d}catch(n){return _(A,`Kritik Hata: ${n.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=ne);

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
