## sdkbump: RN087App (React Native)

**Launches through react-native-uiscene-bridge, a run-time workaround; the app itself does not adopt scenes.**

- Target `RN087App`: app delegate life cycle (`ios/RN087App/Info.plist`)
- `react-native` 0.87.1 (declared)
- `react-native-uiscene-bridge` 0.1.0 (declared)

| Rule | Severity | Where | Finding |
| --- | --- | --- | --- |
| SCN001 | error (handled by react-native-uiscene-bridge) | `ios/RN087App/Info.plist` | No scene configuration |
| SCN002 | error (handled by react-native-uiscene-bridge) | `ios/RN087App/AppDelegate.swift:24` | Window created in the app delegate |

<details><summary>What each finding means and how to fix it</summary>

### SCN001: No scene configuration

`ios/RN087App/Info.plist`: Info.plist has no UIApplicationSceneManifest, and AppDelegate does not implement application\(\_:configurationForConnecting:options:\). Built with the iOS 27 SDK, the app stops at launch: "UIScene life cycle is required for apps built with this SDK".

Handled at run time by `react-native-uiscene-bridge` 0.1.0. Adds a scene configuration at run time, moves the app delegate's window into the scene and passes links, user activities, quick actions and foreground and background events back to the app delegate. Limits: Tested in the simulator only, not on a device \(its README\). One window: iPad multiwindow needs real scene support. Universal links, Handoff and quick actions were not tested \(its README\). iOS only: Mac Catalyst is untested; tvOS and visionOS are not supported.

**Fix: Upgrade to React Native 0.88** ([guide](https://github.com/muhittincamdali/sdkbump/blob/main/docs/guides/react-native-expo.md))

1. React Native 0.88 moves the window and React Native start-up to a SceneDelegate and adds the scene manifest. On 15 October 2026 it is a release candidate \(0.88.0-rc.6 on npm's next tag\); 0.87.1 and earlier have no scene support.
2. Compare ios/ with the 0.88 template \(AppDelegate.swift, SceneDelegate.swift, Info.plist\) when you upgrade.

**Or: Add a SceneDelegate by hand** ([guide](https://github.com/muhittincamdali/sdkbump/blob/main/docs/guides/react-native-expo.md))

1. Port the 0.88 template's SceneDelegate and Info.plist manifest to your version: create the window from the UIWindowScene and start React Native into it there.
2. Before 0.88, startReactNative takes launch options, not connection options, so convert the connection options of a link that launches the app.

Sources: [Apple: Transitioning to the UIKit scene-based life cycle](https://developer.apple.com/documentation/uikit/transitioning-to-the-uikit-scene-based-life-cycle), [Apple: application\(\_:configurationForConnecting:options:\)](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/application(_:configurationforconnecting:options:))

### SCN002: Window created in the app delegate

`ios/RN087App/AppDelegate.swift:24`: AppDelegate creates the window with UIWindow\(frame:\). With a scene, UIKit does not show a window that belongs to no scene, and the app opens to a black screen.

Handled at run time by `react-native-uiscene-bridge` 0.1.0. Adds a scene configuration at run time, moves the app delegate's window into the scene and passes links, user activities, quick actions and foreground and background events back to the app delegate. Limits: Tested in the simulator only, not on a device \(its README\). One window: iPad multiwindow needs real scene support. Universal links, Handoff and quick actions were not tested \(its README\). iOS only: Mac Catalyst is untested; tvOS and visionOS are not supported.

**Fix: Upgrade to React Native 0.88** (steps above)

**Or: Add a SceneDelegate by hand** (steps above)

Sources: [Apple: Transitioning to the UIKit scene-based life cycle \(Configure your window scene\)](https://developer.apple.com/documentation/uikit/transitioning-to-the-uikit-scene-based-life-cycle)

</details>

0 errors, 0 warnings, 2 handled by a workaround. Guide: [React Native](https://github.com/muhittincamdali/sdkbump/blob/main/docs/guides/react-native-expo.md).

<sub>[sdkbump](https://github.com/muhittincamdali/sdkbump) 0.1.2, rules ios27@2026.10.15 (iOS 27.0 SDK \(Xcode 27.0, 27A266a\)). Static checks; they do not build or run the app.</sub>
