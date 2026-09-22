
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

"use strict";var K=Object.defineProperty;var fe=Object.getOwnPropertyDescriptor;var pe=Object.getOwnPropertyNames;var be=Object.prototype.hasOwnProperty;var ke=(e,i)=>{for(var t in i)K(e,t,{get:i[t],enumerable:!0})},ye=(e,i,t,o)=>{if(i&&typeof i=="object"||typeof i=="function")for(let s of pe(i))!be.call(e,s)&&s!==t&&K(e,s,{get:()=>i[s],enumerable:!(o=fe(i,s))||o.enumerable});return e};var Ae=e=>ye(K({},"__esModule",{value:!0}),e);var Ie={};ke(Ie,{default:()=>Pe,getStreams:()=>V});module.exports=Ae(Ie);var Te=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(i=>String.fromCharCode(i^42)).join(""),ve={REMOTE_CONFIG_URL:Te,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},Z={imu:"https://ha.vixolity.com",kalgara:"https://dizibal.org",garling:"https://liderfilmizle.vip"},$=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};$.__NUVIO_CONFIG_STATE__||($.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var S=$.__NUVIO_CONFIG_STATE__,Se=10*60*1e3;async function ee(){let e=Date.now();try{let i={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let o=AbortSignal.timeout(8e3);o&&(i.signal=o)}catch{}let t=await fetch(`${ve.REMOTE_CONFIG_URL}?_t=${e}`,i);if(t.ok){let o=await t.json(),s=o?.data??o,a=s.domains||s,l=s.cookies,r=s.tmdb_keys||s.tmdbKeys;a&&typeof a=="object"&&(S.cachedDomains={...S.cachedDomains,...a}),l&&typeof l=="object"&&(S.cachedCookies={...S.cachedCookies,...l}),Array.isArray(r)&&r.length>0&&(S.cachedTmdbKeys=r),S.lastFetchTime=e}else S.lastFetchTime=0}catch{S.lastFetchTime=0}}async function ae(){let e=Date.now();(!(Object.keys(S.cachedDomains).length>0)||e-S.lastFetchTime>Se)&&(S.activeFetchPromise||(S.activeFetchPromise=ee().finally(()=>{S.activeFetchPromise=null})),await S.activeFetchPromise)}async function ne(e){await ae();let i=S.cachedDomains[e]||Z[e]||"";return i||(await ee(),i=S.cachedDomains[e]||Z[e]||""),i}async function ie(){return await ae(),S.cachedTmdbKeys||[]}var _e="a2f888b27315e62e471b2d587048f32e",te=[_e,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function we(e){let i=await ie(),t=i.length>0?[...i,...te]:te;for(let o=0;o<t.length;o++){let s=t[o],a=e.includes("?")?"&":"?",l=`https://api.themoviedb.org/3/${e}${a}api_key=${s}`;try{let r=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,n=await fetch(l,{signal:r});if(n.ok)return await n.json();if(n.status===429)continue}catch{}}return null}var q=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};q.__NUVIO_TMDB_CACHE__||(q.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var j=q.__NUVIO_TMDB_CACHE__,H=j.imdbIdCache,Ne=j.tmdbTitlesCache,Ee=j.tmdbImageCache,xe=j.episodeGroupCache,Ue=j.absoluteEpCache;async function se(e,i){let t=String(e||"").replace(/^tmdb:/i,"").trim();if(!t)return null;if(t.startsWith("tt"))return t;let o=`${i}:${t}`;if(H.has(o))return H.get(o);let s=(async()=>{try{let l=await we(`${i==="tv"||i==="series"?"tv":"movie"}/${t}/external_ids`);if(l&&l.imdb_id)return l.imdb_id}catch{}return null})();return H.set(o,s),s}function y(e,i,t="info",o){let s=`[${e}]`;t==="error"?console.error(s,i,o||""):t==="warn"?console.warn(s,i,o||""):console.log(s,i,o||"");try{let l=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof l=="string"&&l.startsWith("http")&&fetch(l,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:t,message:i,details:o})}).catch(()=>{})}catch{}}var ze=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],oe=["tr","tur","ota"],Ce=["english","ingilizce","original","orijinal","audio-en"],le=["en","eng","und"];function ce(e,i){let t=!1,o=!1,s=[],a,l,r,n=(i||"").toLowerCase();if(n.includes("trdual")||n.includes("dual")||n.includes("trdub")||n.includes("dublaj")?(t=!0,o=!0):(n.includes("ses-tr")||n.includes("turkcedublaj")||n.includes("turkce-dublaj"))&&(t=!0),n.includes("2160p")||n.includes("4k")||n.includes("uhd")?a="4K":n.includes("1080p")||n.includes("1920x1080")||n.includes("fhd")?a="1080p":n.includes("720p")||n.includes("1280x720")||n.includes("hd")?a="720p":(n.includes("480p")||n.includes("854x480")||n.includes("sd"))&&(a="480p"),n.includes("hevc")||n.includes("h265")||n.includes("x265")?l="HEVC":n.includes("av1")?l="AV1":(n.includes("h264")||n.includes("x264")||n.includes("avc"))&&(l="H.264"),n.includes("5.1")||n.includes("eac3")||n.includes("ac3")||n.includes("ddp")?r="Dolby 5.1":(n.includes("7.1")||n.includes("atmos"))&&(r="Dolby Atmos 7.1"),e&&typeof e=="string"){let p=e.split(/\r?\n/),c=0;for(let d of p){let b=d.trim();if(b.startsWith("#EXT-X-MEDIA:")&&b.includes("TYPE=AUDIO")){let A=b.match(/NAME=["']([^"']+)["']/i),h=b.match(/LANGUAGE=["']([^"']+)["']/i),u=b.match(/GROUP-ID=["']([^"']+)["']/i),g=(A?A[1]:"").toLowerCase(),T=(h?h[1]:"").toLowerCase(),f=(u?u[1]:"").toLowerCase(),z=g.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),_=f.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),w=oe.includes(T)||oe.some(v=>z.includes(v)||_.includes(v))||ze.some(v=>g.includes(v)||f.includes(v))||g.includes("t\xFCrk")||g.includes("turk")||f.includes("dual"),M=le.includes(T)||le.some(v=>z.includes(v)||_.includes(v))||Ce.some(v=>g.includes(v)||f.includes(v))||g.includes("orig")||g.includes("ing")||g.includes("eng");w&&(t=!0),M&&(o=!0)}if(b.startsWith("#EXT-X-MEDIA:")&&b.includes("TYPE=SUBTITLES")){let A=b.match(/URI=["']([^"']+)["']/i),h=b.match(/NAME=["']([^"']+)["']/i),u=b.match(/LANGUAGE=["']([^"']+)["']/i);if(A&&A[1]){let g=A[1];if(i&&!g.startsWith("http"))try{g=new URL(g,i).toString()}catch{}let T=h?h[1]:"Altyaz\u0131",f=u?u[1].toLowerCase():"";f==="st"||f==="sot"||T.toLowerCase().includes("sotho")||T.toLowerCase().includes("sesotho")||g.toLowerCase().includes("sub_st")?(f="tr",T="T\xFCrk\xE7e"):f||(f=T.toLowerCase().includes("t\xFCrk")?"tr":"und");let _=N(f,T);s.push({label:_.name||T,url:g,lang:_.code||f})}}if(b.startsWith("#EXT-X-STREAM-INF:")){let A=b.match(/RESOLUTION=(\d+)x(\d+)/i);if(A){let h=parseInt(A[1],10),u=parseInt(A[2],10),g=Math.min(h,u),T=Math.max(h,u),f=g>=2100||T>=3800?2160:g>=1400||T>=2500?1440:g>=1e3||T>=1900?1080:g>=700||T>=1200?720:g>=450?480:g;f>c&&(c=f)}else{let h=b.match(/NAME=["']?([^"',\s]+)["']?/i);if(h){let u=h[1].toLowerCase();u.includes("2160")||u.includes("4k")?2160>c&&(c=2160):u.includes("1440")||u.includes("2k")?1440>c&&(c=1440):u.includes("1080")?1080>c&&(c=1080):u.includes("720")&&720>c&&(c=720)}}}}c>=2160?a="4K":c>=1440?a="2K":c>=1080?a="1080p":c>=720?a="720p":c>=480&&(a="480p")}let m=t&&o||n.includes("dual")||n.includes("trdual");return{hasTurkishAudio:t,hasOriginalAudio:o,isDual:m,embeddedSubtitles:s,detectedQuality:a,detectedCodec:l,detectedAudio:r}}function Me(e){let{hasTurkishAudio:i,hasOriginalAudio:t,isDual:o,hasSubtitles:s,hasTurkishSubtitles:a,isYerli:l,siteHint:r,defaultTitle:n}=e;if(l||r?.isYerli)return"Yerli";if(r?.label){let m=r.label.toLowerCase();if((m.includes("dub")||m.includes("t\xFCrk"))&&(m.includes("alt")||m.includes("sub")))return"Dublaj / Altyaz\u0131l\u0131";if(m.includes("dub")||m.includes("t\xFCrk\xE7e ses"))return"Dublaj";if(m.includes("alt")||m.includes("sub"))return"Altyaz\u0131l\u0131";if(m.includes("orijinal")||m.includes("original"))return"Orijinal"}return o||i&&(t||a)?"Dublaj / Altyaz\u0131l\u0131":i||r?.isDublaj?"Dublaj":a||r?.isAltyazi?"Altyaz\u0131l\u0131":n||(i?"Dublaj":"Orijinal")}var I={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function N(e,i,t){let o=u=>(u||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),s=o(e||""),a=o(i||""),l=!!t||s.includes("forced")||a.includes("forced")||s.includes("zorunlu")||a.includes("zorunlu"),r=s.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),n=a.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),m=u=>{let g=u.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return l?`${g} (Zorunlu)`:g};if(r==="st"||r==="sot"||r.includes("sotho")||n.includes("sotho")||n.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:l?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let p=I[s]||I[a]||I[r]||I[n];if(!p){let u=(n+" "+r).split(/\s+/).filter(Boolean);for(let g of u)if(I[g]){p=I[g];break}}if(!p){for(let[u,g]of Object.entries(I))if(u.length>=4&&(n.includes(u)||r.includes(u))){p=g;break}}if(p)return{code:p.code,iso3:p.iso3,language:p.language,name:m(p.name)};let c=(i||e||"Altyaz\u0131").trim();c=c.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let d=c.charAt(0).toUpperCase()+c.slice(1),b=m(d),A=s&&s.length===2?s:a&&a.length===2?a:"und",h=s&&s.length===3?s:a&&a.length===3?a:"und";return{code:A,iso3:h,language:d,name:b}}function re(e,i){let t=[],o=new Set,s=[...e||[],...i||[]];for(let a of s){if(!a||!a.url)continue;let l=a.url.trim();if(o.has(l))continue;o.add(l);let r=N(a.lang,a.label||a.name||a.language),n=r.name||a.label||a.name||"Altyaz\u0131";t.push({id:String(t.length),url:l,label:n,name:n,language:r.language,lang:r.code,langCode:r.iso3,headers:a.headers})}return t}function ue(e){let{m3u8Text:i,m3u8Url:t,externalSubtitles:o,siteHint:s,defaultTitle:a}=e,l=ce(i,t),r=re(o),n=re(o,l.embeddedSubtitles),m=n.length>0||!!s?.isAltyazi,p=n.some(h=>h.lang==="tr"||h.lang==="st"||h.lang==="sot"||h.langCode==="tur"||h.langCode==="sot"||h.label?.toLowerCase().includes("t\xFCrk")||h.label?.toLowerCase().includes("sotho")||h.language==="Turkish"||h.language?.toLowerCase().includes("sotho")),c=l.hasTurkishAudio||!!s?.isDublaj,d=l.hasOriginalAudio,b=l.isDual||c&&(p||d),A=Me({hasTurkishAudio:c,hasOriginalAudio:d,isDual:b,hasSubtitles:m,hasTurkishSubtitles:p,isYerli:s?.isYerli,siteHint:s,defaultTitle:a});return{hasTurkishAudio:c,hasOriginalAudio:d,isDual:b,hasSubtitles:m,hasTurkishSubtitles:p,isYerli:s?.isYerli,languageTitle:A,subtitles:r,detectedQuality:l.detectedQuality,detectedCodec:l.detectedCodec,detectedAudio:l.detectedAudio}}function ge(e){let i=e.url?ce(void 0,e.url):{},t=e.quality||e.inspection?.detectedQuality||i.detectedQuality||"1080p";t.includes("\u2022")&&(t=t.split("\u2022")[0].trim()),!t.includes("p")&&!t.includes("K")&&!t.includes("k")&&(t=`${t}p`);let o=e.subtitles||e.inspection?.subtitles,s=!!(e.inspection?.hasTurkishSubtitles||o?.some(f=>{let z=(f.lang||f.code||"").toLowerCase(),_=(f.langCode||f.iso3||"").toLowerCase(),w=(f.name||f.label||f.title||"").toLowerCase();return z==="tr"||z==="st"||_==="tur"||_==="sot"||w.includes("t\xFCrk")||w.includes("turk")||w.includes("sotho")})),a=(e.languageTitle||e.inspection?.languageTitle||"").toLowerCase().trim(),l=a.includes("dub")||a.includes("ses")||a.includes("dual")||!!i.hasTurkishAudio||!!e.inspection?.hasTurkishAudio,r=a.includes("dual")||a.includes("dub")&&(a.includes("alt")||a.includes("sub"))||l&&s,n="Orijinal";a.includes("yerli")||e.inspection?.isYerli?n="Yerli":r?n="Dublaj / Altyaz\u0131l\u0131":l?n="Dublaj":s||a.includes("alt")||a.includes("sub")?n="Altyaz\u0131l\u0131":(a.includes("orijinal")||a.includes("yabanc\u0131")||a.includes("original"))&&(n="Orijinal");let m=e.format==="m3u8"||e.url.includes(".m3u8")||e.url.includes("/master.")||e.url.includes("/hls/")||e.url.includes("/txt/"),p=e.format||(m?"m3u8":e.url.includes(".mp4")?"mp4":"m3u8"),c=p==="m3u8"?"HLS":p.toUpperCase(),d=[t],b=e.codec||e.inspection?.detectedCodec||i.detectedCodec;b&&b!=="H.264"&&d.push(b),d.push(c),e.bitrate&&d.push(e.bitrate);let A=e.audio||e.inspection?.detectedAudio||i.detectedAudio;A&&A!=="AAC 2.0"&&d.push(A);let h=e.details||d.join(" \u2022 "),u=`${n}
${h}`,g=`${t} \u2022 ${n}`,T={name:"han's 33",provider:"han's 33",title:n,description:u,url:e.url,quality:g,format:p};return e.headers&&Object.keys(e.headers).length>0&&(T.headers=e.headers),o&&o.length>0&&(T.subtitles=o),T}var E="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Y="okhttp/4.9.2";function Le(e,i){let t=[];try{let o=e.match(/(?:tracks|baseTracks)\s*[:=]\s*\[([\s\S]*?)\]/);if(!o)return t;let s=o[1].match(/\{[\s\S]*?\}/g)||[],a=new URL(i).origin;for(let l=0;l<s.length;l++){let r=s[l];if(r.toLowerCase().includes("thumbnail"))continue;let n=r.match(/file\s*:\s*["']([^"']+)["']/);if(!n)continue;let m=n[1].replace(/\\\//g,"/");m.startsWith("/")&&(m=a+m);let p=r.match(/label\s*:\s*["']([^"']+)["']/),c=p?p[1]:"";try{c=JSON.parse(`"${c}"`)}catch{}let d=N("",c||m);t.push({id:String(l),url:m,language:d.language,name:d.name,lang:d.code,langCode:d.iso3,label:d.name,headers:{Referer:a+"/",Origin:a,"User-Agent":Y}})}}catch{}return t}async function V(e,i,t,o){let s=Date.now(),a=String(e||"").trim(),l=String(i||"").toLowerCase().trim(),r=l==="tv"||l==="series",n=r?"tv":"movie",m=t!=null?Math.max(1,Number(t)):1,p=o!=null?Math.max(1,Number(o)):1;if(!a)return[];y("han's 33",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${a}, T\xFCr: ${n}, Sezon: ${m}, B\xF6l\xFCm: ${p}`);try{y("han's 33",`[Ad\u0131m 1/4] IMDb ID \xE7\xF6z\xFCmleniyor (${a})...`);let c=await se(a,n);if(!c||!c.startsWith("tt"))return y("han's 33",`IMDb ID bulunamad\u0131: ${a}`,"warn"),[];let d=await ne("ace");if(!d)return y("han's 33","Domain not resolved","warn"),[];y("han's 33",`[Ad\u0131m 2/4] Kesin IMDb aramas\u0131 yap\u0131l\u0131yor (${c})...`);let b=`${d}/search?keyword=${encodeURIComponent(c)}`,A=await fetch(b,{headers:{"User-Agent":E,Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",Referer:d+"/"},signal:AbortSignal.timeout?AbortSignal.timeout(4e3):void 0});if(!A.ok)return y("han's 33",`Arama ba\u015Far\u0131s\u0131z: HTTP ${A.status}`,"warn"),[];let h=await A.text(),u="";if(r){let k=h.match(/href=["']((?:https?:\/\/[^\/]+)?\/watch-series\/[^"']+)["']/i);if(!k)return y("han's 33","Dizi arama sonu\xE7lar\u0131nda bulunamad\u0131.","warn"),[];let L=k[1];L.startsWith("/")&&(L=d+L);let R=L.match(/watch-series\/([^/]+)/),C=R?R[1]:"";if(!C)return y("han's 33","Dizi slug bulunamad\u0131.","warn"),[];let G=String(m).padStart(2,"0"),P=String(p).padStart(2,"0");u=`${d}/episode/${C}/s${G}-e${P}/`,y("han's 33"," \u0130\xE7erik bulundu (Dizi B\xF6l\xFCm\xFC)","success")}else{let k=h.match(/href=["']((?:https?:\/\/[^\/]+)?\/watch-movie\/[^"']+)["']/i);if(!k)return y("han's 33","Film arama sonu\xE7lar\u0131nda bulunamad\u0131.","warn"),[];u=k[1],u.startsWith("/")&&(u=d+u),y("han's 33"," \u0130\xE7erik bulundu (Film)","success")}y("han's 33","[Ad\u0131m 3/4] Oynat\u0131c\u0131 sayfas\u0131 taran\u0131yor...");let g=await fetch(u,{headers:{"User-Agent":E,Referer:b},signal:AbortSignal.timeout?AbortSignal.timeout(4500):void 0});if(!g.ok)return y("han's 33",`Oynat\u0131c\u0131 sayfas\u0131 y\xFCklenemedi: HTTP ${g.status}`,"warn"),[];let f=(await g.text()).match(/data-token=["']([^"']+)["']/i);if(!f)return y("han's 33","Oynat\u0131c\u0131 belirteci (data-token) bulunamad\u0131.","warn"),[];let z=f[1],_=new URLSearchParams;r?_.append("players_show",z):_.append("players",z);let w=await fetch(`${d}/ajax/ajax.php`,{method:"POST",headers:{"User-Agent":E,Referer:u,Origin:d,"X-Requested-With":"XMLHttpRequest","Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},body:_.toString(),signal:AbortSignal.timeout?AbortSignal.timeout(4500):void 0});if(!w.ok)return y("han's 33",`Sunucu listesi iste\u011Fi ba\u015Far\u0131s\u0131z: HTTP ${w.status}`,"warn"),[];let M=await w.json();if(!Array.isArray(M)||M.length===0)return y("han's 33","Kullan\u0131labilir video sunucusu bulunamad\u0131.","warn"),[];y("han's 33",`[Ad\u0131m 4/4] Video ak\u0131\u015F\u0131 \xE7\xF6z\xFCmleniyor (${M.length} sunucu)...`);let v=M.find(k=>k.name?.toLowerCase().includes("vidmoly")||k.link?.includes("kaembed")||k.link?.includes("vidmoly"))||M[0];if(!v||!v.link)return y("han's 33","Ge\xE7erli sunucu ba\u011Flant\u0131s\u0131 bulunamad\u0131.","warn"),[];let U=await fetch(v.link,{headers:{"User-Agent":E,Referer:u},signal:AbortSignal.timeout?AbortSignal.timeout(5e3):void 0});if(!U.ok)return y("han's 33",`Oynat\u0131c\u0131 iframe y\xFCklenemedi: HTTP ${U.status}`,"warn"),[];let D=await U.text(),F=D.match(/file\s*:\s*["']([^"']+\.m3u8[^"']*)["']/i)||D.match(/sources\s*:\s*\[\s*\{\s*file\s*:\s*["']([^"']+)["']/i)||D.match(/https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*/i);if(!F)return y("han's 33","m3u8 video ak\u0131\u015F\u0131 bulunamad\u0131.","warn"),[];let W=F[1]||F[0],B=[],x=new Set,J=v.link.match(/sub(?:get|\.info)=([^&]+)/i);if(J)try{let k=decodeURIComponent(J[1]),L=await fetch(k,{headers:{"User-Agent":E},signal:AbortSignal.timeout?AbortSignal.timeout(3e3):void 0});if(L.ok){let R=await L.json();if(Array.isArray(R)){for(let C of R)if(C.file&&!x.has(C.file)){x.add(C.file);let G=C.label||"",P=N("",G);B.push({id:String(B.length),url:C.file,language:P.language,name:P.name,lang:P.code,langCode:P.iso3,label:P.name,headers:{"User-Agent":Y,Referer:d+"/",Origin:d}})}}}}catch{}let de=Le(D,v.link);for(let k of de)x.has(k.url)||(x.add(k.url),B.push(k));let X=B.some(k=>k.lang==="tr"||k.langCode==="tur"||k.label?.toLowerCase().includes("t\xFCrk")||k.language==="Turkish"),me=ue({m3u8Text:D,m3u8Url:W,externalSubtitles:B,siteHint:{isDublaj:!1,isAltyazi:X,label:X?"Altyaz\u0131l\u0131":"Orijinal"}}),O="https://kaembed.net";try{v?.link&&(O=new URL(v.link).origin)}catch{}let Q=[ge({name:"han's 33",url:W,inspection:me,quality:"1080p",format:"m3u8",headers:{"User-Agent":Y,Referer:`${O}/`,Origin:O}})],he=((Date.now()-s)/1e3).toFixed(2);return y("han's 33",`[Ad\u0131m 4/4] TAMAMLANDI: 1 ak\u0131\u015F haz\u0131rland\u0131 (${he}s)`,"success",Q.map(k=>({title:k.title,quality:k.quality||"1080p",format:"m3u8"}))),Q}catch(c){return y("han's 33",`Hata: ${c.message||"Scrape error"}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=V);var Pe={getStreams:V};

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

;(()=>{const n="han's 33",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
