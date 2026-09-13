
// QuickJS & Embedded Engine Universal Polyfills
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
if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'undefined') {
  AbortSignal.timeout = function() {
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




"use strict";var C=Object.defineProperty;var U=Object.getOwnPropertyDescriptor;var R=Object.getOwnPropertyNames;var x=Object.prototype.hasOwnProperty;var G=(t,e)=>{for(var n in e)C(t,n,{get:e[n],enumerable:!0})},F=(t,e,n,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of R(e))!x.call(t,s)&&s!==n&&C(t,s,{get:()=>e[s],enumerable:!(i=U(e,s))||i.enumerable});return t};var B=t=>F(C({},"__esModule",{value:!0}),t);var V={};G(V,{getStreams:()=>O});module.exports=B(V);var K=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(e=>String.fromCharCode(e^42)).join(""),P={REMOTE_CONFIG_URL:K,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},$={},v=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};v.__NUVIO_CONFIG_STATE__||(v.__NUVIO_CONFIG_STATE__={cachedDomains:{...$},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var c=v.__NUVIO_CONFIG_STATE__,A=10*60*1e3;async function j(){let t=Date.now();try{let e={};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let i=AbortSignal.timeout(4e3);i&&(e.signal=i)}catch{}let n=await fetch(P.REMOTE_CONFIG_URL,e);if(n.ok){let i=await n.json(),s=i?.data??i,a=s.domains||s,r=s.cookies,g=s.tmdb_keys||s.tmdbKeys;a&&typeof a=="object"&&(c.cachedDomains={...c.cachedDomains,...a}),r&&typeof r=="object"&&(c.cachedCookies={...c.cachedCookies,...r}),Array.isArray(g)&&g.length>0&&(c.cachedTmdbKeys=g),c.lastFetchTime=t}else c.lastFetchTime=t-A+6e4}catch{c.lastFetchTime=t-A+6e4}}async function D(){Date.now()-c.lastFetchTime>A&&(c.activeFetchPromise||(c.activeFetchPromise=j().finally(()=>{c.activeFetchPromise=null})),await c.activeFetchPromise)}async function M(t){return await D(),c.cachedDomains[t]||$[t]||""}async function L(){return await D(),c.cachedTmdbKeys||[]}var W="a2f888b27315e62e471b2d587048f32e",N=[W,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function z(t){let e=await L(),n=e.length>0?[...e,...N]:N;for(let i=0;i<n.length;i++){let s=n[i],a=t.includes("?")?"&":"?",r=`https://api.themoviedb.org/3/${t}${a}api_key=${s}`;try{let g=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,p=await fetch(r,{signal:g});if(p.ok)return await p.json();if(p.status===429)continue}catch{}}return null}var E=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};E.__NUVIO_TMDB_CACHE__||(E.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var I=E.__NUVIO_TMDB_CACHE__,S=I.imdbIdCache,q=I.tmdbTitlesCache,Z=I.tmdbImageCache,Q=I.episodeGroupCache,ee=I.absoluteEpCache;async function k(t,e){let n=String(t||"").replace(/^tmdb:/i,"").trim();if(!n)return null;if(n.startsWith("tt"))return n;let i=`${e}:${n}`;if(S.has(i))return S.get(i);let s=(async()=>{try{let r=await z(`${e==="tv"||e==="series"?"tv":"movie"}/${n}/external_ids`);if(r&&r.imdb_id)return r.imdb_id}catch{}return null})();return S.set(i,s),s}function h(t,e,n="info",i){let s=`[${t}]`;n==="error"?console.error(s,e,i||""):n==="warn"?console.warn(s,e,i||""):console.log(s,e,i||"");try{}catch{}}function H(t,e){let n=!1,i=!1,s=!1,a=[],r=["t\xFCrk\xE7e","turkish","turkce","dublaj","tr","tur","dual","ses-tr"],g=["english","ingilizce","original","orijinal","en","eng"];if(t){let w=t.split(/\r?\n/);for(let T of w){let o=T.trim();if(o.startsWith("#EXT-X-MEDIA:")&&o.includes("TYPE=AUDIO")){let d=o.match(/NAME=["']([^"']+)["']/i),b=o.match(/LANGUAGE=["']([^"']+)["']/i),_=o.match(/GROUP-ID=["']([^"']+)["']/i),f=(d?d[1]:"").toLowerCase(),u=(b?b[1]:"").toLowerCase(),l=(_?_[1]:"").toLowerCase();r.some(m=>f.includes(m)||u===m||l.includes(m))&&(n=!0),g.some(m=>f.includes(m)||u===m||l.includes(m))&&(i=!0)}if(o.startsWith("#EXT-X-MEDIA:")&&o.includes("TYPE=SUBTITLES")){let d=o.match(/URI=["']([^"']+)["']/i),b=o.match(/NAME=["']([^"']+)["']/i),_=o.match(/LANGUAGE=["']([^"']+)["']/i);if(d&&d[1]){let f=d[1];if(!f.startsWith("http"))try{f=new URL(f,e).toString()}catch{}let u=b?b[1]:"Altyaz\u0131",l=_?_[1].toLowerCase():"",m=l==="tr"||l==="tur"||l==="st"||l==="sot"||u.toLowerCase().includes("t\xFCrk")||u.toLowerCase().includes("sotho");m?(s=!0,l="tr",u="T\xFCrk\xE7e"):(l==="en"||l==="eng"||u.toLowerCase().includes("ing"))&&(l="en",u="\u0130ngilizce"),a.push({id:String(a.length),url:f,label:u,name:u,language:m?"Turkish":l==="en"?"English":u,lang:l||"und"})}}}}let p="Orijinal";return n&&i||n&&s?p="Dublaj / Altyaz\u0131l\u0131":n?p="Dublaj":s&&(p="Altyaz\u0131l\u0131"),{langTitle:p,subtitles:a}}async function O(t,e,n,i){let s=Date.now();h("Imu",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${t}, T\xFCr: ${e}, Sezon: ${n}, B\xF6l\xFCm: ${i}`);try{let a=String(t||"").trim(),r=String(e||"").toLowerCase()==="tv"?"tv":"movie",g=r==="tv",p=n?parseInt(String(n),10):1,w=i?parseInt(String(i),10):1,T=a.startsWith("tt")?a:await k(a,r);if(!T)return h("Imu","IMDb ID bulunamad\u0131.","warn"),[];let o=await M("imu");if(!o)return h("Imu","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];let d="";if(g){let y=w.toString().padStart(2,"0");d=`${o}/vs/${T}/s${p}/e${y}`}else d=`${o}/vs/${T}`;h("Imu","[Ad\u0131m 2/3] Ak\u0131\u015F sunucusu kontrol ediliyor...");let b={Referer:o+"/",Origin:o,"User-Agent":P.DEFAULT_USER_AGENT},_="";try{let y=await fetch(d,{method:"GET",headers:b});if(!y.ok&&y.status!==200)return h("Imu",`Sunucuda bu i\xE7erik mevcut de\u011Fil (HTTP ${y.status}).`,"warn"),[];_=await y.text()}catch(y){h("Imu",`Ba\u011Flant\u0131 kontrol\xFC ge\xE7ilemedi: ${y.message}`,"warn")}let{langTitle:f,subtitles:u}=H(_,d),l=((Date.now()-s)/1e3).toFixed(2);h("Imu",`[Ad\u0131m 3/3] Imu ak\u0131\u015F\u0131 haz\u0131r! (${l}s)`,"success",{dil:f});let m={name:"Imu",title:f,description:`${f}
1080p \u2022 HLS`,url:d,quality:`1080p \u2022 ${f}`,format:"m3u8",headers:b};return u.length>0&&(m.subtitles=u),[m]}catch(a){return h("Imu",`Hata: ${a.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=O);

var _exp = (typeof module !== "undefined" && module.exports) ? module.exports : {};
var _gs = typeof getStreams !== "undefined" ? getStreams : _exp.getStreams;
var _sub = typeof getSubtitles !== "undefined" ? getSubtitles : _exp.getSubtitles;
if (typeof globalThis !== "undefined") { if (_gs) globalThis.getStreams = _gs; if (_sub) globalThis.getSubtitles = _sub; }
if (typeof global !== "undefined") { if (_gs) global.getStreams = _gs; if (_sub) global.getSubtitles = _sub; }
if (typeof module !== "undefined" && module.exports) { if (_gs) module.exports.getStreams = _gs; if (_sub) module.exports.getSubtitles = _sub; }

;(()=>{const n="han's 1",g=globalThis,m=typeof module!=="undefined"?module:null,f=g&&typeof g.getStreams==="function"?g.getStreams:m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports)m.exports.getStreams=w})();
