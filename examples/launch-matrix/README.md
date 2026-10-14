# Launch matrix

Nine minimal apps that differ only in how they declare (or do not declare) a scene, built with
`swiftc` against the installed iOS simulator SDK and launched on an iOS simulator. They are the
evidence behind SCN001 and SCN002; see
[Why it compiles and still crashes](../../docs/guides/why-it-crashes.md).

```sh
examples/launch-matrix/run.sh            # uses (and creates once) a simulator named sdkbump-iPhone-17
examples/launch-matrix/run.sh <udid>     # or a simulator you choose
```

Needs macOS with Xcode and an iOS simulator runtime. Each app logs, one second after launch, how
many visible windows belong to a connected scene; 0 means the screen stays black.

| Row | Sources                                                                            | Info.plist                                                                                                                       |
| --- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| A   | [WindowInAppDelegate.swift](WindowInAppDelegate.swift)                             | no scene manifest                                                                                                                |
| B   | WindowInAppDelegate.swift                                                          | manifest without configurations                                                                                                  |
| C   | [ConfigurationInCode.swift](ConfigurationInCode.swift)                             | no scene manifest                                                                                                                |
| D   | [SwiftUIApp.swift](SwiftUIApp.swift)                                               | no scene manifest                                                                                                                |
| E   | WindowInAppDelegate.swift                                                          | configuration naming a class that is not there                                                                                   |
| F   | WindowInAppDelegate.swift, linked with the SDK version set to 26.0                 | no scene manifest                                                                                                                |
| G   | WindowInAppDelegate.swift and [EmptySceneDelegate.swift](EmptySceneDelegate.swift) | configuration naming that scene delegate                                                                                         |
| H   | WindowInAppDelegate.swift                                                          | configuration without a delegate class                                                                                           |
| I   | WindowInAppDelegate.swift                                                          | the manifest Xcode writes for `INFOPLIST_KEY_UIApplicationSceneManifest_Generation = YES`: multiple scenes, empty configurations |

Recorded on 15 October 2026 on a Mac (Apple silicon), iPhone 17 simulator with the iOS 27.0
runtime (24A434):

```text
Xcode: Xcode 27.0 Build version 27A266a · simulator SDK 27.0
A  no scene manifest, no configurationForConnecting               not running; Application failed to launch: UIScene life cycle is required for apps built with this SDK
B  manifest without configurations                                not running; Application failed to launch: UIScene life cycle is required for apps built with this SDK
C  configurationForConnecting in the app delegate                 running; visible windows in scenes: 1
D  SwiftUI App, no manifest                                       running; visible windows in scenes: 1
E  manifest names a class that does not exist                     running; visible windows in scenes: 0
F  as A, linked against SDK 26.0                                  running; visible windows in scenes: 1
G  scene delegate makes no window, app delegate does              running; visible windows in scenes: 0
H  configuration without a delegate class                         running; visible windows in scenes: 0
I  the manifest Xcode generates (empty configurations)            not running; Application failed to launch: UIScene life cycle is required for apps built with this SDK
```
