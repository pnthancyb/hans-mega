
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

"use strict";var G=Object.defineProperty;var me=Object.getOwnPropertyDescriptor;var he=Object.getOwnPropertyNames;var fe=Object.prototype.hasOwnProperty;var pe=(i,e)=>{for(var a in e)G(i,a,{get:e[a],enumerable:!0})},be=(i,e,a,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let l of he(e))!fe.call(i,l)&&l!==a&&G(i,l,{get:()=>e[l],enumerable:!(r=me(e,l))||r.enumerable});return i};var ke=i=>be(G({},"__esModule",{value:!0}),i);var Le={};pe(Le,{default:()=>we,getStreams:()=>D});module.exports=ke(Le);var ye=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(e=>String.fromCharCode(e^42)).join(""),Te={REMOTE_CONFIG_URL:ye,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"};var $=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};$.__NUVIO_CONFIG_STATE__||($.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var y=$.__NUVIO_CONFIG_STATE__,ve=10*60*1e3;async function X(){let i=Date.now();try{let e={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let r=AbortSignal.timeout(8e3);r&&(e.signal=r)}catch{}let a=await fetch(`${Te.REMOTE_CONFIG_URL}?_t=${i}`,e);if(a.ok){let r=await a.json(),l=r?.data??r,s=l.domains||l,u=l.cookies,d=l.tmdb_keys||l.tmdbKeys;s&&typeof s=="object"&&(y.cachedDomains={...y.cachedDomains,...s}),u&&typeof u=="object"&&(y.cachedCookies={...y.cachedCookies,...u}),Array.isArray(d)&&d.length>0&&(y.cachedTmdbKeys=d),y.lastFetchTime=i}else y.lastFetchTime=0}catch{y.lastFetchTime=0}}async function Q(){let i=Date.now();(!(Object.keys(y.cachedDomains).length>0)||i-y.lastFetchTime>ve)&&(y.activeFetchPromise||(y.activeFetchPromise=X().finally(()=>{y.activeFetchPromise=null})),await y.activeFetchPromise)}async function Z(i){await Q();let e=y.cachedDomains[i]||"";return e||(await X(),e=y.cachedDomains[i]||""),e}async function ee(){return await Q(),y.cachedTmdbKeys||[]}var Ae="a2f888b27315e62e471b2d587048f32e",ae=[Ae,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function ne(i){let e=await ee(),a=e.length>0?[...e,...ae]:ae;for(let r=0;r<a.length;r++){let l=a[r],s=i.includes("?")?"&":"?",u=`https://api.themoviedb.org/3/${i}${s}api_key=${l}`;try{let d=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,t=await fetch(u,{signal:d});if(t.ok)return await t.json();if(t.status===429)continue}catch{}}return null}var x=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};x.__NUVIO_TMDB_CACHE__||(x.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var P=x.__NUVIO_TMDB_CACHE__,Me=P.imdbIdCache,N=P.tmdbTitlesCache,Be=P.tmdbImageCache,je=P.episodeGroupCache,Ee=P.absoluteEpCache;async function ie(i,e){let a=String(i||"").replace(/^tmdb:/i,"").trim();if(!a)return{titles:[]};let r=`${e}:${a}`;if(N.has(r))return N.get(r);let l=(async()=>{let s=[],u,d,t=[],T=[],h,v=[];try{let f=e==="tv"||e==="series",c=f?"tv":"movie";if(a.startsWith("tt")){let n=await ne(`find/${a}?external_source=imdb_id`);if(n){let b=f?n?.tv_results?.[0]:n?.movie_results?.[0];b&&(u=b.id,b.overview&&(h=b.overview))}}else u=parseInt(a,10);if(u&&!isNaN(u)){let n=await ne(`${c}/${u}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(n){if(n.overview&&(h=n.overview),n.title&&(s.push(n.title),n.title.includes(":"))){let o=n.title.split(":")[0].trim();o.length>2&&s.push(o)}if(n.name&&(s.push(n.name),n.name.includes(":"))){let o=n.name.split(":")[0].trim();o.length>2&&s.push(o)}if(n.original_title&&n.original_title!==n.title&&(s.push(n.original_title),n.original_title.includes(":"))){let o=n.original_title.split(":")[0].trim();o.length>2&&s.push(o)}if(n.original_name&&n.original_name!==n.name&&(s.push(n.original_name),n.original_name.includes(":"))){let o=n.original_name.split(":")[0].trim();o.length>2&&s.push(o)}if(n.translations?.translations&&Array.isArray(n.translations.translations))for(let o of n.translations.translations){let p=o.data?.name||o.data?.title;if(p&&typeof p=="string"&&(s.push(p),p.includes(":"))){let k=p.split(":")[0].trim();k.length>2&&s.push(k)}}let b=(n.alternative_titles?.results||n.alternative_titles?.titles||[]).map(o=>o.title).filter(Boolean);s.push(...b);let g=n.release_date||n.first_air_date;g&&(d=parseInt(g.split("-")[0],10)),n.genres&&Array.isArray(n.genres)&&(v=n.genres.map(o=>o.name).filter(Boolean)),n.credits?.cast&&Array.isArray(n.credits.cast)&&(t=n.credits.cast.slice(0,10).map(o=>o.name).filter(Boolean));let m=[];n.created_by&&Array.isArray(n.created_by)&&m.push(...n.created_by.map(o=>o.name).filter(Boolean)),n.credits?.crew&&Array.isArray(n.credits.crew)&&m.push(...n.credits.crew.filter(o=>o.job==="Director"||o.department==="Directing").map(o=>o.name).filter(Boolean)),T=Array.from(new Set(m))}}}catch{}return{numericId:u,titles:Array.from(new Set(s.filter(Boolean))),year:d,cast:t,creators:T,overview:h,genres:v}})();return N.set(r,l),l}function S(i,e,a="info",r){let l=`[${i}]`;a==="error"?console.error(l,e,r||""):a==="warn"?console.warn(l,e,r||""):console.log(l,e,r||"");try{let u=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof u=="string"&&u.startsWith("http")&&fetch(u,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:i,level:a,message:e,details:r})}).catch(()=>{})}catch{}}var _e=["t\xFCrk\xE7e","turkish","turkce","dublaj","tr","tur","dual","trdual","trdub","ses-tr","audio-tr","tr-dub"],ze=["english","ingilizce","original","orijinal","en","eng","und","audio-en"];function Se(i,e){let a=!1,r=!1,l=[],s,u,d,t=(e||"").toLowerCase();if(t.includes("trdual")||t.includes("dual")||t.includes("trdub")||t.includes("dublaj")?(a=!0,r=!0):(t.includes("ses-tr")||t.includes("turkcedublaj")||t.includes("turkce-dublaj"))&&(a=!0),t.includes("2160p")||t.includes("4k")||t.includes("uhd")?s="4K":t.includes("1080p")||t.includes("1920x1080")||t.includes("fhd")?s="1080p":t.includes("720p")||t.includes("1280x720")||t.includes("hd")?s="720p":(t.includes("480p")||t.includes("854x480")||t.includes("sd"))&&(s="480p"),t.includes("hevc")||t.includes("h265")||t.includes("x265")?u="HEVC":t.includes("av1")?u="AV1":(t.includes("h264")||t.includes("x264")||t.includes("avc"))&&(u="H.264"),t.includes("5.1")||t.includes("eac3")||t.includes("ac3")||t.includes("ddp")?d="Dolby 5.1":(t.includes("7.1")||t.includes("atmos"))&&(d="Dolby Atmos 7.1"),i&&typeof i=="string"){let h=i.split(/\r?\n/);for(let v of h){let f=v.trim();if(f.startsWith("#EXT-X-MEDIA:")&&f.includes("TYPE=AUDIO")){let c=f.match(/NAME=["']([^"']+)["']/i),n=f.match(/LANGUAGE=["']([^"']+)["']/i),b=f.match(/GROUP-ID=["']([^"']+)["']/i),g=(c?c[1]:"").toLowerCase(),m=(n?n[1]:"").toLowerCase(),o=(b?b[1]:"").toLowerCase(),p=_e.some(_=>g.includes(_)||m===_||o.includes(_))||g.includes("t\xFCrk")||g.includes("turk")||o.includes("dual"),k=ze.some(_=>g.includes(_)||m===_||o.includes(_))||g.includes("orig")||g.includes("ing")||g.includes("eng");p&&(a=!0),k&&(r=!0)}if(f.startsWith("#EXT-X-MEDIA:")&&f.includes("TYPE=SUBTITLES")){let c=f.match(/URI=["']([^"']+)["']/i),n=f.match(/NAME=["']([^"']+)["']/i),b=f.match(/LANGUAGE=["']([^"']+)["']/i);if(c&&c[1]){let g=c[1];if(e&&!g.startsWith("http"))try{g=new URL(g,e).toString()}catch{}let m=n?n[1]:"Altyaz\u0131",o=b?b[1].toLowerCase():"";o==="st"||o==="sot"||m.toLowerCase().includes("sotho")||m.toLowerCase().includes("sesotho")||g.toLowerCase().includes("sub_st")?(o="tr",m="T\xFCrk\xE7e"):o||(o=m.toLowerCase().includes("t\xFCrk")?"tr":"und");let k=U(o,m);l.push({label:k.name||m,url:g,lang:k.code||o})}}}}let T=a&&r||t.includes("dual")||t.includes("trdual");return{hasTurkishAudio:a,hasOriginalAudio:r,isDual:T,embeddedSubtitles:l,detectedQuality:s,detectedCodec:u,detectedAudio:d}}var L={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function U(i,e,a){let r=g=>(g||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),l=r(i||""),s=r(e||""),u=!!a||l.includes("forced")||s.includes("forced")||l.includes("zorunlu")||s.includes("zorunlu"),d=l.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),t=s.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),T=g=>{let m=g.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return u?`${m} (Zorunlu)`:m};if(d==="st"||d==="sot"||d.includes("sotho")||t.includes("sotho")||t.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:u?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let h=L[l]||L[s]||L[d]||L[t];if(!h){let g=(t+" "+d).split(/\s+/).filter(Boolean);for(let m of g)if(L[m]){h=L[m];break}}if(!h){for(let[g,m]of Object.entries(L))if(g.length>=4&&(t.includes(g)||d.includes(g))){h=m;break}}if(h)return{code:h.code,iso3:h.iso3,language:h.language,name:T(h.name)};let v=(e||i||"Altyaz\u0131").trim();v=v.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let f=v.charAt(0).toUpperCase()+v.slice(1),c=T(f),n=l&&l.length===2?l:s&&s.length===2?s:"und",b=l&&l.length===3?l:s&&s.length===3?s:"und";return{code:n,iso3:b,language:f,name:c}}function te(i){let e=i.url?Se(void 0,i.url):{},a=i.quality||e.detectedQuality||"1080p";a.includes("\u2022")&&(a=a.split("\u2022")[0].trim()),!a.includes("p")&&!a.includes("K")&&!a.includes("k")&&(a=`${a}p`);let r=i.subtitles||i.inspection?.subtitles,l=!!(i.inspection?.hasTurkishSubtitles||r?.some(p=>{let k=(p.lang||p.code||"").toLowerCase(),_=(p.langCode||p.iso3||"").toLowerCase(),I=(p.name||p.label||p.title||"").toLowerCase();return k==="tr"||k==="st"||_==="tur"||_==="sot"||I.includes("t\xFCrk")||I.includes("turk")||I.includes("sotho")})),s=(i.languageTitle||i.inspection?.languageTitle||"").toLowerCase().trim(),u=s.includes("dub")||s.includes("ses")||s.includes("dual")||!!e.hasTurkishAudio||!!i.inspection?.hasTurkishAudio,d=s.includes("dual")||s.includes("dub")&&(s.includes("alt")||s.includes("sub"))||u&&l,t="Orijinal";s.includes("yerli")||i.inspection?.isYerli?t="Yerli":d?t="Dublaj / Altyaz\u0131l\u0131":u?t="Dublaj":l||s.includes("alt")||s.includes("sub")?t="Altyaz\u0131l\u0131":(s.includes("orijinal")||s.includes("yabanc\u0131")||s.includes("original"))&&(t="Orijinal");let T=i.format==="m3u8"||i.url.includes(".m3u8")||i.url.includes("/master.")||i.url.includes("/hls/")||i.url.includes("/txt/"),h=i.format||(T?"m3u8":i.url.includes(".mp4")?"mp4":"m3u8"),v=h==="m3u8"?"HLS":h.toUpperCase(),f=[a],c=i.codec||e.detectedCodec;c&&c!=="H.264"&&f.push(c),f.push(v),i.bitrate&&f.push(i.bitrate);let n=i.audio||e.detectedAudio;n&&n!=="AAC 2.0"&&f.push(n);let b=i.details||f.join(" \u2022 "),g=`${t}
${b}`,m=`${a} \u2022 ${t}`,o={name:"han's 38",provider:"han's 38",title:t,description:g,url:i.url,quality:m,format:h};return i.headers&&Object.keys(i.headers).length>0&&(o.headers=i.headers),r&&r.length>0&&(o.subtitles=r),o}function se(i){return[...i].sort((e,a)=>{let r=(e.label||e.name||"").toLowerCase().includes("forced")||(e.label||e.name||"").toLowerCase().includes("zorunlu"),l=(a.label||a.name||"").toLowerCase().includes("forced")||(a.label||a.name||"").toLowerCase().includes("zorunlu"),s=e.lang==="tr"||e.lang==="tur"||e.lang==="st"||e.langCode==="tur"||e.langCode==="sot"||(e.label||e.name||"").toLowerCase().includes("t\xFCrk")||(e.label||e.name||"").toLowerCase().includes("sotho"),u=a.lang==="tr"||a.lang==="tur"||a.lang==="st"||a.langCode==="tur"||a.langCode==="sot"||(a.label||a.name||"").toLowerCase().includes("t\xFCrk")||(a.label||a.name||"").toLowerCase().includes("sotho");if(s&&u)return!r&&l?-1:r&&!l?1:0;if(s&&!u)return-1;if(!s&&u)return 1;let d=e.lang==="en"||e.lang==="eng"||e.langCode==="eng"||(e.label||e.name||"").toLowerCase().includes("ing"),t=a.lang==="en"||a.lang==="eng"||a.langCode==="eng"||(a.label||a.name||"").toLowerCase().includes("ing");if(d&&!t)return-1;if(!d&&t)return 1;let T=e.label||e.name||e.title||"",h=a.label||a.name||a.title||"";return T.localeCompare(h,"tr")})}var K="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";function Ce(i){try{if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")return AbortSignal.timeout(i)}catch{}}async function D(i,e,a,r){if(typeof i=="object"&&i!==null){let c=i;i=c.id||c.tmdbId||c.tmdb_id||c.imdbId||c.imdb_id||"",!e&&(c.type||c.mediaType)&&(e=c.type||c.mediaType),a===void 0&&(c.season!==void 0||c.seasonNum!==void 0)&&(a=c.season??c.seasonNum),r===void 0&&(c.episode!==void 0||c.episodeNum!==void 0)&&(r=c.episode??c.episodeNum)}let l=String(i||"").trim();l.toLowerCase().startsWith("tmdb:")&&(l=l.slice(5));let s=l.split(":"),u=s[0].trim();s.length>=3&&a==null&&(a=parseInt(s[1],10),r=parseInt(s[2],10));let d=String(e||"").toLowerCase().trim(),t=d==="tv"||d==="series"||d==="show"||d==="dizi",T=t?"tv":"movie",h=a!=null?parseInt(String(a),10):1,v=r!=null?parseInt(String(r),10):1,f=Date.now();S("han's 38",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${u}, T\xFCr: ${T}${t?` (S${h}E${v})`:""}`);try{let c=u;if(c.startsWith("tt")){let A=await ie(c,T);A&&A.numericId&&(c=String(A.numericId))}if(!c)return S("han's 38","Ge\xE7erli bir TMDB ID bulunamad\u0131.","warn"),[];let n=await Z("bogard");if(!n)return S("han's 38","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];n=n.replace(/\/+$/,"");let b=t?`${n}/dizi/${encodeURIComponent(c)}/${h}/${v}`:`${n}/film/${encodeURIComponent(c)}/`;S("han's 38",`[Ad\u0131m 1/3] Oynat\u0131c\u0131 sayfas\u0131na ba\u011Flan\u0131l\u0131yor: ${b}`);let g={"User-Agent":K,Referer:`${n}/`,Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},m=await fetch(b,{headers:g,signal:Ce(8e3)});if(!m.ok)return S("han's 38",`Oynat\u0131c\u0131 sayfas\u0131 a\xE7\u0131lamad\u0131: HTTP ${m.status}`,"warn"),[];let o=await m.text(),p=o.match(/const\s+src\s*=\s*['"]([^'"]+)['"]/);if(!p||!p[1])return S("han's 38","\u0130\xE7erik kaynakta bulunamad\u0131.","info"),[];let k=p[1],_=k.startsWith("http")?k:`${n}${k.startsWith("/")?"":"/"}${k}`,I=o.match(/const\s+videoId\s*=\s*(\d+)/),O=k.match(/[?&]id=(\d+)/),oe=I?I[1]:O?O[1]:"",H=o.match(/const\s+tokenParams\s*=\s*['"]([^'"]+)['"]/),le=H?H[1]:k.includes("&token=")?k.substring(k.indexOf("&token=")):"",w=null,q=o.match(/tracksData\s*=\s*(\{[\s\S]+?\});/);if(q)try{w=JSON.parse(q[1])}catch{}let Y=w&&Array.isArray(w.subtitles)?w.subtitles:[],M=[];for(let A=0;A<Y.length;A++){let z=Y[A];if(!z||!z.url)continue;let C=z.url;C.startsWith("http")||(C=`${n}/play.m3u8?id=${oe}&p=${encodeURIComponent(z.url)}${le}`);let J=(z.name||"").trim(),ue=(z.lang||z.name||"").trim(),ge=!!z.forced||J.toLowerCase().includes("forced")||C.toLowerCase().includes("forced"),E=U(ue,J,ge),F=E.name;M.some(de=>de.url===C)||M.push({id:String(M.length),language:E.language,name:F,label:F,title:F,lang:E.code,langCode:E.iso3,url:C,type:"vtt",headers:{"User-Agent":K,Referer:`${n}/`}})}let V=se(M),re=w&&Array.isArray(w.audio)?w.audio:[],R=!1;for(let A of re){let z=(A.lang||"").toLowerCase(),C=(A.name||"").toLowerCase();if(z==="tur"||z==="tr"||C.includes("t\xFCrk")||C.includes("turk")){R=!0;break}}let W=V.some(A=>A.lang==="tr"||A.langCode==="tur"),B="Orijinal";R&&W?B="Dublaj / Altyaz\u0131l\u0131":R?B="Dublaj":W&&(B="Altyaz\u0131l\u0131");let j=te({name:"han's 38",url:_,quality:"1080p",format:"m3u8",languageTitle:B,subtitles:V,headers:{"User-Agent":K,Referer:`${n}/`,Origin:n}}),ce=((Date.now()-f)/1e3).toFixed(2);return S("han's 38",`TAMAMLANDI: 1 ak\u0131\u015F haz\u0131rland\u0131 (${ce}s)`,"success",[{quality:j.quality,title:j.title,format:j.format}]),[j]}catch(c){return S("han's 38",`Hata olu\u015Ftu: ${c?.message||"Bilinmeyen hata"}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=D);typeof global<"u"&&(global.getStreams=D);typeof window<"u"&&(window.getStreams=D);var we={getStreams:D};

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
