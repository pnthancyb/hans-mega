function clean(value) {
  return String(value == null ? "" : value)
    .replace(/\b(auto|unknown|bilinmiyor|undefined|null)\b/gi, "")
    .replace(/\s*[|•·-]\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectQuality(stream, text) {
  const raw = clean(stream && stream.quality) || text;
  const match = raw.match(/\b(2160p|1440p|1080p|720p|576p|480p|360p|4k|2k)\b/i);
  return match ? match[1].toLowerCase() : "";
}

function detectLanguage(text) {
  if (/(türkçe\s*)?(dublaj|dubbed|turkish\s*dub)/i.test(text)) return "dublaj";
  if (/(türkçe\s*)?(altyazı|altyazılı|subtitles?|subbed|turkish\s*sub)/i.test(text)) return "altyazılı";
  return "";
}

function normalizeStream(stream, providerName) {
  if (!stream || typeof stream !== "object") return stream;
  const text = [
    stream.name,
    stream.title,
    stream.quality,
    stream.size,
    stream.language,
    stream.lang,
    stream.label,
    stream.host
  ].filter(Boolean).join(" ");
  const parts = [providerName];
  const quality = detectQuality(stream, text);
  const language = detectLanguage(text);
  if (quality) parts.push(quality);
  if (language) parts.push(language);
  stream.name = parts.join(" • ");
  stream.provider = providerName;
  if (stream.quality && !detectQuality(stream, String(stream.quality))) {
    delete stream.quality;
  }
  return stream;
}

function wrapGetStreams(exportsObject, providerName) {
  if (!exportsObject || typeof exportsObject.getStreams !== "function") {
    return exportsObject;
  }
  const original = exportsObject.getStreams;
  exportsObject.getStreams = function () {
    return Promise.resolve(original.apply(this, arguments)).then(function (streams) {
      if (!Array.isArray(streams)) return streams;
      return streams.map(function (stream) {
        return normalizeStream(stream, providerName);
      });
    });
  };
  return exportsObject;
}

module.exports = { wrapGetStreams: wrapGetStreams };