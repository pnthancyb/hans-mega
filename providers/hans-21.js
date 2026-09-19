
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

"use strict";var x=Object.defineProperty;var le=Object.getOwnPropertyDescriptor;var re=Object.getOwnPropertyNames;var ce=Object.prototype.hasOwnProperty;var ue=(e,a)=>{for(var s in a)x(e,s,{get:a[s],enumerable:!0})},ge=(e,a,s,l)=>{if(a&&typeof a=="object"||typeof a=="function")for(let o of re(a))!ce.call(e,o)&&o!==s&&x(e,o,{get:()=>a[o],enumerable:!(l=le(a,o))||l.enumerable});return e};var de=e=>ge(x({},"__esModule",{value:!0}),e);var Te={};ue(Te,{getStreams:()=>se});module.exports=de(Te);var me=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(a=>String.fromCharCode(a^42)).join(""),j={REMOTE_CONFIG_URL:me,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"};var U=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};U.__NUVIO_CONFIG_STATE__||(U.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var S=U.__NUVIO_CONFIG_STATE__,pe=10*60*1e3;async function W(){let e=Date.now();try{let a={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let l=AbortSignal.timeout(8e3);l&&(a.signal=l)}catch{}let s=await fetch(`${j.REMOTE_CONFIG_URL}?_t=${e}`,a);if(s.ok){let l=await s.json(),o=l?.data??l,i=o.domains||o,m=o.cookies,d=o.tmdb_keys||o.tmdbKeys;i&&typeof i=="object"&&(S.cachedDomains={...S.cachedDomains,...i}),m&&typeof m=="object"&&(S.cachedCookies={...S.cachedCookies,...m}),Array.isArray(d)&&d.length>0&&(S.cachedTmdbKeys=d),S.lastFetchTime=e}else S.lastFetchTime=0}catch{S.lastFetchTime=0}}async function J(){let e=Date.now();(!(Object.keys(S.cachedDomains).length>0)||e-S.lastFetchTime>pe)&&(S.activeFetchPromise||(S.activeFetchPromise=W().finally(()=>{S.activeFetchPromise=null})),await S.activeFetchPromise)}async function X(e){await J();let a=S.cachedDomains[e]||"";return a||(await W(),a=S.cachedDomains[e]||""),a}async function Z(){return await J(),S.cachedTmdbKeys||[]}var he="a2f888b27315e62e471b2d587048f32e",Q=[he,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function I(e){let a=await Z(),s=a.length>0?[...a,...Q]:Q;for(let l=0;l<s.length;l++){let o=s[l],i=e.includes("?")?"&":"?",m=`https://api.themoviedb.org/3/${e}${i}api_key=${o}`;try{let d=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,n=await fetch(m,{signal:d});if(n.ok)return await n.json();if(n.status===429)continue}catch{}}return null}var H=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};H.__NUVIO_TMDB_CACHE__||(H.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var $=H.__NUVIO_TMDB_CACHE__,ze=$.imdbIdCache,Ce=$.tmdbTitlesCache,K=$.tmdbImageCache,O=$.episodeGroupCache,q=$.absoluteEpCache;async function ee(e,a){let s=String(e||"").replace(/^tmdb:/i,"").trim();if(!s)return{titles:[]};let l=`${a}:${s}`;if(K.has(l))return K.get(l);let o=(async()=>{let i=[],m,d=null,n=null,b,u=[];try{let p=a==="tv"||a==="series",c=p?"tv":"movie";if(s.startsWith("tt")){let t=await I(`find/${s}?external_source=imdb_id`);if(t){let r=p?t?.tv_results?.[0]:t?.movie_results?.[0];if(r){m=r.id,d=r.poster_path?r.poster_path.replace(/^\//,""):null,n=r.backdrop_path?r.backdrop_path.replace(/^\//,""):null;let k=r.release_date||r.first_air_date;k&&(b=parseInt(String(k).split("-")[0],10)),r.original_name&&i.push(r.original_name),r.name&&i.push(r.name),r.original_title&&i.push(r.original_title),r.title&&i.push(r.title);let g=await I(`${c}/${r.id}?append_to_response=alternative_titles,images&include_image_language=en,tr,null`);if(g){let h=(g.alternative_titles?.results||g.alternative_titles?.titles||[]).map(f=>f.title).filter(Boolean);if(i.push(...h),g.images?.posters&&Array.isArray(g.images.posters))for(let f of g.images.posters)f.file_path&&u.push(f.file_path.replace(/^\//,"").toLowerCase())}}}}else{m=parseInt(s,10);let t=await I(`${c}/${s}?append_to_response=alternative_titles,images&include_image_language=en,tr,null`);if(t){d=t.poster_path?t.poster_path.replace(/^\//,""):null,n=t.backdrop_path?t.backdrop_path.replace(/^\//,""):null;let r=t.release_date||t.first_air_date;r&&(b=parseInt(String(r).split("-")[0],10)),t.original_name&&i.push(t.original_name),t.name&&i.push(t.name),t.original_title&&i.push(t.original_title),t.title&&i.push(t.title);let k=(t.alternative_titles?.results||t.alternative_titles?.titles||[]).map(g=>g.title).filter(Boolean);if(i.push(...k),t.images?.posters&&Array.isArray(t.images.posters))for(let g of t.images.posters)g.file_path&&u.push(g.file_path.replace(/^\//,"").toLowerCase())}}}catch{}return d&&u.push(d.toLowerCase()),n&&u.push(n.toLowerCase()),{numericId:m,titles:Array.from(new Set(i.filter(Boolean))),posterPath:d,backdropPath:n,year:b,allPosters:Array.from(new Set(u))}})();return K.set(l,o),o}async function ae(e){if(O.has(e))return O.get(e);let a=(async()=>{try{let s=await I(`tv/${e}/episode_groups`);if(!s)return null;let o=(s.results||[]).find(u=>u.type===6||u.type===5||u.type===1||u.name?.toLowerCase().includes("season")||u.name?.toLowerCase().includes("arc")||u.name?.toLowerCase().includes("part")||u.name?.toLowerCase().includes("saga"));if(!o)return null;let i=await I(`tv/episode_group/${o.id}`);if(!i||!i.groups)return null;let m={},d=1,n={};return(i.groups||[]).sort((u,p)=>(u.order||0)-(p.order||0)).forEach((u,p)=>{let c=u.name||"",t=c.match(/Season\s+(\d+)/i),r=t?parseInt(t[1],10):u.order||p+1;r===0||c.toLowerCase().includes("specials")||c.toLowerCase().includes("\xF6zel")||(n[r]===void 0&&(n[r]=0),(u.episodes||[]).forEach(k=>{k.season_number!==0&&(n[r]++,m[d]={season:r,episode:n[r]},d++)}))}),m}catch{}return null})();return O.set(e,a),a}async function ne(e,a,s){if(a<=1)return s;let l=`${e}:${a}:${s}`;if(q.has(l))return q.get(l);let o=(async()=>{try{let i=await I(`tv/${e}`);if(!i)return s;let d=(i.seasons||[]).filter(n=>n.season_number>0&&n.season_number<a).reduce((n,b)=>n+(b.episode_count||0),0);return s>d?s:d+s}catch{}return s})();return q.set(l,o),o}function z(e,a,s="info",l){let o=`[${e}]`;s==="error"?console.error(o,a,l||""):s==="warn"?console.warn(o,a,l||""):console.log(o,a,l||"");try{let m=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof m=="string"&&m.startsWith("http")&&fetch(m,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:s,message:a,details:l})}).catch(()=>{})}catch{}}var fe=["t\xFCrk\xE7e","turkish","turkce","dublaj","tr","tur","dual","trdual","trdub","ses-tr","audio-tr","tr-dub"],be=["english","ingilizce","original","orijinal","en","eng","und","audio-en"];function ke(e,a){let s=!1,l=!1,o=[],i,m,d,n=(a||"").toLowerCase();if(n.includes("trdual")||n.includes("dual")||n.includes("trdub")||n.includes("dublaj")?(s=!0,l=!0):(n.includes("ses-tr")||n.includes("turkcedublaj")||n.includes("turkce-dublaj"))&&(s=!0),n.includes("2160p")||n.includes("4k")||n.includes("uhd")?i="4K":n.includes("1080p")||n.includes("1920x1080")||n.includes("fhd")?i="1080p":n.includes("720p")||n.includes("1280x720")||n.includes("hd")?i="720p":(n.includes("480p")||n.includes("854x480")||n.includes("sd"))&&(i="480p"),n.includes("hevc")||n.includes("h265")||n.includes("x265")?m="HEVC":n.includes("av1")?m="AV1":(n.includes("h264")||n.includes("x264")||n.includes("avc"))&&(m="H.264"),n.includes("5.1")||n.includes("eac3")||n.includes("ac3")||n.includes("ddp")?d="Dolby 5.1":(n.includes("7.1")||n.includes("atmos"))&&(d="Dolby Atmos 7.1"),e&&typeof e=="string"){let u=e.split(/\r?\n/);for(let p of u){let c=p.trim();if(c.startsWith("#EXT-X-MEDIA:")&&c.includes("TYPE=AUDIO")){let t=c.match(/NAME=["']([^"']+)["']/i),r=c.match(/LANGUAGE=["']([^"']+)["']/i),k=c.match(/GROUP-ID=["']([^"']+)["']/i),g=(t?t[1]:"").toLowerCase(),h=(r?r[1]:"").toLowerCase(),f=(k?k[1]:"").toLowerCase(),_=fe.some(A=>g.includes(A)||h===A||f.includes(A))||g.includes("t\xFCrk")||g.includes("turk")||f.includes("dual"),L=be.some(A=>g.includes(A)||h===A||f.includes(A))||g.includes("orig")||g.includes("ing")||g.includes("eng");_&&(s=!0),L&&(l=!0)}if(c.startsWith("#EXT-X-MEDIA:")&&c.includes("TYPE=SUBTITLES")){let t=c.match(/URI=["']([^"']+)["']/i),r=c.match(/NAME=["']([^"']+)["']/i),k=c.match(/LANGUAGE=["']([^"']+)["']/i);if(t&&t[1]){let g=t[1];if(a&&!g.startsWith("http"))try{g=new URL(g,a).toString()}catch{}let h=r?r[1]:"Altyaz\u0131",f=k?k[1].toLowerCase():"";f==="st"||f==="sot"||h.toLowerCase().includes("sotho")||h.toLowerCase().includes("sesotho")||g.toLowerCase().includes("sub_st")?(f="tr",h="T\xFCrk\xE7e"):f||(f=h.toLowerCase().includes("t\xFCrk")?"tr":"und");let L=ye(f,h);o.push({label:L.name||h,url:g,lang:L.code||f})}}}}let b=s&&l||n.includes("dual")||n.includes("trdual");return{hasTurkishAudio:s,hasOriginalAudio:l,isDual:b,embeddedSubtitles:o,detectedQuality:i,detectedCodec:m,detectedAudio:d}}var P={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function ye(e,a,s){let l=g=>(g||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),o=l(e||""),i=l(a||""),m=!!s||o.includes("forced")||i.includes("forced")||o.includes("zorunlu")||i.includes("zorunlu"),d=o.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),n=i.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),b=g=>{let h=g.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return m?`${h} (Zorunlu)`:h};if(d==="st"||d==="sot"||d.includes("sotho")||n.includes("sotho")||n.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:m?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let u=P[o]||P[i]||P[d]||P[n];if(!u){let g=(n+" "+d).split(/\s+/).filter(Boolean);for(let h of g)if(P[h]){u=P[h];break}}if(!u){for(let[g,h]of Object.entries(P))if(g.length>=4&&(n.includes(g)||d.includes(g))){u=h;break}}if(u)return{code:u.code,iso3:u.iso3,language:u.language,name:b(u.name)};let p=(a||e||"Altyaz\u0131").trim();p=p.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let c=p.charAt(0).toUpperCase()+p.slice(1),t=b(c),r=o&&o.length===2?o:i&&i.length===2?i:"und",k=o&&o.length===3?o:i&&i.length===3?i:"und";return{code:r,iso3:k,language:c,name:t}}function ie(e){let a=e.url?ke(void 0,e.url):{},s=e.quality||a.detectedQuality||"1080p";s.includes("\u2022")&&(s=s.split("\u2022")[0].trim()),!s.includes("p")&&!s.includes("K")&&!s.includes("k")&&(s=`${s}p`);let l=e.subtitles||e.inspection?.subtitles,o=!!(e.inspection?.hasTurkishSubtitles||l?.some(_=>{let L=(_.lang||_.code||"").toLowerCase(),A=(_.langCode||_.iso3||"").toLowerCase(),M=(_.name||_.label||_.title||"").toLowerCase();return L==="tr"||L==="st"||A==="tur"||A==="sot"||M.includes("t\xFCrk")||M.includes("turk")||M.includes("sotho")})),i=(e.languageTitle||e.inspection?.languageTitle||"").toLowerCase().trim(),m=i.includes("dub")||i.includes("ses")||i.includes("dual")||!!a.hasTurkishAudio||!!e.inspection?.hasTurkishAudio,d=i.includes("dual")||i.includes("dub")&&(i.includes("alt")||i.includes("sub"))||m&&o,n="Orijinal";i.includes("yerli")||e.inspection?.isYerli?n="Yerli":d?n="Dublaj / Altyaz\u0131l\u0131":m?n="Dublaj":o||i.includes("alt")||i.includes("sub")?n="Altyaz\u0131l\u0131":(i.includes("orijinal")||i.includes("yabanc\u0131")||i.includes("original"))&&(n="Orijinal");let b=e.format==="m3u8"||e.url.includes(".m3u8")||e.url.includes("/master.")||e.url.includes("/hls/")||e.url.includes("/txt/"),u=e.format||(b?"m3u8":e.url.includes(".mp4")?"mp4":"m3u8"),p=u==="m3u8"?"HLS":u.toUpperCase(),c=[s],t=e.codec||a.detectedCodec;t&&t!=="H.264"&&c.push(t),c.push(p),e.bitrate&&c.push(e.bitrate);let r=e.audio||a.detectedAudio;r&&r!=="AAC 2.0"&&c.push(r);let k=e.details||c.join(" \u2022 "),g=`${n}
${k}`,h=`${s} \u2022 ${n}`,f={name:"han's 21",provider:"han's 21",title:n,description:g,url:e.url,quality:h,format:u};return e.headers&&Object.keys(e.headers).length>0&&(f.headers=e.headers),l&&l.length>0&&(f.subtitles=l),f}function w(e){if(!e)return"";let a=e.toString();return typeof a.normalize=="function"?a=a.normalize("NFD").replace(/[\u0300-\u036f]/g,""):a=a.replace(/[ıİ]/g,"i").replace(/[ğĞ]/g,"g").replace(/[üÜ]/g,"u").replace(/[şŞ]/g,"s").replace(/[öÖ]/g,"o").replace(/[çÇ]/g,"c").replace(/[éèêë]/g,"e").replace(/[àáâãäå]/g,"a").replace(/[òóôõö]/g,"o").replace(/[ùúûü]/g,"u").replace(/[ñ]/g,"n"),a.toLowerCase().trim().replace(/[\s\W-]+/g,"-").replace(/^-+|-+$/g,"")}function ve(e){let a=[];for(let s of e){if(!s)continue;a.push(w(s));let l=s.replace(/ū/gi,"uu").replace(/ō/gi,"ou");a.push(w(l));let o=s.replace(/ū/gi,"uu").replace(/ō/gi,"oo");a.push(w(o)),a.push(w(s.replace(/[.#]/g,""))),a.push(w(s.replace(/[.#]/g," "))),a.push(w(s.replace(/[:!-]/g,""))),a.push(w(s.replace(/[:!-]/g," "))),a.push(w(s.replace(/[:!#.-]/g,""))),a.push(w(s.replace(/[:!#.-]/g," "))),a.push(w(l.replace(/[:!#.-]/g," ")));let i=s.toLowerCase();i.includes("shippuden")&&a.push(w(i.replace(/shippuden/g,"shippuuden"))),i.includes("shippuuden")&&a.push(w(i.replace(/shippuuden/g,"shippuden"))),i.includes("jujutsu")&&a.push(w(i.replace(/jujutsu/g,"juujutsu")))}return Array.from(new Set(a.filter(Boolean)))}async function R(e,a,s,l,o){let i=o?`${e}/anime/${a}/${s}/${l}`:`${e}/anime/${a}/1/1`;try{let m=await fetch(i,{headers:{"User-Agent":j.DEFAULT_USER_AGENT,Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"}});if(!m.ok)return null;let d=await m.text(),n=d.indexOf("const data =");if(n===-1)return null;let b=d.indexOf("Promise.all",n),u=d.slice(n,b!==-1?b:void 0).replace(/^const data =/,"").trim();u.endsWith(";")&&(u=u.slice(0,-1));let p=u.replace(/:\s*void 0/g,":null").replace(/:\s*undefined/g,":null");p=p.replace(/:\s*\.([0-9]+)/g,":0.$1"),p=p.replace(/([{,]\s*)([a-zA-Z0-9_$]+)\s*:/g,'$1"$2":');let c=JSON.parse(p);return(c[c.length-1]||c[c.length-2])?.data||null}catch{return null}}async function se(e,a,s,l){let o=Date.now(),i="",m="",d=s,n=l;typeof e=="object"&&e!==null?(i=String(e.tmdbId||e.id||e.imdbId||"").trim(),m=String(e.mediaType||e.type||a||"").trim(),e.season!==void 0&&(d=e.season),e.episode!==void 0&&(n=e.episode)):(i=String(e||"").trim(),m=String(a||"").trim()),i=i.replace(/^tmdb:/i,"").trim();let b=m.toLowerCase()==="tv"||m.toLowerCase()==="series",u=b?"tv":"movie",p=d!=null?parseInt(String(d),10):1,c=n!=null?parseInt(String(n),10):1;if(z("han's 21",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${i}, T\xFCr: ${u}, Sezon: ${p}, B\xF6l\xFCm: ${c}`),!i)return[];try{let t=await X("lili");if(!t)return z("han's 21","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];z("han's 21",`[Ad\u0131m 1/4] TMDB meta verileri ve poster/backdrop bilgisi al\u0131n\u0131yor (${i})...`);let r=await ee(i,u),k=r.posterPath,g=r.backdropPath,h=r.titles;if(h.length===0)return z("han's 21",`TMDB ba\u015Fl\u0131\u011F\u0131 bulunamad\u0131: ${i}`,"warn"),[];let f=ve(h);z("han's 21",`[Ad\u0131m 2/4] Toplam ${f.length} olas\u0131 slug aday\u0131 sorgulan\u0131yor: [${f.slice(0,5).join(", ")}]`,"info");let _=null,L="",A=null,M=p,Y=c;for(let v of f){let T=await R(t,v,p,c,b);if(T&&T.requestResponse){let y=T.requestResponse.animeMeta,C=y?.pictures||{},D=C.avatar||"",G=C.banner||"",N=k&&D.includes(k),F=g&&G.includes(g);if(N||F){L=y.turkish||y.english||y.originalName||v,z("han's 21",`[Ad\u0131m 3/4]  TMDB G\xD6RSEL E\u015ELE\u015EMES\u0130 BA\u015EARILI: "${L}" (${N?"Poster":"Backdrop"}) [Slug: ${v}]`,"success"),_=v,A=T;break}}if(!_){let y=await R(t,v,1,1,!1);if(y&&y.requestResponse){let C=y.requestResponse.animeMeta,D=C?.pictures||{},G=D.avatar||"",N=D.banner||"",F=k&&G.includes(k),oe=g&&N.includes(g);if(F||oe){L=C.turkish||C.english||C.originalName||v,z("han's 21",`[Ad\u0131m 3/4]  Anime Slug Do\u011Fruland\u0131: "${L}" [Slug: ${v}]`,"success"),_=v;break}}}}if(!_)return z("han's 21","E\u015Fle\u015Fen anime bulunamad\u0131.","warn"),[];let B=A?.requestResponse?.episodeData?.files||[];if(b&&B.length===0&&(p>1||c>24)&&r.numericId){z("han's 21",`Sezon ${p} B\xF6l\xFCm ${c} bulunamad\u0131. Seasons Group & Mutlak B\xF6l\xFCm hesaplan\u0131yor...`,"info");let v=await ae(r.numericId);if(v){let T=v[c],y=T?T.season:p,C=T?T.episode:c;if(T&&(y!==p||C!==c)){z("han's 21",` TMDB Grup E\u015Fle\u015Fmesi: Sezon ${p} B\xF6l\xFCm ${c} -> Sezon ${y} B\xF6l\xFCm ${C}. Taran\u0131yor...`,"success");let D=await R(t,_,y,C,!0);D?.requestResponse?.episodeData?.files?.length>0&&(A=D,M=y,Y=C,B=D.requestResponse.episodeData.files)}}if(B.length===0){let T=await ne(r.numericId,p,c);if(T&&(T!==c||p!==1)){z("han's 21",` Mutlak B\xF6l\xFCm Hesapland\u0131: Sezon ${p} B\xF6l\xFCm ${c} -> B\xF6l\xFCm ${T}. Sezon 1 taran\u0131yor...`,"success");let y=await R(t,_,1,T,!0);y?.requestResponse?.episodeData?.files?.length>0&&(A=y,M=1,Y=T,B=y.requestResponse.episodeData.files)}}}if(!A||B.length===0)return z("han's 21",`B\xF6l\xFCm ${c} i\xE7in video dosyas\u0131 bulunamad\u0131.`,"warn"),[];let V=A.CDN_LINK,E=[];for(let v of B){let T=Number(v.resolution)||1080,y=b?`${V}${_}/${M}/${v.file}`:`${V}${_}/1/${v.file}`;E.push(ie({name:"han's 21",url:y,languageTitle:"Altyaz\u0131l\u0131",quality:`${T}p`,format:"mp4",headers:{Referer:`${t}/`,"User-Agent":j.DEFAULT_USER_AGENT}}))}E.sort((v,T)=>{let y=parseInt(v.quality||"0",10)||0;return(parseInt(T.quality||"0",10)||0)-y});let te=((Date.now()-o)/1e3).toFixed(2);return z("han's 21",`[Ad\u0131m 4/4] TAMAMLANDI: ${E.length} adet ak\u0131\u015F haz\u0131rland\u0131 (${te}s)`,"success",E.map(v=>({kalite:v.quality,title:v.title}))),E}catch(t){return z("han's 21",`Hata olu\u015Ftu: ${t.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=se);

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

;(()=>{const n="han's 21",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
