## sdkbump: Tally (native iOS)

**Launches; 3 findings to review.**

- Target `Tally`: SwiftUI App (scenes) (`Tally/Info.plist`)

| Rule | Severity | Where | Finding |
| --- | --- | --- | --- |
| SCN003 | warning | `Tally/TallyApp.swift:26` | application\(\_:open:options:\) is not called with scenes |
| SCN003 | warning | `Tally/TallyApp.swift:35` | applicationDidEnterBackground\(\_:\) is not called with scenes |
| SCN004 | warning | `Tally/ContentView.swift:38` | Window looked up through UIApplication.windows |

<details><summary>What each finding means and how to fix it</summary>

### SCN003: application\(\_:open:options:\) is not called with scenes

`Tally/TallyApp.swift:26`: A SwiftUI App runs on scenes, so UIKit does not call this method on the adaptor delegate. Use .onOpenURL instead.

**Fix: Use the SwiftUI scene API** ([guide](https://github.com/muhittincamdali/sdkbump/blob/main/docs/guides/native-ios.md))

1. A SwiftUI App always runs on scenes, so UIKit never calls this app delegate method. Use the SwiftUI replacement named in the finding on a view in your WindowGroup.

Sources: [Apple: application\(\_:open:options:\) \(deprecated in iOS 26\)](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/application(_:open:options:))

### SCN003: applicationDidEnterBackground\(\_:\) is not called with scenes

`Tally/TallyApp.swift:35`: A SwiftUI App runs on scenes, so UIKit does not call this method on the adaptor delegate. Use scenePhase instead.

**Fix: Use the SwiftUI scene API** (steps above)

Sources: [Apple: applicationDidEnterBackground\(\_:\)](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/applicationdidenterbackground(_:))

### SCN004: Window looked up through UIApplication.windows

`Tally/ContentView.swift:38`: windows lists the windows of every scene \(deprecated in iOS 15\); use the windows of the relevant UIWindowScene.

**Fix: Find the window through the scene** ([guide](https://github.com/muhittincamdali/sdkbump/blob/main/docs/guides/native-ios.md))

1. From a view or view controller, use view.window or view.window?.windowScene.
2. Elsewhere, pick the foreground UIWindowScene from UIApplication.shared.connectedScenes and use its keyWindow or windows.

Sources: [Apple: UIApplication.windows](https://developer.apple.com/documentation/uikit/uiapplication/windows)

</details>

0 errors, 3 warnings. Guide: [native iOS](https://github.com/muhittincamdali/sdkbump/blob/main/docs/guides/native-ios.md).

<sub>[sdkbump](https://github.com/muhittincamdali/sdkbump) 0.1.3, rules ios27@2026.10.27 (iOS 27.0 SDK \(Xcode 27.0, 27A266a\)). Static checks; they do not build or run the app.</sub>
