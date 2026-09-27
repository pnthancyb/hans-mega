
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

"use strict";var B=Object.defineProperty;var oe=Object.getOwnPropertyDescriptor;var le=Object.getOwnPropertyNames;var re=Object.prototype.hasOwnProperty;var ce=(i,o)=>{for(var t in o)B(i,t,{get:o[t],enumerable:!0})},ue=(i,o,t,r)=>{if(o&&typeof o=="object"||typeof o=="function")for(let u of le(o))!re.call(i,u)&&u!==t&&B(i,u,{get:()=>o[u],enumerable:!(r=oe(o,u))||r.enumerable});return i};var ge=i=>ue(B({},"__esModule",{value:!0}),i);var ye={};ce(ye,{getStreams:()=>te});module.exports=ge(ye);function _(i,o,t="info",r){let u=`[${i}]`;t==="error"?console.error(u,o,r||""):t==="warn"?console.warn(u,o,r||""):console.log(u,o,r||"");try{let c=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof c=="string"&&c.startsWith("http")&&fetch(c,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:i,level:t,message:o,details:r})}).catch(()=>{})}catch{}}var de=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(o=>String.fromCharCode(o^42)).join(""),me={REMOTE_CONFIG_URL:de,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},P=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};try{typeof localStorage<"u"&&localStorage&&typeof localStorage.removeItem=="function"&&(localStorage.removeItem("__NUVIO_CONFIG_CACHE__"),localStorage.removeItem("__NUVIO_CONFIG_CACHE_V2__"))}catch{}var K=10*1e3,he=10*1e3;P.__NUVIO_CONFIG_STATE__||(P.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var A=P.__NUVIO_CONFIG_STATE__;async function x(){let i=Date.now(),o=[];try{let t=P.__NUVIO_DEV_LOG_URL__;typeof t=="string"&&t.includes("/api/log")&&o.push(t.replace("/api/log","/domains"))}catch{}o.push(me.REMOTE_CONFIG_URL);for(let t of o)try{let r=await fetch(t);if(r.ok){let u=await r.json(),n=u?.data??u,c=n.domains||n,g=n.cookies,a=n.tmdb_keys||n.tmdbKeys;c&&typeof c=="object"&&(A.cachedDomains={...A.cachedDomains,...c}),g&&typeof g=="object"&&(A.cachedCookies={...A.cachedCookies,...g}),Array.isArray(a)&&a.length>0&&(A.cachedTmdbKeys=a),A.lastFetchTime=i;return}}catch(r){_("Config",`Domain alinamadi (${t}): ${r.message}`,"warn")}A.lastFetchTime=i-K+he}async function H(){let i=Date.now();(!(Object.keys(A.cachedDomains).length>0)||i-A.lastFetchTime>K)&&(A.activeFetchPromise||(A.activeFetchPromise=x().finally(()=>{A.activeFetchPromise=null})),await A.activeFetchPromise)}async function q(i){return await H(),A.cachedDomains[i]||await x(),A.cachedDomains[i]||""}async function Y(){return await H(),A.cachedTmdbKeys||[]}var pe=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],V=["tr","tur","ota"],fe=["english","ingilizce","original","orijinal","audio-en"],W=["en","eng","und"];function X(i,o){let t=!1,r=!1,u=[],n,c,g,a=(o||"").toLowerCase();if(a.includes("trdual")||a.includes("dual")||a.includes("trdub")||a.includes("dublaj")?(t=!0,r=!0):(a.includes("ses-tr")||a.includes("turkcedublaj")||a.includes("turkce-dublaj"))&&(t=!0),a.includes("2160p")||a.includes("4k")||a.includes("uhd")?n="4K":a.includes("1080p")||a.includes("1920x1080")||a.includes("fhd")?n="1080p":a.includes("720p")||a.includes("1280x720")||a.includes("hd")?n="720p":(a.includes("480p")||a.includes("854x480")||a.includes("sd"))&&(n="480p"),a.includes("hevc")||a.includes("h265")||a.includes("x265")?c="HEVC":a.includes("av1")?c="AV1":(a.includes("h264")||a.includes("x264")||a.includes("avc"))&&(c="H.264"),a.includes("5.1")||a.includes("eac3")||a.includes("ac3")||a.includes("ddp")?g="Dolby 5.1":(a.includes("7.1")||a.includes("atmos"))&&(g="Dolby Atmos 7.1"),i&&typeof i=="string"){let k=i.split(/\r?\n/),p=0;for(let v of k){let f=v.trim();if(f.startsWith("#EXT-X-MEDIA:")&&f.includes("TYPE=AUDIO")){let e=f.match(/NAME=["']([^"']+)["']/i),d=f.match(/LANGUAGE=["']([^"']+)["']/i),m=f.match(/GROUP-ID=["']([^"']+)["']/i),s=(e?e[1]:"").toLowerCase(),l=(d?d[1]:"").toLowerCase(),h=(m?m[1]:"").toLowerCase(),S=s.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),z=h.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),w=V.includes(l)||V.some(T=>S.includes(T)||z.includes(T))||pe.some(T=>s.includes(T)||h.includes(T))||s.includes("t\xFCrk")||s.includes("turk")||h.includes("dual"),y=W.includes(l)||W.some(T=>S.includes(T)||z.includes(T))||fe.some(T=>s.includes(T)||h.includes(T))||s.includes("orig")||s.includes("ing")||s.includes("eng");w&&(t=!0),y&&(r=!0)}if(f.startsWith("#EXT-X-MEDIA:")&&f.includes("TYPE=SUBTITLES")){let e=f.match(/URI=["']([^"']+)["']/i),d=f.match(/NAME=["']([^"']+)["']/i),m=f.match(/LANGUAGE=["']([^"']+)["']/i);if(e&&e[1]){let s=e[1];if(o&&!s.startsWith("http"))try{s=new URL(s,o).toString()}catch{}let l=d?d[1]:"Altyaz\u0131",h=m?m[1].toLowerCase():"";h==="st"||h==="sot"||l.toLowerCase().includes("sotho")||l.toLowerCase().includes("sesotho")||s.toLowerCase().includes("sub_st")?(h="tr",l="T\xFCrk\xE7e"):h||(h=l.toLowerCase().includes("t\xFCrk")?"tr":"und");let z=Q(h,l);u.push({label:z.name||l,url:s,lang:z.code||h})}}if(f.startsWith("#EXT-X-STREAM-INF:")){let e=f.match(/RESOLUTION=(\d+)x(\d+)/i);if(e){let d=parseInt(e[1],10),m=parseInt(e[2],10),s=Math.min(d,m),l=Math.max(d,m),h=s>=2100||l>=3800?2160:s>=1400||l>=2500?1440:s>=1e3||l>=1900?1080:s>=700||l>=1200?720:s>=450?480:s;h>p&&(p=h)}else{let d=f.match(/NAME=["']?([^"',\s]+)["']?/i);if(d){let m=d[1].toLowerCase();m.includes("2160")||m.includes("4k")?2160>p&&(p=2160):m.includes("1440")||m.includes("2k")?1440>p&&(p=1440):m.includes("1080")?1080>p&&(p=1080):m.includes("720")&&720>p&&(p=720)}}}}p>=2160?n="4K":p>=1440?n="2K":p>=1080?n="1080p":p>=720?n="720p":p>=480&&(n="480p")}let b=t&&r||a.includes("dual")||a.includes("trdual");return{hasTurkishAudio:t,hasOriginalAudio:r,isDual:b,embeddedSubtitles:u,detectedQuality:n,detectedCodec:c,detectedAudio:g}}function be(i){let{hasTurkishAudio:o,hasOriginalAudio:t,isDual:r,hasSubtitles:u,hasTurkishSubtitles:n,isYerli:c,siteHint:g,defaultTitle:a}=i;if(c||g?.isYerli)return"Yerli";if(g?.label){let b=g.label.toLowerCase();if((b.includes("dub")||b.includes("t\xFCrk"))&&(b.includes("alt")||b.includes("sub")))return"Dublaj / Altyaz\u0131l\u0131";if(b.includes("dub")||b.includes("t\xFCrk\xE7e ses"))return"Dublaj";if(b.includes("alt")||b.includes("sub"))return"Altyaz\u0131l\u0131";if(b.includes("orijinal")||b.includes("original"))return"Orijinal"}return r||o&&(t||n)?"Dublaj / Altyaz\u0131l\u0131":o||g?.isDublaj?"Dublaj":n||g?.isAltyazi?"Altyaz\u0131l\u0131":a||(o?"Dublaj":"Orijinal")}var D={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function Q(i,o,t){let r=m=>(m||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),u=r(i||""),n=r(o||""),c=!!t||u.includes("forced")||n.includes("forced")||u.includes("zorunlu")||n.includes("zorunlu"),g=u.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),a=n.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),b=m=>{let s=m.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return c?`${s} (Zorunlu)`:s};if(g==="st"||g==="sot"||g.includes("sotho")||a.includes("sotho")||a.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:c?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let k=D[u]||D[n]||D[g]||D[a];if(!k){let m=(a+" "+g).split(/\s+/).filter(Boolean);for(let s of m)if(D[s]){k=D[s];break}}if(!k){for(let[m,s]of Object.entries(D))if(m.length>=4&&(a.includes(m)||g.includes(m))){k=s;break}}if(k)return{code:k.code,iso3:k.iso3,language:k.language,name:b(k.name)};let p=(o||i||"Altyaz\u0131").trim();p=p.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let v=p.charAt(0).toUpperCase()+p.slice(1),f=b(v),e=u&&u.length===2?u:n&&n.length===2?n:"und",d=u&&u.length===3?u:n&&n.length===3?n:"und";return{code:e,iso3:d,language:v,name:f}}function J(i,o){let t=[],r=new Set,u=[...i||[],...o||[]];for(let n of u){if(!n||!n.url)continue;let c=n.url.trim();if(r.has(c))continue;r.add(c);let g=Q(n.lang,n.label||n.name||n.language),a=g.name||n.label||n.name||"Altyaz\u0131";t.push({id:String(t.length),url:c,label:a,name:a,language:g.language,lang:g.code,langCode:g.iso3,headers:n.headers})}return t}function Z(i){let{m3u8Text:o,m3u8Url:t,externalSubtitles:r,siteHint:u,defaultTitle:n}=i,c=X(o,t),g=J(r),a=J(r,c.embeddedSubtitles),b=a.length>0||!!u?.isAltyazi,k=a.some(d=>d.lang==="tr"||d.lang==="st"||d.lang==="sot"||d.langCode==="tur"||d.langCode==="sot"||d.label?.toLowerCase().includes("t\xFCrk")||d.label?.toLowerCase().includes("sotho")||d.language==="Turkish"||d.language?.toLowerCase().includes("sotho")),p=c.hasTurkishAudio||!!u?.isDublaj,v=c.hasOriginalAudio,f=c.isDual||p&&(k||v),e=be({hasTurkishAudio:p,hasOriginalAudio:v,isDual:f,hasSubtitles:b,hasTurkishSubtitles:k,isYerli:u?.isYerli,siteHint:u,defaultTitle:n});return{hasTurkishAudio:p,hasOriginalAudio:v,isDual:f,hasSubtitles:b,hasTurkishSubtitles:k,isYerli:u?.isYerli,languageTitle:e,subtitles:g,detectedQuality:c.detectedQuality,detectedCodec:c.detectedCodec,detectedAudio:c.detectedAudio}}function ee(i){let o=i.url?X(void 0,i.url):{},t=i.quality||i.inspection?.detectedQuality||o.detectedQuality||"1080p";t.includes("\u2022")&&(t=t.split("\u2022")[0].trim()),!t.includes("p")&&!t.includes("K")&&!t.includes("k")&&(t=`${t}p`);let r=i.subtitles||i.inspection?.subtitles,u=!!(i.inspection?.hasTurkishSubtitles||r?.some(h=>{let S=(h.lang||h.code||"").toLowerCase(),z=(h.langCode||h.iso3||"").toLowerCase(),w=(h.name||h.label||h.title||"").toLowerCase();return S==="tr"||S==="st"||z==="tur"||z==="sot"||w.includes("t\xFCrk")||w.includes("turk")||w.includes("sotho")})),n=(i.languageTitle||i.inspection?.languageTitle||"").toLowerCase().trim(),c=n.includes("dub")||n.includes("ses")||n.includes("dual")||!!o.hasTurkishAudio||!!i.inspection?.hasTurkishAudio,g=n.includes("dual")||n.includes("dub")&&(n.includes("alt")||n.includes("sub"))||c&&u,a="Orijinal";n.includes("yerli")||i.inspection?.isYerli?a="Yerli":g?a="Dublaj / Altyaz\u0131l\u0131":c?a="Dublaj":u||n.includes("alt")||n.includes("sub")?a="Altyaz\u0131l\u0131":(n.includes("orijinal")||n.includes("yabanc\u0131")||n.includes("original"))&&(a="Orijinal");let b=i.format==="m3u8"||i.url.includes(".m3u8")||i.url.includes("/master.")||i.url.includes("/hls/")||i.url.includes("/txt/"),k=i.format||(b?"m3u8":i.url.includes(".mp4")?"mp4":"m3u8"),p=k==="m3u8"?"HLS":k.toUpperCase(),v=[t],f=i.codec||i.inspection?.detectedCodec||o.detectedCodec;f&&f!=="H.264"&&v.push(f),v.push(p),i.bitrate&&v.push(i.bitrate);let e=i.audio||i.inspection?.detectedAudio||o.detectedAudio;e&&e!=="AAC 2.0"&&v.push(e);let d=i.details||v.join(" \u2022 "),m=`${a}
${d}`,s=`${t} \u2022 ${a}`,l={name:"han's 27",provider:"han's 27",title:a,description:m,url:i.url,quality:s,format:k};return i.headers&&Object.keys(i.headers).length>0&&(l.headers=i.headers),r&&r.length>0&&(l.subtitles=r),l}var ke="a2f888b27315e62e471b2d587048f32e",ae=[ke,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function ne(i){let o=await Y(),t=o.length>0?[...o,...ae]:ae;for(let r=0;r<t.length;r++){let u=t[r],n=i.includes("?")?"&":"?",c=`https://api.themoviedb.org/3/${i}${n}api_key=${u}`;try{let g=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,a=await fetch(c,{signal:g});if(a.ok)return await a.json();if(a.status===429)continue}catch{}}return null}var j=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};j.__NUVIO_TMDB_CACHE__||(j.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var L=j.__NUVIO_TMDB_CACHE__,Ce=L.imdbIdCache,R=L.tmdbTitlesCache,we=L.tmdbImageCache,Ie=L.episodeGroupCache,De=L.absoluteEpCache;async function ie(i,o){let t=String(i||"").replace(/^tmdb:/i,"").trim();if(!t)return{titles:[]};let r=`${o}:${t}`;if(R.has(r))return R.get(r);let u=(async()=>{let n=[],c,g,a=[],b=[],k,p=[];try{let v=o==="tv"||o==="series",f=v?"tv":"movie";if(t.startsWith("tt")){let e=await ne(`find/${t}?external_source=imdb_id`);if(e){let d=v?e?.tv_results?.[0]:e?.movie_results?.[0];d&&(c=d.id,d.overview&&(k=d.overview))}}else c=parseInt(t,10);if(c&&!isNaN(c)){let e=await ne(`${f}/${c}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(e){if(e.overview&&(k=e.overview),e.title&&(n.push(e.title),e.title.includes(":"))){let l=e.title.split(":")[0].trim();l.length>2&&n.push(l)}if(e.name&&(n.push(e.name),e.name.includes(":"))){let l=e.name.split(":")[0].trim();l.length>2&&n.push(l)}if(e.original_title&&e.original_title!==e.title&&(n.push(e.original_title),e.original_title.includes(":"))){let l=e.original_title.split(":")[0].trim();l.length>2&&n.push(l)}if(e.original_name&&e.original_name!==e.name&&(n.push(e.original_name),e.original_name.includes(":"))){let l=e.original_name.split(":")[0].trim();l.length>2&&n.push(l)}if(e.translations?.translations&&Array.isArray(e.translations.translations))for(let l of e.translations.translations){let h=l.data?.name||l.data?.title;if(h&&typeof h=="string"&&(n.push(h),h.includes(":"))){let S=h.split(":")[0].trim();S.length>2&&n.push(S)}}let d=(e.alternative_titles?.results||e.alternative_titles?.titles||[]).map(l=>l.title).filter(Boolean);n.push(...d);let m=e.release_date||e.first_air_date;m&&(g=parseInt(m.split("-")[0],10)),e.genres&&Array.isArray(e.genres)&&(p=e.genres.map(l=>l.name).filter(Boolean)),e.credits?.cast&&Array.isArray(e.credits.cast)&&(a=e.credits.cast.slice(0,10).map(l=>l.name).filter(Boolean));let s=[];e.created_by&&Array.isArray(e.created_by)&&s.push(...e.created_by.map(l=>l.name).filter(Boolean)),e.credits?.crew&&Array.isArray(e.credits.crew)&&s.push(...e.credits.crew.filter(l=>l.job==="Director"||l.department==="Directing").map(l=>l.name).filter(Boolean)),b=Array.from(new Set(s))}}}catch{}return{numericId:c,titles:Array.from(new Set(n.filter(Boolean))),year:g,cast:a,creators:b,overview:k,genres:p}})();return R.set(r,u),u}var E="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";async function te(i,o,t,r){let u=Date.now();if(typeof i=="object"&&i!==null){let a=i;i=a.id||a.tmdbId||a.imdbId,o=a.type||a.mediaType,t=a.season??a.seasonNum,r=a.episode??a.episodeNum}let n=String(i||"").trim();n.toLowerCase().startsWith("tmdb:")&&(n=n.slice(5));let c=n.split(":"),g=c[0].trim();c.length>=3&&t===void 0&&(t=parseInt(c[1],10),r=parseInt(c[2],10)),_("han's 27",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${g}, T\xFCr: ${o}, Sezon: ${t||"-"}, B\xF6l\xFCm: ${r||"-"}`);try{let a=String(o||"").toLowerCase().trim(),b=a==="tv"||a==="series",k=b?"tv":"movie",p=t!=null?parseInt(String(t),10):1,v=r!=null?parseInt(String(r),10):1;if(!g)return[];let f=null;if(g.startsWith("tt")?f=(await ie(g,k)).numericId||null:f=parseInt(g,10),!f)return _("han's 27","Ge\xE7erli TMDB ID \xE7\xF6z\xFClemedi.","warn"),[];let e=await q("dragon");if(!e)return _("han's 27","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let d=b?`${e}/api/movies/by-tmdb/${f}?season=${p}&episode=${v}`:`${e}/api/movies/by-tmdb/${f}`;_("han's 27",`[Ad\u0131m 1/4] TMDB ID (${f}) ile API sorgulan\u0131yor...`);let m=await fetch(d,{headers:{"User-Agent":E,Referer:`${e}/`,Accept:"application/json, text/plain, */*"}});if(!m.ok)return _("han's 27",`\u0130\xE7erik veritaban\u0131nda bulunamad\u0131 (HTTP ${m.status})`,"warn"),[];let s=await m.json();if(!s||!s.id)return _("han's 27","API yan\u0131t\u0131nda ge\xE7erli i\xE7erik nesnesi yok.","warn"),[];_("han's 27",` \u0130\xE7erik Do\u011Fruland\u0131: "${s.title}" (${s.year||"-"}) - Kay\u0131t ID: ${s.id}`,"success");let l=[];s.subtitleTr&&l.push({id:"0",url:s.subtitleTr,language:"Turkish",name:"T\xFCrk\xE7e",lang:"tur",label:"T\xFCrk\xE7e",headers:{Referer:`${e}/`,Origin:e,"User-Agent":"okhttp/4.9.2"}}),s.subtitleEn&&l.push({id:"1",url:s.subtitleEn,language:"English",name:"\u0130ngilizce",lang:"eng",label:"\u0130ngilizce",headers:{Referer:`${e}/`,Origin:e,"User-Agent":"okhttp/4.9.2"}});let h=[];if(s.m3u8Url&&h.push({sourceId:void 0,m3u8Url:s.m3u8Url,subtitleTr:s.subtitleTr,subtitleEn:s.subtitleEn}),Array.isArray(s.sources))for(let y of s.sources)y.m3u8Url&&y.m3u8Url!==s.m3u8Url&&h.push({sourceId:y.id,m3u8Url:y.m3u8Url,subtitleTr:y.subtitleTr,subtitleEn:y.subtitleEn});_("han's 27",`[Ad\u0131m 2/3] Toplam ${h.length} potansiyel ak\u0131\u015F \xE7\xF6z\xFCmleniyor...`);let S=[],z=new Set;for(let y of h)try{let T="";if(y.m3u8Url?.startsWith("http")||y.m3u8Url?.startsWith("/api/"))T=y.m3u8Url.startsWith("/")?`${e}${y.m3u8Url}`:y.m3u8Url;else{let C={noCache:!0};y.sourceId&&(C.sourceId=y.sourceId);let F=await fetch(`${e}/api/admin/resolve-stream/${s.id}`,{method:"POST",headers:{"User-Agent":E,"Content-Type":"application/json",Referer:`${e}/`,Origin:e,Accept:"application/json, text/plain, */*"},body:JSON.stringify(C)});if(F.ok){let M=await F.json();M.m3u8Url&&(T=M.m3u8Url.startsWith("/")?`${e}${M.m3u8Url}`:M.m3u8Url)}}if(!T||z.has(T))continue;z.add(T);let I=[...l];y.subtitleTr&&!I.some(C=>C.lang==="tur")&&I.push({id:String(I.length),url:y.subtitleTr,language:"Turkish",name:"T\xFCrk\xE7e",lang:"tur",label:"T\xFCrk\xE7e",headers:{Referer:`${e}/`,Origin:e,"User-Agent":"okhttp/4.9.2"}}),y.subtitleEn&&!I.some(C=>C.lang==="eng")&&I.push({id:String(I.length),url:y.subtitleEn,language:"English",name:"\u0130ngilizce",lang:"eng",label:"\u0130ngilizce",headers:{Referer:`${e}/`,Origin:e,"User-Agent":"okhttp/4.9.2"}});let N=!1,U="";try{let C=await fetch(T,{headers:{"User-Agent":E,Referer:`${e}/`,Origin:e},signal:AbortSignal.timeout?AbortSignal.timeout(2500):void 0});C.ok&&(U=await C.text(),U.includes("#EXTM3U")&&(N=!0))}catch{}if(!N){_("han's 27","Ge\xE7ersiz veya yan\u0131t vermeyen ak\u0131\u015F elendi.","warn");continue}let $=Z({m3u8Text:U,m3u8Url:T,externalSubtitles:I}),G=$.languageTitle,O=S.length,se=ee({name:O>0?`han's 27 [${O+1}]`:"han's 27",url:T,inspection:$,languageTitle:G,quality:"1080p",format:"m3u8",headers:{"User-Agent":E,Referer:`${e}/`,Origin:e}});S.push(se),_("han's 27",` Ak\u0131\u015F Eklendi: ${G}`,"success")}catch(T){_("han's 27",`Kaynak \xE7\xF6z\xFCmleme hatas\u0131: ${T.message}`,"warn")}let w=((Date.now()-u)/1e3).toFixed(2);return _("han's 27",`[Ad\u0131m 4/4] TAMAMLANDI: ${S.length} adet ak\u0131\u015F listelendi (${w}s)`,"success",S.map(y=>({server:y.name,kalite:y.quality,title:y.title}))),S}catch(a){return _("han's 27",`Kritik Hata: ${a.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=te);

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

;(()=>{const n="han's 27",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
