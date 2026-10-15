# sdkbump

Before you ship a build made with Xcode 27: sdkbump checks a native iOS, Flutter or React
Native/Expo project for what the iOS 27 SDK changes, starting with the UIScene life cycle, and says
which fix applies to each finding.

```sh
npx @mcamdali/sdkbump
```

## Guides

- [Why it compiles and still crashes](../guides/why-it-crashes.md)
- [Native UIKit and SwiftUI apps](../guides/native-ios.md)
- [Flutter: a custom AppDelegate and plugins](../guides/flutter.md)
- [React Native before 0.88 and Expo before SDK 58](../guides/react-native-expo.md)
- [Native module authors: links and notifications at cold start](../guides/native-module-authors.md)

## API

The command line is a thin layer over the package's exports, so the same checks run from
JavaScript:

```ts
import { render, scan } from '@mcamdali/sdkbump';

const report = await scan('path/to/app');
console.log(report.verdict.text);
console.log(render(report, 'markdown'));
```

Start with {@link scan} and {@link render}; the JSON report is described by {@link Report}. Its
`schemaVersion` is 0 until the layout is declared stable in 1.0. The rule data behind every finding
is {@link RuleData}, loaded by {@link loadRuleData}.

Source, issues and the changelog are on [GitHub](https://github.com/muhittincamdali/sdkbump).
