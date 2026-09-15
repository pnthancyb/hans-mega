
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




"use strict";var U=Object.defineProperty;var de=Object.getOwnPropertyDescriptor;var fe=Object.getOwnPropertyNames;var ge=Object.prototype.hasOwnProperty;var pe=(r,t)=>{for(var e in t)U(r,e,{get:t[e],enumerable:!0})},ye=(r,t,e,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of fe(t))!ge.call(r,a)&&a!==e&&U(r,a,{get:()=>t[a],enumerable:!(n=de(t,a))||n.enumerable});return r};var he=r=>ye(U({},"__esModule",{value:!0}),r);var Ce={};pe(Ce,{getStreams:()=>Z});module.exports=he(Ce);var be=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(t=>String.fromCharCode(t^42)).join(""),_e={REMOTE_CONFIG_URL:be,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},j={},O=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};O.__NUVIO_CONFIG_STATE__||(O.__NUVIO_CONFIG_STATE__={cachedDomains:{...j},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var c=O.__NUVIO_CONFIG_STATE__,F=10*60*1e3;async function Te(){let r=Date.now();try{let t={};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let n=AbortSignal.timeout(4e3);n&&(t.signal=n)}catch{}let e=await fetch(_e.REMOTE_CONFIG_URL,t);if(e.ok){let n=await e.json(),a=n?.data??n,s=a.domains||a,i=a.cookies,m=a.tmdb_keys||a.tmdbKeys;s&&typeof s=="object"&&(c.cachedDomains={...c.cachedDomains,...s}),i&&typeof i=="object"&&(c.cachedCookies={...c.cachedCookies,...i}),Array.isArray(m)&&m.length>0&&(c.cachedTmdbKeys=m),c.lastFetchTime=r}else c.lastFetchTime=r-F+6e4}catch{c.lastFetchTime=r-F+6e4}}async function W(){Date.now()-c.lastFetchTime>F&&(c.activeFetchPromise||(c.activeFetchPromise=Te().finally(()=>{c.activeFetchPromise=null})),await c.activeFetchPromise)}async function V(r){return await W(),c.cachedDomains[r]||j[r]||""}async function q(){return await W(),c.cachedTmdbKeys||[]}var we="a2f888b27315e62e471b2d587048f32e",X=[we,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function Ae(r){let t=await q(),e=t.length>0?[...t,...X]:X;for(let n=0;n<e.length;n++){let a=e[n],s=r.includes("?")?"&":"?",i=`https://api.themoviedb.org/3/${r}${s}api_key=${a}`;try{let m=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,d=await fetch(i,{signal:m});if(d.ok)return await d.json();if(d.status===429)continue}catch{}}return null}var z=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};z.__NUVIO_TMDB_CACHE__||(z.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var $=z.__NUVIO_TMDB_CACHE__,N=$.imdbIdCache,Me=$.tmdbTitlesCache,xe=$.tmdbImageCache,Be=$.episodeGroupCache,Re=$.absoluteEpCache;async function Y(r,t){let e=String(r||"").replace(/^tmdb:/i,"").trim();if(!e)return null;if(e.startsWith("tt"))return e;let n=`${t}:${e}`;if(N.has(n))return N.get(n);let a=(async()=>{try{let i=await Ae(`${t==="tv"||t==="series"?"tv":"movie"}/${e}/external_ids`);if(i&&i.imdb_id)return i.imdb_id}catch{}return null})();return N.set(n,a),a}function o(r,t,e="info",n){let a=`[${r}]`;e==="error"?console.error(a,t,n||""):e==="warn"?console.warn(a,t,n||""):console.log(a,t,n||"");try{let i=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof i=="string"&&i.startsWith("http")&&fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:r,level:e,message:t,details:n})}).catch(()=>{})}catch{}}var _="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";function $e(r,t){let e=(r||"").toLowerCase().trim(),n=(t||"").toLowerCase().trim(),a=e.includes("forced")||n.includes("forced");if(e==="tr"||e==="tur"||n.includes("t\xFCrk")||n.includes("turk"))return{code:"tr",iso3:"tur",language:"Turkish",name:a?"T\xFCrk\xE7e (Zorunlu)":"T\xFCrk\xE7e"};if(e==="en"||e==="eng"||n.includes("ing")||n.includes("eng"))return{code:"en",iso3:"eng",language:"English",name:a?"\u0130ngilizce (Forced)":"\u0130ngilizce"};if(e==="de"||e==="deu"||e==="ger"||n.includes("alm"))return{code:"de",iso3:"deu",language:"German",name:a?"Almanca (Forced)":"Almanca"};if(e==="fr"||e==="fra"||e==="fre"||n.includes("fran"))return{code:"fr",iso3:"fra",language:"French",name:a?"Frans\u0131zca (Forced)":"Frans\u0131zca"};if(e==="es"||e==="spa"||n.includes("ispan"))return{code:"es",iso3:"spa",language:"Spanish",name:a?"\u0130spanyolca (Forced)":"\u0130spanyolca"};let s=(t||r||"Altyaz\u0131").trim(),i=s.charAt(0).toUpperCase()+s.slice(1);return{code:e&&e.length===2?e:"und",iso3:e&&e.length===3?e:"und",language:i,name:a?`${i} (Forced)`:i}}function ve(r){return[...r].sort((t,e)=>{let n=t.lang==="tr"||t.label?.toLowerCase().includes("t\xFCrk"),a=e.lang==="tr"||e.label?.toLowerCase().includes("t\xFCrk");if(n&&!a)return-1;if(!n&&a)return 1;let s=t.lang==="en"||t.label?.toLowerCase().includes("ing"),i=e.lang==="en"||e.label?.toLowerCase().includes("ing");return s&&!i?-1:!s&&i?1:(t.label||"").localeCompare(e.label||"","tr")})}async function Z(r,t,e,n){let a=String(t||"").toLowerCase().trim(),s=a==="tv"||a==="series",i=s?"tv":"movie",m=e!=null?parseInt(String(e),10):1,d=n!=null?parseInt(String(n),10):1,Q=Date.now();o("JoyBoy",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${r}, T\xFCr: ${i}${s?` (S${m}E${d})`:""}`);try{o("JoyBoy",`[Ad\u0131m 1/4] IMDb ID do\u011Frulan\u0131yor (${r})...`);let f=typeof r=="string"&&r.startsWith("tt")?r:null;if(f||(f=await Y(r,i)),!f||!f.startsWith("tt"))return o("JoyBoy","Ge\xE7erli bir IMDb ID (tt...) bulunamad\u0131. \u0130simle arama yap\u0131lmaz.","warn"),[];let u=await V("joyboy");if(!u)return o("JoyBoy","Sa\u011Flay\u0131c\u0131 adresi al\u0131namad\u0131.","warn"),[];o("JoyBoy",`[Ad\u0131m 2/4] Kaynak \xFCzerinde saf IMDb ID ile aran\u0131yor (${f})...`);let ee=`${u}/?s=${encodeURIComponent(f)}`,D=await fetch(ee,{headers:{"User-Agent":_,Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",Referer:`${u}/`},signal:AbortSignal.timeout?AbortSignal.timeout(4500):void 0});if(!D.ok)return o("JoyBoy",`Arama servisi yan\u0131t vermedi: HTTP ${D.status}`,"warn"),[];let te=await D.text(),ne=s?new RegExp(`<a[^>]+href=["'](${u.replace(/\./g,"\\.")}/dizi/[^"']+)["'][^>]*>([\\s\\S]*?)<\\/a>`,"gi"):new RegExp(`<a[^>]+href=["'](${u.replace(/\./g,"\\.")}/film/[^"']+)["'][^>]*>([\\s\\S]*?)<\\/a>`,"gi"),M=[...te.matchAll(ne)];if(M.length===0)return o("JoyBoy",`Kaynak \xFCzerinde "${f}" ile e\u015Fle\u015Fen ${s?"dizi":"film"} bulunamad\u0131.`,"warn"),[];let T=M[0][1],re=M[0][2].replace(/<[^>]+>/g,"").replace(/\s+/g," ").trim();o("JoyBoy",`\u0130\xE7erik bulundu: "${re}"`,"success"),o("JoyBoy","[Ad\u0131m 3/4] Oynat\u0131c\u0131 sayfas\u0131 ve kimlik verileri al\u0131n\u0131yor...");let v=T;if(s){let l=null,k=T.match(/\/dizi\/([^/]+)/),P=k?k[1]:"",g=P.replace(/-\d{4}$/,""),A=Array.from(new Set([`${u}/bolum/${P}-${m}-sezon-${d}-bolum/`,`${u}/bolum/${g}-${m}-sezon-${d}-bolum/`]));for(let h of A)try{if((await fetch(h,{headers:{"User-Agent":_,Referer:T},signal:AbortSignal.timeout?AbortSignal.timeout(3e3):void 0})).ok){l=h;break}}catch{}if(!l){let h=await fetch(T,{headers:{"User-Agent":_,Referer:`${u}/`},signal:AbortSignal.timeout?AbortSignal.timeout(4e3):void 0});if(h.ok){let ue=[...(await h.text()).matchAll(/<a[^>]+href=["']([^"']*\/bolum\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];for(let H of ue){let b=H[1],me=H[2].replace(/<[^>]+>/g,"").replace(/\s+/g," ").trim();if(new RegExp(`-${m}-sezon-${d}-bolum`,"i").test(b)){l=b.startsWith("http")?b:`${u}${b}`;break}if(new RegExp(`${m}\\s*\\.\\s*Sezon[\\s\\S]*?${d}\\s*\\.\\s*B\xF6l\xFCm`,"i").test(me)){l=b.startsWith("http")?b:`${u}${b}`;break}}}}if(!l)return o("JoyBoy",`${m}. Sezon ${d}. B\xF6l\xFCm bulunamad\u0131.`,"warn"),[];v=l}let C=await fetch(v,{headers:{"User-Agent":_,Referer:T},signal:AbortSignal.timeout?AbortSignal.timeout(4500):void 0});if(!C.ok)return o("JoyBoy",`Oynat\u0131c\u0131 sayfas\u0131 a\xE7\u0131lamad\u0131: HTTP ${C.status}`,"warn"),[];let ae=C.headers.get("set-cookie")||"",x=await C.text(),B=x.match(/data-post=["'](\d+)["']/i),R=x.match(/var\s+_hdfNonce_\s*=\s*["']([^"']+)["']/i);if(!B||!B[1]||!R||!R[1])return o("JoyBoy","Oynat\u0131c\u0131 kimli\u011Fi (data-post veya nonce) sayfada bulunamad\u0131.","warn"),[];let K=B[1],ie=R[1];o("JoyBoy",`[Ad\u0131m 4/4] Video ak\u0131\u015F API'si \xE7\xF6z\xFCmleniyor (Post ID: ${K})...`);let se=`${u}/ajax/videosrc/?id=${encodeURIComponent(K)}&lang=tr&mr=0`,E=await fetch(se,{method:"POST",headers:{"User-Agent":_,"X-HDF-Nonce":ie,Referer:v,Origin:u,"X-Requested-With":"XMLHttpRequest",Cookie:ae},signal:AbortSignal.timeout?AbortSignal.timeout(4500):void 0});if(!E.ok)return o("JoyBoy",`Ak\u0131\u015F servisi yan\u0131t vermedi: HTTP ${E.status}`,"warn"),[];let p=await E.json();if(!p||p.sonuc!=="ok"||!p.src)return o("JoyBoy","Ge\xE7erli bir video ak\u0131\u015F linki d\xF6nmedi.","warn"),[];let w=[],S=!1;if(Array.isArray(p.tracks)){for(let l of p.tracks)if(l.src&&typeof l.src=="string"){let k=l.language||l.label||"",P=l.label||l.language||"",g=$e(k,P),A=l.forced?`${g.name} (Zorunlu)`:g.name;(g.code==="tr"||g.language==="Turkish")&&(S=!0),w.some(h=>h.url===l.src)||w.push({id:String(w.length),language:g.language,name:A,label:A,title:A,lang:g.code,langCode:g.iso3,url:l.src,type:"vtt"})}}w.length>0&&(S=!0);let I=p.langmap||{},J=!!(I.tur||I.tr||I.turkish)||JSON.stringify(I).toLowerCase().includes("turk")||x.toLowerCase().includes("hdf-ico-multi"),L=ve(w),y="Orijinal";J&&S?y="Dublaj / Altyaz\u0131l\u0131":J?y="Dublaj":S&&(y="Altyaz\u0131l\u0131");let oe=p.src,G={name:"JoyBoy",title:y,description:`${y}
1080p \u2022 HLS`,url:oe,quality:`1080p \u2022 ${y}`,format:"m3u8",headers:{Referer:`${v}`,Origin:u,"User-Agent":_}};L.length>0&&(G.subtitles=L);let le=((Date.now()-Q)/1e3).toFixed(2);return o("JoyBoy",`TAMAMLANDI: Tek ak\u0131\u015F (${y}) ve ${L.length} adet altyaz\u0131 haz\u0131rland\u0131 (${le}s)`,"success"),[G]}catch(f){return o("JoyBoy",`Kritik Hata: ${f.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=Z);

var _exp = (typeof module !== "undefined" && module.exports) ? module.exports : {};
var _gs = typeof getStreams !== "undefined" ? getStreams : _exp.getStreams;
var _sub = typeof getSubtitles !== "undefined" ? getSubtitles : _exp.getSubtitles;
if (typeof globalThis !== "undefined") { if (_gs) globalThis.getStreams = _gs; if (_sub) globalThis.getSubtitles = _sub; }
if (typeof global !== "undefined") { if (_gs) global.getStreams = _gs; if (_sub) global.getSubtitles = _sub; }
if (typeof module !== "undefined" && module.exports) { if (_gs) module.exports.getStreams = _gs; if (_sub) module.exports.getSubtitles = _sub; }

;(()=>{const n="han's 2",g=globalThis,m=typeof module!=="undefined"?module:null,f=g&&typeof g.getStreams==="function"?g.getStreams:m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,name:n,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
