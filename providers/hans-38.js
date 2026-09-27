
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

"use strict";var U=Object.defineProperty;var pe=Object.getOwnPropertyDescriptor;var be=Object.getOwnPropertyNames;var ke=Object.prototype.hasOwnProperty;var ye=(i,s)=>{for(var e in s)U(i,e,{get:s[e],enumerable:!0})},Te=(i,s,e,r)=>{if(s&&typeof s=="object"||typeof s=="function")for(let c of be(s))!ke.call(i,c)&&c!==e&&U(i,c,{get:()=>s[c],enumerable:!(r=pe(s,c))||r.enumerable});return i};var _e=i=>Te(U({},"__esModule",{value:!0}),i);var De={};ye(De,{default:()=>Me,getStreams:()=>P});module.exports=_e(De);function C(i,s,e="info",r){let c=`[${i}]`;e==="error"?console.error(c,s,r||""):e==="warn"?console.warn(c,s,r||""):console.log(c,s,r||"");try{let d=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof d=="string"&&d.startsWith("http")&&fetch(d,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:i,level:e,message:s,details:r})}).catch(()=>{})}catch{}}var ve=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(s=>String.fromCharCode(s^42)).join(""),Ae={REMOTE_CONFIG_URL:ve,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},F=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};try{typeof localStorage<"u"&&localStorage&&typeof localStorage.removeItem=="function"&&(localStorage.removeItem("__NUVIO_CONFIG_CACHE__"),localStorage.removeItem("__NUVIO_CONFIG_CACHE_V2__"))}catch{}var X=10*1e3,Se=10*1e3;F.__NUVIO_CONFIG_STATE__||(F.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var y=F.__NUVIO_CONFIG_STATE__;async function Z(){let i=Date.now(),s=[];try{let e=F.__NUVIO_DEV_LOG_URL__;typeof e=="string"&&e.includes("/api/log")&&s.push(e.replace("/api/log","/domains"))}catch{}s.push(Ae.REMOTE_CONFIG_URL);for(let e of s)try{let r=await fetch(e);if(r.ok){let c=await r.json(),t=c?.data??c,d=t.domains||t,h=t.cookies,n=t.tmdb_keys||t.tmdbKeys;d&&typeof d=="object"&&(y.cachedDomains={...y.cachedDomains,...d}),h&&typeof h=="object"&&(y.cachedCookies={...y.cachedCookies,...h}),Array.isArray(n)&&n.length>0&&(y.cachedTmdbKeys=n),y.lastFetchTime=i;return}}catch(r){C("Config",`Domain alinamadi (${e}): ${r.message}`,"warn")}y.lastFetchTime=i-X+Se}async function ee(){let i=Date.now();(!(Object.keys(y.cachedDomains).length>0)||i-y.lastFetchTime>X)&&(y.activeFetchPromise||(y.activeFetchPromise=Z().finally(()=>{y.activeFetchPromise=null})),await y.activeFetchPromise)}async function ae(i){return await ee(),y.cachedDomains[i]||await Z(),y.cachedDomains[i]||""}async function ne(){return await ee(),y.cachedTmdbKeys||[]}var Ce="a2f888b27315e62e471b2d587048f32e",ie=[Ce,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function te(i){let s=await ne(),e=s.length>0?[...s,...ie]:ie;for(let r=0;r<e.length;r++){let c=e[r],t=i.includes("?")?"&":"?",d=`https://api.themoviedb.org/3/${i}${t}api_key=${c}`;try{let h=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,n=await fetch(d,{signal:h});if(n.ok)return await n.json();if(n.status===429)continue}catch{}}return null}var x=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};x.__NUVIO_TMDB_CACHE__||(x.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var D=x.__NUVIO_TMDB_CACHE__,Re=D.imdbIdCache,$=D.tmdbTitlesCache,Fe=D.tmdbImageCache,Ge=D.episodeGroupCache,Oe=D.absoluteEpCache;async function se(i,s){let e=String(i||"").replace(/^tmdb:/i,"").trim();if(!e)return{titles:[]};let r=`${s}:${e}`;if($.has(r))return $.get(r);let c=(async()=>{let t=[],d,h,n=[],_=[],b,f=[];try{let T=s==="tv"||s==="series",l=T?"tv":"movie";if(e.startsWith("tt")){let a=await te(`find/${e}?external_source=imdb_id`);if(a){let p=T?a?.tv_results?.[0]:a?.movie_results?.[0];p&&(d=p.id,p.overview&&(b=p.overview))}}else d=parseInt(e,10);if(d&&!isNaN(d)){let a=await te(`${l}/${d}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(a){if(a.overview&&(b=a.overview),a.title&&(t.push(a.title),a.title.includes(":"))){let o=a.title.split(":")[0].trim();o.length>2&&t.push(o)}if(a.name&&(t.push(a.name),a.name.includes(":"))){let o=a.name.split(":")[0].trim();o.length>2&&t.push(o)}if(a.original_title&&a.original_title!==a.title&&(t.push(a.original_title),a.original_title.includes(":"))){let o=a.original_title.split(":")[0].trim();o.length>2&&t.push(o)}if(a.original_name&&a.original_name!==a.name&&(t.push(a.original_name),a.original_name.includes(":"))){let o=a.original_name.split(":")[0].trim();o.length>2&&t.push(o)}if(a.translations?.translations&&Array.isArray(a.translations.translations))for(let o of a.translations.translations){let g=o.data?.name||o.data?.title;if(g&&typeof g=="string"&&(t.push(g),g.includes(":"))){let k=g.split(":")[0].trim();k.length>2&&t.push(k)}}let p=(a.alternative_titles?.results||a.alternative_titles?.titles||[]).map(o=>o.title).filter(Boolean);t.push(...p);let m=a.release_date||a.first_air_date;if(m&&(h=parseInt(m.split("-")[0],10)),a.genres&&Array.isArray(a.genres)&&(f=a.genres.map(o=>o.name).filter(Boolean)),a.credits?.cast&&Array.isArray(a.credits.cast)){let o=new Set;a.credits.cast.slice(0,15).forEach(g=>{g.name&&o.add(g.name),g.original_name&&o.add(g.original_name)}),n=Array.from(o)}let u=[];a.created_by&&Array.isArray(a.created_by)&&u.push(...a.created_by.map(o=>o.name).filter(Boolean)),a.credits?.crew&&Array.isArray(a.credits.crew)&&u.push(...a.credits.crew.filter(o=>o.job==="Director"||o.department==="Directing").map(o=>o.name).filter(Boolean)),_=Array.from(new Set(u))}}}catch{}return{numericId:d,titles:Array.from(new Set(t.filter(Boolean))),year:h,cast:n,creators:_,overview:b,genres:f}})();return $.set(r,c),c}var ze=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],oe=["tr","tur","ota"],we=["english","ingilizce","original","orijinal","audio-en"],le=["en","eng","und"];function Le(i,s){let e=!1,r=!1,c=[],t,d,h,n=(s||"").toLowerCase();if(n.includes("trdual")||n.includes("dual")||n.includes("trdub")||n.includes("dublaj")?(e=!0,r=!0):(n.includes("ses-tr")||n.includes("turkcedublaj")||n.includes("turkce-dublaj"))&&(e=!0),n.includes("2160p")||n.includes("4k")||n.includes("uhd")||n.includes("-2160.")?t="4K":n.includes("1080p")||n.includes("1920x1080")||n.includes("fhd")||n.includes("-1080.")?t="1080p":n.includes("720p")||n.includes("1280x720")||n.includes("hd")||n.includes("-720.")?t="720p":n.includes("480p")||n.includes("854x480")||n.includes("sd")||n.includes("-480.")?t="480p":(n.includes("360p")||n.includes("640x360")||n.includes("-360."))&&(t="360p"),n.includes("hevc")||n.includes("h265")||n.includes("x265")?d="HEVC":n.includes("av1")?d="AV1":(n.includes("h264")||n.includes("x264")||n.includes("avc"))&&(d="H.264"),n.includes("5.1")||n.includes("eac3")||n.includes("ac3")||n.includes("ddp")?h="Dolby 5.1":(n.includes("7.1")||n.includes("atmos"))&&(h="Dolby Atmos 7.1"),i&&typeof i=="string"){let b=i.split(/\r?\n/),f=0;for(let T of b){let l=T.trim();if(l.startsWith("#EXT-X-MEDIA:")&&l.includes("TYPE=AUDIO")){let a=l.match(/NAME=["']([^"']+)["']/i),p=l.match(/LANGUAGE=["']([^"']+)["']/i),m=l.match(/GROUP-ID=["']([^"']+)["']/i),u=(a?a[1]:"").toLowerCase(),o=(p?p[1]:"").toLowerCase(),g=(m?m[1]:"").toLowerCase(),k=u.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),z=g.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),w=oe.includes(o)||oe.some(A=>k.includes(A)||z.includes(A))||ze.some(A=>u.includes(A)||g.includes(A))||u.includes("t\xFCrk")||u.includes("turk")||g.includes("dual"),B=le.includes(o)||le.some(A=>k.includes(A)||z.includes(A))||we.some(A=>u.includes(A)||g.includes(A))||u.includes("orig")||u.includes("ing")||u.includes("eng");w&&(e=!0),B&&(r=!0)}if(l.startsWith("#EXT-X-MEDIA:")&&l.includes("TYPE=SUBTITLES")){let a=l.match(/URI=["']([^"']+)["']/i),p=l.match(/NAME=["']([^"']+)["']/i),m=l.match(/LANGUAGE=["']([^"']+)["']/i);if(a&&a[1]){let u=a[1];if(s&&!u.startsWith("http"))try{u=new URL(u,s).toString()}catch{}let o=p?p[1]:"Altyaz\u0131",g=m?m[1].toLowerCase():"";g==="st"||g==="sot"||o.toLowerCase().includes("sotho")||o.toLowerCase().includes("sesotho")||u.toLowerCase().includes("sub_st")?(g="tr",o="T\xFCrk\xE7e"):g||(g=o.toLowerCase().includes("t\xFCrk")?"tr":"und");let z=K(g,o);c.push({label:z.name||o,url:u,lang:z.code||g})}}if(l.startsWith("#EXT-X-STREAM-INF:")){let a=l.match(/RESOLUTION=(\d+)x(\d+)/i);if(a){let p=parseInt(a[1],10),m=parseInt(a[2],10),u=Math.min(p,m),o=Math.max(p,m),g=u>=2100||o>=3800?2160:u>=1400||o>=2500?1440:u>=1e3||o>=1900?1080:u>=700||o>=1200?720:u>=450?480:u;g>f&&(f=g)}else{let p=l.match(/NAME=["']?([^"',\s]+)["']?/i);if(p){let m=p[1].toLowerCase();m.includes("2160")||m.includes("4k")?2160>f&&(f=2160):m.includes("1440")||m.includes("2k")?1440>f&&(f=1440):m.includes("1080")?1080>f&&(f=1080):m.includes("720")&&720>f&&(f=720)}}}}f>=2160?t="4K":f>=1440?t="2K":f>=1080?t="1080p":f>=720?t="720p":f>=480&&(t="480p")}let _=e&&r||n.includes("dual")||n.includes("trdual");return{hasTurkishAudio:e,hasOriginalAudio:r,isDual:_,embeddedSubtitles:c,detectedQuality:t,detectedCodec:d,detectedAudio:h}}var M={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function K(i,s,e){let r=m=>(m||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),c=r(i||""),t=r(s||""),d=!!e||c.includes("forced")||t.includes("forced")||c.includes("zorunlu")||t.includes("zorunlu"),h=c.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),n=t.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),_=m=>{let u=m.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return d?`${u} (Zorunlu)`:u};if(h==="st"||h==="sot"||h.includes("sotho")||n.includes("sotho")||n.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:d?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let b=M[c]||M[t]||M[h]||M[n];if(!b){let m=(n+" "+h).split(/\s+/).filter(Boolean);for(let u of m)if(M[u]){b=M[u];break}}if(!b){for(let[m,u]of Object.entries(M))if(m.length>=4&&(n.includes(m)||h.includes(m))){b=u;break}}if(b)return{code:b.code,iso3:b.iso3,language:b.language,name:_(b.name)};let f=(s||i||"Altyaz\u0131").trim();f=f.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let T=f.charAt(0).toUpperCase()+f.slice(1),l=_(T),a=c&&c.length===2?c:t&&t.length===2?t:"und",p=c&&c.length===3?c:t&&t.length===3?t:"und";return{code:a,iso3:p,language:T,name:l}}function re(i){let s=i.url?Le(void 0,i.url):{},e=i.quality||i.inspection?.detectedQuality||s.detectedQuality||"1080p";e.includes("\u2022")&&(e=e.split("\u2022")[0].trim()),!e.includes("p")&&!e.includes("K")&&!e.includes("k")&&e!=="HD"&&e!=="FHD"&&e!=="SD"&&(e=`${e}p`);let r=i.subtitles||i.inspection?.subtitles,c=!!(i.inspection?.hasTurkishSubtitles||r?.some(g=>{let k=(g.lang||g.code||"").toLowerCase(),z=(g.langCode||g.iso3||"").toLowerCase(),w=(g.name||g.label||g.title||"").toLowerCase();return k==="tr"||k==="st"||z==="tur"||z==="sot"||w.includes("t\xFCrk")||w.includes("turk")||w.includes("sotho")})),t=(i.languageTitle||i.inspection?.languageTitle||"").toLowerCase().trim(),d=t.includes("dub")||t.includes("ses")||t.includes("dual")||!!s.hasTurkishAudio||!!i.inspection?.hasTurkishAudio,h=t.includes("dual")||t.includes("dub")&&(t.includes("alt")||t.includes("sub"))||d&&c,n="Orijinal";t.includes("yerli")||i.inspection?.isYerli?n="Yerli":h?n="Dublaj / Altyaz\u0131l\u0131":d?n="Dublaj":c||t.includes("alt")||t.includes("sub")?n="Altyaz\u0131l\u0131":(t.includes("orijinal")||t.includes("yabanc\u0131")||t.includes("original"))&&(n="Orijinal");let _=i.format==="m3u8"||i.url.includes(".m3u8")||i.url.includes("/master.")||i.url.includes("/hls/")||i.url.includes("/txt/"),b=i.format||(_?"m3u8":i.url.includes(".mp4")?"mp4":"m3u8"),f=b==="m3u8"?"HLS":b.toUpperCase(),T=[e],l=i.codec||i.inspection?.detectedCodec||s.detectedCodec;l&&l!=="H.264"&&T.push(l),T.push(f),i.bitrate&&T.push(i.bitrate);let a=i.audio||i.inspection?.detectedAudio||s.detectedAudio;a&&a!=="AAC 2.0"&&T.push(a);let p=i.details||T.join(" \u2022 "),m=`${n}
${p}`,u=`${e} \u2022 ${n}`,o={name:"han's 38",provider:"han's 38",title:n,description:m,url:i.url,quality:u,format:b};return i.headers&&Object.keys(i.headers).length>0&&(o.headers=i.headers),r&&r.length>0&&(o.subtitles=r),o}function ce(i){return[...i].sort((s,e)=>{let r=(s.label||s.name||"").toLowerCase().includes("forced")||(s.label||s.name||"").toLowerCase().includes("zorunlu"),c=(e.label||e.name||"").toLowerCase().includes("forced")||(e.label||e.name||"").toLowerCase().includes("zorunlu"),t=s.lang==="tr"||s.lang==="tur"||s.lang==="st"||s.langCode==="tur"||s.langCode==="sot"||(s.label||s.name||"").toLowerCase().includes("t\xFCrk")||(s.label||s.name||"").toLowerCase().includes("sotho"),d=e.lang==="tr"||e.lang==="tur"||e.lang==="st"||e.langCode==="tur"||e.langCode==="sot"||(e.label||e.name||"").toLowerCase().includes("t\xFCrk")||(e.label||e.name||"").toLowerCase().includes("sotho");if(t&&d)return!r&&c?-1:r&&!c?1:0;if(t&&!d)return-1;if(!t&&d)return 1;let h=s.lang==="en"||s.lang==="eng"||s.langCode==="eng"||(s.label||s.name||"").toLowerCase().includes("ing"),n=e.lang==="en"||e.lang==="eng"||e.langCode==="eng"||(e.label||e.name||"").toLowerCase().includes("ing");if(h&&!n)return-1;if(!h&&n)return 1;let _=s.label||s.name||s.title||"",b=e.label||e.name||e.title||"";return _.localeCompare(b,"tr")})}var H="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";function Ie(i){try{if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")return AbortSignal.timeout(i)}catch{}}async function P(i,s,e,r){if(typeof i=="object"&&i!==null){let l=i;i=l.id||l.tmdbId||l.tmdb_id||l.imdbId||l.imdb_id||"",!s&&(l.type||l.mediaType)&&(s=l.type||l.mediaType),e===void 0&&(l.season!==void 0||l.seasonNum!==void 0)&&(e=l.season??l.seasonNum),r===void 0&&(l.episode!==void 0||l.episodeNum!==void 0)&&(r=l.episode??l.episodeNum)}let c=String(i||"").trim();c.toLowerCase().startsWith("tmdb:")&&(c=c.slice(5));let t=c.split(":"),d=t[0].trim();t.length>=3&&e==null&&(e=parseInt(t[1],10),r=parseInt(t[2],10));let h=String(s||"").toLowerCase().trim(),n=h==="tv"||h==="series"||h==="show"||h==="dizi",_=n?"tv":"movie",b=e!=null?parseInt(String(e),10):1,f=r!=null?parseInt(String(r),10):1,T=Date.now();C("han's 38",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${d}, T\xFCr: ${_}${n?` (S${b}E${f})`:""}`);try{let l=d;if(l.startsWith("tt")){let v=await se(l,_);v&&v.numericId&&(l=String(v.numericId))}if(!l)return C("han's 38","Ge\xE7erli bir TMDB ID bulunamad\u0131.","warn"),[];let a=await ae("bogard");if(!a)return C("han's 38","Domain not resolved","warn"),[];a=a.replace(/\/+$/,"");let p=n?`${a}/dizi/${encodeURIComponent(l)}/${b}/${f}`:`${a}/film/${encodeURIComponent(l)}/`;C("han's 38",`[Ad\u0131m 1/3] Oynat\u0131c\u0131 sayfas\u0131na ba\u011Flan\u0131l\u0131yor: ${p}`);let m={"User-Agent":H,Referer:`${a}/`,Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},u=await fetch(p,{headers:m,signal:Ie(8e3)});if(!u.ok)return C("han's 38",`Oynat\u0131c\u0131 sayfas\u0131 a\xE7\u0131lamad\u0131: HTTP ${u.status}`,"warn"),[];let o=await u.text(),g=o.match(/const\s+src\s*=\s*['"]([^'"]+)['"]/);if(!g||!g[1])return C("han's 38","\u0130\xE7erik kaynakta bulunamad\u0131.","info"),[];let k=g[1],z=k.startsWith("http")?k:`${a}${k.startsWith("/")?"":"/"}${k}`,w=o.match(/const\s+videoId\s*=\s*(\d+)/),B=k.match(/[?&]id=(\d+)/),A=w?w[1]:B?B[1]:"",q=o.match(/const\s+tokenParams\s*=\s*['"]([^'"]+)['"]/),ue=q?q[1]:k.includes("&token=")?k.substring(k.indexOf("&token=")):"",I=null,Y=o.match(/tracksData\s*=\s*(\{[\s\S]+?\});/);if(Y)try{I=JSON.parse(Y[1])}catch{}let V=I&&Array.isArray(I.subtitles)?I.subtitles:[],E=[];for(let v=0;v<V.length;v++){let S=V[v];if(!S||!S.url)continue;let L=S.url;L.startsWith("http")||(L=`${a}/play.m3u8?id=${A}&p=${encodeURIComponent(S.url)}${ue}`);let Q=(S.name||"").trim(),me=(S.lang||S.name||"").trim(),he=!!S.forced||Q.toLowerCase().includes("forced")||L.toLowerCase().includes("forced"),R=K(me,Q,he),O=R.name;E.some(fe=>fe.url===L)||E.push({id:String(E.length),language:R.language,name:O,label:O,title:O,lang:R.code,langCode:R.iso3,url:L,type:"vtt",headers:{"User-Agent":H,Referer:`${a}/`}})}let W=ce(E),ge=I&&Array.isArray(I.audio)?I.audio:[],G=!1;for(let v of ge){let S=(v.lang||"").toLowerCase(),L=(v.name||"").toLowerCase();if(S==="tur"||S==="tr"||L.includes("t\xFCrk")||L.includes("turk")){G=!0;break}}let J=W.some(v=>v.lang==="tr"||v.langCode==="tur"),j="Orijinal";G&&J?j="Dublaj / Altyaz\u0131l\u0131":G?j="Dublaj":J&&(j="Altyaz\u0131l\u0131");let N=re({name:"han's 38",url:z,quality:"1080p",format:"m3u8",languageTitle:j,subtitles:W,headers:{"User-Agent":H,Referer:`${a}/`,Origin:a}}),de=((Date.now()-T)/1e3).toFixed(2);return C("han's 38",`TAMAMLANDI: 1 ak\u0131\u015F haz\u0131rland\u0131 (${de}s)`,"success",[{quality:N.quality,title:N.title,format:N.format}]),[N]}catch(l){return C("han's 38",`Hata olu\u015Ftu: ${l?.message||"Bilinmeyen hata"}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=P);typeof global<"u"&&(global.getStreams=P);typeof window<"u"&&(window.getStreams=P);var Me={getStreams:P};

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
