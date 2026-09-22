
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

"use strict";var B=Object.defineProperty;var oe=Object.getOwnPropertyDescriptor;var le=Object.getOwnPropertyNames;var re=Object.prototype.hasOwnProperty;var ce=(n,t)=>{for(var s in t)B(n,s,{get:t[s],enumerable:!0})},ue=(n,t,s,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let c of le(t))!re.call(n,c)&&c!==s&&B(n,c,{get:()=>t[c],enumerable:!(r=oe(t,c))||r.enumerable});return n};var ge=n=>ue(B({},"__esModule",{value:!0}),n);var ye={};ce(ye,{getStreams:()=>te});module.exports=ge(ye);var de=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(t=>String.fromCharCode(t^42)).join(""),me={REMOTE_CONFIG_URL:de,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},K={imu:"https://ha.vixolity.com",kalgara:"https://dizibal.org",garling:"https://liderfilmizle.vip"},U=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};U.__NUVIO_CONFIG_STATE__||(U.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var A=U.__NUVIO_CONFIG_STATE__,he=10*60*1e3;async function x(){let n=Date.now();try{let t={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let r=AbortSignal.timeout(8e3);r&&(t.signal=r)}catch{}let s=await fetch(`${me.REMOTE_CONFIG_URL}?_t=${n}`,t);if(s.ok){let r=await s.json(),c=r?.data??r,i=c.domains||c,u=c.cookies,g=c.tmdb_keys||c.tmdbKeys;i&&typeof i=="object"&&(A.cachedDomains={...A.cachedDomains,...i}),u&&typeof u=="object"&&(A.cachedCookies={...A.cachedCookies,...u}),Array.isArray(g)&&g.length>0&&(A.cachedTmdbKeys=g),A.lastFetchTime=n}else A.lastFetchTime=0}catch{A.lastFetchTime=0}}async function H(){let n=Date.now();(!(Object.keys(A.cachedDomains).length>0)||n-A.lastFetchTime>he)&&(A.activeFetchPromise||(A.activeFetchPromise=x().finally(()=>{A.activeFetchPromise=null})),await A.activeFetchPromise)}async function q(n){await H();let t=A.cachedDomains[n]||K[n]||"";return t||(await x(),t=A.cachedDomains[n]||K[n]||""),t}async function Y(){return await H(),A.cachedTmdbKeys||[]}function z(n,t,s="info",r){let c=`[${n}]`;s==="error"?console.error(c,t,r||""):s==="warn"?console.warn(c,t,r||""):console.log(c,t,r||"");try{let u=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof u=="string"&&u.startsWith("http")&&fetch(u,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:n,level:s,message:t,details:r})}).catch(()=>{})}catch{}}var pe=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],W=["tr","tur","ota"],fe=["english","ingilizce","original","orijinal","audio-en"],V=["en","eng","und"];function X(n,t){let s=!1,r=!1,c=[],i,u,g,a=(t||"").toLowerCase();if(a.includes("trdual")||a.includes("dual")||a.includes("trdub")||a.includes("dublaj")?(s=!0,r=!0):(a.includes("ses-tr")||a.includes("turkcedublaj")||a.includes("turkce-dublaj"))&&(s=!0),a.includes("2160p")||a.includes("4k")||a.includes("uhd")?i="4K":a.includes("1080p")||a.includes("1920x1080")||a.includes("fhd")?i="1080p":a.includes("720p")||a.includes("1280x720")||a.includes("hd")?i="720p":(a.includes("480p")||a.includes("854x480")||a.includes("sd"))&&(i="480p"),a.includes("hevc")||a.includes("h265")||a.includes("x265")?u="HEVC":a.includes("av1")?u="AV1":(a.includes("h264")||a.includes("x264")||a.includes("avc"))&&(u="H.264"),a.includes("5.1")||a.includes("eac3")||a.includes("ac3")||a.includes("ddp")?g="Dolby 5.1":(a.includes("7.1")||a.includes("atmos"))&&(g="Dolby Atmos 7.1"),n&&typeof n=="string"){let k=n.split(/\r?\n/),p=0;for(let v of k){let f=v.trim();if(f.startsWith("#EXT-X-MEDIA:")&&f.includes("TYPE=AUDIO")){let e=f.match(/NAME=["']([^"']+)["']/i),d=f.match(/LANGUAGE=["']([^"']+)["']/i),m=f.match(/GROUP-ID=["']([^"']+)["']/i),o=(e?e[1]:"").toLowerCase(),l=(d?d[1]:"").toLowerCase(),h=(m?m[1]:"").toLowerCase(),_=o.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),S=h.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),w=W.includes(l)||W.some(T=>_.includes(T)||S.includes(T))||pe.some(T=>o.includes(T)||h.includes(T))||o.includes("t\xFCrk")||o.includes("turk")||h.includes("dual"),y=V.includes(l)||V.some(T=>_.includes(T)||S.includes(T))||fe.some(T=>o.includes(T)||h.includes(T))||o.includes("orig")||o.includes("ing")||o.includes("eng");w&&(s=!0),y&&(r=!0)}if(f.startsWith("#EXT-X-MEDIA:")&&f.includes("TYPE=SUBTITLES")){let e=f.match(/URI=["']([^"']+)["']/i),d=f.match(/NAME=["']([^"']+)["']/i),m=f.match(/LANGUAGE=["']([^"']+)["']/i);if(e&&e[1]){let o=e[1];if(t&&!o.startsWith("http"))try{o=new URL(o,t).toString()}catch{}let l=d?d[1]:"Altyaz\u0131",h=m?m[1].toLowerCase():"";h==="st"||h==="sot"||l.toLowerCase().includes("sotho")||l.toLowerCase().includes("sesotho")||o.toLowerCase().includes("sub_st")?(h="tr",l="T\xFCrk\xE7e"):h||(h=l.toLowerCase().includes("t\xFCrk")?"tr":"und");let S=Q(h,l);c.push({label:S.name||l,url:o,lang:S.code||h})}}if(f.startsWith("#EXT-X-STREAM-INF:")){let e=f.match(/RESOLUTION=(\d+)x(\d+)/i);if(e){let d=parseInt(e[1],10),m=parseInt(e[2],10),o=Math.min(d,m),l=Math.max(d,m),h=o>=2100||l>=3800?2160:o>=1400||l>=2500?1440:o>=1e3||l>=1900?1080:o>=700||l>=1200?720:o>=450?480:o;h>p&&(p=h)}else{let d=f.match(/NAME=["']?([^"',\s]+)["']?/i);if(d){let m=d[1].toLowerCase();m.includes("2160")||m.includes("4k")?2160>p&&(p=2160):m.includes("1440")||m.includes("2k")?1440>p&&(p=1440):m.includes("1080")?1080>p&&(p=1080):m.includes("720")&&720>p&&(p=720)}}}}p>=2160?i="4K":p>=1440?i="2K":p>=1080?i="1080p":p>=720?i="720p":p>=480&&(i="480p")}let b=s&&r||a.includes("dual")||a.includes("trdual");return{hasTurkishAudio:s,hasOriginalAudio:r,isDual:b,embeddedSubtitles:c,detectedQuality:i,detectedCodec:u,detectedAudio:g}}function be(n){let{hasTurkishAudio:t,hasOriginalAudio:s,isDual:r,hasSubtitles:c,hasTurkishSubtitles:i,isYerli:u,siteHint:g,defaultTitle:a}=n;if(u||g?.isYerli)return"Yerli";if(g?.label){let b=g.label.toLowerCase();if((b.includes("dub")||b.includes("t\xFCrk"))&&(b.includes("alt")||b.includes("sub")))return"Dublaj / Altyaz\u0131l\u0131";if(b.includes("dub")||b.includes("t\xFCrk\xE7e ses"))return"Dublaj";if(b.includes("alt")||b.includes("sub"))return"Altyaz\u0131l\u0131";if(b.includes("orijinal")||b.includes("original"))return"Orijinal"}return r||t&&(s||i)?"Dublaj / Altyaz\u0131l\u0131":t||g?.isDublaj?"Dublaj":i||g?.isAltyazi?"Altyaz\u0131l\u0131":a||(t?"Dublaj":"Orijinal")}var I={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function Q(n,t,s){let r=m=>(m||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),c=r(n||""),i=r(t||""),u=!!s||c.includes("forced")||i.includes("forced")||c.includes("zorunlu")||i.includes("zorunlu"),g=c.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),a=i.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),b=m=>{let o=m.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return u?`${o} (Zorunlu)`:o};if(g==="st"||g==="sot"||g.includes("sotho")||a.includes("sotho")||a.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:u?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let k=I[c]||I[i]||I[g]||I[a];if(!k){let m=(a+" "+g).split(/\s+/).filter(Boolean);for(let o of m)if(I[o]){k=I[o];break}}if(!k){for(let[m,o]of Object.entries(I))if(m.length>=4&&(a.includes(m)||g.includes(m))){k=o;break}}if(k)return{code:k.code,iso3:k.iso3,language:k.language,name:b(k.name)};let p=(t||n||"Altyaz\u0131").trim();p=p.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let v=p.charAt(0).toUpperCase()+p.slice(1),f=b(v),e=c&&c.length===2?c:i&&i.length===2?i:"und",d=c&&c.length===3?c:i&&i.length===3?i:"und";return{code:e,iso3:d,language:v,name:f}}function J(n,t){let s=[],r=new Set,c=[...n||[],...t||[]];for(let i of c){if(!i||!i.url)continue;let u=i.url.trim();if(r.has(u))continue;r.add(u);let g=Q(i.lang,i.label||i.name||i.language),a=g.name||i.label||i.name||"Altyaz\u0131";s.push({id:String(s.length),url:u,label:a,name:a,language:g.language,lang:g.code,langCode:g.iso3,headers:i.headers})}return s}function Z(n){let{m3u8Text:t,m3u8Url:s,externalSubtitles:r,siteHint:c,defaultTitle:i}=n,u=X(t,s),g=J(r),a=J(r,u.embeddedSubtitles),b=a.length>0||!!c?.isAltyazi,k=a.some(d=>d.lang==="tr"||d.lang==="st"||d.lang==="sot"||d.langCode==="tur"||d.langCode==="sot"||d.label?.toLowerCase().includes("t\xFCrk")||d.label?.toLowerCase().includes("sotho")||d.language==="Turkish"||d.language?.toLowerCase().includes("sotho")),p=u.hasTurkishAudio||!!c?.isDublaj,v=u.hasOriginalAudio,f=u.isDual||p&&(k||v),e=be({hasTurkishAudio:p,hasOriginalAudio:v,isDual:f,hasSubtitles:b,hasTurkishSubtitles:k,isYerli:c?.isYerli,siteHint:c,defaultTitle:i});return{hasTurkishAudio:p,hasOriginalAudio:v,isDual:f,hasSubtitles:b,hasTurkishSubtitles:k,isYerli:c?.isYerli,languageTitle:e,subtitles:g,detectedQuality:u.detectedQuality,detectedCodec:u.detectedCodec,detectedAudio:u.detectedAudio}}function ee(n){let t=n.url?X(void 0,n.url):{},s=n.quality||n.inspection?.detectedQuality||t.detectedQuality||"1080p";s.includes("\u2022")&&(s=s.split("\u2022")[0].trim()),!s.includes("p")&&!s.includes("K")&&!s.includes("k")&&(s=`${s}p`);let r=n.subtitles||n.inspection?.subtitles,c=!!(n.inspection?.hasTurkishSubtitles||r?.some(h=>{let _=(h.lang||h.code||"").toLowerCase(),S=(h.langCode||h.iso3||"").toLowerCase(),w=(h.name||h.label||h.title||"").toLowerCase();return _==="tr"||_==="st"||S==="tur"||S==="sot"||w.includes("t\xFCrk")||w.includes("turk")||w.includes("sotho")})),i=(n.languageTitle||n.inspection?.languageTitle||"").toLowerCase().trim(),u=i.includes("dub")||i.includes("ses")||i.includes("dual")||!!t.hasTurkishAudio||!!n.inspection?.hasTurkishAudio,g=i.includes("dual")||i.includes("dub")&&(i.includes("alt")||i.includes("sub"))||u&&c,a="Orijinal";i.includes("yerli")||n.inspection?.isYerli?a="Yerli":g?a="Dublaj / Altyaz\u0131l\u0131":u?a="Dublaj":c||i.includes("alt")||i.includes("sub")?a="Altyaz\u0131l\u0131":(i.includes("orijinal")||i.includes("yabanc\u0131")||i.includes("original"))&&(a="Orijinal");let b=n.format==="m3u8"||n.url.includes(".m3u8")||n.url.includes("/master.")||n.url.includes("/hls/")||n.url.includes("/txt/"),k=n.format||(b?"m3u8":n.url.includes(".mp4")?"mp4":"m3u8"),p=k==="m3u8"?"HLS":k.toUpperCase(),v=[s],f=n.codec||n.inspection?.detectedCodec||t.detectedCodec;f&&f!=="H.264"&&v.push(f),v.push(p),n.bitrate&&v.push(n.bitrate);let e=n.audio||n.inspection?.detectedAudio||t.detectedAudio;e&&e!=="AAC 2.0"&&v.push(e);let d=n.details||v.join(" \u2022 "),m=`${a}
${d}`,o=`${s} \u2022 ${a}`,l={name:"han's 27",provider:"han's 27",title:a,description:m,url:n.url,quality:o,format:k};return n.headers&&Object.keys(n.headers).length>0&&(l.headers=n.headers),r&&r.length>0&&(l.subtitles=r),l}var ke="a2f888b27315e62e471b2d587048f32e",ae=[ke,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function ne(n){let t=await Y(),s=t.length>0?[...t,...ae]:ae;for(let r=0;r<s.length;r++){let c=s[r],i=n.includes("?")?"&":"?",u=`https://api.themoviedb.org/3/${n}${i}api_key=${c}`;try{let g=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,a=await fetch(u,{signal:g});if(a.ok)return await a.json();if(a.status===429)continue}catch{}}return null}var R=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};R.__NUVIO_TMDB_CACHE__||(R.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var L=R.__NUVIO_TMDB_CACHE__,Se=L.imdbIdCache,j=L.tmdbTitlesCache,Ce=L.tmdbImageCache,we=L.episodeGroupCache,De=L.absoluteEpCache;async function ie(n,t){let s=String(n||"").replace(/^tmdb:/i,"").trim();if(!s)return{titles:[]};let r=`${t}:${s}`;if(j.has(r))return j.get(r);let c=(async()=>{let i=[],u,g,a=[],b=[],k,p=[];try{let v=t==="tv"||t==="series",f=v?"tv":"movie";if(s.startsWith("tt")){let e=await ne(`find/${s}?external_source=imdb_id`);if(e){let d=v?e?.tv_results?.[0]:e?.movie_results?.[0];d&&(u=d.id,d.overview&&(k=d.overview))}}else u=parseInt(s,10);if(u&&!isNaN(u)){let e=await ne(`${f}/${u}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(e){if(e.overview&&(k=e.overview),e.title&&(i.push(e.title),e.title.includes(":"))){let l=e.title.split(":")[0].trim();l.length>2&&i.push(l)}if(e.name&&(i.push(e.name),e.name.includes(":"))){let l=e.name.split(":")[0].trim();l.length>2&&i.push(l)}if(e.original_title&&e.original_title!==e.title&&(i.push(e.original_title),e.original_title.includes(":"))){let l=e.original_title.split(":")[0].trim();l.length>2&&i.push(l)}if(e.original_name&&e.original_name!==e.name&&(i.push(e.original_name),e.original_name.includes(":"))){let l=e.original_name.split(":")[0].trim();l.length>2&&i.push(l)}if(e.translations?.translations&&Array.isArray(e.translations.translations))for(let l of e.translations.translations){let h=l.data?.name||l.data?.title;if(h&&typeof h=="string"&&(i.push(h),h.includes(":"))){let _=h.split(":")[0].trim();_.length>2&&i.push(_)}}let d=(e.alternative_titles?.results||e.alternative_titles?.titles||[]).map(l=>l.title).filter(Boolean);i.push(...d);let m=e.release_date||e.first_air_date;m&&(g=parseInt(m.split("-")[0],10)),e.genres&&Array.isArray(e.genres)&&(p=e.genres.map(l=>l.name).filter(Boolean)),e.credits?.cast&&Array.isArray(e.credits.cast)&&(a=e.credits.cast.slice(0,10).map(l=>l.name).filter(Boolean));let o=[];e.created_by&&Array.isArray(e.created_by)&&o.push(...e.created_by.map(l=>l.name).filter(Boolean)),e.credits?.crew&&Array.isArray(e.credits.crew)&&o.push(...e.credits.crew.filter(l=>l.job==="Director"||l.department==="Directing").map(l=>l.name).filter(Boolean)),b=Array.from(new Set(o))}}}catch{}return{numericId:u,titles:Array.from(new Set(i.filter(Boolean))),year:g,cast:a,creators:b,overview:k,genres:p}})();return j.set(r,c),c}var M="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";async function te(n,t,s,r){let c=Date.now();if(typeof n=="object"&&n!==null){let a=n;n=a.id||a.tmdbId||a.imdbId,t=a.type||a.mediaType,s=a.season??a.seasonNum,r=a.episode??a.episodeNum}let i=String(n||"").trim();i.toLowerCase().startsWith("tmdb:")&&(i=i.slice(5));let u=i.split(":"),g=u[0].trim();u.length>=3&&s===void 0&&(s=parseInt(u[1],10),r=parseInt(u[2],10)),z("han's 27",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${g}, T\xFCr: ${t}, Sezon: ${s||"-"}, B\xF6l\xFCm: ${r||"-"}`);try{let a=String(t||"").toLowerCase().trim(),b=a==="tv"||a==="series",k=b?"tv":"movie",p=s!=null?parseInt(String(s),10):1,v=r!=null?parseInt(String(r),10):1;if(!g)return[];let f=null;if(g.startsWith("tt")?f=(await ie(g,k)).numericId||null:f=parseInt(g,10),!f)return z("han's 27","Ge\xE7erli TMDB ID \xE7\xF6z\xFClemedi.","warn"),[];let e=await q("dragon");if(!e)return z("han's 27","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let d=b?`${e}/api/movies/by-tmdb/${f}?season=${p}&episode=${v}`:`${e}/api/movies/by-tmdb/${f}`;z("han's 27",`[Ad\u0131m 1/4] TMDB ID (${f}) ile API sorgulan\u0131yor...`);let m=await fetch(d,{headers:{"User-Agent":M,Referer:`${e}/`,Accept:"application/json, text/plain, */*"}});if(!m.ok)return z("han's 27",`\u0130\xE7erik veritaban\u0131nda bulunamad\u0131 (HTTP ${m.status})`,"warn"),[];let o=await m.json();if(!o||!o.id)return z("han's 27","API yan\u0131t\u0131nda ge\xE7erli i\xE7erik nesnesi yok.","warn"),[];z("han's 27",` \u0130\xE7erik Do\u011Fruland\u0131: "${o.title}" (${o.year||"-"}) - Kay\u0131t ID: ${o.id}`,"success");let l=[];o.subtitleTr&&l.push({id:"0",url:o.subtitleTr,language:"Turkish",name:"T\xFCrk\xE7e",lang:"tur",label:"T\xFCrk\xE7e",headers:{Referer:`${e}/`,Origin:e,"User-Agent":"okhttp/4.9.2"}}),o.subtitleEn&&l.push({id:"1",url:o.subtitleEn,language:"English",name:"\u0130ngilizce",lang:"eng",label:"\u0130ngilizce",headers:{Referer:`${e}/`,Origin:e,"User-Agent":"okhttp/4.9.2"}});let h=[];if(o.m3u8Url&&h.push({sourceId:void 0,m3u8Url:o.m3u8Url,subtitleTr:o.subtitleTr,subtitleEn:o.subtitleEn}),Array.isArray(o.sources))for(let y of o.sources)y.m3u8Url&&y.m3u8Url!==o.m3u8Url&&h.push({sourceId:y.id,m3u8Url:y.m3u8Url,subtitleTr:y.subtitleTr,subtitleEn:y.subtitleEn});z("han's 27",`[Ad\u0131m 2/3] Toplam ${h.length} potansiyel ak\u0131\u015F \xE7\xF6z\xFCmleniyor...`);let _=[],S=new Set;for(let y of h)try{let T="";if(y.m3u8Url?.startsWith("http")||y.m3u8Url?.startsWith("/api/"))T=y.m3u8Url.startsWith("/")?`${e}${y.m3u8Url}`:y.m3u8Url;else{let C={noCache:!0};y.sourceId&&(C.sourceId=y.sourceId);let O=await fetch(`${e}/api/admin/resolve-stream/${o.id}`,{method:"POST",headers:{"User-Agent":M,"Content-Type":"application/json",Referer:`${e}/`,Origin:e,Accept:"application/json, text/plain, */*"},body:JSON.stringify(C)});if(O.ok){let P=await O.json();P.m3u8Url&&(T=P.m3u8Url.startsWith("/")?`${e}${P.m3u8Url}`:P.m3u8Url)}}if(!T||S.has(T))continue;S.add(T);let D=[...l];y.subtitleTr&&!D.some(C=>C.lang==="tur")&&D.push({id:String(D.length),url:y.subtitleTr,language:"Turkish",name:"T\xFCrk\xE7e",lang:"tur",label:"T\xFCrk\xE7e",headers:{Referer:`${e}/`,Origin:e,"User-Agent":"okhttp/4.9.2"}}),y.subtitleEn&&!D.some(C=>C.lang==="eng")&&D.push({id:String(D.length),url:y.subtitleEn,language:"English",name:"\u0130ngilizce",lang:"eng",label:"\u0130ngilizce",headers:{Referer:`${e}/`,Origin:e,"User-Agent":"okhttp/4.9.2"}});let $=!1,E="";try{let C=await fetch(T,{headers:{"User-Agent":M,Referer:`${e}/`,Origin:e},signal:AbortSignal.timeout?AbortSignal.timeout(2500):void 0});C.ok&&(E=await C.text(),E.includes("#EXTM3U")&&($=!0))}catch{}if(!$){z("han's 27","Ge\xE7ersiz veya yan\u0131t vermeyen ak\u0131\u015F elendi.","warn");continue}let N=Z({m3u8Text:E,m3u8Url:T,externalSubtitles:D}),G=N.languageTitle,F=_.length,se=ee({name:F>0?`han's 27 [${F+1}]`:"han's 27",url:T,inspection:N,languageTitle:G,quality:"1080p",format:"m3u8",headers:{"User-Agent":M,Referer:`${e}/`,Origin:e}});_.push(se),z("han's 27",` Ak\u0131\u015F Eklendi: ${G}`,"success")}catch(T){z("han's 27",`Kaynak \xE7\xF6z\xFCmleme hatas\u0131: ${T.message}`,"warn")}let w=((Date.now()-c)/1e3).toFixed(2);return z("han's 27",`[Ad\u0131m 4/4] TAMAMLANDI: ${_.length} adet ak\u0131\u015F listelendi (${w}s)`,"success",_.map(y=>({server:y.name,kalite:y.quality,title:y.title}))),_}catch(a){return z("han's 27",`Kritik Hata: ${a.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=te);

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
