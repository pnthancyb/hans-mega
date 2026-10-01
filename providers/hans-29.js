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

"use strict";var F=Object.defineProperty;var te=Object.getOwnPropertyDescriptor;var se=Object.getOwnPropertyNames;var oe=Object.prototype.hasOwnProperty;var le=(a,t)=>{for(var i in t)F(a,i,{get:t[i],enumerable:!0})},re=(a,t,i,l)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of se(t))!oe.call(a,s)&&s!==i&&F(a,s,{get:()=>t[s],enumerable:!(l=te(t,s))||l.enumerable});return a};var ce=a=>re(F({},"__esModule",{value:!0}),a);var Te={};le(Te,{getStreams:()=>ae});module.exports=ce(Te);function _(a,t,i="info",l){let s=`[${a}]`;i==="error"?console.error(s,t,l||""):i==="warn"?console.warn(s,t,l||""):console.log(s,t,l||"");try{let o=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof o=="string"&&o.startsWith("http")&&fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:a,level:i,message:t,details:l})}).catch(()=>{})}catch{}}var ue=[66,94,94,90,89,16,5,5,73,78,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89,4,64,89,69,68].map(t=>String.fromCharCode(t^42)).join(""),ge=[66,94,94,90,89,16,5,5,78,69,71,75,67,68,4,67,80,70,79,70,75,68,4,73,69,71,5,78,69,71,75,67,68,89].map(t=>String.fromCharCode(t^42)).join(""),C={REMOTE_CONFIG_URL:ue,FALLBACK_CONFIG_URL:ge,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},N=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{},K=5*60*1e3,de=15*1e3;if(!N.__NUVIO_CONFIG_STATE__){let a={},t={},i=[],l=0;try{if(typeof localStorage<"u"&&localStorage){let s=localStorage.getItem("__NUVIO_DOMAINS_CACHE_V3__");if(s){let n=JSON.parse(s);n&&typeof n.domains=="object"&&(a=n.domains,t=n.cookies||{},i=n.tmdbKeys||[],l=typeof n.time=="number"?n.time:0)}}}catch{}N.__NUVIO_CONFIG_STATE__={cachedDomains:a,cachedCookies:t,cachedTmdbKeys:i,lastFetchTime:l,activeFetchPromise:null}}var v=N.__NUVIO_CONFIG_STATE__;async function me(a=!1){let t=Date.now(),i=[];i.push(C.REMOTE_CONFIG_URL),i.push(C.FALLBACK_CONFIG_URL);try{let s=N.__NUVIO_DEV_LOG_URL__;typeof s=="string"&&s.includes("/api/log")&&i.push(s.replace("/api/log","/domains"))}catch{}let l=typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function"?AbortSignal.timeout(4e3):void 0;for(let s of i)try{let n=await fetch(s,{signal:l});if(n.ok){let o=await n.json(),r=o?.data??o,e=r.domains||r,h=r.cookies,u=r.tmdb_keys||r.tmdbKeys;e&&typeof e=="object"&&(v.cachedDomains={...e}),h&&typeof h=="object"&&(v.cachedCookies={...v.cachedCookies,...h}),Array.isArray(u)&&u.length>0&&(v.cachedTmdbKeys=u),v.lastFetchTime=t,v.lastFetchSource=s,_("Config",`Domainler basariyla cekildi: ${s}`,"info");try{typeof localStorage<"u"&&localStorage&&localStorage.setItem("__NUVIO_DOMAINS_CACHE_V3__",JSON.stringify({domains:v.cachedDomains,cookies:v.cachedCookies,tmdbKeys:v.cachedTmdbKeys,time:t}))}catch{}return}}catch(n){_("Config",`Domain alinamadi (${s}): ${n.message}`,"warn")}v.lastFetchTime=t-K+de}async function $(a=!1){let t=Date.now(),i=Object.keys(v.cachedDomains).length>0;(a||!i||t-v.lastFetchTime>K)&&(v.activeFetchPromise||(v.activeFetchPromise=me(a).finally(()=>{v.activeFetchPromise=null})),await v.activeFetchPromise)}async function H(a){return await $(),v.cachedDomains[a]||""}async function q(){return await $(),v.cachedTmdbKeys||[]}var he="a2f888b27315e62e471b2d587048f32e",V=[he,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function fe(a){let t=await q(),i=t.length>0?[...t,...V]:V;for(let l=0;l<i.length;l++){let s=i[l],n=a.includes("?")?"&":"?",o=`https://api.themoviedb.org/3/${a}${n}api_key=${s}`;try{let r=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,e=await fetch(o,{signal:r});if(e.ok)return await e.json();if(e.status===429)continue}catch{}}return null}var B=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};B.__NUVIO_TMDB_CACHE__||(B.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map});var x=B.__NUVIO_TMDB_CACHE__,j=x.imdbIdCache,Le=x.tmdbTitlesCache,Ie=x.tmdbImageCache;async function Y(a,t){let i=String(a||"").replace(/^tmdb:/i,"").trim();if(!i)return null;if(i.startsWith("tt"))return i;let l=`${t}:${i}`;if(j.has(l))return j.get(l);let s=(async()=>{try{let o=await fe(`${t==="tv"||t==="series"?"tv":"movie"}/${i}/external_ids`);if(o&&o.imdb_id)return o.imdb_id}catch{}return null})();return j.set(l,s),s}var pe=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],W=["tr","tur","ota"],be=["english","ingilizce","original","orijinal","audio-en"],J=["en","eng","und"];function Q(a,t){let i=!1,l=!1,s=[],n,o,r,e=(t||"").toLowerCase();if(e.includes("trdual")||e.includes("dual")||e.includes("trdub")||e.includes("dublaj")?(i=!0,l=!0):(e.includes("ses-tr")||e.includes("turkcedublaj")||e.includes("turkce-dublaj"))&&(i=!0),e.includes("2160p")||e.includes("4k")||e.includes("uhd")||e.includes("-2160.")?n="4K":e.includes("1080p")||e.includes("1920x1080")||e.includes("fhd")||e.includes("-1080.")?n="1080p":e.includes("720p")||e.includes("1280x720")||e.includes("hd")||e.includes("-720.")?n="720p":e.includes("480p")||e.includes("854x480")||e.includes("sd")||e.includes("-480.")?n="480p":(e.includes("360p")||e.includes("640x360")||e.includes("-360."))&&(n="360p"),e.includes("hevc")||e.includes("h265")||e.includes("x265")?o="HEVC":e.includes("av1")?o="AV1":(e.includes("h264")||e.includes("x264")||e.includes("avc"))&&(o="H.264"),e.includes("5.1")||e.includes("eac3")||e.includes("ac3")||e.includes("ddp")?r="Dolby 5.1":(e.includes("7.1")||e.includes("atmos"))&&(r="Dolby Atmos 7.1"),a&&typeof a=="string"){let u=a.split(/\r?\n/),g=0;for(let A of u){let d=A.trim();if(d.startsWith("#EXT-X-MEDIA:")&&d.includes("TYPE=AUDIO")){let b=d.match(/NAME=["']([^"']+)["']/i),f=d.match(/LANGUAGE=["']([^"']+)["']/i),p=d.match(/GROUP-ID=["']([^"']+)["']/i),c=(b?b[1]:"").toLowerCase(),k=(f?f[1]:"").toLowerCase(),m=(p?p[1]:"").toLowerCase(),z=c.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),y=m.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),T=W.includes(k)||W.some(w=>z.includes(w)||y.includes(w))||pe.some(w=>c.includes(w)||m.includes(w))||c.includes("t\xFCrk")||c.includes("turk")||m.includes("dual"),L=J.includes(k)||J.some(w=>z.includes(w)||y.includes(w))||be.some(w=>c.includes(w)||m.includes(w))||c.includes("orig")||c.includes("ing")||c.includes("eng");T&&(i=!0),L&&(l=!0)}if(d.startsWith("#EXT-X-MEDIA:")&&d.includes("TYPE=SUBTITLES")){let b=d.match(/URI=["']([^"']+)["']/i),f=d.match(/NAME=["']([^"']+)["']/i),p=d.match(/LANGUAGE=["']([^"']+)["']/i);if(b&&b[1]){let c=b[1];if(t&&!c.startsWith("http"))try{c=new URL(c,t).toString()}catch{}let k=f?f[1]:"Altyaz\u0131",m=p?p[1].toLowerCase():"";m==="st"||m==="sot"||k.toLowerCase().includes("sotho")||k.toLowerCase().includes("sesotho")||c.toLowerCase().includes("sub_st")?(m="tr",k="T\xFCrk\xE7e"):m||(m=k.toLowerCase().includes("t\xFCrk")?"tr":"und");let y=Z(m,k);s.push({label:y.name||k,url:c,lang:y.code||m})}}if(d.startsWith("#EXT-X-STREAM-INF:")){let b=d.match(/RESOLUTION=(\d+)x(\d+)/i);if(b){let f=parseInt(b[1],10),p=parseInt(b[2],10),c=Math.min(f,p),k=Math.max(f,p),m=c>=2100||k>=3800?2160:c>=1400||k>=2500?1440:c>=1e3||k>=1900?1080:c>=700||k>=1200?720:c>=450?480:c;m>g&&(g=m)}else{let f=d.match(/NAME=["']?([^"',\s]+)["']?/i);if(f){let p=f[1].toLowerCase();p.includes("2160")||p.includes("4k")?2160>g&&(g=2160):p.includes("1440")||p.includes("2k")?1440>g&&(g=1440):p.includes("1080")?1080>g&&(g=1080):p.includes("720")&&720>g&&(g=720)}}}}g>=2160?n="4K":g>=1440?n="2K":g>=1080?n="1080p":g>=720?n="720p":g>=480&&(n="480p")}let h=i&&l||e.includes("dual")||e.includes("trdual");return{hasTurkishAudio:i,hasOriginalAudio:l,isDual:h,embeddedSubtitles:s,detectedQuality:n,detectedCodec:o,detectedAudio:r}}function ke(a){let{hasTurkishAudio:t,hasOriginalAudio:i,isDual:l,hasSubtitles:s,hasTurkishSubtitles:n,isYerli:o,siteHint:r,defaultTitle:e}=a;if(o||r?.isYerli)return"Yerli";if(r?.label){let h=r.label.toLowerCase();if((h.includes("dub")||h.includes("t\xFCrk"))&&(h.includes("alt")||h.includes("sub")))return"Dublaj / Altyaz\u0131l\u0131";if(h.includes("dub")||h.includes("t\xFCrk\xE7e ses"))return"Dublaj";if(h.includes("alt")||h.includes("sub"))return"Altyaz\u0131l\u0131";if(h.includes("orijinal")||h.includes("original"))return"Orijinal"}return l||t&&(i||n)?"Dublaj / Altyaz\u0131l\u0131":t||r?.isDublaj?"Dublaj":n||r?.isAltyazi?"Altyaz\u0131l\u0131":e||(t?"Dublaj":"Orijinal")}var M={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function Z(a,t,i){let l=p=>(p||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),s=l(a||""),n=l(t||""),o=!!i||s.includes("forced")||n.includes("forced")||s.includes("zorunlu")||n.includes("zorunlu"),r=s.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),e=n.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),h=p=>{let c=p.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return o?`${c} (Zorunlu)`:c};if(r==="st"||r==="sot"||r.includes("sotho")||e.includes("sotho")||e.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:o?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let u=M[s]||M[n]||M[r]||M[e];if(!u){let p=(e+" "+r).split(/\s+/).filter(Boolean);for(let c of p)if(M[c]){u=M[c];break}}if(!u){for(let[p,c]of Object.entries(M))if(p.length>=4&&(e.includes(p)||r.includes(p))){u=c;break}}if(u)return{code:u.code,iso3:u.iso3,language:u.language,name:h(u.name)};let g=(t||a||"Altyaz\u0131").trim();g=g.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let A=g.charAt(0).toUpperCase()+g.slice(1),d=h(A),b=s&&s.length===2?s:n&&n.length===2?n:"und",f=s&&s.length===3?s:n&&n.length===3?n:"und";return{code:b,iso3:f,language:A,name:d}}function X(a,t){let i=[],l=new Set,s=[...a||[],...t||[]];for(let n of s){if(!n||!n.url)continue;let o=n.url.trim();if(l.has(o))continue;l.add(o);let r=Z(n.lang,n.label||n.name||n.language),e=r.name||n.label||n.name||"Altyaz\u0131";i.push({id:String(i.length),url:o,label:e,name:e,language:r.language,lang:r.code,langCode:r.iso3,headers:n.headers})}return i}function O(a){let{m3u8Text:t,m3u8Url:i,externalSubtitles:l,siteHint:s,defaultTitle:n}=a,o=Q(t,i),r=X(l),e=X(l,o.embeddedSubtitles),h=e.length>0||!!s?.isAltyazi,u=e.some(f=>f.lang==="tr"||f.lang==="st"||f.lang==="sot"||f.langCode==="tur"||f.langCode==="sot"||f.label?.toLowerCase().includes("t\xFCrk")||f.label?.toLowerCase().includes("sotho")||f.language==="Turkish"||f.language?.toLowerCase().includes("sotho")),g=o.hasTurkishAudio||!!s?.isDublaj,A=o.hasOriginalAudio,d=o.isDual||g&&(u||A),b=ke({hasTurkishAudio:g,hasOriginalAudio:A,isDual:d,hasSubtitles:h,hasTurkishSubtitles:u,isYerli:s?.isYerli,siteHint:s,defaultTitle:n});return{hasTurkishAudio:g,hasOriginalAudio:A,isDual:d,hasSubtitles:h,hasTurkishSubtitles:u,isYerli:s?.isYerli,languageTitle:b,subtitles:r,detectedQuality:o.detectedQuality,detectedCodec:o.detectedCodec,detectedAudio:o.detectedAudio}}function ee(a){let t=a.url?Q(void 0,a.url):{},i=a.quality||a.inspection?.detectedQuality||t.detectedQuality||"1080p";i.includes("\u2022")&&(i=i.split("\u2022")[0].trim()),!i.includes("p")&&!i.includes("K")&&!i.includes("k")&&i!=="HD"&&i!=="FHD"&&i!=="SD"&&(i=`${i}p`);let l=a.subtitles||a.inspection?.subtitles,s=!!(a.inspection?.hasTurkishSubtitles||l?.some(m=>{let z=(m.lang||m.code||"").toLowerCase(),y=(m.langCode||m.iso3||"").toLowerCase(),T=(m.name||m.label||m.title||"").toLowerCase();return z==="tr"||z==="st"||y==="tur"||y==="sot"||T.includes("t\xFCrk")||T.includes("turk")||T.includes("sotho")})),n=(a.languageTitle||a.inspection?.languageTitle||"").toLowerCase().trim(),o=n.includes("dub")||n.includes("ses")||n.includes("dual")||!!t.hasTurkishAudio||!!a.inspection?.hasTurkishAudio,r=n.includes("dual")||n.includes("dub")&&(n.includes("alt")||n.includes("sub"))||o&&s,e="Orijinal";n.includes("yerli")||a.inspection?.isYerli?e="Yerli":r?e="Dublaj / Altyaz\u0131l\u0131":o?e="Dublaj":s||n.includes("alt")||n.includes("sub")?e="Altyaz\u0131l\u0131":(n.includes("orijinal")||n.includes("yabanc\u0131")||n.includes("original"))&&(e="Orijinal");let h=a.format==="m3u8"||a.url.includes(".m3u8")||a.url.includes("/master.")||a.url.includes("/hls/")||a.url.includes("/txt/"),u=a.format||(h?"m3u8":a.url.includes(".mp4")?"mp4":"m3u8"),g=u==="m3u8"?"HLS":u.toUpperCase(),A=[i],d=a.codec||a.inspection?.detectedCodec||t.detectedCodec;d&&d!=="H.264"&&A.push(d),A.push(g),a.bitrate&&A.push(a.bitrate);let b=a.audio||a.inspection?.detectedAudio||t.detectedAudio;b&&b!=="AAC 2.0"&&A.push(b);let f=a.details||A.join(" \u2022 "),p=`${e}
${f}`,c=`${i} \u2022 ${e}`,k={name:"han's 29",provider:"han's 29",title:e,description:p,url:a.url,quality:c,format:u};return a.headers&&Object.keys(a.headers).length>0&&(k.headers=a.headers),l&&l.length>0&&(k.subtitles=l),k}var S="han's 29";function ye(a,t){let i=[];if(!a)return i;let l=a.split(",");for(let s of l){let n="",o=s.trim(),r=s.match(/\[(.*?)\](.*)/);r&&(n=r[1].trim(),o=r[2].trim());let e=(n+" "+o).toLowerCase(),h=e.includes("turk")||e.includes("t\xFCrk")||e.includes("_tur.")||e.includes("tr."),u=e.includes("eng")||e.includes("ing")||e.includes("_eng.")||e.includes("en."),g=h?"tr":"en",A=h?"Turkish":u?"English":n||"English",d=h?"T\xFCrk\xE7e":u?"\u0130ngilizce":n||"\u0130ngilizce",b=o.startsWith("http")?o:t+o;i.some(f=>f.url===b)||i.push({id:String(i.length),language:A,name:d,label:d,title:d,lang:g,url:b,type:"vtt",headers:{Referer:t+"/","User-Agent":C.DEFAULT_USER_AGENT}})}return i}async function _e(a,t){try{let i=await fetch(a,{headers:{"User-Agent":C.DEFAULT_USER_AGENT,Referer:t,Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"}});if(!i.ok)return null;let l=await i.text(),s=l.match(/jwplayer\([^)]*\)\.setup\(\s*(\{[\s\S]*?\})\s*\);/);if(s)try{let T=s[1],L=T.match(/file:\s*["']([^"']+)["']/);if(L){let w=L[1].replace(/\\\//g,"/"),E="";if(w.includes("url=")){let D=w.split("url=")[1];E=decodeURIComponent(D.split("&")[0])}else w.startsWith("http")?E=w:E=new URL(w,a).toString();let U=[];for(let D of T.matchAll(/file:\s*["']([^"']+\.vtt[^"']*)["'][\s\S]*?label:\s*["']([^"']+)["']/g)){let P=D[1].replace(/\\\//g,"/"),I=D[2];try{I=JSON.parse(`"${I.replace(/"/g,'\\"')}"`)}catch{I=I.replace(/\\u([0-9a-fA-F]{4})/g,(Ae,ie)=>String.fromCharCode(parseInt(ie,16)))}let R=I.toLowerCase().includes("t\xFCrk")||I.toLowerCase().includes("tr");U.push({id:String(U.length),language:R?"Turkish":"English",name:R?"T\xFCrk\xE7e":I,label:R?"T\xFCrk\xE7e":I,title:R?"T\xFCrk\xE7e":I,lang:R?"tr":"en",url:P.startsWith("http")?P:new URL(P,a).toString(),type:"vtt",headers:{Referer:`${new URL(a).origin}/`,"User-Agent":C.DEFAULT_USER_AGENT}})}let G="";try{let D=await fetch(E,{headers:{"User-Agent":"okhttp/4.9.2",Referer:`${new URL(a).origin}/`}});D.ok&&(G=await D.text())}catch{}let ne=O({m3u8Text:G,m3u8Url:E,externalSubtitles:U});return{hlsUrl:E,inspection:ne,quality:"1080p",origin:new URL(a).origin}}}catch{}let n=l.match(/<iframe[^>]+src=["']([^"']+)["']/i);if(!n)return null;let o=n[1],r=new URL(o).origin,e=await fetch(o,{headers:{"User-Agent":C.DEFAULT_USER_AGENT,Referer:a,Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8","Sec-Fetch-Dest":"iframe","Sec-Fetch-Mode":"navigate","Sec-Fetch-Site":"cross-site"}});if(!e.ok)return null;let h=await e.text(),u=h.match(/fetch\(["'](\/dl\?[^"']+)["']\)/i);if(!u)return null;let g=h.match(/file_id['"],\s*['"](\d+)['"]/),b=[`file_id=${g?g[1]:""}`,"aff=1","ref_url=play.liderfilm.cc"].join("; "),f=r+u[1],p=await fetch(f,{headers:{"User-Agent":C.DEFAULT_USER_AGENT,Referer:o,Origin:r,Cookie:b,"X-Requested-With":"XMLHttpRequest",Accept:"application/json, text/javascript, */*; q=0.01","Sec-Fetch-Dest":"empty","Sec-Fetch-Mode":"cors","Sec-Fetch-Site":"same-origin"}});if(!p.ok)return null;let c=await p.json();if(!c||!c.url)return null;let k=[],m=h.match(/"subtitle":\s*["']([^"']+)["']/i);m&&(k=ye(m[1],r));let z="";try{let T=await fetch(c.url,{headers:{"User-Agent":"okhttp/4.9.2",Referer:r+"/",Origin:r},signal:AbortSignal.timeout?AbortSignal.timeout(4e3):void 0});T.ok&&(z=await T.text())}catch{}let y=O({m3u8Text:z,m3u8Url:c.url,externalSubtitles:k});return{hlsUrl:c.url,inspection:y,quality:"1080p",origin:r}}catch(i){return _(S,`Embed \xE7\xF6z\xFCmleme hatas\u0131: ${i.message}`,"error"),null}}async function ae(a,t,i=1,l=1){let s=Date.now();_(S,`[Ad\u0131m 1/4] Arama Ba\u015Flat\u0131ld\u0131: TMDB ID=${a}, T\xFCr=${t}, Sezon=${i}, B\xF6l\xFCm=${l}`,"info");try{let n=await Y(a,t);if(!n)return _(S,"IMDb ID bulunamad\u0131, arama iptal edildi.","warn"),[];let o=await H("garling");if(!o)return _(S,"Alan ad\u0131 dinamik olarak \xE7\xF6z\xFClemedi.","error"),[];let r=`${o}/api/search.php?q=${encodeURIComponent(n)}`;_(S,`[Ad\u0131m 2/4] IMDb ile aran\u0131yor: ${n}`,"info");let e=await fetch(r,{headers:{"User-Agent":C.DEFAULT_USER_AGENT,"X-Requested-With":"XMLHttpRequest",Referer:o+"/",Accept:"application/json, text/javascript, */*; q=0.01"}});if(!e.ok)return _(S,`Arama ba\u015Far\u0131s\u0131z: HTTP ${e.status}`,"warn"),[];let u=(await e.json())?.results||[];if(u.length===0)return _(S,"\u0130\xE7erik bulunamad\u0131 (0 sonu\xE7).","info"),[];let g=t==="tv"||t==="series",A=g?"series":"movie",d=u.find(y=>y.matched_type==="imdb_id")||u.find(y=>y.type===A)||u[0];if(!d||!d.slug)return _(S,"E\u015Fle\u015Fen i\xE7erik slug bilgisi bulunamad\u0131.","warn"),[];_(S,`[Ad\u0131m 3/4] E\u015Fle\u015Fme bulundu: "${d.title}" (${d.slug})`,"info");let b=g?`${o}/dizi/${d.slug}/sezon-${i}/bolum-${l}`:`${o}/${d.slug}`,f=await fetch(b,{headers:{"User-Agent":C.DEFAULT_USER_AGENT,Referer:o+"/",Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"}});if(!f.ok)return _(S,`Sayfa y\xFCklenemedi: HTTP ${f.status}`,"warn"),[];let c=(await f.text()).match(/window\._vs\s*=\s*['"]([^'"]+)['"]/);if(!c)return _(S,"Oynat\u0131c\u0131 verisi (_vs) bulunamad\u0131.","warn"),[];let k=[];try{let y=atob(c[1]);k=(JSON.parse(y)||[]).filter(L=>L.url&&!L.url.includes("youtube.com"))}catch(y){return _(S,`_vs verisi \xE7\xF6z\xFCmlenemedi: ${y.message}`,"error"),[]}if(k.length===0)return _(S,"Kullan\u0131labilir video oynat\u0131c\u0131 bulunamad\u0131.","warn"),[];let m=[];for(let y of k){if(!y.url)continue;_(S,`Oynat\u0131c\u0131 \xE7\xF6z\xFCmleniyor: ${y.url}`,"info");let T=await _e(y.url,b);if(T&&T.hlsUrl){let L=ee({name:S,url:T.hlsUrl,inspection:T.inspection,quality:"1080p",format:"m3u8",headers:{Referer:T.origin+"/","User-Agent":C.DEFAULT_USER_AGENT},subtitles:T.inspection?.subtitles});m.push(L);break}}if(m.length===0)return _(S,"Video ak\u0131\u015F\u0131 \xE7\xF6z\xFCmlenemedi.","warn"),[];let z=((Date.now()-s)/1e3).toFixed(2);return _(S,`[Ad\u0131m 4/4] TAMAMLANDI: ${m.length} ak\u0131\u015F haz\u0131rland\u0131 (${z}s)`,"success",{stream:m[0].url,ba\u015Fl\u0131k:m[0].title,altyaz\u0131lar:m[0].subtitles?.length||0}),m}catch(n){return _(S,`Kritik Hata: ${n.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=ae);

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

;(()=>{const n="han's 29",g=typeof globalThis!=="undefined"?globalThis:typeof global!=="undefined"?global:this,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;g.__HANS_CACHE__=g.__HANS_CACHE__||new Map();const c=g.__HANS_CACHE__,TTL=600000,w=async(...a)=>{let k;try{k=n+":"+JSON.stringify(a)}catch{k=null}const now=Date.now();if(k&&c.has(k)){const e=c.get(k);if(e&&now-e.t<TTL)return e.d;}let t;const tp=new Promise(res=>{t=setTimeout(()=>res([]),5500);}),ep=(async()=>{try{const r=await f(...a);if(t)clearTimeout(t);const res=Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):(r||[]);if(k&&Array.isArray(res)&&res.length>0)c.set(k,{d:res,t:Date.now()});return res;}catch{if(t)clearTimeout(t);return [];}})();return Promise.race([ep,tp]);};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports.getStreams=w;}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true});}catch(e){m.exports.getStreams=w;}}})();
