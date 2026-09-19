
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

"use strict";var N=Object.defineProperty;var se=Object.getOwnPropertyDescriptor;var te=Object.getOwnPropertyNames;var re=Object.prototype.hasOwnProperty;var le=(e,i)=>{for(var s in i)N(e,s,{get:i[s],enumerable:!0})},ce=(e,i,s,r)=>{if(i&&typeof i=="object"||typeof i=="function")for(let t of te(i))!re.call(e,t)&&t!==s&&N(e,t,{get:()=>i[t],enumerable:!(r=se(i,t))||r.enumerable});return e};var ue=e=>ce(N({},"__esModule",{value:!0}),e);var Te={};le(Te,{getStreams:()=>ie});module.exports=ue(Te);var ge=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(i=>String.fromCharCode(i^42)).join(""),de={REMOTE_CONFIG_URL:ge,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"};var R=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};R.__NUVIO_CONFIG_STATE__||(R.__NUVIO_CONFIG_STATE__={cachedDomains:{},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var v=R.__NUVIO_CONFIG_STATE__,me=10*60*1e3;async function H(){let e=Date.now();try{let i={method:"GET"};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let r=AbortSignal.timeout(8e3);r&&(i.signal=r)}catch{}let s=await fetch(`${de.REMOTE_CONFIG_URL}?_t=${e}`,i);if(s.ok){let r=await s.json(),t=r?.data??r,n=t.domains||t,g=t.cookies,d=t.tmdb_keys||t.tmdbKeys;n&&typeof n=="object"&&(v.cachedDomains={...v.cachedDomains,...n}),g&&typeof g=="object"&&(v.cachedCookies={...v.cachedCookies,...g}),Array.isArray(d)&&d.length>0&&(v.cachedTmdbKeys=d),v.lastFetchTime=e}else v.lastFetchTime=0}catch{v.lastFetchTime=0}}async function G(){let e=Date.now();(!(Object.keys(v.cachedDomains).length>0)||e-v.lastFetchTime>me)&&(v.activeFetchPromise||(v.activeFetchPromise=H().finally(()=>{v.activeFetchPromise=null})),await v.activeFetchPromise)}async function q(e){await G();let i=v.cachedDomains[e]||"";return i||(await H(),i=v.cachedDomains[e]||""),i}async function V(e){return await G(),v.cachedCookies[e]||""}async function Y(){return await G(),v.cachedTmdbKeys||[]}var he="a2f888b27315e62e471b2d587048f32e",W=[he,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function B(e){let i=await Y(),s=i.length>0?[...i,...W]:W;for(let r=0;r<s.length;r++){let t=s[r],n=e.includes("?")?"&":"?",g=`https://api.themoviedb.org/3/${e}${n}api_key=${t}`;try{let d=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,a=await fetch(g,{signal:d});if(a.ok)return await a.json();if(a.status===429)continue}catch{}}return null}var O=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};O.__NUVIO_TMDB_CACHE__||(O.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var E=O.__NUVIO_TMDB_CACHE__,ze=E.imdbIdCache,U=E.tmdbTitlesCache,Se=E.tmdbImageCache,K=E.episodeGroupCache,x=E.absoluteEpCache;async function J(e,i){let s=String(e||"").replace(/^tmdb:/i,"").trim();if(!s)return{titles:[]};let r=`${i}:${s}`;if(U.has(r))return U.get(r);let t=(async()=>{let n=[],g,d,a=[],m=[],l,f=[];try{let p=i==="tv"||i==="series",k=p?"tv":"movie";if(s.startsWith("tt")){let o=await B(`find/${s}?external_source=imdb_id`);if(o){let T=p?o?.tv_results?.[0]:o?.movie_results?.[0];T&&(g=T.id,T.overview&&(l=T.overview))}}else g=parseInt(s,10);if(g&&!isNaN(g)){let o=await B(`${k}/${g}?language=tr-TR&append_to_response=credits,alternative_titles`);if(o){if(o.overview&&(l=o.overview),o.title&&(n.push(o.title),o.title.includes(":"))){let c=o.title.split(":")[0].trim();c.length>2&&n.push(c)}if(o.name&&(n.push(o.name),o.name.includes(":"))){let c=o.name.split(":")[0].trim();c.length>2&&n.push(c)}if(o.original_title&&o.original_title!==o.title&&(n.push(o.original_title),o.original_title.includes(":"))){let c=o.original_title.split(":")[0].trim();c.length>2&&n.push(c)}if(o.original_name&&o.original_name!==o.name&&(n.push(o.original_name),o.original_name.includes(":"))){let c=o.original_name.split(":")[0].trim();c.length>2&&n.push(c)}let T=(o.alternative_titles?.results||o.alternative_titles?.titles||[]).map(c=>c.title).filter(Boolean);n.push(...T);let h=o.release_date||o.first_air_date;h&&(d=parseInt(h.split("-")[0],10)),o.genres&&Array.isArray(o.genres)&&(f=o.genres.map(c=>c.name).filter(Boolean)),o.credits?.cast&&Array.isArray(o.credits.cast)&&(a=o.credits.cast.slice(0,10).map(c=>c.name).filter(Boolean));let u=[];o.created_by&&Array.isArray(o.created_by)&&u.push(...o.created_by.map(c=>c.name).filter(Boolean)),o.credits?.crew&&Array.isArray(o.credits.crew)&&u.push(...o.credits.crew.filter(c=>c.job==="Director"||c.department==="Directing").map(c=>c.name).filter(Boolean)),m=Array.from(new Set(u))}}}catch{}return{numericId:g,titles:Array.from(new Set(n.filter(Boolean))),year:d,cast:a,creators:m,overview:l,genres:f}})();return U.set(r,t),t}async function Q(e){if(K.has(e))return K.get(e);let i=(async()=>{try{let s=await B(`tv/${e}/episode_groups`);if(!s)return null;let t=(s.results||[]).find(l=>l.type===6||l.type===5||l.type===1||l.name?.toLowerCase().includes("season")||l.name?.toLowerCase().includes("arc")||l.name?.toLowerCase().includes("part")||l.name?.toLowerCase().includes("saga"));if(!t)return null;let n=await B(`tv/episode_group/${t.id}`);if(!n||!n.groups)return null;let g={},d=1,a={};return(n.groups||[]).sort((l,f)=>(l.order||0)-(f.order||0)).forEach((l,f)=>{let p=l.name||"",k=p.match(/Season\s+(\d+)/i),o=k?parseInt(k[1],10):l.order||f+1;o===0||p.toLowerCase().includes("specials")||p.toLowerCase().includes("\xF6zel")||(a[o]===void 0&&(a[o]=0),(l.episodes||[]).forEach(T=>{T.season_number!==0&&(a[o]++,g[d]={season:o,episode:a[o]},d++)}))}),g}catch{}return null})();return K.set(e,i),i}async function X(e,i,s){if(i<=1)return s;let r=`${e}:${i}:${s}`;if(x.has(r))return x.get(r);let t=(async()=>{try{let n=await B(`tv/${e}`);if(!n)return s;let d=(n.seasons||[]).filter(a=>a.season_number>0&&a.season_number<i).reduce((a,m)=>a+(m.episode_count||0),0);return s>d?s:d+s}catch{}return s})();return x.set(r,t),t}function b(e,i,s="info",r){let t=`[${e}]`;s==="error"?console.error(t,i,r||""):s==="warn"?console.warn(t,i,r||""):console.log(t,i,r||"");try{let g=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof g=="string"&&g.startsWith("http")&&fetch(g,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:s,message:i,details:r})}).catch(()=>{})}catch{}}async function Z(e){let{providerName:i,tmdbNumericId:s,season:r,episode:t,isTv:n,minAbsoluteThreshold:g=24,fetcher:d,isValid:a}=e;try{let m=await d(r,t);if(a(m))return{data:m,resolvedSeason:r,resolvedEpisode:t,strategy:"direct"}}catch(m){b(i,`Do\u011Frudan b\xF6l\xFCm sorgusu hatas\u0131 (S${r}E${t}): ${m?.message||m}`,"warn")}if(!n||!s)return{data:null,resolvedSeason:r,resolvedEpisode:t,strategy:"none"};try{let m=await Q(s);if(m){let l=m[t];if(l&&(l.season!==r||l.episode!==t)){b(i,`[TMDB Grup E\u015Fle\u015Fmesi] Sezon ${r} B\xF6l\xFCm ${t} -> Sezon ${l.season} B\xF6l\xFCm ${l.episode} olarak sorgulan\u0131yor...`,"info");let f=await d(l.season,l.episode);if(a(f))return{data:f,resolvedSeason:l.season,resolvedEpisode:l.episode,strategy:"group"}}}}catch(m){b(i,`TMDB grup e\u015Fle\u015Ftirme sorgusu hatas\u0131: ${m?.message||m}`,"warn")}if(r>1||t>g)try{let m=await X(s,r,t);if(m&&(m!==t||r!==1)){b(i,`[Mutlak B\xF6l\xFCm] Sezon ${r} B\xF6l\xFCm ${t} -> Mutlak B\xF6l\xFCm ${m} olarak Sezon 1 sorgulan\u0131yor...`,"info");let l=await d(1,m);if(a(l))return{data:l,resolvedSeason:1,resolvedEpisode:m,strategy:"absolute"}}}catch(m){b(i,`Mutlak b\xF6l\xFCm sorgusu hatas\u0131: ${m?.message||m}`,"warn")}return{data:null,resolvedSeason:r,resolvedEpisode:t,strategy:"none"}}var pe=["t\xFCrk\xE7e","turkish","turkce","dublaj","tr","tur","dual","trdual","trdub","ses-tr","audio-tr","tr-dub"],fe=["english","ingilizce","original","orijinal","en","eng","und","audio-en"];function be(e,i){let s=!1,r=!1,t=[],n,g,d,a=(i||"").toLowerCase();if(a.includes("trdual")||a.includes("dual")||a.includes("trdub")||a.includes("dublaj")?(s=!0,r=!0):(a.includes("ses-tr")||a.includes("turkcedublaj")||a.includes("turkce-dublaj"))&&(s=!0),a.includes("2160p")||a.includes("4k")||a.includes("uhd")?n="4K":a.includes("1080p")||a.includes("1920x1080")||a.includes("fhd")?n="1080p":a.includes("720p")||a.includes("1280x720")||a.includes("hd")?n="720p":(a.includes("480p")||a.includes("854x480")||a.includes("sd"))&&(n="480p"),a.includes("hevc")||a.includes("h265")||a.includes("x265")?g="HEVC":a.includes("av1")?g="AV1":(a.includes("h264")||a.includes("x264")||a.includes("avc"))&&(g="H.264"),a.includes("5.1")||a.includes("eac3")||a.includes("ac3")||a.includes("ddp")?d="Dolby 5.1":(a.includes("7.1")||a.includes("atmos"))&&(d="Dolby Atmos 7.1"),e&&typeof e=="string"){let l=e.split(/\r?\n/);for(let f of l){let p=f.trim();if(p.startsWith("#EXT-X-MEDIA:")&&p.includes("TYPE=AUDIO")){let k=p.match(/NAME=["']([^"']+)["']/i),o=p.match(/LANGUAGE=["']([^"']+)["']/i),T=p.match(/GROUP-ID=["']([^"']+)["']/i),h=(k?k[1]:"").toLowerCase(),u=(o?o[1]:"").toLowerCase(),c=(T?T[1]:"").toLowerCase(),z=pe.some(_=>h.includes(_)||u===_||c.includes(_))||h.includes("t\xFCrk")||h.includes("turk")||c.includes("dual"),S=fe.some(_=>h.includes(_)||u===_||c.includes(_))||h.includes("orig")||h.includes("ing")||h.includes("eng");z&&(s=!0),S&&(r=!0)}if(p.startsWith("#EXT-X-MEDIA:")&&p.includes("TYPE=SUBTITLES")){let k=p.match(/URI=["']([^"']+)["']/i),o=p.match(/NAME=["']([^"']+)["']/i),T=p.match(/LANGUAGE=["']([^"']+)["']/i);if(k&&k[1]){let h=k[1];if(i&&!h.startsWith("http"))try{h=new URL(h,i).toString()}catch{}let u=o?o[1]:"Altyaz\u0131",c=T?T[1].toLowerCase():"";c==="st"||c==="sot"||u.toLowerCase().includes("sotho")||u.toLowerCase().includes("sesotho")||h.toLowerCase().includes("sub_st")?(c="tr",u="T\xFCrk\xE7e"):c||(c=u.toLowerCase().includes("t\xFCrk")?"tr":"und");let S=ke(c,u);t.push({label:S.name||u,url:h,lang:S.code||c})}}}}let m=s&&r||a.includes("dual")||a.includes("trdual");return{hasTurkishAudio:s,hasOriginalAudio:r,isDual:m,embeddedSubtitles:t,detectedQuality:n,detectedCodec:g,detectedAudio:d}}var L={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"por-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"portekizce brezilya":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},"pt-pt":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"por-eu":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},"portekizce avrupa":{code:"pt-PT",iso3:"por",language:"Portuguese (EU)",name:"Portekizce (Avrupa)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},zho:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},pl:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},pol:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},polish:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},lehce:{code:"pl",iso3:"pol",language:"Polish",name:"Leh\xE7e"},nl:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},nld:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dut:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},dutch:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},felemenkce:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},hollandaca:{code:"nl",iso3:"nld",language:"Dutch",name:"Felemenk\xE7e"},el:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},ell:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},gre:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},greek:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},yunanca:{code:"el",iso3:"ell",language:"Greek",name:"Yunanca"},hu:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hun:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},hungarian:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},macarca:{code:"hu",iso3:"hun",language:"Hungarian",name:"Macarca"},ro:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},ron:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},rum:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romanian:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},romence:{code:"ro",iso3:"ron",language:"Romanian",name:"Romence"},sv:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swe:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},swedish:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},isvecce:{code:"sv",iso3:"swe",language:"Swedish",name:"\u0130sve\xE7\xE7e"},no:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},nor:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norwegian:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},norvecce:{code:"no",iso3:"nor",language:"Norwegian",name:"Norve\xE7\xE7e"},da:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},dan:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danish:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},danca:{code:"da",iso3:"dan",language:"Danish",name:"Danca"},fi:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fin:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},finnish:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},fince:{code:"fi",iso3:"fin",language:"Finnish",name:"Fince"},cs:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},ces:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cze:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},czech:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},cekce:{code:"cs",iso3:"ces",language:"Czech",name:"\xC7ek\xE7e"},uk:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukr:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukrainian:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},ukraynaca:{code:"uk",iso3:"ukr",language:"Ukrainian",name:"Ukraynaca"},bg:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bul:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarian:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},bulgarca:{code:"bg",iso3:"bul",language:"Bulgarian",name:"Bulgarca"},hr:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hrv:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},croatian:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},hirvatca:{code:"hr",iso3:"hrv",language:"Croatian",name:"H\u0131rvat\xE7a"},sr:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},srp:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},serbian:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sirpca:{code:"sr",iso3:"srp",language:"Serbian",name:"S\u0131rp\xE7a"},sk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slk:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovak:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},slovakca:{code:"sk",iso3:"slk",language:"Slovak",name:"Slovak\xE7a"},sl:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slv:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovenian:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},slovence:{code:"sl",iso3:"slv",language:"Slovenian",name:"Slovence"},hi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hin:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hindi:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},hintce:{code:"hi",iso3:"hin",language:"Hindi",name:"Hint\xE7e"},th:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tha:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},thai:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},tayca:{code:"th",iso3:"tha",language:"Thai",name:"Tayca"},vi:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vie:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamese:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},vietnamca:{code:"vi",iso3:"vie",language:"Vietnamese",name:"Vietnamca"},id:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ind:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},indonesian:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},endonezce:{code:"id",iso3:"ind",language:"Indonesian",name:"Endonezce"},ms:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},msa:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},may:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malay:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},malayca:{code:"ms",iso3:"msa",language:"Malay",name:"Malayca"},ca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},cat:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},catalan:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},katalanca:{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca"},"cat-eu":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},"katalanca avrupa":{code:"ca",iso3:"cat",language:"Catalan",name:"Katalanca (Avrupa)"},he:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},heb:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},hebrew:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},ibranice:{code:"he",iso3:"heb",language:"Hebrew",name:"\u0130branice"},fa:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},fas:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},per:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},persian:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},farsca:{code:"fa",iso3:"fas",language:"Persian",name:"Fars\xE7a"},ta:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tam:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamil:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},tamilce:{code:"ta",iso3:"tam",language:"Tamil",name:"Tamilce"},te:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},tel:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},telugu:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},teluguca:{code:"te",iso3:"tel",language:"Telugu",name:"Teluguca"},kn:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kan:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannada:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},kannadaca:{code:"kn",iso3:"kan",language:"Kannada",name:"Kannadaca"},ml:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},mal:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalam:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},malayalamca:{code:"ml",iso3:"mal",language:"Malayalam",name:"Malayalamca"},tl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tgl:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},fil:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},filipino:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},tagalog:{code:"tl",iso3:"tgl",language:"Filipino",name:"Filipince"},ka:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},kat:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},geo:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},georgian:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},gurcuce:{code:"ka",iso3:"kat",language:"Georgian",name:"G\xFCrc\xFCce"},sq:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},sqi:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},alb:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},albanian:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},arnavutca:{code:"sq",iso3:"sqi",language:"Albanian",name:"Arnavut\xE7a"},bs:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bos:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnian:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},bosnakca:{code:"bs",iso3:"bos",language:"Bosnian",name:"Bo\u015Fnak\xE7a"},mk:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mkd:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},mac:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},macedonian:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},makedonca:{code:"mk",iso3:"mkd",language:"Macedonian",name:"Makedonca"},kk:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kaz:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakh:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},kazakca:{code:"kk",iso3:"kaz",language:"Kazakh",name:"Kazak\xE7a"},uz:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzb:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},uzbek:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},ozbekce:{code:"uz",iso3:"uzb",language:"Uzbek",name:"\xD6zbek\xE7e"},bn:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},ben:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengali:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},bengalce:{code:"bn",iso3:"ben",language:"Bengali",name:"Bengalce"},mr:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},mar:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathi:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},marathice:{code:"mr",iso3:"mar",language:"Marathi",name:"Marathice"},gu:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guj:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},gujarati:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},guceratca:{code:"gu",iso3:"guj",language:"Gujarati",name:"Gucerat\xE7a"},pa:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pan:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},punjabi:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},pencapca:{code:"pa",iso3:"pan",language:"Punjabi",name:"Pencap\xE7a"},eu:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baq:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},eus:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},basque:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},baskca:{code:"eu",iso3:"baq",language:"Basque",name:"Bask\xE7a"},gl:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},glg:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galician:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},galisyaca:{code:"gl",iso3:"glg",language:"Galician",name:"Galisyaca"},et:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},est:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonian:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},estonca:{code:"et",iso3:"est",language:"Estonian",name:"Estonca"},lv:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lav:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},latvian:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},letonca:{code:"lv",iso3:"lav",language:"Latvian",name:"Letonca"},lt:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lit:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},lithuanian:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},litvanca:{code:"lt",iso3:"lit",language:"Lithuanian",name:"Litvanca"},is:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},isl:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},ice:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},icelandic:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"},izlandaca:{code:"is",iso3:"isl",language:"Icelandic",name:"\u0130zlandaca"}};function ke(e,i,s){let r=h=>(h||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),t=r(e||""),n=r(i||""),g=!!s||t.includes("forced")||n.includes("forced")||t.includes("zorunlu")||n.includes("zorunlu"),d=t.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),a=n.replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),m=h=>{let u=h.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();return g?`${u} (Zorunlu)`:u};if(d==="st"||d==="sot"||d.includes("sotho")||a.includes("sotho")||a.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:g?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};let l=L[t]||L[n]||L[d]||L[a];if(!l){let h=(a+" "+d).split(/\s+/).filter(Boolean);for(let u of h)if(L[u]){l=L[u];break}}if(!l){for(let[h,u]of Object.entries(L))if(h.length>=4&&(a.includes(h)||d.includes(h))){l=u;break}}if(l)return{code:l.code,iso3:l.iso3,language:l.language,name:m(l.name)};let f=(i||e||"Altyaz\u0131").trim();f=f.replace(/\s*\((?:forced|zorunlu)\)/gi,"").replace(/\s*-\s*(?:forced|zorunlu)/gi,"").trim();let p=f.charAt(0).toUpperCase()+f.slice(1),k=m(p),o=t&&t.length===2?t:n&&n.length===2?n:"und",T=t&&t.length===3?t:n&&n.length===3?n:"und";return{code:o,iso3:T,language:p,name:k}}function ee(e){let i=e.url?be(void 0,e.url):{},s=e.quality||i.detectedQuality||"1080p";s.includes("\u2022")&&(s=s.split("\u2022")[0].trim()),!s.includes("p")&&!s.includes("K")&&!s.includes("k")&&(s=`${s}p`);let r=e.subtitles||e.inspection?.subtitles,t=!!(e.inspection?.hasTurkishSubtitles||r?.some(z=>{let S=(z.lang||z.code||"").toLowerCase(),_=(z.langCode||z.iso3||"").toLowerCase(),w=(z.name||z.label||z.title||"").toLowerCase();return S==="tr"||S==="st"||_==="tur"||_==="sot"||w.includes("t\xFCrk")||w.includes("turk")||w.includes("sotho")})),n=(e.languageTitle||e.inspection?.languageTitle||"").toLowerCase().trim(),g=n.includes("dub")||n.includes("ses")||n.includes("dual")||!!i.hasTurkishAudio||!!e.inspection?.hasTurkishAudio,d=n.includes("dual")||n.includes("dub")&&(n.includes("alt")||n.includes("sub"))||g&&t,a="Orijinal";n.includes("yerli")||e.inspection?.isYerli?a="Yerli":d?a="Dublaj / Altyaz\u0131l\u0131":g?a="Dublaj":t||n.includes("alt")||n.includes("sub")?a="Altyaz\u0131l\u0131":(n.includes("orijinal")||n.includes("yabanc\u0131")||n.includes("original"))&&(a="Orijinal");let m=e.format==="m3u8"||e.url.includes(".m3u8")||e.url.includes("/master.")||e.url.includes("/hls/")||e.url.includes("/txt/"),l=e.format||(m?"m3u8":e.url.includes(".mp4")?"mp4":"m3u8"),f=l==="m3u8"?"HLS":l.toUpperCase(),p=[s],k=e.codec||i.detectedCodec;k&&k!=="H.264"&&p.push(k),p.push(f),e.bitrate&&p.push(e.bitrate);let o=e.audio||i.detectedAudio;o&&o!=="AAC 2.0"&&p.push(o);let T=e.details||p.join(" \u2022 "),h=`${a}
${T}`,u=`${s} \u2022 ${a}`,c={name:"han's 20",provider:"han's 20",title:a,description:h,url:e.url,quality:u,format:l};return e.headers&&Object.keys(e.headers).length>0&&(c.headers=e.headers),r&&r.length>0&&(c.subtitles=r),c}var ae={Accept:"application/json, text/plain, */*","Accept-Language":"en,tr;q=0.9",Cookie:"theme=Dark; null_cookie_notice=1; connect.sid=s%3AK0whNI19qAb709lNrGtAF-S2rtQ7dVIg.K8N2WvHTIUS%2FUEByzSMJ0VVCbtRcWHX6zCfdQ2p4Zbo","User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36","x-e-h":"j1stzlcwDgXT9tI0aHTBsxwdzIrlwd4vKobLjbI2Naax99OELIaH.s1SoKBwGcVH5EX2R2"},ye={"4k":2160,"2160p":2160,"1080p":1080,"720p":720,"480p":480,"360p":360};function ne(e){let i=(e||"").toLowerCase().trim();for(let[r,t]of Object.entries(ye))if(i.includes(r))return t;let s=i.match(/(\d+)p/);return s?parseInt(s[1],10):0}async function ie(e,i,s,r){let t=Date.now();b("han's 20",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${e}, T\xFCr: ${i}, Sezon: ${s}, B\xF6l\xFCm: ${r}`);try{let n=String(e||"").trim(),g=String(i||"").toLowerCase().trim(),d=g==="tv"||g==="series",a=d?"tv":"movie",m=s!=null?parseInt(String(s),10):1,l=r!=null?parseInt(String(r),10):1;if(!n)return[];b("han's 20",`[Ad\u0131m 1/4] TMDB ba\u015Fl\u0131klar\u0131 sorgulan\u0131yor (${n})...`);let f=await J(n,a),p=f.titles;if(p.length===0)return b("han's 20",`TMDB ba\u015Fl\u0131\u011F\u0131 bulunamad\u0131: ${n}`,"error"),[];b("han's 20",`Aranacak ba\u015Fl\u0131klar: [${p.join(", ")}]`,"info");let k=await q("fujitora");if(!k)return b("han's 20","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let T=await V("fujitora")||ae.Cookie,h={...ae,Cookie:T,Referer:k+"/",Origin:k},u=null;for(let y of p)try{let A=`${k}/secure/search/${encodeURIComponent(y)}?limit=20`,C=await fetch(A,{headers:h});if(C.status===403){b("han's 20","Cloudflare korumas\u0131 devrede (403 Forbidden / Challenge).","warn");break}if(C.ok){let D=(await C.json()).results||[];if(f.numericId&&(u=D.find(P=>Number(P.tmdb_id)===Number(f.numericId))),u){b("han's 20",` Kaynak ba\u015Fl\u0131\u011F\u0131 e\u015Fle\u015Fti: ${u.name} (ID: ${u.id}, TMDB: ${u.tmdb_id})`,"success");break}}}catch{}if(!u&&f.numericId)try{let y=`${k}/secure/search/${f.numericId}?limit=20`,A=await fetch(y,{headers:h});A.ok&&(u=((await A.json()).results||[]).find(D=>Number(D.tmdb_id)===Number(f.numericId)),u&&b("han's 20",` TMDB ID ile e\u015Fle\u015Fti: ${u.name} (ID: ${u.id})`,"success"))}catch{}if(!u)return b("han's 20","E\u015Fle\u015Fen anime bulunamad\u0131 (Anime de\u011Fil veya ekli de\u011Fil).","info"),[];let c=async(y,A)=>{let C=d?`${k}/secure/titles/${u.id}?seasonNumber=${y}&episodeNumber=${A}`:`${k}/secure/titles/${u.id}?titleId=${u.id}`;try{let I=await fetch(C,{headers:h});if(!I.ok)return b("han's 20",`B\xF6l\xFCm API yan\u0131t vermedi: HTTP ${I.status}`,"warn"),[];let P=(await I.json())?.title?.videos||[],j=d?P.filter(M=>Number(M.episode_num??M.episode_number??M.episode??A)===Number(A)):P;return b("han's 20",`B\xF6l\xFCm API sonucu: Toplam ${P.length} video, E\u015Fle\u015Fen: ${j.length}`,"info"),j}catch(I){return b("han's 20",`B\xF6l\xFCm istek hatas\u0131: ${I.message}`,"error"),[]}};b("han's 20",`[Ad\u0131m 2/4] B\xF6l\xFCm kaynaklar\u0131 aran\u0131yor (Sezon: ${m}, B\xF6l\xFCm: ${l})...`);let z=await Z({providerName:"han's 20",tmdbNumericId:f.numericId,season:m,episode:l,isTv:d,minAbsoluteThreshold:100,fetcher:c,isValid:y=>Array.isArray(y)&&y.length>0}),S=z.data||[];if(l=z.resolvedEpisode,S.length===0)return b("han's 20",`B\xF6l\xFCm ${l} i\xE7in video kayna\u011F\u0131 bulunamad\u0131.`,"warn"),[];b("han's 20",`[Ad\u0131m 3/4] ${S.length} adet oynat\u0131c\u0131 bulundu. Oynat\u0131c\u0131 kaynaklar\u0131 \xE7\xF6z\xFCmleniyor...`);let _=S.filter(y=>(y.name==="Tau Video"||y.url&&y.url.includes("tau-video"))&&y.url),w=[];for(let y of _.length>0?_:S)if(y.url&&(y.url.includes("tau-video")||y.name==="Tau Video"))try{let A="https://tau-video.xyz";try{A=new URL(y.url).origin}catch{}let C=y.url.split("/").pop()?.split("?")[0];if(!C)continue;let I=`${A}/api/video/${C}`,D=await fetch(I,{headers:{"User-Agent":h["User-Agent"],Referer:y.url}});if(D.ok){let j=(await D.json()).urls||[];if(j.length>0){let M=[...j].sort((F,$)=>ne($.label)-ne(F.label));for(let F of M){let $=F.label.toLowerCase();w.push(ee({name:"han's 20",url:F.url,languageTitle:"Altyaz\u0131l\u0131",quality:$,format:"mp4",headers:{Referer:`${A}/`,Origin:A,"User-Agent":h["User-Agent"]}}))}break}}}catch(A){b("han's 20",`Video kaynak \xE7\xF6z\xFCmleme hatas\u0131: ${A.message}`,"warn")}if(w.length===0)return b("han's 20","MP4 ak\u0131\u015F kaliteleri \xE7\xF6z\xFClemedi.","warn"),[];let oe=((Date.now()-t)/1e3).toFixed(2);return b("han's 20",`[Ad\u0131m 4/4] TAMAMLANDI: ${w.length} adet MP4 kalitesi listelendi (${oe}s)`,"success",w.map(y=>({kalite:y.quality,title:y.title}))),w}catch(n){return b("han's 20",`Kritik Hata: ${n.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=ie);

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

;(()=>{const n="han's 20",g=globalThis,m=typeof module!=="undefined"?module:null,f=m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:g&&typeof g.getStreams==="function"?g.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{m.exports={...m.exports,getStreams:w}}catch{}try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
