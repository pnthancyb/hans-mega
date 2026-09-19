
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

"use strict";var F=Object.defineProperty;var re=Object.getOwnPropertyDescriptor;var ce=Object.getOwnPropertyNames;var ue=Object.prototype.hasOwnProperty;var ge=(e,a)=>{for(var s in a)F(e,s,{get:a[s],enumerable:!0})},de=(e,a,s,t)=>{if(a&&typeof a=="object"||typeof a=="function")for(let o of ce(a))!ue.call(e,o)&&o!==s&&F(e,o,{get:()=>a[o],enumerable:!(t=re(a,o))||t.enumerable});return e};var me=e=>de(F({},"__esModule",{value:!0}),e);var Ae={};ge(Ae,{getStreams:()=>se});module.exports=me(Ae);var pe=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(a=>String.fromCharCode(a^42)).join(""),R={REMOTE_CONFIG_URL:pe,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"};var x=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};x.__NUVIO_CONFIG_STATE__||(x.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var S=x.__NUVIO_CONFIG_STATE__,he=10*60*1e3;async function V(){let e=Date.now();try{let a={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let t=AbortSignal.timeout(8e3);t&&(a.signal=t)}catch{}let s=await fetch(`${R.REMOTE_CONFIG_URL}?_t=${e}`,a);if(s.ok){let t=await s.json(),o=t?.data??t,i=o.domains||o,p=o.cookies,u=o.tmdb_keys||o.tmdbKeys;i&&typeof i=="object"&&(S.cachedDomains={...S.cachedDomains,...i}),p&&typeof p=="object"&&(S.cachedCookies={...S.cachedCookies,...p}),Array.isArray(u)&&u.length>0&&(S.cachedTmdbKeys=u),S.lastFetchTime=e}else S.lastFetchTime=0}catch{S.lastFetchTime=0}}async function W(){let e=Date.now();(!(Object.keys(S.cachedDomains).length>0)||e-S.lastFetchTime>he)&&(S.activeFetchPromise||(S.activeFetchPromise=V().finally(()=>{S.activeFetchPromise=null})),await S.activeFetchPromise)}async function J(e){await W();let a=S.cachedDomains[e]||"";return a||(await V(),a=S.cachedDomains[e]||""),a}async function X(){return await W(),S.cachedTmdbKeys||[]}var fe="a2f888b27315e62e471b2d587048f32e",Z=[fe,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function P(e){let a=await X(),s=a.length>0?[...a,...Z]:Z;for(let t=0;t<s.length;t++){let o=s[t],i=e.includes("?")?"&":"?",p=`https://api.themoviedb.org/3/${e}${i}api_key=${o}`;try{let u=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,n=await fetch(p,{signal:u});if(n.ok)return await n.json();if(n.status===429)continue}catch{}}return null}var q=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};q.__NUVIO_TMDB_CACHE__||(q.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var B=q.__NUVIO_TMDB_CACHE__,we=B.imdbIdCache,Ce=B.tmdbTitlesCache,O=B.tmdbImageCache,U=B.episodeGroupCache,K=B.absoluteEpCache;async function Q(e,a){let s=String(e||"").replace(/^tmdb:/i,"").trim();if(!s)return{titles:[]};let t=`${a}:${s}`;if(O.has(t))return O.get(t);let o=(async()=>{let i=[],p,u=null,n=null,g,l=[];try{let h=a==="tv"||a==="series",m=h?"tv":"movie";if(s.startsWith("tt")){let r=await P(`find/${s}?external_source=imdb_id`);if(r){let c=h?r?.tv_results?.[0]:r?.movie_results?.[0];if(c){p=c.id,u=c.poster_path?c.poster_path.replace(/^\//,""):null,n=c.backdrop_path?c.backdrop_path.replace(/^\//,""):null;let y=c.release_date||c.first_air_date;y&&(g=parseInt(String(y).split("-")[0],10)),c.original_name&&i.push(c.original_name),c.name&&i.push(c.name),c.original_title&&i.push(c.original_title),c.title&&i.push(c.title);let d=await P(`${m}/${c.id}?append_to_response=alternative_titles,images&include_image_language=en,tr,null`);if(d){let f=(d.alternative_titles?.results||d.alternative_titles?.titles||[]).map(b=>b.title).filter(Boolean);if(i.push(...f),d.images?.posters&&Array.isArray(d.images.posters))for(let b of d.images.posters)b.file_path&&l.push(b.file_path.replace(/^\//,"").toLowerCase())}}}}else{p=parseInt(s,10);let r=await P(`${m}/${s}?append_to_response=alternative_titles,images&include_image_language=en,tr,null`);if(r){u=r.poster_path?r.poster_path.replace(/^\//,""):null,n=r.backdrop_path?r.backdrop_path.replace(/^\//,""):null;let c=r.release_date||r.first_air_date;c&&(g=parseInt(String(c).split("-")[0],10)),r.original_name&&i.push(r.original_name),r.name&&i.push(r.name),r.original_title&&i.push(r.original_title),r.title&&i.push(r.title);let y=(r.alternative_titles?.results||r.alternative_titles?.titles||[]).map(d=>d.title).filter(Boolean);if(i.push(...y),r.images?.posters&&Array.isArray(r.images.posters))for(let d of r.images.posters)d.file_path&&l.push(d.file_path.replace(/^\//,"").toLowerCase())}}}catch{}return u&&l.push(u.toLowerCase()),n&&l.push(n.toLowerCase()),{numericId:p,titles:Array.from(new Set(i.filter(Boolean))),posterPath:u,backdropPath:n,year:g,allPosters:Array.from(new Set(l))}})();return O.set(t,o),o}async function ee(e){if(U.has(e))return U.get(e);let a=(async()=>{try{let s=await P(`tv/${e}/episode_groups`);if(!s)return null;let o=(s.results||[]).find(l=>l.type===6||l.type===5||l.type===1||l.name?.toLowerCase().includes("season")||l.name?.toLowerCase().includes("arc")||l.name?.toLowerCase().includes("part")||l.name?.toLowerCase().includes("saga"));if(!o)return null;let i=await P(`tv/episode_group/${o.id}`);if(!i||!i.groups)return null;let p={},u=1,n={};return(i.groups||[]).sort((l,h)=>(l.order||0)-(h.order||0)).forEach((l,h)=>{let m=l.name||"",r=m.match(/Season\s+(\d+)/i),c=r?parseInt(r[1],10):l.order||h+1;c===0||m.toLowerCase().includes("specials")||m.toLowerCase().includes("\xF6zel")||(n[c]===void 0&&(n[c]=0),(l.episodes||[]).forEach(y=>{y.season_number!==0&&(n[c]++,p[u]={season:c,episode:n[c]},u++)}))}),p}catch{}return null})();return U.set(e,a),a}async function ae(e,a,s){if(a<=1)return s;let t=`${e}:${a}:${s}`;if(K.has(t))return K.get(t);let o=(async()=>{try{let i=await P(`tv/${e}`);if(!i)return s;let u=(i.seasons||[]).filter(n=>n.season_number>0&&n.season_number<a).reduce((n,g)=>n+(g.episode_count||0),0);return s>u?s:u+s}catch{}return s})();return K.set(t,o),o}function T(e,a,s="info",t){let o=`[${e}]`;s==="error"?console.error(o,a,t||""):s==="warn"?console.warn(o,a,t||""):console.log(o,a,t||"");try{let p=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof p=="string"&&p.startsWith("http")&&fetch(p,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:s,message:a,details:t})}).catch(()=>{})}catch{}}async function ne(e){let{providerName:a,tmdbNumericId:s,season:t,episode:o,isTv:i,minAbsoluteThreshold:p=24,fetcher:u,isValid:n}=e;try{let g=await u(t,o);if(n(g))return{data:g,resolvedSeason:t,resolvedEpisode:o,strategy:"direct"}}catch(g){T(a,`Do\u011Frudan b\xF6l\xFCm sorgusu hatas\u0131 (S${t}E${o}): ${g?.message||g}`,"warn")}if(!i||!s)return{data:null,resolvedSeason:t,resolvedEpisode:o,strategy:"none"};try{let g=await ee(s);if(g){let l=g[o];if(l&&(l.season!==t||l.episode!==o)){T(a,`[TMDB Grup E\u015Fle\u015Fmesi] Sezon ${t} B\xF6l\xFCm ${o} -> Sezon ${l.season} B\xF6l\xFCm ${l.episode} olarak sorgulan\u0131yor...`,"info");let h=await u(l.season,l.episode);if(n(h))return{data:h,resolvedSeason:l.season,resolvedEpisode:l.episode,strategy:"group"}}}}catch(g){T(a,`TMDB grup e\u015Fle\u015Ftirme sorgusu hatas\u0131: ${g?.message||g}`,"warn")}if(t>1||o>p)try{let g=await ae(s,t,o);if(g&&(g!==o||t!==1)){T(a,`[Mutlak B\xF6l\xFCm] Sezon ${t} B\xF6l\xFCm ${o} -> Mutlak B\xF6l\xFCm ${g} olarak Sezon 1 sorgulan\u0131yor...`,"info");let l=await u(1,g);if(n(l))return{data:l,resolvedSeason:1,resolvedEpisode:g,strategy:"absolute"}}}catch(g){T(a,`Mutlak b\xF6l\xFCm sorgusu hatas\u0131: ${g?.message||g}`,"warn")}return{data:null,resolvedSeason:t,resolvedEpisode:o,strategy:"none"}}var be=["t\xFCrk\xE7e","turkish","turkce","dublaj","tr","tur","dual","trdual","trdub","ses-tr","audio-tr","tr-dub"],ke=["english","ingilizce","original","orijinal","en","eng","und","audio-en"];function ye(e,a){let s=!1,t=!1,o=[],i,p,u,n=(a||"").toLowerCase();if(n.includes("trdual")||n.includes("dual")||n.includes("trdub")||n.includes("dublaj")?(s=!0,t=!0):(n.includes("ses-tr")||n.includes("turkcedublaj")||n.includes("turkce-dublaj"))&&(s=!0),n.includes("2160p")||n.includes("4k")||n.includes("uhd")?i="4K":n.includes("1080p")||n.includes("1920x1080")||n.includes("fhd")?i="1080p":n.includes("720p")||n.includes("1280x720")||n.includes("hd")?i="720p":(n.includes("480p")||n.includes("854x480")||n.includes("sd"))&&(i="480p"),n.includes("hevc")||n.includes("h265")||n.includes("x265")?p="HEVC":n.includes("av1")?p="AV1":(n.includes("h264")||n.includes("x264")||n.includes("avc"))&&(p="H.264"),n.includes("5.1")||n.includes("eac3")||n.includes("ac3")||n.includes("ddp")?u="Dolby 5.1":(n.includes("7.1")||n.includes("atmos"))&&(u="Dolby Atmos 7.1"),e&&typeof e=="string"){let l=e.split(/\r?\n/);for(let h of l){let m=h.trim();if(m.startsWith("#EXT-X-MEDIA:")&&m.includes("TYPE=AUDIO")){let r=m.match(/NAME=["']([^"']+)["']/i),c=m.match(/LANGUAGE=["']([^"']+)["']/i),y=m.match(/GROUP-ID=["']([^"']+)["']/i),d=(r?r[1]:"").toLowerCase(),f=(c?c[1]:"").toLowerCase(),b=(y?y[1]:"").toLowerCase(),A=be.some(v=>d.includes(v)||f===v||b.includes(v))||d.includes("t\xFCrk")||d.includes("turk")||b.includes("dual"),C=ke.some(v=>d.includes(v)||f===v||b.includes(v))||d.includes("orig")||d.includes("ing")||d.includes("eng");A&&(s=!0),C&&(t=!0)}if(m.startsWith("#EXT-X-MEDIA:")&&m.includes("TYPE=SUBTITLES")){let r=m.match(/URI=["']([^"']+)["']/i),c=m.match(/NAME=["']([^"']+)["']/i),y=m.match(/LANGUAGE=["']([^"']+)["']/i);if(r&&r[1]){let d=r[1];if(a&&!d.startsWith("http"))try{d=new URL(d,a).toString()}catch{}let f=c?c[1]:"Altyaz\u0131",b=y?y[1].toLowerCase():"";b==="st"||b==="sot"||f.toLowerCase().includes("sotho")||f.toLowerCase().includes("sesotho")||d.toLowerCase().includes("sub_st")?(b="tr",f="T\xFCrk\xE7e"):b||(b=f.toLowerCase().includes("t\xFCrk")?"tr":"und");let C=ve(b,f);o.push({label:C.name||f,url:d,lang:C.code||b})}}}}let g=s&&t||n.includes("dual")||n.includes("trdual");return{hasTurkishAudio:s,hasOriginalAudio:t,isDual:g,embeddedSubtitles:o,detectedQuality:i,detectedCodec:p,detectedAudio:u}}var D={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function ve(e,a,s){let t=d=>(d||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),o=t(e||""),i=t(a||""),p=!!s||o.includes("forced")||i.includes("forced")||o.includes("zorunlu")||i.includes("zorunlu"),u=o.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),n=i.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),g=d=>{let f=d.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return p?`${f} (Zorunlu)`:f};if(u==="st"||u==="sot"||u.includes("sotho")||n.includes("sotho")||n.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:p?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let l=D[o]||D[i]||D[u]||D[n];if(!l){let d=(n+" "+u).split(/\s+/).filter(Boolean);for(let f of d)if(D[f]){l=D[f];break}}if(!l){for(let[d,f]of Object.entries(D))if(d.length>=4&&(n.includes(d)||u.includes(d))){l=f;break}}if(l)return{code:l.code,iso3:l.iso3,language:l.language,name:g(l.name)};let h=(a||e||"Altyaz\u0131").trim();h=h.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let m=h.charAt(0).toUpperCase()+h.slice(1),r=g(m),c=o&&o.length===2?o:i&&i.length===2?i:"und",y=o&&o.length===3?o:i&&i.length===3?i:"und";return{code:c,iso3:y,language:m,name:r}}function ie(e){let a=e.url?ye(void 0,e.url):{},s=e.quality||a.detectedQuality||"1080p";s.includes("\u2022")&&(s=s.split("\u2022")[0].trim()),!s.includes("p")&&!s.includes("K")&&!s.includes("k")&&(s=`${s}p`);let t=e.subtitles||e.inspection?.subtitles,o=!!(e.inspection?.hasTurkishSubtitles||t?.some(A=>{let C=(A.lang||A.code||"").toLowerCase(),v=(A.langCode||A.iso3||"").toLowerCase(),M=(A.name||A.label||A.title||"").toLowerCase();return C==="tr"||C==="st"||v==="tur"||v==="sot"||M.includes("t\xFCrk")||M.includes("turk")||M.includes("sotho")})),i=(e.languageTitle||e.inspection?.languageTitle||"").toLowerCase().trim(),p=i.includes("dub")||i.includes("ses")||i.includes("dual")||!!a.hasTurkishAudio||!!e.inspection?.hasTurkishAudio,u=i.includes("dual")||i.includes("dub")&&(i.includes("alt")||i.includes("sub"))||p&&o,n="Orijinal";i.includes("yerli")||e.inspection?.isYerli?n="Yerli":u?n="Dublaj / Altyaz\u0131l\u0131":p?n="Dublaj":o||i.includes("alt")||i.includes("sub")?n="Altyaz\u0131l\u0131":(i.includes("orijinal")||i.includes("yabanc\u0131")||i.includes("original"))&&(n="Orijinal");let g=e.format==="m3u8"||e.url.includes(".m3u8")||e.url.includes("/master.")||e.url.includes("/hls/")||e.url.includes("/txt/"),l=e.format||(g?"m3u8":e.url.includes(".mp4")?"mp4":"m3u8"),h=l==="m3u8"?"HLS":l.toUpperCase(),m=[s],r=e.codec||a.detectedCodec;r&&r!=="H.264"&&m.push(r),m.push(h),e.bitrate&&m.push(e.bitrate);let c=e.audio||a.detectedAudio;c&&c!=="AAC 2.0"&&m.push(c);let y=e.details||m.join(" \u2022 "),d=`${n}
${y}`,f=`${s} \u2022 ${n}`,b={name:"han's 21",provider:"han's 21",title:n,description:d,url:e.url,quality:f,format:l};return e.headers&&Object.keys(e.headers).length>0&&(b.headers=e.headers),t&&t.length>0&&(b.subtitles=t),b}function w(e){if(!e)return"";let a=e.toString();return typeof a.normalize=="function"?a=a.normalize("NFD").replace(/[\u0300-\u036f]/g,""):a=a.replace(/[ıİ]/g,"i").replace(/[ğĞ]/g,"g").replace(/[üÜ]/g,"u").replace(/[şŞ]/g,"s").replace(/[öÖ]/g,"o").replace(/[çÇ]/g,"c").replace(/[éèêë]/g,"e").replace(/[àáâãäå]/g,"a").replace(/[òóôõö]/g,"o").replace(/[ùúûü]/g,"u").replace(/[ñ]/g,"n"),a.toLowerCase().trim().replace(/[\s\W-]+/g,"-").replace(/^-+|-+$/g,"")}function Te(e){let a=[];for(let s of e){if(!s)continue;a.push(w(s));let t=s.replace(/ū/gi,"uu").replace(/ō/gi,"ou");a.push(w(t));let o=s.replace(/ū/gi,"uu").replace(/ō/gi,"oo");a.push(w(o)),a.push(w(s.replace(/[.#]/g,""))),a.push(w(s.replace(/[.#]/g," "))),a.push(w(s.replace(/[:!-]/g,""))),a.push(w(s.replace(/[:!-]/g," "))),a.push(w(s.replace(/[:!#.-]/g,""))),a.push(w(s.replace(/[:!#.-]/g," "))),a.push(w(t.replace(/[:!#.-]/g," ")));let i=s.toLowerCase();i.includes("shippuden")&&a.push(w(i.replace(/shippuden/g,"shippuuden"))),i.includes("shippuuden")&&a.push(w(i.replace(/shippuuden/g,"shippuden"))),i.includes("jujutsu")&&a.push(w(i.replace(/jujutsu/g,"juujutsu")))}return Array.from(new Set(a.filter(Boolean)))}async function H(e,a,s,t,o){let i=o?`${e}/anime/${a}/${s}/${t}`:`${e}/anime/${a}/1/1`;try{let p=await fetch(i,{headers:{"User-Agent":R.DEFAULT_USER_AGENT,Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"}});if(!p.ok)return null;let u=await p.text(),n=u.indexOf("const data =");if(n===-1)return null;let g=u.indexOf("Promise.all",n),l=u.slice(n,g!==-1?g:void 0).replace(/^const data =/,"").trim();l.endsWith(";")&&(l=l.slice(0,-1));let h=l.replace(/:\s*void 0/g,":null").replace(/:\s*undefined/g,":null");h=h.replace(/:\s*\.([0-9]+)/g,":0.$1"),h=h.replace(/([{,]\s*)([a-zA-Z0-9_$]+)\s*:/g,'$1"$2":');let m=JSON.parse(h);return(m[m.length-1]||m[m.length-2])?.data||null}catch{return null}}async function se(e,a,s,t){let o=Date.now(),i="",p="",u=s,n=t;typeof e=="object"&&e!==null?(i=String(e.tmdbId||e.id||e.imdbId||"").trim(),p=String(e.mediaType||e.type||a||"").trim(),e.season!==void 0&&(u=e.season),e.episode!==void 0&&(n=e.episode)):(i=String(e||"").trim(),p=String(a||"").trim()),i=i.replace(/^tmdb:/i,"").trim();let g=p.toLowerCase()==="tv"||p.toLowerCase()==="series",l=g?"tv":"movie",h=u!=null?parseInt(String(u),10):1,m=n!=null?parseInt(String(n),10):1;if(T("han's 21",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${i}, T\xFCr: ${l}, Sezon: ${h}, B\xF6l\xFCm: ${m}`),!i)return[];try{let r=await J("lili");if(!r)return T("han's 21","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];T("han's 21",`[Ad\u0131m 1/4] TMDB meta verileri ve poster/backdrop bilgisi al\u0131n\u0131yor (${i})...`);let c=await Q(i,l),y=c.posterPath,d=c.backdropPath,f=c.titles;if(f.length===0)return T("han's 21",`TMDB ba\u015Fl\u0131\u011F\u0131 bulunamad\u0131: ${i}`,"warn"),[];let b=Te(f);T("han's 21",`[Ad\u0131m 2/4] Toplam ${b.length} olas\u0131 slug aday\u0131 sorgulan\u0131yor: [${b.slice(0,5).join(", ")}]`,"info");let A=null,C="",v=null,M=h,oe=m;for(let k of b){let z=await H(r,k,h,m,g);if(z&&z.requestResponse){let _=z.requestResponse.animeMeta,L=_?.pictures||{},$=L.avatar||"",j=L.banner||"",N=y&&$.includes(y),G=d&&j.includes(d);if(N||G){C=_.turkish||_.english||_.originalName||k,T("han's 21",`[Ad\u0131m 3/4]  TMDB G\xD6RSEL E\u015ELE\u015EMES\u0130 BA\u015EARILI: "${C}" (${N?"Poster":"Backdrop"}) [Slug: ${k}]`,"success"),A=k,v=z;break}}if(!A){let _=await H(r,k,1,1,!1);if(_&&_.requestResponse){let L=_.requestResponse.animeMeta,$=L?.pictures||{},j=$.avatar||"",N=$.banner||"",G=y&&j.includes(y),le=d&&N.includes(d);if(G||le){C=L.turkish||L.english||L.originalName||k,T("han's 21",`[Ad\u0131m 3/4]  Anime Slug Do\u011Fruland\u0131: "${C}" [Slug: ${k}]`,"success"),A=k;break}}}}if(!A)return T("han's 21","E\u015Fle\u015Fen anime bulunamad\u0131.","warn"),[];let I=v?.requestResponse?.episodeData?.files||[];if(g&&I.length===0&&(h>1||m>24)&&c.numericId){T("han's 21",`Sezon ${h} B\xF6l\xFCm ${m} bulunamad\u0131. Seasons Group & Mutlak B\xF6l\xFCm hesaplan\u0131yor...`,"info");let k=await ne({providerName:"han's 21",tmdbNumericId:c.numericId,season:h,episode:m,isTv:g,minAbsoluteThreshold:24,fetcher:async(z,_)=>z===h&&_===m&&v?.requestResponse?.episodeData?.files?.length>0?v:await H(r,A,z,_,!0),isValid:z=>z?.requestResponse?.episodeData?.files?.length>0});k.data&&(v=k.data,M=k.resolvedSeason,oe=k.resolvedEpisode,I=v.requestResponse.episodeData.files)}if(!v||I.length===0)return T("han's 21",`B\xF6l\xFCm ${m} i\xE7in video dosyas\u0131 bulunamad\u0131.`,"warn"),[];let Y=v.CDN_LINK,E=[];for(let k of I){let z=Number(k.resolution)||1080,_=g?`${Y}${A}/${M}/${k.file}`:`${Y}${A}/1/${k.file}`;E.push(ie({name:"han's 21",url:_,languageTitle:"Altyaz\u0131l\u0131",quality:`${z}p`,format:"mp4",headers:{Referer:`${r}/`,"User-Agent":R.DEFAULT_USER_AGENT}}))}E.sort((k,z)=>{let _=parseInt(k.quality||"0",10)||0;return(parseInt(z.quality||"0",10)||0)-_});let te=((Date.now()-o)/1e3).toFixed(2);return T("han's 21",`[Ad\u0131m 4/4] TAMAMLANDI: ${E.length} adet ak\u0131\u015F haz\u0131rland\u0131 (${te}s)`,"success",E.map(k=>({kalite:k.quality,title:k.title}))),E}catch(r){return T("han's 21",`Hata olu\u015Ftu: ${r.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=se);

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
