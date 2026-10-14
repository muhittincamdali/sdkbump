#!/bin/bash
# Builds nine minimal apps with swiftc against the installed iOS simulator SDK, launches each on
# an iOS simulator and prints what happened: whether it is still running after four seconds,
# UIKit's launch failure line, and how many visible windows belong to a scene (0 = black screen).
#
#   examples/launch-matrix/run.sh [simulator-udid]
#
# Needs macOS with Xcode and an iOS simulator runtime. Without a UDID it uses (and creates once) a
# simulator named "sdkbump-iPhone-17" on the newest iOS runtime.
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
udid="${1:-}"
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

sdk="$(xcrun --sdk iphonesimulator --show-sdk-path)"
sdk_version="$(xcrun --sdk iphonesimulator --show-sdk-version)"
work="$(mktemp -d "${TMPDIR:-/tmp}/launch-matrix.XXXXXX")"
trap 'rm -rf "$work"' EXIT

manifest() {
  # $1: the configuration dictionary entries, or "" for a manifest without configurations
  local configurations=""
  if [ "$1" = "generated" ]; then
    # What Xcode writes for INFOPLIST_KEY_UIApplicationSceneManifest_Generation = YES.
    echo "<key>UIApplicationSceneManifest</key><dict><key>UIApplicationSupportsMultipleScenes</key><true/><key>UISceneConfigurations</key><dict/></dict>"
    return
  fi
  if [ -n "$1" ]; then
    configurations="<key>UISceneConfigurations</key><dict><key>UIWindowSceneSessionRoleApplication</key><array><dict><key>UISceneConfigurationName</key><string>Default Configuration</string>$1</dict></array></dict>"
  fi
  echo "<key>UIApplicationSceneManifest</key><dict><key>UIApplicationSupportsMultipleScenes</key><false/>$configurations</dict>"
}

# build <row> <linked SDK version> <Info.plist extra> <sources...>
build() {
  local row="$1" linked="$2" extra="$3"
  shift 3
  local app="$work/$row.app"
  mkdir -p "$app"
  local sources=()
  for source in "$@"; do sources+=("$here/$source"); done
  xcrun -sdk iphonesimulator swiftc -parse-as-library -module-name "Matrix$row" \
    -target arm64-apple-ios17.0-simulator -sdk "$sdk" "${sources[@]}" -o "$app/Matrix$row" \
    -Xlinker -platform_version -Xlinker ios-simulator -Xlinker 17.0 -Xlinker "$linked" 2> /dev/null
  cat > "$app/Info.plist" << PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleExecutable</key><string>Matrix$row</string>
<key>CFBundleIdentifier</key><string>dev.sdkbump.launch-matrix.$row</string>
<key>CFBundleName</key><string>Matrix$row</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>CFBundleShortVersionString</key><string>1.0</string>
<key>CFBundleVersion</key><string>1</string>
<key>MinimumOSVersion</key><string>17.0</string>
<key>CFBundleSupportedPlatforms</key><array><string>iPhoneSimulator</string></array>
<key>UIDeviceFamily</key><array><integer>1</integer></array>
<key>UILaunchScreen</key><dict/>
$extra
</dict></plist>
PLIST
  codesign --force --sign - "$app" > /dev/null 2>&1
}

launch() {
  local row="$1" description="$2"
  local bundle="dev.sdkbump.launch-matrix.$row"
  xcrun simctl install "$udid" "$work/$row.app"
  local since
  since="$(date '+%Y-%m-%d %H:%M:%S')"
  xcrun simctl launch --terminate-running-process "$udid" "$bundle" > /dev/null
  sleep 4
  local running
  running="$(xcrun simctl spawn "$udid" launchctl list | grep -c "UIKitApplication:$bundle\[" || true)"
  local log
  log="$(xcrun simctl spawn "$udid" log show --start "$since" --style compact \
    --predicate "process == \"Matrix$row\" AND (eventMessage CONTAINS \"failed to launch\" OR eventMessage CONTAINS \"launch-matrix: visible\")" 2> /dev/null)"
  local result
  if [ "$running" -gt 0 ]; then
    result="running; $(grep -o 'visible windows in scenes: [0-9]*' <<< "$log" | head -1 || true)"
  else
    result="not running; $(grep -o 'Application failed to launch: UIScene life cycle is required for apps built with this SDK' <<< "$log" | head -1 || true)"
  fi
  printf '%s  %-62s %s\n' "$row" "$description" "$result"
  xcrun simctl terminate "$udid" "$bundle" 2> /dev/null || true
  xcrun simctl uninstall "$udid" "$bundle" 2> /dev/null || true
}

build A "$sdk_version" "" WindowInAppDelegate.swift
build B "$sdk_version" "$(manifest "")" WindowInAppDelegate.swift
build C "$sdk_version" "" ConfigurationInCode.swift
build D "$sdk_version" "" SwiftUIApp.swift
build E "$sdk_version" "$(manifest '<key>UISceneDelegateClassName</key><string>MatrixE.MissingSceneDelegate</string>')" WindowInAppDelegate.swift
build F 26.0 "" WindowInAppDelegate.swift
build G "$sdk_version" "$(manifest '<key>UISceneDelegateClassName</key><string>MatrixG.SceneDelegate</string>')" WindowInAppDelegate.swift EmptySceneDelegate.swift
build H "$sdk_version" "$(manifest " ")" WindowInAppDelegate.swift
build I "$sdk_version" "$(manifest generated)" WindowInAppDelegate.swift

echo "Xcode: $(xcodebuild -version | tr '\n' ' ')· simulator SDK $sdk_version"
launch A "no scene manifest, no configurationForConnecting"
launch B "manifest without configurations"
launch C "configurationForConnecting in the app delegate"
launch D "SwiftUI App, no manifest"
launch E "manifest names a class that does not exist"
launch F "as A, linked against SDK 26.0"
launch G "scene delegate makes no window, app delegate does"
launch H "configuration without a delegate class"
launch I "the manifest Xcode generates (empty configurations)"
