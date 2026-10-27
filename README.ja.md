<!-- i18n-source: README.md@e9dfc191490308ff05fea61f8d0cdd9fb59bc973 status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-light.svg" alt="sdkbump: Checks native iOS, Flutter and React Native apps for the iOS 27 SDK changes and names the fix for each."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/sdkbump/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/sdkbump/actions/workflows/ci.yml/badge.svg" alt="CI ステータス"></a>
<a href="https://github.com/muhittincamdali/sdkbump/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-light.svg" alt="最新バージョン: v0.1.3"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-light.svg" alt="言語バージョン: Node.js 22.12+"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-light.svg" alt="ライセンス: MIT"></picture></a>
</p>

<p align="center">
<a href="#クイックスタート"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-ja-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-ja-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-ja-light.svg" alt="はじめる"></picture></a>
<a href="https://muhittincamdali.github.io/sdkbump/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-ja-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-ja-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-ja-light.svg" alt="ドキュメント"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/tree/main/docs/guides"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-ja-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-ja-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-ja-light.svg" alt="ガイド"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/tree/main/examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-ja-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-ja-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-ja-light.svg" alt="サンプル"></picture></a>
</p>

> このドキュメントは英語版 README の翻訳です。内容が異なる場合は英語版が最新です。

<!-- brand:end -->

Xcode 27 でビルドしたものをリリースする前に: sdkbump は、ネイティブ iOS、Flutter、React Native/Expo のプロジェクトを調べ、iOS 27 SDK による変更点（まず UIScene ライフサイクル）に該当する箇所を見つけて、それぞれにどの修正が当てはまるかを伝えます。プロジェクトのファイルを読むだけで、ビルドも実行も変更も行いません。

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-rn-087-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-rn-087-light.svg"><img src="docs/media/demo-rn-087-light.svg" alt="React Native 0.87 アプリで実行した sdkbump: iOS 27 SDK でビルドすると起動に失敗する。SCN001 はシーン構成なし、SCN002 は app delegate でのウィンドウ作成で、修正方法は 2 通り"></picture>

<sub>実際の CLI から録画したものです。対象は <a href="fixtures/rn-087">rn-087 fixture</a>、つまり <code>@react-native-community/cli init</code> で作成した React Native 0.87.1 のアプリです（<code>npm run demo</code>）。</sub>

## 主な特長

- **「起動するか」に答えます。** シーンを宣言していないアプリは Xcode 27 でビルドできますが、起動時に停止します。sdkbump は、テスト端末で気づく前にそれを伝え、変更すべきファイルを示します。
- **ネイティブ、Flutter、React Native、Expo** を、同じルール ID で 1 つのレポートにまとめます。出力はテキスト、Markdown、JSON から選べ、CI 向けの終了コードもあります。
- **プロジェクトに当てはまる修正**: React Native 0.88 または手書きのシーンデリゲート、Expo SDK 57 のオプトインまたは SDK 58、Flutter の自動マイグレーションまたは手動の手順（sdkbump は Flutter のマイグレーターと同じ条件を確認します）、SwiftUI アプリなら SwiftUI の API。
- **気づきにくい不具合も**: アプリにシーンができると UIKit が使わなくなる app delegate のメソッドと起動オプション（リンク、Handoff、クイックアクション、フォアグラウンドとバックグラウンドの遷移）、そして正しいウィンドウを見つけられなくなるウィンドウの取得方法。
- **すべての記述に出典があります。** ルールはデータとして管理され（[rules/ios27.json](rules/ios27.json)）、それぞれが Apple、Flutter、React Native、Expo 自身のページを引用しています。出典のないルールがあるとテストが失敗します。
- **iOS 27 シミュレータで確認済み**: SCN001 と SCN002 の背景にある起動失敗と黒い画面を Xcode 27.0 で再現しました。録画はリポジトリに入っています。

## クイックスタート

[Node.js](https://nodejs.org/) 22.12 以降が必要です（`node --version` で確認できます。Mac では `brew install node` でインストールできます）。ほかに必要なものはありません。

**1. アプリのフォルダでターミナルを開きます。** `.xcodeproj`、`pubspec.yaml`、`package.json` のいずれかがあるフォルダです。

```sh
cd path/to/YourApp
```

**2. sdkbump を実行します。**

```sh
npx @mcamdali/sdkbump
```

npm パッケージ名は `@mcamdali/sdkbump` で、インストールされるコマンドは `sdkbump` です。スコープなしの `npx sdkbump` ではこのパッケージは実行されません。

**3. プロジェクト名の下の最初の行を読みます。** 「Fails to launch when built with the iOS 27 SDK」（iOS 27 SDK でビルドすると起動に失敗する）とある場合、**ERROR** の指摘を直すまでアプリは起動時に停止します。それぞれの指摘には、「How to fix」の一覧のどの修正が当てはまるかが書かれています。**WARNING** の指摘は起動を妨げませんが、アプリにシーンができると動作しなくなります。 「Launch not determined」（起動するかどうか判定できない）は、sdkbump が Info.plist を読めなかったことを意味します。どのファイルをなぜ読めなかったかは、レポート末尾の注記に書かれています（下の「制限事項」を参照）。

## iOS 27 SDK でビルドすると何が変わるか

Apple の [Transitioning to the UIKit scene-based life cycle](https://developer.apple.com/documentation/uikit/transitioning-to-the-uikit-scene-based-life-cycle) からの引用です（翻訳）。

> iOS 27、iPadOS 27、Mac Catalyst 27、tvOS 27、visionOS 27 以降、最新の SDK でビルドしたアプリはシーンベースのライフサイクルを採用する必要があり、採用していないと起動に失敗します。

1. **アプリがシーンを宣言していないと、起動時に停止します。** Info.plist に構成を持つ `UIApplicationSceneManifest` がなく、`application(_:configurationForConnecting:options:)` もない場合、UIKit は "UIScene life cycle is required for apps built with this SDK" というメッセージでプロセスを終了します。チェックはアプリの起動時に行われるため、コンパイラは警告を出しません。React Native 0.87 以前、オプトインしていない Expo SDK 57、Expo SDK 56 以前はこのようなアプリを作ります。Flutter ツールが移行できない Flutter アプリも同様です。
2. **シーンがあると、app delegate は UI イベントを受け取らなくなります。** リンク、ユーザーアクティビティ、クイックアクション、アクティブ/バックグラウンドの遷移はシーンデリゲートに渡され、app delegate が作ったウィンドウは表示されません。

[コンパイルできるのにクラッシュする理由](docs/guides/why-it-crashes.md)では、iOS 27.0 シミュレータで実行した[起動マトリクス](examples/launch-matrix/README.md)を紹介しています。

## sdkbump が調べること

| ルール | 重大度  | 指摘                                                                                                                                                                                               | iOS 27.0 シミュレータでの結果                                     |
| ------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| SCN001 | error   | シーン構成がない: 構成済みの `UIApplicationSceneManifest` も `configurationForConnecting` もなく、SwiftUI の `App` でもない。`ios/` のない Expo では、SDK バージョンと `enableSceneSupport` を確認 | 起動時に停止                                                      |
| SCN002 | error   | app delegate が `UIWindow(frame:)` でウィンドウを作成している                                                                                                                                      | アプリにシーンができると黒い画面になる                            |
| SCN003 | warning | シーンがあると UIKit が使わなくなる app delegate のメソッドと起動オプションのキー（13 個）。ただしシーンデリゲートがすでに処理している場合を除く                                                   | SwiftUI アプリで `applicationDidEnterBackground(_:)` が呼ばれない |
| SCN004 | warning | `UIApplication.shared.keyWindow`、`.windows`、または app delegate の `window` によるウィンドウの取得                                                                                               | コンパイラの非推奨警告のみ                                        |

ルールデータは `ios27@2026.10.27` で、Xcode 27.0（27A266a）に対して確認しています。React Native または Expo に `react-native-uiscene-bridge` や `react-native-xcode27` がインストールされている場合、それらが実行時に処理する指摘は、その README に書かれた制限とともに「処理済み」と表示され、実行の失敗にはなりません。

## インストール

npm から `sdkbump` コマンドをインストールします（パッケージ `@mcamdali/sdkbump`）。

```sh
npm i -g @mcamdali/sdkbump
sdkbump
```

プロジェクトでは `npm install --save-dev @mcamdali/sdkbump` でバージョンを固定でき、その後は `npx sdkbump` でそのコピーが実行されます。各 [GitHub リリース](https://github.com/muhittincamdali/sdkbump/releases) には同じパッケージが `sdkbump-<バージョン>.tgz` として `SHA256SUMS` ファイルと一緒に含まれており、`npx` で URL から npm を介さずに実行できます。Homebrew の場合は `brew install muhittincamdali/tap/sdkbump` でインストールできます。

## 使い方

```text
sdkbump [path] [options]
```

| オプション              | 内容                                                                        |
| ----------------------- | --------------------------------------------------------------------------- |
| `path`                  | プロジェクトのフォルダまたは `.xcodeproj`。デフォルトはカレントフォルダ     |
| `-f, --format <format>` | `tty`（デフォルト）、`markdown`、`json`                                     |
| `-o, --output <file>`   | レポートをターミナルではなくファイルに書き出す                              |
| `--fail-on <severity>`  | `error`（デフォルト）、`warning`、`info`、`none`: 終了コードが 1 になる条件 |
| `--no-color`            | ターミナルでもプレーンテキストにする（`NO_COLOR` と `FORCE_COLOR` に対応）  |

終了コード: `0` は `--fail-on` 以上で未処理の指摘がないこと、`1` はそれ以上の指摘があること、`2` は引数の誤り、iOS プロジェクトが見つからない、または予期しないエラーです。

sdkbump は iOS アプリを自動で見つけます。ネイティブアプリではルートまたは 1 階層下の `.xcodeproj`、Flutter、React Native、Expo のアプリでは `ios/`（Flutter プラグインでは `example/ios/`）です。プロジェクトファイルにあるすべての iOS アプリターゲット、それぞれが指す Info.plist（XML またはバイナリ）、アプリの Swift と Objective-C のファイルを読み、Pods、`node_modules`、ビルド成果物、テストは除外します。`ios/` のない Expo アプリは package.json と app.json から調べます。

### Markdown のレポートをコードと一緒に保存する

```sh
npx @mcamdali/sdkbump --format markdown --output sdkbump.md
```

### JSON のレポートをスクリプトで使う

```sh
npx @mcamdali/sdkbump --format json > sdkbump.json
```

各指摘には、`rule`、`severity`、`file`、`line`、`message`、手順とガイドを含む `fix`、`alternatives`、`mitigation`（回避策のパッケージが処理する場合に設定されます）、`sources` があります。構造は `schemaVersion` 0 で、1.0 より前に変わる可能性があります。[examples/shell/launch-blockers.sh](examples/shell/launch-blockers.sh) は `jq` で絞り込む例です。

### CI で実行する

[examples/github-actions/sdkbump.yml](examples/github-actions/sdkbump.yml) は、iOS アプリに変更を加えるすべての pull request のジョブサマリーにレポートを追加し、error があればジョブを失敗させます。

### JavaScript から使う

```js
import { render, scan } from 'sdkbump';

const report = await scan('path/to/app');
console.log(report.verdict.text);
console.log(render(report, 'markdown'));
```

実行できるサンプルは [examples/api/verdicts.mjs](examples/api/verdicts.mjs) です。

## デモ

ターミナルの録画は、各ツールチェーンで作成した実際のプロジェクトである [fixtures](fixtures/README.md) に対して CLI を実行したものです。

| プロジェクト                                                  | 録画                                                                                     |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| React Native 0.87.1 のアプリ                                  | このページの先頭                                                                         |
| AppDelegate をカスタマイズした Flutter アプリ（Flutter 3.24） | [ライト](docs/media/demo-flutter-light.svg) · [ダーク](docs/media/demo-flutter-dark.svg) |
| アダプター方式の app delegate を使う SwiftUI アプリ           | [ライト](docs/media/demo-swiftui-light.svg) · [ダーク](docs/media/demo-swiftui-dark.svg) |

iOS 27.0 シミュレータ（iPhone 17、Xcode 27.0 でビルド）では、ネイティブ UIKit の fixture は起動時に停止し、同じアプリをシーンデリゲートに移行すると起動します。

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-simulator-native-uikit-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-simulator-native-uikit-light.svg"><img src="docs/media/demo-simulator-native-uikit-light.svg" alt="iOS 27.0 シミュレータでの scripts/simulator-check.sh native-uikit: 起動の 4 秒後に動作しておらず、UIKit の出力は Application failed to launch: UIScene life cycle is required for apps built with this SDK"></picture>

<p align="center"><img src="docs/media/simulator/launched.png" width="480" alt="Xcode 27.0 でビルドした native-uikit-scenes と native-swiftui の fixture が、iOS 27.0 の iPhone 17 シミュレータで動作している様子"></p>

2026 年 10 月 15 日に、Node.js 26.11 を使った Mac（Apple silicon、M5 Max）で、ほかのジョブが動いている状態で計測しました。10 件の fixture に対する `node dist/cli/main.js` の実行 100 回を 1 セットとして 3 セット行い、Node.js の起動時間を含めた中央値は各セットで 0.11 秒、0.12 秒、0.19 秒、最も遅い実行は 0.33 秒でした。マシンの負荷が高いほど時間は長くなります。

## ステータス

| 機能                                                                                               | ステータス  |
| -------------------------------------------------------------------------------------------------- | ----------- |
| ネイティブ、Flutter（アプリとプラグインのサンプル）、React Native、Expo のプロジェクト検出         | 動作します  |
| アプリ自身の Info.plist と Swift/Objective-C ソースに対する SCN001 から SCN004                     | 動作します  |
| エコシステムとバージョンに応じた修正の選択、Flutter 自動マイグレーションの確認、回避策のパッケージ | 動作します  |
| ターミナル、Markdown、JSON のレポート、`--fail-on` の終了コード                                    | 動作します  |
| 依存関係: Pods、`node_modules`、Flutter プラグインのソース（パッケージ名つき）                     | 予定（0.2） |
| 回避策の通知を独立した SCN005 ルールとして提供、15.0 未満のデプロイメントターゲットの DPT001       | 予定（0.2） |
| `--verify`: CLI から iOS 27 シミュレータでビルドして起動                                           | 予定（0.3） |
| パターンではなく Swift/Objective-C の構文木、ビルド済み `.app` のチェック、SiriKit の非推奨        | 予定（0.5） |
| ネイティブアプリ向けの `fix --dry-run`、SARIF 出力、GitHub Action                                  | 予定（0.8） |
| 安定したルールスキーマと JSON 構造                                                                 | 予定（1.0） |

## 制限事項

- **コンパイラではなくパターンです。** ルールは、コメントと文字列を空白に置き換えた Swift と Objective-C のテキストに対する正規表現です。生成されたコード、マクロの中のコード、変わった書き方のコードは、見落としたり誤って検出したりすることがあります。構文木への移行は予定（0.5）です。
- **アプリ自身のソースだけを読みます。** Pods、`node_modules`、Flutter プラグインなどの依存関係は読まないため、UIKit がもう呼ばない app delegate のメソッドに頼るプラグインは報告されません。依存関係のチェックは予定（0.2）です。
- **ビルド設定は project.pbxproj からのみ読みます。** sdkbump はプロジェクトファイルから `INFOPLIST_FILE` と `GENERATE_INFOPLIST_FILE` を読み、`$(SRCROOT)`、`$(PROJECT_DIR)`、`$(TARGET_NAME)`、`$(PRODUCT_NAME)` を展開します。`.xcconfig` ファイルは読まず、ほかのビルド設定も展開せず、プロジェクトフォルダの外にある Info.plist も読みません。ターゲットの Info.plist を読めないときは、推測する代わりに SCN001 を info の指摘とし、判定を「Launch not determined」にします。
- **抑制ファイルはありません。** 指摘を確認済みとして印を付けることはできません。どの重大度で実行を失敗にするかは `--fail-on` で決めます。
- **ファイルを読むだけです。** sdkbump はアプリをビルドも起動もしません。`--verify` は予定（0.3）です。

## ドキュメント

API リファレンスとガイド: [muhittincamdali.github.io/sdkbump](https://muhittincamdali.github.io/sdkbump/)。

## ガイド

- [コンパイルできるのにクラッシュする理由](docs/guides/why-it-crashes.md)
- [ネイティブの UIKit と SwiftUI のアプリ](docs/guides/native-ios.md)
- [Flutter: カスタム AppDelegate とプラグイン](docs/guides/flutter.md)
- [0.88 より前の React Native と SDK 58 より前の Expo](docs/guides/react-native-expo.md)
- [ネイティブモジュールの作者向け: コールドスタート時のリンクと通知](docs/guides/native-module-authors.md)

## 関連ツール

同じ変更に取り組んでいるプロジェクトは、ほかにもあります。どれが合うかは、必要なものによって変わります。

- [react-native-uiscene-bridge](https://github.com/Atomics-hub/react-native-uiscene-bridge) と [react-native-xcode27](https://github.com/Atomics-hub/react-native-xcode27) は、コードを変更せずに、実行時に React Native または Expo のアプリを起動できるようにします。React Native 0.88 と Expo SDK 58 がシーン対応を追加する前に公開されたもので、sdkbump はもう提案しませんが、インストールされていれば認識します。
- [auditor-uiscene](https://github.com/Anzell/auditor-uiscene) は、シェルスクリプトで Flutter アプリとそのプラグインを監査します。
- Flutter 自身のマイグレーター（3.41 以降の `flutter build ios`）は、変更を加えていない Flutter アプリを移行します。
- [flutter_spm_doctor](https://pub.dev/packages/flutter_spm_doctor) は Flutter プラグインをチェックします。

## 動作要件

| ツールチェーン | 最小バージョン |
| -------------- | -------------- |
| Node.js        | 22.12          |

sdkbump に Xcode は不要です。ファイルを読むだけなので、Linux でも動作します。CI では Node.js 22 と 24（Linux）でテストを実行します。ローカルでは、280 件すべてが Mac（Apple silicon）上の Node.js 22.23、24.22、26.11 で成功しています。シミュレータの録画には Xcode 27 を入れた Mac が必要で、CI には含まれません。

## アーキテクチャ

```text
path ─► detectProject      native | flutter | react-native | expo; iOS folder; versions
     ─► collectApp         iOS app targets from project.pbxproj, their Info.plist (XML or binary),
                           Swift and Objective-C sources with comments and strings blanked
     ─► checkApp           SCN001…SCN004, fix per ecosystem and version, workaround packages
          rules/ios27.json  what each rule says, fixes, sources (validated with zod)
     ─► render             tty | markdown | json
```

- 検出パターンは、コメントと文字列を空白にしたソーステキストに対する正規表現です。必要な場面では、app delegate またはシーンデリゲートの内側にあるものだけを数えます。
- ルールデータはコードから分離されており、バージョン管理されています（`ios27@2026.10.27`）。ルール、修正、回避策のいずれかに出典がないと、テストが失敗します。
- CLI（`src/cli/`）は、引数の解析、色と幅の選択、終了コードの設定だけを行います。

## ロードマップ

[ステータス](#ステータス)の表を参照してください。0.2 で依存関係とデプロイメントターゲット、0.3 で CLI からのシミュレータ起動、0.5 で構文木とビルド済みアプリのチェック、0.8 で修正と SARIF、1.0 で安定したスキーマを追加します。各リリースの変更点は [CHANGELOG.md](CHANGELOG.md) にあります。

## FAQ

**私のアプリは今日 iOS 27 で動いています。影響はありますか？** Xcode 26 以前でビルドしたものであれば、このチェックはそのビルドには当てはまりません。今回の検証では、iOS 26 SDK にリンクした同じコードが iOS 27 シミュレータで起動しました。Xcode 27 での次回のビルドから当てはまります。

**sdkbump は実機でのテストの代わりになりますか？** いいえ。ファイルを読むだけです。このリポジトリにあるシミュレータの録画は iOS 27.0 シミュレータのもので、実機で実行したものはありません。

**なぜ指摘が「処理済み」と表示されるのですか？** package.json にある回避策のパッケージ（react-native-uiscene-bridge または react-native-xcode27）が、実行時にシーンを宣言するためです。アプリは起動しますが、アプリ自身にはまだシーンのサポートがありません。レポートには、そのパッケージの制限と本来の修正方法が載ります。

**sdkbump はプロジェクトを変更しますか？** いいえ。プロジェクトを読み、求められたレポートだけを書き出します。


## コントリビューション

コントリビューションを歓迎します。pull request を作成する前に[コントリビューションガイド](CONTRIBUTING.md)と[行動規範](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md)をお読みください。セキュリティ上の問題は[セキュリティポリシー](SECURITY.md)に従って非公開で報告してください。

## ライセンス

MIT ライセンスで公開しています。詳細は [LICENSE](LICENSE) を参照してください。
