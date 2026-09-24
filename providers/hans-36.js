
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

"use strict";var D=Object.defineProperty;var ee=Object.getOwnPropertyDescriptor;var ae=Object.getOwnPropertyNames;var ne=Object.prototype.hasOwnProperty;var ie=(e,n)=>{for(var t in n)D(e,t,{get:n[t],enumerable:!0})},te=(e,n,t,o)=>{if(n&&typeof n=="object"||typeof n=="function")for(let s of ae(n))!ne.call(e,s)&&s!==t&&D(e,s,{get:()=>n[s],enumerable:!(o=ee(n,s))||o.enumerable});return e};var se=e=>te(D({},"__esModule",{value:!0}),e);var pe={};ie(pe,{default:()=>he,getStreams:()=>B});module.exports=se(pe);var oe=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(n=>String.fromCharCode(n^42)).join(""),le={REMOTE_CONFIG_URL:oe,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},z=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},F="__NUVIO_CONFIG_CACHE__",M=60*60*1e3,j=2*60*1e3;if(!z.__NUVIO_CONFIG_STATE__){z.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null};try{if(typeof localStorage<"u"&&localStorage&&typeof localStorage.getItem=="function"){let e=localStorage.getItem(F);if(e){let n=JSON.parse(e);n&&n.timestamp&&Date.now()-n.timestamp<M&&(n.domains&&typeof n.domains=="object"&&(z.__NUVIO_CONFIG_STATE__.cachedDomains=n.domains),n.cookies&&typeof n.cookies=="object"&&(z.__NUVIO_CONFIG_STATE__.cachedCookies=n.cookies),Array.isArray(n.tmdbKeys)&&n.tmdbKeys.length>0&&(z.__NUVIO_CONFIG_STATE__.cachedTmdbKeys=n.tmdbKeys),z.__NUVIO_CONFIG_STATE__.lastFetchTime=n.timestamp)}}}catch{}}var T=z.__NUVIO_CONFIG_STATE__;function re(e){try{typeof localStorage<"u"&&localStorage&&typeof localStorage.setItem=="function"&&localStorage.setItem(F,JSON.stringify({timestamp:e,domains:T.cachedDomains,cookies:T.cachedCookies,tmdbKeys:T.cachedTmdbKeys}))}catch{}}async function ce(){let e=Date.now();try{let n={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let o=AbortSignal.timeout(8e3);o&&(n.signal=o)}catch{}let t=await fetch(le.REMOTE_CONFIG_URL,n);if(t.ok){let o=await t.json(),s=o?.data??o,i=s.domains||s,l=s.cookies,c=s.tmdb_keys||s.tmdbKeys;i&&typeof i=="object"&&(T.cachedDomains={...T.cachedDomains,...i}),l&&typeof l=="object"&&(T.cachedCookies={...T.cachedCookies,...l}),Array.isArray(c)&&c.length>0&&(T.cachedTmdbKeys=c),T.lastFetchTime=e,re(e)}else T.lastFetchTime=e-M+j}catch{T.lastFetchTime=e-M+j}}async function R(){let e=Date.now();(!(Object.keys(T.cachedDomains).length>0)||e-T.lastFetchTime>M)&&(T.activeFetchPromise||(T.activeFetchPromise=ce().finally(()=>{T.activeFetchPromise=null})),await T.activeFetchPromise)}async function O(e){return await R(),T.cachedDomains[e]||""}async function K(){return await R(),T.cachedTmdbKeys||[]}var ue="a2f888b27315e62e471b2d587048f32e",U=[ue,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function E(e){let n=await K(),t=n.length>0?[...n,...U]:U;for(let o=0;o<t.length;o++){let s=t[o],i=e.includes("?")?"&":"?",l=`https://api.themoviedb.org/3/${e}${i}api_key=${s}`;try{let c=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,a=await fetch(l,{signal:c});if(a.ok)return await a.json();if(a.status===429)continue}catch{}}return null}var N=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};N.__NUVIO_TMDB_CACHE__||(N.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var I=N.__NUVIO_TMDB_CACHE__,G=I.imdbIdCache,ye=I.tmdbTitlesCache,Te=I.tmdbImageCache,_e=I.episodeGroupCache,ve=I.absoluteEpCache;async function $(e,n){let t=String(e||"").replace(/^tmdb:/i,"").trim();if(!t)return null;if(t.startsWith("tt"))return t;let o=`${n}:${t}`;if(G.has(o))return G.get(o);let s=(async()=>{try{let l=await E(`${n==="tv"||n==="series"?"tv":"movie"}/${t}/external_ids`);if(l&&l.imdb_id)return l.imdb_id}catch{}return null})();return G.set(o,s),s}function v(e,n,t="info",o){let s=`[${e}]`;t==="error"?console.error(s,n,o||""):t==="warn"?console.warn(s,n,o||""):console.log(s,n,o||"");try{let l=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof l=="string"&&l.startsWith("http")&&fetch(l,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:t,message:n,details:o})}).catch(()=>{})}catch{}}var ge=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],x=["tr","tur","ota"],de=["english","ingilizce","original","orijinal","audio-en"],H=["en","eng","und"];function Y(e,n){let t=!1,o=!1,s=[],i,l,c,a=(n||"").toLowerCase();if(a.includes("trdual")||a.includes("dual")||a.includes("trdub")||a.includes("dublaj")?(t=!0,o=!0):(a.includes("ses-tr")||a.includes("turkcedublaj")||a.includes("turkce-dublaj"))&&(t=!0),a.includes("2160p")||a.includes("4k")||a.includes("uhd")?i="4K":a.includes("1080p")||a.includes("1920x1080")||a.includes("fhd")?i="1080p":a.includes("720p")||a.includes("1280x720")||a.includes("hd")?i="720p":(a.includes("480p")||a.includes("854x480")||a.includes("sd"))&&(i="480p"),a.includes("hevc")||a.includes("h265")||a.includes("x265")?l="HEVC":a.includes("av1")?l="AV1":(a.includes("h264")||a.includes("x264")||a.includes("avc"))&&(l="H.264"),a.includes("5.1")||a.includes("eac3")||a.includes("ac3")||a.includes("ddp")?c="Dolby 5.1":(a.includes("7.1")||a.includes("atmos"))&&(c="Dolby Atmos 7.1"),e&&typeof e=="string"){let f=e.split(/\r?\n/),d=0;for(let _ of f){let p=_.trim();if(p.startsWith("#EXT-X-MEDIA:")&&p.includes("TYPE=AUDIO")){let k=p.match(/NAME=["']([^"']+)["']/i),m=p.match(/LANGUAGE=["']([^"']+)["']/i),u=p.match(/GROUP-ID=["']([^"']+)["']/i),r=(k?k[1]:"").toLowerCase(),b=(m?m[1]:"").toLowerCase(),h=(u?u[1]:"").toLowerCase(),C=r.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),A=h.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),S=x.includes(b)||x.some(y=>C.includes(y)||A.includes(y))||ge.some(y=>r.includes(y)||h.includes(y))||r.includes("t\xFCrk")||r.includes("turk")||h.includes("dual"),P=H.includes(b)||H.some(y=>C.includes(y)||A.includes(y))||de.some(y=>r.includes(y)||h.includes(y))||r.includes("orig")||r.includes("ing")||r.includes("eng");S&&(t=!0),P&&(o=!0)}if(p.startsWith("#EXT-X-MEDIA:")&&p.includes("TYPE=SUBTITLES")){let k=p.match(/URI=["']([^"']+)["']/i),m=p.match(/NAME=["']([^"']+)["']/i),u=p.match(/LANGUAGE=["']([^"']+)["']/i);if(k&&k[1]){let r=k[1];if(n&&!r.startsWith("http"))try{r=new URL(r,n).toString()}catch{}let b=m?m[1]:"Altyaz\u0131",h=u?u[1].toLowerCase():"";h==="st"||h==="sot"||b.toLowerCase().includes("sotho")||b.toLowerCase().includes("sesotho")||r.toLowerCase().includes("sub_st")?(h="tr",b="T\xFCrk\xE7e"):h||(h=b.toLowerCase().includes("t\xFCrk")?"tr":"und");let A=V(h,b);s.push({label:A.name||b,url:r,lang:A.code||h})}}if(p.startsWith("#EXT-X-STREAM-INF:")){let k=p.match(/RESOLUTION=(\d+)x(\d+)/i);if(k){let m=parseInt(k[1],10),u=parseInt(k[2],10),r=Math.min(m,u),b=Math.max(m,u),h=r>=2100||b>=3800?2160:r>=1400||b>=2500?1440:r>=1e3||b>=1900?1080:r>=700||b>=1200?720:r>=450?480:r;h>d&&(d=h)}else{let m=p.match(/NAME=["']?([^"',\s]+)["']?/i);if(m){let u=m[1].toLowerCase();u.includes("2160")||u.includes("4k")?2160>d&&(d=2160):u.includes("1440")||u.includes("2k")?1440>d&&(d=1440):u.includes("1080")?1080>d&&(d=1080):u.includes("720")&&720>d&&(d=720)}}}}d>=2160?i="4K":d>=1440?i="2K":d>=1080?i="1080p":d>=720?i="720p":d>=480&&(i="480p")}let g=t&&o||a.includes("dual")||a.includes("trdual");return{hasTurkishAudio:t,hasOriginalAudio:o,isDual:g,embeddedSubtitles:s,detectedQuality:i,detectedCodec:l,detectedAudio:c}}function me(e){let{hasTurkishAudio:n,hasOriginalAudio:t,isDual:o,hasSubtitles:s,hasTurkishSubtitles:i,isYerli:l,siteHint:c,defaultTitle:a}=e;if(l||c?.isYerli)return"Yerli";if(c?.label){let g=c.label.toLowerCase();if((g.includes("dub")||g.includes("t\xFCrk"))&&(g.includes("alt")||g.includes("sub")))return"Dublaj / Altyaz\u0131l\u0131";if(g.includes("dub")||g.includes("t\xFCrk\xE7e ses"))return"Dublaj";if(g.includes("alt")||g.includes("sub"))return"Altyaz\u0131l\u0131";if(g.includes("orijinal")||g.includes("original"))return"Orijinal"}return o||n&&(t||i)?"Dublaj / Altyaz\u0131l\u0131":n||c?.isDublaj?"Dublaj":i||c?.isAltyazi?"Altyaz\u0131l\u0131":a||(n?"Dublaj":"Orijinal")}var w={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function V(e,n,t){let o=u=>(u||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),s=o(e||""),i=o(n||""),l=!!t||s.includes("forced")||i.includes("forced")||s.includes("zorunlu")||i.includes("zorunlu"),c=s.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),a=i.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),g=u=>{let r=u.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return l?`${r} (Zorunlu)`:r};if(c==="st"||c==="sot"||c.includes("sotho")||a.includes("sotho")||a.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:l?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let f=w[s]||w[i]||w[c]||w[a];if(!f){let u=(a+" "+c).split(/\s+/).filter(Boolean);for(let r of u)if(w[r]){f=w[r];break}}if(!f){for(let[u,r]of Object.entries(w))if(u.length>=4&&(a.includes(u)||c.includes(u))){f=r;break}}if(f)return{code:f.code,iso3:f.iso3,language:f.language,name:g(f.name)};let d=(n||e||"Altyaz\u0131").trim();d=d.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let _=d.charAt(0).toUpperCase()+d.slice(1),p=g(_),k=s&&s.length===2?s:i&&i.length===2?i:"und",m=s&&s.length===3?s:i&&i.length===3?i:"und";return{code:k,iso3:m,language:_,name:p}}function q(e,n){let t=[],o=new Set,s=[...e||[],...n||[]];for(let i of s){if(!i||!i.url)continue;let l=i.url.trim();if(o.has(l))continue;o.add(l);let c=V(i.lang,i.label||i.name||i.language),a=c.name||i.label||i.name||"Altyaz\u0131";t.push({id:String(t.length),url:l,label:a,name:a,language:c.language,lang:c.code,langCode:c.iso3,headers:i.headers})}return t}function W(e){let{m3u8Text:n,m3u8Url:t,externalSubtitles:o,siteHint:s,defaultTitle:i}=e,l=Y(n,t),c=q(o),a=q(o,l.embeddedSubtitles),g=a.length>0||!!s?.isAltyazi,f=a.some(m=>m.lang==="tr"||m.lang==="st"||m.lang==="sot"||m.langCode==="tur"||m.langCode==="sot"||m.label?.toLowerCase().includes("t\xFCrk")||m.label?.toLowerCase().includes("sotho")||m.language==="Turkish"||m.language?.toLowerCase().includes("sotho")),d=l.hasTurkishAudio||!!s?.isDublaj,_=l.hasOriginalAudio,p=l.isDual||d&&(f||_),k=me({hasTurkishAudio:d,hasOriginalAudio:_,isDual:p,hasSubtitles:g,hasTurkishSubtitles:f,isYerli:s?.isYerli,siteHint:s,defaultTitle:i});return{hasTurkishAudio:d,hasOriginalAudio:_,isDual:p,hasSubtitles:g,hasTurkishSubtitles:f,isYerli:s?.isYerli,languageTitle:k,subtitles:c,detectedQuality:l.detectedQuality,detectedCodec:l.detectedCodec,detectedAudio:l.detectedAudio}}function J(e){let n=e.url?Y(void 0,e.url):{},t=e.quality||e.inspection?.detectedQuality||n.detectedQuality||"1080p";t.includes("\u2022")&&(t=t.split("\u2022")[0].trim()),!t.includes("p")&&!t.includes("K")&&!t.includes("k")&&(t=`${t}p`);let o=e.subtitles||e.inspection?.subtitles,s=!!(e.inspection?.hasTurkishSubtitles||o?.some(h=>{let C=(h.lang||h.code||"").toLowerCase(),A=(h.langCode||h.iso3||"").toLowerCase(),S=(h.name||h.label||h.title||"").toLowerCase();return C==="tr"||C==="st"||A==="tur"||A==="sot"||S.includes("t\xFCrk")||S.includes("turk")||S.includes("sotho")})),i=(e.languageTitle||e.inspection?.languageTitle||"").toLowerCase().trim(),l=i.includes("dub")||i.includes("ses")||i.includes("dual")||!!n.hasTurkishAudio||!!e.inspection?.hasTurkishAudio,c=i.includes("dual")||i.includes("dub")&&(i.includes("alt")||i.includes("sub"))||l&&s,a="Orijinal";i.includes("yerli")||e.inspection?.isYerli?a="Yerli":c?a="Dublaj / Altyaz\u0131l\u0131":l?a="Dublaj":s||i.includes("alt")||i.includes("sub")?a="Altyaz\u0131l\u0131":(i.includes("orijinal")||i.includes("yabanc\u0131")||i.includes("original"))&&(a="Orijinal");let g=e.format==="m3u8"||e.url.includes(".m3u8")||e.url.includes("/master.")||e.url.includes("/hls/")||e.url.includes("/txt/"),f=e.format||(g?"m3u8":e.url.includes(".mp4")?"mp4":"m3u8"),d=f==="m3u8"?"HLS":f.toUpperCase(),_=[t],p=e.codec||e.inspection?.detectedCodec||n.detectedCodec;p&&p!=="H.264"&&_.push(p),_.push(d),e.bitrate&&_.push(e.bitrate);let k=e.audio||e.inspection?.detectedAudio||n.detectedAudio;k&&k!=="AAC 2.0"&&_.push(k);let m=e.details||_.join(" \u2022 "),u=`${a}
${m}`,r=`${t} \u2022 ${a}`,b={name:"han's 36",provider:"han's 36",title:a,description:u,url:e.url,quality:r,format:f};return e.headers&&Object.keys(e.headers).length>0&&(b.headers=e.headers),o&&o.length>0&&(b.subtitles=o),b}var L=[104,116,116,112,115,58,47,47,110,101,120,116,103,101,110,99,108,111,117,100,102,97,98,114,105,99,46,99,111,109].map(e=>String.fromCharCode(e)).join(""),Q="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";async function B(e,n,t,o){let s=Date.now(),i=String(n||"").toLowerCase().trim(),l=i==="tv"||i==="series"||i==="show",c=l?"tv":"movie",a=String(e||"").replace(/^tmdb:/i,"").trim();if(!a)return[];v("han's 36",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${a}, T\xFCr: ${c}, Sezon: ${t}, B\xF6l\xFCm: ${o}`);try{if(l&&/^\d+$/.test(a))try{let y=await E(`tv/${a}?language=tr-TR`);if(y){let X=Array.isArray(y?.origin_country)?y.origin_country:[],Z=(y?.original_language||"").toLowerCase();if(X.includes("TR")&&Z==="tr")return v("han's 36",`Yerli T\xFCrk dizisi tespit edildi (${y?.name}), atland\u0131.`,"info"),[]}}catch{}v("han's 36",`[Ad\u0131m 1/3] IMDb ID \xE7\xF6z\xFCmleniyor (${a})...`);let g=await $(a,c);if(!g||!g.startsWith("tt"))return v("han's 36","IMDb kimli\u011Fi bulunamad\u0131.","warn"),[];let f=await O("gaban");if(!f)return v("han's 36","Domain not resolved","warn"),[];let d=t?Math.max(1,Number(t)):1,_=o?Math.max(1,Number(o)):1;v("han's 36","[Ad\u0131m 2/3] API sorgulan\u0131yor...");let p=l?`${f}/api.php?imdb=${encodeURIComponent(g)}&type=tv&season=${d}&episode=${_}`:`${f}/api.php?imdb=${encodeURIComponent(g)}&type=movie`,k=l?`${L}/embed/tv/${g}/${d}/${_}`:`${L}/embed/movie/${g}`,m=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(6e3):void 0,u=await fetch(p,{signal:m,headers:{"User-Agent":Q,Referer:k,Origin:L,Accept:"application/json, text/plain, */*"}});if(!u.ok)return v("han's 36",`API HTTP hatas\u0131: ${u.status}`,"warn"),[];let r=await u.json();if(r?.status_code!=="200"&&r?.status_code!==200)return v("han's 36",`API ge\xE7ersiz yan\u0131t d\xF6nd\xFC: ${r?.status_code}`,"warn"),[];let b=Array.isArray(r?.data?.stream_urls)?r.data.stream_urls:[];if(b.length===0)return v("han's 36","Video ak\u0131\u015F\u0131 bulunamad\u0131.","warn"),[];let h={Referer:`${L}/`,Origin:L,"User-Agent":Q},C=W({m3u8Url:b[0],siteHint:{isDublaj:!1,isAltyazi:!1,label:"Orijinal"}}),S=[J({name:"han's 36",url:b[0].trim(),inspection:C,quality:"1080p",format:"m3u8",headers:h})],P=((Date.now()-s)/1e3).toFixed(2);return v("han's 36",`[Ad\u0131m 3/3] TAMAMLANDI: 1 ak\u0131\u015F haz\u0131rland\u0131 (${P}s)`,"success",S.map(y=>({title:y.title,quality:y.quality||"1080p",format:"m3u8"}))),S}catch(g){return v("han's 36",`Hata: ${g.message||"Scrape error"}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=B);var he={getStreams:B};

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
