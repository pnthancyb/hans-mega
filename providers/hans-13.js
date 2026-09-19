
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

"use strict";var R=Object.defineProperty;var le=Object.getOwnPropertyDescriptor;var re=Object.getOwnPropertyNames;var ce=Object.prototype.hasOwnProperty;var ue=(n,a)=>{for(var e in a)R(n,e,{get:a[e],enumerable:!0})},ge=(n,a,e,l)=>{if(a&&typeof a=="object"||typeof a=="function")for(let o of re(a))!ce.call(n,o)&&o!==e&&R(n,o,{get:()=>a[o],enumerable:!(l=le(a,o))||l.enumerable});return n};var de=n=>ge(R({},"__esModule",{value:!0}),n);var ve={};ue(ve,{getStreams:()=>ie});module.exports=de(ve);var me=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(a=>String.fromCharCode(a^42)).join(""),he={REMOTE_CONFIG_URL:me,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"};var E=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};E.__NUVIO_CONFIG_STATE__||(E.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var T=E.__NUVIO_CONFIG_STATE__,pe=10*60*1e3;async function O(){let n=Date.now();try{let a={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let l=AbortSignal.timeout(8e3);l&&(a.signal=l)}catch{}let e=await fetch(`${he.REMOTE_CONFIG_URL}?_t=${n}`,a);if(e.ok){let l=await e.json(),o=l?.data??l,i=o.domains||o,r=o.cookies,u=o.tmdb_keys||o.tmdbKeys;i&&typeof i=="object"&&(T.cachedDomains={...T.cachedDomains,...i}),r&&typeof r=="object"&&(T.cachedCookies={...T.cachedCookies,...r}),Array.isArray(u)&&u.length>0&&(T.cachedTmdbKeys=u),T.lastFetchTime=n}else T.lastFetchTime=0}catch{T.lastFetchTime=0}}async function H(){let n=Date.now();(!(Object.keys(T.cachedDomains).length>0)||n-T.lastFetchTime>pe)&&(T.activeFetchPromise||(T.activeFetchPromise=O().finally(()=>{T.activeFetchPromise=null})),await T.activeFetchPromise)}async function q(n){await H();let a=T.cachedDomains[n]||"";return a||(await O(),a=T.cachedDomains[n]||""),a}async function Y(){return await H(),T.cachedTmdbKeys||[]}var be="a2f888b27315e62e471b2d587048f32e",V=[be,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function G(n){let a=await Y(),e=a.length>0?[...a,...V]:V;for(let l=0;l<e.length;l++){let o=e[l],i=n.includes("?")?"&":"?",r=`https://api.themoviedb.org/3/${n}${i}api_key=${o}`;try{let u=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,t=await fetch(r,{signal:u});if(t.ok)return await t.json();if(t.status===429)continue}catch{}}return null}var F=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};F.__NUVIO_TMDB_CACHE__||(F.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var P=F.__NUVIO_TMDB_CACHE__,U=P.imdbIdCache,N=P.tmdbTitlesCache,we=P.tmdbImageCache,Ce=P.episodeGroupCache,Ie=P.absoluteEpCache;async function W(n,a){let e=String(n||"").replace(/^tmdb:/i,"").trim();if(!e)return null;if(e.startsWith("tt"))return e;let l=`${a}:${e}`;if(U.has(l))return U.get(l);let o=(async()=>{try{let r=await G(`${a==="tv"||a==="series"?"tv":"movie"}/${e}/external_ids`);if(r&&r.imdb_id)return r.imdb_id}catch{}return null})();return U.set(l,o),o}async function J(n,a){let e=String(n||"").replace(/^tmdb:/i,"").trim();if(!e)return{titles:[]};let l=`${a}:${e}`;if(N.has(l))return N.get(l);let o=(async()=>{let i=[],r,u,t=[],d=[],b,f=[];try{let h=a==="tv"||a==="series",k=h?"tv":"movie";if(e.startsWith("tt")){let s=await G(`find/${e}?external_source=imdb_id`);if(s){let g=h?s?.tv_results?.[0]:s?.movie_results?.[0];g&&(r=g.id,g.overview&&(b=g.overview))}}else r=parseInt(e,10);if(r&&!isNaN(r)){let s=await G(`${k}/${r}?language=tr-TR&append_to_response=credits,alternative_titles`);if(s){if(s.overview&&(b=s.overview),s.title&&(i.push(s.title),s.title.includes(":"))){let c=s.title.split(":")[0].trim();c.length>2&&i.push(c)}if(s.name&&(i.push(s.name),s.name.includes(":"))){let c=s.name.split(":")[0].trim();c.length>2&&i.push(c)}if(s.original_title&&s.original_title!==s.title&&(i.push(s.original_title),s.original_title.includes(":"))){let c=s.original_title.split(":")[0].trim();c.length>2&&i.push(c)}if(s.original_name&&s.original_name!==s.name&&(i.push(s.original_name),s.original_name.includes(":"))){let c=s.original_name.split(":")[0].trim();c.length>2&&i.push(c)}let g=(s.alternative_titles?.results||s.alternative_titles?.titles||[]).map(c=>c.title).filter(Boolean);i.push(...g);let p=s.release_date||s.first_air_date;p&&(u=parseInt(p.split("-")[0],10)),s.genres&&Array.isArray(s.genres)&&(f=s.genres.map(c=>c.name).filter(Boolean)),s.credits?.cast&&Array.isArray(s.credits.cast)&&(t=s.credits.cast.slice(0,10).map(c=>c.name).filter(Boolean));let m=[];s.created_by&&Array.isArray(s.created_by)&&m.push(...s.created_by.map(c=>c.name).filter(Boolean)),s.credits?.crew&&Array.isArray(s.credits.crew)&&m.push(...s.credits.crew.filter(c=>c.job==="Director"||c.department==="Directing").map(c=>c.name).filter(Boolean)),d=Array.from(new Set(m))}}}catch{}return{numericId:r,titles:Array.from(new Set(i.filter(Boolean))),year:u,cast:t,creators:d,overview:b,genres:f}})();return N.set(l,o),o}function v(n,a,e="info",l){let o=`[${n}]`;e==="error"?console.error(o,a,l||""):e==="warn"?console.warn(o,a,l||""):console.log(o,a,l||"");try{let r=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof r=="string"&&r.startsWith("http")&&fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:n,level:e,message:a,details:l})}).catch(()=>{})}catch{}}var fe=["t\xFCrk\xE7e","turkish","turkce","dublaj","tr","tur","dual","trdual","trdub","ses-tr","audio-tr","tr-dub"],ke=["english","ingilizce","original","orijinal","en","eng","und","audio-en"];function Q(n,a){let e=!1,l=!1,o=[],i,r,u,t=(a||"").toLowerCase();if(t.includes("trdual")||t.includes("dual")||t.includes("trdub")||t.includes("dublaj")?(e=!0,l=!0):(t.includes("ses-tr")||t.includes("turkcedublaj")||t.includes("turkce-dublaj"))&&(e=!0),t.includes("2160p")||t.includes("4k")||t.includes("uhd")?i="4K":t.includes("1080p")||t.includes("1920x1080")||t.includes("fhd")?i="1080p":t.includes("720p")||t.includes("1280x720")||t.includes("hd")?i="720p":(t.includes("480p")||t.includes("854x480")||t.includes("sd"))&&(i="480p"),t.includes("hevc")||t.includes("h265")||t.includes("x265")?r="HEVC":t.includes("av1")?r="AV1":(t.includes("h264")||t.includes("x264")||t.includes("avc"))&&(r="H.264"),t.includes("5.1")||t.includes("eac3")||t.includes("ac3")||t.includes("ddp")?u="Dolby 5.1":(t.includes("7.1")||t.includes("atmos"))&&(u="Dolby Atmos 7.1"),n&&typeof n=="string"){let b=n.split(/\r?\n/);for(let f of b){let h=f.trim();if(h.startsWith("#EXT-X-MEDIA:")&&h.includes("TYPE=AUDIO")){let k=h.match(/NAME=["']([^"']+)["']/i),s=h.match(/LANGUAGE=["']([^"']+)["']/i),g=h.match(/GROUP-ID=["']([^"']+)["']/i),p=(k?k[1]:"").toLowerCase(),m=(s?s[1]:"").toLowerCase(),c=(g?g[1]:"").toLowerCase(),_=fe.some(y=>p.includes(y)||m===y||c.includes(y))||p.includes("t\xFCrk")||p.includes("turk")||c.includes("dual"),w=ke.some(y=>p.includes(y)||m===y||c.includes(y))||p.includes("orig")||p.includes("ing")||p.includes("eng");_&&(e=!0),w&&(l=!0)}if(h.startsWith("#EXT-X-MEDIA:")&&h.includes("TYPE=SUBTITLES")){let k=h.match(/URI=["']([^"']+)["']/i),s=h.match(/NAME=["']([^"']+)["']/i),g=h.match(/LANGUAGE=["']([^"']+)["']/i);if(k&&k[1]){let p=k[1];if(a&&!p.startsWith("http"))try{p=new URL(p,a).toString()}catch{}let m=s?s[1]:"Altyaz\u0131",c=g?g[1].toLowerCase():"";c==="st"||c==="sot"||m.toLowerCase().includes("sotho")||m.toLowerCase().includes("sesotho")||p.toLowerCase().includes("sub_st")?(c="tr",m="T\xFCrk\xE7e"):c||(c=m.toLowerCase().includes("t\xFCrk")?"tr":"und");let w=K(c,m);o.push({label:w.name||m,url:p,lang:w.code||c})}}}}let d=e&&l||t.includes("dual")||t.includes("trdual");return{hasTurkishAudio:e,hasOriginalAudio:l,isDual:d,embeddedSubtitles:o,detectedQuality:i,detectedCodec:r,detectedAudio:u}}function ye(n){let{hasTurkishAudio:a,hasOriginalAudio:e,isDual:l,hasSubtitles:o,hasTurkishSubtitles:i,isYerli:r,siteHint:u,defaultTitle:t}=n;if(r||u?.isYerli)return"Yerli";if(u?.label){let d=u.label.toLowerCase();if((d.includes("dub")||d.includes("t\xFCrk"))&&(d.includes("alt")||d.includes("sub")))return"Dublaj / Altyaz\u0131l\u0131";if(d.includes("dub")||d.includes("t\xFCrk\xE7e ses"))return"Dublaj";if(d.includes("alt")||d.includes("sub"))return"Altyaz\u0131l\u0131";if(d.includes("orijinal")||d.includes("original"))return"Orijinal"}return l||a&&(e||i)?"Dublaj / Altyaz\u0131l\u0131":a||u?.isDublaj?"Dublaj":i||u?.isAltyazi?"Altyaz\u0131l\u0131":t||(a?"Dublaj":"Orijinal")}var M={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function K(n,a,e){let l=p=>(p||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),o=l(n||""),i=l(a||""),r=!!e||o.includes("forced")||i.includes("forced")||o.includes("zorunlu")||i.includes("zorunlu"),u=o.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),t=i.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),d=p=>{let m=p.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return r?`${m} (Zorunlu)`:m};if(u==="st"||u==="sot"||u.includes("sotho")||t.includes("sotho")||t.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:r?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let b=M[o]||M[i]||M[u]||M[t];if(!b){let p=(t+" "+u).split(/\s+/).filter(Boolean);for(let m of p)if(M[m]){b=M[m];break}}if(!b){for(let[p,m]of Object.entries(M))if(p.length>=4&&(t.includes(p)||u.includes(p))){b=m;break}}if(b)return{code:b.code,iso3:b.iso3,language:b.language,name:d(b.name)};let f=(a||n||"Altyaz\u0131").trim();f=f.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let h=f.charAt(0).toUpperCase()+f.slice(1),k=d(h),s=o&&o.length===2?o:i&&i.length===2?i:"und",g=o&&o.length===3?o:i&&i.length===3?i:"und";return{code:s,iso3:g,language:h,name:k}}function X(n,a){let e=[],l=new Set,o=[...n||[],...a||[]];for(let i of o){if(!i||!i.url)continue;let r=i.url.trim();if(l.has(r))continue;l.add(r);let u=K(i.lang,i.label||i.name||i.language),t=u.name||i.label||i.name||"Altyaz\u0131";e.push({id:String(e.length),url:r,label:t,name:t,language:u.language,lang:u.code,langCode:u.iso3,headers:i.headers})}return e}function Z(n){let{m3u8Text:a,m3u8Url:e,externalSubtitles:l,siteHint:o,defaultTitle:i}=n,r=Q(a,e),u=X(l),t=X(l,r.embeddedSubtitles),d=t.length>0||!!o?.isAltyazi,b=t.some(g=>g.lang==="tr"||g.lang==="st"||g.lang==="sot"||g.langCode==="tur"||g.langCode==="sot"||g.label?.toLowerCase().includes("t\xFCrk")||g.label?.toLowerCase().includes("sotho")||g.language==="Turkish"||g.language?.toLowerCase().includes("sotho")),f=r.hasTurkishAudio||!!o?.isDublaj,h=r.hasOriginalAudio,k=r.isDual||f&&(b||h),s=ye({hasTurkishAudio:f,hasOriginalAudio:h,isDual:k,hasSubtitles:d,hasTurkishSubtitles:b,isYerli:o?.isYerli,siteHint:o,defaultTitle:i});return{hasTurkishAudio:f,hasOriginalAudio:h,isDual:k,hasSubtitles:d,hasTurkishSubtitles:b,isYerli:o?.isYerli,languageTitle:s,subtitles:u}}function ee(n){let a=n.url?Q(void 0,n.url):{},e=n.quality||a.detectedQuality||"1080p";e.includes("\u2022")&&(e=e.split("\u2022")[0].trim()),!e.includes("p")&&!e.includes("K")&&!e.includes("k")&&(e=`${e}p`);let l=n.subtitles||n.inspection?.subtitles,o=!!(n.inspection?.hasTurkishSubtitles||l?.some(_=>{let w=(_.lang||_.code||"").toLowerCase(),y=(_.langCode||_.iso3||"").toLowerCase(),S=(_.name||_.label||_.title||"").toLowerCase();return w==="tr"||w==="st"||y==="tur"||y==="sot"||S.includes("t\xFCrk")||S.includes("turk")||S.includes("sotho")})),i=(n.languageTitle||n.inspection?.languageTitle||"").toLowerCase().trim(),r=i.includes("dub")||i.includes("ses")||i.includes("dual")||!!a.hasTurkishAudio||!!n.inspection?.hasTurkishAudio,u=i.includes("dual")||i.includes("dub")&&(i.includes("alt")||i.includes("sub"))||r&&o,t="Orijinal";i.includes("yerli")||n.inspection?.isYerli?t="Yerli":u?t="Dublaj / Altyaz\u0131l\u0131":r?t="Dublaj":o||i.includes("alt")||i.includes("sub")?t="Altyaz\u0131l\u0131":(i.includes("orijinal")||i.includes("yabanc\u0131")||i.includes("original"))&&(t="Orijinal");let d=n.format==="m3u8"||n.url.includes(".m3u8")||n.url.includes("/master.")||n.url.includes("/hls/")||n.url.includes("/txt/"),b=n.format||(d?"m3u8":n.url.includes(".mp4")?"mp4":"m3u8"),f=b==="m3u8"?"HLS":b.toUpperCase(),h=[e],k=n.codec||a.detectedCodec;k&&k!=="H.264"&&h.push(k),h.push(f),n.bitrate&&h.push(n.bitrate);let s=n.audio||a.detectedAudio;s&&s!=="AAC 2.0"&&h.push(s);let g=n.details||h.join(" \u2022 "),p=`${t}
${g}`,m=`${e} \u2022 ${t}`,c={name:"han's 13",provider:"han's 13",title:t,description:p,url:n.url,quality:m,format:b};return n.headers&&Object.keys(n.headers).length>0&&(c.headers=n.headers),l&&l.length>0&&(c.subtitles=l),c}function ae(n){return[...n].sort((a,e)=>{let l=(a.label||a.name||"").toLowerCase().includes("forced")||(a.label||a.name||"").toLowerCase().includes("zorunlu"),o=(e.label||e.name||"").toLowerCase().includes("forced")||(e.label||e.name||"").toLowerCase().includes("zorunlu"),i=a.lang==="tr"||a.lang==="tur"||a.lang==="st"||a.langCode==="tur"||a.langCode==="sot"||(a.label||a.name||"").toLowerCase().includes("t\xFCrk")||(a.label||a.name||"").toLowerCase().includes("sotho"),r=e.lang==="tr"||e.lang==="tur"||e.lang==="st"||e.langCode==="tur"||e.langCode==="sot"||(e.label||e.name||"").toLowerCase().includes("t\xFCrk")||(e.label||e.name||"").toLowerCase().includes("sotho");if(i&&r)return!l&&o?-1:l&&!o?1:0;if(i&&!r)return-1;if(!i&&r)return 1;let u=a.lang==="en"||a.lang==="eng"||a.langCode==="eng"||(a.label||a.name||"").toLowerCase().includes("ing"),t=e.lang==="en"||e.lang==="eng"||e.langCode==="eng"||(e.label||e.name||"").toLowerCase().includes("ing");if(u&&!t)return-1;if(!u&&t)return 1;let d=a.label||a.name||a.title||"",b=e.label||e.name||e.title||"";return d.localeCompare(b,"tr")})}function ne(n,a){let e=K(n,a);return{iso2:e.code,iso3:e.iso3,enName:e.language,trLabel:e.name}}var A="han's 13",L="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";async function Te(n,a){try{let e=await fetch(n,{headers:{"User-Agent":L,Referer:`${a}/`},signal:AbortSignal.timeout?AbortSignal.timeout(5e3):void 0});if(!e.ok)return null;let l=await e.text(),o=new URL(n).origin,i=[];for(let c of l.matchAll(/\$\.cookie\(['"]([^'"]+)['"],\s*['"]([^'"]+)['"]/g))i.push(`${c[1]}=${c[2]}`);let r=e.headers.get("set-cookie");r&&i.push(r.split(";")[0]);let u=i.join("; "),t=l.match(/fetch\(["'](\/dl\?op=get_stream[^"']+)["']\)/);if(!t||!t[1])return null;let d=new URL(t[1],n).toString(),b=await fetch(d,{headers:{"User-Agent":L,Referer:n,Origin:o,"X-Requested-With":"XMLHttpRequest",Cookie:u},signal:AbortSignal.timeout?AbortSignal.timeout(5e3):void 0});if(!b.ok)return null;let f=await b.json();if(!f||!f.url)return null;let h=f.url,k=[],s=l.match(/title:\s*["']([^"']+)["']/i),g=(s?s[1]:"").replace(/&#\d+;/g," ").trim(),p="";try{let c=await fetch(h,{headers:{"User-Agent":L,Referer:`${o}/`},signal:AbortSignal.timeout?AbortSignal.timeout(4e3):void 0});c.ok&&(p=await c.text())}catch{}let m=l.match(/["']?subtitle["']?\s*:\s*["']([^"']+)["']/i);if(m&&m[1]){let c=m[1].split(",");for(let _ of c){let w=_.trim(),y=w.match(/\[([^\]]+)\](.*)/),S="T\xFCrk\xE7e",C=w;y&&(S=y[1],C=y[2]);let D=C;C.startsWith("/")?D=`${o}${C}`:C.startsWith("http")||(D=`${o}/${C}`);let I=ne(S.toLowerCase().includes("turk")?"tr":"",S);k.push({id:String(k.length),language:I.enName,name:I.trLabel,label:I.trLabel,lang:I.iso2,langCode:I.iso3,url:D,headers:{"User-Agent":L,Referer:n,Origin:o}})}}return{m3u8Url:h,subtitles:k,embedOrigin:o,playerTitle:g,m3u8Text:p}}catch(e){return v(A,`Embed \xE7\xF6z\xFCmleme hatas\u0131: ${e.message}`,"warn"),null}}async function ie(n,a,e,l){let o=String(a||"").toLowerCase().trim(),i=o==="tv"||o==="series",r=i?"tv":"movie",u=e!=null?Math.max(1,parseInt(String(e),10)):1,t=l!=null?Math.max(1,parseInt(String(l),10)):1,d=String(n||"").trim();if(!d)return[];let b=Date.now();v(A,`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${d}, T\xFCr: ${r}, Sezon: ${u}, B\xF6l\xFCm: ${t}`);try{v(A,`[Ad\u0131m 1/4] TMDB ba\u015Fl\u0131k bilgisi al\u0131n\u0131yor (${d})...`);let f=await J(d,r),h=await W(d,r),k=f.numericId||(d.startsWith("tt")?null:parseInt(d,10)),s=Array.from(new Set([...f.titles.slice(0,4),h].filter(B=>!!(B&&B.trim().length>0))));if(s.length===0)return v(A,"Aranacak ba\u015Fl\u0131k bulunamad\u0131.","warn"),[];let g=await q("kalgara");if(!g)return v(A,"Domain not resolved","warn"),[];let p=i?[`${g}/api/series`,`${g}/api/anime`]:[`${g}/api/movies`],m=null;v(A,`[Ad\u0131m 2/4] Kaynak API sorgulan\u0131yor (Ba\u015Fl\u0131klar: ${s.slice(0,3).join(", ")})...`);for(let B of p){if(m)break;for(let se of s)try{let oe=`${B}?search=${encodeURIComponent(se)}`,x=await fetch(oe,{headers:{"User-Agent":L,Accept:"application/json, text/plain, */*",Referer:`${g}/`},signal:AbortSignal.timeout?AbortSignal.timeout(4e3):void 0});if(!x.ok)continue;let j=(await x.json())?.data||[];if(!Array.isArray(j)||j.length===0)continue;if(k){let z=j.find($=>Number($.id)===Number(k));if(z){m=z,v(A,`[Do\u011Frulama] Kesin TMDB ID e\u015Fle\u015Fmesi: ${z.title_tr||z.title_en||z.name} (TMDB: ${z.id})`,"info");break}}if(h){let z=j.find($=>$.imdb_id&&$.imdb_id.toLowerCase()===h.toLowerCase());if(z){m=z,v(A,`[Do\u011Frulama] Kesin IMDb ID e\u015Fle\u015Fmesi: ${z.title_tr||z.title_en||z.name} (IMDb: ${z.imdb_id})`,"info");break}}}catch{}}if(!m)return v(A,`"${s[0]}" ile e\u015Fle\u015Fen i\xE7erik bulunamad\u0131.`,"warn"),[];v(A,`[Ad\u0131m 3/4] Ak\u0131\u015F bilgisi al\u0131n\u0131yor (ID: ${m._id})...`);let c="";i?c=`${g}/api/series/${m._id}/seasons/${u}/episodes/${t}/stream`:c=`${g}/api/movies/${m._id}/stream`;let _=await fetch(c,{headers:{"User-Agent":L,Accept:"application/json, text/plain, */*",Referer:`${g}/`},signal:AbortSignal.timeout?AbortSignal.timeout(4500):void 0});if(!_.ok)return v(A,`Ak\u0131\u015F bilgisi API hatas\u0131: HTTP ${_.status}`,"warn"),[];let y=(await _.json())?.data?.streamUrl;if(!y||typeof y!="string")return v(A,"Oynat\u0131c\u0131 embed ba\u011Flant\u0131s\u0131 bulunamad\u0131.","warn"),[];v(A,"[Ad\u0131m 4/4] Oynat\u0131c\u0131 ak\u0131\u015F\u0131 \xE7\xF6z\xFCmleniyor...");let S=await Te(y,g);if(!S||!S.m3u8Url)return v(A,"Ge\xE7erli bir video ak\u0131\u015F\u0131 (M3U8) \xE7\xF6z\xFCmlenemedi.","warn"),[];let C=ae(S.subtitles),D=Z({m3u8Text:S.m3u8Text,m3u8Url:S.m3u8Url,externalSubtitles:C,siteHint:{label:S.playerTitle}}),I=ee({name:A,url:S.m3u8Url,inspection:D,format:"m3u8",headers:{Referer:`${S.embedOrigin}/`,"User-Agent":L}}),te=((Date.now()-b)/1e3).toFixed(2);return v(A,`TAMAMLANDI: Tek ak\u0131\u015F (${I.title||D.languageTitle}) ve ${C.length} altyaz\u0131 haz\u0131rland\u0131 (${te}s)`,"success"),[I]}catch(f){return v(A,`Kritik Hata: ${f.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=ie);

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

;(()=>{const n="han's 13",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
