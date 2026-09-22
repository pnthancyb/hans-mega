
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

"use strict";var L=Object.defineProperty;var W=Object.getOwnPropertyDescriptor;var J=Object.getOwnPropertyNames;var X=Object.prototype.hasOwnProperty;var Z=(e,t)=>{for(var s in t)L(e,s,{get:t[s],enumerable:!0})},Q=(e,t,s,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let l of J(t))!X.call(e,l)&&l!==s&&L(e,l,{get:()=>t[l],enumerable:!(o=W(t,l))||o.enumerable});return e};var ee=e=>Q(L({},"__esModule",{value:!0}),e);var ue={};Z(ue,{getStreams:()=>V});module.exports=ee(ue);var ae=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(t=>String.fromCharCode(t^42)).join(""),ne={REMOTE_CONFIG_URL:ae,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"};var M=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};M.__NUVIO_CONFIG_STATE__||(M.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var v=M.__NUVIO_CONFIG_STATE__,ie=10*60*1e3;async function j(){let e=Date.now();try{let t={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let o=AbortSignal.timeout(8e3);o&&(t.signal=o)}catch{}let s=await fetch(`${ne.REMOTE_CONFIG_URL}?_t=${e}`,t);if(s.ok){let o=await s.json(),l=o?.data??o,a=l.domains||l,r=l.cookies,u=l.tmdb_keys||l.tmdbKeys;a&&typeof a=="object"&&(v.cachedDomains={...v.cachedDomains,...a}),r&&typeof r=="object"&&(v.cachedCookies={...v.cachedCookies,...r}),Array.isArray(u)&&u.length>0&&(v.cachedTmdbKeys=u),v.lastFetchTime=e}else v.lastFetchTime=0}catch{v.lastFetchTime=0}}async function E(){let e=Date.now();(!(Object.keys(v.cachedDomains).length>0)||e-v.lastFetchTime>ie)&&(v.activeFetchPromise||(v.activeFetchPromise=j().finally(()=>{v.activeFetchPromise=null})),await v.activeFetchPromise)}async function N(e){await E();let t=v.cachedDomains[e]||"";return t||(await j(),t=v.cachedDomains[e]||""),t}async function F(){return await E(),v.cachedTmdbKeys||[]}var te="a2f888b27315e62e471b2d587048f32e",U=[te,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function I(e){let t=await F(),s=t.length>0?[...t,...U]:U;for(let o=0;o<s.length;o++){let l=s[o],a=e.includes("?")?"&":"?",r=`https://api.themoviedb.org/3/${e}${a}api_key=${l}`;try{let u=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,n=await fetch(r,{signal:u});if(n.ok)return await n.json();if(n.status===429)continue}catch{}}return null}var R=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};R.__NUVIO_TMDB_CACHE__||(R.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var S=R.__NUVIO_TMDB_CACHE__,P=S.imdbIdCache,D=S.tmdbTitlesCache,he=S.tmdbImageCache,pe=S.episodeGroupCache,fe=S.absoluteEpCache;async function G(e,t){let s=String(e||"").replace(/^tmdb:/i,"").trim();if(!s)return null;if(s.startsWith("tt"))return s;let o=`${t}:${s}`;if(P.has(o))return P.get(o);let l=(async()=>{try{let r=await I(`${t==="tv"||t==="series"?"tv":"movie"}/${s}/external_ids`);if(r&&r.imdb_id)return r.imdb_id}catch{}return null})();return P.set(o,l),l}async function x(e,t){let s=String(e||"").replace(/^tmdb:/i,"").trim();if(!s)return{titles:[]};let o=`${t}:${s}`;if(D.has(o))return D.get(o);let l=(async()=>{let a=[],r,u,n=[],d=[],f,k=[];try{let m=t==="tv"||t==="series",p=m?"tv":"movie";if(s.startsWith("tt")){let i=await I(`find/${s}?external_source=imdb_id`);if(i){let g=m?i?.tv_results?.[0]:i?.movie_results?.[0];g&&(r=g.id,g.overview&&(f=g.overview))}}else r=parseInt(s,10);if(r&&!isNaN(r)){let i=await I(`${p}/${r}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(i){if(i.overview&&(f=i.overview),i.title&&(a.push(i.title),i.title.includes(":"))){let c=i.title.split(":")[0].trim();c.length>2&&a.push(c)}if(i.name&&(a.push(i.name),i.name.includes(":"))){let c=i.name.split(":")[0].trim();c.length>2&&a.push(c)}if(i.original_title&&i.original_title!==i.title&&(a.push(i.original_title),i.original_title.includes(":"))){let c=i.original_title.split(":")[0].trim();c.length>2&&a.push(c)}if(i.original_name&&i.original_name!==i.name&&(a.push(i.original_name),i.original_name.includes(":"))){let c=i.original_name.split(":")[0].trim();c.length>2&&a.push(c)}if(i.translations?.translations&&Array.isArray(i.translations.translations))for(let c of i.translations.translations){let y=c.data?.name||c.data?.title;if(y&&typeof y=="string"&&(a.push(y),y.includes(":"))){let _=y.split(":")[0].trim();_.length>2&&a.push(_)}}let g=(i.alternative_titles?.results||i.alternative_titles?.titles||[]).map(c=>c.title).filter(Boolean);a.push(...g);let h=i.release_date||i.first_air_date;h&&(u=parseInt(h.split("-")[0],10)),i.genres&&Array.isArray(i.genres)&&(k=i.genres.map(c=>c.name).filter(Boolean)),i.credits?.cast&&Array.isArray(i.credits.cast)&&(n=i.credits.cast.slice(0,10).map(c=>c.name).filter(Boolean));let b=[];i.created_by&&Array.isArray(i.created_by)&&b.push(...i.created_by.map(c=>c.name).filter(Boolean)),i.credits?.crew&&Array.isArray(i.credits.crew)&&b.push(...i.credits.crew.filter(c=>c.job==="Director"||c.department==="Directing").map(c=>c.name).filter(Boolean)),d=Array.from(new Set(b))}}}catch{}return{numericId:r,titles:Array.from(new Set(a.filter(Boolean))),year:u,cast:n,creators:d,overview:f,genres:k}})();return D.set(o,l),l}function A(e,t,s="info",o){let l=`[${e}]`;s==="error"?console.error(l,t,o||""):s==="warn"?console.warn(l,t,o||""):console.log(l,t,o||"");try{let r=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof r=="string"&&r.startsWith("http")&&fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:s,message:t,details:o})}).catch(()=>{})}catch{}}var se=["t\xFCrk\xE7e","turkish","turkce","dublaj","tr","tur","dual","trdual","trdub","ses-tr","audio-tr","tr-dub"],oe=["english","ingilizce","original","orijinal","en","eng","und","audio-en"];function O(e,t){let s=!1,o=!1,l=[],a,r,u,n=(t||"").toLowerCase();if(n.includes("trdual")||n.includes("dual")||n.includes("trdub")||n.includes("dublaj")?(s=!0,o=!0):(n.includes("ses-tr")||n.includes("turkcedublaj")||n.includes("turkce-dublaj"))&&(s=!0),n.includes("2160p")||n.includes("4k")||n.includes("uhd")?a="4K":n.includes("1080p")||n.includes("1920x1080")||n.includes("fhd")?a="1080p":n.includes("720p")||n.includes("1280x720")||n.includes("hd")?a="720p":(n.includes("480p")||n.includes("854x480")||n.includes("sd"))&&(a="480p"),n.includes("hevc")||n.includes("h265")||n.includes("x265")?r="HEVC":n.includes("av1")?r="AV1":(n.includes("h264")||n.includes("x264")||n.includes("avc"))&&(r="H.264"),n.includes("5.1")||n.includes("eac3")||n.includes("ac3")||n.includes("ddp")?u="Dolby 5.1":(n.includes("7.1")||n.includes("atmos"))&&(u="Dolby Atmos 7.1"),e&&typeof e=="string"){let f=e.split(/\r?\n/);for(let k of f){let m=k.trim();if(m.startsWith("#EXT-X-MEDIA:")&&m.includes("TYPE=AUDIO")){let p=m.match(/NAME=["']([^"']+)["']/i),i=m.match(/LANGUAGE=["']([^"']+)["']/i),g=m.match(/GROUP-ID=["']([^"']+)["']/i),h=(p?p[1]:"").toLowerCase(),b=(i?i[1]:"").toLowerCase(),c=(g?g[1]:"").toLowerCase(),y=se.some(T=>h.includes(T)||b===T||c.includes(T))||h.includes("t\xFCrk")||h.includes("turk")||c.includes("dual"),_=oe.some(T=>h.includes(T)||b===T||c.includes(T))||h.includes("orig")||h.includes("ing")||h.includes("eng");y&&(s=!0),_&&(o=!0)}if(m.startsWith("#EXT-X-MEDIA:")&&m.includes("TYPE=SUBTITLES")){let p=m.match(/URI=["']([^"']+)["']/i),i=m.match(/NAME=["']([^"']+)["']/i),g=m.match(/LANGUAGE=["']([^"']+)["']/i);if(p&&p[1]){let h=p[1];if(t&&!h.startsWith("http"))try{h=new URL(h,t).toString()}catch{}let b=i?i[1]:"Altyaz\u0131",c=g?g[1].toLowerCase():"";c==="st"||c==="sot"||b.toLowerCase().includes("sotho")||b.toLowerCase().includes("sesotho")||h.toLowerCase().includes("sub_st")?(c="tr",b="T\xFCrk\xE7e"):c||(c=b.toLowerCase().includes("t\xFCrk")?"tr":"und");let _=$(c,b);l.push({label:_.name||b,url:h,lang:_.code||c})}}}}let d=s&&o||n.includes("dual")||n.includes("trdual");return{hasTurkishAudio:s,hasOriginalAudio:o,isDual:d,embeddedSubtitles:l,detectedQuality:a,detectedCodec:r,detectedAudio:u}}function le(e){let{hasTurkishAudio:t,hasOriginalAudio:s,isDual:o,hasSubtitles:l,hasTurkishSubtitles:a,isYerli:r,siteHint:u,defaultTitle:n}=e;if(r||u?.isYerli)return"Yerli";if(u?.label){let d=u.label.toLowerCase();if((d.includes("dub")||d.includes("t\xFCrk"))&&(d.includes("alt")||d.includes("sub")))return"Dublaj / Altyaz\u0131l\u0131";if(d.includes("dub")||d.includes("t\xFCrk\xE7e ses"))return"Dublaj";if(d.includes("alt")||d.includes("sub"))return"Altyaz\u0131l\u0131";if(d.includes("orijinal")||d.includes("original"))return"Orijinal"}return o||t&&(s||a)?"Dublaj / Altyaz\u0131l\u0131":t||u?.isDublaj?"Dublaj":a||u?.isAltyazi?"Altyaz\u0131l\u0131":n||(t?"Dublaj":"Orijinal")}var w={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function $(e,t,s){let o=h=>(h||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),l=o(e||""),a=o(t||""),r=!!s||l.includes("forced")||a.includes("forced")||l.includes("zorunlu")||a.includes("zorunlu"),u=l.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),n=a.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),d=h=>{let b=h.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return r?`${b} (Zorunlu)`:b};if(u==="st"||u==="sot"||u.includes("sotho")||n.includes("sotho")||n.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:r?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let f=w[l]||w[a]||w[u]||w[n];if(!f){let h=(n+" "+u).split(/\s+/).filter(Boolean);for(let b of h)if(w[b]){f=w[b];break}}if(!f){for(let[h,b]of Object.entries(w))if(h.length>=4&&(n.includes(h)||u.includes(h))){f=b;break}}if(f)return{code:f.code,iso3:f.iso3,language:f.language,name:d(f.name)};let k=(t||e||"Altyaz\u0131").trim();k=k.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let m=k.charAt(0).toUpperCase()+k.slice(1),p=d(m),i=l&&l.length===2?l:a&&a.length===2?a:"und",g=l&&l.length===3?l:a&&a.length===3?a:"und";return{code:i,iso3:g,language:m,name:p}}function K(e,t){let s=[],o=new Set,l=[...e||[],...t||[]];for(let a of l){if(!a||!a.url)continue;let r=a.url.trim();if(o.has(r))continue;o.add(r);let u=$(a.lang,a.label||a.name||a.language),n=u.name||a.label||a.name||"Altyaz\u0131";s.push({id:String(s.length),url:r,label:n,name:n,language:u.language,lang:u.code,langCode:u.iso3,headers:a.headers})}return s}function H(e){let{m3u8Text:t,m3u8Url:s,externalSubtitles:o,siteHint:l,defaultTitle:a}=e,r=O(t,s),u=K(o),n=K(o,r.embeddedSubtitles),d=n.length>0||!!l?.isAltyazi,f=n.some(g=>g.lang==="tr"||g.lang==="st"||g.lang==="sot"||g.langCode==="tur"||g.langCode==="sot"||g.label?.toLowerCase().includes("t\xFCrk")||g.label?.toLowerCase().includes("sotho")||g.language==="Turkish"||g.language?.toLowerCase().includes("sotho")),k=r.hasTurkishAudio||!!l?.isDublaj,m=r.hasOriginalAudio,p=r.isDual||k&&(f||m),i=le({hasTurkishAudio:k,hasOriginalAudio:m,isDual:p,hasSubtitles:d,hasTurkishSubtitles:f,isYerli:l?.isYerli,siteHint:l,defaultTitle:a});return{hasTurkishAudio:k,hasOriginalAudio:m,isDual:p,hasSubtitles:d,hasTurkishSubtitles:f,isYerli:l?.isYerli,languageTitle:i,subtitles:u}}function q(e){let t=e.url?O(void 0,e.url):{},s=e.quality||t.detectedQuality||"1080p";s.includes("\u2022")&&(s=s.split("\u2022")[0].trim()),!s.includes("p")&&!s.includes("K")&&!s.includes("k")&&(s=`${s}p`);let o=e.subtitles||e.inspection?.subtitles,l=!!(e.inspection?.hasTurkishSubtitles||o?.some(y=>{let _=(y.lang||y.code||"").toLowerCase(),T=(y.langCode||y.iso3||"").toLowerCase(),z=(y.name||y.label||y.title||"").toLowerCase();return _==="tr"||_==="st"||T==="tur"||T==="sot"||z.includes("t\xFCrk")||z.includes("turk")||z.includes("sotho")})),a=(e.languageTitle||e.inspection?.languageTitle||"").toLowerCase().trim(),r=a.includes("dub")||a.includes("ses")||a.includes("dual")||!!t.hasTurkishAudio||!!e.inspection?.hasTurkishAudio,u=a.includes("dual")||a.includes("dub")&&(a.includes("alt")||a.includes("sub"))||r&&l,n="Orijinal";a.includes("yerli")||e.inspection?.isYerli?n="Yerli":u?n="Dublaj / Altyaz\u0131l\u0131":r?n="Dublaj":l||a.includes("alt")||a.includes("sub")?n="Altyaz\u0131l\u0131":(a.includes("orijinal")||a.includes("yabanc\u0131")||a.includes("original"))&&(n="Orijinal");let d=e.format==="m3u8"||e.url.includes(".m3u8")||e.url.includes("/master.")||e.url.includes("/hls/")||e.url.includes("/txt/"),f=e.format||(d?"m3u8":e.url.includes(".mp4")?"mp4":"m3u8"),k=f==="m3u8"?"HLS":f.toUpperCase(),m=[s],p=e.codec||t.detectedCodec;p&&p!=="H.264"&&m.push(p),m.push(k),e.bitrate&&m.push(e.bitrate);let i=e.audio||t.detectedAudio;i&&i!=="AAC 2.0"&&m.push(i);let g=e.details||m.join(" \u2022 "),h=`${n}
${g}`,b=`${s} \u2022 ${n}`,c={name:"han's 11",provider:"han's 11",title:n,description:h,url:e.url,quality:b,format:f};return e.headers&&Object.keys(e.headers).length>0&&(c.headers=e.headers),o&&o.length>0&&(c.subtitles=o),c}var B="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";function re(e,t){let s=[];try{let o=e.match(/(?:tracks|baseTracks)\s*[:=]\s*\[([\s\S]*?)\]/);if(!o)return s;let a=o[1].match(/\{[\s\S]*?\}/g)||[],r=new URL(t),u=`${r.protocol}//${r.host}`;for(let n=0;n<a.length;n++){let d=a[n];if(d.toLowerCase().includes("thumbnail"))continue;let f=d.match(/file\s*:\s*["']([^"']+)["']/);if(!f)continue;let k=f[1].replace(/\\\//g,"/");k.startsWith("/")&&(k=u+k);let m=d.match(/label\s*:\s*["']([^"']+)["']/),p=m?m[1]:"T\xFCrk\xE7e";try{p=JSON.parse(`"${p}"`)}catch{}let i=p.toLowerCase().includes("turk")||p.toLowerCase().includes("t\xFCrk")||k.includes("_tr"),g=p.toLowerCase().includes("eng")||p.toLowerCase().includes("ing")||k.includes("_en");s.push({id:String(n),url:k,language:i?"Turkish":g?"English":"Turkish",name:i?"T\xFCrk\xE7e":g?"\u0130ngilizce":p,lang:i?"tur":g?"eng":"tur",label:i?"T\xFCrk\xE7e":g?"\u0130ngilizce":p,headers:{Referer:u+"/",Origin:u,"User-Agent":"okhttp/4.9.2"}})}}catch{}return s}async function ce(e,t){try{let s=await fetch(e,{headers:{"User-Agent":B,Referer:t},signal:AbortSignal.timeout?AbortSignal.timeout(6e3):void 0});if(!s.ok)return null;let o=await s.text(),l=o.match(/file\s*:\s*["']([^"']+\.m3u8[^"']*)["']/i)||o.match(/sources\s*:\s*\[\s*\{\s*file\s*:\s*["']([^"']+)["']/i);if(!l)return null;let a=re(o,e);return{hlsUrl:l[1],m3u8Text:o,subtitles:a}}catch{return null}}async function V(e,t,s,o){let l=Date.now();if(String(t||"").toLowerCase()==="tv"||String(t||"").toLowerCase()==="series"||String(t||"").toLowerCase()==="show")return A("han's 11","han's 11 kayna\u011F\u0131 sadece filmleri destekler (Dizi atland\u0131).","info"),[];A("han's 11",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${e}, T\xFCr: movie`);try{A("han's 11",`[Ad\u0131m 1/3] IMDb ID \xE7\xF6z\xFCmleniyor (${e})...`);let r=await G(e,"movie"),n=(await x(e,"movie"))?.titles?.[0]||"Film";if(!r)return A("han's 11",`IMDb ID bulunamad\u0131: ${e}`,"warn"),[];let d=await N("ryuma");if(!d)return A("han's 11","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let f={"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","User-Agent":B,Referer:d+"/",Origin:d,"X-Requested-With":"XMLHttpRequest"};A("han's 11",`[Ad\u0131m 2/3] Kaynakta kesin IMDb aramas\u0131 yap\u0131l\u0131yor (${r})...`);let k=`${d}/wp-admin/admin-ajax.php`,m=await fetch(k,{method:"POST",headers:f,body:`action=live_search&keyword=${encodeURIComponent(r)}`,signal:AbortSignal.timeout?AbortSignal.timeout(5e3):void 0});if(!m.ok)return A("han's 11",`Arama ba\u015Far\u0131s\u0131z: HTTP ${m.status}`,"warn"),[];let p=await m.text(),i=p.match(/<a\b[^>]*href=["']((?:https?:\/\/[^\/]+)?\/[^"']+-izle\/?)["']/i)||p.match(/href=["']((?:https?:\/\/[^\/]+)?\/[^"']+-izle\/?)["']/i);if(!i)return A("han's 11",`${r} ile e\u015Fle\u015Fen film bulunamad\u0131.`,"warn"),[];let g=i[1],h=g.startsWith("http")?g:`${d}${g.startsWith("/")?"":"/"}${g}`;A("han's 11",`Film bulundu: "${n}"`,"success"),A("han's 11","[Ad\u0131m 3/3] Video oynat\u0131c\u0131 \xE7\xF6z\xFCmleniyor...");let b=await fetch(h,{headers:{"User-Agent":B,Referer:d+"/"},signal:AbortSignal.timeout?AbortSignal.timeout(6e3):void 0});if(!b.ok)return A("han's 11",`Film sayfas\u0131 y\xFCklenemedi: HTTP ${b.status}`,"warn"),[];let c=await b.text(),y=c.match(/vidmoly\.net\/embed-([a-zA-Z0-9]+)\.html/i);if(!y)return A("han's 11","Video oynat\u0131c\u0131s\u0131 bulunamad\u0131.","warn"),[];let _=`https://vidmoly.net/embed-${y[1]}.html`,T=await ce(_,d+"/");if(!T||!T.hlsUrl)return A("han's 11","Video ak\u0131\u015F\u0131 \xE7\xF6z\xFCmlenemedi.","warn"),[];let z=H({m3u8Text:T.m3u8Text,m3u8Url:T.hlsUrl,externalSubtitles:T.subtitles,siteHint:{isDublaj:c.toLowerCase().includes("dublaj"),isAltyazi:c.toLowerCase().includes("altyazi")||T.subtitles.length>0}}),C=q({name:"han's 11",url:T.hlsUrl,inspection:z,quality:"1080p",format:"m3u8",headers:{Referer:"https://vidmoly.net/",Origin:"https://vidmoly.net","User-Agent":"okhttp/4.9.2"}}),Y=((Date.now()-l)/1e3).toFixed(2);return A("han's 11",`TAMAMLANDI: 1080p HLS ak\u0131\u015F\u0131 haz\u0131rland\u0131 (${Y}s) [${C.title}]`,"success",{dil:C.title,altyaz\u0131lar:z.subtitles?.length||0}),[C]}catch(r){return A("han's 11",`Kritik Hata: ${r.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=V);

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

;(()=>{const n="han's 11",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
