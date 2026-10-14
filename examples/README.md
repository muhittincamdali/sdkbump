# Examples

| Example                                                  | What it shows                                                                                                 |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [api/verdicts.mjs](api/verdicts.mjs)                     | sdkbump from JavaScript: one line per project with the verdict and the rules found                            |
| [shell/launch-blockers.sh](shell/launch-blockers.sh)     | Filtering the JSON report with `jq`: the errors that stop the app at launch or blank its screen               |
| [github-actions/sdkbump.yml](github-actions/sdkbump.yml) | A workflow for an app repository: the report in the job summary, and a failed job when there is an error      |
| [launch-matrix](launch-matrix/README.md)                 | Nine minimal apps launched on an iOS simulator: which scene declarations launch, stop, or show a black screen |

Run the first two from the repository root after `npm ci && npm run build`:

```sh
node examples/api/verdicts.mjs
sh examples/shell/launch-blockers.sh fixtures/expo-57
```

`verdicts.mjs` imports `sdkbump` by name; inside this repository that resolves to the package
itself, so it runs the code you just built. CI runs both on every change. The launch matrix needs
a Mac with Xcode and an iOS simulator runtime.
