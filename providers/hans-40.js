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

"use strict";var P=Object.defineProperty;var Z=Object.getOwnPropertyDescriptor;var ee=Object.getOwnPropertyNames;var ae=Object.prototype.hasOwnProperty;var ne=(e,r)=>{for(var o in r)P(e,o,{get:r[o],enumerable:!0})},ie=(e,r,o,c)=>{if(r&&typeof r=="object"||typeof r=="function")for(let s of ee(r))!ae.call(e,s)&&s!==o&&P(e,s,{get:()=>r[s],enumerable:!(c=Z(r,s))||c.enumerable});return e};var te=e=>ie(P({},"__esModule",{value:!0}),e);var fe={};ne(fe,{getStreams:()=>X});module.exports=te(fe);function v(e,r,o="info",c){let s=`[${e}]`;o==="error"?console.error(s,r,c||""):o==="warn"?console.warn(s,r,c||""):console.log(s,r,c||"");try{let u=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof u=="string"&&u.startsWith("http")&&fetch(u,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:o,message:r,details:c})}).catch(()=>{})}catch{}}var se=[66,94,94,90,89,16,5,5,73,78,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89,4,64,89,69,68].map(r=>String.fromCharCode(r^42)).join(""),oe=[66,94,94,90,89,16,5,5,78,69,71,75,67,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89].map(r=>String.fromCharCode(r^42)).join(""),I={REMOTE_CONFIG_URL:se,FALLBACK_CONFIG_URL:oe,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},D=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},R=5*60*1e3,re=15*1e3;if(!D.__NUVIO_CONFIG_STATE__){let e={},r={},o=[],c=0;try{if(typeof localStorage<"u"&&localStorage){let s=localStorage.getItem("__NUVIO_DOMAINS_CACHE_V3__");if(s){let n=JSON.parse(s);n&&typeof n.domains=="object"&&(e=n.domains,r=n.cookies||{},o=n.tmdbKeys||[],c=typeof n.time=="number"?n.time:0)}}}catch{}D.__NUVIO_CONFIG_STATE__={cachedDomains:e,cachedCookies:r,cachedTmdbKeys:o,lastFetchTime:c,activeFetchPromise:null}}var z=D.__NUVIO_CONFIG_STATE__;async function le(e=!1){let r=Date.now(),o=[];try{let s=D.__NUVIO_DEV_LOG_URL__;typeof s=="string"&&s.includes("/api/log")&&o.push(s.replace("/api/log","/domains"))}catch{}o.push(I.REMOTE_CONFIG_URL),o.push(I.FALLBACK_CONFIG_URL);let c=typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function"?AbortSignal.timeout(4e3):void 0;for(let s of o)try{let n=await fetch(s,{signal:c});if(n.ok){let u=await n.json(),f=u?.data??u,a=f.domains||f,A=f.cookies,d=f.tmdb_keys||f.tmdbKeys;a&&typeof a=="object"&&(z.cachedDomains={...z.cachedDomains,...a}),A&&typeof A=="object"&&(z.cachedCookies={...z.cachedCookies,...A}),Array.isArray(d)&&d.length>0&&(z.cachedTmdbKeys=d),z.lastFetchTime=r,z.lastFetchSource=s,v("Config",`Domainler basariyla cekildi: ${s}`,"info");try{typeof localStorage<"u"&&localStorage&&localStorage.setItem("__NUVIO_DOMAINS_CACHE_V3__",JSON.stringify({domains:z.cachedDomains,cookies:z.cachedCookies,tmdbKeys:z.cachedTmdbKeys,time:r}))}catch{}return}}catch(n){v("Config",`Domain alinamadi (${s}): ${n.message}`,"warn")}z.lastFetchTime=r-R+re}async function x(e=!1){let r=Date.now(),o=Object.keys(z.cachedDomains).length>0;(e||!o||r-z.lastFetchTime>R)&&(z.activeFetchPromise||(z.activeFetchPromise=le(e).finally(()=>{z.activeFetchPromise=null})),await z.activeFetchPromise)}async function G(e){return await x(),z.cachedDomains[e]||""}async function K(){return await x(),z.cachedTmdbKeys||[]}var ce="a2f888b27315e62e471b2d587048f32e",O=[ce,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function E(e){let r=await K(),o=r.length>0?[...r,...O]:O;for(let c=0;c<o.length;c++){let s=o[c],n=e.includes("?")?"&":"?",u=`https://api.themoviedb.org/3/${e}${n}api_key=${s}`;try{let f=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,a=await fetch(u,{signal:f});if(a.ok)return await a.json();if(a.status===429)continue}catch{}}return null}var j=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};j.__NUVIO_TMDB_CACHE__||(j.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map});var F=j.__NUVIO_TMDB_CACHE__,U=F.imdbIdCache,B=F.tmdbTitlesCache,_e=F.tmdbImageCache;async function $(e,r){let o=String(e||"").replace(/^tmdb:/i,"").trim();if(!o)return null;if(o.startsWith("tt"))return o;let c=`${r}:${o}`;if(U.has(c))return U.get(c);let s=(async()=>{try{let u=await E(`${r==="tv"||r==="series"?"tv":"movie"}/${o}/external_ids`);if(u&&u.imdb_id)return u.imdb_id}catch{}return null})();return U.set(c,s),s}async function H(e,r){let o=String(e||"").replace(/^tmdb:/i,"").trim();if(!o)return{titles:[]};let c=`${r}:${o}`;if(B.has(c))return B.get(c);let s=(async()=>{let n=[],u,f,a=[],A=[],d,p=[];try{let S=r==="tv"||r==="series",y=S?"tv":"movie";if(o.startsWith("tt")){let i=await E(`find/${o}?external_source=imdb_id`);if(i){let b=S?i?.tv_results?.[0]:i?.movie_results?.[0];b&&(u=b.id,b.overview&&(d=b.overview))}}else u=parseInt(o,10);if(u&&!isNaN(u)){let i=await E(`${y}/${u}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(i){if(i.overview&&(d=i.overview),i.title&&(n.push(i.title),i.title.includes(":"))){let t=i.title.split(":")[0].trim();t.length>2&&n.push(t)}if(i.name&&(n.push(i.name),i.name.includes(":"))){let t=i.name.split(":")[0].trim();t.length>2&&n.push(t)}if(i.original_title&&i.original_title!==i.title&&(n.push(i.original_title),i.original_title.includes(":"))){let t=i.original_title.split(":")[0].trim();t.length>2&&n.push(t)}if(i.original_name&&i.original_name!==i.name&&(n.push(i.original_name),i.original_name.includes(":"))){let t=i.original_name.split(":")[0].trim();t.length>2&&n.push(t)}if(i.translations?.translations&&Array.isArray(i.translations.translations))for(let t of i.translations.translations){let l=t.data?.name||t.data?.title;if(l&&typeof l=="string"&&(n.push(l),l.includes(":"))){let T=l.split(":")[0].trim();T.length>2&&n.push(T)}}let b=(i.alternative_titles?.results||i.alternative_titles?.titles||[]).map(t=>t.title).filter(Boolean);n.push(...b);let m=i.release_date||i.first_air_date;if(m&&(f=parseInt(m.split("-")[0],10)),i.genres&&Array.isArray(i.genres)&&(p=i.genres.map(t=>t.name).filter(Boolean)),i.credits?.cast&&Array.isArray(i.credits.cast)){let t=new Set;i.credits.cast.slice(0,15).forEach(l=>{l.name&&t.add(l.name),l.original_name&&t.add(l.original_name)}),a=Array.from(t)}let g=[];i.created_by&&Array.isArray(i.created_by)&&g.push(...i.created_by.map(t=>t.name).filter(Boolean)),i.credits?.crew&&Array.isArray(i.credits.crew)&&g.push(...i.credits.crew.filter(t=>t.job==="Director"||t.department==="Directing").map(t=>t.name).filter(Boolean)),A=Array.from(new Set(g))}}}catch{}return{numericId:u,titles:Array.from(new Set(n.filter(Boolean))),year:f,cast:a,creators:A,overview:d,genres:p}})();return B.set(c,s),s}var ue=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],q=["tr","tur","ota"],ge=["english","ingilizce","original","orijinal","audio-en"],Y=["en","eng","und"];function de(e,r){let o=!1,c=!1,s=[],n,u,f,a=(r||"").toLowerCase();if(a.includes("trdual")||a.includes("dual")||a.includes("trdub")||a.includes("dublaj")?(o=!0,c=!0):(a.includes("ses-tr")||a.includes("turkcedublaj")||a.includes("turkce-dublaj"))&&(o=!0),a.includes("2160p")||a.includes("4k")||a.includes("uhd")||a.includes("-2160.")?n="4K":a.includes("1080p")||a.includes("1920x1080")||a.includes("fhd")||a.includes("-1080.")?n="1080p":a.includes("720p")||a.includes("1280x720")||a.includes("hd")||a.includes("-720.")?n="720p":a.includes("480p")||a.includes("854x480")||a.includes("sd")||a.includes("-480.")?n="480p":(a.includes("360p")||a.includes("640x360")||a.includes("-360."))&&(n="360p"),a.includes("hevc")||a.includes("h265")||a.includes("x265")?u="HEVC":a.includes("av1")?u="AV1":(a.includes("h264")||a.includes("x264")||a.includes("avc"))&&(u="H.264"),a.includes("5.1")||a.includes("eac3")||a.includes("ac3")||a.includes("ddp")?f="Dolby 5.1":(a.includes("7.1")||a.includes("atmos"))&&(f="Dolby Atmos 7.1"),e&&typeof e=="string"){let d=e.split(/\r?\n/),p=0;for(let S of d){let y=S.trim();if(y.startsWith("#EXT-X-MEDIA:")&&y.includes("TYPE=AUDIO")){let i=y.match(/NAME=["']([^"']+)["']/i),b=y.match(/LANGUAGE=["']([^"']+)["']/i),m=y.match(/GROUP-ID=["']([^"']+)["']/i),g=(i?i[1]:"").toLowerCase(),t=(b?b[1]:"").toLowerCase(),l=(m?m[1]:"").toLowerCase(),T=g.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),k=l.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),_=q.includes(t)||q.some(h=>T.includes(h)||k.includes(h))||ue.some(h=>g.includes(h)||l.includes(h))||g.includes("t\xFCrk")||g.includes("turk")||l.includes("dual"),C=Y.includes(t)||Y.some(h=>T.includes(h)||k.includes(h))||ge.some(h=>g.includes(h)||l.includes(h))||g.includes("orig")||g.includes("ing")||g.includes("eng");_&&(o=!0),C&&(c=!0)}if(y.startsWith("#EXT-X-MEDIA:")&&y.includes("TYPE=SUBTITLES")){let i=y.match(/URI=["']([^"']+)["']/i),b=y.match(/NAME=["']([^"']+)["']/i),m=y.match(/LANGUAGE=["']([^"']+)["']/i);if(i&&i[1]){let g=i[1];if(r&&!g.startsWith("http"))try{g=new URL(g,r).toString()}catch{}let t=b?b[1]:"Altyaz\u0131",l=m?m[1].toLowerCase():"";l==="st"||l==="sot"||t.toLowerCase().includes("sotho")||t.toLowerCase().includes("sesotho")||g.toLowerCase().includes("sub_st")?(l="tr",t="T\xFCrk\xE7e"):l||(l=t.toLowerCase().includes("t\xFCrk")?"tr":"und");let k=me(l,t);s.push({label:k.name||t,url:g,lang:k.code||l})}}if(y.startsWith("#EXT-X-STREAM-INF:")){let i=y.match(/RESOLUTION=(\d+)x(\d+)/i);if(i){let b=parseInt(i[1],10),m=parseInt(i[2],10),g=Math.min(b,m),t=Math.max(b,m),l=g>=2100||t>=3800?2160:g>=1400||t>=2500?1440:g>=1e3||t>=1900?1080:g>=700||t>=1200?720:g>=450?480:g;l>p&&(p=l)}else{let b=y.match(/NAME=["']?([^"',\s]+)["']?/i);if(b){let m=b[1].toLowerCase();m.includes("2160")||m.includes("4k")?2160>p&&(p=2160):m.includes("1440")||m.includes("2k")?1440>p&&(p=1440):m.includes("1080")?1080>p&&(p=1080):m.includes("720")&&720>p&&(p=720)}}}}p>=2160?n="4K":p>=1440?n="2K":p>=1080?n="1080p":p>=720?n="720p":p>=480&&(n="480p")}let A=o&&c||a.includes("dual")||a.includes("trdual");return{hasTurkishAudio:o,hasOriginalAudio:c,isDual:A,embeddedSubtitles:s,detectedQuality:n,detectedCodec:u,detectedAudio:f}}var w={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function me(e,r,o){let c=m=>(m||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),s=c(e||""),n=c(r||""),u=!!o||s.includes("forced")||n.includes("forced")||s.includes("zorunlu")||n.includes("zorunlu"),f=s.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),a=n.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),A=m=>{let g=m.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return u?`${g} (Zorunlu)`:g};if(f==="st"||f==="sot"||f.includes("sotho")||a.includes("sotho")||a.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:u?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let d=w[s]||w[n]||w[f]||w[a];if(!d){let m=(a+" "+f).split(/\s+/).filter(Boolean);for(let g of m)if(w[g]){d=w[g];break}}if(!d){for(let[m,g]of Object.entries(w))if(m.length>=4&&(a.includes(m)||f.includes(m))){d=g;break}}if(d)return{code:d.code,iso3:d.iso3,language:d.language,name:A(d.name)};let p=(r||e||"Altyaz\u0131").trim();p=p.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let S=p.charAt(0).toUpperCase()+p.slice(1),y=A(S),i=s&&s.length===2?s:n&&n.length===2?n:"und",b=s&&s.length===3?s:n&&n.length===3?n:"und";return{code:i,iso3:b,language:S,name:y}}function V(e){let r=e.url?de(void 0,e.url):{},o=e.quality||e.inspection?.detectedQuality||r.detectedQuality||"1080p";o.includes("\u2022")&&(o=o.split("\u2022")[0].trim()),!o.includes("p")&&!o.includes("K")&&!o.includes("k")&&o!=="HD"&&o!=="FHD"&&o!=="SD"&&(o=`${o}p`);let c=e.subtitles||e.inspection?.subtitles,s=!!(e.inspection?.hasTurkishSubtitles||c?.some(l=>{let T=(l.lang||l.code||"").toLowerCase(),k=(l.langCode||l.iso3||"").toLowerCase(),_=(l.name||l.label||l.title||"").toLowerCase();return T==="tr"||T==="st"||k==="tur"||k==="sot"||_.includes("t\xFCrk")||_.includes("turk")||_.includes("sotho")})),n=(e.languageTitle||e.inspection?.languageTitle||"").toLowerCase().trim(),u=n.includes("dub")||n.includes("ses")||n.includes("dual")||!!r.hasTurkishAudio||!!e.inspection?.hasTurkishAudio,f=n.includes("dual")||n.includes("dub")&&(n.includes("alt")||n.includes("sub"))||u&&s,a="Orijinal";n.includes("yerli")||e.inspection?.isYerli?a="Yerli":f?a="Dublaj / Altyaz\u0131l\u0131":u?a="Dublaj":s||n.includes("alt")||n.includes("sub")?a="Altyaz\u0131l\u0131":(n.includes("orijinal")||n.includes("yabanc\u0131")||n.includes("original"))&&(a="Orijinal");let A=e.format==="m3u8"||e.url.includes(".m3u8")||e.url.includes("/master.")||e.url.includes("/hls/")||e.url.includes("/txt/"),d=e.format||(A?"m3u8":e.url.includes(".mp4")?"mp4":"m3u8"),p=d==="m3u8"?"HLS":d.toUpperCase(),S=[o],y=e.codec||e.inspection?.detectedCodec||r.detectedCodec;y&&y!=="H.264"&&S.push(y),S.push(p),e.bitrate&&S.push(e.bitrate);let i=e.audio||e.inspection?.detectedAudio||r.detectedAudio;i&&i!=="AAC 2.0"&&S.push(i);let b=e.details||S.join(" \u2022 "),m=`${a}
${b}`,g=`${o} \u2022 ${a}`,t={name:"han's 40",provider:"han's 40",title:a,description:m,url:e.url,quality:g,format:d};return e.headers&&Object.keys(e.headers).length>0&&(t.headers=e.headers),c&&c.length>0&&(t.subtitles=c),t}function W(e,r,o,c){let s=e,n=r,u=o,f=c;typeof e=="object"&&e!==null&&!Array.isArray(e)&&(s=e.id||e.tmdbId||e.rawTmdbId||e.imdbId||"",n=e.type||e.mediaType||e.rawMediaType,u=e.season??e.seasonNum??e.rawSeasonNum,f=e.episode??e.episodeNum??e.rawEpisodeNum);let a=String(s||"").trim();a.toLowerCase().startsWith("tmdb:")&&(a=a.slice(5));let A=a.split(":"),d=A[0].trim();A.length>=3&&(u==null||u==="")&&(u=parseInt(A[1],10),f=parseInt(A[2],10));let p=String(n||"").toLowerCase().trim(),S=p==="tv"||p==="series"||p==="show"||p==="dizi",y=S?"tv":"movie",i=u!=null&&u!==""?parseInt(String(u),10):1,b=f!=null&&f!==""?parseInt(String(f),10):1;return{tmdbId:d,mediaType:y,isTv:S,season:isNaN(i)?1:i,episode:isNaN(b)?1:b,startTime:Date.now()}}async function J(e,r,o){let c=String(e||"").trim();if(c.startsWith("tt"))return c;let s=await $(c,r);return!s||!s.startsWith("tt")?(v(o,`Ge\xE7erli bir IMDb ID (tt...) bulunamad\u0131 (${e}).`,"warn"),null):s}var Q=["1080p","720p","480p"];async function X(e,r,o,c){let{tmdbId:s,mediaType:n,isTv:u,season:f,episode:a,startTime:A}=W(e,r,o,c);v("han's 40",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${s}, T\xFCr: ${n}, Sezon: ${f}, B\xF6l\xFCm: ${a}`);try{if(!s)return[];v("han's 40",`[Ad\u0131m 1/3] Metadata \xE7\xF6z\xFCmleniyor (${s})...`);let d=await J(s,n,"han's 40"),p=await H(s,n),S=p?.numericId||(s.startsWith("tt")?void 0:parseInt(s,10)),y=p?.titles||[],i=await G("urouge");if(!i)return v("han's 40","Domain not resolved","warn"),[];let b=i.replace(/\/+$/,""),m={};if(u){let t=[];d&&t.push(d);for(let h of y)h&&!t.includes(h)&&t.push(h);let l=[];for(let h of t){let L=`${b}/v1/shows?filters[q]=${encodeURIComponent(h)}&expand=episodes.streams`;v("han's 40",`[Ad\u0131m 2/3] Dizi API sorgulan\u0131yor (${h})...`);try{let M=await fetch(L,{headers:{"User-Agent":I.DEFAULT_USER_AGENT,Accept:"application/json, text/plain, */*"}});if(M.ok){let N=await M.json();if(Array.isArray(N.items)&&N.items.length>0){l=N.items;break}}}catch(M){v("han's 40",`Dizi sorgu hatas\u0131: ${M}`,"warn")}}if(l.length===0)return v("han's 40",`Dizi ar\u015Fivde bulunamad\u0131: ${s}`,"info"),[];let T=d?d.replace(/^tt0*/,""):null,k=T?l.find(h=>h.imdb_id?String(h.imdb_id).replace(/^tt0*/,"")===T:!1):void 0;if(!k)return v("han's 40",`Dizi ar\u015Fivde e\u015Fle\u015Fmedi: ${s}`,"info"),[];let C=(k.episodes||[]).find(h=>Number(h.season)===f&&Number(h.episode)===a);if(!C||!C.streams||typeof C.streams!="object")return v("han's 40",`\u0130stenen b\xF6l\xFCm bulunamad\u0131 (S${f}E${a})`,"warn"),[];Object.assign(m,C.streams)}else{let t=[];for(let _ of y)_&&!t.includes(_)&&t.push(_);d&&!t.includes(d)&&t.push(d);let l=[];for(let _ of t){let C=`${b}/v1/movies?filters[q]=${encodeURIComponent(_)}&expand=streams`;v("han's 40",`[Ad\u0131m 2/3] Film API sorgulan\u0131yor (${_})...`);try{let h=await fetch(C,{headers:{"User-Agent":I.DEFAULT_USER_AGENT,Accept:"application/json, text/plain, */*"}});if(h.ok){let L=await h.json();if(Array.isArray(L.items)&&L.items.length>0){l=L.items;break}}}catch(h){v("han's 40",`Film sorgu hatas\u0131: ${h}`,"warn")}}if(l.length===0)return v("han's 40",`Film ar\u015Fivde bulunamad\u0131: ${s}`,"info"),[];let T=d?d.replace(/^tt0*/,""):null,k=S?l.find(_=>_.tmdb_prefix&&Number(_.tmdb_prefix)===Number(S)):void 0;if(!k&&T&&(k=l.find(_=>_.imdb_id?String(_.imdb_id).replace(/^tt0*/,"")===T:!1)),!k)return v("han's 40",`Film ar\u015Fivde e\u015Fle\u015Fmedi: ${s}`,"info"),[];if(!k.streams||typeof k.streams!="object")return v("han's 40","Film i\xE7in yay\u0131n ak\u0131\u015F\u0131 bulunamad\u0131.","warn"),[];Object.assign(m,k.streams)}let g=Object.keys(m);if(g.length===0)return v("han's 40","Kullan\u0131labilir ak\u0131\u015F kalitesi bulunamad\u0131.","info"),[];g.sort((t,l)=>{let T=Q.indexOf(t.toLowerCase()),k=Q.indexOf(l.toLowerCase());return T!==-1&&k!==-1?T-k:T!==-1?-1:k!==-1?1:l.localeCompare(t)});for(let t of g){let l=m[t]?.trim();if(!l||!l.startsWith("http"))continue;let T=t.includes("p")?t:`${t}p`,k=V({name:"han's 40",url:l,languageTitle:"Orijinal",quality:T,details:`${T} \u2022 HLS`,format:"m3u8",headers:{"User-Agent":I.DEFAULT_USER_AGENT}});k.type="hls";let _=[k],C=((Date.now()-A)/1e3).toFixed(2);return v("han's 40",`[Ad\u0131m 3/3] TAMAMLANDI: 1 ak\u0131\u015F haz\u0131rland\u0131 (${C}s)`,"success",_.map(h=>({title:h.title,quality:h.quality||"1080p",format:"m3u8"}))),_}return[]}catch(d){return v("han's 40",`Hata: ${d?.message||d}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=X);

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

;(()=>{const n="han's 40",g=typeof globalThis!=="undefined"?globalThis:typeof global!=="undefined"?global:this,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;g.__HANS_CACHE__=g.__HANS_CACHE__||new Map();const c=g.__HANS_CACHE__,TTL=600000,w=async(...a)=>{let k;try{k=n+":"+JSON.stringify(a)}catch{k=null}const now=Date.now();if(k&&c.has(k)){const e=c.get(k);if(e&&now-e.t<TTL)return e.d;}let t;const tp=new Promise(res=>{t=setTimeout(()=>res([]),5500);}),ep=(async()=>{try{const r=await f(...a);if(t)clearTimeout(t);const res=Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):(r||[]);if(k&&Array.isArray(res)&&res.length>0)c.set(k,{d:res,t:Date.now()});return res;}catch{if(t)clearTimeout(t);return [];}})();return Promise.race([ep,tp]);};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports.getStreams=w;}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true});}catch(e){m.exports.getStreams=w;}}})();
