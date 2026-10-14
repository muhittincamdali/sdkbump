# Flutter: a custom AppDelegate and plugins

Flutter apps that have not adopted UIScene stop at launch when built with Xcode 27 (iOS 27 SDK),
as Flutter's [UIScene adoption](https://docs.flutter.dev/release/breaking-changes/uiscenedelegate)
page says. Flutter 3.41 and later migrate many apps by themselves; sdkbump tells you whether yours
is one of them, and what to change when it is not.

## Will `flutter build ios` migrate it?

Flutter's migrator
([uiscene_migration.dart](https://github.com/flutter/flutter/blob/3.41.5/packages/flutter_tools/lib/src/migrations/uiscene_migration.dart),
the same in 3.41.5, 3.44.9 and 3.47.5) rewrites the app only when all of these hold:

- `ios/Runner/Info.plist` has no `UIApplicationSceneManifest` yet;
- `UIMainStoryboardFile` in that Info.plist is `Main`;
- `ios/Runner/AppDelegate.swift` is, apart from surrounding whitespace, one of the five
  templates the migrator lists (or `AppDelegate.h` and `AppDelegate.m` are the Objective-C
  template);
- the migration is not turned off with `enable-uiscene-migration: false` in pubspec.yaml.

sdkbump checks the same conditions. It compares the SHA-256 of your trimmed AppDelegate with the
hashes of those templates, kept in [rules/ios27.json](../../rules/ios27.json), and when one
condition fails it names it in the SCN001 message. Then:

- **All hold:** upgrade to Flutter 3.41 or later and run `flutter build ios`. It prints
  "Finished migration to UIScene lifecycle".
- **Any fails:** migrate by hand, below. The
  [flutter-custom-appdelegate](https://github.com/muhittincamdali/sdkbump/tree/main/fixtures/flutter-custom-appdelegate) fixture is this case: a
  Flutter 3.24 app whose AppDelegate creates a method channel.

## Migrate by hand

1. Register plugins, method channels and platform views when the implicit engine starts, not in
   `application(_:didFinishLaunchingWithOptions:)`:

   ```swift
   @main
   @objc class AppDelegate: FlutterAppDelegate, FlutterImplicitEngineDelegate {
     override func application(
       _ application: UIApplication,
       didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
     ) -> Bool {
       return super.application(application, didFinishLaunchingWithOptions: launchOptions)
     }

     func didInitializeImplicitFlutterEngine(_ engineBridge: FlutterImplicitEngineBridge) {
       GeneratedPluginRegistrant.register(with: engineBridge.pluginRegistry)
       let battery = FlutterMethodChannel(
         name: "samples.flutter.dev/battery",
         binaryMessenger: engineBridge.applicationRegistrar.messenger())
       battery.setMethodCallHandler { call, result in /* … */ }
     }
   }
   ```

2. Add the scene manifest to `ios/Runner/Info.plist`, with `FlutterSceneDelegate` and the `Main`
   storyboard:

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
           <key>UISceneClassName</key>
           <string>UIWindowScene</string>
           <key>UISceneDelegateClassName</key>
           <string>FlutterSceneDelegate</string>
           <key>UISceneConfigurationName</key>
           <string>flutter</string>
           <key>UISceneStoryboardFile</key>
           <string>Main</string>
         </dict>
       </array>
     </dict>
   </dict>
   ```

Both steps are from Flutter's UIScene adoption page, which also covers add-to-app and apps with
several scenes.

## SCN004: `window?.rootViewController as! FlutterViewController`

This line, from the platform channel example many apps copied, is a common reason a customised
AppDelegate is not migrated automatically. Under scenes, `application(_:didFinishLaunchingWithOptions:)` runs before any scene
connects and UIKit does not set the app delegate's window, so the forced cast finds nothing.
Create the channel in `didInitializeImplicitFlutterEngine(_:)` with
`engineBridge.applicationRegistrar.messenger()`, as in step 1.

## SCN003: links and other app delegate overrides

Overrides such as `application(_:open:options:)` in your `FlutterAppDelegate` subclass are app
delegate methods UIKit stops calling. Subclass `FlutterSceneDelegate`, name your subclass in
`UISceneDelegateClassName`, override the scene method (`scene(_:openURLContexts:)` for links) and
call `super`, so plugins still receive the event.

## Plugins

Plugins that rely on app delegate callbacks need the plugin API changes described on the same
Flutter page. sdkbump 0.1 checks the app's own `ios/` folder; checking each plugin's iOS sources
and naming the plugin a finding comes from is planned for 0.2.
