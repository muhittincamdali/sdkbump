<!-- i18n-source: README.md@672d6255d691aab63cdb64c272e01df7422453df status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-light.svg" alt="sdkbump: Checks native iOS, Flutter and React Native apps for the iOS 27 SDK changes and names the fix for each."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/sdkbump/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/sdkbump/actions/workflows/ci.yml/badge.svg" alt="CI 상태"></a>
<a href="https://github.com/muhittincamdali/sdkbump/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-light.svg" alt="최신 버전: v0.1.2"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-light.svg" alt="언어 버전: Node.js 22.12+"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-light.svg" alt="라이선스: MIT"></picture></a>
</p>

<p align="center">
<a href="#빠른-시작"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-ko-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-ko-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-ko-light.svg" alt="시작하기"></picture></a>
<a href="https://muhittincamdali.github.io/sdkbump/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-ko-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-ko-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-ko-light.svg" alt="문서"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/tree/main/docs/guides"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-ko-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-ko-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-ko-light.svg" alt="가이드"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/tree/main/examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-ko-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-ko-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-ko-light.svg" alt="예제"></picture></a>
</p>

> 이 문서는 영어 README의 번역본입니다. 내용이 다를 경우 영어 버전이 최신입니다.

<!-- brand:end -->

Xcode 27로 빌드한 앱을 출시하기 전에: sdkbump는 네이티브 iOS, Flutter, React Native/Expo 프로젝트에서 iOS 27 SDK가 바꾸는 부분(우선 UIScene 생명 주기)을 검사하고, 각 항목에 어떤 해결 방법이 맞는지 알려 줍니다. 프로젝트 파일을 읽기만 하며, 빌드하거나 실행하거나 변경하지 않습니다.

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-rn-087-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-rn-087-light.svg"><img src="docs/media/demo-rn-087-light.svg" alt="React Native 0.87 앱에서 실행한 sdkbump: iOS 27 SDK로 빌드하면 실행되지 않음. SCN001은 scene 구성 없음, SCN002는 app delegate에서 window 생성이며, 해결 방법은 세 가지"></picture>

<sub>실제 CLI에서 녹화했습니다. 대상은 <a href="fixtures/rn-087">rn-087 fixture</a>, 즉 <code>@react-native-community/cli init</code>으로 만든 React Native 0.87.1 앱입니다(<code>npm run demo</code>).</sub>

## 주요 기능

- **"실행될까?"에 답합니다.** scene을 선언하지 않은 앱은 Xcode 27로 빌드되지만 실행할 때 멈춥니다. sdkbump는 테스트 기기에서 직접 겪기 전에 이를 알려 주고, 바꿔야 할 파일을 알려 줍니다.
- **네이티브, Flutter, React Native, Expo**를 같은 규칙 ID로 하나의 보고서에 담습니다. 출력은 텍스트, Markdown, JSON 중에서 고를 수 있고, CI용 종료 코드도 제공합니다.
- **내 프로젝트에 맞는 해결 방법**: React Native 0.88 또는 직접 작성한 scene delegate, Expo SDK 57의 옵트인 또는 SDK 58, Flutter의 자동 마이그레이션 또는 수동 절차(sdkbump는 Flutter 마이그레이터와 같은 조건을 확인합니다), SwiftUI 앱이라면 SwiftUI API.
- **조용히 깨지는 부분도**: 앱에 scene이 생기면 UIKit이 더 이상 사용하지 않는 app delegate 메서드와 launch option(링크, Handoff, 퀵 액션, 포그라운드와 백그라운드 전환), 그리고 올바른 window를 더 이상 찾지 못하는 window 조회.
- **모든 설명에는 출처가 있습니다.** 규칙은 데이터로 관리되며([rules/ios27.json](rules/ios27.json)) 각 규칙은 Apple, Flutter, React Native, Expo가 직접 공개한 페이지를 인용합니다. 출처가 없는 규칙이 있으면 테스트가 실패합니다.
- **iOS 27 시뮬레이터에서 확인했습니다**: SCN001과 SCN002의 배경이 되는 실행 실패와 검은 화면을 Xcode 27.0으로 재현했으며, 녹화본은 저장소에 있습니다.

## 빠른 시작

[Node.js](https://nodejs.org/) 22.12 이상이 필요합니다(`node --version`으로 확인할 수 있고, Mac에서는 `brew install node`로 설치할 수 있습니다). 그 외에는 필요한 것이 없습니다.

**1. 앱 폴더에서 터미널을 엽니다.** `.xcodeproj`, `pubspec.yaml`, `package.json` 중 하나가 있는 폴더입니다.

```sh
cd path/to/YourApp
```

**2. sdkbump를 실행합니다.**

```sh
npx https://github.com/muhittincamdali/sdkbump/releases/download/v0.1.2/sdkbump-0.1.2.tgz
```

sdkbump는 아직 npm에 공개되어 있지 않아(공개할 계획입니다) 지금은 `npx sdkbump`를 사용할 수 없습니다. 위 명령은 GitHub의 0.1.2 릴리스를 실행합니다. 이 README에서 `npx sdkbump`라고 적힌 곳에는 이 명령을 사용하세요.

**3. 프로젝트 이름 아래의 첫 번째 줄을 읽습니다.** "Fails to launch when built with the iOS 27 SDK"(iOS 27 SDK로 빌드하면 실행되지 않음)는 **ERROR** 항목을 고칠 때까지 앱이 실행 시점에 멈춘다는 뜻이며, 각 항목은 "How to fix" 목록의 어떤 해결 방법이 맞는지 알려 줍니다. **WARNING** 항목은 실행을 막지는 않지만, 앱에 scene이 생기면 동작하지 않게 됩니다. "Launch not determined"(실행 여부를 판단할 수 없음)는 sdkbump가 Info.plist를 읽지 못했다는 뜻이며, 어떤 파일을 왜 읽지 못했는지는 보고서 끝의 참고 사항에 나옵니다(아래 "한계" 참고).

## iOS 27 SDK로 빌드하면 무엇이 달라지나요

Apple의 [Transitioning to the UIKit scene-based life cycle](https://developer.apple.com/documentation/uikit/transitioning-to-the-uikit-scene-based-life-cycle)에서 인용합니다(번역).

> iOS 27, iPadOS 27, Mac Catalyst 27, tvOS 27, visionOS 27부터는 최신 SDK로 빌드한 앱이 scene 기반 생명 주기를 채택해야 하며, 그렇지 않으면 실행되지 않습니다.

1. **앱이 scene을 선언하지 않으면 실행할 때 멈춥니다.** Info.plist에 구성이 들어 있는 `UIApplicationSceneManifest`가 없고 `application(_:configurationForConnecting:options:)`도 없으면, UIKit은 "UIScene life cycle is required for apps built with this SDK"라는 메시지와 함께 프로세스를 종료합니다. 이 검사는 앱이 시작될 때 이루어지므로 컴파일러는 경고하지 않습니다. React Native 0.87 이하, 옵트인하지 않은 Expo SDK 57, Expo SDK 56 이하가 이런 앱을 만들며, Flutter 도구가 마이그레이션하지 못하는 Flutter 앱도 마찬가지입니다.
2. **scene이 있으면 app delegate는 더 이상 UI 이벤트를 받지 못합니다.** 링크, user activity, 퀵 액션, 활성/백그라운드 전환은 scene delegate로 전달되며, app delegate가 만든 window는 화면에 나타나지 않습니다.

[컴파일되는데도 충돌하는 이유](docs/guides/why-it-crashes.md)에서는 iOS 27.0 시뮬레이터에서 실행한 [실행 매트릭스](examples/launch-matrix/README.md)를 보여 줍니다.

## sdkbump가 검사하는 항목

| 규칙   | 심각도  | 항목                                                                                                                                                                         | iOS 27.0 시뮬레이터에서 확인한 결과                                |
| ------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| SCN001 | error   | scene 구성이 없음: 구성된 `UIApplicationSceneManifest`도 `configurationForConnecting`도 없고 SwiftUI `App`도 아님. `ios/`가 없는 Expo는 SDK 버전과 `enableSceneSupport` 확인 | 실행할 때 멈춤                                                     |
| SCN002 | error   | app delegate가 `UIWindow(frame:)`으로 window를 생성함                                                                                                                        | 앱에 scene이 생기면 검은 화면                                      |
| SCN003 | warning | scene이 있으면 UIKit이 더 이상 사용하지 않는 app delegate 메서드와 launch option 키(13개). 단, scene delegate가 이미 처리하는 경우는 제외                                    | SwiftUI 앱에서 `applicationDidEnterBackground(_:)`가 호출되지 않음 |
| SCN004 | warning | `UIApplication.shared.keyWindow`, `.windows` 또는 app delegate의 `window`를 통한 window 조회                                                                                 | 컴파일러의 deprecation 경고만 표시됨                               |

규칙 데이터는 `ios27@2026.10.15`이며 Xcode 27.0(27A266a)을 기준으로 확인했습니다. React Native 또는 Expo에 `react-native-uiscene-bridge`나 `react-native-xcode27`이 설치되어 있으면, 이들이 실행 시점에 처리하는 항목은 해당 README에 적힌 한계와 함께 "처리됨"으로 표시되며 실행 실패로 처리하지 않습니다.

## 설치

sdkbump는 아직 npm에 공개되어 있지 않으며, 공개할 계획입니다. 그때까지는 위에서 보여 준 대로 GitHub의 0.1.2 릴리스를 실행하거나 프로젝트에 추가하세요.

```sh
npm install --save-dev https://github.com/muhittincamdali/sdkbump/releases/download/v0.1.2/sdkbump-0.1.2.tgz
npx sdkbump
```

sdkbump가 npm에 공개되면 `npx sdkbump`가 최신 버전을 내려받아 실행하고, `npm install --save-dev sdkbump`로 특정 버전을 고정할 수 있습니다. `muhittincamdali/tap`용 Homebrew formula는 릴리스 워크플로가 준비합니다(tap의 첫 릴리스와 함께 제공할 계획입니다).

## 사용법

```text
sdkbump [path] [options]
```

| 옵션                    | 설명                                                                   |
| ----------------------- | ---------------------------------------------------------------------- |
| `path`                  | 프로젝트 폴더 또는 `.xcodeproj`. 기본값은 현재 폴더                    |
| `-f, --format <format>` | `tty`(기본값), `markdown`, `json`                                      |
| `-o, --output <file>`   | 보고서를 터미널 대신 파일에 기록                                       |
| `--fail-on <severity>`  | `error`(기본값), `warning`, `info`, `none`: 종료 코드가 1이 되는 기준  |
| `--no-color`            | 터미널에서도 일반 텍스트로 출력(`NO_COLOR`와 `FORCE_COLOR`를 따릅니다) |

종료 코드: `0`은 `--fail-on` 이상에서 처리되지 않은 항목이 없음, `1`은 그 이상의 항목이 있음, `2`는 잘못된 인수, iOS 프로젝트를 찾지 못함 또는 예기치 않은 오류입니다.

sdkbump는 iOS 앱을 스스로 찾습니다. 네이티브 앱은 루트 또는 한 단계 아래에 있는 `.xcodeproj`, Flutter, React Native, Expo 앱은 `ios/`(Flutter 플러그인은 `example/ios/`)입니다. 프로젝트 파일에 있는 모든 iOS 앱 타깃, 각 타깃이 지정한 Info.plist(XML 또는 바이너리), 앱의 Swift 및 Objective-C 파일을 읽으며, Pods, `node_modules`, 빌드 결과물, 테스트는 건너뜁니다. `ios/`가 없는 Expo 앱은 package.json과 app.json으로 검사합니다.

### Markdown 보고서를 코드와 함께 보관하기

```sh
npx sdkbump --format markdown --output sdkbump.md
```

### 스크립트에서 JSON 보고서 사용하기

```sh
npx sdkbump --format json > sdkbump.json
```

각 항목에는 `rule`, `severity`, `file`, `line`, `message`, 단계와 가이드가 담긴 `fix`, `alternatives`, `mitigation`(우회용 패키지가 처리하면 설정됩니다), `sources`가 있습니다. 구조는 `schemaVersion` 0이며 1.0 이전에 바뀔 수 있습니다. [examples/shell/launch-blockers.sh](examples/shell/launch-blockers.sh)는 `jq`로 이를 걸러 냅니다.

### CI에서 실행하기

[examples/github-actions/sdkbump.yml](examples/github-actions/sdkbump.yml)은 iOS 앱을 건드리는 모든 pull request의 작업 요약에 보고서를 추가하고, error가 있으면 작업을 실패시킵니다.

### JavaScript에서 사용하기

```js
import { render, scan } from 'sdkbump';

const report = await scan('path/to/app');
console.log(report.verdict.text);
console.log(render(report, 'markdown'));
```

실행해 볼 수 있는 예제는 [examples/api/verdicts.mjs](examples/api/verdicts.mjs)입니다.

## 데모

터미널 녹화본은 각 툴체인으로 만든 실제 프로젝트인 [fixtures](fixtures/README.md)에서 CLI를 실행해 얻은 것입니다.

| 프로젝트                                      | 녹화본                                                                                 |
| --------------------------------------------- | -------------------------------------------------------------------------------------- |
| React Native 0.87.1 앱                        | 이 페이지 맨 위                                                                        |
| AppDelegate를 수정한 Flutter 앱(Flutter 3.24) | [라이트](docs/media/demo-flutter-light.svg) · [다크](docs/media/demo-flutter-dark.svg) |
| 어댑터 방식의 app delegate를 쓰는 SwiftUI 앱  | [라이트](docs/media/demo-swiftui-light.svg) · [다크](docs/media/demo-swiftui-dark.svg) |

iOS 27.0 시뮬레이터(iPhone 17, Xcode 27.0으로 빌드)에서 네이티브 UIKit fixture는 실행할 때 멈추고, 같은 앱을 scene delegate로 옮기면 실행됩니다.

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-simulator-native-uikit-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-simulator-native-uikit-light.svg"><img src="docs/media/demo-simulator-native-uikit-light.svg" alt="iOS 27.0 시뮬레이터에서 실행한 scripts/simulator-check.sh native-uikit: 실행 4초 후에도 동작하지 않으며, UIKit의 출력은 Application failed to launch: UIScene life cycle is required for apps built with this SDK"></picture>

<p align="center"><img src="docs/media/simulator/launched.png" width="480" alt="Xcode 27.0으로 빌드한 native-uikit-scenes와 native-swiftui fixture가 iOS 27.0이 설치된 iPhone 17 시뮬레이터에서 실행되는 모습"></p>

2026년 10월 15일에 Node.js 26.11이 설치된 Mac(Apple silicon, M5 Max)에서 다른 작업이 실행 중인 상태로 측정했습니다. fixture 10개에 대한 `node dist/cli/main.js` 실행 100번을 한 세트로 세 세트를 돌렸고, Node.js 시작 시간을 포함한 세트별 중앙값은 0.11초, 0.12초, 0.19초, 가장 느린 실행은 0.33초였습니다. 컴퓨터 부하가 클수록 시간이 늘어납니다.

## 상태

| 기능                                                                               | 상태      |
| ---------------------------------------------------------------------------------- | --------- |
| 네이티브, Flutter(앱과 플러그인 예제), React Native, Expo 프로젝트 감지            | 동작함    |
| 앱 자체의 Info.plist와 Swift/Objective-C 소스에 대한 SCN001부터 SCN004             | 동작함    |
| 생태계와 버전에 따른 해결 방법 선택, Flutter 자동 마이그레이션 확인, 우회용 패키지 | 동작함    |
| 터미널, Markdown, JSON 보고서, `--fail-on` 종료 코드                               | 동작함    |
| 의존성: Pods, `node_modules`, Flutter 플러그인 소스(패키지 이름 포함)              | 예정(0.2) |
| 우회 안내를 별도 규칙 SCN005로 제공, 15.0 미만 배포 대상에 대한 DPT001             | 예정(0.2) |
| `--verify`: CLI에서 iOS 27 시뮬레이터로 빌드하고 실행                              | 예정(0.3) |
| 패턴 대신 Swift/Objective-C 구문 트리, 빌드된 `.app` 검사, SiriKit deprecation     | 예정(0.5) |
| 네이티브 앱용 `fix --dry-run`, SARIF 출력, GitHub Action                           | 예정(0.8) |
| 안정된 규칙 스키마와 JSON 구조                                                     | 예정(1.0) |

## 한계

- **컴파일러가 아니라 패턴입니다.** 규칙은 주석과 문자열을 공백으로 바꾼 Swift와 Objective-C 텍스트에 적용하는 정규 표현식입니다. 생성된 코드, 매크로 안의 코드, 흔하지 않은 방식으로 작성한 코드는 놓치거나 잘못 잡을 수 있습니다. 구문 트리는 예정(0.5)입니다.
- **앱 자체 소스만 읽습니다.** Pods, `node_modules`, Flutter 플러그인 등 의존성은 읽지 않으므로, UIKit이 더 이상 호출하지 않는 app delegate 메서드에 기대는 플러그인은 보고되지 않습니다. 의존성 검사는 예정(0.2)입니다.
- **빌드 설정은 project.pbxproj에서만 읽습니다.** sdkbump는 프로젝트 파일에서 `INFOPLIST_FILE`과 `GENERATE_INFOPLIST_FILE`을 읽고 `$(SRCROOT)`, `$(PROJECT_DIR)`, `$(TARGET_NAME)`, `$(PRODUCT_NAME)`을 펼칩니다. `.xcconfig` 파일은 읽지 않고, 다른 빌드 설정도 펼치지 않으며, 프로젝트 폴더 밖의 Info.plist도 읽지 않습니다. 타깃의 Info.plist를 읽지 못하면 추측하는 대신 SCN001을 info 항목으로 보고하고 판정을 "Launch not determined"로 표시합니다.
- **억제 파일이 없습니다.** 항목을 검토 완료로 표시할 수 없으며, 어떤 심각도에서 실행을 실패로 할지는 `--fail-on`으로 정합니다.
- **파일만 읽습니다.** sdkbump는 앱을 빌드하거나 실행하지 않습니다. `--verify`는 예정(0.3)입니다.

## 문서

API 레퍼런스와 가이드: [muhittincamdali.github.io/sdkbump](https://muhittincamdali.github.io/sdkbump/).

## 가이드

- [컴파일되는데도 충돌하는 이유](docs/guides/why-it-crashes.md)
- [네이티브 UIKit 및 SwiftUI 앱](docs/guides/native-ios.md)
- [Flutter: 수정한 AppDelegate와 플러그인](docs/guides/flutter.md)
- [0.88 이전의 React Native와 SDK 58 이전의 Expo](docs/guides/react-native-expo.md)
- [네이티브 모듈 작성자용: 콜드 스타트 시 링크와 알림](docs/guides/native-module-authors.md)

## 관련 도구

같은 변경을 다루는 다른 프로젝트도 있습니다. 어느 것이 맞는지는 필요한 것에 따라 다릅니다.

- [react-native-uiscene-bridge](https://github.com/Atomics-hub/react-native-uiscene-bridge)와 [react-native-xcode27](https://github.com/Atomics-hub/react-native-xcode27)은 코드를 바꾸지 않고도 실행 시점에 React Native 또는 Expo 앱이 실행되도록 합니다. 아직 업그레이드할 수 없을 때 적합하며, sdkbump는 이들을 인식합니다.
- [auditor-uiscene](https://github.com/Anzell/auditor-uiscene)은 셸 스크립트로 Flutter 앱과 플러그인을 점검합니다.
- Flutter의 자체 마이그레이터(3.41부터의 `flutter build ios`)는 수정하지 않은 Flutter 앱을 마이그레이션합니다.
- [flutter_spm_doctor](https://pub.dev/packages/flutter_spm_doctor)는 Flutter 플러그인을 검사합니다.

## 요구 사항

| 툴체인  | 최소 버전 |
| ------- | --------- |
| Node.js | 22.12     |

sdkbump에는 Xcode가 필요 없습니다. 파일을 읽기만 하므로 Linux에서도 실행됩니다. CI는 Node.js 22와 24(Linux)에서 테스트를 실행하며, 로컬에서는 269개가 모두 Mac(Apple silicon)의 Node.js 22.23, 24.22, 26.11에서 통과합니다. 시뮬레이터 녹화에는 Xcode 27이 설치된 Mac이 필요하며 CI에는 포함되지 않습니다.

## 아키텍처

```text
path ─► detectProject      native | flutter | react-native | expo; iOS folder; versions
     ─► collectApp         iOS app targets from project.pbxproj, their Info.plist (XML or binary),
                           Swift and Objective-C sources with comments and strings blanked
     ─► checkApp           SCN001…SCN004, fix per ecosystem and version, workaround packages
          rules/ios27.json  what each rule says, fixes, sources (validated with zod)
     ─► render             tty | markdown | json
```

- 감지 패턴은 주석과 문자열을 비워 둔 소스 텍스트에 대한 정규식이며, 필요한 곳에서는 app delegate나 scene delegate 안에 있는 것만 셉니다.
- 규칙 데이터는 코드와 분리되어 있고 버전이 매겨져 있습니다(`ios27@2026.10.15`). 규칙, 해결 방법, 우회 방법에 출처가 없으면 테스트가 실패합니다.
- CLI(`src/cli/`)는 인수를 해석하고, 색과 너비를 고르고, 종료 코드를 정하는 일만 합니다.

## 로드맵

[상태](#상태) 표를 참고하세요. 0.2에서는 의존성과 배포 대상, 0.3에서는 CLI에서 시뮬레이터 실행, 0.5에서는 구문 트리와 빌드된 앱 검사, 0.8에서는 자동 수정과 SARIF, 1.0에서는 안정된 스키마를 추가합니다. 각 릴리스의 변경 내용은 [CHANGELOG.md](CHANGELOG.md)에 있습니다.

## FAQ

**제 앱은 지금 iOS 27에서 잘 실행됩니다. 영향을 받나요?** Xcode 26 이하로 빌드했다면 이 검사는 해당 빌드에 적용되지 않습니다. 저희가 실행해 본 결과, iOS 26 SDK에 링크한 같은 코드는 iOS 27 시뮬레이터에서 실행되었습니다. Xcode 27로 하는 다음 빌드부터 적용됩니다.

**sdkbump로 실제 기기 테스트를 대신할 수 있나요?** 아니요. 파일을 읽기만 합니다. 이 저장소의 시뮬레이터 녹화는 iOS 27.0 시뮬레이터에서 얻은 것이며, 여기서는 어떤 것도 실제 기기에서 실행하지 않았습니다.

**왜 어떤 항목은 "처리됨"으로 표시되나요?** package.json에 있는 우회용 패키지(react-native-uiscene-bridge 또는 react-native-xcode27)가 실행 시점에 scene을 선언하기 때문입니다. 앱은 실행되지만 앱 자체에는 아직 scene 지원이 없습니다. 보고서에는 해당 패키지의 한계와 실제 해결 방법이 나옵니다.

**sdkbump가 제 프로젝트를 변경하나요?** 아니요. 프로젝트를 읽기만 하고, 요청한 보고서만 기록합니다.


## 기여하기

기여를 환영합니다. pull request를 열기 전에 [기여 가이드](CONTRIBUTING.md)와 [행동 강령](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md)을 읽어 주세요. 보안 문제는 [보안 정책](SECURITY.md)에 따라 비공개로 제보해 주세요.

## 라이선스

MIT 라이선스로 배포됩니다. 자세한 내용은 [LICENSE](LICENSE)를 참고하세요.
