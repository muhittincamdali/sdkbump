<!-- i18n-source: README.md@fa986ced9af418c4eec9ed285aa542550db4ab26 status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-light.svg" alt="sdkbump: Checks native iOS, Flutter and React Native apps for the iOS 27 SDK changes and names the fix for each."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/sdkbump/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/sdkbump/actions/workflows/ci.yml/badge.svg" alt="CI 状态"></a>
<a href="https://github.com/muhittincamdali/sdkbump/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-light.svg" alt="最新版本: v0.1.4"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-light.svg" alt="语言版本: Node.js 22.12+"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-light.svg" alt="许可证: MIT"></picture></a>
</p>

<p align="center">
<a href="#快速开始"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-zh-CN-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-zh-CN-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-zh-CN-light.svg" alt="开始使用"></picture></a>
<a href="https://muhittincamdali.github.io/sdkbump/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-zh-CN-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-zh-CN-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-zh-CN-light.svg" alt="文档"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/tree/main/docs/guides"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-zh-CN-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-zh-CN-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-zh-CN-light.svg" alt="指南"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/tree/main/examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-zh-CN-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-zh-CN-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-zh-CN-light.svg" alt="示例"></picture></a>
</p>

> 本文是英文 README 的译文。如两者内容不一致，以英文版为准。

<!-- brand:end -->

在发布使用 Xcode 27 构建的版本之前：sdkbump 会检查原生 iOS、Flutter 或 React Native/Expo 项目是否受 iOS 27 SDK 变更的影响（首先是 UIScene 生命周期），并针对每一项发现告诉你适用的修复方式。它只读取项目文件，不会构建、运行或修改任何内容。

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-rn-087-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-rn-087-light.svg"><img src="docs/media/demo-rn-087-light.svg" alt="在 React Native 0.87 应用上运行 sdkbump：使用 iOS 27 SDK 构建后无法启动；SCN001 没有场景配置，SCN002 在 app delegate 中创建窗口，并给出两种修复方式"></picture>

<sub>录制自真实的 CLI，运行对象是 <a href="fixtures/rn-087">rn-087 fixture</a>，即由 <code>@react-native-community/cli init</code> 创建的 React Native 0.87.1 应用（<code>npm run demo</code>）。</sub>

## 亮点

- **回答“能启动吗？”** 没有声明任何 scene 的应用可以用 Xcode 27 构建，但会在启动时停止。sdkbump 会在你在测试设备上才发现之前就告诉你，并指出需要修改的文件。
- **原生、Flutter、React Native 和 Expo** 在同一份报告中使用相同的规则 ID，输出格式为文本、Markdown 或 JSON，并提供供 CI 使用的退出码。
- **适用于你的项目的修复方式**：React Native 0.88 或手写的 scene delegate，Expo SDK 57 的可选开关或 SDK 58，Flutter 的自动迁移或手动步骤（sdkbump 检查的条件与 Flutter 的迁移工具相同），或者针对 SwiftUI 应用的 SwiftUI API。
- **也包括悄无声息的故障**：应用有了 scene 之后，UIKit 不再使用的 app delegate 方法和启动选项（链接、Handoff、快捷操作、前台与后台切换），以及再也找不到正确窗口的窗口查找方式。
- **每一条说明都有出处。** 规则以数据形式存放（[rules/ios27.json](rules/ios27.json)），每条规则都引用 Apple、Flutter、React Native 或 Expo 自己的页面；缺少出处时测试会失败。
- **已在 iOS 27 模拟器中验证**：SCN001 和 SCN002 背后的启动失败与黑屏已用 Xcode 27.0 复现，录像保存在仓库中。

## 快速开始

你需要 [Node.js](https://nodejs.org/) 22.12 或更高版本（`node --version` 可查看版本；在 Mac 上，`brew install node` 即可安装）。不需要其他任何东西。

**1. 在应用所在的文件夹中打开终端**，也就是包含 `.xcodeproj`、`pubspec.yaml` 或 `package.json` 的那个文件夹：

```sh
cd path/to/YourApp
```

**2. 运行 sdkbump：**

```sh
npx @mcamdali/sdkbump
```

npm 包名是 `@mcamdali/sdkbump`，它安装的命令是 `sdkbump`。不带 scope 的 `npx sdkbump` 不会运行它。

**3. 阅读项目名称下方的第一行。** “Fails to launch when built with the iOS 27 SDK”（使用 iOS 27 SDK 构建后无法启动）表示在你修复 **ERROR** 级别的发现之前，应用会在启动时停止；每一项发现都会说明适用“How to fix”列表中的哪种修复方式。**WARNING** 级别的发现不会阻止启动，但应用有了 scene 之后就会失效。 “Launch not determined”（无法判断能否启动）表示 sdkbump 没能读取某个 Info.plist；报告末尾的注释会说明是哪一个以及原因（见下方“限制”）。

## 使用 iOS 27 SDK 构建时有哪些变化

引自 Apple 的 [Transitioning to the UIKit scene-based life cycle](https://developer.apple.com/documentation/uikit/transitioning-to-the-uikit-scene-based-life-cycle)（译文）：

> 从 iOS 27、iPadOS 27、Mac Catalyst 27、tvOS 27 和 visionOS 27 开始，使用最新 SDK 构建的应用必须采用基于 scene 的生命周期，否则将无法启动。

1. **如果应用没有声明 scene，它会在启动时停止。** Info.plist 中没有带配置的 `UIApplicationSceneManifest`，也没有 `application(_:configurationForConnecting:options:)`：UIKit 会以 “UIScene life cycle is required for apps built with this SDK” 为提示结束进程。编译器不会给出警告，因为这项检查发生在应用启动时。React Native 0.87 及更早版本、未启用可选开关的 Expo SDK 57，以及 Expo SDK 56 及更早版本创建的应用都属于这种情况；Flutter 工具无法迁移的 Flutter 应用也是如此。
2. **有了 scene，app delegate 就不再接收界面事件。** 链接、user activity、快捷操作以及活跃/后台切换都会转到 scene delegate，而由 app delegate 创建的窗口永远不会显示。

[为什么能编译却仍然崩溃](docs/guides/why-it-crashes.md)介绍了我们在 iOS 27.0 模拟器中运行的[启动矩阵](examples/launch-matrix/README.md)。

## sdkbump 检查什么

| 规则   | 严重程度 | 发现                                                                                                                                                                                 | 在 iOS 27.0 模拟器中观察到的现象                              |
| ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| SCN001 | error    | 没有 scene 配置：没有已配置的 `UIApplicationSceneManifest`，没有 `configurationForConnecting`，也不是 SwiftUI `App`；对于没有 `ios/` 的 Expo，则检查 SDK 版本和 `enableSceneSupport` | 启动时停止                                                    |
| SCN002 | error    | app delegate 使用 `UIWindow(frame:)` 创建窗口                                                                                                                                        | 应用有了 scene 之后出现黑屏                                   |
| SCN003 | warning  | UIKit 在使用 scene 时不再使用的 app delegate 方法和启动选项键（共 13 个），除非 scene delegate 已经处理了它们                                                                        | SwiftUI 应用中 `applicationDidEnterBackground(_:)` 不会被调用 |
| SCN004 | warning  | 通过 `UIApplication.shared.keyWindow`、`.windows` 或 app delegate 的 `window` 查找窗口                                                                                               | 仅有编译器的弃用警告                                          |

规则数据 `ios27@2026.10.27`，已对照 Xcode 27.0（27A266a）检查。当 React Native 或 Expo 项目安装了 `react-native-uiscene-bridge` 或 `react-native-xcode27` 时，它们在运行时处理的发现会显示为“已处理”，并附上其 README 中说明的限制，不会导致运行失败。

## 安装

从 npm 安装 `sdkbump` 命令（包名 `@mcamdali/sdkbump`）：

```sh
npm i -g @mcamdali/sdkbump
sdkbump
```

在项目中，`npm install --save-dev @mcamdali/sdkbump` 会锁定一个版本，之后 `npx sdkbump` 运行的就是这个副本。每个 [GitHub 发布版本](https://github.com/muhittincamdali/sdkbump/releases)也以 `sdkbump-<版本>.tgz` 的形式附带同一个包和 `SHA256SUMS` 文件，`npx` 可以不经 npm 直接从其 URL 运行。使用 Homebrew：`brew install muhittincamdali/tap/sdkbump`。

## 使用方法

```text
sdkbump [path] [options]
```

| 选项                    | 作用                                                           |
| ----------------------- | -------------------------------------------------------------- |
| `path`                  | 项目文件夹或 `.xcodeproj`；默认为当前文件夹                    |
| `-f, --format <format>` | `tty`（默认）、`markdown` 或 `json`                            |
| `-o, --output <file>`   | 将报告写入文件，而不是输出到终端                               |
| `--fail-on <severity>`  | `error`（默认）、`warning`、`info` 或 `none`：退出码何时为 1   |
| `--no-color`            | 即使在终端中也输出纯文本（会遵循 `NO_COLOR` 和 `FORCE_COLOR`） |

退出码：`0` 表示没有达到或超过 `--fail-on` 级别的未处理发现，`1` 表示有达到或超过该级别的发现，`2` 表示参数错误、未找到 iOS 项目或发生意外错误。

sdkbump 会自行找到 iOS 应用：原生应用是根目录或下一级文件夹中的 `.xcodeproj`，Flutter、React Native 和 Expo 应用是 `ios/`（Flutter 插件是 `example/ios/`）。它会读取项目文件中的每个 iOS 应用 target、每个 target 指定的 Info.plist（XML 或二进制），以及应用的 Swift 和 Objective-C 文件，并跳过 Pods、`node_modules`、构建产物和测试。没有 `ios/` 的 Expo 应用则根据 package.json 和 app.json 检查。

### 将 Markdown 报告与代码一起保存

```sh
npx @mcamdali/sdkbump --format markdown --output sdkbump.md
```

### 在脚本中使用 JSON 报告

```sh
npx @mcamdali/sdkbump --format json > sdkbump.json
```

每项发现都包含 `rule`、`severity`、`file`、`line`、`message`、带有步骤和指南的 `fix`、`alternatives`、`mitigation`（当有变通方案包处理该问题时会设置）以及 `sources`。其结构为 `schemaVersion` 0，在 1.0 之前可能会变化。[examples/shell/launch-blockers.sh](examples/shell/launch-blockers.sh) 用 `jq` 对其进行过滤。

### 在 CI 中运行

[examples/github-actions/sdkbump.yml](examples/github-actions/sdkbump.yml) 会把报告添加到每个涉及 iOS 应用的 pull request 的作业摘要中，并在出现 error 时使作业失败。

### 在 JavaScript 中使用

```js
import { render, scan } from 'sdkbump';

const report = await scan('path/to/app');
console.log(report.verdict.text);
console.log(render(report, 'markdown'));
```

可运行的版本见 [examples/api/verdicts.mjs](examples/api/verdicts.mjs)。

## 演示

终端录像来自 CLI 在 [fixtures](fixtures/README.md) 上的运行，这些 fixture 是用各个工具链创建的真实项目：

| 项目                                                 | 录像                                                                                 |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------ |
| React Native 0.87.1 应用                             | 本页顶部                                                                             |
| 自定义了 AppDelegate 的 Flutter 应用（Flutter 3.24） | [浅色](docs/media/demo-flutter-light.svg) · [深色](docs/media/demo-flutter-dark.svg) |
| 使用适配器 app delegate 的 SwiftUI 应用              | [浅色](docs/media/demo-swiftui-light.svg) · [深色](docs/media/demo-swiftui-dark.svg) |

在 iOS 27.0 模拟器（iPhone 17，使用 Xcode 27.0 构建）中，原生 UIKit fixture 会在启动时停止，而改用 scene delegate 的同一个应用可以正常启动：

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-simulator-native-uikit-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-simulator-native-uikit-light.svg"><img src="docs/media/demo-simulator-native-uikit-light.svg" alt="在 iOS 27.0 模拟器上运行 scripts/simulator-check.sh native-uikit：启动 4 秒后未在运行，UIKit 的输出为：Application failed to launch: UIScene life cycle is required for apps built with this SDK"></picture>

<p align="center"><img src="docs/media/simulator/launched.png" width="480" alt="native-uikit-scenes 和 native-swiftui fixture 运行在安装了 iOS 27.0 的 iPhone 17 模拟器上，使用 Xcode 27.0 构建"></p>

2026 年 10 月 15 日在一台 Mac（Apple silicon，M5 Max）上使用 Node.js 26.11 测得，测量时机器上还在运行其他任务：在十个 fixture 上运行 `node dist/cli/main.js`，每组 100 次，共三组（包含 Node.js 启动时间）。三组的中位数分别为 0.11、0.12 和 0.19 秒，最慢的一次为 0.33 秒。机器负载越高，耗时越长。

## 状态

| 功能                                                                          | 状态          |
| ----------------------------------------------------------------------------- | ------------- |
| 原生、Flutter（应用和插件示例）、React Native 和 Expo 项目检测                | 可用          |
| 针对应用自身 Info.plist 和 Swift/Objective-C 源码的 SCN001 到 SCN004          | 可用          |
| 按生态系统和版本选择修复方式；Flutter 自动迁移检查；变通方案包                | 可用          |
| 终端、Markdown 和 JSON 报告；`--fail-on` 退出码                               | 可用          |
| 依赖项：Pods、`node_modules` 和 Flutter 插件源码，并指出包名                  | 计划中（0.2） |
| 将 SCN005 变通方案提示作为独立规则；针对低于 15.0 的部署目标的 DPT001         | 计划中（0.2） |
| `--verify`：通过 CLI 在 iOS 27 模拟器中构建并启动                             | 计划中（0.3） |
| 用 Swift/Objective-C 语法树取代模式匹配；已构建的 `.app` 检查；SiriKit 弃用项 | 计划中（0.5） |
| 面向原生应用的 `fix --dry-run`、SARIF 输出、GitHub Action                     | 计划中（0.8） |
| 稳定的规则 schema 和 JSON 结构                                                | 计划中（1.0） |

## 限制

- **基于模式，而不是编译器。** 规则是作用于 Swift 和 Objective-C 文本的正则表达式，文本中的注释和字符串已被清空。生成的代码、藏在宏里的代码或写法不常见的代码可能被漏掉或误判。语法树计划中（0.5）。
- **只读取应用自身的源码。** 不读取 Pods、`node_modules`、Flutter 插件和其他依赖，因此依赖 UIKit 已不再调用的 app delegate 方法的插件不会被报告。依赖检查计划中（0.2）。
- **构建设置只来自 project.pbxproj。** sdkbump 从项目文件读取 `INFOPLIST_FILE` 和 `GENERATE_INFOPLIST_FILE`，并展开 `$(SRCROOT)`、`$(PROJECT_DIR)`、`$(TARGET_NAME)` 和 `$(PRODUCT_NAME)`。它不读取 `.xcconfig` 文件，不展开其他构建设置，也不读取项目文件夹之外的 Info.plist。无法读取某个 target 的 Info.plist 时，SCN001 会作为 info 级别的发现报告，结论为“Launch not determined”，而不是猜测。
- **没有屏蔽文件。** 无法把某项发现标记为已审查；由 `--fail-on` 决定哪些严重级别会让运行失败。
- **只读取文件。** sdkbump 不会构建或启动应用；`--verify` 计划中（0.3）。

## 文档

API 参考与指南：[muhittincamdali.github.io/sdkbump](https://muhittincamdali.github.io/sdkbump/)。

## 指南

- [为什么能编译却仍然崩溃](docs/guides/why-it-crashes.md)
- [原生 UIKit 和 SwiftUI 应用](docs/guides/native-ios.md)
- [Flutter：自定义 AppDelegate 和插件](docs/guides/flutter.md)
- [0.88 之前的 React Native 和 SDK 58 之前的 Expo](docs/guides/react-native-expo.md)
- [原生模块作者：冷启动时的链接与通知](docs/guides/native-module-authors.md)

## 相关工具

还有其他项目也在处理同一项变更；哪一个合适，取决于你的需求：

- [react-native-uiscene-bridge](https://github.com/Atomics-hub/react-native-uiscene-bridge) 和 [react-native-xcode27](https://github.com/Atomics-hub/react-native-xcode27) 可以在运行时让 React Native 或 Expo 应用无需修改代码即可启动。它们发布于 React Native 0.88 和 Expo SDK 58 加入场景支持之前；sdkbump 不再推荐它们，但安装后仍能识别。
- [auditor-uiscene](https://github.com/Anzell/auditor-uiscene) 用 shell 脚本审计 Flutter 应用及其插件。
- Flutter 自带的迁移工具（从 3.41 起的 `flutter build ios`）可以迁移未经修改的 Flutter 应用。
- [flutter_spm_doctor](https://pub.dev/packages/flutter_spm_doctor) 检查 Flutter 插件。

## 系统要求

| 工具链  | 最低版本 |
| ------- | -------- |
| Node.js | 22.12    |

sdkbump 不需要 Xcode：它只读取文件，因此也可以在 Linux 上运行。CI 在 Node.js 22 和 24（Linux）上运行测试；在本地的 Mac（Apple silicon）上，全部 280 个测试在 Node.js 22.23、24.22 和 26.11 上均通过。模拟器录像需要安装了 Xcode 27 的 Mac，不属于 CI 的一部分。

## 架构

```text
path ─► detectProject      native | flutter | react-native | expo; iOS folder; versions
     ─► collectApp         iOS app targets from project.pbxproj, their Info.plist (XML or binary),
                           Swift and Objective-C sources with comments and strings blanked
     ─► checkApp           SCN001…SCN004, fix per ecosystem and version, workaround packages
          rules/ios27.json  what each rule says, fixes, sources (validated with zod)
     ─► render             tty | markdown | json
```

- 检测模式是针对源码文本的正则表达式，其中的注释和字符串已被清空；在需要的地方，只有位于 app delegate 或 scene delegate 内部的匹配才会计入。
- 规则数据与代码分离并带有版本（`ios27@2026.10.27`）；如果某条规则、修复方式或变通方案没有出处，测试就会失败。
- CLI（`src/cli/`）只负责解析参数、选择颜色和宽度，以及设置退出码。

## 路线图

参见[状态](#状态)表：0.2 增加依赖项和部署目标，0.3 支持通过 CLI 在模拟器中启动，0.5 增加语法树和已构建应用的检查，0.8 增加修复和 SARIF，1.0 提供稳定的 schema。[CHANGELOG.md](CHANGELOG.md) 列出了每个版本的变更。

## 常见问题

**我的应用今天在 iOS 27 上能运行，会受到影响吗？** 如果它是用 Xcode 26 或更早版本构建的，这项检查不适用于那次构建：在我们的测试中，链接到 iOS 26 SDK 的同一份代码可以在 iOS 27 模拟器上启动。它适用于你下一次使用 Xcode 27 的构建。

**sdkbump 能取代真机测试吗？** 不能。它只读取文件。本仓库中的模拟器录像来自 iOS 27.0 模拟器；这里没有任何内容是在真机上运行的。

**为什么某项发现显示为“已处理”？** package.json 中的某个变通方案包（react-native-uiscene-bridge 或 react-native-xcode27）会在运行时声明一个 scene。应用可以启动，但它自身仍然没有 scene 支持；报告会列出该包的限制以及真正的修复方式。

**sdkbump 会修改我的项目吗？** 不会。它只读取项目，只写入你要求的报告。


## 参与贡献

欢迎参与贡献。提交 pull request 之前，请先阅读[贡献指南](CONTRIBUTING.md)和[行为准则](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md)。如发现安全问题，请按照[安全策略](SECURITY.md)私下报告。

## 许可证

基于 MIT 许可证发布。详见 [LICENSE](LICENSE)。
