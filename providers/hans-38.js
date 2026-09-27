
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

"use strict";var U=Object.defineProperty;var pe=Object.getOwnPropertyDescriptor;var be=Object.getOwnPropertyNames;var ke=Object.prototype.hasOwnProperty;var ye=(n,t)=>{for(var a in t)U(n,a,{get:t[a],enumerable:!0})},Te=(n,t,a,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let c of be(t))!ke.call(n,c)&&c!==a&&U(n,c,{get:()=>t[c],enumerable:!(r=pe(t,c))||r.enumerable});return n};var ve=n=>Te(U({},"__esModule",{value:!0}),n);var Pe={};ye(Pe,{default:()=>Me,getStreams:()=>D});module.exports=ve(Pe);function S(n,t,a="info",r){let c=`[${n}]`;a==="error"?console.error(c,t,r||""):a==="warn"?console.warn(c,t,r||""):console.log(c,t,r||"");try{let g=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof g=="string"&&g.startsWith("http")&&fetch(g,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:n,level:a,message:t,details:r})}).catch(()=>{})}catch{}}var _e=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(t=>String.fromCharCode(t^42)).join(""),Ae={REMOTE_CONFIG_URL:_e,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},G=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};try{typeof localStorage<"u"&&localStorage&&typeof localStorage.removeItem=="function"&&(localStorage.removeItem("__NUVIO_CONFIG_CACHE__"),localStorage.removeItem("__NUVIO_CONFIG_CACHE_V2__"))}catch{}var X=10*1e3,Ce=10*1e3;G.__NUVIO_CONFIG_STATE__||(G.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var y=G.__NUVIO_CONFIG_STATE__;async function Z(){let n=Date.now(),t=[];try{let a=G.__NUVIO_DEV_LOG_URL__;typeof a=="string"&&a.includes("/api/log")&&t.push(a.replace("/api/log","/domains"))}catch{}t.push(Ae.REMOTE_CONFIG_URL);for(let a of t)try{let r=await fetch(a);if(r.ok){let c=await r.json(),s=c?.data??c,g=s.domains||s,h=s.cookies,i=s.tmdb_keys||s.tmdbKeys;g&&typeof g=="object"&&(y.cachedDomains={...y.cachedDomains,...g}),h&&typeof h=="object"&&(y.cachedCookies={...y.cachedCookies,...h}),Array.isArray(i)&&i.length>0&&(y.cachedTmdbKeys=i),y.lastFetchTime=n;return}}catch(r){S("Config",`Domain alinamadi (${a}): ${r.message}`,"warn")}y.lastFetchTime=n-X+Ce}async function ee(){let n=Date.now();(!(Object.keys(y.cachedDomains).length>0)||n-y.lastFetchTime>X)&&(y.activeFetchPromise||(y.activeFetchPromise=Z().finally(()=>{y.activeFetchPromise=null})),await y.activeFetchPromise)}async function ae(n){return await ee(),y.cachedDomains[n]||await Z(),y.cachedDomains[n]||""}async function ne(){return await ee(),y.cachedTmdbKeys||[]}var Se="a2f888b27315e62e471b2d587048f32e",ie=[Se,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function te(n){let t=await ne(),a=t.length>0?[...t,...ie]:ie;for(let r=0;r<a.length;r++){let c=a[r],s=n.includes("?")?"&":"?",g=`https://api.themoviedb.org/3/${n}${s}api_key=${c}`;try{let h=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,i=await fetch(g,{signal:h});if(i.ok)return await i.json();if(i.status===429)continue}catch{}}return null}var x=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};x.__NUVIO_TMDB_CACHE__||(x.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var P=x.__NUVIO_TMDB_CACHE__,Re=P.imdbIdCache,$=P.tmdbTitlesCache,Ge=P.tmdbImageCache,Fe=P.episodeGroupCache,Oe=P.absoluteEpCache;async function se(n,t){let a=String(n||"").replace(/^tmdb:/i,"").trim();if(!a)return{titles:[]};let r=`${t}:${a}`;if($.has(r))return $.get(r);let c=(async()=>{let s=[],g,h,i=[],v=[],b,f=[];try{let T=t==="tv"||t==="series",l=T?"tv":"movie";if(a.startsWith("tt")){let e=await te(`find/${a}?external_source=imdb_id`);if(e){let p=T?e?.tv_results?.[0]:e?.movie_results?.[0];p&&(g=p.id,p.overview&&(b=p.overview))}}else g=parseInt(a,10);if(g&&!isNaN(g)){let e=await te(`${l}/${g}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(e){if(e.overview&&(b=e.overview),e.title&&(s.push(e.title),e.title.includes(":"))){let o=e.title.split(":")[0].trim();o.length>2&&s.push(o)}if(e.name&&(s.push(e.name),e.name.includes(":"))){let o=e.name.split(":")[0].trim();o.length>2&&s.push(o)}if(e.original_title&&e.original_title!==e.title&&(s.push(e.original_title),e.original_title.includes(":"))){let o=e.original_title.split(":")[0].trim();o.length>2&&s.push(o)}if(e.original_name&&e.original_name!==e.name&&(s.push(e.original_name),e.original_name.includes(":"))){let o=e.original_name.split(":")[0].trim();o.length>2&&s.push(o)}if(e.translations?.translations&&Array.isArray(e.translations.translations))for(let o of e.translations.translations){let d=o.data?.name||o.data?.title;if(d&&typeof d=="string"&&(s.push(d),d.includes(":"))){let k=d.split(":")[0].trim();k.length>2&&s.push(k)}}let p=(e.alternative_titles?.results||e.alternative_titles?.titles||[]).map(o=>o.title).filter(Boolean);s.push(...p);let m=e.release_date||e.first_air_date;m&&(h=parseInt(m.split("-")[0],10)),e.genres&&Array.isArray(e.genres)&&(f=e.genres.map(o=>o.name).filter(Boolean)),e.credits?.cast&&Array.isArray(e.credits.cast)&&(i=e.credits.cast.slice(0,10).map(o=>o.name).filter(Boolean));let u=[];e.created_by&&Array.isArray(e.created_by)&&u.push(...e.created_by.map(o=>o.name).filter(Boolean)),e.credits?.crew&&Array.isArray(e.credits.crew)&&u.push(...e.credits.crew.filter(o=>o.job==="Director"||o.department==="Directing").map(o=>o.name).filter(Boolean)),v=Array.from(new Set(u))}}}catch{}return{numericId:g,titles:Array.from(new Set(s.filter(Boolean))),year:h,cast:i,creators:v,overview:b,genres:f}})();return $.set(r,c),c}var ze=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],oe=["tr","tur","ota"],we=["english","ingilizce","original","orijinal","audio-en"],le=["en","eng","und"];function Le(n,t){let a=!1,r=!1,c=[],s,g,h,i=(t||"").toLowerCase();if(i.includes("trdual")||i.includes("dual")||i.includes("trdub")||i.includes("dublaj")?(a=!0,r=!0):(i.includes("ses-tr")||i.includes("turkcedublaj")||i.includes("turkce-dublaj"))&&(a=!0),i.includes("2160p")||i.includes("4k")||i.includes("uhd")?s="4K":i.includes("1080p")||i.includes("1920x1080")||i.includes("fhd")?s="1080p":i.includes("720p")||i.includes("1280x720")||i.includes("hd")?s="720p":(i.includes("480p")||i.includes("854x480")||i.includes("sd"))&&(s="480p"),i.includes("hevc")||i.includes("h265")||i.includes("x265")?g="HEVC":i.includes("av1")?g="AV1":(i.includes("h264")||i.includes("x264")||i.includes("avc"))&&(g="H.264"),i.includes("5.1")||i.includes("eac3")||i.includes("ac3")||i.includes("ddp")?h="Dolby 5.1":(i.includes("7.1")||i.includes("atmos"))&&(h="Dolby Atmos 7.1"),n&&typeof n=="string"){let b=n.split(/\r?\n/),f=0;for(let T of b){let l=T.trim();if(l.startsWith("#EXT-X-MEDIA:")&&l.includes("TYPE=AUDIO")){let e=l.match(/NAME=["']([^"']+)["']/i),p=l.match(/LANGUAGE=["']([^"']+)["']/i),m=l.match(/GROUP-ID=["']([^"']+)["']/i),u=(e?e[1]:"").toLowerCase(),o=(p?p[1]:"").toLowerCase(),d=(m?m[1]:"").toLowerCase(),k=u.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),z=d.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),w=oe.includes(o)||oe.some(A=>k.includes(A)||z.includes(A))||ze.some(A=>u.includes(A)||d.includes(A))||u.includes("t\xFCrk")||u.includes("turk")||d.includes("dual"),B=le.includes(o)||le.some(A=>k.includes(A)||z.includes(A))||we.some(A=>u.includes(A)||d.includes(A))||u.includes("orig")||u.includes("ing")||u.includes("eng");w&&(a=!0),B&&(r=!0)}if(l.startsWith("#EXT-X-MEDIA:")&&l.includes("TYPE=SUBTITLES")){let e=l.match(/URI=["']([^"']+)["']/i),p=l.match(/NAME=["']([^"']+)["']/i),m=l.match(/LANGUAGE=["']([^"']+)["']/i);if(e&&e[1]){let u=e[1];if(t&&!u.startsWith("http"))try{u=new URL(u,t).toString()}catch{}let o=p?p[1]:"Altyaz\u0131",d=m?m[1].toLowerCase():"";d==="st"||d==="sot"||o.toLowerCase().includes("sotho")||o.toLowerCase().includes("sesotho")||u.toLowerCase().includes("sub_st")?(d="tr",o="T\xFCrk\xE7e"):d||(d=o.toLowerCase().includes("t\xFCrk")?"tr":"und");let z=K(d,o);c.push({label:z.name||o,url:u,lang:z.code||d})}}if(l.startsWith("#EXT-X-STREAM-INF:")){let e=l.match(/RESOLUTION=(\d+)x(\d+)/i);if(e){let p=parseInt(e[1],10),m=parseInt(e[2],10),u=Math.min(p,m),o=Math.max(p,m),d=u>=2100||o>=3800?2160:u>=1400||o>=2500?1440:u>=1e3||o>=1900?1080:u>=700||o>=1200?720:u>=450?480:u;d>f&&(f=d)}else{let p=l.match(/NAME=["']?([^"',\s]+)["']?/i);if(p){let m=p[1].toLowerCase();m.includes("2160")||m.includes("4k")?2160>f&&(f=2160):m.includes("1440")||m.includes("2k")?1440>f&&(f=1440):m.includes("1080")?1080>f&&(f=1080):m.includes("720")&&720>f&&(f=720)}}}}f>=2160?s="4K":f>=1440?s="2K":f>=1080?s="1080p":f>=720?s="720p":f>=480&&(s="480p")}let v=a&&r||i.includes("dual")||i.includes("trdual");return{hasTurkishAudio:a,hasOriginalAudio:r,isDual:v,embeddedSubtitles:c,detectedQuality:s,detectedCodec:g,detectedAudio:h}}var M={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function K(n,t,a){let r=m=>(m||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),c=r(n||""),s=r(t||""),g=!!a||c.includes("forced")||s.includes("forced")||c.includes("zorunlu")||s.includes("zorunlu"),h=c.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),i=s.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),v=m=>{let u=m.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return g?`${u} (Zorunlu)`:u};if(h==="st"||h==="sot"||h.includes("sotho")||i.includes("sotho")||i.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:g?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let b=M[c]||M[s]||M[h]||M[i];if(!b){let m=(i+" "+h).split(/\s+/).filter(Boolean);for(let u of m)if(M[u]){b=M[u];break}}if(!b){for(let[m,u]of Object.entries(M))if(m.length>=4&&(i.includes(m)||h.includes(m))){b=u;break}}if(b)return{code:b.code,iso3:b.iso3,language:b.language,name:v(b.name)};let f=(t||n||"Altyaz\u0131").trim();f=f.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let T=f.charAt(0).toUpperCase()+f.slice(1),l=v(T),e=c&&c.length===2?c:s&&s.length===2?s:"und",p=c&&c.length===3?c:s&&s.length===3?s:"und";return{code:e,iso3:p,language:T,name:l}}function re(n){let t=n.url?Le(void 0,n.url):{},a=n.quality||n.inspection?.detectedQuality||t.detectedQuality||"1080p";a.includes("\u2022")&&(a=a.split("\u2022")[0].trim()),!a.includes("p")&&!a.includes("K")&&!a.includes("k")&&(a=`${a}p`);let r=n.subtitles||n.inspection?.subtitles,c=!!(n.inspection?.hasTurkishSubtitles||r?.some(d=>{let k=(d.lang||d.code||"").toLowerCase(),z=(d.langCode||d.iso3||"").toLowerCase(),w=(d.name||d.label||d.title||"").toLowerCase();return k==="tr"||k==="st"||z==="tur"||z==="sot"||w.includes("t\xFCrk")||w.includes("turk")||w.includes("sotho")})),s=(n.languageTitle||n.inspection?.languageTitle||"").toLowerCase().trim(),g=s.includes("dub")||s.includes("ses")||s.includes("dual")||!!t.hasTurkishAudio||!!n.inspection?.hasTurkishAudio,h=s.includes("dual")||s.includes("dub")&&(s.includes("alt")||s.includes("sub"))||g&&c,i="Orijinal";s.includes("yerli")||n.inspection?.isYerli?i="Yerli":h?i="Dublaj / Altyaz\u0131l\u0131":g?i="Dublaj":c||s.includes("alt")||s.includes("sub")?i="Altyaz\u0131l\u0131":(s.includes("orijinal")||s.includes("yabanc\u0131")||s.includes("original"))&&(i="Orijinal");let v=n.format==="m3u8"||n.url.includes(".m3u8")||n.url.includes("/master.")||n.url.includes("/hls/")||n.url.includes("/txt/"),b=n.format||(v?"m3u8":n.url.includes(".mp4")?"mp4":"m3u8"),f=b==="m3u8"?"HLS":b.toUpperCase(),T=[a],l=n.codec||n.inspection?.detectedCodec||t.detectedCodec;l&&l!=="H.264"&&T.push(l),T.push(f),n.bitrate&&T.push(n.bitrate);let e=n.audio||n.inspection?.detectedAudio||t.detectedAudio;e&&e!=="AAC 2.0"&&T.push(e);let p=n.details||T.join(" \u2022 "),m=`${i}
${p}`,u=`${a} \u2022 ${i}`,o={name:"han's 38",provider:"han's 38",title:i,description:m,url:n.url,quality:u,format:b};return n.headers&&Object.keys(n.headers).length>0&&(o.headers=n.headers),r&&r.length>0&&(o.subtitles=r),o}function ce(n){return[...n].sort((t,a)=>{let r=(t.label||t.name||"").toLowerCase().includes("forced")||(t.label||t.name||"").toLowerCase().includes("zorunlu"),c=(a.label||a.name||"").toLowerCase().includes("forced")||(a.label||a.name||"").toLowerCase().includes("zorunlu"),s=t.lang==="tr"||t.lang==="tur"||t.lang==="st"||t.langCode==="tur"||t.langCode==="sot"||(t.label||t.name||"").toLowerCase().includes("t\xFCrk")||(t.label||t.name||"").toLowerCase().includes("sotho"),g=a.lang==="tr"||a.lang==="tur"||a.lang==="st"||a.langCode==="tur"||a.langCode==="sot"||(a.label||a.name||"").toLowerCase().includes("t\xFCrk")||(a.label||a.name||"").toLowerCase().includes("sotho");if(s&&g)return!r&&c?-1:r&&!c?1:0;if(s&&!g)return-1;if(!s&&g)return 1;let h=t.lang==="en"||t.lang==="eng"||t.langCode==="eng"||(t.label||t.name||"").toLowerCase().includes("ing"),i=a.lang==="en"||a.lang==="eng"||a.langCode==="eng"||(a.label||a.name||"").toLowerCase().includes("ing");if(h&&!i)return-1;if(!h&&i)return 1;let v=t.label||t.name||t.title||"",b=a.label||a.name||a.title||"";return v.localeCompare(b,"tr")})}var H="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";function Ie(n){try{if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")return AbortSignal.timeout(n)}catch{}}async function D(n,t,a,r){if(typeof n=="object"&&n!==null){let l=n;n=l.id||l.tmdbId||l.tmdb_id||l.imdbId||l.imdb_id||"",!t&&(l.type||l.mediaType)&&(t=l.type||l.mediaType),a===void 0&&(l.season!==void 0||l.seasonNum!==void 0)&&(a=l.season??l.seasonNum),r===void 0&&(l.episode!==void 0||l.episodeNum!==void 0)&&(r=l.episode??l.episodeNum)}let c=String(n||"").trim();c.toLowerCase().startsWith("tmdb:")&&(c=c.slice(5));let s=c.split(":"),g=s[0].trim();s.length>=3&&a==null&&(a=parseInt(s[1],10),r=parseInt(s[2],10));let h=String(t||"").toLowerCase().trim(),i=h==="tv"||h==="series"||h==="show"||h==="dizi",v=i?"tv":"movie",b=a!=null?parseInt(String(a),10):1,f=r!=null?parseInt(String(r),10):1,T=Date.now();S("han's 38",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${g}, T\xFCr: ${v}${i?` (S${b}E${f})`:""}`);try{let l=g;if(l.startsWith("tt")){let _=await se(l,v);_&&_.numericId&&(l=String(_.numericId))}if(!l)return S("han's 38","Ge\xE7erli bir TMDB ID bulunamad\u0131.","warn"),[];let e=await ae("bogard");if(!e)return S("han's 38","Domain not resolved","warn"),[];e=e.replace(/\/+$/,"");let p=i?`${e}/dizi/${encodeURIComponent(l)}/${b}/${f}`:`${e}/film/${encodeURIComponent(l)}/`;S("han's 38",`[Ad\u0131m 1/3] Oynat\u0131c\u0131 sayfas\u0131na ba\u011Flan\u0131l\u0131yor: ${p}`);let m={"User-Agent":H,Referer:`${e}/`,Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},u=await fetch(p,{headers:m,signal:Ie(8e3)});if(!u.ok)return S("han's 38",`Oynat\u0131c\u0131 sayfas\u0131 a\xE7\u0131lamad\u0131: HTTP ${u.status}`,"warn"),[];let o=await u.text(),d=o.match(/const\s+src\s*=\s*['"]([^'"]+)['"]/);if(!d||!d[1])return S("han's 38","\u0130\xE7erik kaynakta bulunamad\u0131.","info"),[];let k=d[1],z=k.startsWith("http")?k:`${e}${k.startsWith("/")?"":"/"}${k}`,w=o.match(/const\s+videoId\s*=\s*(\d+)/),B=k.match(/[?&]id=(\d+)/),A=w?w[1]:B?B[1]:"",q=o.match(/const\s+tokenParams\s*=\s*['"]([^'"]+)['"]/),ue=q?q[1]:k.includes("&token=")?k.substring(k.indexOf("&token=")):"",I=null,Y=o.match(/tracksData\s*=\s*(\{[\s\S]+?\});/);if(Y)try{I=JSON.parse(Y[1])}catch{}let V=I&&Array.isArray(I.subtitles)?I.subtitles:[],j=[];for(let _=0;_<V.length;_++){let C=V[_];if(!C||!C.url)continue;let L=C.url;L.startsWith("http")||(L=`${e}/play.m3u8?id=${A}&p=${encodeURIComponent(C.url)}${ue}`);let Q=(C.name||"").trim(),me=(C.lang||C.name||"").trim(),he=!!C.forced||Q.toLowerCase().includes("forced")||L.toLowerCase().includes("forced"),R=K(me,Q,he),O=R.name;j.some(fe=>fe.url===L)||j.push({id:String(j.length),language:R.language,name:O,label:O,title:O,lang:R.code,langCode:R.iso3,url:L,type:"vtt",headers:{"User-Agent":H,Referer:`${e}/`}})}let W=ce(j),ge=I&&Array.isArray(I.audio)?I.audio:[],F=!1;for(let _ of ge){let C=(_.lang||"").toLowerCase(),L=(_.name||"").toLowerCase();if(C==="tur"||C==="tr"||L.includes("t\xFCrk")||L.includes("turk")){F=!0;break}}let J=W.some(_=>_.lang==="tr"||_.langCode==="tur"),E="Orijinal";F&&J?E="Dublaj / Altyaz\u0131l\u0131":F?E="Dublaj":J&&(E="Altyaz\u0131l\u0131");let N=re({name:"han's 38",url:z,quality:"1080p",format:"m3u8",languageTitle:E,subtitles:W,headers:{"User-Agent":H,Referer:`${e}/`,Origin:e}}),de=((Date.now()-T)/1e3).toFixed(2);return S("han's 38",`TAMAMLANDI: 1 ak\u0131\u015F haz\u0131rland\u0131 (${de}s)`,"success",[{quality:N.quality,title:N.title,format:N.format}]),[N]}catch(l){return S("han's 38",`Hata olu\u015Ftu: ${l?.message||"Bilinmeyen hata"}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=D);typeof global<"u"&&(global.getStreams=D);typeof window<"u"&&(window.getStreams=D);var Me={getStreams:D};

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

;(()=>{const n="han's 38",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
