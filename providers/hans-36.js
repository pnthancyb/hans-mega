
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

"use strict";var D=Object.defineProperty;var Z=Object.getOwnPropertyDescriptor;var ee=Object.getOwnPropertyNames;var ae=Object.prototype.hasOwnProperty;var ne=(a,s)=>{for(var i in s)D(a,i,{get:s[i],enumerable:!0})},ie=(a,s,i,t)=>{if(s&&typeof s=="object"||typeof s=="function")for(let o of ee(s))!ae.call(a,o)&&o!==i&&D(a,o,{get:()=>s[o],enumerable:!(t=Z(s,o))||t.enumerable});return a};var se=a=>ie(D({},"__esModule",{value:!0}),a);var me={};ne(me,{default:()=>de,getStreams:()=>E});module.exports=se(me);function v(a,s,i="info",t){let o=`[${a}]`;i==="error"?console.error(o,s,t||""):i==="warn"?console.warn(o,s,t||""):console.log(o,s,t||"");try{let l=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof l=="string"&&l.startsWith("http")&&fetch(l,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:a,level:i,message:s,details:t})}).catch(()=>{})}catch{}}var te=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(s=>String.fromCharCode(s^42)).join(""),oe={REMOTE_CONFIG_URL:te,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},L=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};try{typeof localStorage<"u"&&localStorage&&typeof localStorage.removeItem=="function"&&(localStorage.removeItem("__NUVIO_CONFIG_CACHE__"),localStorage.removeItem("__NUVIO_CONFIG_CACHE_V2__"))}catch{}var N=10*1e3,le=10*1e3;L.__NUVIO_CONFIG_STATE__||(L.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var _=L.__NUVIO_CONFIG_STATE__;async function j(){let a=Date.now(),s=[];try{let i=L.__NUVIO_DEV_LOG_URL__;typeof i=="string"&&i.includes("/api/log")&&s.push(i.replace("/api/log","/domains"))}catch{}s.push(oe.REMOTE_CONFIG_URL);for(let i of s)try{let t=await fetch(i);if(t.ok){let o=await t.json(),n=o?.data??o,l=n.domains||n,c=n.cookies,e=n.tmdb_keys||n.tmdbKeys;l&&typeof l=="object"&&(_.cachedDomains={..._.cachedDomains,...l}),c&&typeof c=="object"&&(_.cachedCookies={..._.cachedCookies,...c}),Array.isArray(e)&&e.length>0&&(_.cachedTmdbKeys=e),_.lastFetchTime=a;return}}catch(t){v("Config",`Domain alinamadi (${i}): ${t.message}`,"warn")}_.lastFetchTime=a-N+le}async function R(){let a=Date.now();(!(Object.keys(_.cachedDomains).length>0)||a-_.lastFetchTime>N)&&(_.activeFetchPromise||(_.activeFetchPromise=j().finally(()=>{_.activeFetchPromise=null})),await _.activeFetchPromise)}async function F(a){return await R(),_.cachedDomains[a]||await j(),_.cachedDomains[a]||""}async function O(){return await R(),_.cachedTmdbKeys||[]}var re="a2f888b27315e62e471b2d587048f32e",$=[re,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function G(a){let s=await O(),i=s.length>0?[...s,...$]:$;for(let t=0;t<i.length;t++){let o=i[t],n=a.includes("?")?"&":"?",l=`https://api.themoviedb.org/3/${a}${n}api_key=${o}`;try{let c=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,e=await fetch(l,{signal:c});if(e.ok)return await e.json();if(e.status===429)continue}catch{}}return null}var B=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};B.__NUVIO_TMDB_CACHE__||(B.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var w=B.__NUVIO_TMDB_CACHE__,P=w.imdbIdCache,ye=w.tmdbTitlesCache,Te=w.tmdbImageCache,_e=w.episodeGroupCache,ve=w.absoluteEpCache;async function U(a,s){let i=String(a||"").replace(/^tmdb:/i,"").trim();if(!i)return null;if(i.startsWith("tt"))return i;let t=`${s}:${i}`;if(P.has(t))return P.get(t);let o=(async()=>{try{let l=await G(`${s==="tv"||s==="series"?"tv":"movie"}/${i}/external_ids`);if(l&&l.imdb_id)return l.imdb_id}catch{}return null})();return P.set(t,o),o}var ce=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],K=["tr","tur","ota"],ue=["english","ingilizce","original","orijinal","audio-en"],x=["en","eng","und"];function q(a,s){let i=!1,t=!1,o=[],n,l,c,e=(s||"").toLowerCase();if(e.includes("trdual")||e.includes("dual")||e.includes("trdub")||e.includes("dublaj")?(i=!0,t=!0):(e.includes("ses-tr")||e.includes("turkcedublaj")||e.includes("turkce-dublaj"))&&(i=!0),e.includes("2160p")||e.includes("4k")||e.includes("uhd")||e.includes("-2160.")?n="4K":e.includes("1080p")||e.includes("1920x1080")||e.includes("fhd")||e.includes("-1080.")?n="1080p":e.includes("720p")||e.includes("1280x720")||e.includes("hd")||e.includes("-720.")?n="720p":e.includes("480p")||e.includes("854x480")||e.includes("sd")||e.includes("-480.")?n="480p":(e.includes("360p")||e.includes("640x360")||e.includes("-360."))&&(n="360p"),e.includes("hevc")||e.includes("h265")||e.includes("x265")?l="HEVC":e.includes("av1")?l="AV1":(e.includes("h264")||e.includes("x264")||e.includes("avc"))&&(l="H.264"),e.includes("5.1")||e.includes("eac3")||e.includes("ac3")||e.includes("ddp")?c="Dolby 5.1":(e.includes("7.1")||e.includes("atmos"))&&(c="Dolby Atmos 7.1"),a&&typeof a=="string"){let f=a.split(/\r?\n/),d=0;for(let T of f){let p=T.trim();if(p.startsWith("#EXT-X-MEDIA:")&&p.includes("TYPE=AUDIO")){let k=p.match(/NAME=["']([^"']+)["']/i),m=p.match(/LANGUAGE=["']([^"']+)["']/i),u=p.match(/GROUP-ID=["']([^"']+)["']/i),r=(k?k[1]:"").toLowerCase(),b=(m?m[1]:"").toLowerCase(),h=(u?u[1]:"").toLowerCase(),C=r.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),A=h.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),z=K.includes(b)||K.some(y=>C.includes(y)||A.includes(y))||ce.some(y=>r.includes(y)||h.includes(y))||r.includes("t\xFCrk")||r.includes("turk")||h.includes("dual"),M=x.includes(b)||x.some(y=>C.includes(y)||A.includes(y))||ue.some(y=>r.includes(y)||h.includes(y))||r.includes("orig")||r.includes("ing")||r.includes("eng");z&&(i=!0),M&&(t=!0)}if(p.startsWith("#EXT-X-MEDIA:")&&p.includes("TYPE=SUBTITLES")){let k=p.match(/URI=["']([^"']+)["']/i),m=p.match(/NAME=["']([^"']+)["']/i),u=p.match(/LANGUAGE=["']([^"']+)["']/i);if(k&&k[1]){let r=k[1];if(s&&!r.startsWith("http"))try{r=new URL(r,s).toString()}catch{}let b=m?m[1]:"Altyaz\u0131",h=u?u[1].toLowerCase():"";h==="st"||h==="sot"||b.toLowerCase().includes("sotho")||b.toLowerCase().includes("sesotho")||r.toLowerCase().includes("sub_st")?(h="tr",b="T\xFCrk\xE7e"):h||(h=b.toLowerCase().includes("t\xFCrk")?"tr":"und");let A=Y(h,b);o.push({label:A.name||b,url:r,lang:A.code||h})}}if(p.startsWith("#EXT-X-STREAM-INF:")){let k=p.match(/RESOLUTION=(\d+)x(\d+)/i);if(k){let m=parseInt(k[1],10),u=parseInt(k[2],10),r=Math.min(m,u),b=Math.max(m,u),h=r>=2100||b>=3800?2160:r>=1400||b>=2500?1440:r>=1e3||b>=1900?1080:r>=700||b>=1200?720:r>=450?480:r;h>d&&(d=h)}else{let m=p.match(/NAME=["']?([^"',\s]+)["']?/i);if(m){let u=m[1].toLowerCase();u.includes("2160")||u.includes("4k")?2160>d&&(d=2160):u.includes("1440")||u.includes("2k")?1440>d&&(d=1440):u.includes("1080")?1080>d&&(d=1080):u.includes("720")&&720>d&&(d=720)}}}}d>=2160?n="4K":d>=1440?n="2K":d>=1080?n="1080p":d>=720?n="720p":d>=480&&(n="480p")}let g=i&&t||e.includes("dual")||e.includes("trdual");return{hasTurkishAudio:i,hasOriginalAudio:t,isDual:g,embeddedSubtitles:o,detectedQuality:n,detectedCodec:l,detectedAudio:c}}function ge(a){let{hasTurkishAudio:s,hasOriginalAudio:i,isDual:t,hasSubtitles:o,hasTurkishSubtitles:n,isYerli:l,siteHint:c,defaultTitle:e}=a;if(l||c?.isYerli)return"Yerli";if(c?.label){let g=c.label.toLowerCase();if((g.includes("dub")||g.includes("t\xFCrk"))&&(g.includes("alt")||g.includes("sub")))return"Dublaj / Altyaz\u0131l\u0131";if(g.includes("dub")||g.includes("t\xFCrk\xE7e ses"))return"Dublaj";if(g.includes("alt")||g.includes("sub"))return"Altyaz\u0131l\u0131";if(g.includes("orijinal")||g.includes("original"))return"Orijinal"}return t||s&&(i||n)?"Dublaj / Altyaz\u0131l\u0131":s||c?.isDublaj?"Dublaj":n||c?.isAltyazi?"Altyaz\u0131l\u0131":e||(s?"Dublaj":"Orijinal")}var S={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function Y(a,s,i){let t=u=>(u||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),o=t(a||""),n=t(s||""),l=!!i||o.includes("forced")||n.includes("forced")||o.includes("zorunlu")||n.includes("zorunlu"),c=o.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),e=n.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),g=u=>{let r=u.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return l?`${r} (Zorunlu)`:r};if(c==="st"||c==="sot"||c.includes("sotho")||e.includes("sotho")||e.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:l?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let f=S[o]||S[n]||S[c]||S[e];if(!f){let u=(e+" "+c).split(/\s+/).filter(Boolean);for(let r of u)if(S[r]){f=S[r];break}}if(!f){for(let[u,r]of Object.entries(S))if(u.length>=4&&(e.includes(u)||c.includes(u))){f=r;break}}if(f)return{code:f.code,iso3:f.iso3,language:f.language,name:g(f.name)};let d=(s||a||"Altyaz\u0131").trim();d=d.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let T=d.charAt(0).toUpperCase()+d.slice(1),p=g(T),k=o&&o.length===2?o:n&&n.length===2?n:"und",m=o&&o.length===3?o:n&&n.length===3?n:"und";return{code:k,iso3:m,language:T,name:p}}function H(a,s){let i=[],t=new Set,o=[...a||[],...s||[]];for(let n of o){if(!n||!n.url)continue;let l=n.url.trim();if(t.has(l))continue;t.add(l);let c=Y(n.lang,n.label||n.name||n.language),e=c.name||n.label||n.name||"Altyaz\u0131";i.push({id:String(i.length),url:l,label:e,name:e,language:c.language,lang:c.code,langCode:c.iso3,headers:n.headers})}return i}function V(a){let{m3u8Text:s,m3u8Url:i,externalSubtitles:t,siteHint:o,defaultTitle:n}=a,l=q(s,i),c=H(t),e=H(t,l.embeddedSubtitles),g=e.length>0||!!o?.isAltyazi,f=e.some(m=>m.lang==="tr"||m.lang==="st"||m.lang==="sot"||m.langCode==="tur"||m.langCode==="sot"||m.label?.toLowerCase().includes("t\xFCrk")||m.label?.toLowerCase().includes("sotho")||m.language==="Turkish"||m.language?.toLowerCase().includes("sotho")),d=l.hasTurkishAudio||!!o?.isDublaj,T=l.hasOriginalAudio,p=l.isDual||d&&(f||T),k=ge({hasTurkishAudio:d,hasOriginalAudio:T,isDual:p,hasSubtitles:g,hasTurkishSubtitles:f,isYerli:o?.isYerli,siteHint:o,defaultTitle:n});return{hasTurkishAudio:d,hasOriginalAudio:T,isDual:p,hasSubtitles:g,hasTurkishSubtitles:f,isYerli:o?.isYerli,languageTitle:k,subtitles:c,detectedQuality:l.detectedQuality,detectedCodec:l.detectedCodec,detectedAudio:l.detectedAudio}}function W(a){let s=a.url?q(void 0,a.url):{},i=a.quality||a.inspection?.detectedQuality||s.detectedQuality||"1080p";i.includes("\u2022")&&(i=i.split("\u2022")[0].trim()),!i.includes("p")&&!i.includes("K")&&!i.includes("k")&&i!=="HD"&&i!=="FHD"&&i!=="SD"&&(i=`${i}p`);let t=a.subtitles||a.inspection?.subtitles,o=!!(a.inspection?.hasTurkishSubtitles||t?.some(h=>{let C=(h.lang||h.code||"").toLowerCase(),A=(h.langCode||h.iso3||"").toLowerCase(),z=(h.name||h.label||h.title||"").toLowerCase();return C==="tr"||C==="st"||A==="tur"||A==="sot"||z.includes("t\xFCrk")||z.includes("turk")||z.includes("sotho")})),n=(a.languageTitle||a.inspection?.languageTitle||"").toLowerCase().trim(),l=n.includes("dub")||n.includes("ses")||n.includes("dual")||!!s.hasTurkishAudio||!!a.inspection?.hasTurkishAudio,c=n.includes("dual")||n.includes("dub")&&(n.includes("alt")||n.includes("sub"))||l&&o,e="Orijinal";n.includes("yerli")||a.inspection?.isYerli?e="Yerli":c?e="Dublaj / Altyaz\u0131l\u0131":l?e="Dublaj":o||n.includes("alt")||n.includes("sub")?e="Altyaz\u0131l\u0131":(n.includes("orijinal")||n.includes("yabanc\u0131")||n.includes("original"))&&(e="Orijinal");let g=a.format==="m3u8"||a.url.includes(".m3u8")||a.url.includes("/master.")||a.url.includes("/hls/")||a.url.includes("/txt/"),f=a.format||(g?"m3u8":a.url.includes(".mp4")?"mp4":"m3u8"),d=f==="m3u8"?"HLS":f.toUpperCase(),T=[i],p=a.codec||a.inspection?.detectedCodec||s.detectedCodec;p&&p!=="H.264"&&T.push(p),T.push(d),a.bitrate&&T.push(a.bitrate);let k=a.audio||a.inspection?.detectedAudio||s.detectedAudio;k&&k!=="AAC 2.0"&&T.push(k);let m=a.details||T.join(" \u2022 "),u=`${e}
${m}`,r=`${i} \u2022 ${e}`,b={name:"han's 36",provider:"han's 36",title:e,description:u,url:a.url,quality:r,format:f};return a.headers&&Object.keys(a.headers).length>0&&(b.headers=a.headers),t&&t.length>0&&(b.subtitles=t),b}var I=[104,116,116,112,115,58,47,47,110,101,120,116,103,101,110,99,108,111,117,100,102,97,98,114,105,99,46,99,111,109].map(a=>String.fromCharCode(a)).join(""),J="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";async function E(a,s,i,t){let o=Date.now(),n=String(s||"").toLowerCase().trim(),l=n==="tv"||n==="series"||n==="show",c=l?"tv":"movie",e=String(a||"").replace(/^tmdb:/i,"").trim();if(!e)return[];v("han's 36",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${e}, T\xFCr: ${c}, Sezon: ${i}, B\xF6l\xFCm: ${t}`);try{if(l&&/^\d+$/.test(e))try{let y=await G(`tv/${e}?language=tr-TR`);if(y){let Q=Array.isArray(y?.origin_country)?y.origin_country:[],X=(y?.original_language||"").toLowerCase();if(Q.includes("TR")&&X==="tr")return v("han's 36",`Yerli T\xFCrk dizisi tespit edildi (${y?.name}), atland\u0131.`,"info"),[]}}catch{}v("han's 36",`[Ad\u0131m 1/3] IMDb ID \xE7\xF6z\xFCmleniyor (${e})...`);let g=await U(e,c);if(!g||!g.startsWith("tt"))return v("han's 36","IMDb kimli\u011Fi bulunamad\u0131.","warn"),[];let f=await F("gaban");if(!f)return v("han's 36","Domain not resolved","warn"),[];let d=i?Math.max(1,Number(i)):1,T=t?Math.max(1,Number(t)):1;v("han's 36","[Ad\u0131m 2/3] API sorgulan\u0131yor...");let p=l?`${f}/api.php?imdb=${encodeURIComponent(g)}&type=tv&season=${d}&episode=${T}`:`${f}/api.php?imdb=${encodeURIComponent(g)}&type=movie`,k=l?`${I}/embed/tv/${g}/${d}/${T}`:`${I}/embed/movie/${g}`,m=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(6e3):void 0,u=await fetch(p,{signal:m,headers:{"User-Agent":J,Referer:k,Origin:I,Accept:"application/json, text/plain, */*"}});if(!u.ok)return v("han's 36",`API HTTP hatas\u0131: ${u.status}`,"warn"),[];let r=await u.json();if(r?.status_code!=="200"&&r?.status_code!==200)return v("han's 36",`API ge\xE7ersiz yan\u0131t d\xF6nd\xFC: ${r?.status_code}`,"warn"),[];let b=Array.isArray(r?.data?.stream_urls)?r.data.stream_urls:[];if(b.length===0)return v("han's 36","Video ak\u0131\u015F\u0131 bulunamad\u0131.","warn"),[];let h={Referer:`${I}/`,Origin:I,"User-Agent":J},C=V({m3u8Url:b[0],siteHint:{isDublaj:!1,isAltyazi:!1,label:"Orijinal"}}),z=[W({name:"han's 36",url:b[0].trim(),inspection:C,quality:"1080p",format:"m3u8",headers:h})],M=((Date.now()-o)/1e3).toFixed(2);return v("han's 36",`[Ad\u0131m 3/3] TAMAMLANDI: 1 ak\u0131\u015F haz\u0131rland\u0131 (${M}s)`,"success",z.map(y=>({title:y.title,quality:y.quality||"1080p",format:"m3u8"}))),z}catch(g){return v("han's 36",`Hata: ${g.message||"Scrape error"}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=E);var de={getStreams:E};

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

;(()=>{const n="han's 36",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
