# Han's Mega

Mooncrown `nuviotr` formatını temel alan, Türkçe Nuvio provider’larının tekilleştirilmiş birleşik deposu. Aynı kaynağı sağlayan provider’lar bir kez tutulur; provider tanımları `manifest.json` üzerinden yüklenir.

## Kurulum

Nuvio’ya şu manifest adresini ekleyin:

```text
https://raw.githubusercontent.com/pnthancyb/hans-mega/main/manifest.json
```

GitHub kullanıcı adınızı değiştirdikten sonra bu URL’yi kullanın.

## İçerik

- `manifest.json` — Nuvio provider kataloğu
- `providers/` — JavaScript provider’ları ve M3U listeleri
- `sources/merge-report.json` — seçilen ve atlanan girdilerin makine-okunur özeti
- `sources/kekik-cloudstream.md` — Kotlin CloudStream kaynaklarının Nuvio eşlemesi

## Birleştirme politikası

Öncelik sırası Mooncrown → Wekmed → patr0n’dur. Aynı siteyi hedefleyen kopyalarda ilk uyumlu provider korunur; özgün provider’lar ayrıca tutulur. Eksik manifest dosyası veya olmayan dosya yolu sessizce yutulmaz, rapora yazılır.

## Kaynaklar

- https://github.com/mooncrown04/nuviotr
- https://github.com/Wekmed/nuvio
- https://github.com/patr0nq/nuvioaddons
- https://github.com/nthdocomo/Kekik-cloudstream
