
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




"use strict";var D=Object.defineProperty;var X=Object.getOwnPropertyDescriptor;var Q=Object.getOwnPropertyNames;var Z=Object.prototype.hasOwnProperty;var ee=(n,s)=>{for(var a in s)D(n,a,{get:s[a],enumerable:!0})},ne=(n,s,a,t)=>{if(s&&typeof s=="object"||typeof s=="function")for(let o of Q(s))!Z.call(n,o)&&o!==a&&D(n,o,{get:()=>s[o],enumerable:!(t=X(s,o))||t.enumerable});return n};var te=n=>ne(D({},"__esModule",{value:!0}),n);var de={};ee(de,{default:()=>ue,getStreams:()=>M});module.exports=te(de);var ae=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(s=>String.fromCharCode(s^42)).join(""),ie={REMOTE_CONFIG_URL:ae,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},N={},z=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};z.__NUVIO_CONFIG_STATE__||(z.__NUVIO_CONFIG_STATE__={cachedDomains:{...N},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var y=z.__NUVIO_CONFIG_STATE__,P=10*60*1e3;async function se(){let n=Date.now();try{let s={};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let t=AbortSignal.timeout(4e3);t&&(s.signal=t)}catch{}let a=await fetch(ie.REMOTE_CONFIG_URL,s);if(a.ok){let t=await a.json(),o=t?.data??t,i=o.domains||o,r=o.cookies,l=o.tmdb_keys||o.tmdbKeys;i&&typeof i=="object"&&(y.cachedDomains={...y.cachedDomains,...i}),r&&typeof r=="object"&&(y.cachedCookies={...y.cachedCookies,...r}),Array.isArray(l)&&l.length>0&&(y.cachedTmdbKeys=l),y.lastFetchTime=n}else y.lastFetchTime=n-P+6e4}catch{y.lastFetchTime=n-P+6e4}}async function E(){Date.now()-y.lastFetchTime>P&&(y.activeFetchPromise||(y.activeFetchPromise=se().finally(()=>{y.activeFetchPromise=null})),await y.activeFetchPromise)}async function O(n){return await E(),y.cachedDomains[n]||N[n]||""}async function R(){return await E(),y.cachedTmdbKeys||[]}var re="a2f888b27315e62e471b2d587048f32e",G=[re,"68e094699525b18a70bab2f86b1fa706","246ec6ffbbd6c05d76ad714241e3dcd1","1865f43a0549ca50d341dd9ab8b29f49"];async function x(n){let s=await R(),a=s.length>0?[...s,...G]:G;for(let t=0;t<a.length;t++){let o=a[t],i=n.includes("?")?"&":"?",r=`https://api.themoviedb.org/3/${n}${i}api_key=${o}`;try{let l=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(4e3):void 0,e=await fetch(r,{signal:l});if(e.ok)return await e.json();if(e.status===429)continue}catch{}}return null}var j=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};j.__NUVIO_TMDB_CACHE__||(j.__NUVIO_TMDB_CACHE__={imdbIdCache:new Map,tmdbTitlesCache:new Map,tmdbImageCache:new Map,episodeGroupCache:new Map,absoluteEpCache:new Map});var v=j.__NUVIO_TMDB_CACHE__,$=v.imdbIdCache,pe=v.tmdbTitlesCache,he=v.tmdbImageCache,be=v.episodeGroupCache,ye=v.absoluteEpCache;async function U(n,s){let a=String(n||"").replace(/^tmdb:/i,"").trim();if(!a)return null;if(a.startsWith("tt"))return a;let t=`${s}:${a}`;if($.has(t))return $.get(t);let o=(async()=>{try{let r=await x(`${s==="tv"||s==="series"?"tv":"movie"}/${a}/external_ids`);if(r&&r.imdb_id)return r.imdb_id}catch{}return null})();return $.set(t,o),o}function k(n,s,a="info",t){let o=`[${n}]`;a==="error"?console.error(o,s,t||""):a==="warn"?console.warn(o,s,t||""):console.log(o,s,t||"");try{let r=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof r=="string"&&r.startsWith("http")&&fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:n,level:a,message:s,details:t})}).catch(()=>{})}catch{}}var oe=["t\xFCrk\xE7e","turkish","turkce","dublaj","tr","tur","dual","trdual","trdub","ses-tr","audio-tr","tr-dub"],le=["english","ingilizce","original","orijinal","en","eng","und","audio-en"];function F(n,s){let a=!1,t=!1,o=[],i,r,l,e=(s||"").toLowerCase();if(e.includes("trdual")||e.includes("dual")||e.includes("trdub")||e.includes("dublaj")?(a=!0,t=!0):(e.includes("ses-tr")||e.includes("turkcedublaj")||e.includes("turkce-dublaj"))&&(a=!0),e.includes("2160p")||e.includes("4k")||e.includes("uhd")?i="4K":e.includes("1080p")||e.includes("1920x1080")||e.includes("fhd")?i="1080p":e.includes("720p")||e.includes("1280x720")||e.includes("hd")?i="720p":(e.includes("480p")||e.includes("854x480")||e.includes("sd"))&&(i="480p"),e.includes("hevc")||e.includes("h265")||e.includes("x265")?r="HEVC":e.includes("av1")?r="AV1":(e.includes("h264")||e.includes("x264")||e.includes("avc"))&&(r="H.264"),e.includes("5.1")||e.includes("eac3")||e.includes("ac3")||e.includes("ddp")?l="Dolby 5.1":(e.includes("7.1")||e.includes("atmos"))&&(l="Dolby Atmos 7.1"),n&&typeof n=="string"){let h=n.split(/\r?\n/);for(let f of h){let u=f.trim();if(u.startsWith("#EXT-X-MEDIA:")&&u.includes("TYPE=AUDIO")){let b=u.match(/NAME=["']([^"']+)["']/i),T=u.match(/LANGUAGE=["']([^"']+)["']/i),d=u.match(/GROUP-ID=["']([^"']+)["']/i),g=(b?b[1]:"").toLowerCase(),p=(T?T[1]:"").toLowerCase(),m=(d?d[1]:"").toLowerCase(),_=oe.some(A=>g.includes(A)||p===A||m.includes(A))||g.includes("t\xFCrk")||g.includes("turk")||m.includes("dual"),C=le.some(A=>g.includes(A)||p===A||m.includes(A))||g.includes("orig")||g.includes("ing")||g.includes("eng");_&&(a=!0),C&&(t=!0)}if(u.startsWith("#EXT-X-MEDIA:")&&u.includes("TYPE=SUBTITLES")){let b=u.match(/URI=["']([^"']+)["']/i),T=u.match(/NAME=["']([^"']+)["']/i),d=u.match(/LANGUAGE=["']([^"']+)["']/i);if(b&&b[1]){let g=b[1];if(s&&!g.startsWith("http"))try{g=new URL(g,s).toString()}catch{}let p=T?T[1]:"Altyaz\u0131",m=d?d[1].toLowerCase():"";m==="st"||m==="sot"||p.toLowerCase().includes("sotho")||p.toLowerCase().includes("sesotho")||g.toLowerCase().includes("sub_st")?(m="tr",p="T\xFCrk\xE7e"):m||(m=p.toLowerCase().includes("t\xFCrk")?"tr":"und");let C=K(m,p);o.push({label:C.name||p,url:g,lang:C.code||m})}}}}let c=a&&t||e.includes("dual")||e.includes("trdual");return{hasTurkishAudio:a,hasOriginalAudio:t,isDual:c,embeddedSubtitles:o,detectedQuality:i,detectedCodec:r,detectedAudio:l}}function ce(n){let{hasTurkishAudio:s,hasOriginalAudio:a,isDual:t,hasSubtitles:o,hasTurkishSubtitles:i,isYerli:r,siteHint:l,defaultTitle:e}=n;if(r||l?.isYerli)return"Yerli";if(l?.label){let c=l.label.toLowerCase();if((c.includes("dub")||c.includes("t\xFCrk"))&&(c.includes("alt")||c.includes("sub")))return"Dublaj / Altyaz\u0131l\u0131";if(c.includes("dub")||c.includes("t\xFCrk\xE7e ses"))return"Dublaj";if(c.includes("alt")||c.includes("sub"))return"Altyaz\u0131l\u0131";if(c.includes("orijinal")||c.includes("original"))return"Orijinal"}return t||s&&(a||i)?"Dublaj / Altyaz\u0131l\u0131":s||l?.isDublaj?"Dublaj":i||l?.isAltyazi?"Altyaz\u0131l\u0131":e||(s?"Dublaj":"Orijinal")}var S={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"}};function K(n,s){let a=f=>(f||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),t=a(n||""),o=a(s||""),i=t.includes("forced")||o.includes("forced"),r=t.replace(/\b(forced|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),l=o.replace(/\b(forced|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim();if(r==="st"||r==="sot"||r.includes("sotho")||l.includes("sotho")||l.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:i?"T\xFCrk\xE7e (Forced)":"T\xFCrk\xE7e"};let e=S[t]||S[o]||S[r]||S[l];if(!e){let f=(l+" "+r).split(/\s+/).filter(Boolean);for(let u of f)if(S[u]){e=S[u];break}}if(!e){for(let[f,u]of Object.entries(S))if(f.length>=4&&(l.includes(f)||r.includes(f))){e=u;break}}if(e)return{code:e.code,iso3:e.iso3,language:e.language,name:i?`${e.name} (Forced)`:e.name};let c=(s||n||"Altyaz\u0131").trim(),h=c.charAt(0).toUpperCase()+c.slice(1);return{code:t&&t.length===2?t:"und",iso3:t&&t.length===3?t:"und",language:h,name:i&&!c.toLowerCase().includes("forced")?`${c} (Forced)`:c}}function B(n,s){let a=[],t=new Set,o=[...n||[],...s||[]];for(let i of o){if(!i||!i.url)continue;let r=i.url.trim();if(t.has(r))continue;t.add(r);let l=K(i.lang,i.label||i.name||i.language),e=l.name||i.label||i.name||"Altyaz\u0131";a.push({id:String(a.length),url:r,label:e,name:e,language:l.language,lang:l.code,langCode:l.iso3,headers:i.headers})}return a}function H(n){let{m3u8Text:s,m3u8Url:a,externalSubtitles:t,siteHint:o,defaultTitle:i}=n,r=F(s,a),l=B(t),e=B(t,r.embeddedSubtitles),c=e.length>0||!!o?.isAltyazi,h=e.some(d=>d.lang==="tr"||d.lang==="st"||d.lang==="sot"||d.langCode==="tur"||d.langCode==="sot"||d.label?.toLowerCase().includes("t\xFCrk")||d.label?.toLowerCase().includes("sotho")||d.language==="Turkish"||d.language?.toLowerCase().includes("sotho")),f=r.hasTurkishAudio||!!o?.isDublaj,u=r.hasOriginalAudio,b=r.isDual||f&&(h||u),T=ce({hasTurkishAudio:f,hasOriginalAudio:u,isDual:b,hasSubtitles:c,hasTurkishSubtitles:h,isYerli:o?.isYerli,siteHint:o,defaultTitle:i});return{hasTurkishAudio:f,hasOriginalAudio:u,isDual:b,hasSubtitles:c,hasTurkishSubtitles:h,isYerli:o?.isYerli,languageTitle:T,subtitles:l}}function Y(n){let s=n.url?F(void 0,n.url):{},a=n.quality||s.detectedQuality||"1080p";a.includes("\u2022")&&(a=a.split("\u2022")[0].trim()),!a.includes("p")&&!a.includes("K")&&!a.includes("k")&&(a=`${a}p`);let t=n.subtitles||n.inspection?.subtitles,o=!!(n.inspection?.hasTurkishSubtitles||t?.some(_=>{let C=(_.lang||_.code||"").toLowerCase(),A=(_.langCode||_.iso3||"").toLowerCase(),I=(_.name||_.label||_.title||"").toLowerCase();return C==="tr"||C==="st"||A==="tur"||A==="sot"||I.includes("t\xFCrk")||I.includes("turk")||I.includes("sotho")})),i=(n.languageTitle||n.inspection?.languageTitle||"").toLowerCase().trim(),r=i.includes("dub")||i.includes("ses")||i.includes("dual")||!!s.hasTurkishAudio||!!n.inspection?.hasTurkishAudio,l=i.includes("dual")||i.includes("dub")&&(i.includes("alt")||i.includes("sub"))||r&&o,e="Orijinal";i.includes("yerli")||n.inspection?.isYerli?e="Yerli":l?e="Dublaj / Altyaz\u0131l\u0131":r?e="Dublaj":o||i.includes("alt")||i.includes("sub")?e="Altyaz\u0131l\u0131":(i.includes("orijinal")||i.includes("yabanc\u0131")||i.includes("original"))&&(e="Orijinal");let c=n.format==="m3u8"||n.url.includes(".m3u8")||n.url.includes("/master.")||n.url.includes("/hls/")||n.url.includes("/txt/"),h=n.format||(c?"m3u8":n.url.includes(".mp4")?"mp4":"m3u8"),f=h==="m3u8"?"HLS":h.toUpperCase(),u=[a],b=n.codec||s.detectedCodec;b&&b!=="H.264"&&u.push(b),u.push(f),n.bitrate&&u.push(n.bitrate);let T=n.audio||s.detectedAudio;T&&T!=="AAC 2.0"&&u.push(T);let d=n.details||u.join(" \u2022 "),g=`${e}
${d}`,p=`${a} \u2022 ${e}`,m={name:n.name,title:e,description:g,url:n.url,quality:p,format:h};return n.headers&&Object.keys(n.headers).length>0&&(m.headers=n.headers),t&&t.length>0&&(m.subtitles=t),m}var L=[104,116,116,112,115,58,47,47,110,101,120,116,103,101,110,99,108,111,117,100,102,97,98,114,105,99,46,99,111,109].map(n=>String.fromCharCode(n)).join(""),W="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";async function M(n,s,a,t){let o=Date.now(),i=String(s||"").toLowerCase().trim(),r=i==="tv"||i==="series"||i==="show",l=r?"tv":"movie",e=String(n||"").replace(/^tmdb:/i,"").trim();if(!e)return[];k("Gaban",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${e}, T\xFCr: ${l}, Sezon: ${a}, B\xF6l\xFCm: ${t}`);try{if(r&&/^\d+$/.test(e))try{let w=await x(`tv/${e}?language=tr-TR`);if(w){let J=Array.isArray(w?.origin_country)?w.origin_country:[],q=(w?.original_language||"").toLowerCase();if(J.includes("TR")&&q==="tr")return k("Gaban",`Yerli T\xFCrk dizisi tespit edildi (${w?.name}), atland\u0131.`,"info"),[]}}catch{}k("Gaban",`[Ad\u0131m 1/3] IMDb ID \xE7\xF6z\xFCmleniyor (${e})...`);let c=await U(e,l);if(!c||!c.startsWith("tt"))return k("Gaban","IMDb kimli\u011Fi bulunamad\u0131.","warn"),[];let h=await O("gaban");if(!h)return k("Gaban","Domain not resolved","warn"),[];let f=a?Math.max(1,Number(a)):1,u=t?Math.max(1,Number(t)):1;k("Gaban","[Ad\u0131m 2/3] API sorgulan\u0131yor...");let b=r?`${h}/api.php?imdb=${encodeURIComponent(c)}&type=tv&season=${f}&episode=${u}`:`${h}/api.php?imdb=${encodeURIComponent(c)}&type=movie`,T=r?`${L}/embed/tv/${c}/${f}/${u}`:`${L}/embed/movie/${c}`,d=typeof AbortSignal<"u"&&AbortSignal.timeout?AbortSignal.timeout(6e3):void 0,g=await fetch(b,{signal:d,headers:{"User-Agent":W,Referer:T,Origin:L,Accept:"application/json, text/plain, */*"}});if(!g.ok)return k("Gaban",`API HTTP hatas\u0131: ${g.status}`,"warn"),[];let p=await g.json();if(p?.status_code!=="200"&&p?.status_code!==200)return k("Gaban",`API ge\xE7ersiz yan\u0131t d\xF6nd\xFC: ${p?.status_code}`,"warn"),[];let m=Array.isArray(p?.data?.stream_urls)?p.data.stream_urls:[];if(m.length===0)return k("Gaban","Video ak\u0131\u015F\u0131 bulunamad\u0131.","warn"),[];let _={Referer:`${L}/`,Origin:L,"User-Agent":W},C=H({m3u8Url:m[0],siteHint:{isDublaj:!1,isAltyazi:!1,label:"Orijinal"}}),I=[Y({name:"Gaban",url:m[0].trim(),inspection:C,quality:"1080p",format:"m3u8",headers:_})],V=((Date.now()-o)/1e3).toFixed(2);return k("Gaban",`[Ad\u0131m 3/3] TAMAMLANDI: 1 ak\u0131\u015F haz\u0131rland\u0131 (${V}s)`,"success",I.map(w=>({title:w.title,quality:w.quality||"1080p",format:"m3u8"}))),I}catch(c){return k("Gaban",`Hata: ${c.message||"Scrape error"}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=M);var ue={getStreams:M};

var _exp = (typeof module !== "undefined" && module.exports) ? module.exports : {};
var _gs = typeof getStreams !== "undefined" ? getStreams : _exp.getStreams;
var _sub = typeof getSubtitles !== "undefined" ? getSubtitles : _exp.getSubtitles;
if (typeof globalThis !== "undefined") { if (_gs) globalThis.getStreams = _gs; if (_sub) globalThis.getSubtitles = _sub; }
if (typeof global !== "undefined") { if (_gs) global.getStreams = _gs; if (_sub) global.getSubtitles = _sub; }
if (typeof module !== "undefined" && module.exports) { if (_gs) module.exports.getStreams = _gs; if (_sub) module.exports.getSubtitles = _sub; }

;(()=>{const n="han's 36",g=globalThis,m=typeof module!=="undefined"?module:null,f=g&&typeof g.getStreams==="function"?g.getStreams:m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
