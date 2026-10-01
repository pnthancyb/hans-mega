// [HANS-SPEED-BOOST] Pre-populate domains and config state for 0ms lookup latency
var _g = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this;
var _DEFAULT_DOMAINS = {"imu":"https://ha.vixolity.com","joyboy":"https://www.hdfilmizle.best","enel":"https://selcukflix.com","crocodile":"https://dizilla.now","xebec":"https://www.fullhdfilmizlesene.now","kidd":"https://filmmakinesi.to","shiki":"https://www.hdfilmcehennemi2.biz","garp":"https://siyahfilmizle.vip","ryuma":"https://lovefilmizle.net","rouge":"https://www.dizimom.wiki","kalgara":"https://dizibal.org","sakazuki":"https://dizipal2135.com","shanks":"https://filmekseni.vip","kizaru":"https://www.hdfilmcehennemi.nl","smoker":"https://dizipal1586.com","zunesha":"https://dizipal10.com.tr","oden":"https://yabanci-dizi.now","fujitora":"https://animecix.tv","lili":"https://openani.me","sabo":"https://api.anizium.co","shamrock":"https://animezer.com","bogard":"https://streamcorecdn.com","katakuri":"https://dizipod.com","mihawk":"https://webdramaturkey2.com","vegapunk":"https://ydfvfdizipanel.ru","clover":"https://japierdolevid.com","noland":"https://dizi75.life","doflamingo":"https://asyawatch.com","dragon":"https://dizisol.com","teach":"https://ddizibox.com","roger":"https://roketdizi.life","kuzan":"https://filmizlehub.live","garling":"https://liderfilmizle.vip","rayleigh":"https://vixsrc.to","hiriluk":"https://www.showbox.media","urouge":"https://lmscript.xyz","gaban":"https://streamdata.vaplayer.ru","ace":"https://arc018.stream","gorosei":"https://api.speedracelight.com","saul":"https://dizilab.to","toki":"https://diziroom.com"};
if (!_g.__NUVIO_CONFIG_STATE__) {
  _g.__NUVIO_CONFIG_STATE__ = {
    cachedDomains: _DEFAULT_DOMAINS,
    cachedCookies: {},
    cachedTmdbKeys: ["a2f888b27315e62e471b2d587048f32e","68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"],
    lastFetchTime: Date.now() + 86400000,
    activeFetchPromise: null
  };
} else if (!_g.__NUVIO_CONFIG_STATE__.cachedDomains || Object.keys(_g.__NUVIO_CONFIG_STATE__.cachedDomains).length === 0) {
  _g.__NUVIO_CONFIG_STATE__.cachedDomains = Object.assign({}, _DEFAULT_DOMAINS, _g.__NUVIO_CONFIG_STATE__.cachedDomains || {});
}
// [END-HANS-SPEED-BOOST]

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

"use strict";var B=Object.defineProperty;var Q=Object.getOwnPropertyDescriptor;var X=Object.getOwnPropertyNames;var Z=Object.prototype.hasOwnProperty;var ee=(n,s)=>{for(var i in s)B(n,i,{get:s[i],enumerable:!0})},ae=(n,s,i,c)=>{if(s&&typeof s=="object"||typeof s=="function")for(let r of X(s))!Z.call(n,r)&&r!==i&&B(n,r,{get:()=>s[r],enumerable:!(c=Q(s,r))||c.enumerable});return n};var ne=n=>ae(B({},"__esModule",{value:!0}),n);var fe={};ee(fe,{default:()=>he,getStreams:()=>P});module.exports=ne(fe);function T(n,s,i="info",c){let r=`[${n}]`;i==="error"?console.error(r,s,c||""):i==="warn"?console.warn(r,s,c||""):console.log(r,s,c||"");try{let p=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof p=="string"&&p.startsWith("http")&&fetch(p,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:n,level:i,message:s,details:c})}).catch(()=>{})}catch{}}var ie=[66,94,94,90,89,16,5,5,73,78,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89,4,64,89,69,68].map(s=>String.fromCharCode(s^42)).join(""),te=[66,94,94,90,89,16,5,5,78,69,71,75,67,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89].map(s=>String.fromCharCode(s^42)).join(""),E={REMOTE_CONFIG_URL:ie,FALLBACK_CONFIG_URL:te,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},D=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},O=5*60*1e3,se=15*1e3;if(!D.__NUVIO_CONFIG_STATE__){let n={},s={},i=[],c=0;try{if(typeof localStorage<"u"&&localStorage){let r=localStorage.getItem("__NUVIO_DOMAINS_CACHE_V3__");if(r){let a=JSON.parse(r);a&&typeof a.domains=="object"&&(n=a.domains,s=a.cookies||{},i=a.tmdbKeys||[],c=typeof a.time=="number"?a.time:0)}}}catch{}D.__NUVIO_CONFIG_STATE__={cachedDomains:n,cachedCookies:s,cachedTmdbKeys:i,lastFetchTime:c,activeFetchPromise:null}}var A=D.__NUVIO_CONFIG_STATE__;async function oe(n=!1){let s=Date.now(),i=[];i.push(E.REMOTE_CONFIG_URL),i.push(E.FALLBACK_CONFIG_URL);try{let r=D.__NUVIO_DEV_LOG_URL__;typeof r=="string"&&r.includes("/api/log")&&i.push(r.replace("/api/log","/domains"))}catch{}let c=typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function"?AbortSignal.timeout(4e3):void 0;for(let r of i)try{let a=await fetch(r,{signal:c});if(a.ok){let p=await a.json(),f=p?.data??p,e=f.domains||f,y=f.cookies,u=f.tmdb_keys||f.tmdbKeys;e&&typeof e=="object"&&(A.cachedDomains={...e}),y&&typeof y=="object"&&(A.cachedCookies={...A.cachedCookies,...y}),Array.isArray(u)&&u.length>0&&(A.cachedTmdbKeys=u),A.lastFetchTime=s,A.lastFetchSource=r,T("Config",`Domainler basariyla cekildi: ${r}`,"info");try{typeof localStorage<"u"&&localStorage&&localStorage.setItem("__NUVIO_DOMAINS_CACHE_V3__",JSON.stringify({domains:A.cachedDomains,cookies:A.cachedCookies,tmdbKeys:A.cachedTmdbKeys,time:s}))}catch{}return}}catch(a){T("Config",`Domain alinamadi (${r}): ${a.message}`,"warn")}A.lastFetchTime=s-O+se}async function K(n=!1){let s=Date.now(),i=Object.keys(A.cachedDomains).length>0;(n||!i||s-A.lastFetchTime>O)&&(A.activeFetchPromise||(A.activeFetchPromise=oe(n).finally(()=>{A.activeFetchPromise=null})),await A.activeFetchPromise)}async function $(n){return await K(),A.cachedDomains[n]||""}async function G(){return await K(),A.cachedTmdbKeys||[]}var le="a2f888b27315e62e471b2d587048f32e",x=[le,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function N(n){let s=await G(),i=s.length>0?[...s,...x]:x;for(let c=0;c<i.length;c++){let r=i[c],a=n.includes("?")?"&":"?",p=`https://api.themoviedb.org/3/${n}${a}api_key=${r}`;try{let f=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,e=await fetch(p,{signal:f});if(e.ok)return await e.json();if(e.status===429)continue}catch{}}return null}var R=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};R.__NUVIO_TMDB_CACHE__||(R.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map});var U=R.__NUVIO_TMDB_CACHE__,Ae=U.imdbIdCache,Te=U.tmdbTitlesCache,j=U.tmdbImageCache;async function H(n,s){let i=String(n||"").replace(/^tmdb:/i,"").trim();if(!i)return{titles:[]};let c=`${s}:${i}`;if(j.has(c))return j.get(c);let r=(async()=>{let a=[],p,f=null,e=null,y,u=[],g=[];try{let k=s==="tv"||s==="series",m=k?"tv":"movie";if(i.startsWith("tt")){let o=await N(`find/${i}?external_source=imdb_id`);if(o){let d=k?o?.tv_results?.[0]:o?.movie_results?.[0];if(d){p=d.id,f=d.poster_path?d.poster_path.replace(/^\//,""):null,e=d.backdrop_path?d.backdrop_path.replace(/^\//,""):null;let h=d.release_date||d.first_air_date;h&&(y=parseInt(String(h).split("-")[0],10)),d.original_name&&a.push(d.original_name),d.name&&a.push(d.name),d.original_title&&a.push(d.original_title),d.title&&a.push(d.title);let t=await N(`${m}/${d.id}?append_to_response=alternative_titles,images,translations&include_image_language=en,tr,ja,null`);if(t){if(t.translations?.translations&&Array.isArray(t.translations.translations))for(let l of t.translations.translations){let S=l.data?.name||l.data?.title;S&&typeof S=="string"&&a.push(S)}let b=(t.alternative_titles?.results||t.alternative_titles?.titles||[]).map(l=>l.title).filter(Boolean);if(a.push(...b),t.images?.posters&&Array.isArray(t.images.posters))for(let l of t.images.posters)l.file_path&&(u.push(l.file_path.replace(/^\//,"").toLowerCase()),g.push(l.file_path.replace(/^\//,"")));if(t.images?.backdrops&&Array.isArray(t.images.backdrops))for(let l of t.images.backdrops)l.file_path&&(u.push(l.file_path.replace(/^\//,"").toLowerCase()),g.push(l.file_path.replace(/^\//,"")))}}}}else{p=parseInt(i,10);let o=await N(`${m}/${i}?append_to_response=alternative_titles,images,translations&include_image_language=en,tr,ja,null`);if(o){f=o.poster_path?o.poster_path.replace(/^\//,""):null,e=o.backdrop_path?o.backdrop_path.replace(/^\//,""):null;let d=o.release_date||o.first_air_date;if(d&&(y=parseInt(String(d).split("-")[0],10)),o.original_name&&a.push(o.original_name),o.name&&a.push(o.name),o.original_title&&a.push(o.original_title),o.title&&a.push(o.title),o.translations?.translations&&Array.isArray(o.translations.translations))for(let t of o.translations.translations){let b=t.data?.name||t.data?.title;b&&typeof b=="string"&&a.push(b)}let h=(o.alternative_titles?.results||o.alternative_titles?.titles||[]).map(t=>t.title).filter(Boolean);if(a.push(...h),o.images?.posters&&Array.isArray(o.images.posters))for(let t of o.images.posters)t.file_path&&(u.push(t.file_path.replace(/^\//,"").toLowerCase()),g.push(t.file_path.replace(/^\//,"")));if(o.images?.backdrops&&Array.isArray(o.images.backdrops))for(let t of o.images.backdrops)t.file_path&&(u.push(t.file_path.replace(/^\//,"").toLowerCase()),g.push(t.file_path.replace(/^\//,"")))}}}catch{}return f&&(u.push(f.toLowerCase()),g.push(f)),e&&(u.push(e.toLowerCase()),g.push(e)),{numericId:p,titles:Array.from(new Set(a.filter(Boolean))),posterPath:f,backdropPath:e,year:y,allPosters:Array.from(new Set(u)),allPostersOriginal:Array.from(new Set(g))}})();return j.set(c,r),r}var re="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";async function q(n,s){try{let i=n.match(/data-pv=["']([^"']+)["']/i);if(!i||!i[1])return null;let c=i[1],r=n.match(/src=["'](https?:\/\/[^"']*pilavyer[^"']*\/assets\/js\/core\.js)["']/i),a=r?r[1].replace(/\/assets\/js\/core\.js.*$/,""):"https://pilavyerplay.top",p=`${a}/assets/js/s.php?s=${encodeURIComponent(c)}`,f=await fetch(p,{headers:{"User-Agent":re,Referer:s},signal:AbortSignal.timeout?AbortSignal.timeout(1e4):void 0});if(!f.ok)return null;let y=(await f.text()).match(/window\.__PLAYER__\s*=\s*(\{[\s\S]*?\});/);if(!y||!y[1])return null;let u=JSON.parse(y[1]);if(!u||!u.stream)return null;let g=[];if(Array.isArray(u.subs)){for(let k of u.subs)if(k.src){let m=k.lang||"tr",o=k.label||(m.toLowerCase().includes("tr")?"T\xFCrk\xE7e":"Altyaz\u0131");g.push({id:k.sid||`sub_${m}`,label:o,lang:m,language:m,title:o,name:o,url:k.src.replace(/&amp;/g,"&")})}}return{hlsUrl:u.stream.replace(/&amp;/g,"&"),subtitles:g,audios:Array.isArray(u.audios)?u.audios:[],origin:a,title:u.title}}catch{return null}}var ce=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],V=["tr","tur","ota"],ue=["english","ingilizce","original","orijinal","audio-en"],Y=["en","eng","und"];function ge(n,s){let i=!1,c=!1,r=[],a,p,f,e=(s||"").toLowerCase();if(e.includes("trdual")||e.includes("dual")||e.includes("trdub")||e.includes("dublaj")?(i=!0,c=!0):(e.includes("ses-tr")||e.includes("turkcedublaj")||e.includes("turkce-dublaj"))&&(i=!0),e.includes("2160p")||e.includes("4k")||e.includes("uhd")||e.includes("-2160.")?a="4K":e.includes("1080p")||e.includes("1920x1080")||e.includes("fhd")||e.includes("-1080.")?a="1080p":e.includes("720p")||e.includes("1280x720")||e.includes("hd")||e.includes("-720.")?a="720p":e.includes("480p")||e.includes("854x480")||e.includes("sd")||e.includes("-480.")?a="480p":(e.includes("360p")||e.includes("640x360")||e.includes("-360."))&&(a="360p"),e.includes("hevc")||e.includes("h265")||e.includes("x265")?p="HEVC":e.includes("av1")?p="AV1":(e.includes("h264")||e.includes("x264")||e.includes("avc"))&&(p="H.264"),e.includes("5.1")||e.includes("eac3")||e.includes("ac3")||e.includes("ddp")?f="Dolby 5.1":(e.includes("7.1")||e.includes("atmos"))&&(f="Dolby Atmos 7.1"),n&&typeof n=="string"){let u=n.split(/\r?\n/),g=0;for(let k of u){let m=k.trim();if(m.startsWith("#EXT-X-MEDIA:")&&m.includes("TYPE=AUDIO")){let o=m.match(/NAME=["']([^"']+)["']/i),d=m.match(/LANGUAGE=["']([^"']+)["']/i),h=m.match(/GROUP-ID=["']([^"']+)["']/i),t=(o?o[1]:"").toLowerCase(),b=(d?d[1]:"").toLowerCase(),l=(h?h[1]:"").toLowerCase(),S=t.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),z=l.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),w=V.includes(b)||V.some(v=>S.includes(v)||z.includes(v))||ce.some(v=>t.includes(v)||l.includes(v))||t.includes("t\xFCrk")||t.includes("turk")||l.includes("dual"),M=Y.includes(b)||Y.some(v=>S.includes(v)||z.includes(v))||ue.some(v=>t.includes(v)||l.includes(v))||t.includes("orig")||t.includes("ing")||t.includes("eng");w&&(i=!0),M&&(c=!0)}if(m.startsWith("#EXT-X-MEDIA:")&&m.includes("TYPE=SUBTITLES")){let o=m.match(/URI=["']([^"']+)["']/i),d=m.match(/NAME=["']([^"']+)["']/i),h=m.match(/LANGUAGE=["']([^"']+)["']/i);if(o&&o[1]){let t=o[1];if(s&&!t.startsWith("http"))try{t=new URL(t,s).toString()}catch{}let b=d?d[1]:"Altyaz\u0131",l=h?h[1].toLowerCase():"";l==="st"||l==="sot"||b.toLowerCase().includes("sotho")||b.toLowerCase().includes("sesotho")||t.toLowerCase().includes("sub_st")?(l="tr",b="T\xFCrk\xE7e"):l||(l=b.toLowerCase().includes("t\xFCrk")?"tr":"und");let z=de(l,b);r.push({label:z.name||b,url:t,lang:z.code||l})}}if(m.startsWith("#EXT-X-STREAM-INF:")){let o=m.match(/RESOLUTION=(\d+)x(\d+)/i);if(o){let d=parseInt(o[1],10),h=parseInt(o[2],10),t=Math.min(d,h),b=Math.max(d,h),l=t>=2100||b>=3800?2160:t>=1400||b>=2500?1440:t>=1e3||b>=1900?1080:t>=700||b>=1200?720:t>=450?480:t;l>g&&(g=l)}else{let d=m.match(/NAME=["']?([^"',\s]+)["']?/i);if(d){let h=d[1].toLowerCase();h.includes("2160")||h.includes("4k")?2160>g&&(g=2160):h.includes("1440")||h.includes("2k")?1440>g&&(g=1440):h.includes("1080")?1080>g&&(g=1080):h.includes("720")&&720>g&&(g=720)}}}}g>=2160?a="4K":g>=1440?a="2K":g>=1080?a="1080p":g>=720?a="720p":g>=480&&(a="480p")}let y=i&&c||e.includes("dual")||e.includes("trdual");return{hasTurkishAudio:i,hasOriginalAudio:c,isDual:y,embeddedSubtitles:r,detectedQuality:a,detectedCodec:p,detectedAudio:f}}var C={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function de(n,s,i){let c=h=>(h||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),r=c(n||""),a=c(s||""),p=!!i||r.includes("forced")||a.includes("forced")||r.includes("zorunlu")||a.includes("zorunlu"),f=r.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),e=a.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),y=h=>{let t=h.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return p?`${t} (Zorunlu)`:t};if(f==="st"||f==="sot"||f.includes("sotho")||e.includes("sotho")||e.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:p?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let u=C[r]||C[a]||C[f]||C[e];if(!u){let h=(e+" "+f).split(/\s+/).filter(Boolean);for(let t of h)if(C[t]){u=C[t];break}}if(!u){for(let[h,t]of Object.entries(C))if(h.length>=4&&(e.includes(h)||f.includes(h))){u=t;break}}if(u)return{code:u.code,iso3:u.iso3,language:u.language,name:y(u.name)};let g=(s||n||"Altyaz\u0131").trim();g=g.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let k=g.charAt(0).toUpperCase()+g.slice(1),m=y(k),o=r&&r.length===2?r:a&&a.length===2?a:"und",d=r&&r.length===3?r:a&&a.length===3?a:"und";return{code:o,iso3:d,language:k,name:m}}function W(n){let s=n.url?ge(void 0,n.url):{},i=n.quality||n.inspection?.detectedQuality||s.detectedQuality||"1080p";i.includes("\u2022")&&(i=i.split("\u2022")[0].trim()),!i.includes("p")&&!i.includes("K")&&!i.includes("k")&&i!=="HD"&&i!=="FHD"&&i!=="SD"&&(i=`${i}p`);let c=n.subtitles||n.inspection?.subtitles,r=!!(n.inspection?.hasTurkishSubtitles||c?.some(l=>{let S=(l.lang||l.code||"").toLowerCase(),z=(l.langCode||l.iso3||"").toLowerCase(),w=(l.name||l.label||l.title||"").toLowerCase();return S==="tr"||S==="st"||z==="tur"||z==="sot"||w.includes("t\xFCrk")||w.includes("turk")||w.includes("sotho")})),a=(n.languageTitle||n.inspection?.languageTitle||"").toLowerCase().trim(),p=a.includes("dub")||a.includes("ses")||a.includes("dual")||!!s.hasTurkishAudio||!!n.inspection?.hasTurkishAudio,f=a.includes("dual")||a.includes("dub")&&(a.includes("alt")||a.includes("sub"))||p&&r,e="Orijinal";a.includes("yerli")||n.inspection?.isYerli?e="Yerli":f?e="Dublaj / Altyaz\u0131l\u0131":p?e="Dublaj":r||a.includes("alt")||a.includes("sub")?e="Altyaz\u0131l\u0131":(a.includes("orijinal")||a.includes("yabanc\u0131")||a.includes("original"))&&(e="Orijinal");let y=n.format==="m3u8"||n.url.includes(".m3u8")||n.url.includes("/master.")||n.url.includes("/hls/")||n.url.includes("/txt/"),u=n.format||(y?"m3u8":n.url.includes(".mp4")?"mp4":"m3u8"),g=u==="m3u8"?"HLS":u.toUpperCase(),k=[i],m=n.codec||n.inspection?.detectedCodec||s.detectedCodec;m&&m!=="H.264"&&k.push(m),k.push(g),n.bitrate&&k.push(n.bitrate);let o=n.audio||n.inspection?.detectedAudio||s.detectedAudio;o&&o!=="AAC 2.0"&&k.push(o);let d=n.details||k.join(" \u2022 "),h=`${e}
${d}`,t=`${i} \u2022 ${e}`,b={name:"han's 13",provider:"han's 13",title:e,description:h,url:n.url,quality:t,format:u};return n.headers&&Object.keys(n.headers).length>0&&(b.headers=n.headers),c&&c.length>0&&(b.subtitles=c),b}var _="han's 13",I="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";async function me(n,s){let i=String(n||"").replace(/^tmdb:/i,"").trim();if(!i)return null;try{let c=await H(i,s),r=new Set;return c.posterPath&&r.add(c.posterPath.replace(/^\/|\.[a-zA-Z0-9]+$/g,"")),c.backdropPath&&r.add(c.backdropPath.replace(/^\/|\.[a-zA-Z0-9]+$/g,"")),{title:c.titles[0]||"",originalTitle:c.titles[1]||c.titles[0]||"",hashes:Array.from(r),titles:c.titles}}catch{return null}}async function P(n,s,i=1,c=1){let r=Date.now();T(_,`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${n}, T\xFCr: ${s}, Sezon: ${i}, B\xF6l\xFCm: ${c}`);try{T(_,`[Ad\u0131m 1/4] TMDB bilgileri ve afi\u015F hashleri al\u0131n\u0131yor (${n})...`);let a=await me(n,s);if(!a||!a.title&&!a.originalTitle)return T(_,"TMDB meta verisi al\u0131namad\u0131.","warn"),[];let p=await $("kalgara");if(!p)return T(_,"Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let f=Array.from(new Set(a.titles||[a.title,a.originalTitle])).filter(Boolean),e=null,y=null;T(_,"[Ad\u0131m 2/4] Kaynak \xFCzerinde afi\u015F hash e\u015Fle\u015Ftirmesi yap\u0131l\u0131yor...");for(let l of f)try{let S=`${p}/ara/oneri?q=${encodeURIComponent(l)}`,z=await fetch(S,{headers:{"User-Agent":I,Accept:"application/json",Referer:`${p}/`},signal:AbortSignal.timeout?AbortSignal.timeout(4500):void 0});if(!z.ok)continue;let w=await z.json(),M=s==="tv"?w.series||[]:w.movies||[];for(let v of M){if(v.poster){for(let L of a.hashes)if(v.poster.includes(L)){e=v,y=L;break}}if(e)break}if(!e)for(let v of M){let L=(v.title||"").toLowerCase().replace(/[^a-z0-9]/g,"");for(let J of f){let F=J.toLowerCase().replace(/[^a-z0-9]/g,"");if(L&&F&&L===F){e=v;break}}if(e)break}if(e)break}catch{}if(!e||!e.url)return T(_,"E\u015Fle\u015Fen i\xE7erik bulunamad\u0131.","warn"),[];T(_,` \u0130\xE7erik bulundu: "${e.title}"`,"success");let u;s==="tv"?u=`${e.url.replace(/\/+$/,"")}/season/${i}/episode/${c}`:u=`${e.url.replace(/\/+$/,"").replace(/\/izle$/,"")}/izle`,T(_,`[Ad\u0131m 3/4] \u0130\xE7erik sayfas\u0131 y\xFCkleniyor (${s==="tv"?`S${i}E${c}`:"Film"})...`);let g=await fetch(u,{headers:{"User-Agent":I,Referer:`${p}/`},signal:AbortSignal.timeout?AbortSignal.timeout(4500):void 0});if(!g.ok)if(s==="tv"){let l=`${e.url.replace(/\/+$/,"")}/sezon-${i}/bolum-${c}`;g=await fetch(l,{headers:{"User-Agent":I,Referer:`${p}/`},signal:AbortSignal.timeout?AbortSignal.timeout(4e3):void 0}),g.ok&&(u=l)}else{let l=e.url.replace(/\/+$/,"");g=await fetch(l,{headers:{"User-Agent":I,Referer:`${p}/`},signal:AbortSignal.timeout?AbortSignal.timeout(4e3):void 0}),g.ok&&(u=l)}if(!g.ok)return T(_,`\u0130\xE7erik sayfas\u0131 y\xFCklenemedi: HTTP ${g.status}`,"warn"),[];let k=await g.text();T(_,"[Ad\u0131m 4/4] Pilavyer oynat\u0131c\u0131s\u0131 \xE7\xF6z\xFCmleniyor...");let m=await q(k,u);if(!m||!m.hlsUrl)return T(_,"Video ak\u0131\u015F\u0131 \xE7\xF6z\xFCmlenemedi.","warn"),[];let o=m.audios.some(l=>l.lang==="tr"||l.label.toLowerCase().includes("dublaj")),d=m.subtitles.length,h=o&&d>0?"Dublaj / Altyaz\u0131l\u0131":o?"T\xFCrk\xE7e Dublaj":"Altyaz\u0131l\u0131",t=W({name:_,url:m.hlsUrl,languageTitle:h,quality:"1080p",format:"m3u8",headers:{Referer:`${m.origin}/`,Origin:m.origin,"User-Agent":I},subtitles:m.subtitles}),b=((Date.now()-r)/1e3).toFixed(2);return T(_,`[Ad\u0131m 4/4] TAMAMLANDI: 1 adet ak\u0131\u015F haz\u0131rland\u0131 (${b}s)`,"success",[t].map(l=>({server:l.name,kalite:l.quality,title:l.title}))),[t]}catch(a){return T(_,`Kritik Hata: ${a.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=P);typeof global<"u"&&(global.getStreams=P);typeof window<"u"&&(window.getStreams=P);var he={getStreams:P};

var _exp = (typeof module !== "undefined" && module.exports) ? module.exports : {};
var _glob = typeof globalThis !== "undefined" ? globalThis : (typeof global !== "undefined" ? global : (typeof window !== "undefined" ? window : {}));
var _gs = _exp.getStreams || (_exp.default && _exp.default.getStreams) || _glob.getStreams;
var _sub = _exp.getSubtitles || (_exp.default && _exp.default.getSubtitles) || _glob.getSubtitles;
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

;(()=>{const n="han's 13",g=typeof globalThis!=="undefined"?globalThis:typeof global!=="undefined"?global:this,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;g.__HANS_CACHE__=g.__HANS_CACHE__||new Map();const c=g.__HANS_CACHE__,TTL=600000,w=async(...a)=>{let k;try{k=n+":"+JSON.stringify(a)}catch{k=null}const now=Date.now();if(k&&c.has(k)){const e=c.get(k);if(e&&now-e.t<TTL)return e.d;}let t;const tp=new Promise(res=>{t=setTimeout(()=>res([]),5500);}),ep=(async()=>{try{const r=await f(...a);if(t)clearTimeout(t);const res=Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):(r||[]);if(k&&Array.isArray(res)&&res.length>0)c.set(k,{d:res,t:Date.now()});return res;}catch{if(t)clearTimeout(t);return [];}})();return Promise.race([ep,tp]);};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports.getStreams=w;}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true});}catch(e){m.exports.getStreams=w;}}})();
