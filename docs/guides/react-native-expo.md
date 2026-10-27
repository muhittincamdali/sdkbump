# React Native before 0.88 and Expo before SDK 58

Built with Xcode 27, React Native apps from before 0.88 and Expo apps from before SDK 58 stop at
launch: their templates create the window in the app delegate and declare no scene. React Native
0.88 and Expo SDK 58 are released and adopt the scene life cycle. This page lists the ways out as
of 27 October 2026, with what each one costs. sdkbump picks one as the fix for your project and
lists the others as alternatives.

## Where things stand

| Project                         | Scene support                                                                                                                        | Source                                                                                                                                                                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React Native 0.87.1 and earlier | none; the React Native team will not backport 0.88's change                                                                          | [react/react-native#58545](https://github.com/react/react-native/issues/58545) (closed on 16 October 2026)                                                                                                                       |
| React Native 0.88               | released (0.88.0); the template has a `SceneDelegate` and a scene manifest; one scene                                                | [React Native 0.88 release post](https://reactnative.dev/blog/2026/10/19/react-native-0.88), `@react-native-community/template` 0.88.0 ([fixtures/rn-088](https://github.com/muhittincamdali/sdkbump/tree/main/fixtures/rn-088)) |
| Expo SDK 56 and earlier         | none                                                                                                                                 | [expo/expo#46664](https://github.com/expo/expo/issues/46664#issuecomment-5683396867)                                                                                                                                             |
| Expo SDK 57                     | opt-in from expo 57.0.23 with expo-build-properties 57.0.20: `ios.enableSceneSupport`                                                | [expo/expo#46664](https://github.com/expo/expo/issues/46664#issuecomment-5683396867), [BuildProperties](https://docs.expo.dev/versions/v57.0.0/sdk/build-properties/)                                                            |
| Expo SDK 58                     | released, built for iOS 27 with React Native 0.88; on by default; the template's `SceneDelegate` derives from `ExpoAppSceneDelegate` | [Expo SDK 58 changelog](https://expo.dev/changelog/sdk-58), `expo-template-bare-minimum` 58.0.18 ([fixtures/expo-58](https://github.com/muhittincamdali/sdkbump/tree/main/fixtures/expo-58))                                     |

sdkbump reads the versions from `node_modules`, then `package-lock.json`, then the lowest version
the range in package.json allows, and says which it used.

## Expo SDK 57: turn scene support on

1. `npx expo install expo expo-build-properties` (expo 57.0.23 or later, expo-build-properties
   57.0.20 or later).
2. In app.json:

   ```json
   {
     "expo": {
       "plugins": [["expo-build-properties", { "ios": { "enableSceneSupport": true } }]]
     }
   }
   ```

3. `npx expo prebuild --clean -p ios`, then build.

`ExpoAppSceneDelegate` then creates the window and passes links, user activities and quick actions
on to your `AppDelegate`, so the template's `application(_:open:options:)` and
`application(_:continue:restorationHandler:)` overrides keep working; that is why sdkbump does not
report SCN003 for an app whose scene delegate derives from it or whose Info.plist names it
(SDK 57's opt-in writes `EXExpoAppSceneDelegate` into Info.plist and adds no class of its own).

Expo's announcement warned that a config plugin which edits `AppDelegate` could make prebuild fail
with the option on; the issue for that ([expo/expo#50210](https://github.com/expo/expo/issues/50210))
was closed as completed on 16 September 2026. If prebuild fails, update the plugins that touch
`AppDelegate` first.

## Expo SDK 58

SDK 58 uses the scene life cycle by default: `npx expo prebuild` writes `SceneDelegate.swift` and
the scene manifest, and Expo forwards URL, user activity, Handoff, life cycle and quick action
events to your `ExpoAppDelegate` overrides and subscribers. If you customize `AppDelegate.swift`,
keep the `ios/` folder by hand or have a bare React Native app with Expo modules, follow Expo's
[scene life cycle guide](https://expo.fyi/ios-scene-lifecycle). With the iOS 27 SDK the app can be
resized: `requireFullScreen` no longer opts it out, and `ScreenOrientation.lockAsync` may have no
effect while the app is resizable ([SDK 58 changelog](https://expo.dev/changelog/sdk-58)).

Without an `ios/` folder (continuous native generation), sdkbump checks the Expo configuration
instead: the expo and expo-build-properties versions and the `enableSceneSupport` option in
app.json. It does not run `app.config.js` or `app.config.ts`; with one of those it warns and asks
you to check the option yourself.

## React Native 0.87 and earlier

- **Upgrade to 0.88.** It adds scene support without breaking the `AppDelegate` path, and the
  [release post](https://reactnative.dev/blog/2026/10/19/react-native-0.88) lists the migration:
  move the React Native entry point from `AppDelegate` to a `SceneDelegate`
  (`RCTReactNativeFactory` gains `startReactNativeWithModuleName:inWindow:connectionOptions:` and
  `startReactNativeWithModuleName:inWindow:initialProperties:connectionOptions:`), forward the
  scene's URL and user-activity callbacks to `RCTLinkingManager`
  (`RCTLinkingManager.scene(_:openURLContexts:)` and `RCTLinkingManager.scene(_:continue:)`), and
  add `UIApplicationSceneManifest` to Info.plist. The community template and the upgrade helper
  show the change in `SceneDelegate.swift` and `Info.plist`. Support is limited to one scene, so
  keep `UIApplicationSupportsMultipleScenes` set to `false`; at launch only the first URL context
  or user activity is forwarded. The window can be resized, and `Dimensions.get()` and
  `useWindowDimensions()` update with it.
- **Write the scene delegate yourself.** Port the 0.88 template's `SceneDelegate` and Info.plist
  entry. Before 0.88, `startReactNative` takes launch options, not connection options, so a link
  that launches the app has to be converted; the comments on
  [#58545](https://github.com/react/react-native/issues/58545) show how people did it. The
  maintainers closed that issue without a backport because deep links have to go through the scene
  delegate and `Dimensions` has to follow a resizable window; a hand-written port has to handle
  both.

## The workaround packages

Two packages make an app without scenes launch, without code changes. They were published before
React Native 0.88 and Expo SDK 58 were released, and sdkbump no longer suggests them (it did up to
0.1.3). When one is installed, sdkbump marks the findings it handles as handled, with the
package's own limits, and still names the real fix.

| Package                                                                                                                               | What it does                                                                                                                                                                                      | Limits stated in its README                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [react-native-uiscene-bridge](https://github.com/Atomics-hub/react-native-uiscene-bridge) 0.1.0 (28 September 2026, its only release) | Adds a scene configuration at run time, moves the app delegate's window into the scene, and passes links, user activities, quick actions and foreground and background events to the app delegate | simulator only, not tested on a device; one window; universal links, Handoff and quick actions not tested; iOS only |
| [react-native-xcode27](https://github.com/Atomics-hub/react-native-xcode27) 0.2.0 (5 October 2026)                                    | The same launch fix, plus build fixes for pod deployment targets below 15.0 and the `fmt` pod                                                                                                     | simulator only; one window; CocoaPods only; use it or react-native-uiscene-bridge, not both                         |

The [rn-087-bridge](https://github.com/muhittincamdali/sdkbump/tree/main/fixtures/rn-087-bridge) fixture shows how sdkbump reports an app with
the bridge installed. sdkbump has not run either package itself; what they do is from their
READMEs.

## Related tools

- [auditor-uiscene](https://github.com/Anzell/auditor-uiscene) is a shell script that audits
  Flutter projects, plugins included, for the same migration.
- [flutter_spm_doctor](https://pub.dev/packages/flutter_spm_doctor) checks Flutter plugins,
  UIScene support among three checks.
- [TJSceneDelegate](https://github.com/timonus/TJSceneDelegate) is a library that helps a native
  app move to scenes.
