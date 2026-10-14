<!-- i18n-source: README.md@a27fd9e08503079d2f77990dc0d71a2896261644 status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-light.svg" alt="sdkbump: Checks native iOS, Flutter and React Native apps for the iOS 27 SDK changes and names the fix for each."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/sdkbump/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/sdkbump/actions/workflows/ci.yml/badge.svg" alt="CI durumu"></a>
<a href="https://github.com/muhittincamdali/sdkbump/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-light.svg" alt="Son sürüm: v0.1.1"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-light.svg" alt="Dil sürümü: Node.js 22.12+"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-light.svg" alt="Lisans: MIT"></picture></a>
</p>

<p align="center">
<a href="#hızlı-başlangıç"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-tr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-tr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-tr-light.svg" alt="Başlayın"></picture></a>
<a href="https://muhittincamdali.github.io/sdkbump/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-tr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-tr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-tr-light.svg" alt="Dokümantasyon"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/tree/main/docs/guides"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-tr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-tr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-tr-light.svg" alt="Rehberler"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/tree/main/examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-tr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-tr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-tr-light.svg" alt="Örnekler"></picture></a>
</p>

> Bu belge İngilizce README'nin çevirisidir. İkisi arasında fark varsa güncel olan İngilizce sürümdür.

<!-- brand:end -->

Xcode 27 ile derlenmiş bir sürümü yayınlamadan önce: sdkbump, yerel iOS, Flutter veya React
Native/Expo projesini iOS 27 SDK'sının getirdiği değişiklikler (başta UIScene yaşam döngüsü) için
denetler ve her bulgu için hangi çözümün geçerli olduğunu söyler. Projenizin dosyalarını okur;
hiçbir şeyi derlemez, çalıştırmaz veya değiştirmez.

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-rn-087-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-rn-087-light.svg"><img src="docs/media/demo-rn-087-light.svg" alt="React Native 0.87 uygulamasında çalıştırılan sdkbump: iOS 27 SDK'sıyla derlendiğinde açılmıyor; SCN001 sahne yapılandırması yok ve SCN002 pencere uygulama delegesinde oluşturuluyor, üç çözüm yoluyla"></picture>

<sub>Gerçek CLI'dan kaydedildi; <a href="fixtures/rn-087">rn-087 fixture</a>'ında, yani
<code>@react-native-community/cli init</code> ile oluşturulmuş bir React Native 0.87.1
uygulamasında (<code>npm run demo</code>).</sub>

## Öne çıkanlar

- **"Açılacak mı?" sorusunu yanıtlar.** Hiçbir sahne tanımlamayan bir uygulama Xcode 27 ile derlenir,
  ama açılışta durur. sdkbump bunu bir test cihazında fark etmenizden önce söyler ve değiştirmeniz
  gereken dosyaları belirtir.
- **Yerel, Flutter, React Native ve Expo** tek raporda, aynı kural kimlikleriyle; metin, Markdown
  veya JSON olarak ve CI için bir çıkış koduyla.
- **Projenize uyan çözüm**: React Native 0.88 veya elle yazılmış bir sahne delegesi, Expo SDK 57'nin
  isteğe bağlı desteği veya SDK 58, Flutter'ın otomatik geçişi veya elle yapılacak adımlar (sdkbump,
  Flutter'ın geçiş aracıyla aynı koşulları denetler) ya da SwiftUI uygulaması için SwiftUI API'si.
- **Sessiz bozulmalar da**: uygulamada bir sahne olduğunda UIKit'in artık kullanmadığı uygulama
  delegesi metotları ve başlatma seçenekleri (bağlantılar, Handoff, hızlı eylemler, ön plan ve arka
  plan geçişleri) ile doğru pencereyi artık bulamayan pencere sorguları.
- **Her ifadenin bir kaynağı var.** Kurallar veridir ([rules/ios27.json](rules/ios27.json)) ve her
  biri Apple'ın, Flutter'ın, React Native'in veya Expo'nun kendi sayfalarına atıfta bulunur; birinin
  kaynağı yoksa testler başarısız olur.
- **iOS 27 simülatöründe denendi**: SCN001 ve SCN002'nin arkasındaki açılış hatası ve siyah ekran
  Xcode 27.0 ile yeniden üretildi; kayıtlar depodadır.

## Hızlı başlangıç

[Node.js](https://nodejs.org/) 22.12 veya üstü gerekir (`node --version` sürümü gösterir; Mac'te
`brew install node` ile kurulur). Başka bir şey gerekmez.

**1. Uygulamanızın klasöründe bir terminal açın**; `.xcodeproj`, `pubspec.yaml` veya
`package.json` dosyasının bulunduğu klasör:

```sh
cd path/to/YourApp
```

**2. sdkbump'ı çalıştırın:**

```sh
npx https://github.com/muhittincamdali/sdkbump/releases/download/v0.1.1/sdkbump-0.1.1.tgz
```

sdkbump henüz npm'de değil (oraya yayımlanması planlanıyor), bu yüzden şimdilik `npx sdkbump`
çalışmaz. Yukarıdaki komut GitHub'daki 0.1.1 sürümünü çalıştırır; bu README'de `npx sdkbump`
geçen her yerde onu kullanın.

**3. Projenizin adının altındaki ilk satırı okuyun.** "Fails to launch when built with the iOS 27
SDK" (iOS 27 SDK'sıyla derlendiğinde açılmıyor), **ERROR** bulgularını düzeltene kadar uygulamanın
açılışta duracağı anlamına gelir; her bulgu, "How to fix" listesindeki hangi çözümün geçerli
olduğunu söyler. **WARNING** bulguları açılışı engellemez, ancak uygulamada bir sahne olunca
çalışmayı bırakır.

## iOS 27 SDK'sıyla derleyince ne değişiyor

Apple'ın
[Transitioning to the UIKit scene-based life cycle](https://developer.apple.com/documentation/uikit/transitioning-to-the-uikit-scene-based-life-cycle)
sayfasından (çeviri):

> iOS 27, iPadOS 27, Mac Catalyst 27, tvOS 27 ve visionOS 27'den itibaren, en son SDK ile derlenen
> uygulamaların sahne tabanlı yaşam döngüsünü benimsemesi gerekir; aksi halde açılmazlar.

1. **Uygulama hiçbir sahne tanımlamıyorsa açılışta durur.** Info.plist'te yapılandırması olan bir
   `UIApplicationSceneManifest` yok ve `application(_:configurationForConnecting:options:)` yok:
   UIKit süreci "UIScene life cycle is required for apps built with this SDK" iletisiyle sonlandırır.
   Derleyici uyarı vermez, çünkü denetim uygulama başlarken yapılır. React Native 0.87 ve öncesi,
   isteğe bağlı desteği açılmamış Expo SDK 57 ve Expo SDK 56 ve öncesi böyle uygulamalar oluşturur;
   Flutter aracının geçiremediği Flutter uygulamaları da öyle.
2. **Bir sahne varsa uygulama delegesi artık arayüz olaylarını almaz.** Bağlantılar, kullanıcı
   etkinlikleri, hızlı eylemler ve etkin/arka plan geçişleri sahne delegesine gider; uygulama
   delegesinin oluşturduğu pencere ise hiç gösterilmez.

[Neden derleniyor ama yine de çöküyor](docs/guides/why-it-crashes.md), iOS 27.0 simülatöründe
çalıştırdığımız [açılış matrisini](examples/launch-matrix/README.md) gösterir.

## sdkbump neleri denetler

| Kural  | Önem derecesi | Bulgu                                                                                                                                                                                                  | iOS 27.0 simülatöründe gözlenen                                           |
| ------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| SCN001 | error         | Sahne yapılandırması yok: yapılandırılmış `UIApplicationSceneManifest` yok, `configurationForConnecting` yok, SwiftUI `App` değil; `ios/` klasörü olmayan Expo için SDK sürümü ve `enableSceneSupport` | açılışta duruyor                                                          |
| SCN002 | error         | Uygulama delegesi pencereyi `UIWindow(frame:)` ile oluşturuyor                                                                                                                                         | uygulamada bir sahne olunca siyah ekran                                   |
| SCN003 | warning       | UIKit'in sahnelerle artık kullanmadığı uygulama delegesi metotları ve başlatma seçeneği anahtarları (13 tane), sahne delegesi zaten işlemiyorsa                                                        | bir SwiftUI uygulamasında `applicationDidEnterBackground(_:)` çağrılmıyor |
| SCN004 | warning       | `UIApplication.shared.keyWindow`, `.windows` veya uygulama delegesinin `window` özelliği üzerinden pencere sorguları                                                                                   | yalnızca derleyicinin kullanımdan kaldırma uyarıları                      |

Kural verisi `ios27@2026.10.15`, Xcode 27.0 (27A266a) ile denetlendi. React Native veya Expo
projesinde `react-native-uiscene-bridge` ya da `react-native-xcode27` kuruluysa, bunların çalışma
zamanında ele aldığı bulgular README'lerindeki sınırlarla birlikte "ele alınmış" olarak gösterilir
ve çalıştırmayı başarısız saymaz.

## Kurulum

sdkbump henüz npm'de değil; oraya yayımlanması planlanıyor. O zamana kadar yukarıda gösterildiği gibi
GitHub'daki 0.1.1 sürümünü çalıştırın ya da bir projeye ekleyin:

```sh
npm install --save-dev https://github.com/muhittincamdali/sdkbump/releases/download/v0.1.1/sdkbump-0.1.1.tgz
npx sdkbump
```

sdkbump npm'e çıktığında `npx sdkbump` son sürümü indirip çalıştırır ve
`npm install --save-dev sdkbump` bir sürümü sabitler. `muhittincamdali/tap` için bir Homebrew
formülü release workflow'u tarafından hazırlanır (tap'in ilk sürümüyle birlikte planlanıyor).

## Kullanım

```text
sdkbump [path] [options]
```

| Seçenek                 | Ne yapar                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------- |
| `path`                  | Proje klasörü veya `.xcodeproj`; varsayılan geçerli klasördür                         |
| `-f, --format <format>` | `tty` (varsayılan), `markdown` veya `json`                                            |
| `-o, --output <file>`   | Raporu terminal yerine bir dosyaya yazar                                              |
| `--fail-on <severity>`  | `error` (varsayılan), `warning`, `info` veya `none`: çıkış kodunun ne zaman 1 olacağı |
| `--no-color`            | Terminalde bile düz metin (`NO_COLOR` ve `FORCE_COLOR` dikkate alınır)                |

Çıkış kodları: `0` `--fail-on` düzeyinde veya üstünde ele alınmamış bulgu yok, `1` bu düzeyde veya
üstünde bulgu var, `2` hatalı argüman, iOS projesi bulunamadı veya beklenmeyen bir hata.

sdkbump iOS uygulamasını kendisi bulur: yerel uygulamalar için kökteki veya bir klasör altındaki bir
`.xcodeproj`, Flutter, React Native ve Expo uygulamaları için `ios/` (Flutter eklentisi için
`example/ios/`). Proje dosyasındaki her iOS uygulama hedefini, her birinin adını verdiği Info.plist
dosyasını (XML veya ikili) ve uygulamanın Swift ile Objective-C dosyalarını okur; Pods,
`node_modules`, derleme çıktıları ve testleri atlar. `ios/` klasörü olmayan Expo uygulamaları
package.json ve app.json üzerinden denetlenir.

### Markdown raporunu kodla birlikte saklayın

```sh
npx sdkbump --format markdown --output sdkbump.md
```

### JSON raporunu betiklerde kullanın

```sh
npx sdkbump --format json > sdkbump.json
```

Her bulguda `rule`, `severity`, `file`, `line`, `message`, adımları ve rehberiyle `fix`,
`alternatives`, `mitigation` (bir geçici çözüm paketi ele alıyorsa dolu olur) ve `sources` bulunur.
Yapı `schemaVersion` 0'dır ve 1.0'dan önce değişebilir.
[examples/shell/launch-blockers.sh](examples/shell/launch-blockers.sh) bunu `jq` ile süzer.

### CI'da çalıştırın

[examples/github-actions/sdkbump.yml](examples/github-actions/sdkbump.yml), iOS uygulamasına dokunan
her pull request'in iş özetine raporu ekler ve hata varsa işi başarısız kılar.

### JavaScript'ten

```js
import { render, scan } from 'sdkbump';

const report = await scan('path/to/app');
console.log(report.verdict.text);
console.log(render(report, 'markdown'));
```

Çalıştırılabilir bir sürümü [examples/api/verdicts.mjs](examples/api/verdicts.mjs) dosyasındadır.

## Demo

Terminal kayıtları, her araç zinciriyle oluşturulmuş gerçek projeler olan
[fixture'lar](fixtures/README.md) üzerinde CLI'dan alınmıştır:

| Proje                                                            | Kayıt                                                                                |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| React Native 0.87.1 uygulaması                                   | bu sayfanın başında                                                                  |
| Özelleştirilmiş AppDelegate'li Flutter uygulaması (Flutter 3.24) | [açık](docs/media/demo-flutter-light.svg) · [koyu](docs/media/demo-flutter-dark.svg) |
| Adaptör uygulama delegeli SwiftUI uygulaması                     | [açık](docs/media/demo-swiftui-light.svg) · [koyu](docs/media/demo-swiftui-dark.svg) |

iOS 27.0 simülatöründe (iPhone 17, Xcode 27.0 ile derlendi) yerel UIKit fixture'ı açılışta durur;
aynı uygulama bir sahne delegesine taşındığında açılır:

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-simulator-native-uikit-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-simulator-native-uikit-light.svg"><img src="docs/media/demo-simulator-native-uikit-light.svg" alt="iOS 27.0 simülatöründe scripts/simulator-check.sh native-uikit: açılıştan 4 saniye sonra çalışmıyor; UIKit'in satırı: Application failed to launch: UIScene life cycle is required for apps built with this SDK"></picture>

<p align="center"><img src="docs/media/simulator/launched.png" width="480" alt="native-uikit-scenes ve native-swiftui fixture'ları, Xcode 27.0 ile derlenmiş, iOS 27.0 yüklü bir iPhone 17 simülatöründe çalışıyor"></p>

15 Ekim 2026'da, Node.js 26.11 yüklü bir Mac'te (Apple silicon, M5 Max), makinede başka işler
çalışırken ölçüldü: on fixture üzerinde `node dist/cli/main.js` 100'er çalıştırmalık üç seri,
Node.js'in açılışı dahil. Serilerin medyanları 0,11, 0,12 ve 0,19 saniye; en yavaş çalıştırma 0,33
saniye sürdü. Makine daha yüklüyken süreler uzar.

## Durum

| Özellik                                                                                                              | Durum             |
| -------------------------------------------------------------------------------------------------------------------- | ----------------- |
| Yerel, Flutter (uygulama ve eklenti örneği), React Native ve Expo projesi algılama                                   | çalışıyor         |
| Uygulamanın kendi Info.plist'i ve Swift/Objective-C kaynaklarında SCN001 ile SCN004                                  | çalışıyor         |
| Ekosisteme ve sürüme göre çözüm seçimi; Flutter otomatik geçiş denetimi; geçici çözüm paketleri                      | çalışıyor         |
| Terminal, Markdown ve JSON raporları; `--fail-on` çıkış kodları                                                      | çalışıyor         |
| Bağımlılıklar: Pods, `node_modules` ve Flutter eklenti kaynakları, paketin adıyla                                    | planlanıyor (0.2) |
| SCN005 geçici çözüm bildirimi ayrı bir kural olarak; 15.0 altındaki dağıtım hedefleri için DPT001                    | planlanıyor (0.2) |
| `--verify`: CLI'dan iOS 27 simülatöründe derleme ve açma                                                             | planlanıyor (0.3) |
| Kalıplar yerine Swift/Objective-C sözdizimi ağaçları; derlenmiş `.app` denetimleri; SiriKit kullanımdan kaldırmaları | planlanıyor (0.5) |
| Yerel uygulamalar için `fix --dry-run`, SARIF çıktısı, GitHub Action                                                 | planlanıyor (0.8) |
| Kararlı kural şeması ve JSON yapısı                                                                                  | planlanıyor (1.0) |

## Dokümantasyon

API başvurusu ve rehberler: [muhittincamdali.github.io/sdkbump](https://muhittincamdali.github.io/sdkbump/).

## Rehberler

- [Neden derleniyor ama yine de çöküyor](docs/guides/why-it-crashes.md)
- [Yerel UIKit ve SwiftUI uygulamaları](docs/guides/native-ios.md)
- [Flutter: özelleştirilmiş AppDelegate ve eklentiler](docs/guides/flutter.md)
- [0.88 öncesi React Native ve SDK 58 öncesi Expo](docs/guides/react-native-expo.md)
- [Yerel modül yazarları: soğuk başlangıçta bağlantılar ve bildirimler](docs/guides/native-module-authors.md)

## İlgili araçlar

Başka projeler de aynı değişiklik üzerinde çalışıyor; hangisinin uygun olduğu neye ihtiyacınız
olduğuna bağlıdır:

- [react-native-uiscene-bridge](https://github.com/Atomics-hub/react-native-uiscene-bridge) ve
  [react-native-xcode27](https://github.com/Atomics-hub/react-native-xcode27), bir React Native
  veya Expo uygulamasını kod değişikliği olmadan, çalışma zamanında açılır hale getirir. Henüz
  yükseltemediğinizde işe yararlar; sdkbump bunları tanır.
- [auditor-uiscene](https://github.com/Anzell/auditor-uiscene), Flutter uygulamalarını ve
  eklentilerini bir kabuk betiğiyle denetler.
- Flutter'ın kendi geçiş aracı (3.41'den itibaren `flutter build ios`), değiştirilmemiş bir Flutter
  uygulamasını geçirir.
- [flutter_spm_doctor](https://pub.dev/packages/flutter_spm_doctor) Flutter eklentilerini denetler.

## Gereksinimler

| Araç zinciri | En düşük sürüm |
| ------------ | -------------- |
| Node.js      | 22.12          |

sdkbump'ın Xcode'a ihtiyacı yoktur: dosyaları okur, bu yüzden Linux'ta da çalışır. CI testleri
Node.js 22 ve 24'te (Linux) çalıştırır; yerelde 262 testin tamamı bir Mac'te (Apple silicon)
Node.js 22.23, 24.22 ve 26.11 ile geçer. Simülatör kayıtları Xcode 27 yüklü bir Mac gerektirir ve
CI'ın parçası değildir.

## Mimari

```text
path ─► detectProject      native | flutter | react-native | expo; iOS folder; versions
     ─► collectApp         iOS app targets from project.pbxproj, their Info.plist (XML or binary),
                           Swift and Objective-C sources with comments and strings blanked
     ─► checkApp           SCN001…SCN004, fix per ecosystem and version, workaround packages
          rules/ios27.json  what each rule says, fixes, sources (validated with zod)
     ─► render             tty | markdown | json
```

- Algılama kalıpları, yorumları ve dizgeleri boşaltılmış kaynak metin üzerindeki düzenli ifadelerdir
  ve gereken yerde yalnızca bir uygulama delegesinin veya sahne delegesinin içinde sayılır.
- Kural verisi koddan ayrıdır ve sürümlüdür (`ios27@2026.10.15`); bir kuralın, çözümün veya geçici
  çözümün kaynağı yoksa bir test başarısız olur.
- CLI (`src/cli/`) yalnızca argümanları ayrıştırır, renkleri ve genişlikleri seçer ve çıkış kodunu
  belirler.

## Yol haritası

[Durum](#durum) tablosuna bakın: 0.2 bağımlılıkları ve dağıtım hedeflerini ekler, 0.3 CLI'dan
simülatörde açmayı, 0.5 sözdizimi ağaçlarını ve derlenmiş uygulama denetimlerini, 0.8 çözümleri ve
SARIF'i, 1.0 kararlı bir şemayı. [CHANGELOG.md](CHANGELOG.md) her sürümde nelerin değiştiğini listeler.

## SSS

**Uygulamam bugün iOS 27'de çalışıyor. Etkilenir mi?** Xcode 26 veya öncesiyle derlendiyse bu denetim
o derleme için geçerli değildir: bizim denememizde, iOS 26 SDK'sına bağlanan aynı kod iOS 27
simülatöründe açıldı. Xcode 27 ile yapacağınız bir sonraki derleme için geçerlidir.

**sdkbump bir cihazda test etmenin yerini tutar mı?** Hayır. Dosyaları okur. Bu depodaki simülatör
kayıtları iOS 27.0 simülatöründendir; burada hiçbir şey bir cihazda çalıştırılmadı.

**Bir bulgu neden "ele alınmış" görünüyor?** package.json'daki bir geçici çözüm paketi
(react-native-uiscene-bridge veya react-native-xcode27) çalışma zamanında bir sahne tanımlar.
Uygulama açılır, ama kendi başına hâlâ sahne desteği yoktur; rapor paketin sınırlarını ve gerçek
çözümü listeler.

**sdkbump projemi değiştirir mi?** Hayır. Projeyi okur ve yalnızca istediğiniz raporu yazar.


## Katkıda bulunma

Katkılarınızı bekliyoruz. Pull request açmadan önce [katkı rehberini](CONTRIBUTING.md) ve [davranış kurallarını](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md) okuyun. Güvenlik açıklarını [güvenlik politikasında](SECURITY.md) anlatıldığı gibi gizli olarak bildirin.

## Lisans

MIT lisansıyla yayımlanmıştır. Ayrıntılar için [LICENSE](LICENSE) dosyasına bakın.
