
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

"use strict";var B=Object.defineProperty;var Q=Object.getOwnPropertyDescriptor;var X=Object.getOwnPropertyNames;var Z=Object.prototype.hasOwnProperty;var ee=(e,i)=>{for(var o in i)B(e,o,{get:i[o],enumerable:!0})},ae=(e,i,o,l)=>{if(i&&typeof i=="object"||typeof i=="function")for(let r of X(i))!Z.call(e,r)&&r!==o&&B(e,r,{get:()=>i[r],enumerable:!(l=Q(i,r))||l.enumerable});return e};var ne=e=>ae(B({},"__esModule",{value:!0}),e);var fe={};ee(fe,{default:()=>he,getStreams:()=>M});module.exports=ne(fe);var ie=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(i=>String.fromCharCode(i^42)).join(""),te={REMOTE_CONFIG_URL:ie,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},w=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},G="__NUVIO_CONFIG_CACHE__",N=60*60*1e3,F=2*60*1e3;if(!w.__NUVIO_CONFIG_STATE__){w.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null};try{if(typeof localStorage<"u"&&localStorage&&typeof localStorage.getItem=="function"){let e=localStorage.getItem(G);if(e){let i=JSON.parse(e);i&&i.timestamp&&Date.now()-i.timestamp<N&&(i.domains&&typeof i.domains=="object"&&(w.__NUVIO_CONFIG_STATE__.cachedDomains=i.domains),i.cookies&&typeof i.cookies=="object"&&(w.__NUVIO_CONFIG_STATE__.cachedCookies=i.cookies),Array.isArray(i.tmdbKeys)&&i.tmdbKeys.length>0&&(w.__NUVIO_CONFIG_STATE__.cachedTmdbKeys=i.tmdbKeys),w.__NUVIO_CONFIG_STATE__.lastFetchTime=i.timestamp)}}}catch{}}var k=w.__NUVIO_CONFIG_STATE__;function se(e){try{typeof localStorage<"u"&&localStorage&&typeof localStorage.setItem=="function"&&localStorage.setItem(G,JSON.stringify({timestamp:e,domains:k.cachedDomains,cookies:k.cachedCookies,tmdbKeys:k.cachedTmdbKeys}))}catch{}}async function oe(){let e=Date.now();try{let i={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let l=AbortSignal.timeout(8e3);l&&(i.signal=l)}catch{}let o=await fetch(te.REMOTE_CONFIG_URL,i);if(o.ok){let l=await o.json(),r=l?.data??l,n=r.domains||r,h=r.cookies,p=r.tmdb_keys||r.tmdbKeys;n&&typeof n=="object"&&(k.cachedDomains={...k.cachedDomains,...n}),h&&typeof h=="object"&&(k.cachedCookies={...k.cachedCookies,...h}),Array.isArray(p)&&p.length>0&&(k.cachedTmdbKeys=p),k.lastFetchTime=e,se(e)}else k.lastFetchTime=e-N+F}catch{k.lastFetchTime=e-N+F}}async function $(){let e=Date.now();(!(Object.keys(k.cachedDomains).length>0)||e-k.lastFetchTime>N)&&(k.activeFetchPromise||(k.activeFetchPromise=oe().finally(()=>{k.activeFetchPromise=null})),await k.activeFetchPromise)}async function O(e){return await $(),k.cachedDomains[e]||""}async function K(){return await $(),k.cachedTmdbKeys||[]}var le="a2f888b27315e62e471b2d587048f32e",x=[le,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function E(e){let i=await K(),o=i.length>0?[...i,...x]:x;for(let l=0;l<o.length;l++){let r=o[l],n=e.includes("?")?"&":"?",h=`https://api.themoviedb.org/3/${e}${n}api_key=${r}`;try{let p=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,a=await fetch(h,{signal:p});if(a.ok)return await a.json();if(a.status===429)continue}catch{}}return null}var R=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};R.__NUVIO_TMDB_CACHE__||(R.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var P=R.__NUVIO_TMDB_CACHE__,ke=P.imdbIdCache,Te=P.tmdbTitlesCache,j=P.tmdbImageCache,ve=P.episodeGroupCache,Ae=P.absoluteEpCache;async function H(e,i){let o=String(e||"").replace(/^tmdb:/i,"").trim();if(!o)return{titles:[]};let l=`${i}:${o}`;if(j.has(l))return j.get(l);let r=(async()=>{let n=[],h,p=null,a=null,v,d=[];try{let m=i==="tv"||i==="series",y=m?"tv":"movie";if(o.startsWith("tt")){let t=await E(`find/${o}?external_source=imdb_id`);if(t){let c=m?t?.tv_results?.[0]:t?.movie_results?.[0];if(c){h=c.id,p=c.poster_path?c.poster_path.replace(/^\//,""):null,a=c.backdrop_path?c.backdrop_path.replace(/^\//,""):null;let b=c.release_date||c.first_air_date;b&&(v=parseInt(String(b).split("-")[0],10)),c.original_name&&n.push(c.original_name),c.name&&n.push(c.name),c.original_title&&n.push(c.original_title),c.title&&n.push(c.title);let s=await E(`${y}/${c.id}?append_to_response=alternative_titles,images,translations&include_image_language=en,tr,ja,null`);if(s){if(s.translations?.translations&&Array.isArray(s.translations.translations))for(let f of s.translations.translations){let u=f.data?.name||f.data?.title;u&&typeof u=="string"&&n.push(u)}let g=(s.alternative_titles?.results||s.alternative_titles?.titles||[]).map(f=>f.title).filter(Boolean);if(n.push(...g),s.images?.posters&&Array.isArray(s.images.posters))for(let f of s.images.posters)f.file_path&&d.push(f.file_path.replace(/^\//,"").toLowerCase());if(s.images?.backdrops&&Array.isArray(s.images.backdrops))for(let f of s.images.backdrops)f.file_path&&d.push(f.file_path.replace(/^\//,"").toLowerCase())}}}}else{h=parseInt(o,10);let t=await E(`${y}/${o}?append_to_response=alternative_titles,images,translations&include_image_language=en,tr,ja,null`);if(t){p=t.poster_path?t.poster_path.replace(/^\//,""):null,a=t.backdrop_path?t.backdrop_path.replace(/^\//,""):null;let c=t.release_date||t.first_air_date;if(c&&(v=parseInt(String(c).split("-")[0],10)),t.original_name&&n.push(t.original_name),t.name&&n.push(t.name),t.original_title&&n.push(t.original_title),t.title&&n.push(t.title),t.translations?.translations&&Array.isArray(t.translations.translations))for(let s of t.translations.translations){let g=s.data?.name||s.data?.title;g&&typeof g=="string"&&n.push(g)}let b=(t.alternative_titles?.results||t.alternative_titles?.titles||[]).map(s=>s.title).filter(Boolean);if(n.push(...b),t.images?.posters&&Array.isArray(t.images.posters))for(let s of t.images.posters)s.file_path&&d.push(s.file_path.replace(/^\//,"").toLowerCase());if(t.images?.backdrops&&Array.isArray(t.images.backdrops))for(let s of t.images.backdrops)s.file_path&&d.push(s.file_path.replace(/^\//,"").toLowerCase())}}}catch{}return p&&d.push(p.toLowerCase()),a&&d.push(a.toLowerCase()),{numericId:h,titles:Array.from(new Set(n.filter(Boolean))),posterPath:p,backdropPath:a,year:v,allPosters:Array.from(new Set(d))}})();return j.set(l,r),r}function A(e,i,o="info",l){let r=`[${e}]`;o==="error"?console.error(r,i,l||""):o==="warn"?console.warn(r,i,l||""):console.log(r,i,l||"");try{let h=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof h=="string"&&h.startsWith("http")&&fetch(h,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:o,message:i,details:l})}).catch(()=>{})}catch{}}var re="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";async function q(e,i){try{let o=e.match(/data-pv=["']([^"']+)["']/i);if(!o||!o[1])return null;let l=o[1],r=e.match(/src=["'](https?:\/\/[^"']*pilavyer[^"']*\/assets\/js\/core\.js)["']/i),n=r?r[1].replace(/\/assets\/js\/core\.js.*$/,""):"https://pilavyerplay.top",h=`${n}/assets/js/s.php?s=${encodeURIComponent(l)}`,p=await fetch(h,{headers:{"User-Agent":re,Referer:i},signal:AbortSignal.timeout?AbortSignal.timeout(1e4):void 0});if(!p.ok)return null;let v=(await p.text()).match(/window\.__PLAYER__\s*=\s*(\{[\s\S]*?\});/);if(!v||!v[1])return null;let d=JSON.parse(v[1]);if(!d||!d.stream)return null;let m=[];if(Array.isArray(d.subs)){for(let y of d.subs)if(y.src){let t=y.lang||"tr",c=y.label||(t.toLowerCase().includes("tr")?"T\xFCrk\xE7e":"Altyaz\u0131");m.push({id:y.sid||`sub_${t}`,label:c,lang:t,language:t,title:c,name:c,url:y.src.replace(/&amp;/g,"&")})}}return{hlsUrl:d.stream.replace(/&amp;/g,"&"),subtitles:m,audios:Array.isArray(d.audios)?d.audios:[],origin:n,title:d.title}}catch{return null}}var ce=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],Y=["tr","tur","ota"],ue=["english","ingilizce","original","orijinal","audio-en"],V=["en","eng","und"];function ge(e,i){let o=!1,l=!1,r=[],n,h,p,a=(i||"").toLowerCase();if(a.includes("trdual")||a.includes("dual")||a.includes("trdub")||a.includes("dublaj")?(o=!0,l=!0):(a.includes("ses-tr")||a.includes("turkcedublaj")||a.includes("turkce-dublaj"))&&(o=!0),a.includes("2160p")||a.includes("4k")||a.includes("uhd")?n="4K":a.includes("1080p")||a.includes("1920x1080")||a.includes("fhd")?n="1080p":a.includes("720p")||a.includes("1280x720")||a.includes("hd")?n="720p":(a.includes("480p")||a.includes("854x480")||a.includes("sd"))&&(n="480p"),a.includes("hevc")||a.includes("h265")||a.includes("x265")?h="HEVC":a.includes("av1")?h="AV1":(a.includes("h264")||a.includes("x264")||a.includes("avc"))&&(h="H.264"),a.includes("5.1")||a.includes("eac3")||a.includes("ac3")||a.includes("ddp")?p="Dolby 5.1":(a.includes("7.1")||a.includes("atmos"))&&(p="Dolby Atmos 7.1"),e&&typeof e=="string"){let d=e.split(/\r?\n/),m=0;for(let y of d){let t=y.trim();if(t.startsWith("#EXT-X-MEDIA:")&&t.includes("TYPE=AUDIO")){let c=t.match(/NAME=["']([^"']+)["']/i),b=t.match(/LANGUAGE=["']([^"']+)["']/i),s=t.match(/GROUP-ID=["']([^"']+)["']/i),g=(c?c[1]:"").toLowerCase(),f=(b?b[1]:"").toLowerCase(),u=(s?s[1]:"").toLowerCase(),z=g.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),_=u.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),S=Y.includes(f)||Y.some(T=>z.includes(T)||_.includes(T))||ce.some(T=>g.includes(T)||u.includes(T))||g.includes("t\xFCrk")||g.includes("turk")||u.includes("dual"),D=V.includes(f)||V.some(T=>z.includes(T)||_.includes(T))||ue.some(T=>g.includes(T)||u.includes(T))||g.includes("orig")||g.includes("ing")||g.includes("eng");S&&(o=!0),D&&(l=!0)}if(t.startsWith("#EXT-X-MEDIA:")&&t.includes("TYPE=SUBTITLES")){let c=t.match(/URI=["']([^"']+)["']/i),b=t.match(/NAME=["']([^"']+)["']/i),s=t.match(/LANGUAGE=["']([^"']+)["']/i);if(c&&c[1]){let g=c[1];if(i&&!g.startsWith("http"))try{g=new URL(g,i).toString()}catch{}let f=b?b[1]:"Altyaz\u0131",u=s?s[1].toLowerCase():"";u==="st"||u==="sot"||f.toLowerCase().includes("sotho")||f.toLowerCase().includes("sesotho")||g.toLowerCase().includes("sub_st")?(u="tr",f="T\xFCrk\xE7e"):u||(u=f.toLowerCase().includes("t\xFCrk")?"tr":"und");let _=de(u,f);r.push({label:_.name||f,url:g,lang:_.code||u})}}if(t.startsWith("#EXT-X-STREAM-INF:")){let c=t.match(/RESOLUTION=(\d+)x(\d+)/i);if(c){let b=parseInt(c[1],10),s=parseInt(c[2],10),g=Math.min(b,s),f=Math.max(b,s),u=g>=2100||f>=3800?2160:g>=1400||f>=2500?1440:g>=1e3||f>=1900?1080:g>=700||f>=1200?720:g>=450?480:g;u>m&&(m=u)}else{let b=t.match(/NAME=["']?([^"',\s]+)["']?/i);if(b){let s=b[1].toLowerCase();s.includes("2160")||s.includes("4k")?2160>m&&(m=2160):s.includes("1440")||s.includes("2k")?1440>m&&(m=1440):s.includes("1080")?1080>m&&(m=1080):s.includes("720")&&720>m&&(m=720)}}}}m>=2160?n="4K":m>=1440?n="2K":m>=1080?n="1080p":m>=720?n="720p":m>=480&&(n="480p")}let v=o&&l||a.includes("dual")||a.includes("trdual");return{hasTurkishAudio:o,hasOriginalAudio:l,isDual:v,embeddedSubtitles:r,detectedQuality:n,detectedCodec:h,detectedAudio:p}}var C={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function de(e,i,o){let l=s=>(s||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),r=l(e||""),n=l(i||""),h=!!o||r.includes("forced")||n.includes("forced")||r.includes("zorunlu")||n.includes("zorunlu"),p=r.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),a=n.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),v=s=>{let g=s.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return h?`${g} (Zorunlu)`:g};if(p==="st"||p==="sot"||p.includes("sotho")||a.includes("sotho")||a.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:h?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let d=C[r]||C[n]||C[p]||C[a];if(!d){let s=(a+" "+p).split(/\s+/).filter(Boolean);for(let g of s)if(C[g]){d=C[g];break}}if(!d){for(let[s,g]of Object.entries(C))if(s.length>=4&&(a.includes(s)||p.includes(s))){d=g;break}}if(d)return{code:d.code,iso3:d.iso3,language:d.language,name:v(d.name)};let m=(i||e||"Altyaz\u0131").trim();m=m.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let y=m.charAt(0).toUpperCase()+m.slice(1),t=v(y),c=r&&r.length===2?r:n&&n.length===2?n:"und",b=r&&r.length===3?r:n&&n.length===3?n:"und";return{code:c,iso3:b,language:y,name:t}}function W(e){let i=e.url?ge(void 0,e.url):{},o=e.quality||e.inspection?.detectedQuality||i.detectedQuality||"1080p";o.includes("\u2022")&&(o=o.split("\u2022")[0].trim()),!o.includes("p")&&!o.includes("K")&&!o.includes("k")&&(o=`${o}p`);let l=e.subtitles||e.inspection?.subtitles,r=!!(e.inspection?.hasTurkishSubtitles||l?.some(u=>{let z=(u.lang||u.code||"").toLowerCase(),_=(u.langCode||u.iso3||"").toLowerCase(),S=(u.name||u.label||u.title||"").toLowerCase();return z==="tr"||z==="st"||_==="tur"||_==="sot"||S.includes("t\xFCrk")||S.includes("turk")||S.includes("sotho")})),n=(e.languageTitle||e.inspection?.languageTitle||"").toLowerCase().trim(),h=n.includes("dub")||n.includes("ses")||n.includes("dual")||!!i.hasTurkishAudio||!!e.inspection?.hasTurkishAudio,p=n.includes("dual")||n.includes("dub")&&(n.includes("alt")||n.includes("sub"))||h&&r,a="Orijinal";n.includes("yerli")||e.inspection?.isYerli?a="Yerli":p?a="Dublaj / Altyaz\u0131l\u0131":h?a="Dublaj":r||n.includes("alt")||n.includes("sub")?a="Altyaz\u0131l\u0131":(n.includes("orijinal")||n.includes("yabanc\u0131")||n.includes("original"))&&(a="Orijinal");let v=e.format==="m3u8"||e.url.includes(".m3u8")||e.url.includes("/master.")||e.url.includes("/hls/")||e.url.includes("/txt/"),d=e.format||(v?"m3u8":e.url.includes(".mp4")?"mp4":"m3u8"),m=d==="m3u8"?"HLS":d.toUpperCase(),y=[o],t=e.codec||e.inspection?.detectedCodec||i.detectedCodec;t&&t!=="H.264"&&y.push(t),y.push(m),e.bitrate&&y.push(e.bitrate);let c=e.audio||e.inspection?.detectedAudio||i.detectedAudio;c&&c!=="AAC 2.0"&&y.push(c);let b=e.details||y.join(" \u2022 "),s=`${a}
${b}`,g=`${o} \u2022 ${a}`,f={name:"han's 28",provider:"han's 28",title:a,description:s,url:e.url,quality:g,format:d};return e.headers&&Object.keys(e.headers).length>0&&(f.headers=e.headers),l&&l.length>0&&(f.subtitles=l),f}var L="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";async function me(e,i){let o=String(e||"").replace(/^tmdb:/i,"").trim();if(!o)return null;try{let l=await H(o,i),r=new Set;return l.posterPath&&r.add(l.posterPath.replace(/^\/|\.[a-zA-Z0-9]+$/g,"")),l.backdropPath&&r.add(l.backdropPath.replace(/^\/|\.[a-zA-Z0-9]+$/g,"")),{title:l.titles[0]||"",originalTitle:l.titles[1]||l.titles[0]||"",hashes:Array.from(r),titles:l.titles}}catch{return null}}async function M(e,i,o=1,l=1){let r=Date.now();A("han's 28",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${e}, T\xFCr: ${i}, Sezon: ${o}, B\xF6l\xFCm: ${l}`);try{A("han's 28",`[Ad\u0131m 1/4] TMDB bilgileri ve afi\u015F hashleri al\u0131n\u0131yor (${e})...`);let n=await me(e,i);if(!n||!n.title&&!n.originalTitle)return A("han's 28","TMDB meta verisi al\u0131namad\u0131.","warn"),[];let h=await O("teach");if(!h)return A("han's 28","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let p=Array.from(new Set(n.titles||[n.title,n.originalTitle])).filter(Boolean),a=null,v=null;A("han's 28","[Ad\u0131m 2/4] Kaynak \xFCzerinde afi\u015F hash e\u015Fle\u015Ftirmesi yap\u0131l\u0131yor...");for(let u of p)try{let z=`${h}/ara/oneri?q=${encodeURIComponent(u)}`,_=await fetch(z,{headers:{"User-Agent":L,Accept:"application/json",Referer:`${h}/`},signal:AbortSignal.timeout?AbortSignal.timeout(4e3):void 0});if(!_.ok)continue;let S=await _.json(),D=i==="tv"?S.series||[]:S.movies||[];for(let T of D){if(T.poster){for(let I of n.hashes)if(T.poster.includes(I)){a=T,v=I;break}}if(a)break}if(!a)for(let T of D){let I=(T.title||"").toLowerCase().replace(/[^a-z0-9]/g,"");for(let J of p){let U=J.toLowerCase().replace(/[^a-z0-9]/g,"");if(I&&U&&I===U){a=T;break}}if(a)break}if(a)break}catch{}if(!a||!a.url)return A("han's 28","E\u015Fle\u015Fen i\xE7erik bulunamad\u0131.","warn"),[];A("han's 28",` \u0130\xE7erik bulundu: "${a.title}"`,"success");let d;i==="tv"?d=`${a.url.replace(/\/+$/,"")}/sezon-${o}/bolum-${l}`:d=`${a.url.replace(/\/+$/,"").replace(/\/izle$/,"")}/izle`,A("han's 28",`[Ad\u0131m 3/4] \u0130\xE7erik sayfas\u0131 y\xFCkleniyor (${i==="tv"?`S${o}E${l}`:"Film"})...`);let m=await fetch(d,{headers:{"User-Agent":L,Referer:`${h}/`},signal:AbortSignal.timeout?AbortSignal.timeout(4500):void 0});if(!m.ok)if(i==="tv"){let u=`${a.url.replace(/\/+$/,"")}/season/${o}/episode/${l}`;m=await fetch(u,{headers:{"User-Agent":L,Referer:`${h}/`},signal:AbortSignal.timeout?AbortSignal.timeout(4e3):void 0}),m.ok&&(d=u)}else{let u=a.url.replace(/\/+$/,"");m=await fetch(u,{headers:{"User-Agent":L,Referer:`${h}/`},signal:AbortSignal.timeout?AbortSignal.timeout(4e3):void 0}),m.ok&&(d=u)}if(!m.ok)return A("han's 28",`\u0130\xE7erik sayfas\u0131 y\xFCklenemedi: HTTP ${m.status}`,"warn"),[];let y=await m.text();A("han's 28","[Ad\u0131m 4/4] Pilavyer oynat\u0131c\u0131s\u0131 \xE7\xF6z\xFCmleniyor...");let t=await q(y,d);if(!t||!t.hlsUrl)return A("han's 28","Video ak\u0131\u015F\u0131 \xE7\xF6z\xFCmlenemedi.","warn"),[];let c=t.audios.some(u=>u.lang==="tr"||u.label.toLowerCase().includes("dublaj")),b=t.subtitles.length,s=c&&b>0?"Dublaj / Altyaz\u0131l\u0131":c?"T\xFCrk\xE7e Dublaj":"Altyaz\u0131l\u0131",g=W({name:"han's 28",url:t.hlsUrl,languageTitle:s,quality:"1080p",format:"m3u8",headers:{Referer:`${t.origin}/`,Origin:t.origin,"User-Agent":L},subtitles:t.subtitles}),f=((Date.now()-r)/1e3).toFixed(2);return A("han's 28",`[Ad\u0131m 4/4] TAMAMLANDI: 1 adet ak\u0131\u015F haz\u0131rland\u0131 (${f}s)`,"success",[g].map(u=>({server:u.name,kalite:u.quality,title:u.title}))),[g]}catch(n){return A("han's 28",`Kritik Hata: ${n.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=M);typeof global<"u"&&(global.getStreams=M);typeof window<"u"&&(window.getStreams=M);var he={getStreams:M};

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

;(()=>{const n="han's 28",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
