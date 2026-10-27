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

Handled at run time by `react-native-uiscene-bridge` 0.1.0. Adds a scene configuration at run time, moves the app delegate's window into the scene and passes links, user activities, quick actions and foreground and background events back to the app delegate. Limits: One release, 0.1.0 of 28 September 2026, from before React Native 0.88 shipped scene support \(npm\). Tested in the simulator only, not on a device \(its README\). One window: iPad multiwindow needs real scene support. Universal links, Handoff and quick actions were not tested \(its README\). iOS only: Mac Catalyst is untested; tvOS and visionOS are not supported.

**Fix: Upgrade to React Native 0.88** ([guide](https://github.com/muhittincamdali/sdkbump/blob/main/docs/guides/react-native-expo.md))

1. React Native 0.88 is stable \(0.88.0 on npm since 15 October 2026; release post of 19 October 2026\) and supports the UIScene life cycle without breaking the AppDelegate path. 0.87.1 and earlier have no scene support, and the React Native team will not backport it.
2. Move the React Native entry point from AppDelegate to a SceneDelegate \(RCTReactNativeFactory's new startReactNativeWithModuleName:inWindow:connectionOptions:\), forward the scene's URL and user-activity callbacks to RCTLinkingManager, and add UIApplicationSceneManifest to Info.plist. The 0.88 template and the upgrade helper show the change in SceneDelegate.swift and Info.plist.
3. Keep UIApplicationSupportsMultipleScenes false: 0.88 supports one scene, and at launch it forwards only the first URL context or user activity. The window can be resized; Dimensions.get\(\) and useWindowDimensions\(\) follow it.

**Or: Add a SceneDelegate by hand** ([guide](https://github.com/muhittincamdali/sdkbump/blob/main/docs/guides/react-native-expo.md))

1. Port the 0.88 template's SceneDelegate and Info.plist manifest to your version: create the window from the UIWindowScene and start React Native into it there.
2. Before 0.88, startReactNative takes launch options, not connection options, so convert the connection options of a link that launches the app.
3. The React Native team gives deep links through the scene delegate and Dimensions for a resizable window as the reasons it does not backport 0.88's change; check both in your port.

Sources: [Apple: Transitioning to the UIKit scene-based life cycle](https://developer.apple.com/documentation/uikit/transitioning-to-the-uikit-scene-based-life-cycle), [Apple: application\(\_:configurationForConnecting:options:\)](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/application(_:configurationforconnecting:options:))

### SCN002: Window created in the app delegate

`ios/RN087App/AppDelegate.swift:24`: AppDelegate creates the window with UIWindow\(frame:\). With a scene, UIKit does not show a window that belongs to no scene, and the app opens to a black screen.

Handled at run time by `react-native-uiscene-bridge` 0.1.0. Adds a scene configuration at run time, moves the app delegate's window into the scene and passes links, user activities, quick actions and foreground and background events back to the app delegate. Limits: One release, 0.1.0 of 28 September 2026, from before React Native 0.88 shipped scene support \(npm\). Tested in the simulator only, not on a device \(its README\). One window: iPad multiwindow needs real scene support. Universal links, Handoff and quick actions were not tested \(its README\). iOS only: Mac Catalyst is untested; tvOS and visionOS are not supported.

**Fix: Upgrade to React Native 0.88** (steps above)

**Or: Add a SceneDelegate by hand** (steps above)

Sources: [Apple: Transitioning to the UIKit scene-based life cycle \(Configure your window scene\)](https://developer.apple.com/documentation/uikit/transitioning-to-the-uikit-scene-based-life-cycle)

</details>

0 errors, 0 warnings, 2 handled by a workaround. Guide: [React Native](https://github.com/muhittincamdali/sdkbump/blob/main/docs/guides/react-native-expo.md).

<sub>[sdkbump](https://github.com/muhittincamdali/sdkbump) 0.1.4, rules ios27@2026.10.27 (iOS 27.0 SDK \(Xcode 27.0, 27A266a\)). Static checks; they do not build or run the app.</sub>
