
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

"use strict";var j=Object.defineProperty;var J=Object.getOwnPropertyDescriptor;var X=Object.getOwnPropertyNames;var Q=Object.prototype.hasOwnProperty;var Z=(a,e)=>{for(var o in e)j(a,o,{get:e[o],enumerable:!0})},aa=(a,e,o,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let l of X(e))!Q.call(a,l)&&l!==o&&j(a,l,{get:()=>e[l],enumerable:!(t=J(e,l))||t.enumerable});return a};var ea=a=>aa(j({},"__esModule",{value:!0}),a);var da={};Z(da,{getStreams:()=>$});module.exports=ea(da);var na=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(e=>String.fromCharCode(e^42)).join(""),ia={REMOTE_CONFIG_URL:na,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},_=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},U="__NUVIO_CONFIG_CACHE__",R=60*60*1e3,G=2*60*1e3;if(!_.__NUVIO_CONFIG_STATE__){_.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null};try{if(typeof localStorage<"u"&&localStorage&&typeof localStorage.getItem=="function"){let a=localStorage.getItem(U);if(a){let e=JSON.parse(a);e&&e.timestamp&&Date.now()-e.timestamp<R&&(e.domains&&typeof e.domains=="object"&&(_.__NUVIO_CONFIG_STATE__.cachedDomains=e.domains),e.cookies&&typeof e.cookies=="object"&&(_.__NUVIO_CONFIG_STATE__.cachedCookies=e.cookies),Array.isArray(e.tmdbKeys)&&e.tmdbKeys.length>0&&(_.__NUVIO_CONFIG_STATE__.cachedTmdbKeys=e.tmdbKeys),_.__NUVIO_CONFIG_STATE__.lastFetchTime=e.timestamp)}}}catch{}}var f=_.__NUVIO_CONFIG_STATE__;function oa(a){try{typeof localStorage<"u"&&localStorage&&typeof localStorage.setItem=="function"&&localStorage.setItem(U,JSON.stringify({timestamp:a,domains:f.cachedDomains,cookies:f.cachedCookies,tmdbKeys:f.cachedTmdbKeys}))}catch{}}async function sa(){let a=Date.now();try{let e={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let t=AbortSignal.timeout(8e3);t&&(e.signal=t)}catch{}let o=await fetch(ia.REMOTE_CONFIG_URL,e);if(o.ok){let t=await o.json(),l=t?.data??t,i=l.domains||l,d=l.cookies,b=l.tmdb_keys||l.tmdbKeys;i&&typeof i=="object"&&(f.cachedDomains={...f.cachedDomains,...i}),d&&typeof d=="object"&&(f.cachedCookies={...f.cachedCookies,...d}),Array.isArray(b)&&b.length>0&&(f.cachedTmdbKeys=b),f.lastFetchTime=a,oa(a)}else f.lastFetchTime=a-R+G}catch{f.lastFetchTime=a-R+G}}async function la(){let a=Date.now();(!(Object.keys(f.cachedDomains).length>0)||a-f.lastFetchTime>R)&&(f.activeFetchPromise||(f.activeFetchPromise=sa().finally(()=>{f.activeFetchPromise=null})),await f.activeFetchPromise)}async function K(a){return await la(),f.cachedDomains[a]||""}function z(a,e,o="info",t){let l=`[${a}]`;o==="error"?console.error(l,e,t||""):o==="warn"?console.warn(l,e,t||""):console.log(l,e,t||"");try{let d=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof d=="string"&&d.startsWith("http")&&fetch(d,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:a,level:o,message:e,details:t})}).catch(()=>{})}catch{}}var ta=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],x=["tr","tur","ota"],ca=["english","ingilizce","original","orijinal","audio-en"],H=["en","eng","und"];function ua(a,e){let o=!1,t=!1,l=[],i,d,b,n=(e||"").toLowerCase();if(n.includes("trdual")||n.includes("dual")||n.includes("trdub")||n.includes("dublaj")?(o=!0,t=!0):(n.includes("ses-tr")||n.includes("turkcedublaj")||n.includes("turkce-dublaj"))&&(o=!0),n.includes("2160p")||n.includes("4k")||n.includes("uhd")?i="4K":n.includes("1080p")||n.includes("1920x1080")||n.includes("fhd")?i="1080p":n.includes("720p")||n.includes("1280x720")||n.includes("hd")?i="720p":(n.includes("480p")||n.includes("854x480")||n.includes("sd"))&&(i="480p"),n.includes("hevc")||n.includes("h265")||n.includes("x265")?d="HEVC":n.includes("av1")?d="AV1":(n.includes("h264")||n.includes("x264")||n.includes("avc"))&&(d="H.264"),n.includes("5.1")||n.includes("eac3")||n.includes("ac3")||n.includes("ddp")?b="Dolby 5.1":(n.includes("7.1")||n.includes("atmos"))&&(b="Dolby Atmos 7.1"),a&&typeof a=="string"){let k=a.split(/\r?\n/),c=0;for(let y of k){let m=y.trim();if(m.startsWith("#EXT-X-MEDIA:")&&m.includes("TYPE=AUDIO")){let h=m.match(/NAME=["']([^"']+)["']/i),p=m.match(/LANGUAGE=["']([^"']+)["']/i),u=m.match(/GROUP-ID=["']([^"']+)["']/i),s=(h?h[1]:"").toLowerCase(),g=(p?p[1]:"").toLowerCase(),r=(u?u[1]:"").toLowerCase(),v=s.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),A=r.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),S=x.includes(g)||x.some(T=>v.includes(T)||A.includes(T))||ta.some(T=>s.includes(T)||r.includes(T))||s.includes("t\xFCrk")||s.includes("turk")||r.includes("dual"),M=H.includes(g)||H.some(T=>v.includes(T)||A.includes(T))||ca.some(T=>s.includes(T)||r.includes(T))||s.includes("orig")||s.includes("ing")||s.includes("eng");S&&(o=!0),M&&(t=!0)}if(m.startsWith("#EXT-X-MEDIA:")&&m.includes("TYPE=SUBTITLES")){let h=m.match(/URI=["']([^"']+)["']/i),p=m.match(/NAME=["']([^"']+)["']/i),u=m.match(/LANGUAGE=["']([^"']+)["']/i);if(h&&h[1]){let s=h[1];if(e&&!s.startsWith("http"))try{s=new URL(s,e).toString()}catch{}let g=p?p[1]:"Altyaz\u0131",r=u?u[1].toLowerCase():"";r==="st"||r==="sot"||g.toLowerCase().includes("sotho")||g.toLowerCase().includes("sesotho")||s.toLowerCase().includes("sub_st")?(r="tr",g="T\xFCrk\xE7e"):r||(r=g.toLowerCase().includes("t\xFCrk")?"tr":"und");let A=ra(r,g);l.push({label:A.name||g,url:s,lang:A.code||r})}}if(m.startsWith("#EXT-X-STREAM-INF:")){let h=m.match(/RESOLUTION=(\d+)x(\d+)/i);if(h){let p=parseInt(h[1],10),u=parseInt(h[2],10),s=Math.min(p,u),g=Math.max(p,u),r=s>=2100||g>=3800?2160:s>=1400||g>=2500?1440:s>=1e3||g>=1900?1080:s>=700||g>=1200?720:s>=450?480:s;r>c&&(c=r)}else{let p=m.match(/NAME=["']?([^"',\s]+)["']?/i);if(p){let u=p[1].toLowerCase();u.includes("2160")||u.includes("4k")?2160>c&&(c=2160):u.includes("1440")||u.includes("2k")?1440>c&&(c=1440):u.includes("1080")?1080>c&&(c=1080):u.includes("720")&&720>c&&(c=720)}}}}c>=2160?i="4K":c>=1440?i="2K":c>=1080?i="1080p":c>=720?i="720p":c>=480&&(i="480p")}let C=o&&t||n.includes("dual")||n.includes("trdual");return{hasTurkishAudio:o,hasOriginalAudio:t,isDual:C,embeddedSubtitles:l,detectedQuality:i,detectedCodec:d,detectedAudio:b}}var D={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function ra(a,e,o){let t=u=>(u||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),l=t(a||""),i=t(e||""),d=!!o||l.includes("forced")||i.includes("forced")||l.includes("zorunlu")||i.includes("zorunlu"),b=l.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),n=i.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),C=u=>{let s=u.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return d?`${s} (Zorunlu)`:s};if(b==="st"||b==="sot"||b.includes("sotho")||n.includes("sotho")||n.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:d?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let k=D[l]||D[i]||D[b]||D[n];if(!k){let u=(n+" "+b).split(/\s+/).filter(Boolean);for(let s of u)if(D[s]){k=D[s];break}}if(!k){for(let[u,s]of Object.entries(D))if(u.length>=4&&(n.includes(u)||b.includes(u))){k=s;break}}if(k)return{code:k.code,iso3:k.iso3,language:k.language,name:C(k.name)};let c=(e||a||"Altyaz\u0131").trim();c=c.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let y=c.charAt(0).toUpperCase()+c.slice(1),m=C(y),h=l&&l.length===2?l:i&&i.length===2?i:"und",p=l&&l.length===3?l:i&&i.length===3?i:"und";return{code:h,iso3:p,language:y,name:m}}function q(a){let e=a.url?ua(void 0,a.url):{},o=a.quality||a.inspection?.detectedQuality||e.detectedQuality||"1080p";o.includes("\u2022")&&(o=o.split("\u2022")[0].trim()),!o.includes("p")&&!o.includes("K")&&!o.includes("k")&&(o=`${o}p`);let t=a.subtitles||a.inspection?.subtitles,l=!!(a.inspection?.hasTurkishSubtitles||t?.some(r=>{let v=(r.lang||r.code||"").toLowerCase(),A=(r.langCode||r.iso3||"").toLowerCase(),S=(r.name||r.label||r.title||"").toLowerCase();return v==="tr"||v==="st"||A==="tur"||A==="sot"||S.includes("t\xFCrk")||S.includes("turk")||S.includes("sotho")})),i=(a.languageTitle||a.inspection?.languageTitle||"").toLowerCase().trim(),d=i.includes("dub")||i.includes("ses")||i.includes("dual")||!!e.hasTurkishAudio||!!a.inspection?.hasTurkishAudio,b=i.includes("dual")||i.includes("dub")&&(i.includes("alt")||i.includes("sub"))||d&&l,n="Orijinal";i.includes("yerli")||a.inspection?.isYerli?n="Yerli":b?n="Dublaj / Altyaz\u0131l\u0131":d?n="Dublaj":l||i.includes("alt")||i.includes("sub")?n="Altyaz\u0131l\u0131":(i.includes("orijinal")||i.includes("yabanc\u0131")||i.includes("original"))&&(n="Orijinal");let C=a.format==="m3u8"||a.url.includes(".m3u8")||a.url.includes("/master.")||a.url.includes("/hls/")||a.url.includes("/txt/"),k=a.format||(C?"m3u8":a.url.includes(".mp4")?"mp4":"m3u8"),c=k==="m3u8"?"HLS":k.toUpperCase(),y=[o],m=a.codec||a.inspection?.detectedCodec||e.detectedCodec;m&&m!=="H.264"&&y.push(m),y.push(c),a.bitrate&&y.push(a.bitrate);let h=a.audio||a.inspection?.detectedAudio||e.detectedAudio;h&&h!=="AAC 2.0"&&y.push(h);let p=a.details||y.join(" \u2022 "),u=`${n}
${p}`,s=`${o} \u2022 ${n}`,g={name:"han's 31",provider:"han's 31",title:n,description:u,url:a.url,quality:s,format:k};return a.headers&&Object.keys(a.headers).length>0&&(g.headers=a.headers),t&&t.length>0&&(g.subtitles=t),g}var F="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",ga='"Chromium";v="130", "Google Chrome";v="130", "Not-A.Brand";v="99"';async function $(a,e,o,t){let l=Date.now();z("han's 31",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${a}, T\xFCr: ${e}, Sezon: ${o}, B\xF6l\xFCm: ${t}`);try{let i=String(a||"").trim(),d=String(e||"").toLowerCase().trim(),b=d==="tv"||d==="series",n=b?"tv":"movie",C=o!=null?parseInt(String(o),10):1,k=t!=null?parseInt(String(t),10):1;if(!i)return[];let c=await K("rayleigh"),y="";b?y=`${c}/api/tv/${i}/${C}/${k}`:y=`${c}/api/movie/${i}`,z("han's 31","[Ad\u0131m 1/3] Metadata API sorgulan\u0131yor...");let m={"User-Agent":F,"sec-ch-ua":ga,"sec-ch-ua-mobile":"?0","sec-ch-ua-platform":'"Windows"',Accept:"application/json, text/javascript, */*; q=0.01","X-Requested-With":"XMLHttpRequest",Referer:c+"/"},h=await fetch(y,{headers:m,signal:AbortSignal.timeout?AbortSignal.timeout(3500):void 0});if(!h.ok)return z("han's 31",`API yan\u0131t vermedi: HTTP ${h.status}`,"warn"),[];let u=(await h.json())?.src;if(!u)return z("han's 31","API yan\u0131t\u0131nda embed ba\u011Flant\u0131s\u0131 bulunamad\u0131.","warn"),[];let s=`${c}${u}`;z("han's 31","[Ad\u0131m 2/3] Oynat\u0131c\u0131 embed sayfas\u0131 \xE7\xF6z\xFCmleniyor...");let g=await fetch(s,{headers:{Referer:c+"/","User-Agent":F},signal:AbortSignal.timeout?AbortSignal.timeout(3500):void 0});if(!g.ok)return z("han's 31",`Embed sayfas\u0131 y\xFCklenemedi: HTTP ${g.status}`,"warn"),[];let r=await g.text(),v=null,A=r.match(/window\.video\s*=\s*\{[^}]*id:\s*'([^']+)'/);if(A)v=A[1];else{let w=u.match(/\/embed\/([^?\/#]+)/);w&&(v=w[1])}if(!v)return z("han's 31","Video ID \xE7\xF6z\xFCmlenemedi.","warn"),[];let S=r.match(/window\.masterPlaylist\s*=\s*\{[\s\S]*?'token':\s*'([^']+)'/),M=r.match(/window\.masterPlaylist\s*=\s*\{[\s\S]*?'expires':\s*'([^']+)'/),T=r.match(/window\.masterPlaylist\s*=\s*\{[\s\S]*?url:\s*'([^']+)'/),I=S?S[1]:null,B=M?M[1]:null,N=T?T[1]:`${c}/playlist/${v}?b=1`;if(!I||!B)return z("han's 31","Token veya s\xFCre a\u015F\u0131m\u0131 bilgisi bulunamad\u0131.","warn"),[];let Y=r.includes("window.canPlayFHD = true"),V=N.includes("?")?"&":"?",P=`${N}${V}token=${I}&expires=${B}`;Y&&(P+="&h=1");let E=!1;try{let w=await fetch(P,{headers:{"User-Agent":F,Referer:s,Origin:c},signal:AbortSignal.timeout?AbortSignal.timeout(2500):void 0});if(w.ok){let L=(await w.text()).toLowerCase();E=L.includes("type=subtitles")&&(L.includes('name="turkish"')||L.includes('name="t\xFCrk\xE7e"')||L.includes('language="tr"')||L.includes('language="tur"')||L.includes('rendition="tr')||L.includes('rendition="tur'))}}catch{}let O=[q({name:"han's 31",url:P,languageTitle:E?"Altyaz\u0131l\u0131":"Yabanc\u0131",quality:"1080p",format:"m3u8",headers:{"User-Agent":F,Referer:s,Origin:c}})],W=((Date.now()-l)/1e3).toFixed(2);return z("han's 31",`[Ad\u0131m 3/3] TAMAMLANDI: 1 stream haz\u0131rland\u0131 (${W}s)`,"success",O.map(w=>({title:w.title,quality:"1080p",format:"m3u8"}))),O}catch(i){return z("han's 31",`Kritik Hata: ${i.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=$);

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

;(()=>{const n="han's 31",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
