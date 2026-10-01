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

"use strict";var I=Object.defineProperty;var le=Object.getOwnPropertyDescriptor;var re=Object.getOwnPropertyNames;var ce=Object.prototype.hasOwnProperty;var ue=(n,s)=>{for(var t in s)I(n,t,{get:s[t],enumerable:!0})},ge=(n,s,t,c)=>{if(s&&typeof s=="object"||typeof s=="function")for(let o of re(s))!ce.call(n,o)&&o!==t&&I(n,o,{get:()=>s[o],enumerable:!(c=le(s,o))||c.enumerable});return n};var de=n=>ge(I({},"__esModule",{value:!0}),n);var ve={};ue(ve,{getStreams:()=>ie});module.exports=de(ve);function _(n,s,t="info",c){let o=`[${n}]`;t==="error"?console.error(o,s,c||""):t==="warn"?console.warn(o,s,c||""):console.log(o,s,c||"");try{let r=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof r=="string"&&r.startsWith("http")&&fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:n,level:t,message:s,details:c})}).catch(()=>{})}catch{}}var me=[66,94,94,90,89,16,5,5,73,78,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89,4,64,89,69,68].map(s=>String.fromCharCode(s^42)).join(""),he=[66,94,94,90,89,16,5,5,78,69,71,75,67,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89].map(s=>String.fromCharCode(s^42)).join(""),K={REMOTE_CONFIG_URL:me,FALLBACK_CONFIG_URL:he,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},C=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},x=5*60*1e3,fe=15*1e3;if(!C.__NUVIO_CONFIG_STATE__){let n={},s={},t=[],c=0;try{if(typeof localStorage<"u"&&localStorage){let o=localStorage.getItem("__NUVIO_DOMAINS_CACHE_V3__");if(o){let e=JSON.parse(o);e&&typeof e.domains=="object"&&(n=e.domains,s=e.cookies||{},t=e.tmdbKeys||[],c=typeof e.time=="number"?e.time:0)}}}catch{}C.__NUVIO_CONFIG_STATE__={cachedDomains:n,cachedCookies:s,cachedTmdbKeys:t,lastFetchTime:c,activeFetchPromise:null}}var T=C.__NUVIO_CONFIG_STATE__;async function pe(n=!1){let s=Date.now(),t=[];t.push(K.REMOTE_CONFIG_URL),t.push(K.FALLBACK_CONFIG_URL);try{let o=C.__NUVIO_DEV_LOG_URL__;typeof o=="string"&&o.includes("/api/log")&&t.push(o.replace("/api/log","/domains"))}catch{}let c=typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function"?AbortSignal.timeout(4e3):void 0;for(let o of t)try{let e=await fetch(o,{signal:c});if(e.ok){let r=await e.json(),g=r?.data??r,a=g.domains||g,b=g.cookies,k=g.tmdb_keys||g.tmdbKeys;a&&typeof a=="object"&&(T.cachedDomains={...a}),b&&typeof b=="object"&&(T.cachedCookies={...T.cachedCookies,...b}),Array.isArray(k)&&k.length>0&&(T.cachedTmdbKeys=k),T.lastFetchTime=s,T.lastFetchSource=o,_("Config",`Domainler basariyla cekildi: ${o}`,"info");try{typeof localStorage<"u"&&localStorage&&localStorage.setItem("__NUVIO_DOMAINS_CACHE_V3__",JSON.stringify({domains:T.cachedDomains,cookies:T.cachedCookies,tmdbKeys:T.cachedTmdbKeys,time:s}))}catch{}return}}catch(e){_("Config",`Domain alinamadi (${o}): ${e.message}`,"warn")}T.lastFetchTime=s-x+fe}async function H(n=!1){let s=Date.now(),t=Object.keys(T.cachedDomains).length>0;(n||!t||s-T.lastFetchTime>x)&&(T.activeFetchPromise||(T.activeFetchPromise=pe(n).finally(()=>{T.activeFetchPromise=null})),await T.activeFetchPromise)}async function $(n){return await H(),T.cachedDomains[n]||""}async function q(){return await H(),T.cachedTmdbKeys||[]}var be="a2f888b27315e62e471b2d587048f32e",V=[be,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function P(n){let s=await q(),t=s.length>0?[...s,...V]:V;for(let c=0;c<t.length;c++){let o=t[c],e=n.includes("?")?"&":"?",r=`https://api.themoviedb.org/3/${n}${e}api_key=${o}`;try{let g=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,a=await fetch(r,{signal:g});if(a.ok)return await a.json();if(a.status===429)continue}catch{}}return null}var N=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};N.__NUVIO_TMDB_CACHE__||(N.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map});var B=N.__NUVIO_TMDB_CACHE__,M=B.imdbIdCache,D=B.tmdbTitlesCache,Me=B.tmdbImageCache;async function Y(n,s){let t=String(n||"").replace(/^tmdb:/i,"").trim();if(!t)return null;if(t.startsWith("tt"))return t;let c=`${s}:${t}`;if(M.has(c))return M.get(c);let o=(async()=>{try{let r=await P(`${s==="tv"||s==="series"?"tv":"movie"}/${t}/external_ids`);if(r&&r.imdb_id)return r.imdb_id}catch{}return null})();return M.set(c,o),o}async function W(n,s){let t=String(n||"").replace(/^tmdb:/i,"").trim();if(!t)return{titles:[]};let c=`${s}:${t}`;if(D.has(c))return D.get(c);let o=(async()=>{let e=[],r,g,a=[],b=[],k,u=[];try{let y=s==="tv"||s==="series",h=y?"tv":"movie";if(t.startsWith("tt")){let i=await P(`find/${t}?external_source=imdb_id`);if(i){let d=y?i?.tv_results?.[0]:i?.movie_results?.[0];d&&(r=d.id,d.overview&&(k=d.overview))}}else r=parseInt(t,10);if(r&&!isNaN(r)){let i=await P(`${h}/${r}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(i){if(i.overview&&(k=i.overview),i.title&&(e.push(i.title),i.title.includes(":"))){let l=i.title.split(":")[0].trim();l.length>2&&e.push(l)}if(i.name&&(e.push(i.name),i.name.includes(":"))){let l=i.name.split(":")[0].trim();l.length>2&&e.push(l)}if(i.original_title&&i.original_title!==i.title&&(e.push(i.original_title),i.original_title.includes(":"))){let l=i.original_title.split(":")[0].trim();l.length>2&&e.push(l)}if(i.original_name&&i.original_name!==i.name&&(e.push(i.original_name),i.original_name.includes(":"))){let l=i.original_name.split(":")[0].trim();l.length>2&&e.push(l)}if(i.translations?.translations&&Array.isArray(i.translations.translations))for(let l of i.translations.translations){let f=l.data?.name||l.data?.title;if(f&&typeof f=="string"&&(e.push(f),f.includes(":"))){let S=f.split(":")[0].trim();S.length>2&&e.push(S)}}let d=(i.alternative_titles?.results||i.alternative_titles?.titles||[]).map(l=>l.title).filter(Boolean);e.push(...d);let p=i.release_date||i.first_air_date;if(p&&(g=parseInt(p.split("-")[0],10)),i.genres&&Array.isArray(i.genres)&&(u=i.genres.map(l=>l.name).filter(Boolean)),i.credits?.cast&&Array.isArray(i.credits.cast)){let l=new Set;i.credits.cast.slice(0,15).forEach(f=>{f.name&&l.add(f.name),f.original_name&&l.add(f.original_name)}),a=Array.from(l)}let m=[];i.created_by&&Array.isArray(i.created_by)&&m.push(...i.created_by.map(l=>l.name).filter(Boolean)),i.credits?.crew&&Array.isArray(i.credits.crew)&&m.push(...i.credits.crew.filter(l=>l.job==="Director"||l.department==="Directing").map(l=>l.name).filter(Boolean)),b=Array.from(new Set(m))}}}catch{}return{numericId:r,titles:Array.from(new Set(e.filter(Boolean))),year:g,cast:a,creators:b,overview:k,genres:u}})();return D.set(c,o),o}var ke=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],J=["tr","tur","ota"],ye=["english","ingilizce","original","orijinal","audio-en"],X=["en","eng","und"];function Z(n,s){let t=!1,c=!1,o=[],e,r,g,a=(s||"").toLowerCase();if(a.includes("trdual")||a.includes("dual")||a.includes("trdub")||a.includes("dublaj")?(t=!0,c=!0):(a.includes("ses-tr")||a.includes("turkcedublaj")||a.includes("turkce-dublaj"))&&(t=!0),a.includes("2160p")||a.includes("4k")||a.includes("uhd")||a.includes("-2160.")?e="4K":a.includes("1080p")||a.includes("1920x1080")||a.includes("fhd")||a.includes("-1080.")?e="1080p":a.includes("720p")||a.includes("1280x720")||a.includes("hd")||a.includes("-720.")?e="720p":a.includes("480p")||a.includes("854x480")||a.includes("sd")||a.includes("-480.")?e="480p":(a.includes("360p")||a.includes("640x360")||a.includes("-360."))&&(e="360p"),a.includes("hevc")||a.includes("h265")||a.includes("x265")?r="HEVC":a.includes("av1")?r="AV1":(a.includes("h264")||a.includes("x264")||a.includes("avc"))&&(r="H.264"),a.includes("5.1")||a.includes("eac3")||a.includes("ac3")||a.includes("ddp")?g="Dolby 5.1":(a.includes("7.1")||a.includes("atmos"))&&(g="Dolby Atmos 7.1"),n&&typeof n=="string"){let k=n.split(/\r?\n/),u=0;for(let y of k){let h=y.trim();if(h.startsWith("#EXT-X-MEDIA:")&&h.includes("TYPE=AUDIO")){let i=h.match(/NAME=["']([^"']+)["']/i),d=h.match(/LANGUAGE=["']([^"']+)["']/i),p=h.match(/GROUP-ID=["']([^"']+)["']/i),m=(i?i[1]:"").toLowerCase(),l=(d?d[1]:"").toLowerCase(),f=(p?p[1]:"").toLowerCase(),S=m.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),z=f.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),v=J.includes(l)||J.some(A=>S.includes(A)||z.includes(A))||ke.some(A=>m.includes(A)||f.includes(A))||m.includes("t\xFCrk")||m.includes("turk")||f.includes("dual"),R=X.includes(l)||X.some(A=>S.includes(A)||z.includes(A))||ye.some(A=>m.includes(A)||f.includes(A))||m.includes("orig")||m.includes("ing")||m.includes("eng");v&&(t=!0),R&&(c=!0)}if(h.startsWith("#EXT-X-MEDIA:")&&h.includes("TYPE=SUBTITLES")){let i=h.match(/URI=["']([^"']+)["']/i),d=h.match(/NAME=["']([^"']+)["']/i),p=h.match(/LANGUAGE=["']([^"']+)["']/i);if(i&&i[1]){let m=i[1];if(s&&!m.startsWith("http"))try{m=new URL(m,s).toString()}catch{}let l=d?d[1]:"Altyaz\u0131",f=p?p[1].toLowerCase():"";f==="st"||f==="sot"||l.toLowerCase().includes("sotho")||l.toLowerCase().includes("sesotho")||m.toLowerCase().includes("sub_st")?(f="tr",l="T\xFCrk\xE7e"):f||(f=l.toLowerCase().includes("t\xFCrk")?"tr":"und");let z=ee(f,l);o.push({label:z.name||l,url:m,lang:z.code||f})}}if(h.startsWith("#EXT-X-STREAM-INF:")){let i=h.match(/RESOLUTION=(\d+)x(\d+)/i);if(i){let d=parseInt(i[1],10),p=parseInt(i[2],10),m=Math.min(d,p),l=Math.max(d,p),f=m>=2100||l>=3800?2160:m>=1400||l>=2500?1440:m>=1e3||l>=1900?1080:m>=700||l>=1200?720:m>=450?480:m;f>u&&(u=f)}else{let d=h.match(/NAME=["']?([^"',\s]+)["']?/i);if(d){let p=d[1].toLowerCase();p.includes("2160")||p.includes("4k")?2160>u&&(u=2160):p.includes("1440")||p.includes("2k")?1440>u&&(u=1440):p.includes("1080")?1080>u&&(u=1080):p.includes("720")&&720>u&&(u=720)}}}}u>=2160?e="4K":u>=1440?e="2K":u>=1080?e="1080p":u>=720?e="720p":u>=480&&(e="480p")}let b=t&&c||a.includes("dual")||a.includes("trdual");return{hasTurkishAudio:t,hasOriginalAudio:c,isDual:b,embeddedSubtitles:o,detectedQuality:e,detectedCodec:r,detectedAudio:g}}function Te(n){let{hasTurkishAudio:s,hasOriginalAudio:t,isDual:c,hasSubtitles:o,hasTurkishSubtitles:e,isYerli:r,siteHint:g,defaultTitle:a}=n;if(r||g?.isYerli)return"Yerli";if(g?.label){let b=g.label.toLowerCase();if((b.includes("dub")||b.includes("t\xFCrk"))&&(b.includes("alt")||b.includes("sub")))return"Dublaj / Altyaz\u0131l\u0131";if(b.includes("dub")||b.includes("t\xFCrk\xE7e ses"))return"Dublaj";if(b.includes("alt")||b.includes("sub"))return"Altyaz\u0131l\u0131";if(b.includes("orijinal")||b.includes("original"))return"Orijinal"}return c||s&&(t||e)?"Dublaj / Altyaz\u0131l\u0131":s||g?.isDublaj?"Dublaj":e||g?.isAltyazi?"Altyaz\u0131l\u0131":a||(s?"Dublaj":"Orijinal")}var w={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function ee(n,s,t){let c=p=>(p||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),o=c(n||""),e=c(s||""),r=!!t||o.includes("forced")||e.includes("forced")||o.includes("zorunlu")||e.includes("zorunlu"),g=o.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),a=e.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),b=p=>{let m=p.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return r?`${m} (Zorunlu)`:m};if(g==="st"||g==="sot"||g.includes("sotho")||a.includes("sotho")||a.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:r?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let k=w[o]||w[e]||w[g]||w[a];if(!k){let p=(a+" "+g).split(/\s+/).filter(Boolean);for(let m of p)if(w[m]){k=w[m];break}}if(!k){for(let[p,m]of Object.entries(w))if(p.length>=4&&(a.includes(p)||g.includes(p))){k=m;break}}if(k)return{code:k.code,iso3:k.iso3,language:k.language,name:b(k.name)};let u=(s||n||"Altyaz\u0131").trim();u=u.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let y=u.charAt(0).toUpperCase()+u.slice(1),h=b(y),i=o&&o.length===2?o:e&&e.length===2?e:"und",d=o&&o.length===3?o:e&&e.length===3?e:"und";return{code:i,iso3:d,language:y,name:h}}function Q(n,s){let t=[],c=new Set,o=[...n||[],...s||[]];for(let e of o){if(!e||!e.url)continue;let r=e.url.trim();if(c.has(r))continue;c.add(r);let g=ee(e.lang,e.label||e.name||e.language),a=g.name||e.label||e.name||"Altyaz\u0131";t.push({id:String(t.length),url:r,label:a,name:a,language:g.language,lang:g.code,langCode:g.iso3,headers:e.headers})}return t}function ae(n){let{m3u8Text:s,m3u8Url:t,externalSubtitles:c,siteHint:o,defaultTitle:e}=n,r=Z(s,t),g=Q(c),a=Q(c,r.embeddedSubtitles),b=a.length>0||!!o?.isAltyazi,k=a.some(d=>d.lang==="tr"||d.lang==="st"||d.lang==="sot"||d.langCode==="tur"||d.langCode==="sot"||d.label?.toLowerCase().includes("t\xFCrk")||d.label?.toLowerCase().includes("sotho")||d.language==="Turkish"||d.language?.toLowerCase().includes("sotho")),u=r.hasTurkishAudio||!!o?.isDublaj,y=r.hasOriginalAudio,h=r.isDual||u&&(k||y),i=Te({hasTurkishAudio:u,hasOriginalAudio:y,isDual:h,hasSubtitles:b,hasTurkishSubtitles:k,isYerli:o?.isYerli,siteHint:o,defaultTitle:e});return{hasTurkishAudio:u,hasOriginalAudio:y,isDual:h,hasSubtitles:b,hasTurkishSubtitles:k,isYerli:o?.isYerli,languageTitle:i,subtitles:g,detectedQuality:r.detectedQuality,detectedCodec:r.detectedCodec,detectedAudio:r.detectedAudio}}function ne(n){let s=n.url?Z(void 0,n.url):{},t=n.quality||n.inspection?.detectedQuality||s.detectedQuality||"1080p";t.includes("\u2022")&&(t=t.split("\u2022")[0].trim()),!t.includes("p")&&!t.includes("K")&&!t.includes("k")&&t!=="HD"&&t!=="FHD"&&t!=="SD"&&(t=`${t}p`);let c=n.subtitles||n.inspection?.subtitles,o=!!(n.inspection?.hasTurkishSubtitles||c?.some(f=>{let S=(f.lang||f.code||"").toLowerCase(),z=(f.langCode||f.iso3||"").toLowerCase(),v=(f.name||f.label||f.title||"").toLowerCase();return S==="tr"||S==="st"||z==="tur"||z==="sot"||v.includes("t\xFCrk")||v.includes("turk")||v.includes("sotho")})),e=(n.languageTitle||n.inspection?.languageTitle||"").toLowerCase().trim(),r=e.includes("dub")||e.includes("ses")||e.includes("dual")||!!s.hasTurkishAudio||!!n.inspection?.hasTurkishAudio,g=e.includes("dual")||e.includes("dub")&&(e.includes("alt")||e.includes("sub"))||r&&o,a="Orijinal";e.includes("yerli")||n.inspection?.isYerli?a="Yerli":g?a="Dublaj / Altyaz\u0131l\u0131":r?a="Dublaj":o||e.includes("alt")||e.includes("sub")?a="Altyaz\u0131l\u0131":(e.includes("orijinal")||e.includes("yabanc\u0131")||e.includes("original"))&&(a="Orijinal");let b=n.format==="m3u8"||n.url.includes(".m3u8")||n.url.includes("/master.")||n.url.includes("/hls/")||n.url.includes("/txt/"),k=n.format||(b?"m3u8":n.url.includes(".mp4")?"mp4":"m3u8"),u=k==="m3u8"?"HLS":k.toUpperCase(),y=[t],h=n.codec||n.inspection?.detectedCodec||s.detectedCodec;h&&h!=="H.264"&&y.push(h),y.push(u),n.bitrate&&y.push(n.bitrate);let i=n.audio||n.inspection?.detectedAudio||s.detectedAudio;i&&i!=="AAC 2.0"&&y.push(i);let d=n.details||y.join(" \u2022 "),p=`${a}
${d}`,m=`${t} \u2022 ${a}`,l={name:"han's 9",provider:"han's 9",title:a,description:p,url:n.url,quality:m,format:k};return n.headers&&Object.keys(n.headers).length>0&&(l.headers=n.headers),c&&c.length>0&&(l.subtitles=c),l}function _e(n,s){let t=[];try{let c=n.match(/(?:tracks|baseTracks)\s*[:=]\s*\[([\s\S]*?)\]/);if(!c)return t;let e=c[1].match(/\{[\s\S]*?\}/g)||[],r=new URL(s),g=`${r.protocol}//${r.host}`;for(let a=0;a<e.length;a++){let b=e[a];if(b.toLowerCase().includes("thumbnail"))continue;let k=b.match(/file\s*:\s*["']([^"']+)["']/);if(!k)continue;let u=k[1].replace(/\\\//g,"/");u.startsWith("/")&&(u=g+u);let y=b.match(/label\s*:\s*["']([^"']+)["']/),h=y?y[1]:"T\xFCrk\xE7e";try{h=JSON.parse(`"${h}"`)}catch{}let i=h.toLowerCase().includes("turk")||h.toLowerCase().includes("t\xFCrk")||u.includes("_tr"),d=h.toLowerCase().includes("eng")||h.toLowerCase().includes("ing")||u.includes("_en");t.push({id:String(a),url:u,language:i?"Turkish":d?"English":"Turkish",name:i?"T\xFCrk\xE7e":d?"\u0130ngilizce":h,lang:i?"tur":d?"eng":"tur",label:i?"T\xFCrk\xE7e":d?"\u0130ngilizce":h,headers:{Referer:g+"/",Origin:g,"User-Agent":"okhttp/4.9.2"}})}}catch{}return t}async function ie(n,s,t,c){let o=Date.now();_("han's 9",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${n}, T\xFCr: ${s}`);try{let e=String(n||"").trim(),r=String(s||"").toLowerCase().trim();if(r==="tv"||r==="series"||r==="show")return _("han's 9","han's 9 kayna\u011F\u0131 sadece filmleri destekler (Dizi atland\u0131).","info"),[];if(!e)return[];_("han's 9",`[Ad\u0131m 1/4] IMDb ID \xE7\xF6z\xFCmleniyor (${e})...`);let a=await Y(e,"movie"),k=(await W(e,"movie"))?.titles?.[0]||"Film";if(!a)return _("han's 9",`IMDb ID bulunamad\u0131: ${e}`,"error"),[];let u=await $("garp");if(!u)return _("han's 9","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let y={"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",Referer:u+"/",Origin:u,"X-Requested-With":"XMLHttpRequest"};_("han's 9",`[Ad\u0131m 2/4] Kesin IMDb aramas\u0131 yap\u0131l\u0131yor (${a})...`);let h=`${u}/wp-admin/admin-ajax.php`,i=`action=live_search&keyword=${encodeURIComponent(a)}`,p=await(await fetch(h,{method:"POST",headers:y,body:i})).text(),m=p.match(/<a\b[^>]*href=["']([^"']+)["']/i)||p.match(/href=["'](https?:\/\/[^"']+)["']/i);if(!m)return _("han's 9",`${a} ile e\u015Fle\u015Fen film bulunamad\u0131.`,"warn"),[];let l=m[1];_("han's 9",`Film bulundu: "${k}"`,"success"),_("han's 9","[Ad\u0131m 3/4] Video oynat\u0131c\u0131 \xE7\xF6z\xFCmleniyor...");let S=await(await fetch(l,{headers:{"User-Agent":y["User-Agent"],Referer:u+"/"}})).text(),z=S.match(/<iframe[^>]+(?:data-litespeed-src|data-src|src)="([^"]+)"/i)||S.match(/(?:data-litespeed-src|data-src|src)="(\/bemoly\/[^"]+)"/i);if(!z)return _("han's 9","Film sayfas\u0131nda video iframe bulunamad\u0131.","warn"),[];let v=z[1];if(v.startsWith("/")&&(v=u+v),v.includes("bemoly.php")){let E=(await(await fetch(v,{headers:{"User-Agent":y["User-Agent"],Referer:l}})).text()).match(/<iframe[^>]+src="([^"]+)"/i);E&&(v=E[1])}let A=await(await fetch(v,{headers:{"User-Agent":y["User-Agent"],Referer:l}})).text(),j=A.match(/file\s*:\s*["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/);if(!j)return _("han's 9","Video ak\u0131\u015F\u0131 \xE7\xF6z\xFCmlenemedi.","warn"),[];let F=j[1],G=_e(A,v),L=u;try{L=new URL(v).origin}catch{}let te={Referer:L+"/",Origin:L,"User-Agent":"okhttp/4.9.2"},se=A.toLowerCase().includes("dublaj")||A.toLowerCase().includes("dual"),O=ae({m3u8Url:F,externalSubtitles:G,siteHint:{isDublaj:se,isAltyazi:G.length>0}}),U=ne({name:"han's 9",url:F,inspection:O,quality:"1080p",format:"m3u8",headers:te}),oe=((Date.now()-o)/1e3).toFixed(2);return _("han's 9",`[Ad\u0131m 4/4] TAMAMLANDI: 1080p HLS ak\u0131\u015F\u0131 haz\u0131rland\u0131 (${oe}s)`,"success",{dil:U.title,altyaz\u0131lar:O.subtitles.length}),[U]}catch(e){return _("han's 9",`Kritik Hata: ${e.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=ie);

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

;(()=>{const n="han's 9",g=typeof globalThis!=="undefined"?globalThis:typeof global!=="undefined"?global:this,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;g.__HANS_CACHE__=g.__HANS_CACHE__||new Map();const c=g.__HANS_CACHE__,TTL=600000,w=async(...a)=>{let k;try{k=n+":"+JSON.stringify(a)}catch{k=null}const now=Date.now();if(k&&c.has(k)){const e=c.get(k);if(e&&now-e.t<TTL)return e.d;}let t;const tp=new Promise(res=>{t=setTimeout(()=>res([]),5500);}),ep=(async()=>{try{const r=await f(...a);if(t)clearTimeout(t);const res=Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):(r||[]);if(k&&Array.isArray(res)&&res.length>0)c.set(k,{d:res,t:Date.now()});return res;}catch{if(t)clearTimeout(t);return [];}})();return Promise.race([ep,tp]);};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports.getStreams=w;}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true});}catch(e){m.exports.getStreams=w;}}})();
