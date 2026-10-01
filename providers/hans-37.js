// [HANS-SPEED-BOOST] Pre-populate domains and config state for 0ms lookup latency
var _g = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this;
var _DEFAULT_DOMAINS = {"imu":"https://ha.vixolity.com","joyboy":"https://www.hdfilmizle.best","enel":"https://selcukflix.com","crocodile":"https://dizilla.now","xebec":"https://www.fullhdfilmizlesene.now","kidd":"https://filmmakinesi.to","shiki":"https://www.hdfilmcehennemi2.biz","garp":"https://siyahfilmizle.vip","ryuma":"https://lovefilmizle.net","rouge":"https://www.dizimom.wiki","kalgara":"https://dizibal.org","sakazuki":"https://dizipal2135.com","shanks":"https://filmekseni.vip","kizaru":"https://www.hdfilmcehennemi.nl","smoker":"https://dizipal1586.com","zunesha":"https://dizipal10.com.tr","oden":"https://yabanci-dizi.now","fujitora":"https://animecix.tv","lili":"https://openani.me","sabo":"https://api.anizium.co","shamrock":"https://animezer.com","bogard":"https://streamcorecdn.com","katakuri":"https://dizipod.com","mihawk":"https://webdramaturkey2.com","vegapunk":"https://ydfvfdizipanel.ru","clover":"https://japierdolevid.com","noland":"https://dizi75.life","doflamingo":"https://asyawatch.com","dragon":"https://dizisol.com","teach":"https://ddizibox.com","roger":"https://roketdizi.life","kuzan":"https://filmizlehub.live","garling":"https://liderfilmizle.vip","rayleigh":"https://vixsrc.to","hiriluk":"https://www.showbox.media","urouge":"https://lmscript.xyz","gaban":"https://streamdata.vaplayer.ru","ace":"https://arc018.stream","gorosei":"https://api.speedracelight.com","saul":"https://dizilab.to","toki":"https://diziroom.com"};
if (!_g.__NUVIO_CONFIG_STATE__) {
  _g.__NUVIO_CONFIG_STATE__ = {
    cachedDomains: _DEFAULT_DOMAINS,
    cachedCookies: {},
    cachedTmdbKeys: ["a2f888b27315e62e471b2d587048f32e","68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"],
    lastFetchTime: Date.now() + 86400000,
    activeFetchPromise: null
  };
} else if (!_g.__NUVIO_CONFIG_STATE__.cachedDomains || Object.keys(_g.__NUVIO_CONFIG_STATE__.cachedDomains).length === 0) {
  _g.__NUVIO_CONFIG_STATE__.cachedDomains = Object.assign({}, _DEFAULT_DOMAINS, _g.__NUVIO_CONFIG_STATE__.cachedDomains || {});
}
// [END-HANS-SPEED-BOOST]

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

"use strict";var N=Object.defineProperty;var X=Object.getOwnPropertyDescriptor;var Q=Object.getOwnPropertyNames;var Z=Object.prototype.hasOwnProperty;var ee=(e,s)=>{for(var t in s)N(e,t,{get:s[t],enumerable:!0})},ae=(e,s,t,u)=>{if(s&&typeof s=="object"||typeof s=="function")for(let i of Q(s))!Z.call(e,i)&&i!==t&&N(e,i,{get:()=>s[i],enumerable:!(u=X(s,i))||u.enumerable});return e};var ne=e=>ae(N({},"__esModule",{value:!0}),e);var me={};ee(me,{getStreams:()=>Y});module.exports=ne(me);function T(e,s,t="info",u){let i=`[${e}]`;t==="error"?console.error(i,s,u||""):t==="warn"?console.warn(i,s,u||""):console.log(i,s,u||"");try{let m=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof m=="string"&&m.startsWith("http")&&fetch(m,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:t,message:s,details:u})}).catch(()=>{})}catch{}}var ie=[66,94,94,90,89,16,5,5,73,78,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89,4,64,89,69,68].map(s=>String.fromCharCode(s^42)).join(""),te=[66,94,94,90,89,16,5,5,78,69,71,75,67,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89].map(s=>String.fromCharCode(s^42)).join(""),U={REMOTE_CONFIG_URL:ie,FALLBACK_CONFIG_URL:te,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},I=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},K=5*60*1e3,se=15*1e3;if(!I.__NUVIO_CONFIG_STATE__){let e={},s={},t=[],u=0;try{if(typeof localStorage<"u"&&localStorage){let i=localStorage.getItem("__NUVIO_DOMAINS_CACHE_V3__");if(i){let n=JSON.parse(i);n&&typeof n.domains=="object"&&(e=n.domains,s=n.cookies||{},t=n.tmdbKeys||[],u=typeof n.time=="number"?n.time:0)}}}catch{}I.__NUVIO_CONFIG_STATE__={cachedDomains:e,cachedCookies:s,cachedTmdbKeys:t,lastFetchTime:u,activeFetchPromise:null}}var k=I.__NUVIO_CONFIG_STATE__;async function oe(e=!1){let s=Date.now(),t=[];t.push(U.REMOTE_CONFIG_URL),t.push(U.FALLBACK_CONFIG_URL);try{let i=I.__NUVIO_DEV_LOG_URL__;typeof i=="string"&&i.includes("/api/log")&&t.push(i.replace("/api/log","/domains"))}catch{}let u=typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function"?AbortSignal.timeout(4e3):void 0;for(let i of t)try{let n=await fetch(i,{signal:u});if(n.ok){let m=await n.json(),g=m?.data??m,a=g.domains||g,h=g.cookies,r=g.tmdb_keys||g.tmdbKeys;a&&typeof a=="object"&&(k.cachedDomains={...a}),h&&typeof h=="object"&&(k.cachedCookies={...k.cachedCookies,...h}),Array.isArray(r)&&r.length>0&&(k.cachedTmdbKeys=r),k.lastFetchTime=s,k.lastFetchSource=i,T("Config",`Domainler basariyla cekildi: ${i}`,"info");try{typeof localStorage<"u"&&localStorage&&localStorage.setItem("__NUVIO_DOMAINS_CACHE_V3__",JSON.stringify({domains:k.cachedDomains,cookies:k.cachedCookies,tmdbKeys:k.cachedTmdbKeys,time:s}))}catch{}return}}catch(n){T("Config",`Domain alinamadi (${i}): ${n.message}`,"warn")}k.lastFetchTime=s-K+se}async function le(e=!1){let s=Date.now(),t=Object.keys(k.cachedDomains).length>0;(e||!t||s-k.lastFetchTime>K)&&(k.activeFetchPromise||(k.activeFetchPromise=oe(e).finally(()=>{k.activeFetchPromise=null})),await k.activeFetchPromise)}async function G(e){return await le(),k.cachedDomains[e]||""}var re=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],O=["tr","tur","ota"],ce=["english","ingilizce","original","orijinal","audio-en"],$=["en","eng","und"];function ue(e,s){let t=!1,u=!1,i=[],n,m,g,a=(s||"").toLowerCase();if(a.includes("trdual")||a.includes("dual")||a.includes("trdub")||a.includes("dublaj")?(t=!0,u=!0):(a.includes("ses-tr")||a.includes("turkcedublaj")||a.includes("turkce-dublaj"))&&(t=!0),a.includes("2160p")||a.includes("4k")||a.includes("uhd")||a.includes("-2160.")?n="4K":a.includes("1080p")||a.includes("1920x1080")||a.includes("fhd")||a.includes("-1080.")?n="1080p":a.includes("720p")||a.includes("1280x720")||a.includes("hd")||a.includes("-720.")?n="720p":a.includes("480p")||a.includes("854x480")||a.includes("sd")||a.includes("-480.")?n="480p":(a.includes("360p")||a.includes("640x360")||a.includes("-360."))&&(n="360p"),a.includes("hevc")||a.includes("h265")||a.includes("x265")?m="HEVC":a.includes("av1")?m="AV1":(a.includes("h264")||a.includes("x264")||a.includes("avc"))&&(m="H.264"),a.includes("5.1")||a.includes("eac3")||a.includes("ac3")||a.includes("ddp")?g="Dolby 5.1":(a.includes("7.1")||a.includes("atmos"))&&(g="Dolby Atmos 7.1"),e&&typeof e=="string"){let r=e.split(/\r?\n/),c=0;for(let v of r){let f=v.trim();if(f.startsWith("#EXT-X-MEDIA:")&&f.includes("TYPE=AUDIO")){let y=f.match(/NAME=["']([^"']+)["']/i),b=f.match(/LANGUAGE=["']([^"']+)["']/i),l=f.match(/GROUP-ID=["']([^"']+)["']/i),o=(y?y[1]:"").toLowerCase(),p=(b?b[1]:"").toLowerCase(),d=(l?l[1]:"").toLowerCase(),S=o.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),A=d.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),z=O.includes(p)||O.some(_=>S.includes(_)||A.includes(_))||re.some(_=>o.includes(_)||d.includes(_))||o.includes("t\xFCrk")||o.includes("turk")||d.includes("dual"),M=$.includes(p)||$.some(_=>S.includes(_)||A.includes(_))||ce.some(_=>o.includes(_)||d.includes(_))||o.includes("orig")||o.includes("ing")||o.includes("eng");z&&(t=!0),M&&(u=!0)}if(f.startsWith("#EXT-X-MEDIA:")&&f.includes("TYPE=SUBTITLES")){let y=f.match(/URI=["']([^"']+)["']/i),b=f.match(/NAME=["']([^"']+)["']/i),l=f.match(/LANGUAGE=["']([^"']+)["']/i);if(y&&y[1]){let o=y[1];if(s&&!o.startsWith("http"))try{o=new URL(o,s).toString()}catch{}let p=b?b[1]:"Altyaz\u0131",d=l?l[1].toLowerCase():"";d==="st"||d==="sot"||p.toLowerCase().includes("sotho")||p.toLowerCase().includes("sesotho")||o.toLowerCase().includes("sub_st")?(d="tr",p="T\xFCrk\xE7e"):d||(d=p.toLowerCase().includes("t\xFCrk")?"tr":"und");let A=ge(d,p);i.push({label:A.name||p,url:o,lang:A.code||d})}}if(f.startsWith("#EXT-X-STREAM-INF:")){let y=f.match(/RESOLUTION=(\d+)x(\d+)/i);if(y){let b=parseInt(y[1],10),l=parseInt(y[2],10),o=Math.min(b,l),p=Math.max(b,l),d=o>=2100||p>=3800?2160:o>=1400||p>=2500?1440:o>=1e3||p>=1900?1080:o>=700||p>=1200?720:o>=450?480:o;d>c&&(c=d)}else{let b=f.match(/NAME=["']?([^"',\s]+)["']?/i);if(b){let l=b[1].toLowerCase();l.includes("2160")||l.includes("4k")?2160>c&&(c=2160):l.includes("1440")||l.includes("2k")?1440>c&&(c=1440):l.includes("1080")?1080>c&&(c=1080):l.includes("720")&&720>c&&(c=720)}}}}c>=2160?n="4K":c>=1440?n="2K":c>=1080?n="1080p":c>=720?n="720p":c>=480&&(n="480p")}let h=t&&u||a.includes("dual")||a.includes("trdual");return{hasTurkishAudio:t,hasOriginalAudio:u,isDual:h,embeddedSubtitles:i,detectedQuality:n,detectedCodec:m,detectedAudio:g}}var L={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function ge(e,s,t){let u=l=>(l||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),i=u(e||""),n=u(s||""),m=!!t||i.includes("forced")||n.includes("forced")||i.includes("zorunlu")||n.includes("zorunlu"),g=i.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),a=n.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),h=l=>{let o=l.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return m?`${o} (Zorunlu)`:o};if(g==="st"||g==="sot"||g.includes("sotho")||a.includes("sotho")||a.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:m?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let r=L[i]||L[n]||L[g]||L[a];if(!r){let l=(a+" "+g).split(/\s+/).filter(Boolean);for(let o of l)if(L[o]){r=L[o];break}}if(!r){for(let[l,o]of Object.entries(L))if(l.length>=4&&(a.includes(l)||g.includes(l))){r=o;break}}if(r)return{code:r.code,iso3:r.iso3,language:r.language,name:h(r.name)};let c=(s||e||"Altyaz\u0131").trim();c=c.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let v=c.charAt(0).toUpperCase()+c.slice(1),f=h(v),y=i&&i.length===2?i:n&&n.length===2?n:"und",b=i&&i.length===3?i:n&&n.length===3?n:"und";return{code:y,iso3:b,language:v,name:f}}function H(e){let s=e.url?ue(void 0,e.url):{},t=e.quality||e.inspection?.detectedQuality||s.detectedQuality||"1080p";t.includes("\u2022")&&(t=t.split("\u2022")[0].trim()),!t.includes("p")&&!t.includes("K")&&!t.includes("k")&&t!=="HD"&&t!=="FHD"&&t!=="SD"&&(t=`${t}p`);let u=e.subtitles||e.inspection?.subtitles,i=!!(e.inspection?.hasTurkishSubtitles||u?.some(d=>{let S=(d.lang||d.code||"").toLowerCase(),A=(d.langCode||d.iso3||"").toLowerCase(),z=(d.name||d.label||d.title||"").toLowerCase();return S==="tr"||S==="st"||A==="tur"||A==="sot"||z.includes("t\xFCrk")||z.includes("turk")||z.includes("sotho")})),n=(e.languageTitle||e.inspection?.languageTitle||"").toLowerCase().trim(),m=n.includes("dub")||n.includes("ses")||n.includes("dual")||!!s.hasTurkishAudio||!!e.inspection?.hasTurkishAudio,g=n.includes("dual")||n.includes("dub")&&(n.includes("alt")||n.includes("sub"))||m&&i,a="Orijinal";n.includes("yerli")||e.inspection?.isYerli?a="Yerli":g?a="Dublaj / Altyaz\u0131l\u0131":m?a="Dublaj":i||n.includes("alt")||n.includes("sub")?a="Altyaz\u0131l\u0131":(n.includes("orijinal")||n.includes("yabanc\u0131")||n.includes("original"))&&(a="Orijinal");let h=e.format==="m3u8"||e.url.includes(".m3u8")||e.url.includes("/master.")||e.url.includes("/hls/")||e.url.includes("/txt/"),r=e.format||(h?"m3u8":e.url.includes(".mp4")?"mp4":"m3u8"),c=r==="m3u8"?"HLS":r.toUpperCase(),v=[t],f=e.codec||e.inspection?.detectedCodec||s.detectedCodec;f&&f!=="H.264"&&v.push(f),v.push(c),e.bitrate&&v.push(e.bitrate);let y=e.audio||e.inspection?.detectedAudio||s.detectedAudio;y&&y!=="AAC 2.0"&&v.push(y);let b=e.details||v.join(" \u2022 "),l=`${a}
${b}`,o=`${t} \u2022 ${a}`,p={name:"han's 37",provider:"han's 37",title:a,description:l,url:e.url,quality:o,format:r};return e.headers&&Object.keys(e.headers).length>0&&(p.headers=e.headers),u&&u.length>0&&(p.subtitles=u),p}var R=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};R.__NUVIO_TMDB_CACHE__||(R.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map});var B=R.__NUVIO_TMDB_CACHE__,Ae=B.imdbIdCache,Se=B.tmdbTitlesCache,ze=B.tmdbImageCache;function q(e,s,t,u){let i=e,n=s,m=t,g=u;typeof e=="object"&&e!==null&&!Array.isArray(e)&&(i=e.id||e.tmdbId||e.rawTmdbId||e.imdbId||"",n=e.type||e.mediaType||e.rawMediaType,m=e.season??e.seasonNum??e.rawSeasonNum,g=e.episode??e.episodeNum??e.rawEpisodeNum);let a=String(i||"").trim();a.toLowerCase().startsWith("tmdb:")&&(a=a.slice(5));let h=a.split(":");h[0]==="series"||h[0]==="tv"||h[0]==="show"||h[0]==="dizi"?(h.shift(),n="tv"):(h[0]==="movie"||h[0]==="film")&&(h.shift(),n="movie");let r=h[0].trim();if(h.length>=3){let l=parseInt(h[1],10),o=parseInt(h[2],10);isNaN(l)||(m=l),isNaN(o)||(g=o)}let c=String(n||"").toLowerCase().trim(),v=c==="tv"||c==="series"||c==="show"||c==="dizi",f=v?"tv":"movie",y=m!=null&&m!==""?parseInt(String(m),10):1,b=g!=null&&g!==""?parseInt(String(g),10):1;return{tmdbId:r,mediaType:f,isTv:v,season:isNaN(y)?1:y,episode:isNaN(b)?1:b,startTime:Date.now()}}var P="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",de='"Chromium";v="130", "Google Chrome";v="130", "Not-A.Brand";v="99"';async function Y(e,s,t,u){let{tmdbId:i,mediaType:n,isTv:m,season:g,episode:a,startTime:h}=q(e,s,t,u);T("han's 37",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${i}, T\xFCr: ${n}, Sezon: ${g}, B\xF6l\xFCm: ${a}`);try{if(!i)return[];let r=await G("rayleigh");if(!r)return T("han's 37","Domain not resolved","warn"),[];let c="";m?c=`${r}/api/tv/${i}/${g}/${a}`:c=`${r}/api/movie/${i}`,T("han's 37","[Ad\u0131m 1/3] Metadata API sorgulan\u0131yor...");let v={"User-Agent":P,"sec-ch-ua":de,"sec-ch-ua-mobile":"?0","sec-ch-ua-platform":'"Windows"',Accept:"application/json, text/javascript, */*; q=0.01","X-Requested-With":"XMLHttpRequest",Referer:r+"/"},f=await fetch(c,{headers:v,signal:AbortSignal.timeout?AbortSignal.timeout(3500):void 0});if(!f.ok)return T("han's 37",`API yan\u0131t vermedi: HTTP ${f.status}`,"warn"),[];let b=(await f.json())?.src;if(!b)return T("han's 37","API yan\u0131t\u0131nda embed ba\u011Flant\u0131s\u0131 bulunamad\u0131.","warn"),[];let l=`${r}${b}`;T("han's 37","[Ad\u0131m 2/3] Oynat\u0131c\u0131 embed sayfas\u0131 \xE7\xF6z\xFCmleniyor...");let o=await fetch(l,{headers:{Referer:r+"/","User-Agent":P},signal:AbortSignal.timeout?AbortSignal.timeout(3500):void 0});if(!o.ok)return T("han's 37",`Embed sayfas\u0131 y\xFCklenemedi: HTTP ${o.status}`,"warn"),[];let p=await o.text(),d=null,S=p.match(/window\.video\s*=\s*\{[^}]*id:\s*'([^']+)'/);if(S)d=S[1];else{let C=b.match(/\/embed\/([^?\/#]+)/);C&&(d=C[1])}if(!d)return T("han's 37","Video ID \xE7\xF6z\xFCmlenemedi.","warn"),[];let A=p.match(/window\.masterPlaylist\s*=\s*\{[\s\S]*?'token':\s*'([^']+)'/),z=p.match(/window\.masterPlaylist\s*=\s*\{[\s\S]*?'expires':\s*'([^']+)'/),M=p.match(/window\.masterPlaylist\s*=\s*\{[\s\S]*?url:\s*'([^']+)'/),_=A?A[1]:null,j=z?z[1]:null,F=M?M[1]:`${r}/playlist/${d}?b=1`;if(!_||!j)return T("han's 37","Token veya s\xFCre a\u015F\u0131m\u0131 bilgisi bulunamad\u0131.","warn"),[];let V=p.includes("window.canPlayFHD = true"),W=F.includes("?")?"&":"?",D=`${F}${W}token=${_}&expires=${j}`;V&&(D+="&h=1");let E=!1;try{let C=await fetch(D,{headers:{"User-Agent":P,Referer:l,Origin:r},signal:AbortSignal.timeout?AbortSignal.timeout(2500):void 0});if(C.ok){let w=(await C.text()).toLowerCase();E=w.includes("type=subtitles")&&(w.includes('name="turkish"')||w.includes('name="t\xFCrk\xE7e"')||w.includes('language="tr"')||w.includes('language="tur"')||w.includes('rendition="tr')||w.includes('rendition="tur'))}}catch{}let x=[H({name:"han's 37",url:D,languageTitle:E?"Altyaz\u0131l\u0131":"Yabanc\u0131",quality:"1080p",format:"m3u8",headers:{"User-Agent":P,Referer:l,Origin:r}})],J=((Date.now()-h)/1e3).toFixed(2);return T("han's 37",`[Ad\u0131m 3/3] TAMAMLANDI: 1 stream haz\u0131rland\u0131 (${J}s)`,"success",x.map(C=>({title:C.title,quality:"1080p",format:"m3u8"}))),x}catch(r){return T("han's 37",`Kritik Hata: ${r.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=Y);

var _exp = (typeof module !== "undefined" && module.exports) ? module.exports : {};
var _glob = typeof globalThis !== "undefined" ? globalThis : (typeof global !== "undefined" ? global : (typeof window !== "undefined" ? window : {}));
var _gs = _exp.getStreams || (_exp.default && _exp.default.getStreams) || _glob.getStreams;
var _sub = _exp.getSubtitles || (_exp.default && _exp.default.getSubtitles) || _glob.getSubtitles;
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

;(()=>{const n="han's 37",g=typeof globalThis!=="undefined"?globalThis:typeof global!=="undefined"?global:this,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;g.__HANS_CACHE__=g.__HANS_CACHE__||new Map();const c=g.__HANS_CACHE__,TTL=600000,w=async(...a)=>{let k;try{k=n+":"+JSON.stringify(a)}catch{k=null}const now=Date.now();if(k&&c.has(k)){const e=c.get(k);if(e&&now-e.t<TTL)return e.d;}let t;const tp=new Promise(res=>{t=setTimeout(()=>res([]),5500);}),ep=(async()=>{try{const r=await f(...a);if(t)clearTimeout(t);const res=Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):(r||[]);if(k&&Array.isArray(res)&&res.length>0)c.set(k,{d:res,t:Date.now()});return res;}catch{if(t)clearTimeout(t);return [];}})();return Promise.race([ep,tp]);};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports.getStreams=w;}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true});}catch(e){m.exports.getStreams=w;}}})();
