<!-- i18n-source: README.md@f2adb6fc5c1f0fbde9297e7b23a7bb6c4c25ca55 status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-light.svg" alt="sdkbump: Checks native iOS, Flutter and React Native apps for the iOS 27 SDK changes and names the fix for each."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/sdkbump/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/sdkbump/actions/workflows/ci.yml/badge.svg" alt="Статус CI"></a>
<a href="https://github.com/muhittincamdali/sdkbump/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-light.svg" alt="Последняя версия: v0.1.0"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-light.svg" alt="Версия языка: Node.js 22.12+"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-light.svg" alt="Лицензия: MIT"></picture></a>
</p>

<p align="center">
<a href="#быстрый-старт"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-ru-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-ru-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-ru-light.svg" alt="Начать"></picture></a>
<a href="https://muhittincamdali.github.io/sdkbump/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-ru-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-ru-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-ru-light.svg" alt="Документация"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/tree/main/docs/guides"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-ru-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-ru-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-ru-light.svg" alt="Руководства"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/tree/main/examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-ru-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-ru-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-ru-light.svg" alt="Примеры"></picture></a>
</p>

> Это перевод README на английском языке. Если они расходятся, актуальна английская версия.

<!-- brand:end -->

Прежде чем выпускать сборку, сделанную в Xcode 27: sdkbump проверяет нативный iOS-проект, проект Flutter или React Native/Expo на всё, что меняет SDK iOS 27, начиная с жизненного цикла UIScene, и подсказывает, какое исправление подходит к каждой находке. Он читает файлы вашего проекта; ничего не собирает, не запускает и не изменяет.

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-rn-087-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-rn-087-light.svg"><img src="docs/media/demo-rn-087-light.svg" alt="sdkbump на приложении React Native 0.87: не запускается, если собрано с SDK iOS 27; SCN001 нет конфигурации сцены и SCN002 окно создаётся в app delegate, с тремя способами исправления"></picture>

<sub>Записано с настоящего CLI на <a href="fixtures/rn-087">фикстуре rn-087</a> — приложении React
Native 0.87.1, созданном командой <code>@react-native-community/cli init</code> (<code>npm run demo</code>).</sub>

## Основные возможности

- **Отвечает на вопрос «запустится ли?»** Приложение, которое не объявляет ни одной сцены, собирается в Xcode 27, а затем останавливается при запуске. sdkbump сообщает об этом раньше, чем вы заметите проблему на тестовом устройстве, и называет файлы, которые нужно изменить.
- **Нативные проекты, Flutter, React Native и Expo** в одном отчёте с одинаковыми идентификаторами правил — в виде текста, Markdown или JSON, с кодом завершения для CI.
- **Исправление, которое подходит вашему проекту**: React Native 0.88 или написанный вручную scene delegate, добровольное включение в Expo SDK 57 или SDK 58, автоматическая миграция Flutter или ручные шаги (sdkbump проверяет те же условия, что и мигратор Flutter) либо API SwiftUI для приложения на SwiftUI.
- **И тихие поломки**: методы app delegate и параметры запуска, которые UIKit перестаёт использовать, когда у приложения появляется сцена (ссылки, Handoff, быстрые действия, переходы на передний план и в фон), а также поиск окна, который перестаёт находить нужное окно.
- **У каждого утверждения есть источник.** Правила — это данные ([rules/ios27.json](rules/ios27.json)), и каждое ссылается на собственные страницы Apple, Flutter, React Native или Expo; если ссылки нет, тесты падают.
- **Проверено в симуляторе iOS 27**: сбой при запуске и чёрный экран, стоящие за SCN001 и SCN002, воспроизведены в Xcode 27.0, а записи лежат в репозитории.

## Быстрый старт

Нужен [Node.js](https://nodejs.org/) 22.12 или новее (версию показывает `node --version`; на Mac его устанавливает `brew install node`). Больше ничего не требуется.

**1. Откройте терминал в папке вашего приложения** — той, где лежит `.xcodeproj`, `pubspec.yaml` или `package.json`:

```sh
cd path/to/YourApp
```

**2. Запустите sdkbump:**

```sh
npx https://github.com/muhittincamdali/sdkbump/releases/download/v0.1.0/sdkbump-0.1.0.tgz
```

sdkbump пока нет в npm (публикация там запланирована), поэтому `npx sdkbump` сейчас не работает. Команда выше запускает релиз 0.1.0 с GitHub; используйте её везде, где в этом README написано `npx sdkbump`.

**3. Прочитайте первую строку под названием вашего проекта.** «Fails to launch when built with the iOS 27 SDK» (не запускается, если собрано с SDK iOS 27) означает, что приложение будет останавливаться при запуске, пока вы не исправите находки уровня **ERROR**; в каждой сказано, какое исправление из списка «How to fix» подходит. Находки уровня **WARNING** не мешают запуску, но перестают работать, когда у приложения появляется сцена.

## Что меняется при сборке с SDK iOS 27

Из документа Apple
[Transitioning to the UIKit scene-based life cycle](https://developer.apple.com/documentation/uikit/transitioning-to-the-uikit-scene-based-life-cycle) (перевод):

> Начиная с iOS 27, iPadOS 27, Mac Catalyst 27, tvOS 27 и visionOS 27 приложения, собранные с последним SDK, должны перейти на жизненный цикл на основе сцен, иначе они не запустятся.

1. **Приложение останавливается при запуске, если не объявляет ни одной сцены.** В Info.plist нет `UIApplicationSceneManifest` с конфигурацией и нет `application(_:configurationForConnecting:options:)`: UIKit завершает процесс с сообщением «UIScene life cycle is required for apps built with this SDK». Компилятор не предупреждает, потому что проверка выполняется при запуске приложения. Так устроены приложения, созданные в React Native 0.87 и более ранних версиях, в Expo SDK 57 без добровольного включения и в Expo SDK 56 и более ранних; так же ведут себя приложения Flutter, которые инструмент Flutter не может мигрировать.
2. **Когда есть сцена, app delegate перестаёт получать события интерфейса.** Ссылки, user activities, быстрые действия и переходы между активным состоянием и фоном уходят в scene delegate, а окно, созданное app delegate, никогда не показывается.

[Почему код компилируется и всё равно падает](docs/guides/why-it-crashes.md) показывает [матрицу запусков](examples/launch-matrix/README.md), которую мы прогнали в симуляторе iOS 27.0.

## Что проверяет sdkbump

| Правило | Серьёзность | Находка                                                                                                                                                                                   | Что видно в симуляторе iOS 27.0                                        |
| ------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| SCN001  | error       | Нет конфигурации сцены: нет настроенного `UIApplicationSceneManifest`, нет `configurationForConnecting`, это не `App` из SwiftUI; для Expo без `ios/` — версия SDK и `enableSceneSupport` | останавливается при запуске                                            |
| SCN002  | error       | App delegate создаёт окно через `UIWindow(frame:)`                                                                                                                                        | чёрный экран, когда у приложения появляется сцена                      |
| SCN003  | warning     | Методы app delegate и ключи параметров запуска, которые UIKit не использует при наличии сцен (13 штук), если только scene delegate уже не обрабатывает их                                 | `applicationDidEnterBackground(_:)` не вызывается в приложении SwiftUI |
| SCN004  | warning     | Поиск окна через `UIApplication.shared.keyWindow`, `.windows` или `window` у app delegate                                                                                                 | только предупреждения компилятора об устаревании                       |

Данные правил `ios27@2026.10.15`, проверены на Xcode 27.0 (27A266a). Если в React Native или Expo установлен `react-native-uiscene-bridge` или `react-native-xcode27`, находки, которые он обрабатывает во время выполнения, показываются как обработанные — с ограничениями из его README — и не приводят к сбою запуска.

## Установка

sdkbump пока нет в npm; публикация там запланирована. До тех пор запускайте релиз 0.1.0 с GitHub, как показано выше, или добавьте его в проект:

```sh
npm install --save-dev https://github.com/muhittincamdali/sdkbump/releases/download/v0.1.0/sdkbump-0.1.0.tgz
npx sdkbump
```

Когда sdkbump появится в npm, `npx sdkbump` будет скачивать и запускать последнюю версию, а `npm install --save-dev sdkbump` — фиксировать конкретную. Формулу Homebrew для `muhittincamdali/tap` подготавливает workflow релиза (запланировано вместе с первым релизом tap).

## Использование

```text
sdkbump [path] [options]
```

| Параметр                | Что делает                                                                         |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `path`                  | Папка проекта или `.xcodeproj`; по умолчанию — текущая папка                       |
| `-f, --format <format>` | `tty` (по умолчанию), `markdown` или `json`                                        |
| `-o, --output <file>`   | Записывает отчёт в файл вместо терминала                                           |
| `--fail-on <severity>`  | `error` (по умолчанию), `warning`, `info` или `none`: когда код завершения равен 1 |
| `--no-color`            | Обычный текст даже в терминале (`NO_COLOR` и `FORCE_COLOR` учитываются)            |

Коды завершения: `0` — нет необработанных находок уровня `--fail-on` и выше, `1` — есть находки этого уровня или выше, `2` — неверные аргументы, iOS-проект не найден или произошла непредвиденная ошибка.

sdkbump сам находит iOS-приложение: `.xcodeproj` в корне или на одну папку глубже для нативных приложений, `ios/` для приложений Flutter, React Native и Expo (`example/ios/` для плагина Flutter). Он читает каждый iOS-таргет приложения в файле проекта, Info.plist, на который тот указывает (XML или бинарный), а также файлы Swift и Objective-C приложения, пропуская Pods, `node_modules`, результаты сборки и тесты. Приложения Expo без `ios/` проверяются по package.json и app.json.

### Хранить отчёт в Markdown вместе с кодом

```sh
npx sdkbump --format markdown --output sdkbump.md
```

### Использовать отчёт JSON в скриптах

```sh
npx sdkbump --format json > sdkbump.json
```

У каждой находки есть `rule`, `severity`, `file`, `line`, `message`, `fix` с шагами и руководством, `alternatives`, `mitigation` (заполняется, если находку обрабатывает пакет-обходной путь) и `sources`. Формат — `schemaVersion` 0, и до версии 1.0 он может измениться. [examples/shell/launch-blockers.sh](examples/shell/launch-blockers.sh) фильтрует его с помощью `jq`.

### Запускать в CI

[examples/github-actions/sdkbump.yml](examples/github-actions/sdkbump.yml) добавляет отчёт в сводку задания для каждого pull request, затрагивающего iOS-приложение, и завершает задание с ошибкой, если есть находки уровня error.

### Из JavaScript

```js
import { render, scan } from 'sdkbump';

const report = await scan('path/to/app');
console.log(report.verdict.text);
console.log(render(report, 'markdown'));
```

Запускаемая версия — [examples/api/verdicts.mjs](examples/api/verdicts.mjs).

## Демо

Записи терминала сделаны с CLI на [фикстурах](fixtures/README.md) — настоящих проектах, созданных каждым из тулчейнов:

| Проект                                                     | Запись                                                                                    |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Приложение React Native 0.87.1                             | в начале этой страницы                                                                    |
| Приложение Flutter с изменённым AppDelegate (Flutter 3.24) | [светлая](docs/media/demo-flutter-light.svg) · [тёмная](docs/media/demo-flutter-dark.svg) |
| Приложение SwiftUI с app delegate через адаптер            | [светлая](docs/media/demo-swiftui-light.svg) · [тёмная](docs/media/demo-swiftui-dark.svg) |

В симуляторе iOS 27.0 (iPhone 17, сборка в Xcode 27.0) нативная фикстура UIKit останавливается при запуске, а то же приложение, переведённое на scene delegate, запускается:

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-simulator-native-uikit-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-simulator-native-uikit-light.svg"><img src="docs/media/demo-simulator-native-uikit-light.svg" alt="scripts/simulator-check.sh native-uikit в симуляторе iOS 27.0: через 4 секунды после запуска приложение не работает, строка UIKit: Application failed to launch: UIScene life cycle is required for apps built with this SDK"></picture>

<p align="center"><img src="docs/media/simulator/launched.png" width="480" alt="Фикстуры native-uikit-scenes и native-swiftui работают в симуляторе iPhone 17 с iOS 27.0, сборка в Xcode 27.0"></p>

Измерено 15 октября 2026 года на Mac (Apple silicon, M5 Max) с Node.js 26.11, когда на нём шли другие задачи: три серии по 100 запусков `node dist/cli/main.js` на десяти фикстурах, включая старт Node.js. Медианы трёх серий — 0,11, 0,12 и 0,19 секунды; самый медленный запуск занял 0,33 секунды. На более загруженной машине время больше.

## Статус

| Возможность                                                                                                 | Статус            |
| ----------------------------------------------------------------------------------------------------------- | ----------------- |
| Определение нативных проектов, Flutter (приложение и пример плагина), React Native и Expo                   | работает          |
| SCN001–SCN004 по собственному Info.plist приложения и исходникам Swift/Objective-C                          | работает          |
| Выбор исправления по экосистеме и версии; проверка автоматической миграции Flutter; пакеты-обходные пути    | работает          |
| Отчёты в терминале, Markdown и JSON; коды завершения `--fail-on`                                            | работает          |
| Зависимости: Pods, `node_modules` и исходники плагинов Flutter, с названием пакета                          | планируется (0.2) |
| Уведомление об обходном пути SCN005 как отдельное правило; DPT001 для deployment targets ниже 15.0          | планируется (0.2) |
| `--verify`: сборка и запуск в симуляторе iOS 27 из CLI                                                      | планируется (0.3) |
| Синтаксические деревья Swift/Objective-C вместо шаблонов; проверки собранных `.app`; устаревшие API SiriKit | планируется (0.5) |
| `fix --dry-run` для нативных приложений, вывод SARIF, GitHub Action                                         | планируется (0.8) |
| Стабильная схема правил и формат JSON                                                                       | планируется (1.0) |

## Документация

Справочник API и руководства: [muhittincamdali.github.io/sdkbump](https://muhittincamdali.github.io/sdkbump/).

## Руководства

- [Почему код компилируется и всё равно падает](docs/guides/why-it-crashes.md)
- [Нативные приложения на UIKit и SwiftUI](docs/guides/native-ios.md)
- [Flutter: изменённый AppDelegate и плагины](docs/guides/flutter.md)
- [React Native до 0.88 и Expo до SDK 58](docs/guides/react-native-expo.md)
- [Авторам нативных модулей: ссылки и уведомления при холодном старте](docs/guides/native-module-authors.md)

## Похожие инструменты

Над тем же изменением работают и другие проекты; что подойдёт, зависит от того, что вам нужно:

- [react-native-uiscene-bridge](https://github.com/Atomics-hub/react-native-uiscene-bridge) и [react-native-xcode27](https://github.com/Atomics-hub/react-native-xcode27) позволяют приложению React Native или Expo запускаться без изменений кода — во время выполнения. Они подходят, когда обновиться пока нельзя; sdkbump их распознаёт.
- [auditor-uiscene](https://github.com/Anzell/auditor-uiscene) проверяет приложения Flutter и их плагины с помощью shell-скрипта.
- Собственный мигратор Flutter (`flutter build ios`, начиная с 3.41) мигрирует неизменённое приложение Flutter.
- [flutter_spm_doctor](https://pub.dev/packages/flutter_spm_doctor) проверяет плагины Flutter.

## Требования

| Тулчейн | Минимальная версия |
| ------- | ------------------ |
| Node.js | 22.12              |

sdkbump не требует Xcode: он читает файлы, поэтому работает и в Linux. CI запускает тесты на Node.js 22 и 24 (Linux); локально все 262 проходят на Node.js 22.23, 24.22 и 26.11 на Mac (Apple silicon). Для записей симулятора нужен Mac с Xcode 27, и они не входят в CI.

## Архитектура

```text
path ─► detectProject      native | flutter | react-native | expo; iOS folder; versions
     ─► collectApp         iOS app targets from project.pbxproj, their Info.plist (XML or binary),
                           Swift and Objective-C sources with comments and strings blanked
     ─► checkApp           SCN001…SCN004, fix per ecosystem and version, workaround packages
          rules/ios27.json  what each rule says, fixes, sources (validated with zod)
     ─► render             tty | markdown | json
```

- Шаблоны обнаружения — это регулярные выражения по исходному тексту, в котором комментарии и строки заменены пробелами, и там, где это важно, они учитываются только внутри app delegate или scene delegate.
- Данные правил отделены от кода и имеют версию (`ios27@2026.10.15`); тест падает, если у правила, исправления или обходного пути нет источника.
- CLI (`src/cli/`) только разбирает аргументы, выбирает цвета и ширину и задаёт код завершения.

## План развития

См. таблицу [Статус](#статус): в 0.2 появятся зависимости и deployment targets, в 0.3 — запуск в симуляторе из CLI, в 0.5 — синтаксические деревья и проверки собранного приложения, в 0.8 — исправления и SARIF, в 1.0 — стабильная схема. [CHANGELOG.md](CHANGELOG.md) перечисляет, что изменилось в каждом релизе.

## Частые вопросы

**Моё приложение сегодня работает на iOS 27. Затронет ли его это?** Если оно собрано в Xcode 26 или более ранней версии, проверка к этой сборке не относится: в нашем прогоне тот же код, скомпонованный с SDK iOS 26, запустился в симуляторе iOS 27. Она относится к вашей следующей сборке в Xcode 27.

**Заменяет ли sdkbump тестирование на устройстве?** Нет. Он читает файлы. Записи симулятора в этом репозитории сделаны в симуляторе iOS 27.0; ничего из представленного здесь не запускалось на устройстве.

**Почему находка помечена как «обработана»?** Пакет-обходной путь в package.json (react-native-uiscene-bridge или react-native-xcode27) объявляет сцену во время выполнения. Приложение запускается, но собственной поддержки сцен у него по-прежнему нет; отчёт перечисляет ограничения пакета и настоящее исправление.

**Изменяет ли sdkbump мой проект?** Нет. Он читает проект и записывает только тот отчёт, который вы попросили.


## Участие в разработке

Мы рады вашему участию. Перед открытием pull request прочитайте [руководство для участников](CONTRIBUTING.md) и [кодекс поведения](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md). О проблемах безопасности сообщайте конфиденциально, как описано в [политике безопасности](SECURITY.md).

## Лицензия

Распространяется по лицензии MIT. Подробнее — в файле [LICENSE](LICENSE).
