#!/bin/bash
# Builds one of the native fixtures with the installed Xcode, launches it on an iOS simulator and
# says whether it is still running a few seconds later, with UIKit's launch failure line when it
# is not. This is how the evidence in fixtures/README.md and docs/guides/why-it-crashes.md was
# recorded; it needs macOS, Xcode with an iOS 27 simulator runtime, and XcodeGen.
#
#   scripts/simulator-check.sh native-uikit [simulator-udid]
#
# Without a UDID it creates (once) and boots a simulator named "sdkbump-iPhone-17" on the newest
# iOS runtime, so it never touches your other simulators.
set -euo pipefail

fixture="${1:?usage: scripts/simulator-check.sh <native-uikit|native-uikit-scenes|native-swiftui> [udid]}"
root="$(cd "$(dirname "$0")/.." && pwd)"
dir="$root/fixtures/$fixture"
[ -f "$dir/project.yml" ] || { echo "fixtures/$fixture has no project.yml" >&2; exit 2; }

udid="${2:-}"
if [ -z "$udid" ]; then
  udid="$(xcrun simctl list devices -j | node -e '
    const devices = Object.values(JSON.parse(require("fs").readFileSync(0, "utf8")).devices).flat();
    const found = devices.find((device) => device.name === "sdkbump-iPhone-17" && device.isAvailable);
    process.stdout.write(found ? found.udid : "");')"
  if [ -z "$udid" ]; then
    runtime="$(xcrun simctl list runtimes -j | node -e '
      const runtimes = JSON.parse(require("fs").readFileSync(0, "utf8")).runtimes
        .filter((runtime) => runtime.platform === "iOS" && runtime.isAvailable);
      process.stdout.write(runtimes.at(-1)?.identifier ?? "");')"
    udid="$(xcrun simctl create sdkbump-iPhone-17 com.apple.CoreSimulator.SimDeviceType.iPhone-17 "$runtime")"
  fi
fi
xcrun simctl boot "$udid" 2> /dev/null || true
xcrun simctl bootstatus "$udid" -b > /dev/null

work="$(mktemp -d "${TMPDIR:-/tmp}/sdkbump-sim.XXXXXX")"
trap 'rm -rf "$work"' EXIT
cp -R "$dir/." "$work/"
(cd "$work" && xcodegen generate --quiet)
project="$(cd "$work" && ls -d ./*.xcodeproj | head -1)"
scheme="$(basename "$project" .xcodeproj)"
xcodebuild -project "$work/$project" -scheme "$scheme" -destination "id=$udid" \
  -derivedDataPath "$work/dd" build > "$work/build.log" 2>&1 || { tail -20 "$work/build.log"; exit 1; }
app="$(find "$work/dd/Build/Products" -maxdepth 2 -name '*.app' | head -1)"
bundle="$(/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$app/Info.plist")"
sdk="$(/usr/libexec/PlistBuddy -c 'Print :DTSDKName' "$app/Info.plist")"
runtime="$(xcrun simctl list devices -j | node -e '
  const all = JSON.parse(require("fs").readFileSync(0, "utf8")).devices;
  for (const [runtime, devices] of Object.entries(all))
    if (devices.some((device) => device.udid === process.argv[1]))
      process.stdout.write(runtime.replace(/^.*SimRuntime\./, "").replace(/-(\d+)-(\d+)$/, " $1.$2"));' "$udid")"

echo "fixture:    fixtures/$fixture"
echo "built with: $(xcodebuild -version | head -1) ($(xcodebuild -version | tail -1 | sed 's/Build version //')), SDK $sdk"
echo "simulator:  $runtime"
xcrun simctl install "$udid" "$app"
since="$(date '+%Y-%m-%d %H:%M:%S')"
xcrun simctl launch --terminate-running-process "$udid" "$bundle" > /dev/null
sleep 4
process="$(basename "$app" .app)"
running="$(xcrun simctl spawn "$udid" launchctl list | grep -c "UIKitApplication:$bundle\[" || true)"
if [ "$running" -gt 0 ]; then
  echo "result:     running 4 seconds after launch"
  if [ -n "${SCREENSHOT:-}" ]; then xcrun simctl io "$udid" screenshot "$SCREENSHOT" > /dev/null 2>&1; fi
else
  echo "result:     not running 4 seconds after launch"
  xcrun simctl spawn "$udid" log show --start "$since" --style compact \
    --predicate "process == \"$process\" AND eventMessage CONTAINS \"failed to launch\"" 2> /dev/null |
    grep -o 'Application failed to launch:.*' | head -1 | sed 's/^/log:        /'
fi
xcrun simctl terminate "$udid" "$bundle" 2> /dev/null || true
