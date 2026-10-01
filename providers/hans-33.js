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

"use strict";var R=Object.defineProperty;var te=Object.getOwnPropertyDescriptor;var oe=Object.getOwnPropertyNames;var se=Object.prototype.hasOwnProperty;var le=(a,s)=>{for(var t in s)R(a,t,{get:s[t],enumerable:!0})},re=(a,s,t,c)=>{if(s&&typeof s=="object"||typeof s=="function")for(let r of oe(s))!se.call(a,r)&&r!==t&&R(a,r,{get:()=>s[r],enumerable:!(c=te(s,r))||c.enumerable});return a};var ce=a=>re(R({},"__esModule",{value:!0}),a);var Te={};le(Te,{getStreams:()=>ie});module.exports=ce(Te);function k(a,s,t="info",c){let r=`[${a}]`;t==="error"?console.error(r,s,c||""):t==="warn"?console.warn(r,s,c||""):console.log(r,s,c||"");try{let m=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof m=="string"&&m.startsWith("http")&&fetch(m,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:a,level:t,message:s,details:c})}).catch(()=>{})}catch{}}var ue=[66,94,94,90,89,16,5,5,73,78,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89,4,64,89,69,68].map(s=>String.fromCharCode(s^42)).join(""),de=[66,94,94,90,89,16,5,5,78,69,71,75,67,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89].map(s=>String.fromCharCode(s^42)).join(""),G={REMOTE_CONFIG_URL:ue,FALLBACK_CONFIG_URL:de,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},B=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},x=5*60*1e3,ge=15*1e3;if(!B.__NUVIO_CONFIG_STATE__){let a={},s={},t=[],c=0;try{if(typeof localStorage<"u"&&localStorage){let r=localStorage.getItem("__NUVIO_DOMAINS_CACHE_V3__");if(r){let e=JSON.parse(r);e&&typeof e.domains=="object"&&(a=e.domains,s=e.cookies||{},t=e.tmdbKeys||[],c=typeof e.time=="number"?e.time:0)}}}catch{}B.__NUVIO_CONFIG_STATE__={cachedDomains:a,cachedCookies:s,cachedTmdbKeys:t,lastFetchTime:c,activeFetchPromise:null}}var T=B.__NUVIO_CONFIG_STATE__;async function me(a=!1){let s=Date.now(),t=[];t.push(G.REMOTE_CONFIG_URL),t.push(G.FALLBACK_CONFIG_URL);try{let r=B.__NUVIO_DEV_LOG_URL__;typeof r=="string"&&r.includes("/api/log")&&t.push(r.replace("/api/log","/domains"))}catch{}let c=typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function"?AbortSignal.timeout(4e3):void 0;for(let r of t)try{let e=await fetch(r,{signal:c});if(e.ok){let m=await e.json(),p=m?.data??m,n=p.domains||p,A=p.cookies,b=p.tmdb_keys||p.tmdbKeys;n&&typeof n=="object"&&(T.cachedDomains={...n}),A&&typeof A=="object"&&(T.cachedCookies={...T.cachedCookies,...A}),Array.isArray(b)&&b.length>0&&(T.cachedTmdbKeys=b),T.lastFetchTime=s,T.lastFetchSource=r,k("Config",`Domainler basariyla cekildi: ${r}`,"info");try{typeof localStorage<"u"&&localStorage&&localStorage.setItem("__NUVIO_DOMAINS_CACHE_V3__",JSON.stringify({domains:T.cachedDomains,cookies:T.cachedCookies,tmdbKeys:T.cachedTmdbKeys,time:s}))}catch{}return}}catch(e){k("Config",`Domain alinamadi (${r}): ${e.message}`,"warn")}T.lastFetchTime=s-x+ge}async function $(a=!1){let s=Date.now(),t=Object.keys(T.cachedDomains).length>0;(a||!t||s-T.lastFetchTime>x)&&(T.activeFetchPromise||(T.activeFetchPromise=me(a).finally(()=>{T.activeFetchPromise=null})),await T.activeFetchPromise)}async function H(a){return await $(),T.cachedDomains[a]||""}async function q(a){return await $(),T.cachedCookies[a]||""}async function V(){return await $(),T.cachedTmdbKeys||[]}var he="a2f888b27315e62e471b2d587048f32e",Y=[he,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function W(a){let s=await V(),t=s.length>0?[...s,...Y]:Y;for(let c=0;c<t.length;c++){let r=t[c],e=a.includes("?")?"&":"?",m=`https://api.themoviedb.org/3/${a}${e}api_key=${r}`;try{let p=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,n=await fetch(m,{signal:p});if(n.ok)return await n.json();if(n.status===429)continue}catch{}}return null}var U=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};U.__NUVIO_TMDB_CACHE__||(U.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map});var K=U.__NUVIO_TMDB_CACHE__,Ce=K.imdbIdCache,O=K.tmdbTitlesCache,we=K.tmdbImageCache;async function J(a,s){let t=String(a||"").replace(/^tmdb:/i,"").trim();if(!t)return{titles:[]};let c=`${s}:${t}`;if(O.has(c))return O.get(c);let r=(async()=>{let e=[],m,p,n=[],A=[],b,h=[];try{let v=s==="tv"||s==="series",f=v?"tv":"movie";if(t.startsWith("tt")){let i=await W(`find/${t}?external_source=imdb_id`);if(i){let y=v?i?.tv_results?.[0]:i?.movie_results?.[0];y&&(m=y.id,y.overview&&(b=y.overview))}}else m=parseInt(t,10);if(m&&!isNaN(m)){let i=await W(`${f}/${m}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(i){if(i.overview&&(b=i.overview),i.title&&(e.push(i.title),i.title.includes(":"))){let l=i.title.split(":")[0].trim();l.length>2&&e.push(l)}if(i.name&&(e.push(i.name),i.name.includes(":"))){let l=i.name.split(":")[0].trim();l.length>2&&e.push(l)}if(i.original_title&&i.original_title!==i.title&&(e.push(i.original_title),i.original_title.includes(":"))){let l=i.original_title.split(":")[0].trim();l.length>2&&e.push(l)}if(i.original_name&&i.original_name!==i.name&&(e.push(i.original_name),i.original_name.includes(":"))){let l=i.original_name.split(":")[0].trim();l.length>2&&e.push(l)}if(i.translations?.translations&&Array.isArray(i.translations.translations))for(let l of i.translations.translations){let d=l.data?.name||l.data?.title;if(d&&typeof d=="string"&&(e.push(d),d.includes(":"))){let S=d.split(":")[0].trim();S.length>2&&e.push(S)}}let y=(i.alternative_titles?.results||i.alternative_titles?.titles||[]).map(l=>l.title).filter(Boolean);e.push(...y);let u=i.release_date||i.first_air_date;if(u&&(p=parseInt(u.split("-")[0],10)),i.genres&&Array.isArray(i.genres)&&(h=i.genres.map(l=>l.name).filter(Boolean)),i.credits?.cast&&Array.isArray(i.credits.cast)){let l=new Set;i.credits.cast.slice(0,15).forEach(d=>{d.name&&l.add(d.name),d.original_name&&l.add(d.original_name)}),n=Array.from(l)}let o=[];i.created_by&&Array.isArray(i.created_by)&&o.push(...i.created_by.map(l=>l.name).filter(Boolean)),i.credits?.crew&&Array.isArray(i.credits.crew)&&o.push(...i.credits.crew.filter(l=>l.job==="Director"||l.department==="Directing").map(l=>l.name).filter(Boolean)),A=Array.from(new Set(o))}}}catch{}return{numericId:m,titles:Array.from(new Set(e.filter(Boolean))),year:p,cast:n,creators:A,overview:b,genres:h}})();return O.set(c,r),r}async function Q(a){let{providerName:s,season:t,episode:c,fetcher:r,isValid:e}=a;try{let m=await r(t,c);if(e(m))return{data:m,resolvedSeason:t,resolvedEpisode:c,strategy:"direct"}}catch(m){k(s,`Do\u011Frudan b\xF6l\xFCm sorgusu hatas\u0131 (S${t}E${c}): ${m?.message||m}`,"warn")}return{data:null,resolvedSeason:t,resolvedEpisode:c,strategy:"none"}}var fe=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],X=["tr","tur","ota"],pe=["english","ingilizce","original","orijinal","audio-en"],Z=["en","eng","und"];function be(a,s){let t=!1,c=!1,r=[],e,m,p,n=(s||"").toLowerCase();if(n.includes("trdual")||n.includes("dual")||n.includes("trdub")||n.includes("dublaj")?(t=!0,c=!0):(n.includes("ses-tr")||n.includes("turkcedublaj")||n.includes("turkce-dublaj"))&&(t=!0),n.includes("2160p")||n.includes("4k")||n.includes("uhd")||n.includes("-2160.")?e="4K":n.includes("1080p")||n.includes("1920x1080")||n.includes("fhd")||n.includes("-1080.")?e="1080p":n.includes("720p")||n.includes("1280x720")||n.includes("hd")||n.includes("-720.")?e="720p":n.includes("480p")||n.includes("854x480")||n.includes("sd")||n.includes("-480.")?e="480p":(n.includes("360p")||n.includes("640x360")||n.includes("-360."))&&(e="360p"),n.includes("hevc")||n.includes("h265")||n.includes("x265")?m="HEVC":n.includes("av1")?m="AV1":(n.includes("h264")||n.includes("x264")||n.includes("avc"))&&(m="H.264"),n.includes("5.1")||n.includes("eac3")||n.includes("ac3")||n.includes("ddp")?p="Dolby 5.1":(n.includes("7.1")||n.includes("atmos"))&&(p="Dolby Atmos 7.1"),a&&typeof a=="string"){let b=a.split(/\r?\n/),h=0;for(let v of b){let f=v.trim();if(f.startsWith("#EXT-X-MEDIA:")&&f.includes("TYPE=AUDIO")){let i=f.match(/NAME=["']([^"']+)["']/i),y=f.match(/LANGUAGE=["']([^"']+)["']/i),u=f.match(/GROUP-ID=["']([^"']+)["']/i),o=(i?i[1]:"").toLowerCase(),l=(y?y[1]:"").toLowerCase(),d=(u?u[1]:"").toLowerCase(),S=o.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),I=d.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),C=X.includes(l)||X.some(g=>S.includes(g)||I.includes(g))||fe.some(g=>o.includes(g)||d.includes(g))||o.includes("t\xFCrk")||o.includes("turk")||d.includes("dual"),N=Z.includes(l)||Z.some(g=>S.includes(g)||I.includes(g))||pe.some(g=>o.includes(g)||d.includes(g))||o.includes("orig")||o.includes("ing")||o.includes("eng");C&&(t=!0),N&&(c=!0)}if(f.startsWith("#EXT-X-MEDIA:")&&f.includes("TYPE=SUBTITLES")){let i=f.match(/URI=["']([^"']+)["']/i),y=f.match(/NAME=["']([^"']+)["']/i),u=f.match(/LANGUAGE=["']([^"']+)["']/i);if(i&&i[1]){let o=i[1];if(s&&!o.startsWith("http"))try{o=new URL(o,s).toString()}catch{}let l=y?y[1]:"Altyaz\u0131",d=u?u[1].toLowerCase():"";d==="st"||d==="sot"||l.toLowerCase().includes("sotho")||l.toLowerCase().includes("sesotho")||o.toLowerCase().includes("sub_st")?(d="tr",l="T\xFCrk\xE7e"):d||(d=l.toLowerCase().includes("t\xFCrk")?"tr":"und");let I=ke(d,l);r.push({label:I.name||l,url:o,lang:I.code||d})}}if(f.startsWith("#EXT-X-STREAM-INF:")){let i=f.match(/RESOLUTION=(\d+)x(\d+)/i);if(i){let y=parseInt(i[1],10),u=parseInt(i[2],10),o=Math.min(y,u),l=Math.max(y,u),d=o>=2100||l>=3800?2160:o>=1400||l>=2500?1440:o>=1e3||l>=1900?1080:o>=700||l>=1200?720:o>=450?480:o;d>h&&(h=d)}else{let y=f.match(/NAME=["']?([^"',\s]+)["']?/i);if(y){let u=y[1].toLowerCase();u.includes("2160")||u.includes("4k")?2160>h&&(h=2160):u.includes("1440")||u.includes("2k")?1440>h&&(h=1440):u.includes("1080")?1080>h&&(h=1080):u.includes("720")&&720>h&&(h=720)}}}}h>=2160?e="4K":h>=1440?e="2K":h>=1080?e="1080p":h>=720?e="720p":h>=480&&(e="480p")}let A=t&&c||n.includes("dual")||n.includes("trdual");return{hasTurkishAudio:t,hasOriginalAudio:c,isDual:A,embeddedSubtitles:r,detectedQuality:e,detectedCodec:m,detectedAudio:p}}var j={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function ke(a,s,t){let c=u=>(u||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),r=c(a||""),e=c(s||""),m=!!t||r.includes("forced")||e.includes("forced")||r.includes("zorunlu")||e.includes("zorunlu"),p=r.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),n=e.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),A=u=>{let o=u.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return m?`${o} (Zorunlu)`:o};if(p==="st"||p==="sot"||p.includes("sotho")||n.includes("sotho")||n.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:m?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let b=j[r]||j[e]||j[p]||j[n];if(!b){let u=(n+" "+p).split(/\s+/).filter(Boolean);for(let o of u)if(j[o]){b=j[o];break}}if(!b){for(let[u,o]of Object.entries(j))if(u.length>=4&&(n.includes(u)||p.includes(u))){b=o;break}}if(b)return{code:b.code,iso3:b.iso3,language:b.language,name:A(b.name)};let h=(s||a||"Altyaz\u0131").trim();h=h.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let v=h.charAt(0).toUpperCase()+h.slice(1),f=A(v),i=r&&r.length===2?r:e&&e.length===2?e:"und",y=r&&r.length===3?r:e&&e.length===3?e:"und";return{code:i,iso3:y,language:v,name:f}}function ee(a){let s=a.url?be(void 0,a.url):{},t=a.quality||a.inspection?.detectedQuality||s.detectedQuality||"1080p";t.includes("\u2022")&&(t=t.split("\u2022")[0].trim()),!t.includes("p")&&!t.includes("K")&&!t.includes("k")&&t!=="HD"&&t!=="FHD"&&t!=="SD"&&(t=`${t}p`);let c=a.subtitles||a.inspection?.subtitles,r=!!(a.inspection?.hasTurkishSubtitles||c?.some(d=>{let S=(d.lang||d.code||"").toLowerCase(),I=(d.langCode||d.iso3||"").toLowerCase(),C=(d.name||d.label||d.title||"").toLowerCase();return S==="tr"||S==="st"||I==="tur"||I==="sot"||C.includes("t\xFCrk")||C.includes("turk")||C.includes("sotho")})),e=(a.languageTitle||a.inspection?.languageTitle||"").toLowerCase().trim(),m=e.includes("dub")||e.includes("ses")||e.includes("dual")||!!s.hasTurkishAudio||!!a.inspection?.hasTurkishAudio,p=e.includes("dual")||e.includes("dub")&&(e.includes("alt")||e.includes("sub"))||m&&r,n="Orijinal";e.includes("yerli")||a.inspection?.isYerli?n="Yerli":p?n="Dublaj / Altyaz\u0131l\u0131":m?n="Dublaj":r||e.includes("alt")||e.includes("sub")?n="Altyaz\u0131l\u0131":(e.includes("orijinal")||e.includes("yabanc\u0131")||e.includes("original"))&&(n="Orijinal");let A=a.format==="m3u8"||a.url.includes(".m3u8")||a.url.includes("/master.")||a.url.includes("/hls/")||a.url.includes("/txt/"),b=a.format||(A?"m3u8":a.url.includes(".mp4")?"mp4":"m3u8"),h=b==="m3u8"?"HLS":b.toUpperCase(),v=[t],f=a.codec||a.inspection?.detectedCodec||s.detectedCodec;f&&f!=="H.264"&&v.push(f),v.push(h),a.bitrate&&v.push(a.bitrate);let i=a.audio||a.inspection?.detectedAudio||s.detectedAudio;i&&i!=="AAC 2.0"&&v.push(i);let y=a.details||v.join(" \u2022 "),u=`${n}
${y}`,o=`${t} \u2022 ${n}`,l={name:"han's 33",provider:"han's 33",title:n,description:u,url:a.url,quality:o,format:b};return a.headers&&Object.keys(a.headers).length>0&&(l.headers=a.headers),c&&c.length>0&&(l.subtitles=c),l}var ae={Accept:"application/json, text/plain, */*","Accept-Language":"en,tr;q=0.9",Cookie:"theme=Dark; null_cookie_notice=1;","User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","x-e-h":"j1stzlcwDgXT9tI0aHTBsxwdzIrlwd4vKobLjbI2Naax99OELIaH.s1SoKBwGcVH5EX2R2"},ye={"4k":2160,"2160p":2160,"1080p":1080,"720p":720,"480p":480,"360p":360};function ne(a){let s=(a||"").toLowerCase().trim();for(let[c,r]of Object.entries(ye))if(s.includes(c))return r;let t=s.match(/(\d+)p/);return t?parseInt(t[1],10):0}async function ie(a,s,t,c){let r=Date.now();k("han's 33",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${a}, T\xFCr: ${s}, Sezon: ${t}, B\xF6l\xFCm: ${c}`);try{let e=String(a||"").trim(),m=String(s||"").toLowerCase().trim(),p=m==="tv"||m==="series",n=p?"tv":"movie",A=t!=null?parseInt(String(t),10):1,b=c!=null?parseInt(String(c),10):1;if(!e)return[];k("han's 33",`[Ad\u0131m 1/4] TMDB ba\u015Fl\u0131klar\u0131 sorgulan\u0131yor (${e})...`);let h=await J(e,n),v=h.titles;if(v.length===0)return k("han's 33",`TMDB ba\u015Fl\u0131\u011F\u0131 bulunamad\u0131: ${e}`,"error"),[];k("han's 33",`Aranacak ba\u015Fl\u0131klar: [${v.join(", ")}]`,"info");let f=await H("fujitora");if(!f)return k("han's 33","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let y=await q("fujitora")||ae.Cookie,u={...ae,Cookie:y,Referer:f+"/",Origin:f},o=null;for(let g of v)try{let _=`${f}/secure/titles?query=${encodeURIComponent(g)}`,z=await fetch(_,{headers:u});if(z.status===403){k("han's 33","Cloudflare korumas\u0131 devrede (403 Forbidden / Challenge).","warn");break}if(z.ok){let w=await z.json(),L=w.pagination?.data||w.results||[];if(h.numericId&&(o=L.find(D=>Number(D.tmdb_id)===Number(h.numericId))),o){k("han's 33",` Katalog aramas\u0131nda e\u015Fle\u015Fti: ${o.name} (ID: ${o.id}, TMDB: ${o.tmdb_id})`,"success");break}}}catch{}if(!o)for(let g of v)try{let _=`${f}/secure/search/${encodeURIComponent(g)}?limit=20`,z=await fetch(_,{headers:u});if(z.status===403)break;if(z.ok){let L=(await z.json()).results||[];if(h.numericId&&(o=L.find(D=>Number(D.tmdb_id)===Number(h.numericId))),o){k("han's 33",` H\u0131zl\u0131 aramada e\u015Fle\u015Fti: ${o.name} (ID: ${o.id}, TMDB: ${o.tmdb_id})`,"success");break}}}catch{}if(!o&&h.numericId)try{let g=`${f}/secure/search/${h.numericId}?limit=20`,_=await fetch(g,{headers:u});_.ok&&(o=((await _.json()).results||[]).find(L=>Number(L.tmdb_id)===Number(h.numericId)),o&&k("han's 33",` TMDB ID ile e\u015Fle\u015Fti: ${o.name} (ID: ${o.id})`,"success"))}catch{}if(!o)return k("han's 33","E\u015Fle\u015Fen anime bulunamad\u0131 (Anime de\u011Fil veya ekli de\u011Fil).","info"),[];let l=async(g,_)=>{let z=p?`${f}/secure/titles/${o.id}?seasonNumber=${g}&episodeNumber=${_}`:`${f}/secure/titles/${o.id}?titleId=${o.id}`;try{let w=await fetch(z,{headers:u});if(!w.ok)return k("han's 33",`B\xF6l\xFCm API yan\u0131t vermedi: HTTP ${w.status}`,"warn"),[];let D=(await w.json())?.title?.videos||[],M=p?D.filter(F=>Number(F.episode_num??F.episode_number??F.episode??_)===Number(_)):D;return k("han's 33",`B\xF6l\xFCm API sonucu: Toplam ${D.length} video, E\u015Fle\u015Fen: ${M.length}`,"info"),M}catch(w){return k("han's 33",`B\xF6l\xFCm istek hatas\u0131: ${w.message}`,"error"),[]}};k("han's 33",`[Ad\u0131m 2/4] B\xF6l\xFCm kaynaklar\u0131 aran\u0131yor (Sezon: ${A}, B\xF6l\xFCm: ${b})...`);let d=await Q({providerName:"han's 33",tmdbNumericId:h.numericId,season:A,episode:b,isTv:p,minAbsoluteThreshold:100,fetcher:l,isValid:g=>Array.isArray(g)&&g.length>0}),S=d.data||[];if(b=d.resolvedEpisode,S.length===0)return k("han's 33",`B\xF6l\xFCm ${b} i\xE7in video kayna\u011F\u0131 bulunamad\u0131.`,"warn"),[];k("han's 33",`[Ad\u0131m 3/4] ${S.length} adet oynat\u0131c\u0131 bulundu. Oynat\u0131c\u0131 kaynaklar\u0131 \xE7\xF6z\xFCmleniyor...`);let I=S.filter(g=>(g.name==="Tau Video"||g.url&&g.url.includes("tau-video"))&&g.url),C=[];for(let g of I.length>0?I:S)if(g.url&&(g.url.includes("tau-video")||g.name==="Tau Video"))try{let _="https://tau-video.xyz";try{_=new URL(g.url).origin}catch{}let z=g.url.split("/").pop()?.split("?")[0];if(!z)continue;let w=`${_}/api/video/${z}`,L=await fetch(w,{headers:{"User-Agent":u["User-Agent"],Referer:g.url}});if(L.ok){let M=(await L.json()).urls||[];if(M.length>0){let F=[...M].sort((P,E)=>ne(E.label)-ne(P.label));for(let P of F){let E=P.label.toLowerCase();C.push(ee({name:"han's 33",url:P.url,languageTitle:"Altyaz\u0131l\u0131",quality:E,format:"mp4",headers:{Referer:`${_}/`,Origin:_,"User-Agent":u["User-Agent"]}}))}break}}}catch(_){k("han's 33",`Video kaynak \xE7\xF6z\xFCmleme hatas\u0131: ${_.message}`,"warn")}if(C.length===0)return k("han's 33","MP4 ak\u0131\u015F kaliteleri \xE7\xF6z\xFClemedi.","warn"),[];let N=((Date.now()-r)/1e3).toFixed(2);return k("han's 33",`[Ad\u0131m 4/4] TAMAMLANDI: ${C.length} adet MP4 kalitesi listelendi (${N}s)`,"success",C.map(g=>({kalite:g.quality,title:g.title}))),C}catch(e){return k("han's 33",`Kritik Hata: ${e.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=ie);

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

;(()=>{const n="han's 33",g=typeof globalThis!=="undefined"?globalThis:typeof global!=="undefined"?global:this,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;g.__HANS_CACHE__=g.__HANS_CACHE__||new Map();const c=g.__HANS_CACHE__,TTL=600000,w=async(...a)=>{let k;try{k=n+":"+JSON.stringify(a)}catch{k=null}const now=Date.now();if(k&&c.has(k)){const e=c.get(k);if(e&&now-e.t<TTL)return e.d;}let t;const tp=new Promise(res=>{t=setTimeout(()=>res([]),5500);}),ep=(async()=>{try{const r=await f(...a);if(t)clearTimeout(t);const res=Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):(r||[]);if(k&&Array.isArray(res)&&res.length>0)c.set(k,{d:res,t:Date.now()});return res;}catch{if(t)clearTimeout(t);return [];}})();return Promise.race([ep,tp]);};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports.getStreams=w;}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true});}catch(e){m.exports.getStreams=w;}}})();
