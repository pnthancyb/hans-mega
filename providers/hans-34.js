
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

"use strict";var $=Object.defineProperty;var ge=Object.getOwnPropertyDescriptor;var de=Object.getOwnPropertyNames;var me=Object.prototype.hasOwnProperty;var he=(e,n)=>{for(var o in n)$(e,o,{get:n[o],enumerable:!0})},pe=(e,n,o,t)=>{if(n&&typeof n=="object"||typeof n=="function")for(let r of de(n))!me.call(e,r)&&r!==o&&$(e,r,{get:()=>n[r],enumerable:!(t=ge(n,r))||t.enumerable});return e};var fe=e=>pe($({},"__esModule",{value:!0}),e);var Le={};he(Le,{default:()=>Me,getStreams:()=>j});module.exports=fe(Le);var be=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(n=>String.fromCharCode(n^42)).join(""),ke={REMOTE_CONFIG_URL:be,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"};var E=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};E.__NUVIO_CONFIG_STATE__||(E.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var _=E.__NUVIO_CONFIG_STATE__,ye=10*60*1e3;async function Z(){let e=Date.now();try{let n={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let t=AbortSignal.timeout(8e3);t&&(n.signal=t)}catch{}let o=await fetch(`${ke.REMOTE_CONFIG_URL}?_t=${e}`,n);if(o.ok){let t=await o.json(),r=t?.data??t,i=r.domains||r,c=r.cookies,u=r.tmdb_keys||r.tmdbKeys;i&&typeof i=="object"&&(_.cachedDomains={..._.cachedDomains,...i}),c&&typeof c=="object"&&(_.cachedCookies={..._.cachedCookies,...c}),Array.isArray(u)&&u.length>0&&(_.cachedTmdbKeys=u),_.lastFetchTime=e}else _.lastFetchTime=0}catch{_.lastFetchTime=0}}async function Q(){let e=Date.now();(!(Object.keys(_.cachedDomains).length>0)||e-_.lastFetchTime>ye)&&(_.activeFetchPromise||(_.activeFetchPromise=Z().finally(()=>{_.activeFetchPromise=null})),await _.activeFetchPromise)}async function ee(e){await Q();let n=_.cachedDomains[e]||"";return n||(await Z(),n=_.cachedDomains[e]||""),n}async function ae(){return await Q(),_.cachedTmdbKeys||[]}var ve="a2f888b27315e62e471b2d587048f32e",ne=[ve,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function N(e){let n=await ae(),o=n.length>0?[...n,...ne]:ne;for(let t=0;t<o.length;t++){let r=o[t],i=e.includes("?")?"&":"?",c=`https://api.themoviedb.org/3/${e}${i}api_key=${r}`;try{let u=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,a=await fetch(c,{signal:u});if(a.ok)return await a.json();if(a.status===429)continue}catch{}}return null}var G=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};G.__NUVIO_TMDB_CACHE__||(G.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var F=G.__NUVIO_TMDB_CACHE__,H=F.imdbIdCache,R=F.tmdbTitlesCache,Be=F.tmdbImageCache,$e=F.episodeGroupCache,Ee=F.absoluteEpCache;async function ie(e,n){let o=String(e||"").replace(/^tmdb:/i,"").trim();if(!o)return null;if(o.startsWith("tt"))return o;let t=`${n}:${o}`;if(H.has(t))return H.get(t);let r=(async()=>{try{let c=await N(`${n==="tv"||n==="series"?"tv":"movie"}/${o}/external_ids`);if(c&&c.imdb_id)return c.imdb_id}catch{}return null})();return H.set(t,r),r}async function te(e,n){let o=String(e||"").replace(/^tmdb:/i,"").trim();if(!o)return{titles:[]};let t=`${n}:${o}`;if(R.has(t))return R.get(t);let r=(async()=>{let i=[],c,u,a=[],k=[],b,p=[];try{let d=n==="tv"||n==="series",v=d?"tv":"movie";if(o.startsWith("tt")){let s=await N(`find/${o}?external_source=imdb_id`);if(s){let y=d?s?.tv_results?.[0]:s?.movie_results?.[0];y&&(c=y.id,y.overview&&(b=y.overview))}}else c=parseInt(o,10);if(c&&!isNaN(c)){let s=await N(`${v}/${c}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(s){if(s.overview&&(b=s.overview),s.title&&(i.push(s.title),s.title.includes(":"))){let l=s.title.split(":")[0].trim();l.length>2&&i.push(l)}if(s.name&&(i.push(s.name),s.name.includes(":"))){let l=s.name.split(":")[0].trim();l.length>2&&i.push(l)}if(s.original_title&&s.original_title!==s.title&&(i.push(s.original_title),s.original_title.includes(":"))){let l=s.original_title.split(":")[0].trim();l.length>2&&i.push(l)}if(s.original_name&&s.original_name!==s.name&&(i.push(s.original_name),s.original_name.includes(":"))){let l=s.original_name.split(":")[0].trim();l.length>2&&i.push(l)}if(s.translations?.translations&&Array.isArray(s.translations.translations))for(let l of s.translations.translations){let f=l.data?.name||l.data?.title;if(f&&typeof f=="string"&&(i.push(f),f.includes(":"))){let w=f.split(":")[0].trim();w.length>2&&i.push(w)}}let y=(s.alternative_titles?.results||s.alternative_titles?.titles||[]).map(l=>l.title).filter(Boolean);i.push(...y);let g=s.release_date||s.first_air_date;g&&(u=parseInt(g.split("-")[0],10)),s.genres&&Array.isArray(s.genres)&&(p=s.genres.map(l=>l.name).filter(Boolean)),s.credits?.cast&&Array.isArray(s.credits.cast)&&(a=s.credits.cast.slice(0,10).map(l=>l.name).filter(Boolean));let m=[];s.created_by&&Array.isArray(s.created_by)&&m.push(...s.created_by.map(l=>l.name).filter(Boolean)),s.credits?.crew&&Array.isArray(s.credits.crew)&&m.push(...s.credits.crew.filter(l=>l.job==="Director"||l.department==="Directing").map(l=>l.name).filter(Boolean)),k=Array.from(new Set(m))}}}catch{}return{numericId:c,titles:Array.from(new Set(i.filter(Boolean))),year:u,cast:a,creators:k,overview:b,genres:p}})();return R.set(t,r),r}function h(e,n,o="info",t){let r=`[${e}]`;o==="error"?console.error(r,n,t||""):o==="warn"?console.warn(r,n,t||""):console.log(r,n,t||"");try{let c=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof c=="string"&&c.startsWith("http")&&fetch(c,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:o,message:n,details:t})}).catch(()=>{})}catch{}}var Te=["t\xFCrk\xE7e","turkish","turkce","dublaj","tr","tur","dual","trdual","trdub","ses-tr","audio-tr","tr-dub"],we=["english","ingilizce","original","orijinal","en","eng","und","audio-en"];function Ae(e,n){let o=!1,t=!1,r=[],i,c,u,a=(n||"").toLowerCase();if(a.includes("trdual")||a.includes("dual")||a.includes("trdub")||a.includes("dublaj")?(o=!0,t=!0):(a.includes("ses-tr")||a.includes("turkcedublaj")||a.includes("turkce-dublaj"))&&(o=!0),a.includes("2160p")||a.includes("4k")||a.includes("uhd")?i="4K":a.includes("1080p")||a.includes("1920x1080")||a.includes("fhd")?i="1080p":a.includes("720p")||a.includes("1280x720")||a.includes("hd")?i="720p":(a.includes("480p")||a.includes("854x480")||a.includes("sd"))&&(i="480p"),a.includes("hevc")||a.includes("h265")||a.includes("x265")?c="HEVC":a.includes("av1")?c="AV1":(a.includes("h264")||a.includes("x264")||a.includes("avc"))&&(c="H.264"),a.includes("5.1")||a.includes("eac3")||a.includes("ac3")||a.includes("ddp")?u="Dolby 5.1":(a.includes("7.1")||a.includes("atmos"))&&(u="Dolby Atmos 7.1"),e&&typeof e=="string"){let b=e.split(/\r?\n/);for(let p of b){let d=p.trim();if(d.startsWith("#EXT-X-MEDIA:")&&d.includes("TYPE=AUDIO")){let v=d.match(/NAME=["']([^"']+)["']/i),s=d.match(/LANGUAGE=["']([^"']+)["']/i),y=d.match(/GROUP-ID=["']([^"']+)["']/i),g=(v?v[1]:"").toLowerCase(),m=(s?s[1]:"").toLowerCase(),l=(y?y[1]:"").toLowerCase(),f=Te.some(A=>g.includes(A)||m===A||l.includes(A))||g.includes("t\xFCrk")||g.includes("turk")||l.includes("dual"),w=we.some(A=>g.includes(A)||m===A||l.includes(A))||g.includes("orig")||g.includes("ing")||g.includes("eng");f&&(o=!0),w&&(t=!0)}if(d.startsWith("#EXT-X-MEDIA:")&&d.includes("TYPE=SUBTITLES")){let v=d.match(/URI=["']([^"']+)["']/i),s=d.match(/NAME=["']([^"']+)["']/i),y=d.match(/LANGUAGE=["']([^"']+)["']/i);if(v&&v[1]){let g=v[1];if(n&&!g.startsWith("http"))try{g=new URL(g,n).toString()}catch{}let m=s?s[1]:"Altyaz\u0131",l=y?y[1].toLowerCase():"";l==="st"||l==="sot"||m.toLowerCase().includes("sotho")||m.toLowerCase().includes("sesotho")||g.toLowerCase().includes("sub_st")?(l="tr",m="T\xFCrk\xE7e"):l||(l=m.toLowerCase().includes("t\xFCrk")?"tr":"und");let w=_e(l,m);r.push({label:w.name||m,url:g,lang:w.code||l})}}}}let k=o&&t||a.includes("dual")||a.includes("trdual");return{hasTurkishAudio:o,hasOriginalAudio:t,isDual:k,embeddedSubtitles:r,detectedQuality:i,detectedCodec:c,detectedAudio:u}}var L={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function _e(e,n,o){let t=g=>(g||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),r=t(e||""),i=t(n||""),c=!!o||r.includes("forced")||i.includes("forced")||r.includes("zorunlu")||i.includes("zorunlu"),u=r.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),a=i.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),k=g=>{let m=g.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return c?`${m} (Zorunlu)`:m};if(u==="st"||u==="sot"||u.includes("sotho")||a.includes("sotho")||a.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:c?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let b=L[r]||L[i]||L[u]||L[a];if(!b){let g=(a+" "+u).split(/\s+/).filter(Boolean);for(let m of g)if(L[m]){b=L[m];break}}if(!b){for(let[g,m]of Object.entries(L))if(g.length>=4&&(a.includes(g)||u.includes(g))){b=m;break}}if(b)return{code:b.code,iso3:b.iso3,language:b.language,name:k(b.name)};let p=(n||e||"Altyaz\u0131").trim();p=p.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let d=p.charAt(0).toUpperCase()+p.slice(1),v=k(d),s=r&&r.length===2?r:i&&i.length===2?i:"und",y=r&&r.length===3?r:i&&i.length===3?i:"und";return{code:s,iso3:y,language:d,name:v}}function se(e){let n=e.url?Ae(void 0,e.url):{},o=e.quality||n.detectedQuality||"1080p";o.includes("\u2022")&&(o=o.split("\u2022")[0].trim()),!o.includes("p")&&!o.includes("K")&&!o.includes("k")&&(o=`${o}p`);let t=e.subtitles||e.inspection?.subtitles,r=!!(e.inspection?.hasTurkishSubtitles||t?.some(f=>{let w=(f.lang||f.code||"").toLowerCase(),A=(f.langCode||f.iso3||"").toLowerCase(),I=(f.name||f.label||f.title||"").toLowerCase();return w==="tr"||w==="st"||A==="tur"||A==="sot"||I.includes("t\xFCrk")||I.includes("turk")||I.includes("sotho")})),i=(e.languageTitle||e.inspection?.languageTitle||"").toLowerCase().trim(),c=i.includes("dub")||i.includes("ses")||i.includes("dual")||!!n.hasTurkishAudio||!!e.inspection?.hasTurkishAudio,u=i.includes("dual")||i.includes("dub")&&(i.includes("alt")||i.includes("sub"))||c&&r,a="Orijinal";i.includes("yerli")||e.inspection?.isYerli?a="Yerli":u?a="Dublaj / Altyaz\u0131l\u0131":c?a="Dublaj":r||i.includes("alt")||i.includes("sub")?a="Altyaz\u0131l\u0131":(i.includes("orijinal")||i.includes("yabanc\u0131")||i.includes("original"))&&(a="Orijinal");let k=e.format==="m3u8"||e.url.includes(".m3u8")||e.url.includes("/master.")||e.url.includes("/hls/")||e.url.includes("/txt/"),b=e.format||(k?"m3u8":e.url.includes(".mp4")?"mp4":"m3u8"),p=b==="m3u8"?"HLS":b.toUpperCase(),d=[o],v=e.codec||n.detectedCodec;v&&v!=="H.264"&&d.push(v),d.push(p),e.bitrate&&d.push(e.bitrate);let s=e.audio||n.detectedAudio;s&&s!=="AAC 2.0"&&d.push(s);let y=e.details||d.join(" \u2022 "),g=`${a}
${y}`,m=`${o} \u2022 ${a}`,l={name:"han's 34",provider:"han's 34",title:a,description:g,url:e.url,quality:m,format:b};return e.headers&&Object.keys(e.headers).length>0&&(l.headers=e.headers),t&&t.length>0&&(l.subtitles=t),l}var D=[104,116,116,112,115,58,47,47,119,119,119,46,102,101,98,98,111,120,46,99,111,109].map(e=>String.fromCharCode(e)).join(""),O="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3ODc0MjA4MTcsIm5iZiI6MTc4NzQyMDgxNywiZXhwIjoxODE4NTI0ODM3LCJkYXRhIjp7InVpZCI6MTY2Njk1MSwidG9rZW4iOiIxN2ZkYzhmZDgxOTMyOGVmYTgwYTU0ZTUyZDcxMGU0MyJ9fQ.TPJH8btaRlaGt6peTMljPbXfkbBsnbA2zzj-GwZwNII",x="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";async function Se(e,n,o){try{let t=`${e}/search?keyword=${encodeURIComponent(n)}`,r=await fetch(t,{headers:{"User-Agent":x,Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8","Accept-Language":"en-US,en;q=0.9"}});if(!r.ok)return[];let i=await r.text(),c=[],u=new Set,a=[/<a[^>]*href="(\/(movie|tv)\/[^"]+)"[^>]*title="([^"]+)"/gi,/<a[^>]*title="([^"]+)"[^>]*href="(\/(movie|tv)\/[^"]+)"/gi];for(let k=0;k<a.length;k++){let b=a[k],p;for(;(p=b.exec(i))!==null;){let d=k===0?p[1]:p[2],v=(k===0?p[2]:p[3]).toLowerCase(),s=k===0?p[3]:p[1];if(u.has(d))continue;u.add(d);let y=v==="tv";if(o==="tv"&&!y||o==="movie"&&y)continue;let g=null,m=s.match(/\((\d{4})\)$/)||d.match(/-(\d{4})$/);m&&(g=parseInt(m[1],10));let l=s.replace(/\s*\(\d{4}\)$/,"").trim(),f=d.match(/\/(?:movie|tv)\/detail\/(\d+)/)||d.match(/\/(\d+)/),w=f?f[1]:null;c.push({href:d,title:l,year:g,contentId:w,isTv:y})}}return c}catch(t){return h("han's 34",`Arama hatas\u0131: ${t.message}`,"warn"),[]}}async function ze(e,n,o){try{let t=n.startsWith("http")?n:`${e}${n}`,r=await fetch(t,{headers:{"User-Agent":x,Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"}});if(!r.ok)return null;let i=await r.text(),c=o?/\/tv\/detail\/(\d+)/:/\/movie\/detail\/(\d+)/,u=i.match(c)||i.match(/\/(?:movie|tv)\/detail\/(\d+)/);if(u)return u[1];let a=i.match(/data-url="[^"]*\/detail\/(\d+)/);return a?a[1]:null}catch(t){return h("han's 34",`\u0130\xE7erik ID \xE7\xF6z\xFCmleme hatas\u0131: ${t.message}`,"warn"),null}}async function Ce(e,n,o){try{let r=`${e}/index/share_link?id=${n}&type=${o?"2":"1"}`,i=await fetch(r,{headers:{"User-Agent":x,"X-Requested-With":"XMLHttpRequest",Accept:"application/json, text/javascript, */*; q=0.01",Referer:e+"/"}});if(!i.ok)return null;let c=await i.json();if(c.code===1&&c.data&&c.data.link){let a=String(c.data.link).match(/\/share\/([a-zA-Z0-9-]+)/);return a?a[1]:null}return null}catch(t){return h("han's 34",`Payla\u015F\u0131m ba\u011Flant\u0131s\u0131 API hatas\u0131: ${t.message}`,"warn"),null}}async function U(e,n=0,o=O){try{let t=`${D}/file/file_share_list?share_key=${e}&parent_id=${n}&page=1&size=100`,r=await fetch(t,{headers:{Cookie:`ui=${o}`,"User-Agent":x,Accept:"application/json, text/javascript, */*; q=0.01","X-Requested-With":"XMLHttpRequest",Referer:`${D}/share/${e}`}});return r.ok?(await r.json()).data?.file_list||[]:[]}catch(t){return h("han's 34",`Dosya listesi hatas\u0131: ${t.message}`,"warn"),[]}}async function Ie(e,n,o=O){try{let t=`${D}/file/player`,r=await fetch(t,{method:"POST",headers:{Cookie:`ui=${o}`,"Content-Type":"application/x-www-form-urlencoded","X-Requested-With":"XMLHttpRequest",Origin:D,Referer:`${D}/share/${e}`,"User-Agent":x},body:`fid=${n}&share_key=${e}`});if(!r.ok)return[];let c=(await r.text()).match(/var sources = (.*?);\s*/s);if(!c)return[];let u=JSON.parse(c[1]);return Array.isArray(u)?u.filter(a=>a&&a.file):[]}catch(t){return h("han's 34",`Oynat\u0131c\u0131 \xE7\xF6z\xFCmleme hatas\u0131: ${t.message}`,"warn"),[]}}async function j(e,n,o,t){let r=Date.now();h("han's 34",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${e}, T\xFCr: ${n}, Sezon: ${o}, B\xF6l\xFCm: ${t}`);try{let K=function(T){if(!T)return null;let z=T.toLowerCase(),S=z.match(/season\s*(\d+)/i)||z.match(/\bs(\d+)\b/i);if(S)return parseInt(S[1],10);let C=z.match(/\b(\d+)\b/);return C?parseInt(C[1],10):null},q=function(T,z){if(!T)return null;let S=T.toLowerCase(),C=S.match(/s\d+[\s._-]*e(\d+)/i)||S.match(/\d+x(\d+)/i);if(C)return parseInt(C[1],10);let M=S.match(/(?:episode|ep|e)[\s._-]*(\d+)/i);if(M)return parseInt(M[1],10);let X=S.replace(/2160p|1080p|720p|480p|360p|h264|x264|h265|x265|hevc|bluray|web-dl/gi,"").match(/(?:^|\D)(\d{1,3})(?!\d)/);return X?parseInt(X[1],10):null};var i=K,c=q;let u=String(e||"").trim(),a=String(n||"").toLowerCase().trim(),k=a==="tv"||a==="series",b=k?"tv":"movie",p=o!=null?parseInt(String(o),10):1,d=t!=null?parseInt(String(t),10):1;h("han's 34",`[Ad\u0131m 1/4] IMDb ID \xE7\xF6z\xFCmleniyor (${u})...`);let v=u.startsWith("tt")?u:await ie(u,b),y=(await te(u,b)).titles[0]||"";if(!v)return h("han's 34","IMDb ID bulunamad\u0131. \u0130simle arama yap\u0131lmaz.","warn"),[];let g=await ee("hiriluk");if(!g)return h("han's 34","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let m=O;h("han's 34",`[Ad\u0131m 2/4] Kaynakta kesin IMDb aramas\u0131 yap\u0131l\u0131yor (${v})`);let l=await Se(g,v,k?"tv":"movie");if(l.length===0)return h("han's 34",`\u0130\xE7erik "${v}" ile bulunamad\u0131.`,"warn"),[];let f=l[0];h("han's 34",` \u0130\xE7erik e\u015Fle\u015Fti: "${f.title}"`,"success");let w=f.contentId;if(w||(w=await ze(g,f.href,k)),!w)return h("han's 34",`\u0130\xE7erik ID al\u0131namad\u0131: ${f.title}`,"warn"),[];h("han's 34","[Ad\u0131m 3/4] Payla\u015F\u0131m anahtar\u0131 al\u0131n\u0131yor...");let A=await Ce(g,w,k);if(!A)return h("han's 34","Payla\u015F\u0131m anahtar\u0131 al\u0131namad\u0131.","warn"),[];let I=null,B=y||f.title;if(k){h("han's 34",`[Ad\u0131m 3/4] Sezon klas\xF6rleri taran\u0131yor (S${p}E${d})`);let z=(await U(A,0,m)).find(M=>M.is_dir===1&&K(M.file_name)===p);if(!z)return h("han's 34",`\u0130stenen Sezon (${p}) klas\xF6rlerde bulunamad\u0131`,"warn"),[];let S=await U(A,z.fid,m);if(S.length===0)return h("han's 34",`Sezon ${p} klas\xF6r\xFC bo\u015F.`,"warn"),[];let C=S.find(M=>M.is_dir===0&&q(M.file_name,p)===d);if(!C)return h("han's 34",`\u0130stenen B\xF6l\xFCm (S${p}E${d}) klas\xF6rde bulunamad\u0131`,"warn"),[];I=C.fid,B=C.file_name}else{h("han's 34","[Ad\u0131m 3/4] Film dosyas\u0131 se\xE7iliyor");let T=await U(A,0,m);if(T.length===0)return h("han's 34","Ana dizin bo\u015F.","warn"),[];let z=T.find(S=>S.is_dir===0)||T[0];I=z.fid,B=z.file_name}if(!I)return h("han's 34","Hedef dosya FID bulunamad\u0131.","warn"),[];h("han's 34","[Ad\u0131m 4/4] Video oynatma ba\u011Flant\u0131lar\u0131 \xE7\xF6z\xFCmleniyor...");let P=await Ie(A,I,m);if(!P||P.length===0)return h("han's 34","Oynat\u0131c\u0131 kaynaklar\u0131 bo\u015F d\xF6nd\xFC.","warn"),[];let oe={"User-Agent":x,Referer:`${D}/`},re=P.find(T=>String(T.label||"").toUpperCase().trim()==="AUTO"),le=P.find(T=>String(T.label||"").toUpperCase().includes("1080")),Y=P.find(T=>String(T.label||"").toUpperCase().includes("2160")||String(T.label||"").toUpperCase().includes("4K")),ce=re||le||Y||P[0],V=String(ce.file||"").trim();if(!V)return h("han's 34","Ge\xE7erli ak\u0131\u015F linki bulunamad\u0131.","warn"),[];let J="1080p";(Y||B.toLowerCase().includes("2160p")||B.toLowerCase().includes("4k"))&&(J="4K");let W=[se({name:"han's 34",url:V,languageTitle:"Yabanc\u0131",quality:J,format:"m3u8",headers:oe})],ue=((Date.now()-r)/1e3).toFixed(2);return h("han's 34",`[Ad\u0131m 4/4] TAMAMLANDI: 1 ak\u0131\u015F haz\u0131rland\u0131 (${ue}s)`,"success",W.map(T=>({title:T.title,quality:T.quality,format:"m3u8"}))),W}catch(u){return h("han's 34",`Genel Hata: ${u.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=j);typeof global<"u"&&(global.getStreams=j);typeof window<"u"&&(window.getStreams=j);var Me={getStreams:j};

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

;(()=>{const n="han's 34",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
