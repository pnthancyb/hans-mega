# hans-mega

Nuvio için 34 provider içeren Han markalı birleşik depo.

## manifest

```text
https://raw.githubusercontent.com/pnthancyb/hans-mega/main/manifest.json
```

Provider adları `han's 1` ile `han's 34` arasındadır. Çalışan JS kaynakları güncel izlealan manifestinden alınır; manifestteki her filename, Nuvio’nun provider’ı doğrudan alabilmesi için şu tabanı kullanır:

```text
https://nuvio.ayruki.workers.dev/{filename}
```

Yerel `providers/hans-N.js` dosyaları depodaki inceleme ve yedek kopyalardır.
