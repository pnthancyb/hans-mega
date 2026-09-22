
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

"use strict";var N=Object.defineProperty;var ne=Object.getOwnPropertyDescriptor;var ie=Object.getOwnPropertyNames;var se=Object.prototype.hasOwnProperty;var te=(e,s)=>{for(var t in s)N(e,t,{get:s[t],enumerable:!0})},oe=(e,s,t,l)=>{if(s&&typeof s=="object"||typeof s=="function")for(let r of ie(s))!se.call(e,r)&&r!==t&&N(e,r,{get:()=>s[r],enumerable:!(l=ne(s,r))||l.enumerable});return e};var le=e=>oe(N({},"__esModule",{value:!0}),e);var ke={};te(ke,{getStreams:()=>ee});module.exports=le(ke);var re=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(s=>String.fromCharCode(s^42)).join(""),ce={REMOTE_CONFIG_URL:re,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},x={imu:"https://ha.vixolity.com",kalgara:"https://dizibal.org",garling:"https://liderfilmizle.vip"},R=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};R.__NUVIO_CONFIG_STATE__||(R.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var _=R.__NUVIO_CONFIG_STATE__,ue=10*60*1e3;async function U(){let e=Date.now();try{let s={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let l=AbortSignal.timeout(8e3);l&&(s.signal=l)}catch{}let t=await fetch(`${ce.REMOTE_CONFIG_URL}?_t=${e}`,s);if(t.ok){let l=await t.json(),r=l?.data??l,n=r.domains||r,m=r.cookies,b=r.tmdb_keys||r.tmdbKeys;n&&typeof n=="object"&&(_.cachedDomains={..._.cachedDomains,...n}),m&&typeof m=="object"&&(_.cachedCookies={..._.cachedCookies,...m}),Array.isArray(b)&&b.length>0&&(_.cachedTmdbKeys=b),_.lastFetchTime=e}else _.lastFetchTime=0}catch{_.lastFetchTime=0}}async function O(){let e=Date.now();(!(Object.keys(_.cachedDomains).length>0)||e-_.lastFetchTime>ue)&&(_.activeFetchPromise||(_.activeFetchPromise=U().finally(()=>{_.activeFetchPromise=null})),await _.activeFetchPromise)}async function H(e){await O();let s=_.cachedDomains[e]||x[e]||"";return s||(await U(),s=_.cachedDomains[e]||x[e]||""),s}async function V(){return await O(),_.cachedTmdbKeys||[]}var de="a2f888b27315e62e471b2d587048f32e",q=[de,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function Y(e){let s=await V(),t=s.length>0?[...s,...q]:q;for(let l=0;l<t.length;l++){let r=t[l],n=e.includes("?")?"&":"?",m=`https://api.themoviedb.org/3/${e}${n}api_key=${r}`;try{let b=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,i=await fetch(m,{signal:b});if(i.ok)return await i.json();if(i.status===429)continue}catch{}}return null}var F=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};F.__NUVIO_TMDB_CACHE__||(F.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var B=F.__NUVIO_TMDB_CACHE__,Ae=B.imdbIdCache,G=B.tmdbTitlesCache,_e=B.tmdbImageCache,ze=B.episodeGroupCache,we=B.absoluteEpCache;async function W(e,s){let t=String(e||"").replace(/^tmdb:/i,"").trim();if(!t)return{titles:[]};let l=`${s}:${t}`;if(G.has(l))return G.get(l);let r=(async()=>{let n=[],m,b,i=[],C=[],p,g=[];try{let z=s==="tv"||s==="series",k=z?"tv":"movie";if(t.startsWith("tt")){let a=await Y(`find/${t}?external_source=imdb_id`);if(a){let h=z?a?.tv_results?.[0]:a?.movie_results?.[0];h&&(m=h.id,h.overview&&(p=h.overview))}}else m=parseInt(t,10);if(m&&!isNaN(m)){let a=await Y(`${k}/${m}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(a){if(a.overview&&(p=a.overview),a.title&&(n.push(a.title),a.title.includes(":"))){let o=a.title.split(":")[0].trim();o.length>2&&n.push(o)}if(a.name&&(n.push(a.name),a.name.includes(":"))){let o=a.name.split(":")[0].trim();o.length>2&&n.push(o)}if(a.original_title&&a.original_title!==a.title&&(n.push(a.original_title),a.original_title.includes(":"))){let o=a.original_title.split(":")[0].trim();o.length>2&&n.push(o)}if(a.original_name&&a.original_name!==a.name&&(n.push(a.original_name),a.original_name.includes(":"))){let o=a.original_name.split(":")[0].trim();o.length>2&&n.push(o)}if(a.translations?.translations&&Array.isArray(a.translations.translations))for(let o of a.translations.translations){let d=o.data?.name||o.data?.title;if(d&&typeof d=="string"&&(n.push(d),d.includes(":"))){let A=d.split(":")[0].trim();A.length>2&&n.push(A)}}let h=(a.alternative_titles?.results||a.alternative_titles?.titles||[]).map(o=>o.title).filter(Boolean);n.push(...h);let u=a.release_date||a.first_air_date;u&&(b=parseInt(u.split("-")[0],10)),a.genres&&Array.isArray(a.genres)&&(g=a.genres.map(o=>o.name).filter(Boolean)),a.credits?.cast&&Array.isArray(a.credits.cast)&&(i=a.credits.cast.slice(0,10).map(o=>o.name).filter(Boolean));let c=[];a.created_by&&Array.isArray(a.created_by)&&c.push(...a.created_by.map(o=>o.name).filter(Boolean)),a.credits?.crew&&Array.isArray(a.credits.crew)&&c.push(...a.credits.crew.filter(o=>o.job==="Director"||o.department==="Directing").map(o=>o.name).filter(Boolean)),C=Array.from(new Set(c))}}}catch{}return{numericId:m,titles:Array.from(new Set(n.filter(Boolean))),year:b,cast:i,creators:C,overview:p,genres:g}})();return G.set(l,r),r}function S(e,s,t="info",l){let r=`[${e}]`;t==="error"?console.error(r,s,l||""):t==="warn"?console.warn(r,s,l||""):console.log(r,s,l||"");try{let m=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof m=="string"&&m.startsWith("http")&&fetch(m,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:t,message:s,details:l})}).catch(()=>{})}catch{}}var ge=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],J=["tr","tur","ota"],me=["english","ingilizce","original","orijinal","audio-en"],Q=["en","eng","und"];function fe(e,s){let t=!1,l=!1,r=[],n,m,b,i=(s||"").toLowerCase();if(i.includes("trdual")||i.includes("dual")||i.includes("trdub")||i.includes("dublaj")?(t=!0,l=!0):(i.includes("ses-tr")||i.includes("turkcedublaj")||i.includes("turkce-dublaj"))&&(t=!0),i.includes("2160p")||i.includes("4k")||i.includes("uhd")?n="4K":i.includes("1080p")||i.includes("1920x1080")||i.includes("fhd")?n="1080p":i.includes("720p")||i.includes("1280x720")||i.includes("hd")?n="720p":(i.includes("480p")||i.includes("854x480")||i.includes("sd"))&&(n="480p"),i.includes("hevc")||i.includes("h265")||i.includes("x265")?m="HEVC":i.includes("av1")?m="AV1":(i.includes("h264")||i.includes("x264")||i.includes("avc"))&&(m="H.264"),i.includes("5.1")||i.includes("eac3")||i.includes("ac3")||i.includes("ddp")?b="Dolby 5.1":(i.includes("7.1")||i.includes("atmos"))&&(b="Dolby Atmos 7.1"),e&&typeof e=="string"){let p=e.split(/\r?\n/),g=0;for(let z of p){let k=z.trim();if(k.startsWith("#EXT-X-MEDIA:")&&k.includes("TYPE=AUDIO")){let a=k.match(/NAME=["']([^"']+)["']/i),h=k.match(/LANGUAGE=["']([^"']+)["']/i),u=k.match(/GROUP-ID=["']([^"']+)["']/i),c=(a?a[1]:"").toLowerCase(),o=(h?h[1]:"").toLowerCase(),d=(u?u[1]:"").toLowerCase(),A=c.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),T=d.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),D=J.includes(o)||J.some(w=>A.includes(w)||T.includes(w))||ge.some(w=>c.includes(w)||d.includes(w))||c.includes("t\xFCrk")||c.includes("turk")||d.includes("dual"),M=Q.includes(o)||Q.some(w=>A.includes(w)||T.includes(w))||me.some(w=>c.includes(w)||d.includes(w))||c.includes("orig")||c.includes("ing")||c.includes("eng");D&&(t=!0),M&&(l=!0)}if(k.startsWith("#EXT-X-MEDIA:")&&k.includes("TYPE=SUBTITLES")){let a=k.match(/URI=["']([^"']+)["']/i),h=k.match(/NAME=["']([^"']+)["']/i),u=k.match(/LANGUAGE=["']([^"']+)["']/i);if(a&&a[1]){let c=a[1];if(s&&!c.startsWith("http"))try{c=new URL(c,s).toString()}catch{}let o=h?h[1]:"Altyaz\u0131",d=u?u[1].toLowerCase():"";d==="st"||d==="sot"||o.toLowerCase().includes("sotho")||o.toLowerCase().includes("sesotho")||c.toLowerCase().includes("sub_st")?(d="tr",o="T\xFCrk\xE7e"):d||(d=o.toLowerCase().includes("t\xFCrk")?"tr":"und");let T=he(d,o);r.push({label:T.name||o,url:c,lang:T.code||d})}}if(k.startsWith("#EXT-X-STREAM-INF:")){let a=k.match(/RESOLUTION=(\d+)x(\d+)/i);if(a){let h=parseInt(a[1],10),u=parseInt(a[2],10),c=Math.min(h,u),o=Math.max(h,u),d=c>=2100||o>=3800?2160:c>=1400||o>=2500?1440:c>=1e3||o>=1900?1080:c>=700||o>=1200?720:c>=450?480:c;d>g&&(g=d)}else{let h=k.match(/NAME=["']?([^"',\s]+)["']?/i);if(h){let u=h[1].toLowerCase();u.includes("2160")||u.includes("4k")?2160>g&&(g=2160):u.includes("1440")||u.includes("2k")?1440>g&&(g=1440):u.includes("1080")?1080>g&&(g=1080):u.includes("720")&&720>g&&(g=720)}}}}g>=2160?n="4K":g>=1440?n="2K":g>=1080?n="1080p":g>=720?n="720p":g>=480&&(n="480p")}let C=t&&l||i.includes("dual")||i.includes("trdual");return{hasTurkishAudio:t,hasOriginalAudio:l,isDual:C,embeddedSubtitles:r,detectedQuality:n,detectedCodec:m,detectedAudio:b}}var I={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function he(e,s,t){let l=u=>(u||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),r=l(e||""),n=l(s||""),m=!!t||r.includes("forced")||n.includes("forced")||r.includes("zorunlu")||n.includes("zorunlu"),b=r.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),i=n.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),C=u=>{let c=u.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return m?`${c} (Zorunlu)`:c};if(b==="st"||b==="sot"||b.includes("sotho")||i.includes("sotho")||i.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:m?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let p=I[r]||I[n]||I[b]||I[i];if(!p){let u=(i+" "+b).split(/\s+/).filter(Boolean);for(let c of u)if(I[c]){p=I[c];break}}if(!p){for(let[u,c]of Object.entries(I))if(u.length>=4&&(i.includes(u)||b.includes(u))){p=c;break}}if(p)return{code:p.code,iso3:p.iso3,language:p.language,name:C(p.name)};let g=(s||e||"Altyaz\u0131").trim();g=g.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let z=g.charAt(0).toUpperCase()+g.slice(1),k=C(z),a=r&&r.length===2?r:n&&n.length===2?n:"und",h=r&&r.length===3?r:n&&n.length===3?n:"und";return{code:a,iso3:h,language:z,name:k}}function X(e){let s=e.url?fe(void 0,e.url):{},t=e.quality||e.inspection?.detectedQuality||s.detectedQuality||"1080p";t.includes("\u2022")&&(t=t.split("\u2022")[0].trim()),!t.includes("p")&&!t.includes("K")&&!t.includes("k")&&(t=`${t}p`);let l=e.subtitles||e.inspection?.subtitles,r=!!(e.inspection?.hasTurkishSubtitles||l?.some(d=>{let A=(d.lang||d.code||"").toLowerCase(),T=(d.langCode||d.iso3||"").toLowerCase(),D=(d.name||d.label||d.title||"").toLowerCase();return A==="tr"||A==="st"||T==="tur"||T==="sot"||D.includes("t\xFCrk")||D.includes("turk")||D.includes("sotho")})),n=(e.languageTitle||e.inspection?.languageTitle||"").toLowerCase().trim(),m=n.includes("dub")||n.includes("ses")||n.includes("dual")||!!s.hasTurkishAudio||!!e.inspection?.hasTurkishAudio,b=n.includes("dual")||n.includes("dub")&&(n.includes("alt")||n.includes("sub"))||m&&r,i="Orijinal";n.includes("yerli")||e.inspection?.isYerli?i="Yerli":b?i="Dublaj / Altyaz\u0131l\u0131":m?i="Dublaj":r||n.includes("alt")||n.includes("sub")?i="Altyaz\u0131l\u0131":(n.includes("orijinal")||n.includes("yabanc\u0131")||n.includes("original"))&&(i="Orijinal");let C=e.format==="m3u8"||e.url.includes(".m3u8")||e.url.includes("/master.")||e.url.includes("/hls/")||e.url.includes("/txt/"),p=e.format||(C?"m3u8":e.url.includes(".mp4")?"mp4":"m3u8"),g=p==="m3u8"?"HLS":p.toUpperCase(),z=[t],k=e.codec||e.inspection?.detectedCodec||s.detectedCodec;k&&k!=="H.264"&&z.push(k),z.push(g),e.bitrate&&z.push(e.bitrate);let a=e.audio||e.inspection?.detectedAudio||s.detectedAudio;a&&a!=="AAC 2.0"&&z.push(a);let h=e.details||z.join(" \u2022 "),u=`${i}
${h}`,c=`${t} \u2022 ${i}`,o={name:"han's 23",provider:"han's 23",title:i,description:u,url:e.url,quality:c,format:p};return e.headers&&Object.keys(e.headers).length>0&&(o.headers=e.headers),l&&l.length>0&&(o.subtitles=l),o}var j="9iQNC5HQwPlaFuJDkhncJ5XTJ8feGXOJatAA",be="308202c3308201aba0030201020204075cec01300d06092a864886f70d01010b050030123110300e0603550403130753696e65776978301e170d3231303932313233333334395a170d3436303931353233333334395a30123110300e0603550403130753696e6577697830820122300d06092a864886f70d01010105000382010f003082010a0282010100b0a2a1bc5c3f16f19c3b2456cfd0a6128ced9f5e2e2c4cca1a100e17b07b86256258f372e76a95a17e9e4a1c048e364835723a95e8ef6d5bdfb5694b50277c65a64f7b012fdf164e5dc93629561f6ca29b7dc82ebb3d6f3c8e8fc6795847fe331ad4a13ed6c059a83804c43d3747526d769580f3a4153752eb22dac66dd15f1582caa43305dc49f55ac7b1b89013e654d2ca8c94c30956659674cc673256c04208f09118bae14cdd72d78f9ee2aece958084a8c2e315deff45726d4fc1f18ec39569ff1abe4f36a8d01090e5f68c07c28763513b88208bcac1a6e1941f6fd8bfdd52f832098ddb2154c8f565bc5d58c7106a19e03787e75c7f34997000e3bcf30203010001a321301f301d0603551d0e04160414b545fc18e74a791d9402b53940ae38b96e9e209c300d06092a864886f70d01010b05000382010100a8a64d9e7c8b5db102af15d3caf94ff8d3e9be9008bb0021117ca2f0762e68583354b126a041bb1fb6e6308e421e4b5a71f779cde63e5d2fc5976bff966c3c4034e852c077d8e74458fbae2ec1db74b1f4082e188bf8ef7c42a44e3fbfb693bb00ee2a727096b42360ddce1bdcd3536f50c8693bcc62a7b7204bcefe2ecf1f7c820bcd63e1d7a6acc8bf6163086915fc5f607cf51bc7a8635f98bb4c65a8f24b7b5a82c7b06868f565cb0d6ac4775c4aac777536ddd1a565f990fd8cbe539185fa7aab610b7855a687a00f4e55536d72873444552c50fd10727dbf298a9be6ed6ae62148dd1de365f3729915dd31975e28a472d752ac14db3db548405cc31e1e",Z={signature:be,hash256:"f4d4bc98a3fc4600e7f2c2bab7533f1f03d8a70ff03c256bb11dc57050536bd0","User-Agent":"EasyPlex (Android 13; SM-A546E; samsung; tr)","user-agent":"EasyPlex (Android 13; SM-A546E; samsung; tr)",Accept:"application/json"};async function pe(e){if(!e.includes("mediafire.com"))return e;try{let s=await fetch(e,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}});if(s.ok){let t=await s.text(),l=t.match(/href="([^"]+)"[^>]*id="downloadButton"/)||t.match(/id="downloadButton"[^>]*href="([^"]+)"/);if(l&&l[1])return l[1]}}catch{}return e}async function ee(e,s,t,l){let r=Date.now();S("han's 23",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${e}, T\xFCr: ${s}, Sezon: ${t}, B\xF6l\xFCm: ${l}`);try{let n=String(e||"").trim(),m=String(s||"").toLowerCase().trim(),b=m==="tv"||m==="series",i=b?"tv":"movie",C=t!=null?parseInt(String(t),10):1,p=l!=null?parseInt(String(l),10):1;if(!n)return[];let g=await H("vegapunk");if(!g)return S("han's 23","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];S("han's 23",`[Ad\u0131m 1/4] TMDB bilgileri al\u0131n\u0131yor (${n})...`);let z=await W(n,i),k=(z?.titles||[]).filter(Boolean);if(k.length===0)return S("han's 23","TMDB ba\u015Fl\u0131k bilgisi al\u0131namad\u0131.","error"),[];S("han's 23",`[Ad\u0131m 2/4] Katalog taran\u0131yor (${JSON.stringify(k)})...`);let a=[];for(let f of k)try{let y=`${g}/public/api/search/${encodeURIComponent(f)}/${j}`,v=await fetch(y,{headers:Z});if(v.ok){let L=await v.json();if(Array.isArray(L.search)&&L.search.length>0){a=L.search;break}}}catch(y){S("han's 23",`Arama Hatas\u0131 (${f}): ${y.message}`,"warn")}if(a.length===0)return S("han's 23","E\u015Fle\u015Fen i\xE7erik bulunamad\u0131.","warn"),[];let h=b?a.filter(f=>f.type==="serie"||f.type==="anime"):a.filter(f=>f.type==="movie");h.length===0&&(h=a);let u=String(z?.numericId||n);S("han's 23",`[Ad\u0131m 3/4] Kesin TMDB ID (${u}) do\u011Frulamas\u0131 yap\u0131l\u0131yor (${h.length} aday)...`);let c=h.map(async f=>{let y="";f.type==="movie"?y=`${g}/public/api/media/detail/${f.id}/${j}`:f.type==="serie"?y=`${g}/public/api/series/show/${f.id}/${j}`:y=`${g}/public/api/animes/show/${f.id}/${j}`;try{let v=await fetch(y,{headers:Z});if(v.ok){let L=await v.json();return{candidate:f,data:L}}}catch{}return null}),d=(await Promise.all(c)).find(f=>{if(!f||!f.data)return!1;let y=String(f.data.tmdb_id||"");return y===u||y===String(n)});if(!d)return S("han's 23",`TMDB ID (${u}) ile tam e\u015Fle\u015Fen i\xE7erik do\u011Frulanamad\u0131.`,"warn"),[];let A=d.data;S("han's 23",` \u0130\xE7erik do\u011Fruland\u0131: ${A.title||A.name||A.originalName}`,"success");let T=null,D="Dual";if(b){if(Array.isArray(A.seasons)){let f=A.seasons.find(y=>y.season_number===C||y.seasonNumber===C);if(f&&Array.isArray(f.episodes)){let y=f.episodes.find(v=>v.episode_number===p||v.episodeNumber===p);y&&Array.isArray(y.videos)&&y.videos.length>0&&(T=y.videos[0].link,D=y.videos[0].lang||"Dual")}if(!T){for(let y of A.seasons)if(Array.isArray(y.episodes)){for(let v of y.episodes){if((v.episode_number===p||v.episodeNumber===p)&&Array.isArray(v.videos)&&v.videos.length>0){T=v.videos[0].link,D=v.videos[0].lang||"Dual";break}if(v.name){let L=v.name.match(/(\d+)\.\s*Bölüm/i);if(L&&parseInt(L[1],10)===p&&Array.isArray(v.videos)&&v.videos.length>0){T=v.videos[0].link,D=v.videos[0].lang||"Dual";break}}}if(T)break}}}}else if(Array.isArray(A.videos)&&A.videos.length>0){let f=A.videos[0];T=f.link,D=f.lang||"Dual"}if(!T)return S("han's 23","Bu b\xF6l\xFCm/film i\xE7in yay\u0131n kayna\u011F\u0131 bulunamad\u0131.","warn"),[];T.includes("mediafire.com")&&(T=await pe(T));let M=T.toLowerCase(),w="mp4";M.includes(".m3u8")||M.includes("/hls/")?w="m3u8":M.includes(".mkv")?w="mkv":M.includes(".mp4")&&(w="mp4");let P=(D||"").toLowerCase(),K=T.toLowerCase(),E="Altyaz\u0131";P.includes("dual")||P.includes("dublaj")||K.includes("dual")||K.includes("dublaj")?E="Dublaj / Altyaz\u0131":P.includes("t\xFCrk\xE7e")||P.includes("yerli")?E="T\xFCrk\xE7e":P.includes("altyaz")&&(E="Altyaz\u0131");let $=X({name:"han's 23",url:T,languageTitle:E,quality:"1080p",format:w,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}}),ae=((Date.now()-r)/1e3).toFixed(2);return S("han's 23",`[Ad\u0131m 4/4] TAMAMLANDI: 1080p ak\u0131\u015F haz\u0131rland\u0131 (${ae}s)`,"success",[$].map(f=>({server:f.name,kalite:f.quality,title:f.title}))),[$]}catch(n){return S("han's 23",`Kritik Hata: ${n.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=ee);

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

;(()=>{const n="han's 23",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
