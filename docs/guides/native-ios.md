# Native UIKit and SwiftUI apps

How to clear each sdkbump finding in an app you build with Xcode yourself. The
[native-uikit](https://github.com/muhittincamdali/sdkbump/tree/main/fixtures/native-uikit) and
[native-uikit-scenes](https://github.com/muhittincamdali/sdkbump/tree/main/fixtures/native-uikit-scenes) fixtures are the same app before and
after these steps; compare them file by file.

## SCN001: adopt a scene delegate

1. Add a scene delegate. If the window was made in code, make it here instead (this also clears
   SCN002):

   ```swift
   import UIKit

   final class SceneDelegate: UIResponder, UIWindowSceneDelegate {
     var window: UIWindow?

     func scene(
       _ scene: UIScene,
       willConnectTo session: UISceneSession,
       options connectionOptions: UIScene.ConnectionOptions
     ) {
       guard let windowScene = scene as? UIWindowScene else { return }
       let window = UIWindow(windowScene: windowScene)
       window.rootViewController = RootViewController()
       window.makeKeyAndVisible()
       self.window = window
     }
   }
   ```

2. Declare it in Info.plist (Xcode: target › General › Deployment Info › Scene manifest, or by
   hand):

   ```xml
   <key>UIApplicationSceneManifest</key>
   <dict>
     <key>UIApplicationSupportsMultipleScenes</key>
     <false/>
     <key>UISceneConfigurations</key>
     <dict>
       <key>UIWindowSceneSessionRoleApplication</key>
       <array>
         <dict>
           <key>UISceneConfigurationName</key>
           <string>Default Configuration</string>
           <key>UISceneDelegateClassName</key>
           <string>$(PRODUCT_MODULE_NAME).SceneDelegate</string>
         </dict>
       </array>
     </dict>
   </dict>
   ```

   With a main storyboard, add `UISceneStoryboardFile` (for example `Main`) to the configuration
   and UIKit makes the window from it. Instead of the Info.plist entry you can implement
   `application(_:configurationForConnecting:options:)` in the app delegate and return a
   `UISceneConfiguration` whose `delegateClass` is `SceneDelegate.self`.

3. Leave the app delegate with process-level work only: third-party SDK setup, push
   registration, background tasks.

`INFOPLIST_KEY_UIApplicationSceneManifest_Generation = YES` alone is not enough for a UIKit app:
Xcode then writes a manifest with an empty `UISceneConfigurations`, and UIKit stops the app at
launch just as without one (row I of the [launch matrix](https://github.com/muhittincamdali/sdkbump/tree/main/examples/launch-matrix)).

## SCN002: the window belongs to the scene

`UIWindow(frame:)` in the app delegate gives a window no scene shows. Create it with
`UIWindow(windowScene:)` in `scene(_:willConnectTo:options:)` as above, and delete the window code
from `application(_:didFinishLaunchingWithOptions:)`.

## SCN003: move what UIKit stops calling

Once the app has a scene, UIKit calls the scene delegate for these, and stops calling the app
delegate even if the method is still there. A link or quick action that launches the app arrives
in `connectionOptions` of `scene(_:willConnectTo:options:)`, not in `launchOptions`.

| App delegate                                                  | Scene delegate                                                                                   | SwiftUI                   |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------- |
| `application(_:open:options:)`                                | `scene(_:openURLContexts:)`                                                                      | `.onOpenURL`              |
| `application(_:continue:restorationHandler:)`                 | `scene(_:continue:)`                                                                             | `.onContinueUserActivity` |
| `application(_:willContinueUserActivityWithType:)`            | `scene(_:willContinueUserActivityWithType:)`                                                     |                           |
| `application(_:didFailToContinueUserActivityWithType:error:)` | `scene(_:didFailToContinueUserActivityWithType:error:)`                                          |                           |
| `application(_:performActionFor:completionHandler:)`          | `windowScene(_:performActionFor:completionHandler:)`                                             |                           |
| `applicationDidBecomeActive(_:)`                              | `sceneDidBecomeActive(_:)`                                                                       | `scenePhase`              |
| `applicationWillResignActive(_:)`                             | `sceneWillResignActive(_:)`                                                                      | `scenePhase`              |
| `applicationDidEnterBackground(_:)`                           | `sceneDidEnterBackground(_:)`                                                                    | `scenePhase`              |
| `applicationWillEnterForeground(_:)`                          | `sceneWillEnterForeground(_:)`                                                                   | `scenePhase`              |
| `launchOptions[.url]`                                         | `connectionOptions.urlContexts`                                                                  | `.onOpenURL`              |
| `launchOptions[.userActivityDictionary]`                      | `connectionOptions.userActivities`                                                               | `.onContinueUserActivity` |
| `launchOptions[.shortcutItem]`                                | `connectionOptions.shortcutItem`                                                                 |                           |
| `launchOptions[.remoteNotification]`                          | `UNUserNotificationCenterDelegate` `userNotificationCenter(_:didReceive:withCompletionHandler:)` |                           |

Each row comes from Apple's documentation of the app delegate method or launch option key; sdkbump
links the page with every finding. For the whole app's state rather than one scene's, Apple
suggests the `UIApplication` notifications (`didBecomeActiveNotification` and the others), which
UIKit posts with or without scenes.

### SwiftUI apps

A SwiftUI `App` always runs on scenes, so it never trips SCN001. An app delegate attached with
`@UIApplicationDelegateAdaptor` still compiles with the methods above, but UIKit does not call
them. In the [native-swiftui](https://github.com/muhittincamdali/sdkbump/tree/main/fixtures/native-swiftui) fixture, the iOS 27 simulator moved
the app to the background and its `applicationDidEnterBackground(_:)` never ran. Use the SwiftUI
column instead:

```swift
WindowGroup {
  ContentView()
    .onOpenURL { url in router.open(url) }
}
.onChange(of: scenePhase) { _, phase in
  if phase == .background { store.save() }
}
```

## SCN004: find the window through the scene

`UIApplication.shared.keyWindow` returns a key window across every connected scene and
`UIApplication.shared.windows` lists all of them; both are deprecated. The app delegate's `window`
property is no longer set by UIKit. From a view or view controller, use `view.window` or
`view.window?.windowScene`. Outside the view hierarchy, pick the foreground scene:

```swift
let scene = UIApplication.shared.connectedScenes
  .compactMap { $0 as? UIWindowScene }
  .first { $0.activationState == .foregroundActive }
let presenter = scene?.keyWindow?.rootViewController
```

## Check again

Run sdkbump in the project folder again. It is not on npm yet, so run the release from GitHub as
in the README's [quick start](https://github.com/muhittincamdali/sdkbump#quick-start):

```sh
npx https://github.com/muhittincamdali/sdkbump/releases/download/v0.1.2/sdkbump-0.1.2.tgz
```

The native-uikit-scenes fixture reports no findings, and it launches in the iOS 27.0 simulator
(`scripts/simulator-check.sh native-uikit-scenes`). sdkbump does not build or launch your app;
building with Xcode 27 and opening the app once in the iOS 27 simulator is the final check.
