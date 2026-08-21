# Kekik CloudStream kaynak eşlemesi

Kekik-cloudstream, Kotlin tabanlı CloudStream eklentileri içerir; Nuvio ise JavaScript provider sözleşmesi kullanır. Bu nedenle Kotlin bytecode/source dosyaları çalışır provider gibi kopyalanmadı. Aynı kaynak siteler, Nuvio uyarlamaları olan tekilleştirilmiş provider dosyalarıyla temsil edilir.

Upstream: https://github.com/nthdocomo/Kekik-cloudstream

## Kaynak modüller
- `.github`
- `AnimeciX`
- `BelgeselX`
- `CanliTV`
- `CizgiMax`
- `DiziBox`
- `DiziKorea`
- `DiziMom`
- `DiziPal`
- `DiziYou`
- `Dizilla`
- `FilmMakinesi`
- `FilmModu`
- `FullHDFilm`
- `FullHDFilmizlesene`
- `FullPorner`
- `HDFilmCehennemi`
- `HQPorner`
- `InatBox`
- `IzleAI`
- `JetFilmizle`
- `KoreanTurk`
- `KultFilmler`
- `NetflixMirror`
- `OxAx`
- `PornHub`
- `RareFilmm`
- `RecTV`
- `SetFilmIzle`
- `SezonlukDizi`
- `SineWix`
- `SinemaCX`
- `SpankBang`
- `SuperFilmGeldi`
- `TurkAnime`
- `UgurFilm`
- `UncutMaza`
- `Watch2Movies`
- `WebteIzle`
- `YouTube`
- `__Temel`
- `xHamster`

## Nuvio uyarlama notu
- `FilmModu`, `FullHDFilmizlesene`, `JetFilmizle`, `SezonlukDizi`, `SinemaCX`, `SineWix`, `WebteIzle`, `DiziYou`, `FilmMakinesi`, `HDFilmCehennemi`, `SetFilmIzle` gibi modüller mevcut Nuvio provider’larıyla tekilleştirildi.
- Nuvio formatında karşılığı bulunmayan modüller bu sürüme çalışır provider olarak eklenmedi; yanlış/bozuk bir JavaScript dönüşümü üretmek yerine kaynak listesinde korunuyor.
