# hans-mega

Nuvio için 41 provider içeren yüksek performanslı Han markalı birleşik depo.

## Manifest

```text
https://raw.githubusercontent.com/pnthancyb/hans-mega/main/manifest.json
```

Tüm sağlayıcı adları `han's 1` ile `han's 41` arasında eksiksiz ve ardışıktır.
İzlelan (izlelan.com) güncel kaynaklarından (v1.14.606) beslenir.

## Özellikler & Performans
- **Atlamasız Sıralama:** Provider numaralandırmaları hiçbir zaman atlamaz, her zaman ardışık 1..41 sıralıdır.
- **Ultra Hızlı Akış:** Sağlayıcı domainleri izlelan.com/domains.json üzerinden önceden çözümlenir (0ms gecikme), askıda kalan sunucular Nuvio'yu dondurmaz (5.5s timeout).
- **10 Dakikalık TTL Akış Önbelleği:** Aynı içerik için tekrarlanan istekler anında yanıtlanır.
- **Otomatik Senkronizasyon:** GitHub Actions upstream kaynakları periyodik kontrol eder ve yeni eklentileri ardışık sıraya dahil eder.
