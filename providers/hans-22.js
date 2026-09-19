
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

"use strict";var U=Object.defineProperty;var ge=Object.getOwnPropertyDescriptor;var de=Object.getOwnPropertyNames;var me=Object.prototype.hasOwnProperty;var he=(a,s)=>{for(var o in s)U(a,o,{get:s[o],enumerable:!0})},pe=(a,s,o,r)=>{if(s&&typeof s=="object"||typeof s=="function")for(let t of de(s))!me.call(a,t)&&t!==o&&U(a,t,{get:()=>s[t],enumerable:!(r=ge(s,t))||r.enumerable});return a};var be=a=>pe(U({},"__esModule",{value:!0}),a);var we={};he(we,{getStreams:()=>te});module.exports=be(we);var fe=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(s=>String.fromCharCode(s^42)).join(""),N={REMOTE_CONFIG_URL:fe,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"};var O=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};O.__NUVIO_CONFIG_STATE__||(O.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var S=O.__NUVIO_CONFIG_STATE__,ke=10*60*1e3;async function W(){let a=Date.now();try{let s={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let r=AbortSignal.timeout(8e3);r&&(s.signal=r)}catch{}let o=await fetch(`${N.REMOTE_CONFIG_URL}?_t=${a}`,s);if(o.ok){let r=await o.json(),t=r?.data??r,i=t.domains||t,u=t.cookies,d=t.tmdb_keys||t.tmdbKeys;i&&typeof i=="object"&&(S.cachedDomains={...S.cachedDomains,...i}),u&&typeof u=="object"&&(S.cachedCookies={...S.cachedCookies,...u}),Array.isArray(d)&&d.length>0&&(S.cachedTmdbKeys=d),S.lastFetchTime=a}else S.lastFetchTime=0}catch{S.lastFetchTime=0}}async function Q(){let a=Date.now();(!(Object.keys(S.cachedDomains).length>0)||a-S.lastFetchTime>ke)&&(S.activeFetchPromise||(S.activeFetchPromise=W().finally(()=>{S.activeFetchPromise=null})),await S.activeFetchPromise)}async function X(a){await Q();let s=S.cachedDomains[a]||"";return s||(await W(),s=S.cachedDomains[a]||""),s}async function Z(){return await Q(),S.cachedTmdbKeys||[]}var ye="a2f888b27315e62e471b2d587048f32e",ee=[ye,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function R(a){let s=await Z(),o=s.length>0?[...s,...ee]:ee;for(let r=0;r<o.length;r++){let t=o[r],i=a.includes("?")?"&":"?",u=`https://api.themoviedb.org/3/${a}${i}api_key=${t}`;try{let d=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,e=await fetch(u,{signal:d});if(e.ok)return await e.json();if(e.status===429)continue}catch{}}return null}var q=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};q.__NUVIO_TMDB_CACHE__||(q.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var j=q.__NUVIO_TMDB_CACHE__,Ee=j.imdbIdCache,K=j.tmdbTitlesCache,Me=j.tmdbImageCache,x=j.episodeGroupCache,H=j.absoluteEpCache;async function ae(a,s){let o=String(a||"").replace(/^tmdb:/i,"").trim();if(!o)return{titles:[]};let r=`${s}:${o}`;if(K.has(r))return K.get(r);let t=(async()=>{let i=[],u,d,e=[],g=[],c,f=[];try{let p=s==="tv"||s==="series",y=p?"tv":"movie";if(o.startsWith("tt")){let n=await R(`find/${o}?external_source=imdb_id`);if(n){let k=p?n?.tv_results?.[0]:n?.movie_results?.[0];k&&(u=k.id,k.overview&&(c=k.overview))}}else u=parseInt(o,10);if(u&&!isNaN(u)){let n=await R(`${y}/${u}?language=tr-TR&append_to_response=credits,alternative_titles`);if(n){if(n.overview&&(c=n.overview),n.title&&(i.push(n.title),n.title.includes(":"))){let l=n.title.split(":")[0].trim();l.length>2&&i.push(l)}if(n.name&&(i.push(n.name),n.name.includes(":"))){let l=n.name.split(":")[0].trim();l.length>2&&i.push(l)}if(n.original_title&&n.original_title!==n.title&&(i.push(n.original_title),n.original_title.includes(":"))){let l=n.original_title.split(":")[0].trim();l.length>2&&i.push(l)}if(n.original_name&&n.original_name!==n.name&&(i.push(n.original_name),n.original_name.includes(":"))){let l=n.original_name.split(":")[0].trim();l.length>2&&i.push(l)}let k=(n.alternative_titles?.results||n.alternative_titles?.titles||[]).map(l=>l.title).filter(Boolean);i.push(...k);let m=n.release_date||n.first_air_date;m&&(d=parseInt(m.split("-")[0],10)),n.genres&&Array.isArray(n.genres)&&(f=n.genres.map(l=>l.name).filter(Boolean)),n.credits?.cast&&Array.isArray(n.credits.cast)&&(e=n.credits.cast.slice(0,10).map(l=>l.name).filter(Boolean));let h=[];n.created_by&&Array.isArray(n.created_by)&&h.push(...n.created_by.map(l=>l.name).filter(Boolean)),n.credits?.crew&&Array.isArray(n.credits.crew)&&h.push(...n.credits.crew.filter(l=>l.job==="Director"||l.department==="Directing").map(l=>l.name).filter(Boolean)),g=Array.from(new Set(h))}}}catch{}return{numericId:u,titles:Array.from(new Set(i.filter(Boolean))),year:d,cast:e,creators:g,overview:c,genres:f}})();return K.set(r,t),t}async function ne(a){if(x.has(a))return x.get(a);let s=(async()=>{try{let o=await R(`tv/${a}/episode_groups`);if(!o)return null;let t=(o.results||[]).find(c=>c.type===6||c.type===5||c.type===1||c.name?.toLowerCase().includes("season")||c.name?.toLowerCase().includes("arc")||c.name?.toLowerCase().includes("part")||c.name?.toLowerCase().includes("saga"));if(!t)return null;let i=await R(`tv/episode_group/${t.id}`);if(!i||!i.groups)return null;let u={},d=1,e={};return(i.groups||[]).sort((c,f)=>(c.order||0)-(f.order||0)).forEach((c,f)=>{let p=c.name||"",y=p.match(/Season\s+(\d+)/i),n=y?parseInt(y[1],10):c.order||f+1;n===0||p.toLowerCase().includes("specials")||p.toLowerCase().includes("\xF6zel")||(e[n]===void 0&&(e[n]=0),(c.episodes||[]).forEach(k=>{k.season_number!==0&&(e[n]++,u[d]={season:n,episode:e[n]},d++)}))}),u}catch{}return null})();return x.set(a,s),s}async function ie(a,s,o){if(s<=1)return o;let r=`${a}:${s}:${o}`;if(H.has(r))return H.get(r);let t=(async()=>{try{let i=await R(`tv/${a}`);if(!i)return o;let d=(i.seasons||[]).filter(e=>e.season_number>0&&e.season_number<s).reduce((e,g)=>e+(g.episode_count||0),0);return o>d?o:d+o}catch{}return o})();return H.set(r,t),t}function A(a,s,o="info",r){let t=`[${a}]`;o==="error"?console.error(t,s,r||""):o==="warn"?console.warn(t,s,r||""):console.log(t,s,r||"");try{let u=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof u=="string"&&u.startsWith("http")&&fetch(u,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:a,level:o,message:s,details:r})}).catch(()=>{})}catch{}}async function se(a){let{providerName:s,tmdbNumericId:o,season:r,episode:t,isTv:i,minAbsoluteThreshold:u=24,fetcher:d,isValid:e}=a;try{let g=await d(r,t);if(e(g))return{data:g,resolvedSeason:r,resolvedEpisode:t,strategy:"direct"}}catch(g){A(s,`Do\u011Frudan b\xF6l\xFCm sorgusu hatas\u0131 (S${r}E${t}): ${g?.message||g}`,"warn")}if(!i||!o)return{data:null,resolvedSeason:r,resolvedEpisode:t,strategy:"none"};try{let g=await ne(o);if(g){let c=g[t];if(c&&(c.season!==r||c.episode!==t)){A(s,`[TMDB Grup E\u015Fle\u015Fmesi] Sezon ${r} B\xF6l\xFCm ${t} -> Sezon ${c.season} B\xF6l\xFCm ${c.episode} olarak sorgulan\u0131yor...`,"info");let f=await d(c.season,c.episode);if(e(f))return{data:f,resolvedSeason:c.season,resolvedEpisode:c.episode,strategy:"group"}}}}catch(g){A(s,`TMDB grup e\u015Fle\u015Ftirme sorgusu hatas\u0131: ${g?.message||g}`,"warn")}if(r>1||t>u)try{let g=await ie(o,r,t);if(g&&(g!==t||r!==1)){A(s,`[Mutlak B\xF6l\xFCm] Sezon ${r} B\xF6l\xFCm ${t} -> Mutlak B\xF6l\xFCm ${g} olarak Sezon 1 sorgulan\u0131yor...`,"info");let c=await d(1,g);if(e(c))return{data:c,resolvedSeason:1,resolvedEpisode:g,strategy:"absolute"}}}catch(g){A(s,`Mutlak b\xF6l\xFCm sorgusu hatas\u0131: ${g?.message||g}`,"warn")}return{data:null,resolvedSeason:r,resolvedEpisode:t,strategy:"none"}}var Te=["t\xFCrk\xE7e","turkish","turkce","dublaj","tr","tur","dual","trdual","trdub","ses-tr","audio-tr","tr-dub"],ve=["english","ingilizce","original","orijinal","en","eng","und","audio-en"];function Se(a,s){let o=!1,r=!1,t=[],i,u,d,e=(s||"").toLowerCase();if(e.includes("trdual")||e.includes("dual")||e.includes("trdub")||e.includes("dublaj")?(o=!0,r=!0):(e.includes("ses-tr")||e.includes("turkcedublaj")||e.includes("turkce-dublaj"))&&(o=!0),e.includes("2160p")||e.includes("4k")||e.includes("uhd")?i="4K":e.includes("1080p")||e.includes("1920x1080")||e.includes("fhd")?i="1080p":e.includes("720p")||e.includes("1280x720")||e.includes("hd")?i="720p":(e.includes("480p")||e.includes("854x480")||e.includes("sd"))&&(i="480p"),e.includes("hevc")||e.includes("h265")||e.includes("x265")?u="HEVC":e.includes("av1")?u="AV1":(e.includes("h264")||e.includes("x264")||e.includes("avc"))&&(u="H.264"),e.includes("5.1")||e.includes("eac3")||e.includes("ac3")||e.includes("ddp")?d="Dolby 5.1":(e.includes("7.1")||e.includes("atmos"))&&(d="Dolby Atmos 7.1"),a&&typeof a=="string"){let c=a.split(/\r?\n/);for(let f of c){let p=f.trim();if(p.startsWith("#EXT-X-MEDIA:")&&p.includes("TYPE=AUDIO")){let y=p.match(/NAME=["']([^"']+)["']/i),n=p.match(/LANGUAGE=["']([^"']+)["']/i),k=p.match(/GROUP-ID=["']([^"']+)["']/i),m=(y?y[1]:"").toLowerCase(),h=(n?n[1]:"").toLowerCase(),l=(k?k[1]:"").toLowerCase(),_=Te.some(T=>m.includes(T)||h===T||l.includes(T))||m.includes("t\xFCrk")||m.includes("turk")||l.includes("dual"),D=ve.some(T=>m.includes(T)||h===T||l.includes(T))||m.includes("orig")||m.includes("ing")||m.includes("eng");_&&(o=!0),D&&(r=!0)}if(p.startsWith("#EXT-X-MEDIA:")&&p.includes("TYPE=SUBTITLES")){let y=p.match(/URI=["']([^"']+)["']/i),n=p.match(/NAME=["']([^"']+)["']/i),k=p.match(/LANGUAGE=["']([^"']+)["']/i);if(y&&y[1]){let m=y[1];if(s&&!m.startsWith("http"))try{m=new URL(m,s).toString()}catch{}let h=n?n[1]:"Altyaz\u0131",l=k?k[1].toLowerCase():"";l==="st"||l==="sot"||h.toLowerCase().includes("sotho")||h.toLowerCase().includes("sesotho")||m.toLowerCase().includes("sub_st")?(l="tr",h="T\xFCrk\xE7e"):l||(l=h.toLowerCase().includes("t\xFCrk")?"tr":"und");let D=Ae(l,h);t.push({label:D.name||h,url:m,lang:D.code||l})}}}}let g=o&&r||e.includes("dual")||e.includes("trdual");return{hasTurkishAudio:o,hasOriginalAudio:r,isDual:g,embeddedSubtitles:t,detectedQuality:i,detectedCodec:u,detectedAudio:d}}var B={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function Ae(a,s,o){let r=m=>(m||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),t=r(a||""),i=r(s||""),u=!!o||t.includes("forced")||i.includes("forced")||t.includes("zorunlu")||i.includes("zorunlu"),d=t.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),e=i.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),g=m=>{let h=m.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return u?`${h} (Zorunlu)`:h};if(d==="st"||d==="sot"||d.includes("sotho")||e.includes("sotho")||e.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:u?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let c=B[t]||B[i]||B[d]||B[e];if(!c){let m=(e+" "+d).split(/\s+/).filter(Boolean);for(let h of m)if(B[h]){c=B[h];break}}if(!c){for(let[m,h]of Object.entries(B))if(m.length>=4&&(e.includes(m)||d.includes(m))){c=h;break}}if(c)return{code:c.code,iso3:c.iso3,language:c.language,name:g(c.name)};let f=(s||a||"Altyaz\u0131").trim();f=f.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let p=f.charAt(0).toUpperCase()+f.slice(1),y=g(p),n=t&&t.length===2?t:i&&i.length===2?i:"und",k=t&&t.length===3?t:i&&i.length===3?i:"und";return{code:n,iso3:k,language:p,name:y}}function oe(a){let s=a.url?Se(void 0,a.url):{},o=a.quality||s.detectedQuality||"1080p";o.includes("\u2022")&&(o=o.split("\u2022")[0].trim()),!o.includes("p")&&!o.includes("K")&&!o.includes("k")&&(o=`${o}p`);let r=a.subtitles||a.inspection?.subtitles,t=!!(a.inspection?.hasTurkishSubtitles||r?.some(_=>{let D=(_.lang||_.code||"").toLowerCase(),T=(_.langCode||_.iso3||"").toLowerCase(),$=(_.name||_.label||_.title||"").toLowerCase();return D==="tr"||D==="st"||T==="tur"||T==="sot"||$.includes("t\xFCrk")||$.includes("turk")||$.includes("sotho")})),i=(a.languageTitle||a.inspection?.languageTitle||"").toLowerCase().trim(),u=i.includes("dub")||i.includes("ses")||i.includes("dual")||!!s.hasTurkishAudio||!!a.inspection?.hasTurkishAudio,d=i.includes("dual")||i.includes("dub")&&(i.includes("alt")||i.includes("sub"))||u&&t,e="Orijinal";i.includes("yerli")||a.inspection?.isYerli?e="Yerli":d?e="Dublaj / Altyaz\u0131l\u0131":u?e="Dublaj":t||i.includes("alt")||i.includes("sub")?e="Altyaz\u0131l\u0131":(i.includes("orijinal")||i.includes("yabanc\u0131")||i.includes("original"))&&(e="Orijinal");let g=a.format==="m3u8"||a.url.includes(".m3u8")||a.url.includes("/master.")||a.url.includes("/hls/")||a.url.includes("/txt/"),c=a.format||(g?"m3u8":a.url.includes(".mp4")?"mp4":"m3u8"),f=c==="m3u8"?"HLS":c.toUpperCase(),p=[o],y=a.codec||s.detectedCodec;y&&y!=="H.264"&&p.push(y),p.push(f),a.bitrate&&p.push(a.bitrate);let n=a.audio||s.detectedAudio;n&&n!=="AAC 2.0"&&p.push(n);let k=a.details||p.join(" \u2022 "),m=`${e}
${k}`,h=`${o} \u2022 ${e}`,l={name:"han's 22",provider:"han's 22",title:e,description:m,url:a.url,quality:h,format:c};return a.headers&&Object.keys(a.headers).length>0&&(l.headers=a.headers),r&&r.length>0&&(l.subtitles=r),l}var _e="134e150d5b430204550809065940060f014441085852560f",ze={tr:{code:"tr",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",language:"English",name:"\u0130ngilizce"},eng:{code:"en",language:"English",name:"\u0130ngilizce"},de:{code:"de",language:"German",name:"Almanca"},fr:{code:"fr",language:"French",name:"Frans\u0131zca"},es:{code:"es",language:"Spanish",name:"\u0130spanyolca"},it:{code:"it",language:"Italian",name:"\u0130talyanca"},ar:{code:"ar",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",language:"Japanese",name:"Japonca"}};async function te(a,s,o,r){let t=Date.now();A("han's 22",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${a}, T\xFCr: ${s}, Sezon: ${o}, B\xF6l\xFCm: ${r}`);try{let i=String(a||"").trim(),u=String(s||"").toLowerCase().trim(),d=u==="tv"||u==="series",e=d?"tv":"movie",g=o!=null?parseInt(String(o),10):1,c=r!=null?parseInt(String(r),10):1,f=await ae(i,e),p=f.numericId?String(f.numericId):i,y=(f.titles||[]).filter(b=>b&&b.trim().length>0);if(y.length===0)return A("han's 22",`TMDB ba\u015Fl\u0131\u011F\u0131 \xE7\xF6z\xFClemedi: ${i}`),[];let n=await X("sabo");if(!n)return A("han's 22","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let k=n.replace(/^(https?:\/\/)(?:api\.)?/i,"$1").replace(/\/+$/,""),m={"User-Agent":N.DEFAULT_USER_AGENT,"Cf-Control":_e,language:"tr",site:"main",device:"browser",Origin:k,Referer:`${k}/`},h=[];for(let b of y){h.includes(b)||h.push(b);let z=b.split(":")[0].trim();z&&z.length>=3&&!h.includes(z)&&h.push(z);let v=b.split("-")[0].trim();v&&v.length>=3&&!h.includes(v)&&h.push(v)}let l=null,_="";for(let b of h)try{let z=`${n}/page/search?value=${encodeURIComponent(b)}&page=1`,v=await fetch(z,{headers:m});if(!v.ok)continue;let I=(await v.json())?.page?.data||[];for(let C of I){let w=C?.ID;if(!w)continue;let L=`${n}/anime/get?id=${w}`,E=await fetch(L,{headers:m});if(!E.ok)continue;let M=(await E.json())?.data;if(!M)continue;let F=String(M?.tmdb_id||"").trim(),ce=String(M?.name||"").toLowerCase().trim();if(F===p||F===i){l=String(w),_=M?.name||C?.name||b,A("han's 22",`[TMDB E\u015Fle\u015Fti!] ID: ${l}, \u0130sim: ${_}, TMDB: ${F}`);break}if(y.some(ue=>ue.toLowerCase().trim()===ce)){l=String(w),_=M?.name||C?.name||b,A("han's 22",`[Ba\u015Fl\u0131k E\u015Fle\u015Fti!] ID: ${l}, \u0130sim: ${_}`);break}}if(l)break}catch{}if(!l)return A("han's 22",`E\u015Fle\u015Fen anime bulunamad\u0131 -> TMDB: ${i}`),[];let D=e==="tv",T=null;if(D){let b=async(v,P)=>{try{let I=`${n}/anime/source?id=${l}&site=main&plan=1&season=${v}&episode=${P}&server=1`,C=await fetch(I,{headers:m});if(C.ok){let w=await C.json();if(w&&w.success)return w}}catch{}return null};T=(await se({providerName:"han's 22",tmdbNumericId:f.numericId,season:g,episode:c,isTv:d,minAbsoluteThreshold:100,fetcher:b,isValid:v=>!!(v&&v.success)})).data}else{let b=`${n}/anime/source?id=${l}&site=main&plan=1&server=1`,z=await fetch(b,{headers:m});z.ok&&(T=await z.json())}if(!T||!T.success)return A("han's 22",`B\xF6l\xFCm kayna\u011F\u0131 bulunamad\u0131 -> ${T?.msg||"Bilinmeyen hata"}`),[];let $=(T.subtitles||[]).map((b,z)=>{let v=String(b.group||"").toLowerCase().trim(),P=String(b.name||"").trim(),I=ze[v]||{code:v||"tr",language:"Turkish",name:"T\xFCrk\xE7e"},C=P||I.name;return{id:String(z),url:b.link,lang:I.code,language:I.language,name:C,label:C,title:C,type:"vtt",headers:{Referer:`${k}/`,"User-Agent":N.DEFAULT_USER_AGENT}}}),G=[],Y=(T.groups||[]).filter(b=>String(b?.group||"").toLowerCase().trim()!=="endub"),re=Y.length>1,V=1;for(let b of Y){let v=String(b.group||"").toLowerCase().trim()==="trdub",P=re?`han's 22 [${V}]`:"han's 22",I=v?"Dublaj":"Altyaz\u0131l\u0131";V++;let C=(b.items||[]).sort((w,L)=>(L.quality||0)-(w.quality||0));for(let w of C){let L=w.link;if(!L||typeof L!="string")continue;let E=parseInt(String(w.quality||1080),10),J=E===2160?"4K UHD":E===1440?"2K QHD":E===1080?"1080p":`${E}p`,M=w.type==="hls"||L.includes(".m3u8");G.push(oe({name:P,url:L,languageTitle:I,quality:J,format:M?"m3u8":"mp4",subtitles:v?[]:$,headers:{Referer:`${k}/`,"User-Agent":N.DEFAULT_USER_AGENT}}))}}let le=((Date.now()-t)/1e3).toFixed(2);return A("han's 22",`[Ad\u0131m 4/4] TAMAMLANDI: ${G.length} adet ak\u0131\u015F listelendi (${le}s)`,"success",G.map(b=>({server:b.name,kalite:b.quality,title:b.title}))),G}catch(i){return A("han's 22",`Hata olu\u015Ftu: ${i?.message||i}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=te);

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

;(()=>{const n="han's 22",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
