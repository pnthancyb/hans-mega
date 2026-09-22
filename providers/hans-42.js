
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

"use strict";var _=Object.defineProperty;var ce=Object.getOwnPropertyDescriptor;var re=Object.getOwnPropertyNames;var ue=Object.prototype.hasOwnProperty;var ge=(a,e)=>{for(var n in e)_(a,n,{get:e[n],enumerable:!0})},de=(a,e,n,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let l of re(e))!ue.call(a,l)&&l!==n&&_(a,l,{get:()=>e[l],enumerable:!(s=ce(e,l))||s.enumerable});return a};var me=a=>de(_({},"__esModule",{value:!0}),a);var ze={};ge(ze,{getStreams:()=>se});module.exports=me(ze);var he=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(e=>String.fromCharCode(e^42)).join(""),fe={REMOTE_CONFIG_URL:he,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},Y={imu:"https://ha.vixolity.com",kalgara:"https://dizibal.org",garling:"https://liderfilmizle.vip"},U=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};U.__NUVIO_CONFIG_STATE__||(U.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var v=U.__NUVIO_CONFIG_STATE__,be=10*60*1e3;async function V(){let a=Date.now();try{let e={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let s=AbortSignal.timeout(8e3);s&&(e.signal=s)}catch{}let n=await fetch(`${fe.REMOTE_CONFIG_URL}?_t=${a}`,e);if(n.ok){let s=await n.json(),l=s?.data??s,i=l.domains||l,r=l.cookies,t=l.tmdb_keys||l.tmdbKeys;i&&typeof i=="object"&&(v.cachedDomains={...v.cachedDomains,...i}),r&&typeof r=="object"&&(v.cachedCookies={...v.cachedCookies,...r}),Array.isArray(t)&&t.length>0&&(v.cachedTmdbKeys=t),v.lastFetchTime=a}else v.lastFetchTime=0}catch{v.lastFetchTime=0}}async function ke(){let a=Date.now();(!(Object.keys(v.cachedDomains).length>0)||a-v.lastFetchTime>be)&&(v.activeFetchPromise||(v.activeFetchPromise=V().finally(()=>{v.activeFetchPromise=null})),await v.activeFetchPromise)}async function W(a){await ke();let e=v.cachedDomains[a]||Y[a]||"";return e||(await V(),e=v.cachedDomains[a]||Y[a]||""),e}function x(a,e,n="info",s){let l=`[${a}]`;n==="error"?console.error(l,e,s||""):n==="warn"?console.warn(l,e,s||""):console.log(l,e,s||"");try{let r=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof r=="string"&&r.startsWith("http")&&fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:a,level:n,message:e,details:s})}).catch(()=>{})}catch{}}var pe=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],J=["tr","tur","ota"],ye=["english","ingilizce","original","orijinal","audio-en"],Q=["en","eng","und"];function Z(a,e){let n=!1,s=!1,l=[],i,r,t,o=(e||"").toLowerCase();if(o.includes("trdual")||o.includes("dual")||o.includes("trdub")||o.includes("dublaj")?(n=!0,s=!0):(o.includes("ses-tr")||o.includes("turkcedublaj")||o.includes("turkce-dublaj"))&&(n=!0),o.includes("2160p")||o.includes("4k")||o.includes("uhd")?i="4K":o.includes("1080p")||o.includes("1920x1080")||o.includes("fhd")?i="1080p":o.includes("720p")||o.includes("1280x720")||o.includes("hd")?i="720p":(o.includes("480p")||o.includes("854x480")||o.includes("sd"))&&(i="480p"),o.includes("hevc")||o.includes("h265")||o.includes("x265")?r="HEVC":o.includes("av1")?r="AV1":(o.includes("h264")||o.includes("x264")||o.includes("avc"))&&(r="H.264"),o.includes("5.1")||o.includes("eac3")||o.includes("ac3")||o.includes("ddp")?t="Dolby 5.1":(o.includes("7.1")||o.includes("atmos"))&&(t="Dolby Atmos 7.1"),a&&typeof a=="string"){let h=a.split(/\r?\n/),d=0;for(let p of h){let f=p.trim();if(f.startsWith("#EXT-X-MEDIA:")&&f.includes("TYPE=AUDIO")){let b=f.match(/NAME=["']([^"']+)["']/i),m=f.match(/LANGUAGE=["']([^"']+)["']/i),c=f.match(/GROUP-ID=["']([^"']+)["']/i),g=(b?b[1]:"").toLowerCase(),T=(m?m[1]:"").toLowerCase(),k=(c?c[1]:"").toLowerCase(),A=g.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),z=k.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),w=J.includes(T)||J.some(S=>A.includes(S)||z.includes(S))||pe.some(S=>g.includes(S)||k.includes(S))||g.includes("t\xFCrk")||g.includes("turk")||k.includes("dual"),P=Q.includes(T)||Q.some(S=>A.includes(S)||z.includes(S))||ye.some(S=>g.includes(S)||k.includes(S))||g.includes("orig")||g.includes("ing")||g.includes("eng");w&&(n=!0),P&&(s=!0)}if(f.startsWith("#EXT-X-MEDIA:")&&f.includes("TYPE=SUBTITLES")){let b=f.match(/URI=["']([^"']+)["']/i),m=f.match(/NAME=["']([^"']+)["']/i),c=f.match(/LANGUAGE=["']([^"']+)["']/i);if(b&&b[1]){let g=b[1];if(e&&!g.startsWith("http"))try{g=new URL(g,e).toString()}catch{}let T=m?m[1]:"Altyaz\u0131",k=c?c[1].toLowerCase():"";k==="st"||k==="sot"||T.toLowerCase().includes("sotho")||T.toLowerCase().includes("sesotho")||g.toLowerCase().includes("sub_st")?(k="tr",T="T\xFCrk\xE7e"):k||(k=T.toLowerCase().includes("t\xFCrk")?"tr":"und");let z=K(k,T);l.push({label:z.name||T,url:g,lang:z.code||k})}}if(f.startsWith("#EXT-X-STREAM-INF:")){let b=f.match(/RESOLUTION=(\d+)x(\d+)/i);if(b){let m=parseInt(b[1],10),c=parseInt(b[2],10),g=Math.min(m,c),T=Math.max(m,c),k=g>=2100||T>=3800?2160:g>=1400||T>=2500?1440:g>=1e3||T>=1900?1080:g>=700||T>=1200?720:g>=450?480:g;k>d&&(d=k)}else{let m=f.match(/NAME=["']?([^"',\s]+)["']?/i);if(m){let c=m[1].toLowerCase();c.includes("2160")||c.includes("4k")?2160>d&&(d=2160):c.includes("1440")||c.includes("2k")?1440>d&&(d=1440):c.includes("1080")?1080>d&&(d=1080):c.includes("720")&&720>d&&(d=720)}}}}d>=2160?i="4K":d>=1440?i="2K":d>=1080?i="1080p":d>=720?i="720p":d>=480&&(i="480p")}let u=n&&s||o.includes("dual")||o.includes("trdual");return{hasTurkishAudio:n,hasOriginalAudio:s,isDual:u,embeddedSubtitles:l,detectedQuality:i,detectedCodec:r,detectedAudio:t}}function Te(a){let{hasTurkishAudio:e,hasOriginalAudio:n,isDual:s,hasSubtitles:l,hasTurkishSubtitles:i,isYerli:r,siteHint:t,defaultTitle:o}=a;if(r||t?.isYerli)return"Yerli";if(t?.label){let u=t.label.toLowerCase();if((u.includes("dub")||u.includes("t\xFCrk"))&&(u.includes("alt")||u.includes("sub")))return"Dublaj / Altyaz\u0131l\u0131";if(u.includes("dub")||u.includes("t\xFCrk\xE7e ses"))return"Dublaj";if(u.includes("alt")||u.includes("sub"))return"Altyaz\u0131l\u0131";if(u.includes("orijinal")||u.includes("original"))return"Orijinal"}return s||e&&(n||i)?"Dublaj / Altyaz\u0131l\u0131":e||t?.isDublaj?"Dublaj":i||t?.isAltyazi?"Altyaz\u0131l\u0131":o||(e?"Dublaj":"Orijinal")}var M={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function K(a,e,n){let s=c=>(c||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),l=s(a||""),i=s(e||""),r=!!n||l.includes("forced")||i.includes("forced")||l.includes("zorunlu")||i.includes("zorunlu"),t=l.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),o=i.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),u=c=>{let g=c.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return r?`${g} (Zorunlu)`:g};if(t==="st"||t==="sot"||t.includes("sotho")||o.includes("sotho")||o.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:r?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let h=M[l]||M[i]||M[t]||M[o];if(!h){let c=(o+" "+t).split(/\s+/).filter(Boolean);for(let g of c)if(M[g]){h=M[g];break}}if(!h){for(let[c,g]of Object.entries(M))if(c.length>=4&&(o.includes(c)||t.includes(c))){h=g;break}}if(h)return{code:h.code,iso3:h.iso3,language:h.language,name:u(h.name)};let d=(e||a||"Altyaz\u0131").trim();d=d.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let p=d.charAt(0).toUpperCase()+d.slice(1),f=u(p),b=l&&l.length===2?l:i&&i.length===2?i:"und",m=l&&l.length===3?l:i&&i.length===3?i:"und";return{code:b,iso3:m,language:p,name:f}}function X(a,e){let n=[],s=new Set,l=[...a||[],...e||[]];for(let i of l){if(!i||!i.url)continue;let r=i.url.trim();if(s.has(r))continue;s.add(r);let t=K(i.lang,i.label||i.name||i.language),o=t.name||i.label||i.name||"Altyaz\u0131";n.push({id:String(n.length),url:r,label:o,name:o,language:t.language,lang:t.code,langCode:t.iso3,headers:i.headers})}return n}function ee(a){let{m3u8Text:e,m3u8Url:n,externalSubtitles:s,siteHint:l,defaultTitle:i}=a,r=Z(e,n),t=X(s),o=X(s,r.embeddedSubtitles),u=o.length>0||!!l?.isAltyazi,h=o.some(m=>m.lang==="tr"||m.lang==="st"||m.lang==="sot"||m.langCode==="tur"||m.langCode==="sot"||m.label?.toLowerCase().includes("t\xFCrk")||m.label?.toLowerCase().includes("sotho")||m.language==="Turkish"||m.language?.toLowerCase().includes("sotho")),d=r.hasTurkishAudio||!!l?.isDublaj,p=r.hasOriginalAudio,f=r.isDual||d&&(h||p),b=Te({hasTurkishAudio:d,hasOriginalAudio:p,isDual:f,hasSubtitles:u,hasTurkishSubtitles:h,isYerli:l?.isYerli,siteHint:l,defaultTitle:i});return{hasTurkishAudio:d,hasOriginalAudio:p,isDual:f,hasSubtitles:u,hasTurkishSubtitles:h,isYerli:l?.isYerli,languageTitle:b,subtitles:t,detectedQuality:r.detectedQuality,detectedCodec:r.detectedCodec,detectedAudio:r.detectedAudio}}function ae(a){let e=a.url?Z(void 0,a.url):{},n=a.quality||a.inspection?.detectedQuality||e.detectedQuality||"1080p";n.includes("\u2022")&&(n=n.split("\u2022")[0].trim()),!n.includes("p")&&!n.includes("K")&&!n.includes("k")&&(n=`${n}p`);let s=a.subtitles||a.inspection?.subtitles,l=!!(a.inspection?.hasTurkishSubtitles||s?.some(k=>{let A=(k.lang||k.code||"").toLowerCase(),z=(k.langCode||k.iso3||"").toLowerCase(),w=(k.name||k.label||k.title||"").toLowerCase();return A==="tr"||A==="st"||z==="tur"||z==="sot"||w.includes("t\xFCrk")||w.includes("turk")||w.includes("sotho")})),i=(a.languageTitle||a.inspection?.languageTitle||"").toLowerCase().trim(),r=i.includes("dub")||i.includes("ses")||i.includes("dual")||!!e.hasTurkishAudio||!!a.inspection?.hasTurkishAudio,t=i.includes("dual")||i.includes("dub")&&(i.includes("alt")||i.includes("sub"))||r&&l,o="Orijinal";i.includes("yerli")||a.inspection?.isYerli?o="Yerli":t?o="Dublaj / Altyaz\u0131l\u0131":r?o="Dublaj":l||i.includes("alt")||i.includes("sub")?o="Altyaz\u0131l\u0131":(i.includes("orijinal")||i.includes("yabanc\u0131")||i.includes("original"))&&(o="Orijinal");let u=a.format==="m3u8"||a.url.includes(".m3u8")||a.url.includes("/master.")||a.url.includes("/hls/")||a.url.includes("/txt/"),h=a.format||(u?"m3u8":a.url.includes(".mp4")?"mp4":"m3u8"),d=h==="m3u8"?"HLS":h.toUpperCase(),p=[n],f=a.codec||a.inspection?.detectedCodec||e.detectedCodec;f&&f!=="H.264"&&p.push(f),p.push(d),a.bitrate&&p.push(a.bitrate);let b=a.audio||a.inspection?.detectedAudio||e.detectedAudio;b&&b!=="AAC 2.0"&&p.push(b);let m=a.details||p.join(" \u2022 "),c=`${o}
${m}`,g=`${n} \u2022 ${o}`,T={name:"han's 42",provider:"han's 42",title:o,description:c,url:a.url,quality:g,format:h};return a.headers&&Object.keys(a.headers).length>0&&(T.headers=a.headers),s&&s.length>0&&(T.subtitles=s),T}function ne(a){return[...a].sort((e,n)=>{let s=(e.label||e.name||"").toLowerCase().includes("forced")||(e.label||e.name||"").toLowerCase().includes("zorunlu"),l=(n.label||n.name||"").toLowerCase().includes("forced")||(n.label||n.name||"").toLowerCase().includes("zorunlu"),i=e.lang==="tr"||e.lang==="tur"||e.lang==="st"||e.langCode==="tur"||e.langCode==="sot"||(e.label||e.name||"").toLowerCase().includes("t\xFCrk")||(e.label||e.name||"").toLowerCase().includes("sotho"),r=n.lang==="tr"||n.lang==="tur"||n.lang==="st"||n.langCode==="tur"||n.langCode==="sot"||(n.label||n.name||"").toLowerCase().includes("t\xFCrk")||(n.label||n.name||"").toLowerCase().includes("sotho");if(i&&r)return!s&&l?-1:s&&!l?1:0;if(i&&!r)return-1;if(!i&&r)return 1;let t=e.lang==="en"||e.lang==="eng"||e.langCode==="eng"||(e.label||e.name||"").toLowerCase().includes("ing"),o=n.lang==="en"||n.lang==="eng"||n.langCode==="eng"||(n.label||n.name||"").toLowerCase().includes("ing");if(t&&!o)return-1;if(!t&&o)return 1;let u=e.label||e.name||e.title||"",h=n.label||n.name||n.title||"";return u.localeCompare(h,"tr")})}function ie(a,e){let n=K(a,e);return{iso2:n.code,iso3:n.iso3,enName:n.language,trLabel:n.name}}var F="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",oe=[{name:"Poseidon",key:"s25"},{name:"Athena",key:"s2"},{name:"Zeus",key:"mapple"},{name:"Hera",key:"s4"},{name:"Apollo",key:"s19"},{name:"Atlas",key:"s1"},{name:"Hephaestus",key:"s15"}];function C(a,e){return a>>>e|a<<32-e}function Se(a){let e=[],n=a.length*8,s=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],l=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];for(let t=0;t<a.length;t++)e[t>>2]|=a.charCodeAt(t)<<24-t%4*8;e[n>>5]|=128<<24-n%32,e[(n+64>>9<<4)+15]=n;let i=new Array(64);for(let t=0;t<e.length;t+=16){let o=s[0],u=s[1],h=s[2],d=s[3],p=s[4],f=s[5],b=s[6],m=s[7];for(let c=0;c<64;c++){if(c<16)i[c]=e[t+c]|0;else{let P=C(i[c-15],7)^C(i[c-15],18)^i[c-15]>>>3,S=C(i[c-2],17)^C(i[c-2],19)^i[c-2]>>>10;i[c]=i[c-16]+P+i[c-7]+S|0}let g=C(p,6)^C(p,11)^C(p,25),T=p&f^~p&b,k=m+g+T+l[c]+i[c]|0,A=C(o,2)^C(o,13)^C(o,22),z=o&u^o&h^u&h,w=A+z|0;m=b,b=f,f=p,p=d+k|0,d=h,h=u,u=o,o=k+w|0}s[0]=s[0]+o|0,s[1]=s[1]+u|0,s[2]=s[2]+h|0,s[3]=s[3]+d|0,s[4]=s[4]+p|0,s[5]=s[5]+f|0,s[6]=s[6]+b|0,s[7]=s[7]+m|0}let r="";for(let t=0;t<8;t++)for(let o=3;o>=0;o--){let u=s[t]>>o*8&255;r+=(u<16?"0":"")+u.toString(16)}return r}function ve(a){let e=0;for(let n=0;n<a.length;n++){let s=parseInt(a[n],16);if(s===0)e+=4;else{s&8||(e+=1,s&4||(e+=1,s&2||(e+=1)));break}}return e}function Ae(a,e){let n=0;for(;n<1e7;){let s=Se(a+n);if(ve(s)>=e)return n;n++}return n}async function se(a,e,n,s){let l=Date.now(),i=Number(a);if(!i||isNaN(i))return x("han's 42","Ge\xE7ersiz TMDB ID.","warn"),[];let r=e==="tv"||e==="series",t=r?"tv":"movie",o=r?`${n||1}-${s||1}`:"",u=await W("momonosuke");if(!u)return x("han's 42","Domain not resolved","warn"),[];let h=r?`${u}/watch/tv/${i}-${o}`:`${u}/watch/movie/${i}`;x("han's 42",`[Ad\u0131m 1/3] Oturum ba\u015Flat\u0131l\u0131yor: ${t.toUpperCase()} (TMDB: ${i}${r?` S${n}E${s}`:""})`);try{let d=await fetch(h,{headers:{"User-Agent":F},signal:AbortSignal.timeout?AbortSignal.timeout(4e3):void 0}),p="",f=d.headers;if(typeof f.getSetCookie=="function"){let y=f.getSetCookie();Array.isArray(y)&&(p=y.map(D=>D.split(";")[0]).join("; "))}!p&&d.headers.get("set-cookie")&&(p=(d.headers.get("set-cookie")||"").split(",").map(y=>y.split(";")[0]).join("; "));let b={"User-Agent":F,Referer:h,Origin:u};p&&(b.Cookie=p);let m=await fetch(`${u}/api/request-token`,{method:"POST",headers:{...b,"Content-Length":"0"},body:"",signal:AbortSignal.timeout?AbortSignal.timeout(3e3):void 0});if(!m.ok)return x("han's 42",`Request token al\u0131namad\u0131 (HTTP ${m.status}).`,"warn"),[];let g=(await m.json())?.token;if(!g)return x("han's 42","Request token bo\u015F d\xF6nd\xFC.","warn"),[];let T={mediaId:i,mediaType:t,tv_slug:o,requestToken:g},k=await fetch(`${u}/api/playback-init`,{method:"POST",headers:{...b,"Content-Type":"application/json"},body:JSON.stringify(T),signal:AbortSignal.timeout?AbortSignal.timeout(3e3):void 0});if(!k.ok)return x("han's 42",`Playback-init ba\u015Far\u0131s\u0131z (HTTP ${k.status}).`,"warn"),[];let A=await k.json(),z=A?.token;if(A?.requiresPow&&A?.pow){let y=A.pow.challenge,D=Number(A.pow.difficulty)||18,B=A.pow.challengeId,O=Ae(y,D),R=await fetch(`${u}/api/playback-init`,{method:"POST",headers:{...b,"Content-Type":"application/json"},body:JSON.stringify({...T,pow:{challengeId:B,nonce:O}}),signal:AbortSignal.timeout?AbortSignal.timeout(3e3):void 0});R.ok&&(z=(await R.json())?.token)}if(!z)return x("han's 42","Oynatma yetkilendirme anahtar\u0131 (Playback Token) al\u0131namad\u0131.","warn"),[];x("han's 42",`[Ad\u0131m 2/3] Sunucular taran\u0131yor... (${oe.length} aktif kaynak paralel sorgulan\u0131yor)`);let w=async y=>{try{let D=await fetch(`${u}/api/encrypt`,{method:"POST",headers:{...b,"Content-Type":"application/json"},body:JSON.stringify({data:{mediaId:i,mediaType:t,tv_slug:o,source:y.key},endpoint:"stream-encrypted",requestToken:g}),signal:AbortSignal.timeout?AbortSignal.timeout(2800):void 0});if(!D.ok)return null;let B=await D.json();if(!B?.url)return null;let O=`${u}${B.url}&requestToken=${encodeURIComponent(g)}&token=${encodeURIComponent(z)}`,R=await fetch(O,{headers:b,signal:AbortSignal.timeout?AbortSignal.timeout(2800):void 0});if(!R.ok)return null;let E=await R.json(),N=E?.data?.stream_url;if(!E?.success||!N||typeof N!="string")return null;let $=E.data.subtitles,I=[];if(Array.isArray($))for(let L of $){if(!L?.url)continue;let j=ie(L.lang||L.language,L.label||L.title);I.push({id:String(I.length),language:j.enName,name:j.trLabel,label:j.trLabel,title:j.trLabel,lang:j.iso2,langCode:j.iso3,url:L.url})}let G=ne(I),q;try{let L=await fetch(N,{headers:{"User-Agent":F,Referer:`${u}/`},signal:AbortSignal.timeout?AbortSignal.timeout(1200):void 0});L.ok&&(q=await L.text())}catch{}let le=ee({m3u8Text:q,m3u8Url:N,externalSubtitles:G});return ae({name:`han's 42 [${y.name}]`,url:N,inspection:le,format:"m3u8",subtitles:G.length>0?G:void 0,headers:{"User-Agent":F,Referer:`${u}/`}})}catch{return null}},P=await Promise.allSettled(oe.map(y=>w(y))),S=[];for(let y of P)y.status==="fulfilled"&&y.value&&S.push(y.value);if(S.length===0)return x("han's 42","\xC7al\u0131\u015Fan sunucu ak\u0131\u015F\u0131 bulunamad\u0131.","warn"),[];let H=y=>y.includes("4K")||y.includes("2160")?2160:y.includes("2K")||y.includes("1440")?1440:y.includes("1080")?1080:y.includes("720")?720:y.includes("480")?480:360;S.sort((y,D)=>H(D.quality)-H(y.quality));let te=((Date.now()-l)/1e3).toFixed(2);return x("han's 42",`[Ad\u0131m 3/3] TAMAMLANDI: ${S.length} adet ana HLS ak\u0131\u015F\u0131 haz\u0131rland\u0131 (${te}s).`,"success",S.map(y=>({sunucu:y.name,kalite:y.quality,format:y.format}))),S}catch(d){return x("han's 42",`Kritik Hata: ${d?.message||d}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=se);

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

;(()=>{const n="han's 42",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
