<!-- i18n-source: README.md@672d6255d691aab63cdb64c272e01df7422453df status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-light.svg" alt="sdkbump: Checks native iOS, Flutter and React Native apps for the iOS 27 SDK changes and names the fix for each."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/sdkbump/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/sdkbump/actions/workflows/ci.yml/badge.svg" alt="CI-Status"></a>
<a href="https://github.com/muhittincamdali/sdkbump/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-light.svg" alt="Aktuelle Version: v0.1.2"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-light.svg" alt="Sprachversion: Node.js 22.12+"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-light.svg" alt="Lizenz: MIT"></picture></a>
</p>

<p align="center">
<a href="#schnellstart"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-de-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-de-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-de-light.svg" alt="Loslegen"></picture></a>
<a href="https://muhittincamdali.github.io/sdkbump/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-de-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-de-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-de-light.svg" alt="Dokumentation"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/tree/main/docs/guides"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-de-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-de-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-de-light.svg" alt="Anleitungen"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/tree/main/examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-de-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-de-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-de-light.svg" alt="Beispiele"></picture></a>
</p>

> Dies ist eine Übersetzung der englischen README. Bei Abweichungen gilt die englische Fassung.

<!-- brand:end -->

Bevor du einen mit Xcode 27 gebauten Release auslieferst: sdkbump prüft ein natives iOS-, Flutter- oder React-Native/Expo-Projekt auf das, was das iOS-27-SDK ändert, allen voran den UIScene-Lebenszyklus, und sagt dir, welche Lösung zu welchem Fund passt. Es liest die Dateien deines Projekts; es baut, startet oder ändert nichts.

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-rn-087-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-rn-087-light.svg"><img src="docs/media/demo-rn-087-light.svg" alt="sdkbump auf einer React-Native-0.87-App: startet nicht, wenn sie mit dem iOS-27-SDK gebaut wird; SCN001 keine Scene-Konfiguration und SCN002 Fenster im App Delegate erzeugt, mit drei Möglichkeiten zur Behebung"></picture>

<sub>Mit der echten CLI aufgezeichnet, auf dem <a href="fixtures/rn-087">rn-087-Fixture</a>, einer React-Native-0.87.1-App aus <code>@react-native-community/cli init</code> (<code>npm run demo</code>).</sub>

## Highlights

- **Beantwortet „Startet die App?“** Eine App, die keine Scene deklariert, lässt sich mit Xcode 27 bauen und bleibt dann beim Start stehen. sdkbump sagt dir das, bevor du es auf einem Testgerät merkst, und nennt die Dateien, die du ändern musst.
- **Nativ, Flutter, React Native und Expo** in einem Bericht mit denselben Regel-IDs, als Text, Markdown oder JSON und mit einem Exit-Code für CI.
- **Die Lösung, die zu deinem Projekt passt**: React Native 0.88 oder ein selbst geschriebener Scene Delegate, das Opt-in von Expo SDK 57 oder SDK 58, die automatische Migration von Flutter oder die manuellen Schritte (sdkbump prüft dieselben Bedingungen wie der Migrator von Flutter) oder die SwiftUI-API für eine SwiftUI-App.
- **Auch stille Fehler**: App-Delegate-Methoden und Startoptionen, die UIKit nicht mehr verwendet, sobald die App eine Scene hat (Links, Handoff, Quick Actions, Wechsel in den Vorder- und Hintergrund), und Fenstersuchen, die das richtige Fenster nicht mehr finden.
- **Jede Aussage hat eine Quelle.** Die Regeln sind Daten ([rules/ios27.json](rules/ios27.json)) und jede verweist auf die Seiten von Apple, Flutter, React Native oder Expo; die Tests schlagen fehl, wenn eine Regel das nicht tut.
- **Im iOS-27-Simulator geprüft**: Der Startfehler und der schwarze Bildschirm hinter SCN001 und SCN002 wurden mit Xcode 27.0 nachgestellt; die Aufnahmen liegen im Repository.

## Schnellstart

Du brauchst [Node.js](https://nodejs.org/) 22.12 oder neuer (`node --version` zeigt die Version an; auf einem Mac installiert `brew install node` es). Mehr nicht.

**1. Öffne ein Terminal im Ordner deiner App**, also dem mit der `.xcodeproj`, der `pubspec.yaml` oder der `package.json`:

```sh
cd path/to/YourApp
```

**2. Starte sdkbump:**

```sh
npx https://github.com/muhittincamdali/sdkbump/releases/download/v0.1.2/sdkbump-0.1.2.tgz
```

sdkbump ist noch nicht auf npm (die Veröffentlichung dort ist geplant), daher funktioniert `npx sdkbump` vorerst nicht. Der Befehl oben führt das Release 0.1.2 von GitHub aus; verwende ihn überall dort, wo diese README `npx sdkbump` nennt.

**3. Lies die erste Zeile unter dem Namen deines Projekts.** „Fails to launch when built with the iOS 27 SDK“ (startet nicht, wenn mit dem iOS-27-SDK gebaut) bedeutet, dass die App beim Start stehen bleibt, bis du die **ERROR**-Funde behoben hast; jeder Fund nennt, welche Lösung aus der Liste „How to fix“ zutrifft. **WARNING**-Funde verhindern den Start nicht, funktionieren aber nicht mehr, sobald die App eine Scene hat. „Launch not determined“ (Start nicht bestimmbar) bedeutet, dass sdkbump eine Info.plist nicht lesen konnte; die Hinweise am Ende des Berichts sagen, welche und warum (siehe Grenzen weiter unten).

## Was sich ändert, wenn du mit dem iOS-27-SDK baust

Aus Apples
[Transitioning to the UIKit scene-based life cycle](https://developer.apple.com/documentation/uikit/transitioning-to-the-uikit-scene-based-life-cycle) (Übersetzung):

> Ab iOS 27, iPadOS 27, Mac Catalyst 27, tvOS 27 und visionOS 27 müssen Apps, die mit dem neuesten SDK gebaut werden, den Scene-basierten Lebenszyklus übernehmen, sonst starten sie nicht.

1. **Die App bleibt beim Start stehen, wenn sie keine Scene deklariert.** Es gibt kein `UIApplicationSceneManifest` mit einer Konfiguration in der Info.plist und kein `application(_:configurationForConnecting:options:)`: UIKit beendet den Prozess mit der Meldung „UIScene life cycle is required for apps built with this SDK“. Der Compiler warnt nicht, weil die Prüfung beim Start der App läuft. React Native 0.87 und früher, Expo SDK 57 ohne Opt-in und Expo SDK 56 und früher erzeugen solche Apps; ebenso Flutter-Apps, die das Flutter-Tool nicht migrieren kann.
2. **Mit einer Scene empfängt der App Delegate keine UI-Ereignisse mehr.** Links, User Activities, Quick Actions und die Wechsel zwischen aktiv und Hintergrund gehen an den Scene Delegate, und ein Fenster, das der App Delegate erzeugt, wird nie angezeigt.

[Warum es kompiliert und trotzdem abstürzt](docs/guides/why-it-crashes.md) zeigt die [Start-Matrix](examples/launch-matrix/README.md), die wir im iOS-27.0-Simulator ausgeführt haben.

## Was sdkbump prüft

| Regel  | Schweregrad | Fund                                                                                                                                                                                               | Im iOS-27.0-Simulator beobachtet                                               |
| ------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| SCN001 | error       | Keine Scene-Konfiguration: kein konfiguriertes `UIApplicationSceneManifest`, kein `configurationForConnecting`, keine SwiftUI-`App`; bei Expo ohne `ios/` die SDK-Version und `enableSceneSupport` | bleibt beim Start stehen                                                       |
| SCN002 | error       | Der App Delegate erzeugt das Fenster mit `UIWindow(frame:)`                                                                                                                                        | schwarzer Bildschirm, sobald die App eine Scene hat                            |
| SCN003 | warning     | App-Delegate-Methoden und Startoptions-Schlüssel, die UIKit mit Scenes nicht mehr verwendet (13 davon), es sei denn, der Scene Delegate behandelt sie bereits                                      | `applicationDidEnterBackground(_:)` wird in einer SwiftUI-App nicht aufgerufen |
| SCN004 | warning     | Fenstersuchen über `UIApplication.shared.keyWindow`, `.windows` oder das `window` des App Delegate                                                                                                 | nur Deprecation-Warnungen des Compilers                                        |

Regeldaten `ios27@2026.10.15`, geprüft gegen Xcode 27.0 (27A266a). Wenn in React Native oder Expo `react-native-uiscene-bridge` oder `react-native-xcode27` installiert ist, werden die Funde, die es zur Laufzeit behandelt, als behandelt angezeigt, mit den Einschränkungen aus dessen README, und lassen den Lauf nicht fehlschlagen.

## Installation

sdkbump ist noch nicht auf npm; die Veröffentlichung dort ist geplant. Bis dahin führst du das Release 0.1.2 von GitHub aus, wie oben gezeigt, oder fügst es einem Projekt hinzu:

```sh
npm install --save-dev https://github.com/muhittincamdali/sdkbump/releases/download/v0.1.2/sdkbump-0.1.2.tgz
npx sdkbump
```

Sobald sdkbump auf npm ist, lädt `npx sdkbump` die neueste Version herunter und führt sie aus, und `npm install --save-dev sdkbump` pinnt eine Version. Eine Homebrew-Formula für `muhittincamdali/tap` bereitet der Release-Workflow vor (geplant mit dem ersten Release des Taps).

## Verwendung

```text
sdkbump [path] [options]
```

| Option                  | Was sie tut                                                                 |
| ----------------------- | --------------------------------------------------------------------------- |
| `path`                  | Projektordner oder `.xcodeproj`; Standard ist der aktuelle Ordner           |
| `-f, --format <format>` | `tty` (Standard), `markdown` oder `json`                                    |
| `-o, --output <file>`   | Schreibt den Bericht in eine Datei statt ins Terminal                       |
| `--fail-on <severity>`  | `error` (Standard), `warning`, `info` oder `none`: wann der Exit-Code 1 ist |
| `--no-color`            | Reiner Text auch im Terminal (`NO_COLOR` und `FORCE_COLOR` werden beachtet) |

Exit-Codes: `0` kein unbehandelter Fund auf der Stufe von `--fail-on` oder darüber, `1` Funde auf dieser Stufe oder darüber, `2` ungültige Argumente, kein iOS-Projekt gefunden oder ein unerwarteter Fehler.

sdkbump findet die iOS-App selbst: eine `.xcodeproj` im Stammordner oder einen Ordner darunter bei nativen Apps, `ios/` bei Flutter-, React-Native- und Expo-Apps (`example/ios/` bei einem Flutter-Plugin). Es liest jedes iOS-App-Target in der Projektdatei, die Info.plist, die jedes davon nennt (XML oder binär), und die Swift- und Objective-C-Dateien der App; Pods, `node_modules`, Build-Ausgaben und Tests lässt es aus. Expo-Apps ohne `ios/` werden anhand von package.json und app.json geprüft.

### Einen Markdown-Bericht beim Code aufbewahren

```sh
npx sdkbump --format markdown --output sdkbump.md
```

### Den JSON-Bericht in Skripten verwenden

```sh
npx sdkbump --format json > sdkbump.json
```

Jeder Fund hat `rule`, `severity`, `file`, `line`, `message`, den `fix` mit seinen Schritten und seiner Anleitung, `alternatives`, `mitigation` (gesetzt, wenn ein Workaround-Paket den Fund behandelt) und `sources`. Das Layout ist `schemaVersion` 0 und kann sich vor 1.0 ändern. [examples/shell/launch-blockers.sh](examples/shell/launch-blockers.sh) filtert ihn mit `jq`.

### In CI ausführen

[examples/github-actions/sdkbump.yml](examples/github-actions/sdkbump.yml) fügt den Bericht der Job-Zusammenfassung jedes Pull Requests hinzu, der die iOS-App berührt, und lässt den Job bei Fehlern fehlschlagen.

### Aus JavaScript

```js
import { render, scan } from 'sdkbump';

const report = await scan('path/to/app');
console.log(report.verdict.text);
console.log(render(report, 'markdown'));
```

Eine lauffähige Version ist [examples/api/verdicts.mjs](examples/api/verdicts.mjs).

## Demo

Die Terminal-Aufnahmen stammen von der CLI auf den [Fixtures](fixtures/README.md), echten Projekten, die mit der jeweiligen Toolchain erstellt wurden:

| Projekt                                                | Aufnahme                                                                               |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| React-Native-0.87.1-App                                | oben auf dieser Seite                                                                  |
| Flutter-App mit angepasstem AppDelegate (Flutter 3.24) | [hell](docs/media/demo-flutter-light.svg) · [dunkel](docs/media/demo-flutter-dark.svg) |
| SwiftUI-App mit einem Adaptor-App-Delegate             | [hell](docs/media/demo-swiftui-light.svg) · [dunkel](docs/media/demo-swiftui-dark.svg) |

Im iOS-27.0-Simulator (iPhone 17, mit Xcode 27.0 gebaut) bleibt das native UIKit-Fixture beim Start stehen, und dieselbe App, auf einen Scene Delegate umgestellt, startet:

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-simulator-native-uikit-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-simulator-native-uikit-light.svg"><img src="docs/media/demo-simulator-native-uikit-light.svg" alt="scripts/simulator-check.sh native-uikit im iOS-27.0-Simulator: 4 Sekunden nach dem Start läuft die App nicht, mit der Zeile von UIKit: Application failed to launch: UIScene life cycle is required for apps built with this SDK"></picture>

<p align="center"><img src="docs/media/simulator/launched.png" width="480" alt="Die Fixtures native-uikit-scenes und native-swiftui laufen in einem iPhone-17-Simulator mit iOS 27.0, gebaut mit Xcode 27.0"></p>

Gemessen am 15. Oktober 2026 auf einem Mac (Apple Silicon, M5 Max) mit Node.js 26.11, während andere Jobs darauf liefen: drei Serien mit je 100 Läufen von `node dist/cli/main.js` auf den zehn Fixtures, Node.js-Start eingerechnet. Die Mediane der drei Serien lagen bei 0,11, 0,12 und 0,19 Sekunden; der langsamste Lauf dauerte 0,33 Sekunden. Auf einem stärker ausgelasteten Rechner dauert es länger.

## Status

| Funktion                                                                                              | Status        |
| ----------------------------------------------------------------------------------------------------- | ------------- |
| Erkennung von nativen, Flutter- (App und Plugin-Beispiel), React-Native- und Expo-Projekten           | funktioniert  |
| SCN001 bis SCN004 auf der Info.plist und den Swift-/Objective-C-Quellen der App selbst                | funktioniert  |
| Auswahl der Lösung nach Ökosystem und Version; Prüfung der Flutter-Automigration; Workaround-Pakete   | funktioniert  |
| Berichte für Terminal, Markdown und JSON; Exit-Codes von `--fail-on`                                  | funktioniert  |
| Abhängigkeiten: Pods, `node_modules` und Flutter-Plugin-Quellen, mit Nennung des Pakets               | geplant (0.2) |
| SCN005-Workaround-Hinweis als eigene Regel; DPT001 für Deployment Targets unter 15.0                  | geplant (0.2) |
| `--verify`: Bauen und Starten im iOS-27-Simulator über die CLI                                        | geplant (0.3) |
| Swift-/Objective-C-Syntaxbäume statt Mustern; Prüfungen gebauter `.app`-Dateien; SiriKit-Deprecations | geplant (0.5) |
| `fix --dry-run` für native Apps, SARIF-Ausgabe, GitHub Action                                         | geplant (0.8) |
| Stabiles Regelschema und JSON-Layout                                                                  | geplant (1.0) |

## Grenzen

- **Muster, kein Compiler.** Die Regeln sind reguläre Ausdrücke über Swift- und Objective-C-Text, in dem Kommentare und Strings ausgeblendet sind. Generierter Code, Code hinter Makros oder ungewöhnlich geschriebener Code kann übersehen oder fälschlich erkannt werden. Syntaxbäume sind geplant (0.5).
- **Nur die eigenen Quellen der App.** Pods, `node_modules`, Flutter-Plugins und andere Abhängigkeiten werden nicht gelesen; ein Plugin, das sich auf App-Delegate-Methoden verlässt, die UIKit nicht mehr aufruft, wird also nicht gemeldet. Prüfungen der Abhängigkeiten sind geplant (0.2).
- **Build-Einstellungen nur aus project.pbxproj.** sdkbump liest `INFOPLIST_FILE` und `GENERATE_INFOPLIST_FILE` aus der Projektdatei und setzt `$(SRCROOT)`, `$(PROJECT_DIR)`, `$(TARGET_NAME)` und `$(PRODUCT_NAME)` ein. Es liest keine `.xcconfig`-Dateien, setzt keine anderen Build-Einstellungen ein und liest keine Info.plist außerhalb des Projektordners. Kann es die Info.plist eines Targets nicht lesen, ist SCN001 ein Info-Fund und das Ergebnis lautet „Launch not determined“, statt zu raten.
- **Keine Datei zum Unterdrücken.** Ein Fund lässt sich nicht als geprüft markieren; `--fail-on` legt fest, welche Schweregrade den Lauf fehlschlagen lassen.
- **Nur Dateien.** sdkbump baut und startet die App nicht; `--verify` ist geplant (0.3).

## Dokumentation

API-Referenz und Anleitungen: [muhittincamdali.github.io/sdkbump](https://muhittincamdali.github.io/sdkbump/).

## Anleitungen

- [Warum es kompiliert und trotzdem abstürzt](docs/guides/why-it-crashes.md)
- [Native UIKit- und SwiftUI-Apps](docs/guides/native-ios.md)
- [Flutter: ein angepasster AppDelegate und Plugins](docs/guides/flutter.md)
- [React Native vor 0.88 und Expo vor SDK 58](docs/guides/react-native-expo.md)
- [Autoren nativer Module: Links und Benachrichtigungen beim Kaltstart](docs/guides/native-module-authors.md)

## Verwandte Tools

Andere Projekte arbeiten an derselben Änderung; welches passt, hängt davon ab, was du brauchst:

- [react-native-uiscene-bridge](https://github.com/Atomics-hub/react-native-uiscene-bridge) und [react-native-xcode27](https://github.com/Atomics-hub/react-native-xcode27) lassen eine React-Native- oder Expo-App zur Laufzeit ohne Codeänderungen starten. Sie passen, wenn du noch nicht aktualisieren kannst; sdkbump erkennt sie.
- [auditor-uiscene](https://github.com/Anzell/auditor-uiscene) prüft Flutter-Apps und ihre Plugins mit einem Shell-Skript.
- Der Migrator von Flutter selbst (`flutter build ios` ab 3.41) migriert eine unveränderte Flutter-App.
- [flutter_spm_doctor](https://pub.dev/packages/flutter_spm_doctor) prüft Flutter-Plugins.

## Voraussetzungen

| Toolchain | Mindestversion |
| --------- | -------------- |
| Node.js   | 22.12          |

sdkbump braucht kein Xcode: Es liest Dateien und läuft deshalb auch unter Linux. CI führt die Tests mit Node.js 22 und 24 (Linux) aus; lokal bestehen alle 269 mit Node.js 22.23, 24.22 und 26.11 auf einem Mac (Apple Silicon). Die Simulator-Aufnahmen brauchen einen Mac mit Xcode 27 und sind nicht Teil von CI.

## Architektur

```text
path ─► detectProject      native | flutter | react-native | expo; iOS folder; versions
     ─► collectApp         iOS app targets from project.pbxproj, their Info.plist (XML or binary),
                           Swift and Objective-C sources with comments and strings blanked
     ─► checkApp           SCN001…SCN004, fix per ecosystem and version, workaround packages
          rules/ios27.json  what each rule says, fixes, sources (validated with zod)
     ─► render             tty | markdown | json
```

- Die Erkennungsmuster sind reguläre Ausdrücke über Quelltext, dessen Kommentare und Strings geleert wurden, und zählen, wo es darauf ankommt, nur innerhalb eines App Delegate oder Scene Delegate.
- Die Regeldaten sind vom Code getrennt und versioniert (`ios27@2026.10.15`); ein Test schlägt fehl, wenn eine Regel, eine Lösung oder ein Workaround keine Quelle hat.
- Die CLI (`src/cli/`) parst nur Argumente, wählt Farben und Breiten und setzt den Exit-Code.

## Roadmap

Siehe die Tabelle [Status](#status): 0.2 ergänzt Abhängigkeiten und Deployment Targets, 0.3 das Starten im Simulator über die CLI, 0.5 Syntaxbäume und Prüfungen gebauter Apps, 0.8 Korrekturen und SARIF, 1.0 ein stabiles Schema. [CHANGELOG.md](CHANGELOG.md) listet auf, was sich mit jedem Release geändert hat.

## FAQ

**Meine App läuft heute unter iOS 27. Ist sie betroffen?** Wenn sie mit Xcode 26 oder früher gebaut wurde, gilt die Prüfung für diesen Build nicht: In unserem Lauf startete derselbe Code, gelinkt gegen das iOS-26-SDK, im iOS-27-Simulator. Sie gilt für deinen nächsten Build mit Xcode 27.

**Ersetzt sdkbump Tests auf einem Gerät?** Nein. Es liest Dateien. Die Simulator-Aufnahmen in diesem Repository stammen aus dem iOS-27.0-Simulator; nichts davon wurde auf einem Gerät ausgeführt.

**Warum gilt ein Fund als „behandelt“?** Ein Workaround-Paket in der package.json (react-native-uiscene-bridge oder react-native-xcode27) deklariert zur Laufzeit eine Scene. Die App startet, hat aber weiterhin keine eigene Scene-Unterstützung; der Bericht listet die Einschränkungen des Pakets und die eigentliche Lösung auf.

**Ändert sdkbump mein Projekt?** Nein. Es liest es und schreibt nur den Bericht, den du anforderst.


## Mitwirken

Beiträge sind willkommen. Lies vor einem Pull Request den [Leitfaden für Beiträge](CONTRIBUTING.md) und den [Verhaltenskodex](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md). Sicherheitsprobleme meldest du vertraulich, wie in der [Sicherheitsrichtlinie](SECURITY.md) beschrieben.

## Lizenz

Veröffentlicht unter der MIT-Lizenz. Siehe [LICENSE](LICENSE).
