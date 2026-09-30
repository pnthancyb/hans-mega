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

"use strict";var x=Object.defineProperty;var he=Object.getOwnPropertyDescriptor;var fe=Object.getOwnPropertyNames;var pe=Object.prototype.hasOwnProperty;var be=(e,t)=>{for(var n in t)x(e,n,{get:t[n],enumerable:!0})},ye=(e,t,n,g)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of fe(t))!pe.call(e,o)&&o!==n&&x(e,o,{get:()=>t[o],enumerable:!(g=he(t,o))||g.enumerable});return e};var ke=e=>ye(x({},"__esModule",{value:!0}),e);var Me={};be(Me,{default:()=>Ie,getStreams:()=>M});module.exports=ke(Me);function A(e,t,n="info",g){let o=`[${e}]`;n==="error"?console.error(o,t,g||""):n==="warn"?console.warn(o,t,g||""):console.log(o,t,g||"");try{let c=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof c=="string"&&c.startsWith("http")&&fetch(c,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:n,message:t,details:g})}).catch(()=>{})}catch{}}var Te=[66,94,94,90,89,16,5,5,73,78,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89,4,64,89,69,68].map(t=>String.fromCharCode(t^42)).join(""),ve=[66,94,94,90,89,16,5,5,78,69,71,75,67,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89].map(t=>String.fromCharCode(t^42)).join(""),J={REMOTE_CONFIG_URL:Te,FALLBACK_CONFIG_URL:ve,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},j=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},Q=5*60*1e3,_e=15*1e3;if(!j.__NUVIO_CONFIG_STATE__){let e={},t={},n=[],g=0;try{if(typeof localStorage<"u"&&localStorage){let o=localStorage.getItem("__NUVIO_DOMAINS_CACHE_V3__");if(o){let i=JSON.parse(o);i&&typeof i.domains=="object"&&(e=i.domains,t=i.cookies||{},n=i.tmdbKeys||[],g=typeof i.time=="number"?i.time:0)}}}catch{}j.__NUVIO_CONFIG_STATE__={cachedDomains:e,cachedCookies:t,cachedTmdbKeys:n,lastFetchTime:g,activeFetchPromise:null}}var v=j.__NUVIO_CONFIG_STATE__;async function Ae(e=!1){let t=Date.now(),n=[];try{let o=j.__NUVIO_DEV_LOG_URL__;typeof o=="string"&&o.includes("/api/log")&&n.push(o.replace("/api/log","/domains"))}catch{}n.push(J.REMOTE_CONFIG_URL),n.push(J.FALLBACK_CONFIG_URL);let g=typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function"?AbortSignal.timeout(4e3):void 0;for(let o of n)try{let i=await fetch(o,{signal:g});if(i.ok){let c=await i.json(),m=c?.data??c,a=m.domains||m,y=m.cookies,h=m.tmdb_keys||m.tmdbKeys;a&&typeof a=="object"&&(v.cachedDomains={...v.cachedDomains,...a}),y&&typeof y=="object"&&(v.cachedCookies={...v.cachedCookies,...y}),Array.isArray(h)&&h.length>0&&(v.cachedTmdbKeys=h),v.lastFetchTime=t,v.lastFetchSource=o,A("Config",`Domainler basariyla cekildi: ${o}`,"info");try{typeof localStorage<"u"&&localStorage&&localStorage.setItem("__NUVIO_DOMAINS_CACHE_V3__",JSON.stringify({domains:v.cachedDomains,cookies:v.cachedCookies,tmdbKeys:v.cachedTmdbKeys,time:t}))}catch{}return}}catch(i){A("Config",`Domain alinamadi (${o}): ${i.message}`,"warn")}v.lastFetchTime=t-Q+_e}async function X(e=!1){let t=Date.now(),n=Object.keys(v.cachedDomains).length>0;(e||!n||t-v.lastFetchTime>Q)&&(v.activeFetchPromise||(v.activeFetchPromise=Ae(e).finally(()=>{v.activeFetchPromise=null})),await v.activeFetchPromise)}async function Z(e){return await X(),v.cachedDomains[e]||""}async function ee(){return await X(),v.cachedTmdbKeys||[]}var Se="a2f888b27315e62e471b2d587048f32e",ae=[Se,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function ne(e){let t=await ee(),n=t.length>0?[...t,...ae]:ae;for(let g=0;g<n.length;g++){let o=n[g],i=e.includes("?")?"&":"?",c=`https://api.themoviedb.org/3/${e}${i}api_key=${o}`;try{let m=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,a=await fetch(c,{signal:m});if(a.ok)return await a.json();if(a.status===429)continue}catch{}}return null}var G=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};G.__NUVIO_TMDB_CACHE__||(G.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map});var K=G.__NUVIO_TMDB_CACHE__,Fe=K.imdbIdCache,U=K.tmdbTitlesCache,Ee=K.tmdbImageCache;async function ie(e,t){let n=String(e||"").replace(/^tmdb:/i,"").trim();if(!n)return{titles:[]};let g=`${t}:${n}`;if(U.has(g))return U.get(g);let o=(async()=>{let i=[],c,m,a=[],y=[],h,u=[];try{let k=t==="tv"||t==="series",b=k?"tv":"movie";if(n.startsWith("tt")){let s=await ne(`find/${n}?external_source=imdb_id`);if(s){let p=k?s?.tv_results?.[0]:s?.movie_results?.[0];p&&(c=p.id,p.overview&&(h=p.overview))}}else c=parseInt(n,10);if(c&&!isNaN(c)){let s=await ne(`${b}/${c}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(s){if(s.overview&&(h=s.overview),s.title&&(i.push(s.title),s.title.includes(":"))){let l=s.title.split(":")[0].trim();l.length>2&&i.push(l)}if(s.name&&(i.push(s.name),s.name.includes(":"))){let l=s.name.split(":")[0].trim();l.length>2&&i.push(l)}if(s.original_title&&s.original_title!==s.title&&(i.push(s.original_title),s.original_title.includes(":"))){let l=s.original_title.split(":")[0].trim();l.length>2&&i.push(l)}if(s.original_name&&s.original_name!==s.name&&(i.push(s.original_name),s.original_name.includes(":"))){let l=s.original_name.split(":")[0].trim();l.length>2&&i.push(l)}if(s.translations?.translations&&Array.isArray(s.translations.translations))for(let l of s.translations.translations){let d=l.data?.name||l.data?.title;if(d&&typeof d=="string"&&(i.push(d),d.includes(":"))){let S=d.split(":")[0].trim();S.length>2&&i.push(S)}}let p=(s.alternative_titles?.results||s.alternative_titles?.titles||[]).map(l=>l.title).filter(Boolean);i.push(...p);let f=s.release_date||s.first_air_date;if(f&&(m=parseInt(f.split("-")[0],10)),s.genres&&Array.isArray(s.genres)&&(u=s.genres.map(l=>l.name).filter(Boolean)),s.credits?.cast&&Array.isArray(s.credits.cast)){let l=new Set;s.credits.cast.slice(0,15).forEach(d=>{d.name&&l.add(d.name),d.original_name&&l.add(d.original_name)}),a=Array.from(l)}let r=[];s.created_by&&Array.isArray(s.created_by)&&r.push(...s.created_by.map(l=>l.name).filter(Boolean)),s.credits?.crew&&Array.isArray(s.credits.crew)&&r.push(...s.credits.crew.filter(l=>l.job==="Director"||l.department==="Directing").map(l=>l.name).filter(Boolean)),y=Array.from(new Set(r))}}}catch{}return{numericId:c,titles:Array.from(new Set(i.filter(Boolean))),year:m,cast:a,creators:y,overview:h,genres:u}})();return U.set(g,o),o}var ze=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],te=["tr","tur","ota"],Ce=["english","ingilizce","original","orijinal","audio-en"],se=["en","eng","und"];function we(e,t){let n=!1,g=!1,o=[],i,c,m,a=(t||"").toLowerCase();if(a.includes("trdual")||a.includes("dual")||a.includes("trdub")||a.includes("dublaj")?(n=!0,g=!0):(a.includes("ses-tr")||a.includes("turkcedublaj")||a.includes("turkce-dublaj"))&&(n=!0),a.includes("2160p")||a.includes("4k")||a.includes("uhd")||a.includes("-2160.")?i="4K":a.includes("1080p")||a.includes("1920x1080")||a.includes("fhd")||a.includes("-1080.")?i="1080p":a.includes("720p")||a.includes("1280x720")||a.includes("hd")||a.includes("-720.")?i="720p":a.includes("480p")||a.includes("854x480")||a.includes("sd")||a.includes("-480.")?i="480p":(a.includes("360p")||a.includes("640x360")||a.includes("-360."))&&(i="360p"),a.includes("hevc")||a.includes("h265")||a.includes("x265")?c="HEVC":a.includes("av1")?c="AV1":(a.includes("h264")||a.includes("x264")||a.includes("avc"))&&(c="H.264"),a.includes("5.1")||a.includes("eac3")||a.includes("ac3")||a.includes("ddp")?m="Dolby 5.1":(a.includes("7.1")||a.includes("atmos"))&&(m="Dolby Atmos 7.1"),e&&typeof e=="string"){let h=e.split(/\r?\n/),u=0;for(let k of h){let b=k.trim();if(b.startsWith("#EXT-X-MEDIA:")&&b.includes("TYPE=AUDIO")){let s=b.match(/NAME=["']([^"']+)["']/i),p=b.match(/LANGUAGE=["']([^"']+)["']/i),f=b.match(/GROUP-ID=["']([^"']+)["']/i),r=(s?s[1]:"").toLowerCase(),l=(p?p[1]:"").toLowerCase(),d=(f?f[1]:"").toLowerCase(),S=r.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),C=d.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),w=te.includes(l)||te.some(T=>S.includes(T)||C.includes(T))||ze.some(T=>r.includes(T)||d.includes(T))||r.includes("t\xFCrk")||r.includes("turk")||d.includes("dual"),F=se.includes(l)||se.some(T=>S.includes(T)||C.includes(T))||Ce.some(T=>r.includes(T)||d.includes(T))||r.includes("orig")||r.includes("ing")||r.includes("eng");w&&(n=!0),F&&(g=!0)}if(b.startsWith("#EXT-X-MEDIA:")&&b.includes("TYPE=SUBTITLES")){let s=b.match(/URI=["']([^"']+)["']/i),p=b.match(/NAME=["']([^"']+)["']/i),f=b.match(/LANGUAGE=["']([^"']+)["']/i);if(s&&s[1]){let r=s[1];if(t&&!r.startsWith("http"))try{r=new URL(r,t).toString()}catch{}let l=p?p[1]:"Altyaz\u0131",d=f?f[1].toLowerCase():"";d==="st"||d==="sot"||l.toLowerCase().includes("sotho")||l.toLowerCase().includes("sesotho")||r.toLowerCase().includes("sub_st")?(d="tr",l="T\xFCrk\xE7e"):d||(d=l.toLowerCase().includes("t\xFCrk")?"tr":"und");let C=$(d,l);o.push({label:C.name||l,url:r,lang:C.code||d})}}if(b.startsWith("#EXT-X-STREAM-INF:")){let s=b.match(/RESOLUTION=(\d+)x(\d+)/i);if(s){let p=parseInt(s[1],10),f=parseInt(s[2],10),r=Math.min(p,f),l=Math.max(p,f),d=r>=2100||l>=3800?2160:r>=1400||l>=2500?1440:r>=1e3||l>=1900?1080:r>=700||l>=1200?720:r>=450?480:r;d>u&&(u=d)}else{let p=b.match(/NAME=["']?([^"',\s]+)["']?/i);if(p){let f=p[1].toLowerCase();f.includes("2160")||f.includes("4k")?2160>u&&(u=2160):f.includes("1440")||f.includes("2k")?1440>u&&(u=1440):f.includes("1080")?1080>u&&(u=1080):f.includes("720")&&720>u&&(u=720)}}}}u>=2160?i="4K":u>=1440?i="2K":u>=1080?i="1080p":u>=720?i="720p":u>=480&&(i="480p")}let y=n&&g||a.includes("dual")||a.includes("trdual");return{hasTurkishAudio:n,hasOriginalAudio:g,isDual:y,embeddedSubtitles:o,detectedQuality:i,detectedCodec:c,detectedAudio:m}}var I={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function $(e,t,n){let g=f=>(f||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),o=g(e||""),i=g(t||""),c=!!n||o.includes("forced")||i.includes("forced")||o.includes("zorunlu")||i.includes("zorunlu"),m=o.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),a=i.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),y=f=>{let r=f.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return c?`${r} (Zorunlu)`:r};if(m==="st"||m==="sot"||m.includes("sotho")||a.includes("sotho")||a.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:c?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let h=I[o]||I[i]||I[m]||I[a];if(!h){let f=(a+" "+m).split(/\s+/).filter(Boolean);for(let r of f)if(I[r]){h=I[r];break}}if(!h){for(let[f,r]of Object.entries(I))if(f.length>=4&&(a.includes(f)||m.includes(f))){h=r;break}}if(h)return{code:h.code,iso3:h.iso3,language:h.language,name:y(h.name)};let u=(t||e||"Altyaz\u0131").trim();u=u.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let k=u.charAt(0).toUpperCase()+u.slice(1),b=y(k),s=o&&o.length===2?o:i&&i.length===2?i:"und",p=o&&o.length===3?o:i&&i.length===3?i:"und";return{code:s,iso3:p,language:k,name:b}}function oe(e){let t=e.url?we(void 0,e.url):{},n=e.quality||e.inspection?.detectedQuality||t.detectedQuality||"1080p";n.includes("\u2022")&&(n=n.split("\u2022")[0].trim()),!n.includes("p")&&!n.includes("K")&&!n.includes("k")&&n!=="HD"&&n!=="FHD"&&n!=="SD"&&(n=`${n}p`);let g=e.subtitles||e.inspection?.subtitles,o=!!(e.inspection?.hasTurkishSubtitles||g?.some(d=>{let S=(d.lang||d.code||"").toLowerCase(),C=(d.langCode||d.iso3||"").toLowerCase(),w=(d.name||d.label||d.title||"").toLowerCase();return S==="tr"||S==="st"||C==="tur"||C==="sot"||w.includes("t\xFCrk")||w.includes("turk")||w.includes("sotho")})),i=(e.languageTitle||e.inspection?.languageTitle||"").toLowerCase().trim(),c=i.includes("dub")||i.includes("ses")||i.includes("dual")||!!t.hasTurkishAudio||!!e.inspection?.hasTurkishAudio,m=i.includes("dual")||i.includes("dub")&&(i.includes("alt")||i.includes("sub"))||c&&o,a="Orijinal";i.includes("yerli")||e.inspection?.isYerli?a="Yerli":m?a="Dublaj / Altyaz\u0131l\u0131":c?a="Dublaj":o||i.includes("alt")||i.includes("sub")?a="Altyaz\u0131l\u0131":(i.includes("orijinal")||i.includes("yabanc\u0131")||i.includes("original"))&&(a="Orijinal");let y=e.format==="m3u8"||e.url.includes(".m3u8")||e.url.includes("/master.")||e.url.includes("/hls/")||e.url.includes("/txt/"),h=e.format||(y?"m3u8":e.url.includes(".mp4")?"mp4":"m3u8"),u=h==="m3u8"?"HLS":h.toUpperCase(),k=[n],b=e.codec||e.inspection?.detectedCodec||t.detectedCodec;b&&b!=="H.264"&&k.push(b),k.push(u),e.bitrate&&k.push(e.bitrate);let s=e.audio||e.inspection?.detectedAudio||t.detectedAudio;s&&s!=="AAC 2.0"&&k.push(s);let p=e.details||k.join(" \u2022 "),f=`${a}
${p}`,r=`${n} \u2022 ${a}`,l={name:"han's 16",provider:"han's 16",title:a,description:f,url:e.url,quality:r,format:h};return e.headers&&Object.keys(e.headers).length>0&&(l.headers=e.headers),g&&g.length>0&&(l.subtitles=g),l}function le(e){return[...e].sort((t,n)=>{let g=(t.label||t.name||"").toLowerCase().includes("forced")||(t.label||t.name||"").toLowerCase().includes("zorunlu"),o=(n.label||n.name||"").toLowerCase().includes("forced")||(n.label||n.name||"").toLowerCase().includes("zorunlu"),i=t.lang==="tr"||t.lang==="tur"||t.lang==="st"||t.langCode==="tur"||t.langCode==="sot"||(t.label||t.name||"").toLowerCase().includes("t\xFCrk")||(t.label||t.name||"").toLowerCase().includes("sotho"),c=n.lang==="tr"||n.lang==="tur"||n.lang==="st"||n.langCode==="tur"||n.langCode==="sot"||(n.label||n.name||"").toLowerCase().includes("t\xFCrk")||(n.label||n.name||"").toLowerCase().includes("sotho");if(i&&c)return!g&&o?-1:g&&!o?1:0;if(i&&!c)return-1;if(!i&&c)return 1;let m=t.lang==="en"||t.lang==="eng"||t.langCode==="eng"||(t.label||t.name||"").toLowerCase().includes("ing"),a=n.lang==="en"||n.lang==="eng"||n.langCode==="eng"||(n.label||n.name||"").toLowerCase().includes("ing");if(m&&!a)return-1;if(!m&&a)return 1;let y=t.label||t.name||t.title||"",h=n.label||n.name||n.title||"";return y.localeCompare(h,"tr")})}function re(e,t,n,g){let o=e,i=t,c=n,m=g;typeof e=="object"&&e!==null&&!Array.isArray(e)&&(o=e.id||e.tmdbId||e.rawTmdbId||e.imdbId||"",i=e.type||e.mediaType||e.rawMediaType,c=e.season??e.seasonNum??e.rawSeasonNum,m=e.episode??e.episodeNum??e.rawEpisodeNum);let a=String(o||"").trim();a.toLowerCase().startsWith("tmdb:")&&(a=a.slice(5));let y=a.split(":"),h=y[0].trim();y.length>=3&&(c==null||c==="")&&(c=parseInt(y[1],10),m=parseInt(y[2],10));let u=String(i||"").toLowerCase().trim(),k=u==="tv"||u==="series"||u==="show"||u==="dizi",b=k?"tv":"movie",s=c!=null&&c!==""?parseInt(String(c),10):1,p=m!=null&&m!==""?parseInt(String(m),10):1;return{tmdbId:h,mediaType:b,isTv:k,season:isNaN(s)?1:s,episode:isNaN(p)?1:p,startTime:Date.now()}}var O="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";function Le(e){try{if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")return AbortSignal.timeout(e)}catch{}}async function M(e,t,n,g){let{tmdbId:o,mediaType:i,isTv:c,season:m,episode:a,startTime:y}=re(e,t,n,g);A("han's 16",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${o}, T\xFCr: ${i}${c?` (S${m}E${a})`:""}`);try{let h=o;if(h.startsWith("tt")){let _=await ie(h,i);_&&_.numericId&&(h=String(_.numericId))}if(!h)return A("han's 16","Ge\xE7erli bir TMDB ID bulunamad\u0131.","warn"),[];let u=await Z("bogard");if(!u)return A("han's 16","Domain not resolved","warn"),[];u=u.replace(/\/+$/,"");let k=c?`${u}/dizi/${encodeURIComponent(h)}/${m}/${a}`:`${u}/film/${encodeURIComponent(h)}/`;A("han's 16",`[Ad\u0131m 1/3] Oynat\u0131c\u0131 sayfas\u0131na ba\u011Flan\u0131l\u0131yor: ${k}`);let b={"User-Agent":O,Referer:`${u}/`,Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},s=await fetch(k,{headers:b,signal:Le(8e3)});if(!s.ok)return A("han's 16",`Oynat\u0131c\u0131 sayfas\u0131 a\xE7\u0131lamad\u0131: HTTP ${s.status}`,"warn"),[];let p=await s.text(),f=p.match(/const\s+src\s*=\s*['"]([^'"]+)['"]/);if(!f||!f[1])return A("han's 16","\u0130\xE7erik kaynakta bulunamad\u0131.","info"),[];let r=f[1],l=r.startsWith("http")?r:`${u}${r.startsWith("/")?"":"/"}${r}`,d=p.match(/const\s+videoId\s*=\s*(\d+)/),S=r.match(/[?&]id=(\d+)/),C=d?d[1]:S?S[1]:"",w=p.match(/const\s+tokenParams\s*=\s*['"]([^'"]+)['"]/),F=w?w[1]:r.includes("&token=")?r.substring(r.indexOf("&token=")):"",T=null,H=p.match(/tracksData\s*=\s*(\{[\s\S]+?\});/);if(H)try{T=JSON.parse(H[1])}catch{}let q=T&&Array.isArray(T.subtitles)?T.subtitles:[],D=[];for(let _=0;_<q.length;_++){let z=q[_];if(!z||!z.url)continue;let L=z.url;L.startsWith("http")||(L=`${u}/play.m3u8?id=${C}&p=${encodeURIComponent(z.url)}${F}`);let W=(z.name||"").trim(),ge=(z.lang||z.name||"").trim(),de=!!z.forced||W.toLowerCase().includes("forced")||L.toLowerCase().includes("forced"),B=$(ge,W,de),R=B.name;D.some(me=>me.url===L)||D.push({id:String(D.length),language:B.language,name:R,label:R,title:R,lang:B.code,langCode:B.iso3,url:L,type:"vtt",headers:{"User-Agent":O,Referer:`${u}/`}})}let Y=le(D),ce=T&&Array.isArray(T.audio)?T.audio:[],E=!1;for(let _ of ce){let z=(_.lang||"").toLowerCase(),L=(_.name||"").toLowerCase();if(z==="tur"||z==="tr"||L.includes("t\xFCrk")||L.includes("turk")){E=!0;break}}let V=Y.some(_=>_.lang==="tr"||_.langCode==="tur"),N="Orijinal";E&&V?N="Dublaj / Altyaz\u0131l\u0131":E?N="Dublaj":V&&(N="Altyaz\u0131l\u0131");let P=oe({name:"han's 16",url:l,quality:"1080p",format:"m3u8",languageTitle:N,subtitles:Y,headers:{"User-Agent":O,Referer:`${u}/`,Origin:u}}),ue=((Date.now()-y)/1e3).toFixed(2);return A("han's 16",`TAMAMLANDI: 1 ak\u0131\u015F haz\u0131rland\u0131 (${ue}s)`,"success",[{quality:P.quality,title:P.title,format:P.format}]),[P]}catch(h){return A("han's 16",`Hata olu\u015Ftu: ${h?.message||"Bilinmeyen hata"}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=M);typeof global<"u"&&(global.getStreams=M);typeof window<"u"&&(window.getStreams=M);var Ie={getStreams:M};

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

;(()=>{const n="han's 16",g=typeof globalThis!=="undefined"?globalThis:typeof global!=="undefined"?global:this,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;g.__HANS_CACHE__=g.__HANS_CACHE__||new Map();const c=g.__HANS_CACHE__,TTL=600000,w=async(...a)=>{let k;try{k=n+":"+JSON.stringify(a)}catch{k=null}const now=Date.now();if(k&&c.has(k)){const e=c.get(k);if(e&&now-e.t<TTL)return e.d;}let t;const tp=new Promise(res=>{t=setTimeout(()=>res([]),5500);}),ep=(async()=>{try{const r=await f(...a);if(t)clearTimeout(t);const res=Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):(r||[]);if(k&&Array.isArray(res)&&res.length>0)c.set(k,{d:res,t:Date.now()});return res;}catch{if(t)clearTimeout(t);return [];}})();return Promise.race([ep,tp]);};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports.getStreams=w;}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true});}catch(e){m.exports.getStreams=w;}}})();
