# Changelog

All notable changes to sdkbump are listed here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). The rule data in `rules/` has its own
`dataVersion` (the date of its last change), shown in every report.

## [Unreleased]

## [0.1.4] - 2026-10-27

### Changed

- Rule data `ios27@2026.10.27`. "Upgrade to React Native 0.88" said that 0.88 was a release
  candidate (0.88.0-rc.6 on npm's `next` tag). React Native 0.88.0 is released (npm `latest` since
  15 October 2026, release post on 19 October 2026), and the fix now gives the migration from that
  post: the React Native entry point in a `SceneDelegate`, the scene's URL and user-activity
  callbacks forwarded to `RCTLinkingManager`, `UIApplicationSceneManifest` in Info.plist, one scene
  (`UIApplicationSupportsMultipleScenes` false) and only the first URL context or user activity
  at launch. It cites the release post, and react/react-native#58545, which was closed without a
  backport to 0.87.
- "Add a SceneDelegate by hand" adds the two reasons the React Native maintainers give for not
  backporting (deep links through the scene delegate, `Dimensions` for a resizable window).
- "Upgrade Expo" and "Regenerate ios/" cite the Expo SDK 58 changelog (built for iOS 27, with
  React Native 0.88) and Expo's scene life cycle guide, and say that on iOS 27 `requireFullScreen`
  no longer stops the app from being resized.
- The rn-088-rc fixture is now rn-088, from the 0.88.0 template; its `ios/` folder is unchanged.
- The React Native and Expo guide and the READMEs describe the state of 27 October 2026.

### Removed

- The "Temporary: install react-native-uiscene-bridge" alternative for React Native and Expo apps
  without scenes. The package has one release (0.1.0, 28 September 2026, before React Native 0.88)
  that its README says was tested in the simulator only; React Native 0.88 and Expo SDK 58 now
  adopt scenes. When react-native-uiscene-bridge or react-native-xcode27 is installed, its findings
  are still shown as handled, with its limits.

## [0.1.3] - 2026-10-15

### Changed

- The package is published on npm as @mcamdali/sdkbump; the command is still sdkbump. Install it
  with `npm i -g @mcamdali/sdkbump` or run it with `npx @mcamdali/sdkbump`; an unscoped
  `npx sdkbump` does not run it. The GitHub release tarball keeps the name `sdkbump-<version>.tgz`,
  and the Homebrew formula is written from it instead of from the npm registry.

### Security

- Terminal: the verdict "Launch not determined: sdkbump could not read the Info.plist of
  `<target>`" (new in 0.1.2) was printed without replacing control characters, so a target name in
  project.pbxproj could send escape sequences (OSC 52 clipboard write, OSC 8 links, CSI, C1 CSI
  U+009B) to the terminal. The same verdict reached stderr in the `--output` message, and error
  messages that name the checked folder (for example "is a Flutter project without an iOS app")
  carried escape sequences in a folder name since 0.1.0. render() now replaces control
  characters in every string of the report once, before any format, and every message on stderr
  is cleaned the same way.
- JSON: DEL and C1 control characters (U+007F to U+009F) in file names, versions and target names
  were written raw, because `JSON.stringify` escapes only U+0000 to U+001F. They are now U+FFFD
  like in the other formats.
- Markdown: a URL or www address right after a letter or an underscore (`_https://…`) became a
  link; `#1`, `owner/repo#1` and `GH-1` became issue and pull request links; and a note starting
  with `- `, `1. `, `---` or four spaces opened a list, a rule or a code block. These are now
  plain text. The rendering was checked with GitHub's Markdown API.

## [0.1.2] - 2026-10-15

### Added

- A Limits section in the README and its translations: the rules are patterns over source text,
  only the app's own sources are read, build settings come only from project.pbxproj (no
  .xcconfig files, four expanded variables), there is no suppression file, and nothing is built or
  launched. The quick start explains the "Launch not determined" verdict.

### Changed

- collect/plist.ts and collect/sources.ts are split into smaller modules (plist-value, plist-xml,
  plist-binary, blank, regions, core/lines). The public API is the same.

### Fixed

- An app target whose Info.plist sdkbump could not read was reported as "Fails to launch" with an
  SCN001 error that described "the Info.plist Xcode generates", even with
  GENERATE_INFOPLIST_FILE = NO and a scene manifest in the real file. This happened when
  INFOPLIST_FILE is set in an .xcconfig file, uses a build setting sdkbump does not expand
  (`$(CUSTOM_DIR)/Info.plist`), names a missing file, or is a link to a file outside the project.
  Such a target now gets an SCN001 **info** finding, "Scene configuration not checked", and the
  verdict `unknown` ("Launch not determined"), which does not fail the run unless
  `--fail-on info`. A target that names no INFOPLIST_FILE and does not have Xcode generate one
  gets a note that the settings may come from an .xcconfig file.
- The reports name the Info.plist of each target: the files read, "Info.plist written by Xcode",
  or "Info.plist not read". The JSON report has `infoPlistSource` (`file`, `generated` or
  `not-read`) on each target, and `lifecycle` is `unknown` when the Info.plist was not read.

## [0.1.1] - 2026-10-15

### Fixed

- package.json, package-lock.json, app.json, pubspec.yaml, .fvmrc, .fvm/fvm_config.json,
  project.pbxproj and the Flutter Runner's AppDelegate files are read only when they are regular
  files inside the project folder, as the Info.plist named in INFOPLIST_FILE already was. A
  package.json linked to /dev/zero, or a pubspec.yaml that is a FIFO, made the scan wait forever.
  The package.json of an installed package in node_modules only has to be a regular file, since
  pnpm and workspaces link it from outside the app folder.
- examples/github-actions/sdkbump.yml stops the job after 10 minutes instead of GitHub's default
  of six hours.
- The examples in `--help` used `npx sdkbump`, which npm cannot find while sdkbump is not
  published there. They now call `sdkbump`, and the help says so and prints the `npx` command for
  the GitHub release of the running version.
- The README and its translations said 239 tests pass locally. The suite had 252 tests at 0.1.0
  and has 262 with this release, passing on Node.js 22.23, 24.22 and 26.11 in a fresh clone on a
  Mac (Apple silicon). The README inside the 0.1.0 tarball keeps the old number.

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
  0, 1 and 2, and colour only in a terminal. Text from the checked project is printed as text:
  control characters are replaced in the terminal, and in Markdown it cannot add links, images,
  HTML, headings or table cells, or close a code span early.
- An Info.plist named in INFOPLIST_FILE is read only when it is a regular file inside the project
  folder; a path or symbolic link that leads out of it gets a note instead.
- Programmatic API: `scan`, `render` and the readers and checks behind them.
- Ten fixtures (native UIKit before and after migration, SwiftUI, Flutter with a custom
  AppDelegate, Expo SDK 57 with and without its scene opt-in, React Native 0.87 with and without
  the bridge, React Native 0.88 and Expo 58 templates) with expected findings and recorded reports.
- Guides, an API reference site, terminal demos from the CLI, and recordings of the native
  fixtures and a nine-app launch matrix in the iOS 27.0 simulator (Xcode 27.0).

[Unreleased]: https://github.com/muhittincamdali/sdkbump/compare/v0.1.4...HEAD
[0.1.4]: https://github.com/muhittincamdali/sdkbump/releases/tag/v0.1.4
[0.1.3]: https://github.com/muhittincamdali/sdkbump/releases/tag/v0.1.3
[0.1.2]: https://github.com/muhittincamdali/sdkbump/releases/tag/v0.1.2
[0.1.1]: https://github.com/muhittincamdali/sdkbump/releases/tag/v0.1.1
[0.1.0]: https://github.com/muhittincamdali/sdkbump/releases/tag/v0.1.0
