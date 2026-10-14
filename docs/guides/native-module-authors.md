# Native module authors: links and notifications at cold start

Libraries for React Native, Expo and Flutter often read what launched the app from the app
delegate: the URL in `launchOptions[.url]`, a notification in `launchOptions[.remoteNotification]`,
or a call to `application(_:open:options:)`. Under scenes those arrive somewhere else, and a
library that does not follow sees nothing.

## What changes

Apple deprecated the launch option keys in iOS 26 and names where each one went:

| Before                                        | With scenes                                                                                           |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `launchOptions[.url]`                         | `connectionOptions.urlContexts` in `scene(_:willConnectTo:options:)`                                  |
| `launchOptions[.userActivityDictionary]`      | `connectionOptions.userActivities`                                                                    |
| `launchOptions[.shortcutItem]`                | `connectionOptions.shortcutItem`                                                                      |
| `launchOptions[.remoteNotification]`          | silent notifications keep using `application(_:didReceiveRemoteNotification:fetchCompletionHandler:)` |
| `application(_:open:options:)`                | `scene(_:openURLContexts:)`                                                                           |
| `application(_:continue:restorationHandler:)` | `scene(_:continue:)`                                                                                  |

The pages are linked from every SCN003 finding. For a notification the user tapped, the usual
place is `userNotificationCenter(_:didReceive:withCompletionHandler:)` on a
`UNUserNotificationCenterDelegate` set before launch finishes.

An example of what goes wrong:
[braze-inc/braze-react-native-sdk#334](https://github.com/braze-inc/braze-react-native-sdk/issues/334)
reports that the initial push payload is null on a cold start under the scene life cycle.

## What to do in a library

- Do not depend on the app delegate receiving links or launch options. Read the connection
  options when the scene connects, or ask the app to forward them from its scene delegate, as React
  Native 0.88 does with `RCTLinkingManager.scene(_:openURLContexts:)`.
- Do not look up the window through `UIApplication.shared.keyWindow`, `windows` or the app
  delegate's `window`; use the scene of the view you present from.
- Test a cold start from a link and from a notification with a scene-based app, not only a link
  that arrives while the app runs.

## What sdkbump does for libraries today

sdkbump 0.1 checks the app's own `ios/` folder. Checking the iOS sources of each Pod, npm package
and Flutter plugin, and naming the package a finding comes from, is planned for 0.2.
