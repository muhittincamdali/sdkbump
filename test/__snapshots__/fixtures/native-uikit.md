## sdkbump: Shelf (native iOS)

**Fails to launch when built with the iOS 27 SDK.**

- Target `Shelf`: app delegate life cycle (`Shelf/Info.plist`)

| Rule | Severity | Where | Finding |
| --- | --- | --- | --- |
| SCN001 | error | `Shelf/Info.plist` | No scene configuration |
| SCN002 | error | `Shelf/AppDelegate.swift:12` | Window created in the app delegate |
| SCN003 | warning | `Shelf/AppDelegate.swift:18` | launchOptions\[.url\] is empty with scenes |
| SCN003 | warning | `Shelf/AppDelegate.swift:21` | launchOptions\[.shortcutItem\] is empty with scenes |
| SCN003 | warning | `Shelf/AppDelegate.swift:29` | application\(\_:open:options:\) is not called with scenes |
| SCN003 | warning | `Shelf/AppDelegate.swift:38` | application\(\_:continue:restorationHandler:\) is not called with scenes |
| SCN003 | warning | `Shelf/AppDelegate.swift:48` | application\(\_:performActionFor:completionHandler:\) is not called with scenes |
| SCN003 | warning | `Shelf/AppDelegate.swift:56` | applicationDidBecomeActive\(\_:\) is not called with scenes |
| SCN003 | warning | `Shelf/AppDelegate.swift:60` | applicationDidEnterBackground\(\_:\) is not called with scenes |
| SCN004 | warning | `Shelf/Router.swift:35` | Window looked up through keyWindow |
| SCN004 | warning | `Shelf/Router.swift:36` | Window looked up through UIApplication.windows |

<details><summary>What each finding means and how to fix it</summary>

### SCN001: No scene configuration

`Shelf/Info.plist`: Info.plist has no UIApplicationSceneManifest, and AppDelegate does not implement application\(\_:configurationForConnecting:options:\). Built with the iOS 27 SDK, the app stops at launch: "UIScene life cycle is required for apps built with this SDK".

**Fix: Adopt a scene delegate** ([guide](https://github.com/muhittincamdali/sdkbump/blob/main/docs/guides/native-ios.md))

1. Add a SceneDelegate class \(UIResponder, UIWindowSceneDelegate\) that creates the window in scene\(\_:willConnectTo:options:\).
2. Add UIApplicationSceneManifest to Info.plist with a UIWindowSceneSessionRoleApplication configuration whose UISceneDelegateClassName is $\(PRODUCT\_MODULE\_NAME\).SceneDelegate, or implement application\(\_:configurationForConnecting:options:\).
3. Move the app delegate methods sdkbump lists under SCN003 to the scene delegate.

Sources: [Apple: Transitioning to the UIKit scene-based life cycle](https://developer.apple.com/documentation/uikit/transitioning-to-the-uikit-scene-based-life-cycle), [Apple: application\(\_:configurationForConnecting:options:\)](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/application(_:configurationforconnecting:options:))

### SCN002: Window created in the app delegate

`Shelf/AppDelegate.swift:12`: AppDelegate creates the window with UIWindow\(frame:\). With a scene, UIKit does not show a window that belongs to no scene, and the app opens to a black screen.

**Fix: Create the window in the scene delegate** ([guide](https://github.com/muhittincamdali/sdkbump/blob/main/docs/guides/native-ios.md))

1. In scene\(\_:willConnectTo:options:\), create the window with UIWindow\(windowScene:\), set its root view controller and call makeKeyAndVisible\(\).
2. Remove the window creation from application\(\_:didFinishLaunchingWithOptions:\).

Sources: [Apple: Transitioning to the UIKit scene-based life cycle \(Configure your window scene\)](https://developer.apple.com/documentation/uikit/transitioning-to-the-uikit-scene-based-life-cycle)

### SCN003: launchOptions\[.url\] is empty with scenes

`Shelf/AppDelegate.swift:18`: UIKit does not put this key in the launch options once the app uses scenes. Use connectionOptions.urlContexts in scene\(\_:willConnectTo:options:\).

**Fix: Move it to the scene delegate** ([guide](https://github.com/muhittincamdali/sdkbump/blob/main/docs/guides/native-ios.md))

1. Implement the scene delegate method named in the finding and move the code there.

Sources: [Apple: UIApplication.LaunchOptionsKey.url \(deprecated in iOS 26\)](https://developer.apple.com/documentation/uikit/uiapplication/launchoptionskey/url)

### SCN003: launchOptions\[.shortcutItem\] is empty with scenes

`Shelf/AppDelegate.swift:21`: UIKit does not put this key in the launch options once the app uses scenes. Use connectionOptions.shortcutItem in scene\(\_:willConnectTo:options:\).

**Fix: Move it to the scene delegate** (steps above)

Sources: [Apple: UIApplication.LaunchOptionsKey.shortcutItem \(deprecated in iOS 26\)](https://developer.apple.com/documentation/uikit/uiapplication/launchoptionskey/shortcutitem)

### SCN003: application\(\_:open:options:\) is not called with scenes

`Shelf/AppDelegate.swift:29`: UIKit does not call this method once the app uses scenes. Use scene\(\_:openURLContexts:\), and connectionOptions.urlContexts in scene\(\_:willConnectTo:options:\) for a link that launches the app.

**Fix: Move it to the scene delegate** (steps above)

Sources: [Apple: application\(\_:open:options:\) \(deprecated in iOS 26\)](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/application(_:open:options:))

### SCN003: application\(\_:continue:restorationHandler:\) is not called with scenes

`Shelf/AppDelegate.swift:38`: UIKit does not call this method once the app uses scenes. Use scene\(\_:continue:\), and connectionOptions.userActivities in scene\(\_:willConnectTo:options:\).

**Fix: Move it to the scene delegate** (steps above)

Sources: [Apple: application\(\_:continue:restorationHandler:\) \(deprecated in iOS 26\)](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/application(_:continue:restorationhandler:))

### SCN003: application\(\_:performActionFor:completionHandler:\) is not called with scenes

`Shelf/AppDelegate.swift:48`: UIKit does not call this method once the app uses scenes. Use windowScene\(\_:performActionFor:completionHandler:\), and connectionOptions.shortcutItem in scene\(\_:willConnectTo:options:\).

**Fix: Move it to the scene delegate** (steps above)

Sources: [Apple: application\(\_:performActionFor:completionHandler:\) \(not called for scene-based apps\)](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/application(_:performactionfor:completionhandler:))

### SCN003: applicationDidBecomeActive\(\_:\) is not called with scenes

`Shelf/AppDelegate.swift:56`: UIKit does not call this method once the app uses scenes. Use sceneDidBecomeActive\(\_:\), or UIApplication.didBecomeActiveNotification for the whole app.

**Fix: Move it to the scene delegate** (steps above)

Sources: [Apple: applicationDidBecomeActive\(\_:\)](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/applicationdidbecomeactive(_:))

### SCN003: applicationDidEnterBackground\(\_:\) is not called with scenes

`Shelf/AppDelegate.swift:60`: UIKit does not call this method once the app uses scenes. Use sceneDidEnterBackground\(\_:\), or UIApplication.didEnterBackgroundNotification for the whole app.

**Fix: Move it to the scene delegate** (steps above)

Sources: [Apple: applicationDidEnterBackground\(\_:\)](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/applicationdidenterbackground(_:))

### SCN004: Window looked up through keyWindow

`Shelf/Router.swift:35`: keyWindow returns a key window across all connected scenes \(deprecated in iOS 13\).

**Fix: Find the window through the scene** ([guide](https://github.com/muhittincamdali/sdkbump/blob/main/docs/guides/native-ios.md))

1. From a view or view controller, use view.window or view.window?.windowScene.
2. Elsewhere, pick the foreground UIWindowScene from UIApplication.shared.connectedScenes and use its keyWindow or windows.

Sources: [Apple: UIApplication.keyWindow](https://developer.apple.com/documentation/uikit/uiapplication/keywindow)

### SCN004: Window looked up through UIApplication.windows

`Shelf/Router.swift:36`: windows lists the windows of every scene \(deprecated in iOS 15\); use the windows of the relevant UIWindowScene.

**Fix: Find the window through the scene** (steps above)

Sources: [Apple: UIApplication.windows](https://developer.apple.com/documentation/uikit/uiapplication/windows)

</details>

2 errors, 9 warnings. Guide: [native iOS](https://github.com/muhittincamdali/sdkbump/blob/main/docs/guides/native-ios.md).

<sub>[sdkbump](https://github.com/muhittincamdali/sdkbump) 0.1.1, rules ios27@2026.10.15 (iOS 27.0 SDK \(Xcode 27.0, 27A266a\)). Static checks; they do not build or run the app.</sub>
