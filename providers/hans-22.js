
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

"use strict";var O=Object.defineProperty;var he=Object.getOwnPropertyDescriptor;var fe=Object.getOwnPropertyNames;var be=Object.prototype.hasOwnProperty;var ye=(e,s)=>{for(var t in s)O(e,t,{get:s[t],enumerable:!0})},ke=(e,s,t,r)=>{if(s&&typeof s=="object"||typeof s=="function")for(let o of fe(s))!be.call(e,o)&&o!==t&&O(e,o,{get:()=>s[o],enumerable:!(r=he(s,o))||r.enumerable});return e};var Te=e=>ke(O({},"__esModule",{value:!0}),e);var Ie={};ye(Ie,{getStreams:()=>ue});module.exports=Te(Ie);var ve=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(s=>String.fromCharCode(s^42)).join(""),j={REMOTE_CONFIG_URL:ve,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},Q={imu:"https://ha.vixolity.com",kalgara:"https://dizibal.org",garling:"https://liderfilmizle.vip"},x=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};x.__NUVIO_CONFIG_STATE__||(x.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var A=x.__NUVIO_CONFIG_STATE__,Ae=10*60*1e3;async function X(){let e=Date.now();try{let s={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let r=AbortSignal.timeout(8e3);r&&(s.signal=r)}catch{}let t=await fetch(`${j.REMOTE_CONFIG_URL}?_t=${e}`,s);if(t.ok){let r=await t.json(),o=r?.data??r,n=o.domains||o,d=o.cookies,h=o.tmdb_keys||o.tmdbKeys;n&&typeof n=="object"&&(A.cachedDomains={...A.cachedDomains,...n}),d&&typeof d=="object"&&(A.cachedCookies={...A.cachedCookies,...d}),Array.isArray(h)&&h.length>0&&(A.cachedTmdbKeys=h),A.lastFetchTime=e}else A.lastFetchTime=0}catch{A.lastFetchTime=0}}async function Z(){let e=Date.now();(!(Object.keys(A.cachedDomains).length>0)||e-A.lastFetchTime>Ae)&&(A.activeFetchPromise||(A.activeFetchPromise=X().finally(()=>{A.activeFetchPromise=null})),await A.activeFetchPromise)}async function ee(e){await Z();let s=A.cachedDomains[e]||Q[e]||"";return s||(await X(),s=A.cachedDomains[e]||Q[e]||""),s}async function ae(){return await Z(),A.cachedTmdbKeys||[]}var Se="a2f888b27315e62e471b2d587048f32e",ne=[Se,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function G(e){let s=await ae(),t=s.length>0?[...s,...ne]:ne;for(let r=0;r<t.length;r++){let o=t[r],n=e.includes("?")?"&":"?",d=`https://api.themoviedb.org/3/${e}${n}api_key=${o}`;try{let h=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,i=await fetch(d,{signal:h});if(i.ok)return await i.json();if(i.status===429)continue}catch{}}return null}var Y=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};Y.__NUVIO_TMDB_CACHE__||(Y.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var F=Y.__NUVIO_TMDB_CACHE__,Pe=F.imdbIdCache,K=F.tmdbTitlesCache,Ne=F.tmdbImageCache,H=F.episodeGroupCache,q=F.absoluteEpCache;async function ie(e,s){let t=String(e||"").replace(/^tmdb:/i,"").trim();if(!t)return{titles:[]};let r=`${s}:${t}`;if(K.has(r))return K.get(r);let o=(async()=>{let n=[],d,h,i=[],m=[],c,g=[];try{let T=s==="tv"||s==="series",y=T?"tv":"movie";if(t.startsWith("tt")){let a=await G(`find/${t}?external_source=imdb_id`);if(a){let b=T?a?.tv_results?.[0]:a?.movie_results?.[0];b&&(d=b.id,b.overview&&(c=b.overview))}}else d=parseInt(t,10);if(d&&!isNaN(d)){let a=await G(`${y}/${d}?language=tr-TR&append_to_response=credits,alternative_titles,translations`);if(a){if(a.overview&&(c=a.overview),a.title&&(n.push(a.title),a.title.includes(":"))){let l=a.title.split(":")[0].trim();l.length>2&&n.push(l)}if(a.name&&(n.push(a.name),a.name.includes(":"))){let l=a.name.split(":")[0].trim();l.length>2&&n.push(l)}if(a.original_title&&a.original_title!==a.title&&(n.push(a.original_title),a.original_title.includes(":"))){let l=a.original_title.split(":")[0].trim();l.length>2&&n.push(l)}if(a.original_name&&a.original_name!==a.name&&(n.push(a.original_name),a.original_name.includes(":"))){let l=a.original_name.split(":")[0].trim();l.length>2&&n.push(l)}if(a.translations?.translations&&Array.isArray(a.translations.translations))for(let l of a.translations.translations){let f=l.data?.name||l.data?.title;if(f&&typeof f=="string"&&(n.push(f),f.includes(":"))){let L=f.split(":")[0].trim();L.length>2&&n.push(L)}}let b=(a.alternative_titles?.results||a.alternative_titles?.titles||[]).map(l=>l.title).filter(Boolean);n.push(...b);let p=a.release_date||a.first_air_date;p&&(h=parseInt(p.split("-")[0],10)),a.genres&&Array.isArray(a.genres)&&(g=a.genres.map(l=>l.name).filter(Boolean)),a.credits?.cast&&Array.isArray(a.credits.cast)&&(i=a.credits.cast.slice(0,10).map(l=>l.name).filter(Boolean));let u=[];a.created_by&&Array.isArray(a.created_by)&&u.push(...a.created_by.map(l=>l.name).filter(Boolean)),a.credits?.crew&&Array.isArray(a.credits.crew)&&u.push(...a.credits.crew.filter(l=>l.job==="Director"||l.department==="Directing").map(l=>l.name).filter(Boolean)),m=Array.from(new Set(u))}}}catch{}return{numericId:d,titles:Array.from(new Set(n.filter(Boolean))),year:h,cast:i,creators:m,overview:c,genres:g}})();return K.set(r,o),o}async function se(e){if(H.has(e))return H.get(e);let s=(async()=>{try{let t=await G(`tv/${e}/episode_groups`);if(!t)return null;let o=(t.results||[]).find(c=>c.type===6||c.type===5||c.type===1||c.name?.toLowerCase().includes("season")||c.name?.toLowerCase().includes("arc")||c.name?.toLowerCase().includes("part")||c.name?.toLowerCase().includes("saga"));if(!o)return null;let n=await G(`tv/episode_group/${o.id}`);if(!n||!n.groups)return null;let d={},h=1,i={};return(n.groups||[]).sort((c,g)=>(c.order||0)-(g.order||0)).forEach((c,g)=>{let T=c.name||"",y=T.match(/Season\s+(\d+)/i),a=y?parseInt(y[1],10):c.order||g+1;a===0||T.toLowerCase().includes("specials")||T.toLowerCase().includes("\xF6zel")||(i[a]===void 0&&(i[a]=0),(c.episodes||[]).forEach(b=>{b.season_number!==0&&(i[a]++,d[h]={season:a,episode:i[a]},h++)}))}),d}catch{}return null})();return H.set(e,s),s}async function te(e,s,t){if(s<=1)return t;let r=`${e}:${s}:${t}`;if(q.has(r))return q.get(r);let o=(async()=>{try{let n=await G(`tv/${e}`);if(!n)return t;let h=(n.seasons||[]).filter(i=>i.season_number>0&&i.season_number<s).reduce((i,m)=>i+(m.episode_count||0),0);return t>h?t:h+t}catch{}return t})();return q.set(r,o),o}function _(e,s,t="info",r){let o=`[${e}]`;t==="error"?console.error(o,s,r||""):t==="warn"?console.warn(o,s,r||""):console.log(o,s,r||"");try{let d=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof d=="string"&&d.startsWith("http")&&fetch(d,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:t,message:s,details:r})}).catch(()=>{})}catch{}}async function oe(e){let{providerName:s,tmdbNumericId:t,season:r,episode:o,isTv:n,minAbsoluteThreshold:d=24,fetcher:h,isValid:i}=e;try{let m=await h(r,o);if(i(m))return{data:m,resolvedSeason:r,resolvedEpisode:o,strategy:"direct"}}catch(m){_(s,`Do\u011Frudan b\xF6l\xFCm sorgusu hatas\u0131 (S${r}E${o}): ${m?.message||m}`,"warn")}if(!n||!t)return{data:null,resolvedSeason:r,resolvedEpisode:o,strategy:"none"};try{let m=await se(t);if(m){let c=m[o];if(c&&(c.season!==r||c.episode!==o)){_(s,`[TMDB Grup E\u015Fle\u015Fmesi] Sezon ${r} B\xF6l\xFCm ${o} -> Sezon ${c.season} B\xF6l\xFCm ${c.episode} olarak sorgulan\u0131yor...`,"info");let g=await h(c.season,c.episode);if(i(g))return{data:g,resolvedSeason:c.season,resolvedEpisode:c.episode,strategy:"group"}}}}catch(m){_(s,`TMDB grup e\u015Fle\u015Ftirme sorgusu hatas\u0131: ${m?.message||m}`,"warn")}if(r>1||o>d)try{let m=await te(t,r,o);if(m&&(m!==o||r!==1)){_(s,`[Mutlak B\xF6l\xFCm] Sezon ${r} B\xF6l\xFCm ${o} -> Mutlak B\xF6l\xFCm ${m} olarak Sezon 1 sorgulan\u0131yor...`,"info");let c=await h(1,m);if(i(c))return{data:c,resolvedSeason:1,resolvedEpisode:m,strategy:"absolute"}}}catch(m){_(s,`Mutlak b\xF6l\xFCm sorgusu hatas\u0131: ${m?.message||m}`,"warn")}return{data:null,resolvedSeason:r,resolvedEpisode:o,strategy:"none"}}var _e=["t\xFCrk\xE7e","turkish","turkce","dublaj","trdual","trdub","ses-tr","audio-tr","tr-dub"],re=["tr","tur","ota"],ze=["english","ingilizce","original","orijinal","audio-en"],le=["en","eng","und"];function Ce(e,s){let t=!1,r=!1,o=[],n,d,h,i=(s||"").toLowerCase();if(i.includes("trdual")||i.includes("dual")||i.includes("trdub")||i.includes("dublaj")?(t=!0,r=!0):(i.includes("ses-tr")||i.includes("turkcedublaj")||i.includes("turkce-dublaj"))&&(t=!0),i.includes("2160p")||i.includes("4k")||i.includes("uhd")?n="4K":i.includes("1080p")||i.includes("1920x1080")||i.includes("fhd")?n="1080p":i.includes("720p")||i.includes("1280x720")||i.includes("hd")?n="720p":(i.includes("480p")||i.includes("854x480")||i.includes("sd"))&&(n="480p"),i.includes("hevc")||i.includes("h265")||i.includes("x265")?d="HEVC":i.includes("av1")?d="AV1":(i.includes("h264")||i.includes("x264")||i.includes("avc"))&&(d="H.264"),i.includes("5.1")||i.includes("eac3")||i.includes("ac3")||i.includes("ddp")?h="Dolby 5.1":(i.includes("7.1")||i.includes("atmos"))&&(h="Dolby Atmos 7.1"),e&&typeof e=="string"){let c=e.split(/\r?\n/),g=0;for(let T of c){let y=T.trim();if(y.startsWith("#EXT-X-MEDIA:")&&y.includes("TYPE=AUDIO")){let a=y.match(/NAME=["']([^"']+)["']/i),b=y.match(/LANGUAGE=["']([^"']+)["']/i),p=y.match(/GROUP-ID=["']([^"']+)["']/i),u=(a?a[1]:"").toLowerCase(),l=(b?b[1]:"").toLowerCase(),f=(p?p[1]:"").toLowerCase(),L=u.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),S=f.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),E=re.includes(l)||re.some(w=>L.includes(w)||S.includes(w))||_e.some(w=>u.includes(w)||f.includes(w))||u.includes("t\xFCrk")||u.includes("turk")||f.includes("dual"),R=le.includes(l)||le.some(w=>L.includes(w)||S.includes(w))||ze.some(w=>u.includes(w)||f.includes(w))||u.includes("orig")||u.includes("ing")||u.includes("eng");E&&(t=!0),R&&(r=!0)}if(y.startsWith("#EXT-X-MEDIA:")&&y.includes("TYPE=SUBTITLES")){let a=y.match(/URI=["']([^"']+)["']/i),b=y.match(/NAME=["']([^"']+)["']/i),p=y.match(/LANGUAGE=["']([^"']+)["']/i);if(a&&a[1]){let u=a[1];if(s&&!u.startsWith("http"))try{u=new URL(u,s).toString()}catch{}let l=b?b[1]:"Altyaz\u0131",f=p?p[1].toLowerCase():"";f==="st"||f==="sot"||l.toLowerCase().includes("sotho")||l.toLowerCase().includes("sesotho")||u.toLowerCase().includes("sub_st")?(f="tr",l="T\xFCrk\xE7e"):f||(f=l.toLowerCase().includes("t\xFCrk")?"tr":"und");let S=we(f,l);o.push({label:S.name||l,url:u,lang:S.code||f})}}if(y.startsWith("#EXT-X-STREAM-INF:")){let a=y.match(/RESOLUTION=(\d+)x(\d+)/i);if(a){let b=parseInt(a[1],10),p=parseInt(a[2],10),u=Math.min(b,p),l=Math.max(b,p),f=u>=2100||l>=3800?2160:u>=1400||l>=2500?1440:u>=1e3||l>=1900?1080:u>=700||l>=1200?720:u>=450?480:u;f>g&&(g=f)}else{let b=y.match(/NAME=["']?([^"',\s]+)["']?/i);if(b){let p=b[1].toLowerCase();p.includes("2160")||p.includes("4k")?2160>g&&(g=2160):p.includes("1440")||p.includes("2k")?1440>g&&(g=1440):p.includes("1080")?1080>g&&(g=1080):p.includes("720")&&720>g&&(g=720)}}}}g>=2160?n="4K":g>=1440?n="2K":g>=1080?n="1080p":g>=720?n="720p":g>=480&&(n="480p")}let m=t&&r||i.includes("dual")||i.includes("trdual");return{hasTurkishAudio:t,hasOriginalAudio:r,isDual:m,embeddedSubtitles:o,detectedQuality:n,detectedCodec:d,detectedAudio:h}}var N={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function we(e,s,t){let r=p=>(p||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),o=r(e||""),n=r(s||""),d=!!t||o.includes("forced")||n.includes("forced")||o.includes("zorunlu")||n.includes("zorunlu"),h=o.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),i=n.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),m=p=>{let u=p.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return d?`${u} (Zorunlu)`:u};if(h==="st"||h==="sot"||h.includes("sotho")||i.includes("sotho")||i.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:d?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let c=N[o]||N[n]||N[h]||N[i];if(!c){let p=(i+" "+h).split(/\s+/).filter(Boolean);for(let u of p)if(N[u]){c=N[u];break}}if(!c){for(let[p,u]of Object.entries(N))if(p.length>=4&&(i.includes(p)||h.includes(p))){c=u;break}}if(c)return{code:c.code,iso3:c.iso3,language:c.language,name:m(c.name)};let g=(s||e||"Altyaz\u0131").trim();g=g.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let T=g.charAt(0).toUpperCase()+g.slice(1),y=m(T),a=o&&o.length===2?o:n&&n.length===2?n:"und",b=o&&o.length===3?o:n&&n.length===3?n:"und";return{code:a,iso3:b,language:T,name:y}}function ce(e){let s=e.url?Ce(void 0,e.url):{},t=e.quality||e.inspection?.detectedQuality||s.detectedQuality||"1080p";t.includes("\u2022")&&(t=t.split("\u2022")[0].trim()),!t.includes("p")&&!t.includes("K")&&!t.includes("k")&&(t=`${t}p`);let r=e.subtitles||e.inspection?.subtitles,o=!!(e.inspection?.hasTurkishSubtitles||r?.some(f=>{let L=(f.lang||f.code||"").toLowerCase(),S=(f.langCode||f.iso3||"").toLowerCase(),E=(f.name||f.label||f.title||"").toLowerCase();return L==="tr"||L==="st"||S==="tur"||S==="sot"||E.includes("t\xFCrk")||E.includes("turk")||E.includes("sotho")})),n=(e.languageTitle||e.inspection?.languageTitle||"").toLowerCase().trim(),d=n.includes("dub")||n.includes("ses")||n.includes("dual")||!!s.hasTurkishAudio||!!e.inspection?.hasTurkishAudio,h=n.includes("dual")||n.includes("dub")&&(n.includes("alt")||n.includes("sub"))||d&&o,i="Orijinal";n.includes("yerli")||e.inspection?.isYerli?i="Yerli":h?i="Dublaj / Altyaz\u0131l\u0131":d?i="Dublaj":o||n.includes("alt")||n.includes("sub")?i="Altyaz\u0131l\u0131":(n.includes("orijinal")||n.includes("yabanc\u0131")||n.includes("original"))&&(i="Orijinal");let m=e.format==="m3u8"||e.url.includes(".m3u8")||e.url.includes("/master.")||e.url.includes("/hls/")||e.url.includes("/txt/"),c=e.format||(m?"m3u8":e.url.includes(".mp4")?"mp4":"m3u8"),g=c==="m3u8"?"HLS":c.toUpperCase(),T=[t],y=e.codec||e.inspection?.detectedCodec||s.detectedCodec;y&&y!=="H.264"&&T.push(y),T.push(g),e.bitrate&&T.push(e.bitrate);let a=e.audio||e.inspection?.detectedAudio||s.detectedAudio;a&&a!=="AAC 2.0"&&T.push(a);let b=e.details||T.join(" \u2022 "),p=`${i}
${b}`,u=`${t} \u2022 ${i}`,l={name:"han's 22",provider:"han's 22",title:i,description:p,url:e.url,quality:u,format:c};return e.headers&&Object.keys(e.headers).length>0&&(l.headers=e.headers),r&&r.length>0&&(l.subtitles=r),l}var De="134e150d5b430204550809065940060f014441085852560f",Le={tr:{code:"tr",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",language:"English",name:"\u0130ngilizce"},eng:{code:"en",language:"English",name:"\u0130ngilizce"},de:{code:"de",language:"German",name:"Almanca"},fr:{code:"fr",language:"French",name:"Frans\u0131zca"},es:{code:"es",language:"Spanish",name:"\u0130spanyolca"},it:{code:"it",language:"Italian",name:"\u0130talyanca"},ar:{code:"ar",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",language:"Japanese",name:"Japonca"}};async function ue(e,s,t,r){let o=Date.now();_("han's 22",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${e}, T\xFCr: ${s}, Sezon: ${t}, B\xF6l\xFCm: ${r}`);try{let n=String(e||"").trim(),d=String(s||"").toLowerCase().trim(),h=d==="tv"||d==="series",i=h?"tv":"movie",m=t!=null?parseInt(String(t),10):1,c=r!=null?parseInt(String(r),10):1,g=await ie(n,i),T=g.numericId?String(g.numericId):n,y=(g.titles||[]).filter(k=>k&&k.trim().length>0);if(y.length===0)return _("han's 22",`TMDB ba\u015Fl\u0131\u011F\u0131 \xE7\xF6z\xFClemedi: ${n}`),[];let a=await ee("sabo");if(!a)return _("han's 22","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let b=a.replace(/^(https?:\/\/)(?:api\.)?/i,"$1").replace(/\/+$/,""),p={"User-Agent":j.DEFAULT_USER_AGENT,"Cf-Control":De,language:"tr",site:"main",device:"browser",Origin:b,Referer:`${b}/`},u=[];for(let k of y){u.includes(k)||u.push(k);let z=k.split(":")[0].trim();z&&z.length>=3&&!u.includes(z)&&u.push(z);let v=k.split("-")[0].trim();v&&v.length>=3&&!u.includes(v)&&u.push(v)}let l=null,f="";for(let k of u)try{let z=`${a}/page/search?value=${encodeURIComponent(k)}&page=1`,v=await fetch(z,{headers:p});if(!v.ok)continue;let I=(await v.json())?.page?.data||[];for(let D of I){let C=D?.ID;if(!C)continue;let M=`${a}/anime/get?id=${C}`,B=await fetch(M,{headers:p});if(!B.ok)continue;let P=(await B.json())?.data;if(!P)continue;let U=String(P?.tmdb_id||"").trim(),me=String(P?.name||"").toLowerCase().trim();if(U===T||U===n){l=String(C),f=P?.name||D?.name||k,_("han's 22",`[TMDB E\u015Fle\u015Fti!] ID: ${l}, \u0130sim: ${f}, TMDB: ${U}`);break}if(y.some(pe=>pe.toLowerCase().trim()===me)){l=String(C),f=P?.name||D?.name||k,_("han's 22",`[Ba\u015Fl\u0131k E\u015Fle\u015Fti!] ID: ${l}, \u0130sim: ${f}`);break}}if(l)break}catch{}if(!l)return _("han's 22",`E\u015Fle\u015Fen anime bulunamad\u0131 -> TMDB: ${n}`),[];let L=i==="tv",S=null;if(L){let k=async(v,$)=>{try{let I=`${a}/anime/source?id=${l}&site=main&plan=1&season=${v}&episode=${$}&server=1`,D=await fetch(I,{headers:p});if(D.ok){let C=await D.json();if(C&&C.success)return C}}catch{}return null};S=(await oe({providerName:"han's 22",tmdbNumericId:g.numericId,season:m,episode:c,isTv:h,minAbsoluteThreshold:100,fetcher:k,isValid:v=>!!(v&&v.success)})).data}else{let k=`${a}/anime/source?id=${l}&site=main&plan=1&server=1`,z=await fetch(k,{headers:p});z.ok&&(S=await z.json())}if(!S||!S.success)return _("han's 22",`B\xF6l\xFCm kayna\u011F\u0131 bulunamad\u0131 -> ${S?.msg||"Bilinmeyen hata"}`),[];let E=(S.subtitles||[]).map((k,z)=>{let v=String(k.group||"").toLowerCase().trim(),$=String(k.name||"").trim(),I=Le[v]||{code:v||"tr",language:"Turkish",name:"T\xFCrk\xE7e"},D=$||I.name;return{id:String(z),url:k.link,lang:I.code,language:I.language,name:D,label:D,title:D,type:"vtt",headers:{Referer:`${b}/`,"User-Agent":j.DEFAULT_USER_AGENT}}}),R=[],V=(S.groups||[]).filter(k=>String(k?.group||"").toLowerCase().trim()!=="endub"),ge=V.length>1,J=1;for(let k of V){let v=String(k.group||"").toLowerCase().trim()==="trdub",$=ge?`han's 22 [${J}]`:"han's 22",I=v?"Dublaj":"Altyaz\u0131l\u0131";J++;let D=(k.items||[]).sort((C,M)=>(M.quality||0)-(C.quality||0));for(let C of D){let M=C.link;if(!M||typeof M!="string")continue;let B=parseInt(String(C.quality||1080),10),W=B===2160?"4K UHD":B===1440?"2K QHD":B===1080?"1080p":`${B}p`,P=C.type==="hls"||M.includes(".m3u8");R.push(ce({name:$,url:M,languageTitle:I,quality:W,format:P?"m3u8":"mp4",subtitles:v?[]:E,headers:{Referer:`${b}/`,"User-Agent":j.DEFAULT_USER_AGENT}}))}}let de=((Date.now()-o)/1e3).toFixed(2);return _("han's 22",`[Ad\u0131m 4/4] TAMAMLANDI: ${R.length} adet ak\u0131\u015F listelendi (${de}s)`,"success",R.map(k=>({server:k.name,kalite:k.quality,title:k.title}))),R}catch(n){return _("han's 22",`Hata olu\u015Ftu: ${n?.message||n}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=ue);

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
