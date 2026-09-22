
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

"use strict";var B=Object.defineProperty;var ie=Object.getOwnPropertyDescriptor;var te=Object.getOwnPropertyNames;var se=Object.prototype.hasOwnProperty;var oe=(n,t)=>{for(var s in t)B(n,s,{get:t[s],enumerable:!0})},re=(n,t,s,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of te(t))!se.call(n,r)&&r!==s&&B(n,r,{get:()=>t[r],enumerable:!(o=ie(t,r))||o.enumerable});return n};var le=n=>re(B({},"__esModule",{value:!0}),n);var fe={};oe(fe,{getStreams:()=>ae});module.exports=le(fe);var ce=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(t=>String.fromCharCode(t^42)).join(""),ue={REMOTE_CONFIG_URL:ce,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"};var E=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};E.__NUVIO_CONFIG_STATE__||(E.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var v=E.__NUVIO_CONFIG_STATE__,ge=10*60*1e3;async function K(){let n=Date.now();try{let t={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let o=AbortSignal.timeout(8e3);o&&(t.signal=o)}catch{}let s=await fetch(`${ue.REMOTE_CONFIG_URL}?_t=${n}`,t);if(s.ok){let o=await s.json(),r=o?.data??o,i=r.domains||r,c=r.cookies,g=r.tmdb_keys||r.tmdbKeys;i&&typeof i=="object"&&(v.cachedDomains={...v.cachedDomains,...i}),c&&typeof c=="object"&&(v.cachedCookies={...v.cachedCookies,...c}),Array.isArray(g)&&g.length>0&&(v.cachedTmdbKeys=g),v.lastFetchTime=n}else v.lastFetchTime=0}catch{v.lastFetchTime=0}}async function x(){let n=Date.now();(!(Object.keys(v.cachedDomains).length>0)||n-v.lastFetchTime>ge)&&(v.activeFetchPromise||(v.activeFetchPromise=K().finally(()=>{v.activeFetchPromise=null})),await v.activeFetchPromise)}async function H(n){await x();let t=v.cachedDomains[n]||"";return t||(await K(),t=v.cachedDomains[n]||""),t}async function q(){return await x(),v.cachedTmdbKeys||[]}function z(n,t,s="info",o){let r=`[${n}]`;s==="error"?console.error(r,t,o||""):s==="warn"?console.warn(r,t,o||""):console.log(r,t,o||"");try{let c=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof c=="string"&&c.startsWith("http")&&fetch(c,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:n,level:s,message:t,details:o})}).catch(()=>{})}catch{}}var de=["t\xFCrk\xE7e","turkish","turkce","dublaj","tr","tur","dual","trdual","trdub","ses-tr","audio-tr","tr-dub"],me=["english","ingilizce","original","orijinal","en","eng","und","audio-en"];function W(n,t){let s=!1,o=!1,r=[],i,c,g,a=(t||"").toLowerCase();if(a.includes("trdual")||a.includes("dual")||a.includes("trdub")||a.includes("dublaj")?(s=!0,o=!0):(a.includes("ses-tr")||a.includes("turkcedublaj")||a.includes("turkce-dublaj"))&&(s=!0),a.includes("2160p")||a.includes("4k")||a.includes("uhd")?i="4K":a.includes("1080p")||a.includes("1920x1080")||a.includes("fhd")?i="1080p":a.includes("720p")||a.includes("1280x720")||a.includes("hd")?i="720p":(a.includes("480p")||a.includes("854x480")||a.includes("sd"))&&(i="480p"),a.includes("hevc")||a.includes("h265")||a.includes("x265")?c="HEVC":a.includes("av1")?c="AV1":(a.includes("h264")||a.includes("x264")||a.includes("avc"))&&(c="H.264"),a.includes("5.1")||a.includes("eac3")||a.includes("ac3")||a.includes("ddp")?g="Dolby 5.1":(a.includes("7.1")||a.includes("atmos"))&&(g="Dolby Atmos 7.1"),n&&typeof n=="string"){let f=n.split(/\r?\n/);for(let T of f){let m=T.trim();if(m.startsWith("#EXT-X-MEDIA:")&&m.includes("TYPE=AUDIO")){let b=m.match(/NAME=["']([^"']+)["']/i),e=m.match(/LANGUAGE=["']([^"']+)["']/i),h=m.match(/GROUP-ID=["']([^"']+)["']/i),d=(b?b[1]:"").toLowerCase(),u=(e?e[1]:"").toLowerCase(),l=(h?h[1]:"").toLowerCase(),y=de.some(_=>d.includes(_)||u===_||l.includes(_))||d.includes("t\xFCrk")||d.includes("turk")||l.includes("dual"),A=me.some(_=>d.includes(_)||u===_||l.includes(_))||d.includes("orig")||d.includes("ing")||d.includes("eng");y&&(s=!0),A&&(o=!0)}if(m.startsWith("#EXT-X-MEDIA:")&&m.includes("TYPE=SUBTITLES")){let b=m.match(/URI=["']([^"']+)["']/i),e=m.match(/NAME=["']([^"']+)["']/i),h=m.match(/LANGUAGE=["']([^"']+)["']/i);if(b&&b[1]){let d=b[1];if(t&&!d.startsWith("http"))try{d=new URL(d,t).toString()}catch{}let u=e?e[1]:"Altyaz\u0131",l=h?h[1].toLowerCase():"";l==="st"||l==="sot"||u.toLowerCase().includes("sotho")||u.toLowerCase().includes("sesotho")||d.toLowerCase().includes("sub_st")?(l="tr",u="T\xFCrk\xE7e"):l||(l=u.toLowerCase().includes("t\xFCrk")?"tr":"und");let A=V(l,u);r.push({label:A.name||u,url:d,lang:A.code||l})}}}}let p=s&&o||a.includes("dual")||a.includes("trdual");return{hasTurkishAudio:s,hasOriginalAudio:o,isDual:p,embeddedSubtitles:r,detectedQuality:i,detectedCodec:c,detectedAudio:g}}function he(n){let{hasTurkishAudio:t,hasOriginalAudio:s,isDual:o,hasSubtitles:r,hasTurkishSubtitles:i,isYerli:c,siteHint:g,defaultTitle:a}=n;if(c||g?.isYerli)return"Yerli";if(g?.label){let p=g.label.toLowerCase();if((p.includes("dub")||p.includes("t\xFCrk"))&&(p.includes("alt")||p.includes("sub")))return"Dublaj / Altyaz\u0131l\u0131";if(p.includes("dub")||p.includes("t\xFCrk\xE7e ses"))return"Dublaj";if(p.includes("alt")||p.includes("sub"))return"Altyaz\u0131l\u0131";if(p.includes("orijinal")||p.includes("original"))return"Orijinal"}return o||t&&(s||i)?"Dublaj / Altyaz\u0131l\u0131":t||g?.isDublaj?"Dublaj":i||g?.isAltyazi?"Altyaz\u0131l\u0131":a||(t?"Dublaj":"Orijinal")}var D={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function V(n,t,s){let o=d=>(d||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),r=o(n||""),i=o(t||""),c=!!s||r.includes("forced")||i.includes("forced")||r.includes("zorunlu")||i.includes("zorunlu"),g=r.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),a=i.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),p=d=>{let u=d.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return c?`${u} (Zorunlu)`:u};if(g==="st"||g==="sot"||g.includes("sotho")||a.includes("sotho")||a.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:c?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let f=D[r]||D[i]||D[g]||D[a];if(!f){let d=(a+" "+g).split(/\s+/).filter(Boolean);for(let u of d)if(D[u]){f=D[u];break}}if(!f){for(let[d,u]of Object.entries(D))if(d.length>=4&&(a.includes(d)||g.includes(d))){f=u;break}}if(f)return{code:f.code,iso3:f.iso3,language:f.language,name:p(f.name)};let T=(t||n||"Altyaz\u0131").trim();T=T.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let m=T.charAt(0).toUpperCase()+T.slice(1),b=p(m),e=r&&r.length===2?r:i&&i.length===2?i:"und",h=r&&r.length===3?r:i&&i.length===3?i:"und";return{code:e,iso3:h,language:m,name:b}}function Y(n,t){let s=[],o=new Set,r=[...n||[],...t||[]];for(let i of r){if(!i||!i.url)continue;let c=i.url.trim();if(o.has(c))continue;o.add(c);let g=V(i.lang,i.label||i.name||i.language),a=g.name||i.label||i.name||"Altyaz\u0131";s.push({id:String(s.length),url:c,label:a,name:a,language:g.language,lang:g.code,langCode:g.iso3,headers:i.headers})}return s}function J(n){let{m3u8Text:t,m3u8Url:s,externalSubtitles:o,siteHint:r,defaultTitle:i}=n,c=W(t,s),g=Y(o),a=Y(o,c.embeddedSubtitles),p=a.length>0||!!r?.isAltyazi,f=a.some(h=>h.lang==="tr"||h.lang==="st"||h.lang==="sot"||h.langCode==="tur"||h.langCode==="sot"||h.label?.toLowerCase().includes("t\xFCrk")||h.label?.toLowerCase().includes("sotho")||h.language==="Turkish"||h.language?.toLowerCase().includes("sotho")),T=c.hasTurkishAudio||!!r?.isDublaj,m=c.hasOriginalAudio,b=c.isDual||T&&(f||m),e=he({hasTurkishAudio:T,hasOriginalAudio:m,isDual:b,hasSubtitles:p,hasTurkishSubtitles:f,isYerli:r?.isYerli,siteHint:r,defaultTitle:i});return{hasTurkishAudio:T,hasOriginalAudio:m,isDual:b,hasSubtitles:p,hasTurkishSubtitles:f,isYerli:r?.isYerli,languageTitle:e,subtitles:g}}function X(n){let t=n.url?W(void 0,n.url):{},s=n.quality||t.detectedQuality||"1080p";s.includes("\u2022")&&(s=s.split("\u2022")[0].trim()),!s.includes("p")&&!s.includes("K")&&!s.includes("k")&&(s=`${s}p`);let o=n.subtitles||n.inspection?.subtitles,r=!!(n.inspection?.hasTurkishSubtitles||o?.some(y=>{let A=(y.lang||y.code||"").toLowerCase(),_=(y.langCode||y.iso3||"").toLowerCase(),I=(y.name||y.label||y.title||"").toLowerCase();return A==="tr"||A==="st"||_==="tur"||_==="sot"||I.includes("t\xFCrk")||I.includes("turk")||I.includes("sotho")})),i=(n.languageTitle||n.inspection?.languageTitle||"").toLowerCase().trim(),c=i.includes("dub")||i.includes("ses")||i.includes("dual")||!!t.hasTurkishAudio||!!n.inspection?.hasTurkishAudio,g=i.includes("dual")||i.includes("dub")&&(i.includes("alt")||i.includes("sub"))||c&&r,a="Orijinal";i.includes("yerli")||n.inspection?.isYerli?a="Yerli":g?a="Dublaj / Altyaz\u0131l\u0131":c?a="Dublaj":r||i.includes("alt")||i.includes("sub")?a="Altyaz\u0131l\u0131":(i.includes("orijinal")||i.includes("yabanc\u0131")||i.includes("original"))&&(a="Orijinal");let p=n.format==="m3u8"||n.url.includes(".m3u8")||n.url.includes("/master.")||n.url.includes("/hls/")||n.url.includes("/txt/"),f=n.format||(p?"m3u8":n.url.includes(".mp4")?"mp4":"m3u8"),T=f==="m3u8"?"HLS":f.toUpperCase(),m=[s],b=n.codec||t.detectedCodec;b&&b!=="H.264"&&m.push(b),m.push(T),n.bitrate&&m.push(n.bitrate);let e=n.audio||t.detectedAudio;e&&e!=="AAC 2.0"&&m.push(e);let h=n.details||m.join(" \u2022 "),d=`${a}
${h}`,u=`${s} \u2022 ${a}`,l={name:"han's 27",provider:"han's 27",title:a,description:d,url:n.url,quality:u,format:f};return n.headers&&Object.keys(n.headers).length>0&&(l.headers=n.headers),o&&o.length>0&&(l.subtitles=o),l}var pe="a2f888b27315e62e471b2d587048f32e",Q=[pe,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function Z(n){let t=await q(),s=t.length>0?[...t,...Q]:Q;for(let o=0;o<s.length;o++){let r=s[o],i=n.includes("?")?"&":"?",c=`https://api.themoviedb.org/3/${n}${i}api_key=${r}`;try{let g=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,a=await fetch(c,{signal:g});if(a.ok)return await a.json();if(a.status===429)continue}catch{}}return null}var R=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};R.__NUVIO_TMDB_CACHE__||(R.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var P=R.__NUVIO_TMDB_CACHE__,Ae=P.imdbIdCache,j=P.tmdbTitlesCache,_e=P.tmdbImageCache,ze=P.episodeGroupCache,Se=P.absoluteEpCache;async function ee(n,t){let s=String(n||"").replace(/^tmdb:/i,"").trim();if(!s)return{titles:[]};let o=`${t}:${s}`;if(j.has(o))return j.get(o);let r=(async()=>{let i=[],c,g,a=[],p=[],f,T=[];try{let m=t==="tv"||t==="series",b=m?"tv":"movie";if(s.startsWith("tt")){let e=await Z(`find/${s}?external_source=imdb_id`);if(e){let h=m?e?.tv_results?.[0]:e?.movie_results?.[0];h&&(c=h.id,h.overview&&(f=h.overview))}}else c=parseInt(s,10);if(c&&!isNaN(c)){let e=await Z(`${b}/${c}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(e){if(e.overview&&(f=e.overview),e.title&&(i.push(e.title),e.title.includes(":"))){let l=e.title.split(":")[0].trim();l.length>2&&i.push(l)}if(e.name&&(i.push(e.name),e.name.includes(":"))){let l=e.name.split(":")[0].trim();l.length>2&&i.push(l)}if(e.original_title&&e.original_title!==e.title&&(i.push(e.original_title),e.original_title.includes(":"))){let l=e.original_title.split(":")[0].trim();l.length>2&&i.push(l)}if(e.original_name&&e.original_name!==e.name&&(i.push(e.original_name),e.original_name.includes(":"))){let l=e.original_name.split(":")[0].trim();l.length>2&&i.push(l)}if(e.translations?.translations&&Array.isArray(e.translations.translations))for(let l of e.translations.translations){let y=l.data?.name||l.data?.title;if(y&&typeof y=="string"&&(i.push(y),y.includes(":"))){let A=y.split(":")[0].trim();A.length>2&&i.push(A)}}let h=(e.alternative_titles?.results||e.alternative_titles?.titles||[]).map(l=>l.title).filter(Boolean);i.push(...h);let d=e.release_date||e.first_air_date;d&&(g=parseInt(d.split("-")[0],10)),e.genres&&Array.isArray(e.genres)&&(T=e.genres.map(l=>l.name).filter(Boolean)),e.credits?.cast&&Array.isArray(e.credits.cast)&&(a=e.credits.cast.slice(0,10).map(l=>l.name).filter(Boolean));let u=[];e.created_by&&Array.isArray(e.created_by)&&u.push(...e.created_by.map(l=>l.name).filter(Boolean)),e.credits?.crew&&Array.isArray(e.credits.crew)&&u.push(...e.credits.crew.filter(l=>l.job==="Director"||l.department==="Directing").map(l=>l.name).filter(Boolean)),p=Array.from(new Set(u))}}}catch{}return{numericId:c,titles:Array.from(new Set(i.filter(Boolean))),year:g,cast:a,creators:p,overview:f,genres:T}})();return j.set(o,r),r}var M="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";async function ae(n,t,s,o){let r=Date.now();if(typeof n=="object"&&n!==null){let a=n;n=a.id||a.tmdbId||a.imdbId,t=a.type||a.mediaType,s=a.season??a.seasonNum,o=a.episode??a.episodeNum}let i=String(n||"").trim();i.toLowerCase().startsWith("tmdb:")&&(i=i.slice(5));let c=i.split(":"),g=c[0].trim();c.length>=3&&s===void 0&&(s=parseInt(c[1],10),o=parseInt(c[2],10)),z("han's 27",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${g}, T\xFCr: ${t}, Sezon: ${s||"-"}, B\xF6l\xFCm: ${o||"-"}`);try{let a=String(t||"").toLowerCase().trim(),p=a==="tv"||a==="series",f=p?"tv":"movie",T=s!=null?parseInt(String(s),10):1,m=o!=null?parseInt(String(o),10):1;if(!g)return[];let b=null;if(g.startsWith("tt")?b=(await ee(g,f)).numericId||null:b=parseInt(g,10),!b)return z("han's 27","Ge\xE7erli TMDB ID \xE7\xF6z\xFClemedi.","warn"),[];let e=await H("dragon");if(!e)return z("han's 27","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let h=p?`${e}/api/movies/by-tmdb/${b}?season=${T}&episode=${m}`:`${e}/api/movies/by-tmdb/${b}`;z("han's 27",`[Ad\u0131m 1/4] TMDB ID (${b}) ile API sorgulan\u0131yor...`);let d=await fetch(h,{headers:{"User-Agent":M,Referer:`${e}/`,Accept:"application/json, text/plain, */*"}});if(!d.ok)return z("han's 27",`\u0130\xE7erik veritaban\u0131nda bulunamad\u0131 (HTTP ${d.status})`,"warn"),[];let u=await d.json();if(!u||!u.id)return z("han's 27","API yan\u0131t\u0131nda ge\xE7erli i\xE7erik nesnesi yok.","warn"),[];z("han's 27",` \u0130\xE7erik Do\u011Fruland\u0131: "${u.title}" (${u.year||"-"}) - Kay\u0131t ID: ${u.id}`,"success");let l=[];u.subtitleTr&&l.push({id:"0",url:u.subtitleTr,language:"Turkish",name:"T\xFCrk\xE7e",lang:"tur",label:"T\xFCrk\xE7e",headers:{Referer:`${e}/`,Origin:e,"User-Agent":"okhttp/4.9.2"}}),u.subtitleEn&&l.push({id:"1",url:u.subtitleEn,language:"English",name:"\u0130ngilizce",lang:"eng",label:"\u0130ngilizce",headers:{Referer:`${e}/`,Origin:e,"User-Agent":"okhttp/4.9.2"}});let y=[];if(u.m3u8Url&&y.push({sourceId:void 0,m3u8Url:u.m3u8Url,subtitleTr:u.subtitleTr,subtitleEn:u.subtitleEn}),Array.isArray(u.sources))for(let k of u.sources)k.m3u8Url&&k.m3u8Url!==u.m3u8Url&&y.push({sourceId:k.id,m3u8Url:k.m3u8Url,subtitleTr:k.subtitleTr,subtitleEn:k.subtitleEn});z("han's 27",`[Ad\u0131m 2/3] Toplam ${y.length} potansiyel ak\u0131\u015F \xE7\xF6z\xFCmleniyor...`);let A=[],_=new Set;for(let k of y)try{let S="";if(k.m3u8Url?.startsWith("http")||k.m3u8Url?.startsWith("/api/"))S=k.m3u8Url.startsWith("/")?`${e}${k.m3u8Url}`:k.m3u8Url;else{let C={noCache:!0};k.sourceId&&(C.sourceId=k.sourceId);let O=await fetch(`${e}/api/admin/resolve-stream/${u.id}`,{method:"POST",headers:{"User-Agent":M,"Content-Type":"application/json",Referer:`${e}/`,Origin:e,Accept:"application/json, text/plain, */*"},body:JSON.stringify(C)});if(O.ok){let L=await O.json();L.m3u8Url&&(S=L.m3u8Url.startsWith("/")?`${e}${L.m3u8Url}`:L.m3u8Url)}}if(!S||_.has(S))continue;_.add(S);let w=[...l];k.subtitleTr&&!w.some(C=>C.lang==="tur")&&w.push({id:String(w.length),url:k.subtitleTr,language:"Turkish",name:"T\xFCrk\xE7e",lang:"tur",label:"T\xFCrk\xE7e",headers:{Referer:`${e}/`,Origin:e,"User-Agent":"okhttp/4.9.2"}}),k.subtitleEn&&!w.some(C=>C.lang==="eng")&&w.push({id:String(w.length),url:k.subtitleEn,language:"English",name:"\u0130ngilizce",lang:"eng",label:"\u0130ngilizce",headers:{Referer:`${e}/`,Origin:e,"User-Agent":"okhttp/4.9.2"}});let $=!1,U="";try{let C=await fetch(S,{headers:{"User-Agent":M,Referer:`${e}/`,Origin:e},signal:AbortSignal.timeout?AbortSignal.timeout(2500):void 0});C.ok&&(U=await C.text(),U.includes("#EXTM3U")&&($=!0))}catch{}if(!$){z("han's 27","Ge\xE7ersiz veya yan\u0131t vermeyen ak\u0131\u015F elendi.","warn");continue}let G=J({m3u8Text:U,m3u8Url:S,externalSubtitles:w}),F=G.languageTitle,N=A.length,ne=X({name:N>0?`han's 27 [${N+1}]`:"han's 27",url:S,inspection:G,languageTitle:F,quality:"1080p",format:"m3u8",headers:{"User-Agent":M,Referer:`${e}/`,Origin:e}});A.push(ne),z("han's 27",` Ak\u0131\u015F Eklendi: ${F}`,"success")}catch(S){z("han's 27",`Kaynak \xE7\xF6z\xFCmleme hatas\u0131: ${S.message}`,"warn")}let I=((Date.now()-r)/1e3).toFixed(2);return z("han's 27",`[Ad\u0131m 4/4] TAMAMLANDI: ${A.length} adet ak\u0131\u015F listelendi (${I}s)`,"success",A.map(k=>({server:k.name,kalite:k.quality,title:k.title}))),A}catch(a){return z("han's 27",`Kritik Hata: ${a.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=ae);

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
