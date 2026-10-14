import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

/** Writes the given files (path relative to the root → content) into a new temporary folder. */
export function tree(files: Record<string, string | Uint8Array>): string {
  const root = mkdtempSync(join(tmpdir(), 'sdkbump-test-'));
  for (const [path, content] of Object.entries(files)) {
    const file = join(root, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
  return root;
}

/** The smallest project.pbxproj with one iOS app target, for tests that need an .xcodeproj. */
export function minimalPbxproj(target = 'App', infoPlist = `${target}/Info.plist`): string {
  return `// !$*UTF8*$!
{
	archiveVersion = 1;
	objects = {
		P0 = {isa = PBXProject; buildConfigurationList = PL; targets = (T0, ); };
		PL = {isa = XCConfigurationList; buildConfigurations = (PD, ); };
		PD = {isa = XCBuildConfiguration; name = Debug; buildSettings = { SDKROOT = iphoneos; }; };
		T0 = {isa = PBXNativeTarget; name = ${target}; productType = "com.apple.product-type.application"; buildConfigurationList = TL; };
		TL = {isa = XCConfigurationList; buildConfigurations = (TD, ); };
		TD = {isa = XCBuildConfiguration; name = Debug; buildSettings = { INFOPLIST_FILE = "${infoPlist}"; }; };
	};
	rootObject = P0;
}
`;
}

/** An Info.plist with the given top-level XML (already wrapped in key/value pairs). */
export function infoPlist(body = ''): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleExecutable</key>
	<string>$(EXECUTABLE_NAME)</string>
${body}
</dict>
</plist>
`;
}

/** The scene manifest Apple's article shows, naming `delegate`. */
export function sceneManifest(delegate = '$(PRODUCT_MODULE_NAME).SceneDelegate'): string {
  return `	<key>UIApplicationSceneManifest</key>
	<dict>
		<key>UIApplicationSupportsMultipleScenes</key>
		<false/>
		<key>UISceneConfigurations</key>
		<dict>
			<key>UIWindowSceneSessionRoleApplication</key>
			<array>
				<dict>
					<key>UISceneConfigurationName</key>
					<string>Default Configuration</string>
					<key>UISceneDelegateClassName</key>
					<string>${delegate}</string>
				</dict>
			</array>
		</dict>
	</dict>`;
}
