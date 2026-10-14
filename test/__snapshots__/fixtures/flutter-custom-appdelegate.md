## sdkbump: flutter\_custom (Flutter)

**Fails to launch when built with the iOS 27 SDK.**

- Target `Runner`: app delegate life cycle (`ios/Runner/Info.plist`)
- `flutter` unknown (not pinned)

| Rule | Severity | Where | Finding |
| --- | --- | --- | --- |
| SCN001 | error | `ios/Runner/Info.plist` | No scene configuration |
| SCN003 | warning | `ios/Runner/AppDelegate.swift:28` | application\(\_:open:options:\) is not called with scenes |
| SCN004 | warning | `ios/Runner/AppDelegate.swift:10` | Root view controller read from the app delegate's window |
| SCN004 | warning | `ios/Runner/AppDelegate.swift:34` | Root view controller read from the app delegate's window |

<details><summary>What each finding means and how to fix it</summary>

### SCN001: No scene configuration

`ios/Runner/Info.plist`: Info.plist has no UIApplicationSceneManifest, and AppDelegate does not implement application\(\_:configurationForConnecting:options:\). Built with the iOS 27 SDK, the app stops at launch: "UIScene life cycle is required for apps built with this SDK". Flutter will not migrate it automatically: ios/Runner/AppDelegate.swift differs from the templates Flutter migrates.

**Fix: Migrate the Flutter app by hand** ([guide](https://github.com/muhittincamdali/sdkbump/blob/main/docs/guides/flutter.md))

1. Conform AppDelegate to FlutterImplicitEngineDelegate and move GeneratedPluginRegistrant.register, method channels and platform views into didInitializeImplicitFlutterEngine\(\_:\).
2. Add UIApplicationSceneManifest to ios/Runner/Info.plist with a configuration whose UISceneDelegateClassName is FlutterSceneDelegate and UISceneStoryboardFile is Main.

Sources: [Apple: Transitioning to the UIKit scene-based life cycle](https://developer.apple.com/documentation/uikit/transitioning-to-the-uikit-scene-based-life-cycle), [Apple: application\(\_:configurationForConnecting:options:\)](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/application(_:configurationforconnecting:options:))

### SCN003: application\(\_:open:options:\) is not called with scenes

`ios/Runner/AppDelegate.swift:28`: UIKit does not call this method once the app uses scenes. Use scene\(\_:openURLContexts:\), and connectionOptions.urlContexts in scene\(\_:willConnectTo:options:\) for a link that launches the app.

**Fix: Handle it in a FlutterSceneDelegate subclass** ([guide](https://github.com/muhittincamdali/sdkbump/blob/main/docs/guides/flutter.md))

1. Create SceneDelegate: FlutterSceneDelegate, name it in UISceneDelegateClassName, and override the scene delegate method named in the finding, calling super so plugins still receive the event.

Sources: [Apple: application\(\_:open:options:\) \(deprecated in iOS 26\)](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/application(_:open:options:))

### SCN004: Root view controller read from the app delegate's window

`ios/Runner/AppDelegate.swift:10`: UIKit does not set the app delegate's window once a scene owns the window, and application\(\_:didFinishLaunchingWithOptions:\) runs before any scene connects; reading its root view controller finds nil, and a forced cast of it crashes.

**Fix: Create channels from the engine bridge** ([guide](https://github.com/muhittincamdali/sdkbump/blob/main/docs/guides/flutter.md))

1. Create method channels in didInitializeImplicitFlutterEngine\(\_:\) with engineBridge.applicationRegistrar.messenger\(\) instead of reading window?.rootViewController.

Sources: [Flutter: UIScene adoption \(Bespoke FlutterViewController usage\)](https://docs.flutter.dev/release/breaking-changes/uiscenedelegate)

### SCN004: Root view controller read from the app delegate's window

`ios/Runner/AppDelegate.swift:34`: UIKit does not set the app delegate's window once a scene owns the window, and application\(\_:didFinishLaunchingWithOptions:\) runs before any scene connects; reading its root view controller finds nil, and a forced cast of it crashes.

**Fix: Create channels from the engine bridge** (steps above)

Sources: [Flutter: UIScene adoption \(Bespoke FlutterViewController usage\)](https://docs.flutter.dev/release/breaking-changes/uiscenedelegate)

</details>

1 error, 3 warnings. Guide: [Flutter](https://github.com/muhittincamdali/sdkbump/blob/main/docs/guides/flutter.md).

<sub>[sdkbump](https://github.com/muhittincamdali/sdkbump) 0.1.0, rules ios27@2026.10.15 (iOS 27.0 SDK \(Xcode 27.0, 27A266a\)). Static checks; they do not build or run the app.</sub>
