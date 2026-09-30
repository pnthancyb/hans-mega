// [HANS-SPEED-BOOST] Pre-populate domains and config state for 0ms lookup latency
var _g = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this;
var _DEFAULT_DOMAINS = {"imu":"https://ha.vixolity.com","joyboy":"https://www.hdfilmizle.best","enel":"https://selcukflix.com","crocodile":"https://dizilla.now","xebec":"https://www.fullhdfilmizlesene.now","kidd":"https://filmmakinesi.to","shiki":"https://www.hdfilmcehennemi2.biz","emeth":"https://jetfilmizle.top","garp":"https://siyahfilmizle.vip","ryuma":"https://lovefilmizle.net","rouge":"https://www.dizimom.help","kalgara":"https://dizibal.org","sakazuki":"https://dizipal2134.com","shanks":"https://filmekseni.vip","kizaru":"https://www.hdfilmcehennemi.nl","smoker":"https://dizipal1584.com","zunesha":"https://dizipal10.com.tr","oden":"https://yabanci-dizi.now","fujitora":"https://animecix.tv","lili":"https://openani.me","sabo":"https://api.anizium.co","yamato":"https://deokwave.com","shamrock":"https://animezer.com","bogard":"https://streamcorecdn.com","katakuri":"https://dizipod.com","mihawk":"https://webdramaturkey2.com","vegapunk":"https://ydfvfdizipanel.ru","clover":"https://japierdolevid.com","noland":"https://dizi75.life","kuma":"https://dizipal.bid","doflamingo":"https://asyawatch.com","dragon":"https://dizisol.com","teach":"https://ddizibox.com","roger":"https://roketdizi.life","kuzan":"https://filmizlehub.live","garling":"https://liderfilmizle.vip","rayleigh":"https://vixsrc.to","hiriluk":"https://www.showbox.media","urouge":"https://lmscript.xyz","law":"https://cinemacity.cc","gaban":"https://streamdata.vaplayer.ru","ace":"https://arc018.stream","gorosei":"https://api.speedracelight.com","makino":"https://net77.cc","saul":"https://dizilab.to","momonosuke":"https://mapple.fun","corazon":"https://dizifilmnow.com","toki":"https://diziroom.com","kaido":"https://vidlink.pro"};
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

"use strict";var S=Object.defineProperty;var F=Object.getOwnPropertyDescriptor;var R=Object.getOwnPropertyNames;var O=Object.prototype.hasOwnProperty;var K=(t,e)=>{for(var n in e)S(t,n,{get:e[n],enumerable:!0})},G=(t,e,n,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of R(e))!O.call(t,i)&&i!==n&&S(t,i,{get:()=>e[i],enumerable:!(s=F(e,i))||s.enumerable});return t};var B=t=>G(S({},"__esModule",{value:!0}),t);var J={};K(J,{getStreams:()=>x});module.exports=B(J);function p(t,e,n="info",s){let i=`[${t}]`;n==="error"?console.error(i,e,s||""):n==="warn"?console.warn(i,e,s||""):console.log(i,e,s||"");try{let a=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof a=="string"&&a.startsWith("http")&&fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:t,level:n,message:e,details:s})}).catch(()=>{})}catch{}}var j=[66,94,94,90,89,16,5,5,73,78,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89,4,64,89,69,68].map(e=>String.fromCharCode(e^42)).join(""),V=[66,94,94,90,89,16,5,5,78,69,71,75,67,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89].map(e=>String.fromCharCode(e^42)).join(""),A={REMOTE_CONFIG_URL:j,FALLBACK_CONFIG_URL:V,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},I=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},N=5*60*1e3,z=15*1e3;if(!I.__NUVIO_CONFIG_STATE__){let t={},e={},n=[],s=0;try{if(typeof localStorage<"u"&&localStorage){let i=localStorage.getItem("__NUVIO_DOMAINS_CACHE_V3__");if(i){let o=JSON.parse(i);o&&typeof o.domains=="object"&&(t=o.domains,e=o.cookies||{},n=o.tmdbKeys||[],s=typeof o.time=="number"?o.time:0)}}}catch{}I.__NUVIO_CONFIG_STATE__={cachedDomains:t,cachedCookies:e,cachedTmdbKeys:n,lastFetchTime:s,activeFetchPromise:null}}var c=I.__NUVIO_CONFIG_STATE__;async function H(t=!1){let e=Date.now(),n=[];try{let i=I.__NUVIO_DEV_LOG_URL__;typeof i=="string"&&i.includes("/api/log")&&n.push(i.replace("/api/log","/domains"))}catch{}n.push(A.REMOTE_CONFIG_URL),n.push(A.FALLBACK_CONFIG_URL);let s=typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function"?AbortSignal.timeout(4e3):void 0;for(let i of n)try{let o=await fetch(i,{signal:s});if(o.ok){let a=await o.json(),l=a?.data??a,r=l.domains||l,f=l.cookies,d=l.tmdb_keys||l.tmdbKeys;r&&typeof r=="object"&&(c.cachedDomains={...c.cachedDomains,...r}),f&&typeof f=="object"&&(c.cachedCookies={...c.cachedCookies,...f}),Array.isArray(d)&&d.length>0&&(c.cachedTmdbKeys=d),c.lastFetchTime=e,c.lastFetchSource=i,p("Config",`Domainler basariyla cekildi: ${i}`,"info");try{typeof localStorage<"u"&&localStorage&&localStorage.setItem("__NUVIO_DOMAINS_CACHE_V3__",JSON.stringify({domains:c.cachedDomains,cookies:c.cachedCookies,tmdbKeys:c.cachedTmdbKeys,time:e}))}catch{}return}}catch(o){p("Config",`Domain alinamadi (${i}): ${o.message}`,"warn")}c.lastFetchTime=e-N+z}async function P(t=!1){let e=Date.now(),n=Object.keys(c.cachedDomains).length>0;(t||!n||e-c.lastFetchTime>N)&&(c.activeFetchPromise||(c.activeFetchPromise=H(t).finally(()=>{c.activeFetchPromise=null})),await c.activeFetchPromise)}async function D(t){return await P(),c.cachedDomains[t]||""}async function M(){return await P(),c.cachedTmdbKeys||[]}var W="a2f888b27315e62e471b2d587048f32e",k=[W,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function Y(t){let e=await M(),n=e.length>0?[...e,...k]:k;for(let s=0;s<n.length;s++){let i=n[s],o=t.includes("?")?"&":"?",a=`https://api.themoviedb.org/3/${t}${o}api_key=${i}`;try{let l=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,r=await fetch(a,{signal:l});if(r.ok)return await r.json();if(r.status===429)continue}catch{}}return null}var v=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};v.__NUVIO_TMDB_CACHE__||(v.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map});var C=v.__NUVIO_TMDB_CACHE__,w=C.imdbIdCache,nt=C.tmdbTitlesCache,st=C.tmdbImageCache;async function E(t,e){let n=String(t||"").replace(/^tmdb:/i,"").trim();if(!n)return null;if(n.startsWith("tt"))return n;let s=`${e}:${n}`;if(w.has(s))return w.get(s);let i=(async()=>{try{let a=await Y(`${e==="tv"||e==="series"?"tv":"movie"}/${n}/external_ids`);if(a&&a.imdb_id)return a.imdb_id}catch{}return null})();return w.set(s,i),i}function L(t,e,n,s){let i=t,o=e,a=n,l=s;typeof t=="object"&&t!==null&&!Array.isArray(t)&&(i=t.id||t.tmdbId||t.rawTmdbId||t.imdbId||"",o=t.type||t.mediaType||t.rawMediaType,a=t.season??t.seasonNum??t.rawSeasonNum,l=t.episode??t.episodeNum??t.rawEpisodeNum);let r=String(i||"").trim();r.toLowerCase().startsWith("tmdb:")&&(r=r.slice(5));let f=r.split(":"),d=f[0].trim();f.length>=3&&(a==null||a==="")&&(a=parseInt(f[1],10),l=parseInt(f[2],10));let m=String(o||"").toLowerCase().trim(),u=m==="tv"||m==="series"||m==="show"||m==="dizi",y=u?"tv":"movie",_=a!=null&&a!==""?parseInt(String(a),10):1,g=l!=null&&l!==""?parseInt(String(l),10):1;return{tmdbId:d,mediaType:y,isTv:u,season:isNaN(_)?1:_,episode:isNaN(g)?1:g,startTime:Date.now()}}async function $(t,e,n){let s=String(t||"").trim();if(s.startsWith("tt"))return s;let i=await E(s,e);return!i||!i.startsWith("tt")?(p(n,`Ge\xE7erli bir IMDb ID (tt...) bulunamad\u0131 (${t}).`,"warn"),null):i}function X(t){let e=!1,n=!1,s=!1,i=["t\xFCrk\xE7e","turkish","turkce","dublaj","tr","tur","dual","ses-tr"],o=["english","ingilizce","original","orijinal","en","eng"];if(t){let a=t.split(/\r?\n/);for(let l of a){let r=l.trim();if(r.startsWith("#EXT-X-MEDIA:")&&r.includes("TYPE=AUDIO")){let f=r.match(/NAME=["']([^"']+)["']/i),d=r.match(/LANGUAGE=["']([^"']+)["']/i),m=r.match(/GROUP-ID=["']([^"']+)["']/i),u=(f?f[1]:"").toLowerCase(),y=(d?d[1]:"").toLowerCase(),_=(m?m[1]:"").toLowerCase();i.some(g=>u.includes(g)||y===g||_.includes(g))&&(e=!0),o.some(g=>u.includes(g)||y===g||_.includes(g))&&(n=!0)}if(r.startsWith("#EXT-X-MEDIA:")&&r.includes("TYPE=SUBTITLES")){let f=r.match(/NAME=["']([^"']+)["']/i),d=r.match(/LANGUAGE=["']([^"']+)["']/i),m=(f?f[1]:"").toLowerCase(),u=(d?d[1]:"").toLowerCase();(u==="tr"||u==="tur"||u==="st"||u==="sot"||m.includes("t\xFCrk")||m.includes("sotho"))&&(s=!0)}}}return e&&n||e&&s?"Dublaj / Altyaz\u0131l\u0131":e?"Dublaj":s?"Altyaz\u0131l\u0131":"Orijinal"}async function x(t,e,n,s){let{tmdbId:i,mediaType:o,isTv:a,season:l,episode:r,startTime:f}=L(t,e,n,s);p("han's 1",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${i}, T\xFCr: ${o}, Sezon: ${l}, B\xF6l\xFCm: ${r}`);try{if(!i)return[];let d=await $(i,o,"han's 1");if(!d)return[];let m=await D("imu");if(!m)return p("han's 1","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let u="";if(a){let h=r.toString().padStart(2,"0");u=`${m}/vs/${d}/s${l}/e${h}`}else u=`${m}/vs/${d}`;p("han's 1","[Ad\u0131m 2/3] Ak\u0131\u015F sunucusu kontrol ediliyor...");let y=m.includes("vixolity.com")?"https://pl.vixolity.com/":`${m}/`,_=m.includes("vixolity.com")?"https://pl.vixolity.com":m,g={Referer:y,Origin:_,"User-Agent":A.DEFAULT_USER_AGENT},b="";try{let h=await fetch(u,{method:"GET",headers:g});if(!h.ok&&h.status!==200)return p("han's 1",`Sunucuda bu i\xE7erik mevcut de\u011Fil (HTTP ${h.status}).`,"warn"),[];b=await h.text()}catch(h){return p("han's 1",`Ba\u011Flant\u0131 kontrol\xFC ge\xE7ilemedi: ${h.message}`,"warn"),[]}if(!b||!b.includes("#EXTM3U"))return p("han's 1","Ge\xE7erli bir HLS ak\u0131\u015F\u0131 bulunamad\u0131.","warn"),[];let T=X(b),U=((Date.now()-f)/1e3).toFixed(2);return p("han's 1",`[Ad\u0131m 3/3] han's 1 ak\u0131\u015F\u0131 haz\u0131r! (${U}s)`,"success",{dil:T}),[{name:"han's 1",title:T,description:`${T}
1080p \u2022 HLS`,url:u,quality:`1080p \u2022 ${T}`,format:"m3u8",headers:g}]}catch(d){return p("han's 1",`Hata: ${d.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=x);

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

;(()=>{const n="han's 1",g=typeof globalThis!=="undefined"?globalThis:typeof global!=="undefined"?global:this,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;g.__HANS_CACHE__=g.__HANS_CACHE__||new Map();const c=g.__HANS_CACHE__,TTL=600000,w=async(...a)=>{let k;try{k=n+":"+JSON.stringify(a)}catch{k=null}const now=Date.now();if(k&&c.has(k)){const e=c.get(k);if(e&&now-e.t<TTL)return e.d;}let t;const tp=new Promise(res=>{t=setTimeout(()=>res([]),5500);}),ep=(async()=>{try{const r=await f(...a);if(t)clearTimeout(t);const res=Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):(r||[]);if(k&&Array.isArray(res)&&res.length>0)c.set(k,{d:res,t:Date.now()});return res;}catch{if(t)clearTimeout(t);return [];}})();return Promise.race([ep,tp]);};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports.getStreams=w;}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true});}catch(e){m.exports.getStreams=w;}}})();
