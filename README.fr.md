<!-- i18n-source: README.md@05d216af458d5c03f128e8dd8f9edb3064738a0d status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-light.svg" alt="sdkbump: Checks native iOS, Flutter and React Native apps for the iOS 27 SDK changes and names the fix for each."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/sdkbump/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/sdkbump/actions/workflows/ci.yml/badge.svg" alt="État de la CI"></a>
<a href="https://github.com/muhittincamdali/sdkbump/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-light.svg" alt="Dernière version: v0.1.4"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-light.svg" alt="Version du langage: Node.js 22.12+"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-light.svg" alt="Licence: MIT"></picture></a>
</p>

<p align="center">
<a href="#démarrage-rapide"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-fr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-fr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-fr-light.svg" alt="Commencer"></picture></a>
<a href="https://muhittincamdali.github.io/sdkbump/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-fr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-fr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-fr-light.svg" alt="Documentation"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/tree/main/docs/guides"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-fr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-fr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-fr-light.svg" alt="Guides"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/tree/main/examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-fr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-fr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-fr-light.svg" alt="Exemples"></picture></a>
</p>

> Ceci est une traduction du README anglais. En cas de différence, la version anglaise fait foi.

<!-- brand:end -->

Avant de livrer une version compilée avec Xcode 27 : sdkbump analyse un projet iOS natif, Flutter ou React Native/Expo pour repérer ce que change le SDK iOS 27, à commencer par le cycle de vie UIScene, et vous indique quelle correction s'applique à chaque constat. Il lit les fichiers de votre projet ; il ne compile, n'exécute ni ne modifie rien.

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-rn-087-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-rn-087-light.svg"><img src="docs/media/demo-rn-087-light.svg" alt="sdkbump exécuté sur une app React Native 0.87 : ne se lance pas lorsqu'elle est compilée avec le SDK iOS 27 ; SCN001 aucune configuration de scène et SCN002 fenêtre créée dans l'app delegate, avec deux façons de corriger"></picture>

<sub>Enregistré avec la vraie CLI sur le <a href="fixtures/rn-087">fixture rn-087</a>, une app React
Native 0.87.1 créée avec <code>@react-native-community/cli init</code> (<code>npm run demo</code>).</sub>

## Points forts

- **Répond à « va-t-elle se lancer ? »** Une app qui ne déclare aucune scène se compile avec Xcode 27, puis s'arrête au lancement. sdkbump vous le dit avant que vous ne le découvriez sur un appareil de test, et nomme les fichiers à modifier.
- **Natif, Flutter, React Native et Expo** dans un seul rapport, avec les mêmes identifiants de règle, en texte, Markdown ou JSON, et avec un code de sortie pour la CI.
- **La correction qui s'applique à votre projet** : React Native 0.88 ou un scene delegate écrit à la main, l'activation optionnelle d'Expo SDK 57 ou SDK 58, la migration automatique de Flutter ou les étapes manuelles (sdkbump vérifie les mêmes conditions que le migrateur de Flutter), ou l'API SwiftUI pour une app SwiftUI.
- **Les ruptures silencieuses aussi** : les méthodes de l'app delegate et les options de lancement qu'UIKit cesse d'utiliser dès que l'app a une scène (liens, Handoff, actions rapides, passages au premier plan et en arrière-plan), et les recherches de fenêtre qui ne trouvent plus la bonne fenêtre.
- **Chaque affirmation a une source.** Les règles sont des données ([rules/ios27.json](rules/ios27.json)) et chacune cite les pages d'Apple, de Flutter, de React Native ou d'Expo ; les tests échouent si l'une d'elles n'en cite aucune.
- **Vérifié dans le simulateur iOS 27** : l'échec au lancement et l'écran noir derrière SCN001 et SCN002 ont été reproduits avec Xcode 27.0, et les enregistrements sont dans le dépôt.

## Démarrage rapide

Il vous faut [Node.js](https://nodejs.org/) 22.12 ou ultérieur (`node --version` affiche la version ; sur un Mac, `brew install node` l'installe). Rien d'autre.

**1. Ouvrez un terminal dans le dossier de votre app**, celui qui contient le `.xcodeproj`, le `pubspec.yaml` ou le `package.json` :

```sh
cd path/to/YourApp
```

**2. Lancez sdkbump :**

```sh
npx @mcamdali/sdkbump
```

Le paquet npm s'appelle `@mcamdali/sdkbump` ; la commande qu'il installe s'appelle `sdkbump`. Un `npx sdkbump` sans scope ne l'exécute pas.

**3. Lisez la première ligne sous le nom de votre projet.** « Fails to launch when built with the iOS 27 SDK » (ne se lance pas lorsqu'elle est compilée avec le SDK iOS 27) signifie que l'app s'arrête au lancement tant que vous n'avez pas corrigé les constats **ERROR** ; chacun indique quelle correction de la liste « How to fix » s'applique. Les constats **WARNING** n'empêchent pas le lancement, mais cessent de fonctionner dès que l'app a une scène. « Launch not determined » (lancement non déterminé) signifie que sdkbump n'a pas pu lire un Info.plist ; les notes à la fin du rapport indiquent lequel et pourquoi (voir Limites plus bas).

## Ce qui change quand vous compilez avec le SDK iOS 27

Extrait de la page d'Apple
[Transitioning to the UIKit scene-based life cycle](https://developer.apple.com/documentation/uikit/transitioning-to-the-uikit-scene-based-life-cycle) (traduction) :

> À partir d'iOS 27, d'iPadOS 27, de Mac Catalyst 27, de tvOS 27 et de visionOS 27, les apps compilées avec le dernier SDK doivent adopter le cycle de vie basé sur les scènes, sinon elles ne se lancent pas.

1. **L'app s'arrête au lancement si elle ne déclare aucune scène.** Pas de `UIApplicationSceneManifest` avec une configuration dans l'Info.plist et pas de `application(_:configurationForConnecting:options:)` : UIKit met fin au processus avec le message « UIScene life cycle is required for apps built with this SDK ». Le compilateur n'avertit pas, car la vérification a lieu au démarrage de l'app. React Native 0.87 et antérieur, Expo SDK 57 sans son activation optionnelle et Expo SDK 56 et antérieur créent des apps de ce type ; c'est aussi le cas des apps Flutter que l'outil Flutter ne peut pas migrer.
2. **Avec une scène, l'app delegate ne reçoit plus les événements d'interface.** Les liens, les user activities, les actions rapides et les transitions actif/arrière-plan vont au scene delegate, et une fenêtre créée par l'app delegate n'est jamais affichée.

[Pourquoi ça compile et plante quand même](docs/guides/why-it-crashes.md) présente la [matrice de lancement](examples/launch-matrix/README.md) que nous avons exécutée dans le simulateur iOS 27.0.

## Ce que sdkbump vérifie

| Règle  | Gravité | Constat                                                                                                                                                                                                      | Observé dans le simulateur iOS 27.0                                        |
| ------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| SCN001 | error   | Aucune configuration de scène : pas de `UIApplicationSceneManifest` configuré, pas de `configurationForConnecting`, pas une `App` SwiftUI ; pour Expo sans `ios/`, la version du SDK et `enableSceneSupport` | s'arrête au lancement                                                      |
| SCN002 | error   | L'app delegate crée la fenêtre avec `UIWindow(frame:)`                                                                                                                                                       | écran noir dès que l'app a une scène                                       |
| SCN003 | warning | Méthodes de l'app delegate et clés d'options de lancement qu'UIKit n'utilise plus avec les scènes (13 au total), sauf si le scene delegate les gère déjà                                                     | `applicationDidEnterBackground(_:)` n'est pas appelée dans une app SwiftUI |
| SCN004 | warning | Recherches de fenêtre via `UIApplication.shared.keyWindow`, `.windows` ou le `window` de l'app delegate                                                                                                      | uniquement des avertissements de dépréciation du compilateur               |

Données de règles `ios27@2026.10.27`, vérifiées avec Xcode 27.0 (27A266a). Lorsque React Native ou Expo a `react-native-uiscene-bridge` ou `react-native-xcode27` installé, les constats qu'il gère à l'exécution sont affichés comme gérés, avec les limites indiquées dans son README, et ne font pas échouer l'exécution.

## Installation

Installez la commande `sdkbump` depuis npm (paquet `@mcamdali/sdkbump`) :

```sh
npm i -g @mcamdali/sdkbump
sdkbump
```

Dans un projet, `npm install --save-dev @mcamdali/sdkbump` épingle une version, puis `npx sdkbump` exécute cette copie. Chaque [version GitHub](https://github.com/muhittincamdali/sdkbump/releases) contient aussi le même paquet sous le nom `sdkbump-<version>.tgz`, avec un fichier `SHA256SUMS` ; `npx` l'exécute depuis son URL sans passer par npm. Avec Homebrew : `brew install muhittincamdali/tap/sdkbump`.

## Utilisation

```text
sdkbump [path] [options]
```

| Option                  | Ce qu'elle fait                                                                    |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `path`                  | Dossier du projet ou `.xcodeproj` ; par défaut, le dossier courant                 |
| `-f, --format <format>` | `tty` (par défaut), `markdown` ou `json`                                           |
| `-o, --output <file>`   | Écrit le rapport dans un fichier au lieu du terminal                               |
| `--fail-on <severity>`  | `error` (par défaut), `warning`, `info` ou `none` : quand le code de sortie vaut 1 |
| `--no-color`            | Texte brut même dans un terminal (`NO_COLOR` et `FORCE_COLOR` sont respectés)      |

Codes de sortie : `0` aucun constat non géré au niveau de `--fail-on` ou au-dessus, `1` constats à ce niveau ou au-dessus, `2` arguments invalides, aucun projet iOS trouvé ou erreur inattendue.

sdkbump trouve seul l'app iOS : un `.xcodeproj` à la racine ou un dossier plus bas pour les apps natives, `ios/` pour les apps Flutter, React Native et Expo (`example/ios/` pour un plugin Flutter). Il lit chaque target d'app iOS du fichier de projet, l'Info.plist que chacune désigne (XML ou binaire) et les fichiers Swift et Objective-C de l'app, en ignorant Pods, `node_modules`, la sortie de compilation et les tests. Les apps Expo sans `ios/` sont vérifiées à partir de package.json et app.json.

### Conserver un rapport Markdown avec le code

```sh
npx @mcamdali/sdkbump --format markdown --output sdkbump.md
```

### Utiliser le rapport JSON dans des scripts

```sh
npx @mcamdali/sdkbump --format json > sdkbump.json
```

Chaque constat a `rule`, `severity`, `file`, `line`, `message`, le `fix` avec ses étapes et son guide, `alternatives`, `mitigation` (renseigné lorsqu'un paquet de contournement le gère) et `sources`. La structure est `schemaVersion` 0 et peut changer avant la 1.0. [examples/shell/launch-blockers.sh](examples/shell/launch-blockers.sh) le filtre avec `jq`.

### L'exécuter en CI

[examples/github-actions/sdkbump.yml](examples/github-actions/sdkbump.yml) ajoute le rapport au résumé du job de chaque pull request qui touche à l'app iOS et fait échouer le job en cas d'erreurs.

### Depuis JavaScript

```js
import { render, scan } from 'sdkbump';

const report = await scan('path/to/app');
console.log(report.verdict.text);
console.log(render(report, 'markdown'));
```

Une version exécutable se trouve dans [examples/api/verdicts.mjs](examples/api/verdicts.mjs).

## Démo

Les enregistrements du terminal proviennent de la CLI exécutée sur les [fixtures](fixtures/README.md), de vrais projets créés avec chaque toolchain :

| Projet                                                      | Enregistrement                                                                          |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| App React Native 0.87.1                                     | en haut de cette page                                                                   |
| App Flutter avec un AppDelegate personnalisé (Flutter 3.24) | [clair](docs/media/demo-flutter-light.svg) · [sombre](docs/media/demo-flutter-dark.svg) |
| App SwiftUI avec un app delegate par adaptateur             | [clair](docs/media/demo-swiftui-light.svg) · [sombre](docs/media/demo-swiftui-dark.svg) |

Dans le simulateur iOS 27.0 (iPhone 17, compilé avec Xcode 27.0), le fixture UIKit natif s'arrête au lancement, et la même app migrée vers un scene delegate se lance :

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-simulator-native-uikit-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-simulator-native-uikit-light.svg"><img src="docs/media/demo-simulator-native-uikit-light.svg" alt="scripts/simulator-check.sh native-uikit dans le simulateur iOS 27.0 : ne s'exécute pas 4 secondes après le lancement, avec la ligne d'UIKit : Application failed to launch: UIScene life cycle is required for apps built with this SDK"></picture>

<p align="center"><img src="docs/media/simulator/launched.png" width="480" alt="Les fixtures native-uikit-scenes et native-swiftui s'exécutant dans un simulateur iPhone 17 sous iOS 27.0, compilés avec Xcode 27.0"></p>

Mesuré le 15 octobre 2026 sur un Mac (Apple silicon, M5 Max) avec Node.js 26.11 pendant que d'autres tâches tournaient dessus : trois séries de 100 exécutions de `node dist/cli/main.js` sur les dix fixtures, démarrage de Node.js compris. Les médianes des trois séries étaient de 0,11, 0,12 et 0,19 seconde ; l'exécution la plus lente a pris 0,33 seconde. Sur une machine plus chargée, les temps sont plus longs.

## Statut

| Fonctionnalité                                                                                                                        | Statut      |
| ------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Détection des projets natifs, Flutter (app et exemple de plugin), React Native et Expo                                                | fonctionne  |
| SCN001 à SCN004 sur l'Info.plist et les sources Swift/Objective-C de l'app elle-même                                                  | fonctionne  |
| Choix de la correction par écosystème et par version ; vérification de la migration automatique de Flutter ; paquets de contournement | fonctionne  |
| Rapports terminal, Markdown et JSON ; codes de sortie de `--fail-on`                                                                  | fonctionne  |
| Dépendances : Pods, `node_modules` et sources des plugins Flutter, avec le nom du paquet                                              | prévu (0.2) |
| Avis de contournement SCN005 comme règle à part entière ; DPT001 pour les deployment targets inférieurs à 15.0                        | prévu (0.2) |
| `--verify` : compiler et lancer dans le simulateur iOS 27 depuis la CLI                                                               | prévu (0.3) |
| Arbres syntaxiques Swift/Objective-C au lieu de motifs ; vérifications des `.app` compilées ; dépréciations de SiriKit                | prévu (0.5) |
| `fix --dry-run` pour les apps natives, sortie SARIF, GitHub Action                                                                    | prévu (0.8) |
| Schéma de règles et structure JSON stables                                                                                            | prévu (1.0) |

## Limites

- **Des motifs, pas un compilateur.** Les règles sont des expressions régulières appliquées au texte Swift et Objective-C dont les commentaires et les chaînes sont effacés. Du code généré, caché derrière des macros ou écrit d'une façon inhabituelle peut être manqué ou détecté à tort. Les arbres syntaxiques sont prévus (0.5).
- **Uniquement les sources de l'app.** Les Pods, `node_modules`, les plugins Flutter et les autres dépendances ne sont pas lus : un plugin qui s'appuie sur des méthodes de l'app delegate qu'UIKit n'appelle plus n'est donc pas signalé. L'analyse des dépendances est prévue (0.2).
- **Réglages de build lus uniquement dans project.pbxproj.** sdkbump lit `INFOPLIST_FILE` et `GENERATE_INFOPLIST_FILE` dans le fichier de projet et remplace `$(SRCROOT)`, `$(PROJECT_DIR)`, `$(TARGET_NAME)` et `$(PRODUCT_NAME)`. Il ne lit pas les fichiers `.xcconfig`, ne remplace pas les autres réglages de build et ne lit pas un Info.plist situé hors du dossier du projet. Quand il ne peut pas lire l'Info.plist d'une cible, SCN001 est un constat de niveau info et le verdict est « Launch not determined » au lieu d'une supposition.
- **Pas de fichier de suppression.** Un constat ne peut pas être marqué comme examiné ; `--fail-on` décide quelles sévérités font échouer l'exécution.
- **Des fichiers seulement.** sdkbump ne compile pas et ne lance pas l'app ; `--verify` est prévu (0.3).

## Documentation

Référence de l'API et guides : [muhittincamdali.github.io/sdkbump](https://muhittincamdali.github.io/sdkbump/).

## Guides

- [Pourquoi ça compile et plante quand même](docs/guides/why-it-crashes.md)
- [Apps natives UIKit et SwiftUI](docs/guides/native-ios.md)
- [Flutter : un AppDelegate personnalisé et des plugins](docs/guides/flutter.md)
- [React Native avant 0.88 et Expo avant SDK 58](docs/guides/react-native-expo.md)
- [Auteurs de modules natifs : liens et notifications au démarrage à froid](docs/guides/native-module-authors.md)

## Outils apparentés

[glassready](https://github.com/muhittincamdali/glassready) répond à l'autre question du SDK iOS
27 : à quoi ressemblera l'app ? Le SDK iOS 27 ignore l'option de retrait
`UIDesignRequiresCompatibility`, donc l'app passe à Liquid Glass ; glassready liste ce que cela
change dans une app iOS native, Flutter ou React Native/Expo et comment corriger chaque endroit.
sdkbump répond à la question du lancement de l'app. Lancez les deux avant le premier build avec
Xcode 27.

D'autres projets travaillent sur le même changement ; le bon choix dépend de ce dont vous avez besoin :

- [react-native-uiscene-bridge](https://github.com/Atomics-hub/react-native-uiscene-bridge) et [react-native-xcode27](https://github.com/Atomics-hub/react-native-xcode27) permettent à une app React Native ou Expo de se lancer sans modification du code, à l'exécution. Ils ont été publiés avant que React Native 0.88 et Expo SDK 58 n'ajoutent la prise en charge des scènes ; sdkbump ne les suggère plus, mais les reconnaît quand ils sont installés.
- [auditor-uiscene](https://github.com/Anzell/auditor-uiscene) audite les apps Flutter et leurs plugins avec un script shell.
- Le migrateur propre à Flutter (`flutter build ios` à partir de la 3.41) migre une app Flutter non modifiée.
- [flutter_spm_doctor](https://pub.dev/packages/flutter_spm_doctor) vérifie les plugins Flutter.

## Prérequis

| Toolchain | Version minimale |
| --------- | ---------------- |
| Node.js   | 22.12            |

sdkbump n'a pas besoin de Xcode : il lit des fichiers, il fonctionne donc aussi sous Linux. La CI exécute les tests sur Node.js 22 et 24 (Linux) ; en local, les 280 réussissent sur Node.js 22.23, 24.22 et 26.11 sur un Mac (Apple silicon). Les enregistrements du simulateur nécessitent un Mac avec Xcode 27 et ne font pas partie de la CI.

## Architecture

```text
path ─► detectProject      native | flutter | react-native | expo; iOS folder; versions
     ─► collectApp         iOS app targets from project.pbxproj, their Info.plist (XML or binary),
                           Swift and Objective-C sources with comments and strings blanked
     ─► checkApp           SCN001…SCN004, fix per ecosystem and version, workaround packages
          rules/ios27.json  what each rule says, fixes, sources (validated with zod)
     ─► render             tty | markdown | json
```

- Les motifs de détection sont des expressions régulières appliquées à du texte source dont les commentaires et les chaînes sont vidés, et, quand cela compte, ils ne comptent qu'à l'intérieur d'un app delegate ou d'un scene delegate.
- Les données de règles sont séparées du code et versionnées (`ios27@2026.10.27`) ; un test échoue lorsqu'une règle, une correction ou un contournement n'a pas de source.
- La CLI (`src/cli/`) se contente d'analyser les arguments, de choisir les couleurs et les largeurs, et de définir le code de sortie.

## Feuille de route

Voir le tableau [Statut](#statut) : la 0.2 ajoute les dépendances et les deployment targets, la 0.3 le lancement dans le simulateur depuis la CLI, la 0.5 les arbres syntaxiques et les vérifications de l'app compilée, la 0.8 les corrections et SARIF, la 1.0 un schéma stable. [CHANGELOG.md](CHANGELOG.md) liste ce que chaque version a changé.

## FAQ

**Mon app fonctionne aujourd'hui sous iOS 27. Est-elle concernée ?** Si elle a été compilée avec Xcode 26 ou antérieur, la vérification ne s'applique pas à cette compilation : lors de notre essai, le même code lié au SDK iOS 26 s'est lancé dans le simulateur iOS 27. Elle s'applique à votre prochaine compilation avec Xcode 27.

**sdkbump remplace-t-il les tests sur un appareil ?** Non. Il lit des fichiers. Les enregistrements du simulateur dans ce dépôt viennent du simulateur iOS 27.0 ; rien ici n'a été exécuté sur un appareil.

**Pourquoi un constat est-il « géré » ?** Un paquet de contournement dans package.json (react-native-uiscene-bridge ou react-native-xcode27) déclare une scène à l'exécution. L'app se lance, mais elle n'a toujours pas de prise en charge des scènes qui lui soit propre ; le rapport liste les limites du paquet et la vraie correction.

**sdkbump modifie-t-il mon projet ?** Non. Il le lit et n'écrit que le rapport que vous demandez.


## Contribuer

Les contributions sont les bienvenues. Lisez le [guide de contribution](CONTRIBUTING.md) et le [code de conduite](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md) avant d’ouvrir une pull request. Signalez les problèmes de sécurité en privé, comme indiqué dans la [politique de sécurité](SECURITY.md).

## Licence

Publié sous licence MIT. Voir [LICENSE](LICENSE).
