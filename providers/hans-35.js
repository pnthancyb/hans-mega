// [HANS-SPEED-BOOST] Pre-populate domains and config state for 0ms lookup latency
var _g = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this;
var _DEFAULT_DOMAINS = {"imu":"https://ha.vixolity.com","joyboy":"https://www.hdfilmizle.best","enel":"https://selcukflix.com","crocodile":"https://dizilla.now","xebec":"https://www.fullhdfilmizlesene.now","kidd":"https://filmmakinesi.to","shiki":"https://www.hdfilmcehennemi2.biz","garp":"https://siyahfilmizle.vip","ryuma":"https://lovefilmizle.net","rouge":"https://www.dizimom.wiki","kalgara":"https://dizibal.org","sakazuki":"https://dizipal2135.com","shanks":"https://filmekseni.vip","kizaru":"https://www.hdfilmcehennemi.nl","smoker":"https://dizipal1584.com","zunesha":"https://dizipal10.com.tr","oden":"https://yabanci-dizi.now","fujitora":"https://animecix.tv","lili":"https://openani.me","sabo":"https://api.anizium.co","shamrock":"https://animezer.com","bogard":"https://streamcorecdn.com","katakuri":"https://dizipod.com","mihawk":"https://webdramaturkey2.com","vegapunk":"https://ydfvfdizipanel.ru","clover":"https://japierdolevid.com","noland":"https://dizi75.life","doflamingo":"https://asyawatch.com","dragon":"https://dizisol.com","teach":"https://ddizibox.com","roger":"https://roketdizi.life","kuzan":"https://filmizlehub.live","garling":"https://liderfilmizle.vip","rayleigh":"https://vixsrc.to","hiriluk":"https://www.showbox.media","urouge":"https://lmscript.xyz","gaban":"https://streamdata.vaplayer.ru","ace":"https://arc018.stream","gorosei":"https://api.speedracelight.com","saul":"https://dizilab.to","toki":"https://diziroom.com"};
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

"use strict";var $=Object.defineProperty;var ce=Object.getOwnPropertyDescriptor;var ue=Object.getOwnPropertyNames;var ge=Object.prototype.hasOwnProperty;var de=(i,o)=>{for(var t in o)$(i,t,{get:o[t],enumerable:!0})},me=(i,o,t,r)=>{if(o&&typeof o=="object"||typeof o=="function")for(let l of ue(o))!ge.call(i,l)&&l!==t&&$(i,l,{get:()=>o[l],enumerable:!(r=ce(o,l))||r.enumerable});return i};var he=i=>me($({},"__esModule",{value:!0}),i);var ze={};de(ze,{getStreams:()=>oe});module.exports=he(ze);function C(i,o,t="info",r){let l=`[${i}]`;t==="error"?console.error(l,o,r||""):t==="warn"?console.warn(l,o,r||""):console.log(l,o,r||"");try{let g=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof g=="string"&&g.startsWith("http")&&fetch(g,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:i,level:t,message:o,details:r})}).catch(()=>{})}catch{}}var fe=[66,94,94,90,89,16,5,5,73,78,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89,4,64,89,69,68].map(o=>String.fromCharCode(o^42)).join(""),pe=[66,94,94,90,89,16,5,5,78,69,71,75,67,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89].map(o=>String.fromCharCode(o^42)).join(""),j={REMOTE_CONFIG_URL:fe,FALLBACK_CONFIG_URL:pe,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},O=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},J=5*60*1e3,be=15*1e3;if(!O.__NUVIO_CONFIG_STATE__){let i={},o={},t=[],r=0;try{if(typeof localStorage<"u"&&localStorage){let l=localStorage.getItem("__NUVIO_DOMAINS_CACHE_V3__");if(l){let e=JSON.parse(l);e&&typeof e.domains=="object"&&(i=e.domains,o=e.cookies||{},t=e.tmdbKeys||[],r=typeof e.time=="number"?e.time:0)}}}catch{}O.__NUVIO_CONFIG_STATE__={cachedDomains:i,cachedCookies:o,cachedTmdbKeys:t,lastFetchTime:r,activeFetchPromise:null}}var T=O.__NUVIO_CONFIG_STATE__;async function ke(i=!1){let o=Date.now(),t=[];t.push(j.REMOTE_CONFIG_URL),t.push(j.FALLBACK_CONFIG_URL);try{let l=O.__NUVIO_DEV_LOG_URL__;typeof l=="string"&&l.includes("/api/log")&&t.push(l.replace("/api/log","/domains"))}catch{}let r=typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function"?AbortSignal.timeout(4e3):void 0;for(let l of t)try{let e=await fetch(l,{signal:r});if(e.ok){let g=await e.json(),h=g?.data??g,a=h.domains||h,_=h.cookies,b=h.tmdb_keys||h.tmdbKeys;a&&typeof a=="object"&&(T.cachedDomains={...a}),_&&typeof _=="object"&&(T.cachedCookies={...T.cachedCookies,..._}),Array.isArray(b)&&b.length>0&&(T.cachedTmdbKeys=b),T.lastFetchTime=o,T.lastFetchSource=l,C("Config",`Domainler basariyla cekildi: ${l}`,"info");try{typeof localStorage<"u"&&localStorage&&localStorage.setItem("__NUVIO_DOMAINS_CACHE_V3__",JSON.stringify({domains:T.cachedDomains,cookies:T.cachedCookies,tmdbKeys:T.cachedTmdbKeys,time:o}))}catch{}return}}catch(e){C("Config",`Domain alinamadi (${l}): ${e.message}`,"warn")}T.lastFetchTime=o-J+be}async function W(i=!1){let o=Date.now(),t=Object.keys(T.cachedDomains).length>0;(i||!t||o-T.lastFetchTime>J)&&(T.activeFetchPromise||(T.activeFetchPromise=ke(i).finally(()=>{T.activeFetchPromise=null})),await T.activeFetchPromise)}async function Q(i){return await W(),T.cachedDomains[i]||""}async function X(){return await W(),T.cachedTmdbKeys||[]}var ye="a2f888b27315e62e471b2d587048f32e",Z=[ye,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function ee(i){let o=await X(),t=o.length>0?[...o,...Z]:Z;for(let r=0;r<t.length;r++){let l=t[r],e=i.includes("?")?"&":"?",g=`https://api.themoviedb.org/3/${i}${e}api_key=${l}`;try{let h=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,a=await fetch(g,{signal:h});if(a.ok)return await a.json();if(a.status===429)continue}catch{}}return null}var x=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};x.__NUVIO_TMDB_CACHE__||(x.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map});var H=x.__NUVIO_TMDB_CACHE__,Ne=H.imdbIdCache,K=H.tmdbTitlesCache,Be=H.tmdbImageCache;async function ae(i,o){let t=String(i||"").replace(/^tmdb:/i,"").trim();if(!t)return{titles:[]};let r=`${o}:${t}`;if(K.has(r))return K.get(r);let l=(async()=>{let e=[],g,h,a=[],_=[],b,m=[];try{let A=o==="tv"||o==="series",k=A?"tv":"movie";if(t.startsWith("tt")){let n=await ee(`find/${t}?external_source=imdb_id`);if(n){let f=A?n?.tv_results?.[0]:n?.movie_results?.[0];f&&(g=f.id,f.overview&&(b=f.overview))}}else g=parseInt(t,10);if(g&&!isNaN(g)){let n=await ee(`${k}/${g}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(n){if(n.overview&&(b=n.overview),n.title&&(e.push(n.title),n.title.includes(":"))){let s=n.title.split(":")[0].trim();s.length>2&&e.push(s)}if(n.name&&(e.push(n.name),n.name.includes(":"))){let s=n.name.split(":")[0].trim();s.length>2&&e.push(s)}if(n.original_title&&n.original_title!==n.title&&(e.push(n.original_title),n.original_title.includes(":"))){let s=n.original_title.split(":")[0].trim();s.length>2&&e.push(s)}if(n.original_name&&n.original_name!==n.name&&(e.push(n.original_name),n.original_name.includes(":"))){let s=n.original_name.split(":")[0].trim();s.length>2&&e.push(s)}if(n.translations?.translations&&Array.isArray(n.translations.translations))for(let s of n.translations.translations){let u=s.data?.name||s.data?.title;if(u&&typeof u=="string"&&(e.push(u),u.includes(":"))){let L=u.split(":")[0].trim();L.length>2&&e.push(L)}}let f=(n.alternative_titles?.results||n.alternative_titles?.titles||[]).map(s=>s.title).filter(Boolean);e.push(...f);let d=n.release_date||n.first_air_date;if(d&&(h=parseInt(d.split("-")[0],10)),n.genres&&Array.isArray(n.genres)&&(m=n.genres.map(s=>s.name).filter(Boolean)),n.credits?.cast&&Array.isArray(n.credits.cast)){let s=new Set;n.credits.cast.slice(0,15).forEach(u=>{u.name&&s.add(u.name),u.original_name&&s.add(u.original_name)}),a=Array.from(s)}let c=[];n.created_by&&Array.isArray(n.created_by)&&c.push(...n.created_by.map(s=>s.name).filter(Boolean)),n.credits?.crew&&Array.isArray(n.credits.crew)&&c.push(...n.credits.crew.filter(s=>s.job==="Director"||s.department==="Directing").map(s=>s.name).filter(Boolean)),_=Array.from(new Set(c))}}}catch{}return{numericId:g,titles:Array.from(new Set(e.filter(Boolean))),year:h,cast:a,creators:_,overview:b,genres:m}})();return K.set(r,l),l}async function ne(i){let{providerName:o,season:t,episode:r,fetcher:l,isValid:e}=i;try{let g=await l(t,r);if(e(g))return{data:g,resolvedSeason:t,resolvedEpisode:r,strategy:"direct"}}catch(g){C(o,`Do\u011Frudan b\xF6l\xFCm sorgusu hatas\u0131 (S${t}E${r}): ${g?.message||g}`,"warn")}return{data:null,resolvedSeason:t,resolvedEpisode:r,strategy:"none"}}var Te=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],ie=["tr","tur","ota"],ve=["english","ingilizce","original","orijinal","audio-en"],te=["en","eng","und"];function _e(i,o){let t=!1,r=!1,l=[],e,g,h,a=(o||"").toLowerCase();if(a.includes("trdual")||a.includes("dual")||a.includes("trdub")||a.includes("dublaj")?(t=!0,r=!0):(a.includes("ses-tr")||a.includes("turkcedublaj")||a.includes("turkce-dublaj"))&&(t=!0),a.includes("2160p")||a.includes("4k")||a.includes("uhd")||a.includes("-2160.")?e="4K":a.includes("1080p")||a.includes("1920x1080")||a.includes("fhd")||a.includes("-1080.")?e="1080p":a.includes("720p")||a.includes("1280x720")||a.includes("hd")||a.includes("-720.")?e="720p":a.includes("480p")||a.includes("854x480")||a.includes("sd")||a.includes("-480.")?e="480p":(a.includes("360p")||a.includes("640x360")||a.includes("-360."))&&(e="360p"),a.includes("hevc")||a.includes("h265")||a.includes("x265")?g="HEVC":a.includes("av1")?g="AV1":(a.includes("h264")||a.includes("x264")||a.includes("avc"))&&(g="H.264"),a.includes("5.1")||a.includes("eac3")||a.includes("ac3")||a.includes("ddp")?h="Dolby 5.1":(a.includes("7.1")||a.includes("atmos"))&&(h="Dolby Atmos 7.1"),i&&typeof i=="string"){let b=i.split(/\r?\n/),m=0;for(let A of b){let k=A.trim();if(k.startsWith("#EXT-X-MEDIA:")&&k.includes("TYPE=AUDIO")){let n=k.match(/NAME=["']([^"']+)["']/i),f=k.match(/LANGUAGE=["']([^"']+)["']/i),d=k.match(/GROUP-ID=["']([^"']+)["']/i),c=(n?n[1]:"").toLowerCase(),s=(f?f[1]:"").toLowerCase(),u=(d?d[1]:"").toLowerCase(),L=c.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),v=u.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),M=ie.includes(s)||ie.some(w=>L.includes(w)||v.includes(w))||Te.some(w=>c.includes(w)||u.includes(w))||c.includes("t\xFCrk")||c.includes("turk")||u.includes("dual"),P=te.includes(s)||te.some(w=>L.includes(w)||v.includes(w))||ve.some(w=>c.includes(w)||u.includes(w))||c.includes("orig")||c.includes("ing")||c.includes("eng");M&&(t=!0),P&&(r=!0)}if(k.startsWith("#EXT-X-MEDIA:")&&k.includes("TYPE=SUBTITLES")){let n=k.match(/URI=["']([^"']+)["']/i),f=k.match(/NAME=["']([^"']+)["']/i),d=k.match(/LANGUAGE=["']([^"']+)["']/i);if(n&&n[1]){let c=n[1];if(o&&!c.startsWith("http"))try{c=new URL(c,o).toString()}catch{}let s=f?f[1]:"Altyaz\u0131",u=d?d[1].toLowerCase():"";u==="st"||u==="sot"||s.toLowerCase().includes("sotho")||s.toLowerCase().includes("sesotho")||c.toLowerCase().includes("sub_st")?(u="tr",s="T\xFCrk\xE7e"):u||(u=s.toLowerCase().includes("t\xFCrk")?"tr":"und");let v=Ae(u,s);l.push({label:v.name||s,url:c,lang:v.code||u})}}if(k.startsWith("#EXT-X-STREAM-INF:")){let n=k.match(/RESOLUTION=(\d+)x(\d+)/i);if(n){let f=parseInt(n[1],10),d=parseInt(n[2],10),c=Math.min(f,d),s=Math.max(f,d),u=c>=2100||s>=3800?2160:c>=1400||s>=2500?1440:c>=1e3||s>=1900?1080:c>=700||s>=1200?720:c>=450?480:c;u>m&&(m=u)}else{let f=k.match(/NAME=["']?([^"',\s]+)["']?/i);if(f){let d=f[1].toLowerCase();d.includes("2160")||d.includes("4k")?2160>m&&(m=2160):d.includes("1440")||d.includes("2k")?1440>m&&(m=1440):d.includes("1080")?1080>m&&(m=1080):d.includes("720")&&720>m&&(m=720)}}}}m>=2160?e="4K":m>=1440?e="2K":m>=1080?e="1080p":m>=720?e="720p":m>=480&&(e="480p")}let _=t&&r||a.includes("dual")||a.includes("trdual");return{hasTurkishAudio:t,hasOriginalAudio:r,isDual:_,embeddedSubtitles:l,detectedQuality:e,detectedCodec:g,detectedAudio:h}}var E={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function Ae(i,o,t){let r=d=>(d||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),l=r(i||""),e=r(o||""),g=!!t||l.includes("forced")||e.includes("forced")||l.includes("zorunlu")||e.includes("zorunlu"),h=l.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),a=e.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),_=d=>{let c=d.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return g?`${c} (Zorunlu)`:c};if(h==="st"||h==="sot"||h.includes("sotho")||a.includes("sotho")||a.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:g?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let b=E[l]||E[e]||E[h]||E[a];if(!b){let d=(a+" "+h).split(/\s+/).filter(Boolean);for(let c of d)if(E[c]){b=E[c];break}}if(!b){for(let[d,c]of Object.entries(E))if(d.length>=4&&(a.includes(d)||h.includes(d))){b=c;break}}if(b)return{code:b.code,iso3:b.iso3,language:b.language,name:_(b.name)};let m=(o||i||"Altyaz\u0131").trim();m=m.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let A=m.charAt(0).toUpperCase()+m.slice(1),k=_(A),n=l&&l.length===2?l:e&&e.length===2?e:"und",f=l&&l.length===3?l:e&&e.length===3?e:"und";return{code:n,iso3:f,language:A,name:k}}function se(i){let o=i.url?_e(void 0,i.url):{},t=i.quality||i.inspection?.detectedQuality||o.detectedQuality||"1080p";t.includes("\u2022")&&(t=t.split("\u2022")[0].trim()),!t.includes("p")&&!t.includes("K")&&!t.includes("k")&&t!=="HD"&&t!=="FHD"&&t!=="SD"&&(t=`${t}p`);let r=i.subtitles||i.inspection?.subtitles,l=!!(i.inspection?.hasTurkishSubtitles||r?.some(u=>{let L=(u.lang||u.code||"").toLowerCase(),v=(u.langCode||u.iso3||"").toLowerCase(),M=(u.name||u.label||u.title||"").toLowerCase();return L==="tr"||L==="st"||v==="tur"||v==="sot"||M.includes("t\xFCrk")||M.includes("turk")||M.includes("sotho")})),e=(i.languageTitle||i.inspection?.languageTitle||"").toLowerCase().trim(),g=e.includes("dub")||e.includes("ses")||e.includes("dual")||!!o.hasTurkishAudio||!!i.inspection?.hasTurkishAudio,h=e.includes("dual")||e.includes("dub")&&(e.includes("alt")||e.includes("sub"))||g&&l,a="Orijinal";e.includes("yerli")||i.inspection?.isYerli?a="Yerli":h?a="Dublaj / Altyaz\u0131l\u0131":g?a="Dublaj":l||e.includes("alt")||e.includes("sub")?a="Altyaz\u0131l\u0131":(e.includes("orijinal")||e.includes("yabanc\u0131")||e.includes("original"))&&(a="Orijinal");let _=i.format==="m3u8"||i.url.includes(".m3u8")||i.url.includes("/master.")||i.url.includes("/hls/")||i.url.includes("/txt/"),b=i.format||(_?"m3u8":i.url.includes(".mp4")?"mp4":"m3u8"),m=b==="m3u8"?"HLS":b.toUpperCase(),A=[t],k=i.codec||i.inspection?.detectedCodec||o.detectedCodec;k&&k!=="H.264"&&A.push(k),A.push(m),i.bitrate&&A.push(i.bitrate);let n=i.audio||i.inspection?.detectedAudio||o.detectedAudio;n&&n!=="AAC 2.0"&&A.push(n);let f=i.details||A.join(" \u2022 "),d=`${a}
${f}`,c=`${t} \u2022 ${a}`,s={name:"han's 35",provider:"han's 35",title:a,description:d,url:i.url,quality:c,format:b};return i.headers&&Object.keys(i.headers).length>0&&(s.headers=i.headers),r&&r.length>0&&(s.subtitles=r),s}var Se="134e150d5b430204550809065940060f014441085852560f",Ce={tr:{code:"tr",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",language:"English",name:"\u0130ngilizce"},eng:{code:"en",language:"English",name:"\u0130ngilizce"},de:{code:"de",language:"German",name:"Almanca"},fr:{code:"fr",language:"French",name:"Frans\u0131zca"},es:{code:"es",language:"Spanish",name:"\u0130spanyolca"},it:{code:"it",language:"Italian",name:"\u0130talyanca"},ar:{code:"ar",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",language:"Japanese",name:"Japonca"}};async function oe(i,o,t,r){let l=Date.now();C("han's 35",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${i}, T\xFCr: ${o}, Sezon: ${t}, B\xF6l\xFCm: ${r}`);try{let e=String(i||"").trim(),g=String(o||"").toLowerCase().trim(),h=g==="tv"||g==="series",a=h?"tv":"movie",_=t!=null?parseInt(String(t),10):1,b=r!=null?parseInt(String(r),10):1,m=await ae(e,a),A=m.numericId?String(m.numericId):e,k=(m.titles||[]).filter(p=>p&&p.trim().length>0);if(k.length===0)return C("han's 35",`TMDB ba\u015Fl\u0131\u011F\u0131 \xE7\xF6z\xFClemedi: ${e}`),[];let n=await Q("sabo");if(!n)return C("han's 35","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let f=n.replace(/^(https?:\/\/)(?:api\.)?/i,"$1").replace(/\/+$/,""),d={"User-Agent":j.DEFAULT_USER_AGENT,"Cf-Control":Se,language:"tr",site:"main",device:"browser",Origin:f,Referer:`${f}/`},c=[];for(let p of k){c.includes(p)||c.push(p);let S=p.split(":")[0].trim();S&&S.length>=3&&!c.includes(S)&&c.push(S);let y=p.split("-")[0].trim();y&&y.length>=3&&!c.includes(y)&&c.push(y)}let s=null,u="";for(let p of c)try{let S=`${n}/page/search?value=${encodeURIComponent(p)}&page=1`,y=await fetch(S,{headers:d});if(!y.ok)continue;let D=(await y.json())?.page?.data||[];for(let I of D){let z=I?.ID;if(!z)continue;let N=`${n}/anime/get?id=${z}`,B=await fetch(N,{headers:d});if(!B.ok)continue;let R=(await B.json())?.data;if(!R)continue;let G=String(R?.tmdb_id||"").trim(),U=String(R?.type||I?.type||"").toLowerCase().trim();if(!(h&&U==="movie")&&!(!h&&U==="series")&&(G===A||G===e)){s=String(z),u=R?.name||I?.name||p,C("han's 35",`[TMDB E\u015Fle\u015Fti!] ID: ${s}, \u0130sim: ${u}, T\xFCr: ${U}, TMDB: ${G}`);break}}if(s)break}catch{}if(!s)return C("han's 35",`E\u015Fle\u015Fen anime bulunamad\u0131 -> TMDB: ${e}`),[];let L=a==="tv",v=null;if(L){let p=async(y,F)=>{try{let D=`${n}/anime/source?id=${s}&site=main&plan=1&season=${y}&episode=${F}&server=1`,I=await fetch(D,{headers:d});if(I.ok){let z=await I.json();if(z&&z.success)return z}}catch{}return null};v=(await ne({providerName:"han's 35",tmdbNumericId:m.numericId,season:_,episode:b,isTv:h,minAbsoluteThreshold:100,fetcher:p,isValid:y=>!!(y&&y.success)})).data}else{let p=`${n}/anime/source?id=${s}&site=main&plan=1&server=1`,S=await fetch(p,{headers:d});S.ok&&(v=await S.json())}if(!v||!v.success)return C("han's 35",`B\xF6l\xFCm kayna\u011F\u0131 bulunamad\u0131 -> ${v?.msg||"Bilinmeyen hata"}`),[];let M=(v.subtitles||[]).map((p,S)=>{let y=String(p.group||"").toLowerCase().trim(),F=String(p.name||"").trim(),D=Ce[y]||{code:y||"tr",language:"Turkish",name:"T\xFCrk\xE7e"},I=F||D.name;return{id:String(S),url:p.link,lang:D.code,language:D.language,name:I,label:I,title:I,type:"vtt",headers:{Referer:`${f}/`,"User-Agent":j.DEFAULT_USER_AGENT}}}),P=[],q=(v.groups||[]).filter(p=>String(p?.group||"").toLowerCase().trim()!=="endub"),le=q.length>1,V=1;for(let p of q){let y=String(p.group||"").toLowerCase().trim()==="trdub",F=le?`han's 35 [${V}]`:"han's 35",D=y?"Dublaj":"Altyaz\u0131l\u0131";V++;let I=(p.items||[]).sort((z,N)=>(N.quality||0)-(z.quality||0));for(let z of I){let N=z.link;if(!N||typeof N!="string")continue;let B=parseInt(String(z.quality||1080),10),Y=B===2160?"4K UHD":B===1440?"2K QHD":B===1080?"1080p":`${B}p`,R=z.type==="hls"||N.includes(".m3u8");P.push(se({name:F,url:N,languageTitle:D,quality:Y,format:R?"m3u8":"mp4",subtitles:y?[]:M,headers:{Referer:`${f}/`,"User-Agent":j.DEFAULT_USER_AGENT}}))}}let re=((Date.now()-l)/1e3).toFixed(2);return C("han's 35",`[Ad\u0131m 4/4] TAMAMLANDI: ${P.length} adet ak\u0131\u015F listelendi (${re}s)`,"success",P.map(p=>({server:p.name,kalite:p.quality,title:p.title}))),P}catch(e){return C("han's 35",`Hata olu\u015Ftu: ${e?.message||e}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=oe);

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

;(()=>{const n="han's 35",g=typeof globalThis!=="undefined"?globalThis:typeof global!=="undefined"?global:this,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;g.__HANS_CACHE__=g.__HANS_CACHE__||new Map();const c=g.__HANS_CACHE__,TTL=600000,w=async(...a)=>{let k;try{k=n+":"+JSON.stringify(a)}catch{k=null}const now=Date.now();if(k&&c.has(k)){const e=c.get(k);if(e&&now-e.t<TTL)return e.d;}let t;const tp=new Promise(res=>{t=setTimeout(()=>res([]),5500);}),ep=(async()=>{try{const r=await f(...a);if(t)clearTimeout(t);const res=Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):(r||[]);if(k&&Array.isArray(res)&&res.length>0)c.set(k,{d:res,t:Date.now()});return res;}catch{if(t)clearTimeout(t);return [];}})();return Promise.race([ep,tp]);};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports.getStreams=w;}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true});}catch(e){m.exports.getStreams=w;}}})();
