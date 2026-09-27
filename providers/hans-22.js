
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

"use strict";var K=Object.defineProperty;var he=Object.getOwnPropertyDescriptor;var fe=Object.getOwnPropertyNames;var be=Object.prototype.hasOwnProperty;var ye=(n,t)=>{for(var s in t)K(n,s,{get:t[s],enumerable:!0})},ke=(n,t,s,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of fe(t))!be.call(n,r)&&r!==s&&K(n,r,{get:()=>t[r],enumerable:!(o=he(t,r))||o.enumerable});return n};var Te=n=>ke(K({},"__esModule",{value:!0}),n);var De={};ye(De,{getStreams:()=>ue});module.exports=Te(De);function _(n,t,s="info",o){let r=`[${n}]`;s==="error"?console.error(r,t,o||""):s==="warn"?console.warn(r,t,o||""):console.log(r,t,o||"");try{let d=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof d=="string"&&d.startsWith("http")&&fetch(d,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:n,level:s,message:t,details:o})}).catch(()=>{})}catch{}}var ve=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(t=>String.fromCharCode(t^42)).join(""),G={REMOTE_CONFIG_URL:ve,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},O=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};try{typeof localStorage<"u"&&localStorage&&typeof localStorage.removeItem=="function"&&(localStorage.removeItem("__NUVIO_CONFIG_CACHE__"),localStorage.removeItem("__NUVIO_CONFIG_CACHE_V2__"))}catch{}var Q=10*1e3,_e=10*1e3;O.__NUVIO_CONFIG_STATE__||(O.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var S=O.__NUVIO_CONFIG_STATE__;async function X(){let n=Date.now(),t=[];try{let s=O.__NUVIO_DEV_LOG_URL__;typeof s=="string"&&s.includes("/api/log")&&t.push(s.replace("/api/log","/domains"))}catch{}t.push(G.REMOTE_CONFIG_URL);for(let s of t)try{let o=await fetch(s);if(o.ok){let r=await o.json(),i=r?.data??r,d=i.domains||i,h=i.cookies,e=i.tmdb_keys||i.tmdbKeys;d&&typeof d=="object"&&(S.cachedDomains={...S.cachedDomains,...d}),h&&typeof h=="object"&&(S.cachedCookies={...S.cachedCookies,...h}),Array.isArray(e)&&e.length>0&&(S.cachedTmdbKeys=e),S.lastFetchTime=n;return}}catch(o){_("Config",`Domain alinamadi (${s}): ${o.message}`,"warn")}S.lastFetchTime=n-Q+_e}async function Z(){let n=Date.now();(!(Object.keys(S.cachedDomains).length>0)||n-S.lastFetchTime>Q)&&(S.activeFetchPromise||(S.activeFetchPromise=X().finally(()=>{S.activeFetchPromise=null})),await S.activeFetchPromise)}async function ee(n){return await Z(),S.cachedDomains[n]||await X(),S.cachedDomains[n]||""}async function ae(){return await Z(),S.cachedTmdbKeys||[]}var Ae="a2f888b27315e62e471b2d587048f32e",ne=[Ae,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function j(n){let t=await ae(),s=t.length>0?[...t,...ne]:ne;for(let o=0;o<s.length;o++){let r=s[o],i=n.includes("?")?"&":"?",d=`https://api.themoviedb.org/3/${n}${i}api_key=${r}`;try{let h=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,e=await fetch(d,{signal:h});if(e.ok)return await e.json();if(e.status===429)continue}catch{}}return null}var V=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};V.__NUVIO_TMDB_CACHE__||(V.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var F=V.__NUVIO_TMDB_CACHE__,Re=F.imdbIdCache,x=F.tmdbTitlesCache,$e=F.tmdbImageCache,H=F.episodeGroupCache,q=F.absoluteEpCache;async function ie(n,t){let s=String(n||"").replace(/^tmdb:/i,"").trim();if(!s)return{titles:[]};let o=`${t}:${s}`;if(x.has(o))return x.get(o);let r=(async()=>{let i=[],d,h,e=[],m=[],c,g=[];try{let T=t==="tv"||t==="series",y=T?"tv":"movie";if(s.startsWith("tt")){let a=await j(`find/${s}?external_source=imdb_id`);if(a){let b=T?a?.tv_results?.[0]:a?.movie_results?.[0];b&&(d=b.id,b.overview&&(c=b.overview))}}else d=parseInt(s,10);if(d&&!isNaN(d)){let a=await j(`${y}/${d}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(a){if(a.overview&&(c=a.overview),a.title&&(i.push(a.title),a.title.includes(":"))){let l=a.title.split(":")[0].trim();l.length>2&&i.push(l)}if(a.name&&(i.push(a.name),a.name.includes(":"))){let l=a.name.split(":")[0].trim();l.length>2&&i.push(l)}if(a.original_title&&a.original_title!==a.title&&(i.push(a.original_title),a.original_title.includes(":"))){let l=a.original_title.split(":")[0].trim();l.length>2&&i.push(l)}if(a.original_name&&a.original_name!==a.name&&(i.push(a.original_name),a.original_name.includes(":"))){let l=a.original_name.split(":")[0].trim();l.length>2&&i.push(l)}if(a.translations?.translations&&Array.isArray(a.translations.translations))for(let l of a.translations.translations){let f=l.data?.name||l.data?.title;if(f&&typeof f=="string"&&(i.push(f),f.includes(":"))){let L=f.split(":")[0].trim();L.length>2&&i.push(L)}}let b=(a.alternative_titles?.results||a.alternative_titles?.titles||[]).map(l=>l.title).filter(Boolean);i.push(...b);let p=a.release_date||a.first_air_date;p&&(h=parseInt(p.split("-")[0],10)),a.genres&&Array.isArray(a.genres)&&(g=a.genres.map(l=>l.name).filter(Boolean)),a.credits?.cast&&Array.isArray(a.credits.cast)&&(e=a.credits.cast.slice(0,10).map(l=>l.name).filter(Boolean));let u=[];a.created_by&&Array.isArray(a.created_by)&&u.push(...a.created_by.map(l=>l.name).filter(Boolean)),a.credits?.crew&&Array.isArray(a.credits.crew)&&u.push(...a.credits.crew.filter(l=>l.job==="Director"||l.department==="Directing").map(l=>l.name).filter(Boolean)),m=Array.from(new Set(u))}}}catch{}return{numericId:d,titles:Array.from(new Set(i.filter(Boolean))),year:h,cast:e,creators:m,overview:c,genres:g}})();return x.set(o,r),r}async function se(n){if(H.has(n))return H.get(n);let t=(async()=>{try{let s=await j(`tv/${n}/episode_groups`);if(!s)return null;let r=(s.results||[]).find(c=>c.type===6||c.type===5||c.type===1||c.name?.toLowerCase().includes("season")||c.name?.toLowerCase().includes("arc")||c.name?.toLowerCase().includes("part")||c.name?.toLowerCase().includes("saga"));if(!r)return null;let i=await j(`tv/episode_group/${r.id}`);if(!i||!i.groups)return null;let d={},h=1,e={};return(i.groups||[]).sort((c,g)=>(c.order||0)-(g.order||0)).forEach((c,g)=>{let T=c.name||"",y=T.match(/Season\s+(\d+)/i),a=y?parseInt(y[1],10):c.order||g+1;a===0||T.toLowerCase().includes("specials")||T.toLowerCase().includes("\xF6zel")||(e[a]===void 0&&(e[a]=0),(c.episodes||[]).forEach(b=>{b.season_number!==0&&(e[a]++,d[h]={season:a,episode:e[a]},h++)}))}),d}catch{}return null})();return H.set(n,t),t}async function te(n,t,s){if(t<=1)return s;let o=`${n}:${t}:${s}`;if(q.has(o))return q.get(o);let r=(async()=>{try{let i=await j(`tv/${n}`);if(!i)return s;let h=(i.seasons||[]).filter(e=>e.season_number>0&&e.season_number<t).reduce((e,m)=>e+(m.episode_count||0),0);return s>h?s:h+s}catch{}return s})();return q.set(o,r),r}async function oe(n){let{providerName:t,tmdbNumericId:s,season:o,episode:r,isTv:i,minAbsoluteThreshold:d=24,fetcher:h,isValid:e}=n;try{let m=await h(o,r);if(e(m))return{data:m,resolvedSeason:o,resolvedEpisode:r,strategy:"direct"}}catch(m){_(t,`Do\u011Frudan b\xF6l\xFCm sorgusu hatas\u0131 (S${o}E${r}): ${m?.message||m}`,"warn")}if(!i||!s)return{data:null,resolvedSeason:o,resolvedEpisode:r,strategy:"none"};try{let m=await se(s);if(m){let c=m[r];if(c&&(c.season!==o||c.episode!==r)){_(t,`[TMDB Grup E\u015Fle\u015Fmesi] Sezon ${o} B\xF6l\xFCm ${r} -> Sezon ${c.season} B\xF6l\xFCm ${c.episode} olarak sorgulan\u0131yor...`,"info");let g=await h(c.season,c.episode);if(e(g))return{data:g,resolvedSeason:c.season,resolvedEpisode:c.episode,strategy:"group"}}}}catch(m){_(t,`TMDB grup e\u015Fle\u015Ftirme sorgusu hatas\u0131: ${m?.message||m}`,"warn")}if(o>1||r>d)try{let m=await te(s,o,r);if(m&&(m!==r||o!==1)){_(t,`[Mutlak B\xF6l\xFCm] Sezon ${o} B\xF6l\xFCm ${r} -> Mutlak B\xF6l\xFCm ${m} olarak Sezon 1 sorgulan\u0131yor...`,"info");let c=await h(1,m);if(e(c))return{data:c,resolvedSeason:1,resolvedEpisode:m,strategy:"absolute"}}}catch(m){_(t,`Mutlak b\xF6l\xFCm sorgusu hatas\u0131: ${m?.message||m}`,"warn")}return{data:null,resolvedSeason:o,resolvedEpisode:r,strategy:"none"}}var Se=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],re=["tr","tur","ota"],Ce=["english","ingilizce","original","orijinal","audio-en"],le=["en","eng","und"];function ze(n,t){let s=!1,o=!1,r=[],i,d,h,e=(t||"").toLowerCase();if(e.includes("trdual")||e.includes("dual")||e.includes("trdub")||e.includes("dublaj")?(s=!0,o=!0):(e.includes("ses-tr")||e.includes("turkcedublaj")||e.includes("turkce-dublaj"))&&(s=!0),e.includes("2160p")||e.includes("4k")||e.includes("uhd")?i="4K":e.includes("1080p")||e.includes("1920x1080")||e.includes("fhd")?i="1080p":e.includes("720p")||e.includes("1280x720")||e.includes("hd")?i="720p":(e.includes("480p")||e.includes("854x480")||e.includes("sd"))&&(i="480p"),e.includes("hevc")||e.includes("h265")||e.includes("x265")?d="HEVC":e.includes("av1")?d="AV1":(e.includes("h264")||e.includes("x264")||e.includes("avc"))&&(d="H.264"),e.includes("5.1")||e.includes("eac3")||e.includes("ac3")||e.includes("ddp")?h="Dolby 5.1":(e.includes("7.1")||e.includes("atmos"))&&(h="Dolby Atmos 7.1"),n&&typeof n=="string"){let c=n.split(/\r?\n/),g=0;for(let T of c){let y=T.trim();if(y.startsWith("#EXT-X-MEDIA:")&&y.includes("TYPE=AUDIO")){let a=y.match(/NAME=["']([^"']+)["']/i),b=y.match(/LANGUAGE=["']([^"']+)["']/i),p=y.match(/GROUP-ID=["']([^"']+)["']/i),u=(a?a[1]:"").toLowerCase(),l=(b?b[1]:"").toLowerCase(),f=(p?p[1]:"").toLowerCase(),L=u.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),A=f.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),E=re.includes(l)||re.some(w=>L.includes(w)||A.includes(w))||Se.some(w=>u.includes(w)||f.includes(w))||u.includes("t\xFCrk")||u.includes("turk")||f.includes("dual"),R=le.includes(l)||le.some(w=>L.includes(w)||A.includes(w))||Ce.some(w=>u.includes(w)||f.includes(w))||u.includes("orig")||u.includes("ing")||u.includes("eng");E&&(s=!0),R&&(o=!0)}if(y.startsWith("#EXT-X-MEDIA:")&&y.includes("TYPE=SUBTITLES")){let a=y.match(/URI=["']([^"']+)["']/i),b=y.match(/NAME=["']([^"']+)["']/i),p=y.match(/LANGUAGE=["']([^"']+)["']/i);if(a&&a[1]){let u=a[1];if(t&&!u.startsWith("http"))try{u=new URL(u,t).toString()}catch{}let l=b?b[1]:"Altyaz\u0131",f=p?p[1].toLowerCase():"";f==="st"||f==="sot"||l.toLowerCase().includes("sotho")||l.toLowerCase().includes("sesotho")||u.toLowerCase().includes("sub_st")?(f="tr",l="T\xFCrk\xE7e"):f||(f=l.toLowerCase().includes("t\xFCrk")?"tr":"und");let A=we(f,l);r.push({label:A.name||l,url:u,lang:A.code||f})}}if(y.startsWith("#EXT-X-STREAM-INF:")){let a=y.match(/RESOLUTION=(\d+)x(\d+)/i);if(a){let b=parseInt(a[1],10),p=parseInt(a[2],10),u=Math.min(b,p),l=Math.max(b,p),f=u>=2100||l>=3800?2160:u>=1400||l>=2500?1440:u>=1e3||l>=1900?1080:u>=700||l>=1200?720:u>=450?480:u;f>g&&(g=f)}else{let b=y.match(/NAME=["']?([^"',\s]+)["']?/i);if(b){let p=b[1].toLowerCase();p.includes("2160")||p.includes("4k")?2160>g&&(g=2160):p.includes("1440")||p.includes("2k")?1440>g&&(g=1440):p.includes("1080")?1080>g&&(g=1080):p.includes("720")&&720>g&&(g=720)}}}}g>=2160?i="4K":g>=1440?i="2K":g>=1080?i="1080p":g>=720?i="720p":g>=480&&(i="480p")}let m=s&&o||e.includes("dual")||e.includes("trdual");return{hasTurkishAudio:s,hasOriginalAudio:o,isDual:m,embeddedSubtitles:r,detectedQuality:i,detectedCodec:d,detectedAudio:h}}var N={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function we(n,t,s){let o=p=>(p||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),r=o(n||""),i=o(t||""),d=!!s||r.includes("forced")||i.includes("forced")||r.includes("zorunlu")||i.includes("zorunlu"),h=r.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),e=i.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),m=p=>{let u=p.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return d?`${u} (Zorunlu)`:u};if(h==="st"||h==="sot"||h.includes("sotho")||e.includes("sotho")||e.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:d?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let c=N[r]||N[i]||N[h]||N[e];if(!c){let p=(e+" "+h).split(/\s+/).filter(Boolean);for(let u of p)if(N[u]){c=N[u];break}}if(!c){for(let[p,u]of Object.entries(N))if(p.length>=4&&(e.includes(p)||h.includes(p))){c=u;break}}if(c)return{code:c.code,iso3:c.iso3,language:c.language,name:m(c.name)};let g=(t||n||"Altyaz\u0131").trim();g=g.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let T=g.charAt(0).toUpperCase()+g.slice(1),y=m(T),a=r&&r.length===2?r:i&&i.length===2?i:"und",b=r&&r.length===3?r:i&&i.length===3?i:"und";return{code:a,iso3:b,language:T,name:y}}function ce(n){let t=n.url?ze(void 0,n.url):{},s=n.quality||n.inspection?.detectedQuality||t.detectedQuality||"1080p";s.includes("\u2022")&&(s=s.split("\u2022")[0].trim()),!s.includes("p")&&!s.includes("K")&&!s.includes("k")&&(s=`${s}p`);let o=n.subtitles||n.inspection?.subtitles,r=!!(n.inspection?.hasTurkishSubtitles||o?.some(f=>{let L=(f.lang||f.code||"").toLowerCase(),A=(f.langCode||f.iso3||"").toLowerCase(),E=(f.name||f.label||f.title||"").toLowerCase();return L==="tr"||L==="st"||A==="tur"||A==="sot"||E.includes("t\xFCrk")||E.includes("turk")||E.includes("sotho")})),i=(n.languageTitle||n.inspection?.languageTitle||"").toLowerCase().trim(),d=i.includes("dub")||i.includes("ses")||i.includes("dual")||!!t.hasTurkishAudio||!!n.inspection?.hasTurkishAudio,h=i.includes("dual")||i.includes("dub")&&(i.includes("alt")||i.includes("sub"))||d&&r,e="Orijinal";i.includes("yerli")||n.inspection?.isYerli?e="Yerli":h?e="Dublaj / Altyaz\u0131l\u0131":d?e="Dublaj":r||i.includes("alt")||i.includes("sub")?e="Altyaz\u0131l\u0131":(i.includes("orijinal")||i.includes("yabanc\u0131")||i.includes("original"))&&(e="Orijinal");let m=n.format==="m3u8"||n.url.includes(".m3u8")||n.url.includes("/master.")||n.url.includes("/hls/")||n.url.includes("/txt/"),c=n.format||(m?"m3u8":n.url.includes(".mp4")?"mp4":"m3u8"),g=c==="m3u8"?"HLS":c.toUpperCase(),T=[s],y=n.codec||n.inspection?.detectedCodec||t.detectedCodec;y&&y!=="H.264"&&T.push(y),T.push(g),n.bitrate&&T.push(n.bitrate);let a=n.audio||n.inspection?.detectedAudio||t.detectedAudio;a&&a!=="AAC 2.0"&&T.push(a);let b=n.details||T.join(" \u2022 "),p=`${e}
${b}`,u=`${s} \u2022 ${e}`,l={name:"han's 22",provider:"han's 22",title:e,description:p,url:n.url,quality:u,format:c};return n.headers&&Object.keys(n.headers).length>0&&(l.headers=n.headers),o&&o.length>0&&(l.subtitles=o),l}var Ie="134e150d5b430204550809065940060f014441085852560f",Le={tr:{code:"tr",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",language:"English",name:"\u0130ngilizce"},eng:{code:"en",language:"English",name:"\u0130ngilizce"},de:{code:"de",language:"German",name:"Almanca"},fr:{code:"fr",language:"French",name:"Frans\u0131zca"},es:{code:"es",language:"Spanish",name:"\u0130spanyolca"},it:{code:"it",language:"Italian",name:"\u0130talyanca"},ar:{code:"ar",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",language:"Japanese",name:"Japonca"}};async function ue(n,t,s,o){let r=Date.now();_("han's 22",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${n}, T\xFCr: ${t}, Sezon: ${s}, B\xF6l\xFCm: ${o}`);try{let i=String(n||"").trim(),d=String(t||"").toLowerCase().trim(),h=d==="tv"||d==="series",e=h?"tv":"movie",m=s!=null?parseInt(String(s),10):1,c=o!=null?parseInt(String(o),10):1,g=await ie(i,e),T=g.numericId?String(g.numericId):i,y=(g.titles||[]).filter(k=>k&&k.trim().length>0);if(y.length===0)return _("han's 22",`TMDB ba\u015Fl\u0131\u011F\u0131 \xE7\xF6z\xFClemedi: ${i}`),[];let a=await ee("sabo");if(!a)return _("han's 22","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let b=a.replace(/^(https?:\/\/)(?:api\.)?/i,"$1").replace(/\/+$/,""),p={"User-Agent":G.DEFAULT_USER_AGENT,"Cf-Control":Ie,language:"tr",site:"main",device:"browser",Origin:b,Referer:`${b}/`},u=[];for(let k of y){u.includes(k)||u.push(k);let C=k.split(":")[0].trim();C&&C.length>=3&&!u.includes(C)&&u.push(C);let v=k.split("-")[0].trim();v&&v.length>=3&&!u.includes(v)&&u.push(v)}let l=null,f="";for(let k of u)try{let C=`${a}/page/search?value=${encodeURIComponent(k)}&page=1`,v=await fetch(C,{headers:p});if(!v.ok)continue;let D=(await v.json())?.page?.data||[];for(let I of D){let z=I?.ID;if(!z)continue;let M=`${a}/anime/get?id=${z}`,B=await fetch(M,{headers:p});if(!B.ok)continue;let P=(await B.json())?.data;if(!P)continue;let U=String(P?.tmdb_id||"").trim(),me=String(P?.name||"").toLowerCase().trim();if(U===T||U===i){l=String(z),f=P?.name||I?.name||k,_("han's 22",`[TMDB E\u015Fle\u015Fti!] ID: ${l}, \u0130sim: ${f}, TMDB: ${U}`);break}if(y.some(pe=>pe.toLowerCase().trim()===me)){l=String(z),f=P?.name||I?.name||k,_("han's 22",`[Ba\u015Fl\u0131k E\u015Fle\u015Fti!] ID: ${l}, \u0130sim: ${f}`);break}}if(l)break}catch{}if(!l)return _("han's 22",`E\u015Fle\u015Fen anime bulunamad\u0131 -> TMDB: ${i}`),[];let L=e==="tv",A=null;if(L){let k=async(v,$)=>{try{let D=`${a}/anime/source?id=${l}&site=main&plan=1&season=${v}&episode=${$}&server=1`,I=await fetch(D,{headers:p});if(I.ok){let z=await I.json();if(z&&z.success)return z}}catch{}return null};A=(await oe({providerName:"han's 22",tmdbNumericId:g.numericId,season:m,episode:c,isTv:h,minAbsoluteThreshold:100,fetcher:k,isValid:v=>!!(v&&v.success)})).data}else{let k=`${a}/anime/source?id=${l}&site=main&plan=1&server=1`,C=await fetch(k,{headers:p});C.ok&&(A=await C.json())}if(!A||!A.success)return _("han's 22",`B\xF6l\xFCm kayna\u011F\u0131 bulunamad\u0131 -> ${A?.msg||"Bilinmeyen hata"}`),[];let E=(A.subtitles||[]).map((k,C)=>{let v=String(k.group||"").toLowerCase().trim(),$=String(k.name||"").trim(),D=Le[v]||{code:v||"tr",language:"Turkish",name:"T\xFCrk\xE7e"},I=$||D.name;return{id:String(C),url:k.link,lang:D.code,language:D.language,name:I,label:I,title:I,type:"vtt",headers:{Referer:`${b}/`,"User-Agent":G.DEFAULT_USER_AGENT}}}),R=[],Y=(A.groups||[]).filter(k=>String(k?.group||"").toLowerCase().trim()!=="endub"),ge=Y.length>1,J=1;for(let k of Y){let v=String(k.group||"").toLowerCase().trim()==="trdub",$=ge?`han's 22 [${J}]`:"han's 22",D=v?"Dublaj":"Altyaz\u0131l\u0131";J++;let I=(k.items||[]).sort((z,M)=>(M.quality||0)-(z.quality||0));for(let z of I){let M=z.link;if(!M||typeof M!="string")continue;let B=parseInt(String(z.quality||1080),10),W=B===2160?"4K UHD":B===1440?"2K QHD":B===1080?"1080p":`${B}p`,P=z.type==="hls"||M.includes(".m3u8");R.push(ce({name:$,url:M,languageTitle:D,quality:W,format:P?"m3u8":"mp4",subtitles:v?[]:E,headers:{Referer:`${b}/`,"User-Agent":G.DEFAULT_USER_AGENT}}))}}let de=((Date.now()-r)/1e3).toFixed(2);return _("han's 22",`[Ad\u0131m 4/4] TAMAMLANDI: ${R.length} adet ak\u0131\u015F listelendi (${de}s)`,"success",R.map(k=>({server:k.name,kalite:k.quality,title:k.title}))),R}catch(i){return _("han's 22",`Hata olu\u015Ftu: ${i?.message||i}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=ue);

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
