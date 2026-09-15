
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




"use strict";var v=Object.defineProperty;var W=Object.getOwnPropertyDescriptor;var q=Object.getOwnPropertyNames;var J=Object.prototype.hasOwnProperty;var V=(e,t)=>{for(var i in t)v(e,i,{get:t[i],enumerable:!0})},X=(e,t,i,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of q(t))!J.call(e,o)&&o!==i&&v(e,o,{get:()=>t[o],enumerable:!(n=W(t,o))||n.enumerable});return e};var Q=e=>X(v({},"__esModule",{value:!0}),e);var le={};V(le,{getStreams:()=>G});module.exports=Q(le);var Z=[66,94,94,90,89,16,5,5,67,80,70,79,70,75,68,7,78,69,71,75,67,68,4,75,83,88,95,65,67,4,93,69,88,65,79,88,89,4,78,79,92,5,78,69,71,75,67,68,89].map(t=>String.fromCharCode(t^42)).join(""),ee={REMOTE_CONFIG_URL:Z,DEFAULT_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},M={},_=typeof globalThis<"u"?globalThis:typeof global<"u"?global:typeof window<"u"?window:{};_.__NUVIO_CONFIG_STATE__||(_.__NUVIO_CONFIG_STATE__={cachedDomains:{...M},cachedCookies:{},cachedTmdbKeys:[],lastFetchTime:0,activeFetchPromise:null});var b=_.__NUVIO_CONFIG_STATE__,O=10*60*1e3;async function ae(){let e=Date.now();try{let t={};if(typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function")try{let n=AbortSignal.timeout(4e3);n&&(t.signal=n)}catch{}let i=await fetch(ee.REMOTE_CONFIG_URL,t);if(i.ok){let n=await i.json(),o=n?.data??n,s=o.domains||o,r=o.cookies,g=o.tmdb_keys||o.tmdbKeys;s&&typeof s=="object"&&(b.cachedDomains={...b.cachedDomains,...s}),r&&typeof r=="object"&&(b.cachedCookies={...b.cachedCookies,...r}),Array.isArray(g)&&g.length>0&&(b.cachedTmdbKeys=g),b.lastFetchTime=e}else b.lastFetchTime=e-O+6e4}catch{b.lastFetchTime=e-O+6e4}}async function ne(){Date.now()-b.lastFetchTime>O&&(b.activeFetchPromise||(b.activeFetchPromise=ae().finally(()=>{b.activeFetchPromise=null})),await b.activeFetchPromise)}async function $(e){return await ne(),b.cachedDomains[e]||M[e]||""}function k(e,t,i="info",n){let o=`[${e}]`;i==="error"?console.error(o,t,n||""):i==="warn"?console.warn(o,t,n||""):console.log(o,t,n||"");try{let r=(typeof globalThis<"u"?globalThis:typeof global<"u"?global:{}).__NUVIO_DEV_LOG_URL__;typeof r=="string"&&r.startsWith("http")&&fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:e,level:i,message:t,details:n})}).catch(()=>{})}catch{}}var ie=["t\xFCrk\xE7e","turkish","turkce","dublaj","tr","tur","dual","trdual","trdub","ses-tr","audio-tr","tr-dub"],te=["english","ingilizce","original","orijinal","en","eng","und","audio-en"];function se(e,t){let i=!1,n=!1,o=[],s,r,g,a=(t||"").toLowerCase();if(a.includes("trdual")||a.includes("dual")||a.includes("trdub")||a.includes("dublaj")?(i=!0,n=!0):(a.includes("ses-tr")||a.includes("turkcedublaj")||a.includes("turkce-dublaj"))&&(i=!0),a.includes("2160p")||a.includes("4k")||a.includes("uhd")?s="4K":a.includes("1080p")||a.includes("1920x1080")||a.includes("fhd")?s="1080p":a.includes("720p")||a.includes("1280x720")||a.includes("hd")?s="720p":(a.includes("480p")||a.includes("854x480")||a.includes("sd"))&&(s="480p"),a.includes("hevc")||a.includes("h265")||a.includes("x265")?r="HEVC":a.includes("av1")?r="AV1":(a.includes("h264")||a.includes("x264")||a.includes("avc"))&&(r="H.264"),a.includes("5.1")||a.includes("eac3")||a.includes("ac3")||a.includes("ddp")?g="Dolby 5.1":(a.includes("7.1")||a.includes("atmos"))&&(g="Dolby Atmos 7.1"),e&&typeof e=="string"){let S=e.split(/\r?\n/);for(let c of S){let l=c.trim();if(l.startsWith("#EXT-X-MEDIA:")&&l.includes("TYPE=AUDIO")){let y=l.match(/NAME=["']([^"']+)["']/i),p=l.match(/LANGUAGE=["']([^"']+)["']/i),C=l.match(/GROUP-ID=["']([^"']+)["']/i),u=(y?y[1]:"").toLowerCase(),h=(p?p[1]:"").toLowerCase(),d=(C?C[1]:"").toLowerCase(),m=ie.some(f=>u.includes(f)||h===f||d.includes(f))||u.includes("t\xFCrk")||u.includes("turk")||d.includes("dual"),T=te.some(f=>u.includes(f)||h===f||d.includes(f))||u.includes("orig")||u.includes("ing")||u.includes("eng");m&&(i=!0),T&&(n=!0)}if(l.startsWith("#EXT-X-MEDIA:")&&l.includes("TYPE=SUBTITLES")){let y=l.match(/URI=["']([^"']+)["']/i),p=l.match(/NAME=["']([^"']+)["']/i),C=l.match(/LANGUAGE=["']([^"']+)["']/i);if(y&&y[1]){let u=y[1];if(t&&!u.startsWith("http"))try{u=new URL(u,t).toString()}catch{}let h=p?p[1]:"Altyaz\u0131",d=C?C[1].toLowerCase():"";d==="st"||d==="sot"||h.toLowerCase().includes("sotho")||h.toLowerCase().includes("sesotho")||u.toLowerCase().includes("sub_st")?(d="tr",h="T\xFCrk\xE7e"):d||(d=h.toLowerCase().includes("t\xFCrk")?"tr":"und");let T=oe(d,h);o.push({label:T.name||h,url:u,lang:T.code||d})}}}}let A=i&&n||a.includes("dual")||a.includes("trdual");return{hasTurkishAudio:i,hasOriginalAudio:n,isDual:A,embeddedSubtitles:o,detectedQuality:s,detectedCodec:r,detectedAudio:g}}var L={tr:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},tur:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkish:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},turkce:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},st:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sot:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},sesotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},guneysotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"guney sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},southernsotho:{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},"southern sotho":{code:"tr",iso3:"tur",language:"Turkish",name:"T\xFCrk\xE7e"},en:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},eng:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},english:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},ingilizce:{code:"en",iso3:"eng",language:"English",name:"\u0130ngilizce"},de:{code:"de",iso3:"deu",language:"German",name:"Almanca"},ger:{code:"de",iso3:"deu",language:"German",name:"Almanca"},deu:{code:"de",iso3:"deu",language:"German",name:"Almanca"},german:{code:"de",iso3:"deu",language:"German",name:"Almanca"},almanca:{code:"de",iso3:"deu",language:"German",name:"Almanca"},fr:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fra:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fre:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},french:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},fransizca:{code:"fr",iso3:"fra",language:"French",name:"Frans\u0131zca"},es:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spa:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},spanish:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},ispanyolca:{code:"es",iso3:"spa",language:"Spanish",name:"\u0130spanyolca"},pt:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},por:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portuguese:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},portekizce:{code:"pt",iso3:"por",language:"Portuguese",name:"Portekizce"},"pt-br":{code:"pt-BR",iso3:"por",language:"Portuguese (BR)",name:"Portekizce (Brezilya)"},it:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ita:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italian:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},italyanca:{code:"it",iso3:"ita",language:"Italian",name:"\u0130talyanca"},ru:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rus:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},russian:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},rusca:{code:"ru",iso3:"rus",language:"Russian",name:"Rus\xE7a"},ar:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ara:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arabic:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},arapca:{code:"ar",iso3:"ara",language:"Arabic",name:"Arap\xE7a"},ja:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},jpn:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japanese:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},japonca:{code:"ja",iso3:"jpn",language:"Japanese",name:"Japonca"},ko:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},kor:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korean:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},korece:{code:"ko",iso3:"kor",language:"Korean",name:"Korece"},zh:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chi:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},chinese:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},cince:{code:"zh",iso3:"chi",language:"Chinese",name:"\xC7ince"},az:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},aze:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaijani:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"},azerbaycanca:{code:"az",iso3:"aze",language:"Azerbaijani",name:"Azerbaycanca"}};function oe(e,t){let i=c=>(c||"").replace(/İ/g,"i").replace(/I/g,"i").replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ö/g,"o").replace(/ç/g,"c").toLowerCase().trim(),n=i(e||""),o=i(t||""),s=n.includes("forced")||o.includes("forced"),r=n.replace(/\b(forced|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim(),g=o.replace(/\b(forced|narrative|captions|cc|sdh)\b/g,"").replace(/[-_()[\]]/g," ").trim();if(r==="st"||r==="sot"||r.includes("sotho")||g.includes("sotho")||g.includes("sesotho"))return{code:"tr",iso3:"tur",language:"Turkish",name:s?"T\xFCrk\xE7e (Forced)":"T\xFCrk\xE7e"};let a=L[n]||L[o]||L[r]||L[g];if(!a){let c=(g+" "+r).split(/\s+/).filter(Boolean);for(let l of c)if(L[l]){a=L[l];break}}if(!a){for(let[c,l]of Object.entries(L))if(c.length>=4&&(g.includes(c)||r.includes(c))){a=l;break}}if(a)return{code:a.code,iso3:a.iso3,language:a.language,name:s?`${a.name} (Forced)`:a.name};let A=(t||e||"Altyaz\u0131").trim(),S=A.charAt(0).toUpperCase()+A.slice(1);return{code:n&&n.length===2?n:"und",iso3:n&&n.length===3?n:"und",language:S,name:s&&!A.toLowerCase().includes("forced")?`${A} (Forced)`:A}}function B(e){let t=e.url?se(void 0,e.url):{},i=e.quality||t.detectedQuality||"1080p";i.includes("\u2022")&&(i=i.split("\u2022")[0].trim()),!i.includes("p")&&!i.includes("K")&&!i.includes("k")&&(i=`${i}p`);let n=e.subtitles||e.inspection?.subtitles,o=!!(e.inspection?.hasTurkishSubtitles||n?.some(m=>{let T=(m.lang||m.code||"").toLowerCase(),f=(m.langCode||m.iso3||"").toLowerCase(),D=(m.name||m.label||m.title||"").toLowerCase();return T==="tr"||T==="st"||f==="tur"||f==="sot"||D.includes("t\xFCrk")||D.includes("turk")||D.includes("sotho")})),s=(e.languageTitle||e.inspection?.languageTitle||"").toLowerCase().trim(),r=s.includes("dub")||s.includes("ses")||s.includes("dual")||!!t.hasTurkishAudio||!!e.inspection?.hasTurkishAudio,g=s.includes("dual")||s.includes("dub")&&(s.includes("alt")||s.includes("sub"))||r&&o,a="Orijinal";s.includes("yerli")||e.inspection?.isYerli?a="Yerli":g?a="Dublaj / Altyaz\u0131l\u0131":r?a="Dublaj":o||s.includes("alt")||s.includes("sub")?a="Altyaz\u0131l\u0131":(s.includes("orijinal")||s.includes("yabanc\u0131")||s.includes("original"))&&(a="Orijinal");let A=e.format==="m3u8"||e.url.includes(".m3u8")||e.url.includes("/master.")||e.url.includes("/hls/")||e.url.includes("/txt/"),S=e.format||(A?"m3u8":e.url.includes(".mp4")?"mp4":"m3u8"),c=S==="m3u8"?"HLS":S.toUpperCase(),l=[i],y=e.codec||t.detectedCodec;y&&y!=="H.264"&&l.push(y),l.push(c),e.bitrate&&l.push(e.bitrate);let p=e.audio||t.detectedAudio;p&&p!=="AAC 2.0"&&l.push(p);let C=e.details||l.join(" \u2022 "),u=`${a}
${C}`,h=`${i} \u2022 ${a}`,d={name:e.name,title:a,description:u,url:e.url,quality:h,format:S};return e.headers&&Object.keys(e.headers).length>0&&(d.headers=e.headers),n&&n.length>0&&(d.subtitles=n),d}var R="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",re='"Chromium";v="130", "Google Chrome";v="130", "Not-A.Brand";v="99"';async function G(e,t,i,n){let o=Date.now();k("Rayleigh",`Tarama Ba\u015Flat\u0131ld\u0131 -> TMDB: ${e}, T\xFCr: ${t}, Sezon: ${i}, B\xF6l\xFCm: ${n}`);try{let s=String(e||"").trim(),r=String(t||"").toLowerCase().trim(),g=r==="tv"||r==="series",a=g?"tv":"movie",A=i!=null?parseInt(String(i),10):1,S=n!=null?parseInt(String(n),10):1;if(!s)return[];let c=await $("rayleigh"),l="";g?l=`${c}/api/tv/${s}/${A}/${S}`:l=`${c}/api/movie/${s}`,k("Rayleigh","[Ad\u0131m 1/3] Metadata API sorgulan\u0131yor...");let y={"User-Agent":R,"sec-ch-ua":re,"sec-ch-ua-mobile":"?0","sec-ch-ua-platform":'"Windows"',Accept:"application/json, text/javascript, */*; q=0.01","X-Requested-With":"XMLHttpRequest",Referer:c+"/"},p=await fetch(l,{headers:y,signal:AbortSignal.timeout?AbortSignal.timeout(3500):void 0});if(!p.ok)return k("Rayleigh",`API yan\u0131t vermedi: HTTP ${p.status}`,"warn"),[];let u=(await p.json())?.src;if(!u)return k("Rayleigh","API yan\u0131t\u0131nda embed ba\u011Flant\u0131s\u0131 bulunamad\u0131.","warn"),[];let h=`${c}${u}`;k("Rayleigh","[Ad\u0131m 2/3] Oynat\u0131c\u0131 embed sayfas\u0131 \xE7\xF6z\xFCmleniyor...");let d=await fetch(h,{headers:{Referer:c+"/","User-Agent":R},signal:AbortSignal.timeout?AbortSignal.timeout(3500):void 0});if(!d.ok)return k("Rayleigh",`Embed sayfas\u0131 y\xFCklenemedi: HTTP ${d.status}`,"warn"),[];let m=await d.text(),T=null,f=m.match(/window\.video\s*=\s*\{[^}]*id:\s*'([^']+)'/);if(f)T=f[1];else{let w=u.match(/\/embed\/([^?\/#]+)/);w&&(T=w[1])}if(!T)return k("Rayleigh","Video ID \xE7\xF6z\xFCmlenemedi.","warn"),[];let D=m.match(/window\.masterPlaylist\s*=\s*\{[\s\S]*?'token':\s*'([^']+)'/),x=m.match(/window\.masterPlaylist\s*=\s*\{[\s\S]*?'expires':\s*'([^']+)'/),P=m.match(/window\.masterPlaylist\s*=\s*\{[\s\S]*?url:\s*'([^']+)'/),I=D?D[1]:null,N=x?x[1]:null,F=P?P[1]:`${c}/playlist/${T}?b=1`;if(!I||!N)return k("Rayleigh","Token veya s\xFCre a\u015F\u0131m\u0131 bilgisi bulunamad\u0131.","warn"),[];let H=m.includes("window.canPlayFHD = true"),K=F.includes("?")?"&":"?",j=`${F}${K}token=${I}&expires=${N}`;H&&(j+="&h=1");let U=!1;try{let w=await fetch(j,{headers:{"User-Agent":R,Referer:h,Origin:c},signal:AbortSignal.timeout?AbortSignal.timeout(2500):void 0});if(w.ok){let z=(await w.text()).toLowerCase();U=z.includes("type=subtitles")&&(z.includes('name="turkish"')||z.includes('name="t\xFCrk\xE7e"')||z.includes('language="tr"')||z.includes('language="tur"')||z.includes('rendition="tr')||z.includes('rendition="tur'))}}catch{}let E=[B({name:"Rayleigh",url:j,languageTitle:U?"Altyaz\u0131l\u0131":"Yabanc\u0131",quality:"1080p",format:"m3u8",headers:{"User-Agent":R,Referer:h,Origin:c}})],Y=((Date.now()-o)/1e3).toFixed(2);return k("Rayleigh",`[Ad\u0131m 3/3] TAMAMLANDI: 1 stream haz\u0131rland\u0131 (${Y}s)`,"success",E.map(w=>({title:w.title,quality:"1080p",format:"m3u8"}))),E}catch(s){return k("Rayleigh",`Kritik Hata: ${s.message}`,"error"),[]}}typeof globalThis<"u"&&(globalThis.getStreams=G);

var _exp = (typeof module !== "undefined" && module.exports) ? module.exports : {};
var _gs = typeof getStreams !== "undefined" ? getStreams : _exp.getStreams;
var _sub = typeof getSubtitles !== "undefined" ? getSubtitles : _exp.getSubtitles;
if (typeof globalThis !== "undefined") { if (_gs) globalThis.getStreams = _gs; if (_sub) globalThis.getSubtitles = _sub; }
if (typeof global !== "undefined") { if (_gs) global.getStreams = _gs; if (_sub) global.getSubtitles = _sub; }
if (typeof module !== "undefined" && module.exports) { if (_gs) module.exports.getStreams = _gs; if (_sub) module.exports.getSubtitles = _sub; }

;(()=>{const n="han's 31",g=globalThis,m=typeof module!=="undefined"?module:null,f=g&&typeof g.getStreams==="function"?g.getStreams:m&&m.exports&&typeof m.exports.getStreams==="function"?m.exports.getStreams:null;if(!f)return;const c=new Map,w=async(...a)=>{let k;try{k=JSON.stringify(a)}catch{k=null}if(k&&c.has(k))return c.get(k);const p=(async()=>{const r=await f(...a);return Array.isArray(r)?r.map(x=>x&&typeof x==="object"?{...x,provider:n}:x):r})();if(k)c.set(k,p);try{return await p}finally{if(k&&c.get(k)===p)c.delete(k)}};if(g)g.getStreams=w;if(m&&m.exports){try{Object.defineProperty(m.exports,"getStreams",{value:w,configurable:true,enumerable:true,writable:true})}catch(e){m.exports.getStreams=w}}})();
