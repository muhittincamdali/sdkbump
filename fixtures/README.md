# Fixtures

Nine projects, one per situation sdkbump has to tell apart. The tests run sdkbump on each one and
compare the findings with the expected list in
[test/integration/fixtures.test.ts](../test/integration/fixtures.test.ts) and the full reports
with [test/\_\_snapshots\_\_/fixtures](../test/__snapshots__/fixtures).

| Folder                                                   | Made with                                                                                                                                                                                                      | Expected                                                |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [native-uikit](native-uikit)                             | A UIKit app written for these tests ([project.yml](native-uikit/project.yml), XcodeGen 2.45.3): the window, links, Handoff, quick actions and life-cycle events all in the app delegate, and keyWindow lookups | SCN001, SCN002, 7 × SCN003, 2 × SCN004; fails to launch |
| [native-uikit-scenes](native-uikit-scenes)               | The same app moved to a scene delegate by hand                                                                                                                                                                 | no findings                                             |
| [native-swiftui](native-swiftui)                         | A SwiftUI app (XcodeGen) with an adaptor app delegate that still has a link handler and a background handler, and a share sheet presented through `UIApplication.shared.windows`                               | 2 × SCN003, SCN004; launches                            |
| [flutter-custom-appdelegate](flutter-custom-appdelegate) | `flutter create` with Flutter 3.24.0 (a template from before scenes), then the AppDelegate customised with the battery method channel from Flutter's docs and a sign-in link handler                           | SCN001 (manual migration), SCN003, 2 × SCN004           |
| [expo-57](expo-57)                                       | `create-expo-app --template blank-typescript@sdk-57` (expo 57.0.29, React Native 0.86.3), then `expo prebuild -p ios`                                                                                          | SCN001 (scene support opt-in), SCN002, 2 × SCN003       |
| [rn-087](rn-087)                                         | `@react-native-community/cli init --version 0.87.1`                                                                                                                                                            | SCN001, SCN002; fails to launch                         |
| [rn-087-bridge](rn-087-bridge)                           | The same app with `react-native-uiscene-bridge` added to package.json                                                                                                                                          | SCN001, SCN002, both handled by the bridge              |
| [rn-088-rc](rn-088-rc)                                   | The `ios/` folder and package.json of `@react-native-community/template` 0.88.0-rc.6 from npm                                                                                                                  | no findings                                             |
| [expo-58](expo-58)                                       | The `ios/` folder and package.json of `expo-template-bare-minimum` 58.0.18 from npm                                                                                                                            | no findings                                             |

All projects were made on 15 October 2026 on a Mac (Apple silicon) with Xcode 27.0. Only
the files sdkbump reads and the manifests that explain them are kept: no `node_modules`, `Pods`,
asset catalogs, Android folders or build output. Flutter's `Generated.xcconfig` and
`flutter_export_environment.sh` are left out because they hold paths of the machine that ran
`flutter create`; every `flutter build` writes them again.

## What the simulator shows

The three native fixtures build with Xcode 27.0 for the iOS 27.0 simulator (`xcodegen generate`,
then `xcodebuild`). On an iPhone 17 simulator with iOS 27.0:

- **native-uikit** stops at launch. The log line is
  `Application failed to launch: UIScene life cycle is required for apps built with this SDK.`
  and the crash report shows `EXC_BREAKPOINT (SIGTRAP)` in
  `_UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption`.
- **native-uikit-scenes** launches and shows the shelf.
- **native-swiftui** launches. When another app comes to the front, SpringBoard moves Tally to the
  background, and the adaptor delegate's `applicationDidEnterBackground(_:)` does not run.


[Why it compiles and still crashes](../docs/guides/why-it-crashes.md) has the full logs, the
[launch matrix](../examples/launch-matrix) and how to repeat the runs.
