# Changelog

All notable changes to sdkbump are listed here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). The rule data in `rules/` has its own
`dataVersion` (the date of its last change), shown in every report.

## [Unreleased]

## [0.1.0] - 2026-10-15

### Added

- `sdkbump [path]` detects native iOS, Flutter (app and plugin example), React Native and Expo
  projects, reads every iOS app target from project.pbxproj with the Info.plist it names (XML or
  binary) and the app's Swift and Objective-C sources, and reports:
  - SCN001 (error): no scene configuration, so the app stops at launch when built with the iOS 27
    SDK; for Expo without `ios/`, checked from the SDK version and `ios.enableSceneSupport`;
  - SCN002 (error): the app delegate creates the window, which no scene shows;
  - SCN003 (warning): 13 app delegate methods and launch option keys UIKit no longer uses with
    scenes, unless the scene delegate already handles them;
  - SCN004 (warning): window lookups through `keyWindow`, `windows` or the app delegate's window.

  The rule IDs differ from the first plan for this release, where SCN002 stood for "no
  `application(_:configurationForConnecting:options:)`". That case is part of SCN001: a scene
  configuration in the Info.plist or from that method is enough to launch, and the app stops only
  when both are missing (rows A and C of
  [examples/launch-matrix](examples/launch-matrix/README.md)). SCN002 became the window created in
  the app delegate, the black screen in rows E, G and H, and SCN003 the app delegate methods and
  launch option keys.
- A fix for each finding by ecosystem and version: native and SwiftUI, Flutter (automatic
  migration only when Flutter's own conditions hold), React Native 0.88 or a hand-written scene
  delegate, Expo SDK 57's opt-in or SDK 58, with alternatives and guides.
- react-native-uiscene-bridge and react-native-xcode27 are recognised; the findings they handle
  at run time are shown as handled, with their limits, and do not fail the run.
- Rule data `ios27@2026.10.15` in `rules/ios27.json` with a source for every rule, hook, window
  lookup, fix and workaround, validated with zod, and its JSON schema.
- Terminal, Markdown and JSON reports (`schemaVersion` 0), `--output`, `--fail-on` with exit codes
  0, 1 and 2, and colour only in a terminal.
- Programmatic API: `scan`, `render` and the readers and checks behind them.
- Ten fixtures (native UIKit before and after migration, SwiftUI, Flutter with a custom
  AppDelegate, Expo SDK 57 with and without its scene opt-in, React Native 0.87 with and without
  the bridge, React Native 0.88 and Expo 58 templates) with expected findings and recorded reports.
- Guides, an API reference site, terminal demos from the CLI, and recordings of the native
  fixtures and a nine-app launch matrix in the iOS 27.0 simulator (Xcode 27.0).

[Unreleased]: https://github.com/muhittincamdali/sdkbump/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/muhittincamdali/sdkbump/releases/tag/v0.1.0
