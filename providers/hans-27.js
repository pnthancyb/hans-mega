
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

"use strict";var N=Object.defineProperty;var le=Object.getOwnPropertyDescriptor;var re=Object.getOwnPropertyNames;var ce=Object.prototype.hasOwnProperty;var ue=(a,t)=>{for(var s in t)N(a,s,{get:t[s],enumerable:!0})},ge=(a,t,s,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let c of re(t))!ce.call(a,c)&&c!==s&&N(a,c,{get:()=>t[c],enumerable:!(r=le(t,c))||r.enumerable});return a};var de=a=>ge(N({},"__esModule",{value:!0}),a);var _e={};ue(_e,{getStreams:()=>se});module.exports=de(_e);var me=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(t=>String.fromCharCode(t^42)).join(""),he={REMOTE_CONFIG_URL:me,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},D=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},H="__NUVIO_CONFIG_CACHE__",E=60*60*1e3,x=2*60*1e3;if(!D.__NUVIO_CONFIG_STATE__){D.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null};try{if(typeof localStorage<"u"&&localStorage&&typeof localStorage.getItem=="function"){let a=localStorage.getItem(H);if(a){let t=JSON.parse(a);t&&t.timestamp&&Date.now()-t.timestamp<E&&(t.domains&&typeof t.domains=="object"&&(D.__NUVIO_CONFIG_STATE__.cachedDomains=t.domains),t.cookies&&typeof t.cookies=="object"&&(D.__NUVIO_CONFIG_STATE__.cachedCookies=t.cookies),Array.isArray(t.tmdbKeys)&&t.tmdbKeys.length>0&&(D.__NUVIO_CONFIG_STATE__.cachedTmdbKeys=t.tmdbKeys),D.__NUVIO_CONFIG_STATE__.lastFetchTime=t.timestamp)}}}catch{}}var v=D.__NUVIO_CONFIG_STATE__;function fe(a){try{typeof localStorage<"u"&&localStorage&&typeof localStorage.setItem=="function"&&localStorage.setItem(H,JSON.stringify({timestamp:a,domains:v.cachedDomains,cookies:v.cachedCookies,tmdbKeys:v.cachedTmdbKeys}))}catch{}}async function pe(){let a=Date.now();try{let t={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let r=AbortSignal.timeout(8e3);r&&(t.signal=r)}catch{}let s=await fetch(he.REMOTE_CONFIG_URL,t);if(s.ok){let r=await s.json(),c=r?.data??r,i=c.domains||c,u=c.cookies,g=c.tmdb_keys||c.tmdbKeys;i&&typeof i=="object"&&(v.cachedDomains={...v.cachedDomains,...i}),u&&typeof u=="object"&&(v.cachedCookies={...v.cachedCookies,...u}),Array.isArray(g)&&g.length>0&&(v.cachedTmdbKeys=g),v.lastFetchTime=a,fe(a)}else v.lastFetchTime=a-E+x}catch{v.lastFetchTime=a-E+x}}async function q(){let a=Date.now();(!(Object.keys(v.cachedDomains).length>0)||a-v.lastFetchTime>E)&&(v.activeFetchPromise||(v.activeFetchPromise=pe().finally(()=>{v.activeFetchPromise=null})),await v.activeFetchPromise)}async function Y(a){return await q(),v.cachedDomains[a]||""}async function V(){return await q(),v.cachedTmdbKeys||[]}function S(a,t,s="info",r){let c=`[${a}]`;s==="error"?console.error(c,t,r||""):s==="warn"?console.warn(c,t,r||""):console.log(c,t,r||"");try{let u=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof u=="string"&&u.startsWith("http")&&fetch(u,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:a,level:s,message:t,details:r})}).catch(()=>{})}catch{}}var be=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],W=["tr","tur","ota"],ke=["english","ingilizce","original","orijinal","audio-en"],J=["en","eng","und"];function Q(a,t){let s=!1,r=!1,c=[],i,u,g,n=(t||"").toLowerCase();if(n.includes("trdual")||n.includes("dual")||n.includes("trdub")||n.includes("dublaj")?(s=!0,r=!0):(n.includes("ses-tr")||n.includes("turkcedublaj")||n.includes("turkce-dublaj"))&&(s=!0),n.includes("2160p")||n.includes("4k")||n.includes("uhd")?i="4K":n.includes("1080p")||n.includes("1920x1080")||n.includes("fhd")?i="1080p":n.includes("720p")||n.includes("1280x720")||n.includes("hd")?i="720p":(n.includes("480p")||n.includes("854x480")||n.includes("sd"))&&(i="480p"),n.includes("hevc")||n.includes("h265")||n.includes("x265")?u="HEVC":n.includes("av1")?u="AV1":(n.includes("h264")||n.includes("x264")||n.includes("avc"))&&(u="H.264"),n.includes("5.1")||n.includes("eac3")||n.includes("ac3")||n.includes("ddp")?g="Dolby 5.1":(n.includes("7.1")||n.includes("atmos"))&&(g="Dolby Atmos 7.1"),a&&typeof a=="string"){let k=a.split(/\r?\n/),f=0;for(let _ of k){let p=_.trim();if(p.startsWith("#EXT-X-MEDIA:")&&p.includes("TYPE=AUDIO")){let e=p.match(/NAME=["']([^"']+)["']/i),d=p.match(/LANGUAGE=["']([^"']+)["']/i),m=p.match(/GROUP-ID=["']([^"']+)["']/i),o=(e?e[1]:"").toLowerCase(),l=(d?d[1]:"").toLowerCase(),h=(m?m[1]:"").toLowerCase(),A=o.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),C=h.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),w=W.includes(l)||W.some(T=>A.includes(T)||C.includes(T))||be.some(T=>o.includes(T)||h.includes(T))||o.includes("t\xFCrk")||o.includes("turk")||h.includes("dual"),y=J.includes(l)||J.some(T=>A.includes(T)||C.includes(T))||ke.some(T=>o.includes(T)||h.includes(T))||o.includes("orig")||o.includes("ing")||o.includes("eng");w&&(s=!0),y&&(r=!0)}if(p.startsWith("#EXT-X-MEDIA:")&&p.includes("TYPE=SUBTITLES")){let e=p.match(/URI=["']([^"']+)["']/i),d=p.match(/NAME=["']([^"']+)["']/i),m=p.match(/LANGUAGE=["']([^"']+)["']/i);if(e&&e[1]){let o=e[1];if(t&&!o.startsWith("http"))try{o=new URL(o,t).toString()}catch{}let l=d?d[1]:"Altyaz\u0131",h=m?m[1].toLowerCase():"";h==="st"||h==="sot"||l.toLowerCase().includes("sotho")||l.toLowerCase().includes("sesotho")||o.toLowerCase().includes("sub_st")?(h="tr",l="T\xFCrk\xE7e"):h||(h=l.toLowerCase().includes("t\xFCrk")?"tr":"und");let C=Z(h,l);c.push({label:C.name||l,url:o,lang:C.code||h})}}if(p.startsWith("#EXT-X-STREAM-INF:")){let e=p.match(/RESOLUTION=(\d+)x(\d+)/i);if(e){let d=parseInt(e[1],10),m=parseInt(e[2],10),o=Math.min(d,m),l=Math.max(d,m),h=o>=2100||l>=3800?2160:o>=1400||l>=2500?1440:o>=1e3||l>=1900?1080:o>=700||l>=1200?720:o>=450?480:o;h>f&&(f=h)}else{let d=p.match(/NAME=["']?([^"',\s]+)["']?/i);if(d){let m=d[1].toLowerCase();m.includes("2160")||m.includes("4k")?2160>f&&(f=2160):m.includes("1440")||m.includes("2k")?1440>f&&(f=1440):m.includes("1080")?1080>f&&(f=1080):m.includes("720")&&720>f&&(f=720)}}}}f>=2160?i="4K":f>=1440?i="2K":f>=1080?i="1080p":f>=720?i="720p":f>=480&&(i="480p")}let b=s&&r||n.includes("dual")||n.includes("trdual");return{hasTurkishAudio:s,hasOriginalAudio:r,isDual:b,embeddedSubtitles:c,detectedQuality:i,detectedCodec:u,detectedAudio:g}}function ye(a){let{hasTurkishAudio:t,hasOriginalAudio:s,isDual:r,hasSubtitles:c,hasTurkishSubtitles:i,isYerli:u,siteHint:g,defaultTitle:n}=a;if(u||g?.isYerli)return"Yerli";if(g?.label){let b=g.label.toLowerCase();if((b.includes("dub")||b.includes("t\xFCrk"))&&(b.includes("alt")||b.includes("sub")))return"Dublaj / Altyaz\u0131l\u0131";if(b.includes("dub")||b.includes("t\xFCrk\xE7e ses"))return"Dublaj";if(b.includes("alt")||b.includes("sub"))return"Altyaz\u0131l\u0131";if(b.includes("orijinal")||b.includes("original"))return"Orijinal"}return r||t&&(s||i)?"Dublaj / Altyaz\u0131l\u0131":t||g?.isDublaj?"Dublaj":i||g?.isAltyazi?"Altyaz\u0131l\u0131":n||(t?"Dublaj":"Orijinal")}var L={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function Z(a,t,s){let r=m=>(m||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),c=r(a||""),i=r(t||""),u=!!s||c.includes("forced")||i.includes("forced")||c.includes("zorunlu")||i.includes("zorunlu"),g=c.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),n=i.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),b=m=>{let o=m.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return u?`${o} (Zorunlu)`:o};if(g==="st"||g==="sot"||g.includes("sotho")||n.includes("sotho")||n.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:u?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let k=L[c]||L[i]||L[g]||L[n];if(!k){let m=(n+" "+g).split(/\s+/).filter(Boolean);for(let o of m)if(L[o]){k=L[o];break}}if(!k){for(let[m,o]of Object.entries(L))if(m.length>=4&&(n.includes(m)||g.includes(m))){k=o;break}}if(k)return{code:k.code,iso3:k.iso3,language:k.language,name:b(k.name)};let f=(t||a||"Altyaz\u0131").trim();f=f.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let _=f.charAt(0).toUpperCase()+f.slice(1),p=b(_),e=c&&c.length===2?c:i&&i.length===2?i:"und",d=c&&c.length===3?c:i&&i.length===3?i:"und";return{code:e,iso3:d,language:_,name:p}}function X(a,t){let s=[],r=new Set,c=[...a||[],...t||[]];for(let i of c){if(!i||!i.url)continue;let u=i.url.trim();if(r.has(u))continue;r.add(u);let g=Z(i.lang,i.label||i.name||i.language),n=g.name||i.label||i.name||"Altyaz\u0131";s.push({id:String(s.length),url:u,label:n,name:n,language:g.language,lang:g.code,langCode:g.iso3,headers:i.headers})}return s}function ee(a){let{m3u8Text:t,m3u8Url:s,externalSubtitles:r,siteHint:c,defaultTitle:i}=a,u=Q(t,s),g=X(r),n=X(r,u.embeddedSubtitles),b=n.length>0||!!c?.isAltyazi,k=n.some(d=>d.lang==="tr"||d.lang==="st"||d.lang==="sot"||d.langCode==="tur"||d.langCode==="sot"||d.label?.toLowerCase().includes("t\xFCrk")||d.label?.toLowerCase().includes("sotho")||d.language==="Turkish"||d.language?.toLowerCase().includes("sotho")),f=u.hasTurkishAudio||!!c?.isDublaj,_=u.hasOriginalAudio,p=u.isDual||f&&(k||_),e=ye({hasTurkishAudio:f,hasOriginalAudio:_,isDual:p,hasSubtitles:b,hasTurkishSubtitles:k,isYerli:c?.isYerli,siteHint:c,defaultTitle:i});return{hasTurkishAudio:f,hasOriginalAudio:_,isDual:p,hasSubtitles:b,hasTurkishSubtitles:k,isYerli:c?.isYerli,languageTitle:e,subtitles:g,detectedQuality:u.detectedQuality,detectedCodec:u.detectedCodec,detectedAudio:u.detectedAudio}}function ae(a){let t=a.url?Q(void 0,a.url):{},s=a.quality||a.inspection?.detectedQuality||t.detectedQuality||"1080p";s.includes("\u2022")&&(s=s.split("\u2022")[0].trim()),!s.includes("p")&&!s.includes("K")&&!s.includes("k")&&(s=`${s}p`);let r=a.subtitles||a.inspection?.subtitles,c=!!(a.inspection?.hasTurkishSubtitles||r?.some(h=>{let A=(h.lang||h.code||"").toLowerCase(),C=(h.langCode||h.iso3||"").toLowerCase(),w=(h.name||h.label||h.title||"").toLowerCase();return A==="tr"||A==="st"||C==="tur"||C==="sot"||w.includes("t\xFCrk")||w.includes("turk")||w.includes("sotho")})),i=(a.languageTitle||a.inspection?.languageTitle||"").toLowerCase().trim(),u=i.includes("dub")||i.includes("ses")||i.includes("dual")||!!t.hasTurkishAudio||!!a.inspection?.hasTurkishAudio,g=i.includes("dual")||i.includes("dub")&&(i.includes("alt")||i.includes("sub"))||u&&c,n="Orijinal";i.includes("yerli")||a.inspection?.isYerli?n="Yerli":g?n="Dublaj / Altyaz\u0131l\u0131":u?n="Dublaj":c||i.includes("alt")||i.includes("sub")?n="Altyaz\u0131l\u0131":(i.includes("orijinal")||i.includes("yabanc\u0131")||i.includes("original"))&&(n="Orijinal");let b=a.format==="m3u8"||a.url.includes(".m3u8")||a.url.includes("/master.")||a.url.includes("/hls/")||a.url.includes("/txt/"),k=a.format||(b?"m3u8":a.url.includes(".mp4")?"mp4":"m3u8"),f=k==="m3u8"?"HLS":k.toUpperCase(),_=[s],p=a.codec||a.inspection?.detectedCodec||t.detectedCodec;p&&p!=="H.264"&&_.push(p),_.push(f),a.bitrate&&_.push(a.bitrate);let e=a.audio||a.inspection?.detectedAudio||t.detectedAudio;e&&e!=="AAC 2.0"&&_.push(e);let d=a.details||_.join(" \u2022 "),m=`${n}
${d}`,o=`${s} \u2022 ${n}`,l={name:"han's 27",provider:"han's 27",title:n,description:m,url:a.url,quality:o,format:k};return a.headers&&Object.keys(a.headers).length>0&&(l.headers=a.headers),r&&r.length>0&&(l.subtitles=r),l}var Te="a2f888b27315e62e471b2d587048f32e",ne=[Te,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function ie(a){let t=await V(),s=t.length>0?[...t,...ne]:ne;for(let r=0;r<s.length;r++){let c=s[r],i=a.includes("?")?"&":"?",u=`https://api.themoviedb.org/3/${a}${i}api_key=${c}`;try{let g=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,n=await fetch(u,{signal:g});if(n.ok)return await n.json();if(n.status===429)continue}catch{}}return null}var R=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};R.__NUVIO_TMDB_CACHE__||(R.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var P=R.__NUVIO_TMDB_CACHE__,we=P.imdbIdCache,j=P.tmdbTitlesCache,Ie=P.tmdbImageCache,De=P.episodeGroupCache,Le=P.absoluteEpCache;async function te(a,t){let s=String(a||"").replace(/^tmdb:/i,"").trim();if(!s)return{titles:[]};let r=`${t}:${s}`;if(j.has(r))return j.get(r);let c=(async()=>{let i=[],u,g,n=[],b=[],k,f=[];try{let _=t==="tv"||t==="series",p=_?"tv":"movie";if(s.startsWith("tt")){let e=await ie(`find/${s}?external_source=imdb_id`);if(e){let d=_?e?.tv_results?.[0]:e?.movie_results?.[0];d&&(u=d.id,d.overview&&(k=d.overview))}}else u=parseInt(s,10);if(u&&!isNaN(u)){let e=await ie(`${p}/${u}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(e){if(e.overview&&(k=e.overview),e.title&&(i.push(e.title),e.title.includes(":"))){let l=e.title.split(":")[0].trim();l.length>2&&i.push(l)}if(e.name&&(i.push(e.name),e.name.includes(":"))){let l=e.name.split(":")[0].trim();l.length>2&&i.push(l)}if(e.original_title&&e.original_title!==e.title&&(i.push(e.original_title),e.original_title.includes(":"))){let l=e.original_title.split(":")[0].trim();l.length>2&&i.push(l)}if(e.original_name&&e.original_name!==e.name&&(i.push(e.original_name),e.original_name.includes(":"))){let l=e.original_name.split(":")[0].trim();l.length>2&&i.push(l)}if(e.translations?.translations&&Array.isArray(e.translations.translations))for(let l of e.translations.translations){let h=l.data?.name||l.data?.title;if(h&&typeof h=="string"&&(i.push(h),h.includes(":"))){let A=h.split(":")[0].trim();A.length>2&&i.push(A)}}let d=(e.alternative_titles?.results||e.alternative_titles?.titles||[]).map(l=>l.title).filter(Boolean);i.push(...d);let m=e.release_date||e.first_air_date;m&&(g=parseInt(m.split("-")[0],10)),e.genres&&Array.isArray(e.genres)&&(f=e.genres.map(l=>l.name).filter(Boolean)),e.credits?.cast&&Array.isArray(e.credits.cast)&&(n=e.credits.cast.slice(0,10).map(l=>l.name).filter(Boolean));let o=[];e.created_by&&Array.isArray(e.created_by)&&o.push(...e.created_by.map(l=>l.name).filter(Boolean)),e.credits?.crew&&Array.isArray(e.credits.crew)&&o.push(...e.credits.crew.filter(l=>l.job==="Director"||l.department==="Directing").map(l=>l.name).filter(Boolean)),b=Array.from(new Set(o))}}}catch{}return{numericId:u,titles:Array.from(new Set(i.filter(Boolean))),year:g,cast:n,creators:b,overview:k,genres:f}})();return j.set(r,c),c}var U="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";async function se(a,t,s,r){let c=Date.now();if(typeof a=="object"&&a!==null){let n=a;a=n.id||n.tmdbId||n.imdbId,t=n.type||n.mediaType,s=n.season??n.seasonNum,r=n.episode??n.episodeNum}let i=String(a||"").trim();i.toLowerCase().startsWith("tmdb:")&&(i=i.slice(5));let u=i.split(":"),g=u[0].trim();u.length>=3&&s===void 0&&(s=parseInt(u[1],10),r=parseInt(u[2],10)),S("han's 27",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${g}, T\xFCr: ${t}, Sezon: ${s||"-"}, B\xF6l\xFCm: ${r||"-"}`);try{let n=String(t||"").toLowerCase().trim(),b=n==="tv"||n==="series",k=b?"tv":"movie",f=s!=null?parseInt(String(s),10):1,_=r!=null?parseInt(String(r),10):1;if(!g)return[];let p=null;if(g.startsWith("tt")?p=(await te(g,k)).numericId||null:p=parseInt(g,10),!p)return S("han's 27","Ge\xE7erli TMDB ID \xE7\xF6z\xFClemedi.","warn"),[];let e=await Y("dragon");if(!e)return S("han's 27","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let d=b?`${e}/api/movies/by-tmdb/${p}?season=${f}&episode=${_}`:`${e}/api/movies/by-tmdb/${p}`;S("han's 27",`[Ad\u0131m 1/4] TMDB ID (${p}) ile API sorgulan\u0131yor...`);let m=await fetch(d,{headers:{"User-Agent":U,Referer:`${e}/`,Accept:"application/json, text/plain, */*"}});if(!m.ok)return S("han's 27",`\u0130\xE7erik veritaban\u0131nda bulunamad\u0131 (HTTP ${m.status})`,"warn"),[];let o=await m.json();if(!o||!o.id)return S("han's 27","API yan\u0131t\u0131nda ge\xE7erli i\xE7erik nesnesi yok.","warn"),[];S("han's 27",` \u0130\xE7erik Do\u011Fruland\u0131: "${o.title}" (${o.year||"-"}) - Kay\u0131t ID: ${o.id}`,"success");let l=[];o.subtitleTr&&l.push({id:"0",url:o.subtitleTr,language:"Turkish",name:"T\xFCrk\xE7e",lang:"tur",label:"T\xFCrk\xE7e",headers:{Referer:`${e}/`,Origin:e,"User-Agent":"okhttp/4.9.2"}}),o.subtitleEn&&l.push({id:"1",url:o.subtitleEn,language:"English",name:"\u0130ngilizce",lang:"eng",label:"\u0130ngilizce",headers:{Referer:`${e}/`,Origin:e,"User-Agent":"okhttp/4.9.2"}});let h=[];if(o.m3u8Url&&h.push({sourceId:void 0,m3u8Url:o.m3u8Url,subtitleTr:o.subtitleTr,subtitleEn:o.subtitleEn}),Array.isArray(o.sources))for(let y of o.sources)y.m3u8Url&&y.m3u8Url!==o.m3u8Url&&h.push({sourceId:y.id,m3u8Url:y.m3u8Url,subtitleTr:y.subtitleTr,subtitleEn:y.subtitleEn});S("han's 27",`[Ad\u0131m 2/3] Toplam ${h.length} potansiyel ak\u0131\u015F \xE7\xF6z\xFCmleniyor...`);let A=[],C=new Set;for(let y of h)try{let T="";if(y.m3u8Url?.startsWith("http")||y.m3u8Url?.startsWith("/api/"))T=y.m3u8Url.startsWith("/")?`${e}${y.m3u8Url}`:y.m3u8Url;else{let z={noCache:!0};y.sourceId&&(z.sourceId=y.sourceId);let K=await fetch(`${e}/api/admin/resolve-stream/${o.id}`,{method:"POST",headers:{"User-Agent":U,"Content-Type":"application/json",Referer:`${e}/`,Origin:e,Accept:"application/json, text/plain, */*"},body:JSON.stringify(z)});if(K.ok){let M=await K.json();M.m3u8Url&&(T=M.m3u8Url.startsWith("/")?`${e}${M.m3u8Url}`:M.m3u8Url)}}if(!T||C.has(T))continue;C.add(T);let I=[...l];y.subtitleTr&&!I.some(z=>z.lang==="tur")&&I.push({id:String(I.length),url:y.subtitleTr,language:"Turkish",name:"T\xFCrk\xE7e",lang:"tur",label:"T\xFCrk\xE7e",headers:{Referer:`${e}/`,Origin:e,"User-Agent":"okhttp/4.9.2"}}),y.subtitleEn&&!I.some(z=>z.lang==="eng")&&I.push({id:String(I.length),url:y.subtitleEn,language:"English",name:"\u0130ngilizce",lang:"eng",label:"\u0130ngilizce",headers:{Referer:`${e}/`,Origin:e,"User-Agent":"okhttp/4.9.2"}});let O=!1,B="";try{let z=await fetch(T,{headers:{"User-Agent":U,Referer:`${e}/`,Origin:e},signal:AbortSignal.timeout?AbortSignal.timeout(2500):void 0});z.ok&&(B=await z.text(),B.includes("#EXTM3U")&&(O=!0))}catch{}if(!O){S("han's 27","Ge\xE7ersiz veya yan\u0131t vermeyen ak\u0131\u015F elendi.","warn");continue}let G=ee({m3u8Text:B,m3u8Url:T,externalSubtitles:I}),F=G.languageTitle,$=A.length,oe=ae({name:$>0?`han's 27 [${$+1}]`:"han's 27",url:T,inspection:G,languageTitle:F,quality:"1080p",format:"m3u8",headers:{"User-Agent":U,Referer:`${e}/`,Origin:e}});A.push(oe),S("han's 27",` Ak\u0131\u015F Eklendi: ${F}`,"success")}catch(T){S("han's 27",`Kaynak \xE7\xF6z\xFCmleme hatas\u0131: ${T.message}`,"warn")}let w=((Date.now()-c)/1e3).toFixed(2);return S("han's 27",`[Ad\u0131m 4/4] TAMAMLANDI: ${A.length} adet ak\u0131\u015F listelendi (${w}s)`,"success",A.map(y=>({server:y.name,kalite:y.quality,title:y.title}))),A}catch(n){return S("han's 27",`Kritik Hata: ${n.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=se);

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
