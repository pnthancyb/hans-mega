# hans-mega

Nuvio için 42 provider içeren Han markalı birleşik depo.

## Manifest

```text
https://raw.githubusercontent.com/pnthancyb/hans-mega/main/manifest.json
```

Provider adları `han's 1` ile `han's 44` arasındadır. Provider JS dosyaları güncel izlealan manifestinden alınır, Han stream metadata wrapper'ı ile aynalanır ve GitHub raw üzerinden servis edilir.

Kaynak manifesti: https://nuvio.ayruki.workers.dev/ (son senkron sürümü: 1.14.592)

## Otomatik güncelleme

`sync-izlealan.mjs` kaynak manifestini ve tüm provider JS dosyalarını indirir. Kaynak ID'leri `sources/izlealan-provider-map.json` içinde kalıcı olarak `han's N` numaralarına bağlanır. Yeni bir kaynak provider mevcut en yüksek numaranın sonrasına eklenir; silinen provider numarası tekrar kullanılmaz.

GitHub Actions, kaynağı günde dört kez ve manuel çalıştırma isteğiyle kontrol eder. Değişiklik olduğunda manifest, provider dosyaları, eşleme ve kaynak notu tek commit olarak güncellenir.
