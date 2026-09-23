
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

"use strict";var N=Object.defineProperty;var ge=Object.getOwnPropertyDescriptor;var de=Object.getOwnPropertyNames;var me=Object.prototype.hasOwnProperty;var he=(a,t)=>{for(var o in t)N(a,o,{get:t[o],enumerable:!0})},fe=(a,t,o,l)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of de(t))!me.call(a,r)&&r!==o&&N(a,r,{get:()=>t[r],enumerable:!(l=ge(t,r))||l.enumerable});return a};var pe=a=>fe(N({},"__esModule",{value:!0}),a);var Se={};he(Se,{default:()=>Ce,getStreams:()=>oe});module.exports=pe(Se);var be=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(t=>String.fromCharCode(t^42)).join(""),ke={REMOTE_CONFIG_URL:be,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},H={imu:"https://ha.vixolity.com",kalgara:"https://dizibal.org",garling:"https://liderfilmizle.vip"},$=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};$.__NUVIO_CONFIG_STATE__||($.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var T=$.__NUVIO_CONFIG_STATE__,ye=10*60*1e3;async function q(){let a=Date.now();try{let t={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let l=AbortSignal.timeout(8e3);l&&(t.signal=l)}catch{}let o=await fetch(`${ke.REMOTE_CONFIG_URL}?_t=${a}`,t);if(o.ok){let l=await o.json(),r=l?.data??l,n=r.domains||r,c=r.cookies,u=r.tmdb_keys||r.tmdbKeys;n&&typeof n=="object"&&(T.cachedDomains={...T.cachedDomains,...n}),c&&typeof c=="object"&&(T.cachedCookies={...T.cachedCookies,...c}),Array.isArray(u)&&u.length>0&&(T.cachedTmdbKeys=u),T.lastFetchTime=a}else T.lastFetchTime=0}catch{T.lastFetchTime=0}}async function Y(){let a=Date.now();(!(Object.keys(T.cachedDomains).length>0)||a-T.lastFetchTime>ye)&&(T.activeFetchPromise||(T.activeFetchPromise=q().finally(()=>{T.activeFetchPromise=null})),await T.activeFetchPromise)}async function V(a){await Y();let t=T.cachedDomains[a]||H[a]||"";return t||(await q(),t=T.cachedDomains[a]||H[a]||""),t}async function W(){return await Y(),T.cachedTmdbKeys||[]}function S(a,t,o="info",l){let r=`[${a}]`;o==="error"?console.error(r,t,l||""):o==="warn"?console.warn(r,t,l||""):console.log(r,t,l||"");try{let c=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof c=="string"&&c.startsWith("http")&&fetch(c,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:a,level:o,message:t,details:l})}).catch(()=>{})}catch{}}var Te="a2f888b27315e62e471b2d587048f32e",J=[Te,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function Q(a){let t=await W(),o=t.length>0?[...t,...J]:J;for(let l=0;l<o.length;l++){let r=o[l],n=a.includes("?")?"&":"?",c=`https://api.themoviedb.org/3/${a}${n}api_key=${r}`;try{let u=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,e=await fetch(c,{signal:u});if(e.ok)return await e.json();if(e.status===429)continue}catch{}}return null}var F=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};F.__NUVIO_TMDB_CACHE__||(F.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var P=F.__NUVIO_TMDB_CACHE__,De=P.imdbIdCache,G=P.tmdbTitlesCache,Be=P.tmdbImageCache,Ee=P.episodeGroupCache,je=P.absoluteEpCache;async function X(a,t){let o=String(a||"").replace(/^tmdb:/i,"").trim();if(!o)return{titles:[]};let l=`${t}:${o}`;if(G.has(l))return G.get(l);let r=(async()=>{let n=[],c,u,e=[],b=[],k,f=[];try{let y=t==="tv"||t==="series",p=y?"tv":"movie";if(o.startsWith("tt")){let i=await Q(`find/${o}?external_source=imdb_id`);if(i){let d=y?i?.tv_results?.[0]:i?.movie_results?.[0];d&&(c=d.id,d.overview&&(k=d.overview))}}else c=parseInt(o,10);if(c&&!isNaN(c)){let i=await Q(`${p}/${c}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(i){if(i.overview&&(k=i.overview),i.title&&(n.push(i.title),i.title.includes(":"))){let s=i.title.split(":")[0].trim();s.length>2&&n.push(s)}if(i.name&&(n.push(i.name),i.name.includes(":"))){let s=i.name.split(":")[0].trim();s.length>2&&n.push(s)}if(i.original_title&&i.original_title!==i.title&&(n.push(i.original_title),i.original_title.includes(":"))){let s=i.original_title.split(":")[0].trim();s.length>2&&n.push(s)}if(i.original_name&&i.original_name!==i.name&&(n.push(i.original_name),i.original_name.includes(":"))){let s=i.original_name.split(":")[0].trim();s.length>2&&n.push(s)}if(i.translations?.translations&&Array.isArray(i.translations.translations))for(let s of i.translations.translations){let m=s.data?.name||s.data?.title;if(m&&typeof m=="string"&&(n.push(m),m.includes(":"))){let _=m.split(":")[0].trim();_.length>2&&n.push(_)}}let d=(i.alternative_titles?.results||i.alternative_titles?.titles||[]).map(s=>s.title).filter(Boolean);n.push(...d);let h=i.release_date||i.first_air_date;h&&(u=parseInt(h.split("-")[0],10)),i.genres&&Array.isArray(i.genres)&&(f=i.genres.map(s=>s.name).filter(Boolean)),i.credits?.cast&&Array.isArray(i.credits.cast)&&(e=i.credits.cast.slice(0,10).map(s=>s.name).filter(Boolean));let g=[];i.created_by&&Array.isArray(i.created_by)&&g.push(...i.created_by.map(s=>s.name).filter(Boolean)),i.credits?.crew&&Array.isArray(i.credits.crew)&&g.push(...i.credits.crew.filter(s=>s.job==="Director"||s.department==="Directing").map(s=>s.name).filter(Boolean)),b=Array.from(new Set(g))}}}catch{}return{numericId:c,titles:Array.from(new Set(n.filter(Boolean))),year:u,cast:e,creators:b,overview:k,genres:f}})();return G.set(l,r),r}var ve=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],Z=["tr","tur","ota"],Ae=["english","ingilizce","original","orijinal","audio-en"],ee=["en","eng","und"];function ne(a,t){let o=!1,l=!1,r=[],n,c,u,e=(t||"").toLowerCase();if(e.includes("trdual")||e.includes("dual")||e.includes("trdub")||e.includes("dublaj")?(o=!0,l=!0):(e.includes("ses-tr")||e.includes("turkcedublaj")||e.includes("turkce-dublaj"))&&(o=!0),e.includes("2160p")||e.includes("4k")||e.includes("uhd")?n="4K":e.includes("1080p")||e.includes("1920x1080")||e.includes("fhd")?n="1080p":e.includes("720p")||e.includes("1280x720")||e.includes("hd")?n="720p":(e.includes("480p")||e.includes("854x480")||e.includes("sd"))&&(n="480p"),e.includes("hevc")||e.includes("h265")||e.includes("x265")?c="HEVC":e.includes("av1")?c="AV1":(e.includes("h264")||e.includes("x264")||e.includes("avc"))&&(c="H.264"),e.includes("5.1")||e.includes("eac3")||e.includes("ac3")||e.includes("ddp")?u="Dolby 5.1":(e.includes("7.1")||e.includes("atmos"))&&(u="Dolby Atmos 7.1"),a&&typeof a=="string"){let k=a.split(/\r?\n/),f=0;for(let y of k){let p=y.trim();if(p.startsWith("#EXT-X-MEDIA:")&&p.includes("TYPE=AUDIO")){let i=p.match(/NAME=["']([^"']+)["']/i),d=p.match(/LANGUAGE=["']([^"']+)["']/i),h=p.match(/GROUP-ID=["']([^"']+)["']/i),g=(i?i[1]:"").toLowerCase(),s=(d?d[1]:"").toLowerCase(),m=(h?h[1]:"").toLowerCase(),_=g.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),A=m.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),z=Z.includes(s)||Z.some(v=>_.includes(v)||A.includes(v))||ve.some(v=>g.includes(v)||m.includes(v))||g.includes("t\xFCrk")||g.includes("turk")||m.includes("dual"),B=ee.includes(s)||ee.some(v=>_.includes(v)||A.includes(v))||Ae.some(v=>g.includes(v)||m.includes(v))||g.includes("orig")||g.includes("ing")||g.includes("eng");z&&(o=!0),B&&(l=!0)}if(p.startsWith("#EXT-X-MEDIA:")&&p.includes("TYPE=SUBTITLES")){let i=p.match(/URI=["']([^"']+)["']/i),d=p.match(/NAME=["']([^"']+)["']/i),h=p.match(/LANGUAGE=["']([^"']+)["']/i);if(i&&i[1]){let g=i[1];if(t&&!g.startsWith("http"))try{g=new URL(g,t).toString()}catch{}let s=d?d[1]:"Altyaz\u0131",m=h?h[1].toLowerCase():"";m==="st"||m==="sot"||s.toLowerCase().includes("sotho")||s.toLowerCase().includes("sesotho")||g.toLowerCase().includes("sub_st")?(m="tr",s="T\xFCrk\xE7e"):m||(m=s.toLowerCase().includes("t\xFCrk")?"tr":"und");let A=ie(m,s);r.push({label:A.name||s,url:g,lang:A.code||m})}}if(p.startsWith("#EXT-X-STREAM-INF:")){let i=p.match(/RESOLUTION=(\d+)x(\d+)/i);if(i){let d=parseInt(i[1],10),h=parseInt(i[2],10),g=Math.min(d,h),s=Math.max(d,h),m=g>=2100||s>=3800?2160:g>=1400||s>=2500?1440:g>=1e3||s>=1900?1080:g>=700||s>=1200?720:g>=450?480:g;m>f&&(f=m)}else{let d=p.match(/NAME=["']?([^"',\s]+)["']?/i);if(d){let h=d[1].toLowerCase();h.includes("2160")||h.includes("4k")?2160>f&&(f=2160):h.includes("1440")||h.includes("2k")?1440>f&&(f=1440):h.includes("1080")?1080>f&&(f=1080):h.includes("720")&&720>f&&(f=720)}}}}f>=2160?n="4K":f>=1440?n="2K":f>=1080?n="1080p":f>=720?n="720p":f>=480&&(n="480p")}let b=o&&l||e.includes("dual")||e.includes("trdual");return{hasTurkishAudio:o,hasOriginalAudio:l,isDual:b,embeddedSubtitles:r,detectedQuality:n,detectedCodec:c,detectedAudio:u}}function _e(a){let{hasTurkishAudio:t,hasOriginalAudio:o,isDual:l,hasSubtitles:r,hasTurkishSubtitles:n,isYerli:c,siteHint:u,defaultTitle:e}=a;if(c||u?.isYerli)return"Yerli";if(u?.label){let b=u.label.toLowerCase();if((b.includes("dub")||b.includes("t\xFCrk"))&&(b.includes("alt")||b.includes("sub")))return"Dublaj / Altyaz\u0131l\u0131";if(b.includes("dub")||b.includes("t\xFCrk\xE7e ses"))return"Dublaj";if(b.includes("alt")||b.includes("sub"))return"Altyaz\u0131l\u0131";if(b.includes("orijinal")||b.includes("original"))return"Orijinal"}return l||t&&(o||n)?"Dublaj / Altyaz\u0131l\u0131":t||u?.isDublaj?"Dublaj":n||u?.isAltyazi?"Altyaz\u0131l\u0131":e||(t?"Dublaj":"Orijinal")}var w={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function ie(a,t,o){let l=h=>(h||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),r=l(a||""),n=l(t||""),c=!!o||r.includes("forced")||n.includes("forced")||r.includes("zorunlu")||n.includes("zorunlu"),u=r.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),e=n.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),b=h=>{let g=h.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return c?`${g} (Zorunlu)`:g};if(u==="st"||u==="sot"||u.includes("sotho")||e.includes("sotho")||e.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:c?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let k=w[r]||w[n]||w[u]||w[e];if(!k){let h=(e+" "+u).split(/\s+/).filter(Boolean);for(let g of h)if(w[g]){k=w[g];break}}if(!k){for(let[h,g]of Object.entries(w))if(h.length>=4&&(e.includes(h)||u.includes(h))){k=g;break}}if(k)return{code:k.code,iso3:k.iso3,language:k.language,name:b(k.name)};let f=(t||a||"Altyaz\u0131").trim();f=f.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let y=f.charAt(0).toUpperCase()+f.slice(1),p=b(y),i=r&&r.length===2?r:n&&n.length===2?n:"und",d=r&&r.length===3?r:n&&n.length===3?n:"und";return{code:i,iso3:d,language:y,name:p}}function ae(a,t){let o=[],l=new Set,r=[...a||[],...t||[]];for(let n of r){if(!n||!n.url)continue;let c=n.url.trim();if(l.has(c))continue;l.add(c);let u=ie(n.lang,n.label||n.name||n.language),e=u.name||n.label||n.name||"Altyaz\u0131";o.push({id:String(o.length),url:c,label:e,name:e,language:u.language,lang:u.code,langCode:u.iso3,headers:n.headers})}return o}function te(a){let{m3u8Text:t,m3u8Url:o,externalSubtitles:l,siteHint:r,defaultTitle:n}=a,c=ne(t,o),u=ae(l),e=ae(l,c.embeddedSubtitles),b=e.length>0||!!r?.isAltyazi,k=e.some(d=>d.lang==="tr"||d.lang==="st"||d.lang==="sot"||d.langCode==="tur"||d.langCode==="sot"||d.label?.toLowerCase().includes("t\xFCrk")||d.label?.toLowerCase().includes("sotho")||d.language==="Turkish"||d.language?.toLowerCase().includes("sotho")),f=c.hasTurkishAudio||!!r?.isDublaj,y=c.hasOriginalAudio,p=c.isDual||f&&(k||y),i=_e({hasTurkishAudio:f,hasOriginalAudio:y,isDual:p,hasSubtitles:b,hasTurkishSubtitles:k,isYerli:r?.isYerli,siteHint:r,defaultTitle:n});return{hasTurkishAudio:f,hasOriginalAudio:y,isDual:p,hasSubtitles:b,hasTurkishSubtitles:k,isYerli:r?.isYerli,languageTitle:i,subtitles:u,detectedQuality:c.detectedQuality,detectedCodec:c.detectedCodec,detectedAudio:c.detectedAudio}}function se(a){let t=a.url?ne(void 0,a.url):{},o=a.quality||a.inspection?.detectedQuality||t.detectedQuality||"1080p";o.includes("\u2022")&&(o=o.split("\u2022")[0].trim()),!o.includes("p")&&!o.includes("K")&&!o.includes("k")&&(o=`${o}p`);let l=a.subtitles||a.inspection?.subtitles,r=!!(a.inspection?.hasTurkishSubtitles||l?.some(m=>{let _=(m.lang||m.code||"").toLowerCase(),A=(m.langCode||m.iso3||"").toLowerCase(),z=(m.name||m.label||m.title||"").toLowerCase();return _==="tr"||_==="st"||A==="tur"||A==="sot"||z.includes("t\xFCrk")||z.includes("turk")||z.includes("sotho")})),n=(a.languageTitle||a.inspection?.languageTitle||"").toLowerCase().trim(),c=n.includes("dub")||n.includes("ses")||n.includes("dual")||!!t.hasTurkishAudio||!!a.inspection?.hasTurkishAudio,u=n.includes("dual")||n.includes("dub")&&(n.includes("alt")||n.includes("sub"))||c&&r,e="Orijinal";n.includes("yerli")||a.inspection?.isYerli?e="Yerli":u?e="Dublaj / Altyaz\u0131l\u0131":c?e="Dublaj":r||n.includes("alt")||n.includes("sub")?e="Altyaz\u0131l\u0131":(n.includes("orijinal")||n.includes("yabanc\u0131")||n.includes("original"))&&(e="Orijinal");let b=a.format==="m3u8"||a.url.includes(".m3u8")||a.url.includes("/master.")||a.url.includes("/hls/")||a.url.includes("/txt/"),k=a.format||(b?"m3u8":a.url.includes(".mp4")?"mp4":"m3u8"),f=k==="m3u8"?"HLS":k.toUpperCase(),y=[o],p=a.codec||a.inspection?.detectedCodec||t.detectedCodec;p&&p!=="H.264"&&y.push(p),y.push(f),a.bitrate&&y.push(a.bitrate);let i=a.audio||a.inspection?.detectedAudio||t.detectedAudio;i&&i!=="AAC 2.0"&&y.push(i);let d=a.details||y.join(" \u2022 "),h=`${e}
${d}`,g=`${o} \u2022 ${e}`,s={name:"han's 43",provider:"han's 43",title:e,description:h,url:a.url,quality:g,format:k};return a.headers&&Object.keys(a.headers).length>0&&(s.headers=a.headers),l&&l.length>0&&(s.subtitles=l),s}var I="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";function M(a){if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{return AbortSignal.timeout(a)}catch{}}function ze(a){try{if(typeof a.headers.getSetCookie=="function"){let o=a.headers.getSetCookie();if(Array.isArray(o)&&o.length>0)return o.map(l=>l.split(";")[0]).join("; ")}let t=a.headers.get("set-cookie");if(t)return t.split(";")[0]}catch{}return""}async function oe(a,t,o,l){let r=Date.now(),n=String(a||"").replace(/^tmdb:/i,"").trim(),c=Number(n),u=t==="tv"||t==="series";S("han's 43",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${n}, T\xFCr: ${t}, Sezon: ${o}, B\xF6l\xFCm: ${l}`);try{let e=await V("corazon")||"https://dizifilmnow.com",b=await X(n,t),k=b.titles&&b.titles.length>0?b.titles:[];if(k.length===0)return S("han's 43",`TMDB ba\u015Fl\u0131\u011F\u0131 bulunamad\u0131: ${n}`),[];let f=u?"tv":"movie",y=new Set;for(let p of k)if(!(!p||p.trim().length===0))try{let i=`${e}/api/public/search?q=${encodeURIComponent(p.trim())}&kind=${f}`,d=await fetch(i,{headers:{"User-Agent":I,Referer:`${e}/`},signal:M(4e3)});if(!d.ok)continue;let h=await d.json(),g=Array.isArray(h?.items)?h.items:[];for(let s of g){if(!s?.slug||y.has(s.slug))continue;y.add(s.slug);let m=null;try{let C=await fetch(`${e}/api/public/content/${s.slug}`,{headers:{"User-Agent":I,Referer:`${e}/`},signal:M(3500)});C.ok&&(m=await C.json())}catch{}if(!m||c&&m.tmdb_id&&Number(m.tmdb_id)!==c)continue;let _=m.id||s.id;if(!_)continue;let A;if(u){let C=Number(o||1),x=Number(l||1);try{let ue=`${e}/api/public/series/${s.slug}/episodes?season=${C}`,K=await fetch(ue,{headers:{"User-Agent":I,Referer:`${e}/`},signal:M(3500)});if(K.ok){let O=await K.json(),j=(Array.isArray(O?.items)?O.items:[]).find(R=>Number(R.episode_number)===x&&(R.season_number===void 0||Number(R.season_number)===C));j&&j.id&&(A=j.id)}}catch{}if(!A){S("han's 43",`B\xF6l\xFCm bulunamad\u0131 -> ${s.slug} S${C}E${x}`);continue}}let z={contentId:_};u&&A&&(z.episodeId=A);let B=u?`${e}/dizi/${s.slug}/sezon-${o||1}/bolum-${l||1}`:`${e}/film/${s.slug}`,v=await fetch(`${e}/api/public/playback/start`,{method:"POST",headers:{"Content-Type":"application/json","User-Agent":I,Referer:B,Origin:e},body:JSON.stringify(z),signal:M(4500)});if(!v.ok)continue;let D=ze(v),L=await v.json();if(L?.state!=="ready"||!L?.src)continue;let E=L.src.startsWith("http")?L.src:`${e}${L.src.startsWith("/")?"":"/"}${L.src}`,U;try{let C=await fetch(E,{headers:{"User-Agent":I,Referer:`${e}/`,...D?{Cookie:D}:{}},signal:M(2e3)});C.ok&&(U=await C.text())}catch{}let le=te({m3u8Text:U,m3u8Url:E}),re=se({name:"han's 43",url:E,inspection:le,format:"m3u8",headers:{"User-Agent":I,Referer:`${e}/`,...D?{Cookie:D}:{}}}),ce=((Date.now()-r)/1e3).toFixed(2);return S("han's 43",`TAMAMLANDI: 1080p HLS ak\u0131\u015F\u0131 haz\u0131rland\u0131 (${ce}s) -> ${s.title}`),[re]}}catch(i){S("han's 43",`Arama hatas\u0131 (${p}): ${i?.message||i}`)}}catch(e){S("han's 43",`Kritik hata: ${e?.message||e}`)}return[]}var Ce=oe;

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

;(()=>{const n="han's 43",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
