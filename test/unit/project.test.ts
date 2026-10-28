import { execFileSync } from 'node:child_process';
import { mkdirSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { detectProject, ProjectError } from '../../src/detect/project.js';
import { minimalPbxproj, tree } from '../helpers/tree.js';

const pbxproj = minimalPbxproj();

describe('detectProject', () => {
  it('finds a native app with the .xcodeproj at the root', async () => {
    const root = tree({ 'Shelf.xcodeproj/project.pbxproj': pbxproj });
    const project = await detectProject(root);
    expect(project).toMatchObject({
      ecosystem: 'native',
      name: 'Shelf',
      iosDir: root,
      xcodeProjects: [join(root, 'Shelf.xcodeproj')],
    });
  });

  it('finds a native app one folder down and skips Pods', async () => {
    const root = tree({
      'App/App.xcodeproj/project.pbxproj': pbxproj,
      'Pods/Pods.xcodeproj/project.pbxproj': pbxproj,
    });
    const project = await detectProject(root);
    expect(project.xcodeProjects).toEqual([join(root, 'App', 'App.xcodeproj')]);
    expect(project.iosDir).toBe(join(root, 'App'));
  });

  it('accepts an .xcodeproj path', async () => {
    const root = tree({ 'Shelf.xcodeproj/project.pbxproj': pbxproj });
    const project = await detectProject(join(root, 'Shelf.xcodeproj'));
    expect(project.root).toBe(root);
    expect(project.ecosystem).toBe('native');
  });

  it('recognises a Flutter app, its pinned version and a disabled migration', async () => {
    const root = tree({
      'pubspec.yaml':
        'name: shop\ndependencies:\n  flutter:\n    sdk: flutter\nflutter:\n  config:\n    enable-uiscene-migration: false\n',
      '.fvmrc': '{ "flutter": "3.41.5" }',
      'ios/Runner.xcodeproj/project.pbxproj': pbxproj,
    });
    const project = await detectProject(root);
    expect(project).toMatchObject({
      ecosystem: 'flutter',
      name: 'shop',
      iosDir: join(root, 'ios'),
      flutter: { version: '3.41.5', migrationDisabled: true, plugin: false },
    });
  });

  it('uses example/ios for a Flutter plugin', async () => {
    const root = tree({
      'pubspec.yaml':
        'name: camera_plus\nflutter:\n  plugin:\n    platforms:\n      ios:\n        pluginClass: CameraPlusPlugin\n',
      '.fvm/fvm_config.json': '{ "flutterSdkVersion": "3.38.0" }',
      'example/ios/Runner.xcodeproj/project.pbxproj': pbxproj,
    });
    const project = await detectProject(root);
    expect(project.flutter).toEqual({ version: '3.38.0', migrationDisabled: false, plugin: true });
    expect(project.iosDir).toBe(join(root, 'example', 'ios'));
  });

  it('recognises React Native and reads versions from node_modules, the lockfile or the range', async () => {
    const root = tree({
      'package.json': JSON.stringify({
        name: 'rn-app',
        dependencies: {
          'react-native': '^0.87.0',
          'react-native-uiscene-bridge': '^0.1.0',
          'react-native-xcode27': '0.2.0',
        },
      }),
      'node_modules/react-native/package.json': '{ "version": "0.87.1" }',
      'package-lock.json': JSON.stringify({
        packages: { 'node_modules/react-native-uiscene-bridge': { version: '0.1.0' } },
      }),
      'ios/RNApp.xcodeproj/project.pbxproj': pbxproj,
    });
    const project = await detectProject(root);
    expect(project.ecosystem).toBe('react-native');
    expect([...project.packages.values()]).toEqual([
      { name: 'react-native', version: '0.87.1', source: 'installed', declared: '^0.87.0' },
      {
        name: 'react-native-uiscene-bridge',
        version: '0.1.0',
        source: 'lockfile',
        declared: '^0.1.0',
      },
      { name: 'react-native-xcode27', version: '0.2.0', source: 'declared', declared: '0.2.0' },
    ]);
  });

  it('recognises Expo before React Native and reads enableSceneSupport from app.json', async () => {
    const root = tree({
      'package.json': JSON.stringify({
        dependencies: {
          expo: '~57.0.29',
          'react-native': '0.86.3',
          'expo-build-properties': '~57.0.20',
        },
      }),
      'app.json': JSON.stringify({
        expo: { plugins: [['expo-build-properties', { ios: { enableSceneSupport: true } }]] },
      }),
    });
    const project = await detectProject(root);
    expect(project).toMatchObject({
      ecosystem: 'expo',
      iosDir: null,
      xcodeProjects: [],
      expoConfig: { file: 'app.json', enableSceneSupport: true },
    });
    expect(project.packages.get('expo')?.version).toBe('57.0.29');
  });

  it('does not evaluate app.config.js', async () => {
    const root = tree({
      'package.json': JSON.stringify({ dependencies: { expo: '~56.0.0' } }),
      'app.config.js': 'module.exports = {};',
      'app.json': '{}',
    });
    expect((await detectProject(root)).expoConfig).toEqual({
      file: 'app.config.js',
      enableSceneSupport: null,
    });
  });

  it.each([
    ['an empty folder', {}],
    [
      'a React Native project without ios/',
      { 'package.json': '{"dependencies":{"react-native":"0.87.1"}}' },
    ],
    [
      'a Flutter project without ios/',
      { 'pubspec.yaml': 'name: a\nflutter:\n  uses-material-design: true\n' },
    ],
  ])('rejects %s', async (_, files) => {
    await expect(detectProject(tree(files))).rejects.toThrow(ProjectError);
  });

  it('rejects a path that does not exist or is a file', async () => {
    const root = tree({ 'README.md': '# x' });
    await expect(detectProject(join(root, 'missing'))).rejects.toThrow(/does not exist/);
    await expect(detectProject(join(root, 'README.md'))).rejects.toThrow(/not a folder/);
  });
});

describe('detectProject with project files it does not read', () => {
  const nativeWith = (link: string, to: string) => {
    const root = tree({ 'App.xcodeproj/project.pbxproj': pbxproj });
    symlinkSync(to, join(root, link));
    return root;
  };

  it.each(['package.json', 'pubspec.yaml'])(
    'skips %s when it is /dev/zero',
    { timeout: 2000 },
    async (name) => {
      const project = await detectProject(nativeWith(name, '/dev/zero'));
      expect(project.ecosystem).toBe('native');
    },
  );

  it('skips a pubspec.yaml that is a FIFO', { timeout: 2000 }, async () => {
    const root = tree({ 'App.xcodeproj/project.pbxproj': pbxproj });
    execFileSync('mkfifo', [join(root, 'pubspec.yaml')]);
    expect((await detectProject(root)).ecosystem).toBe('native');
  });

  it('skips a package.json linked from outside the project', async () => {
    const outside = tree({
      'package.json': JSON.stringify({ dependencies: { 'react-native': '0.87.1' } }),
    });
    const root = nativeWith('package.json', join(outside, 'package.json'));
    expect((await detectProject(root)).ecosystem).toBe('native');
  });

  it('skips an app.json that is /dev/zero', { timeout: 2000 }, async () => {
    const root = tree({ 'package.json': JSON.stringify({ dependencies: { expo: '~57.0.29' } }) });
    symlinkSync('/dev/zero', join(root, 'app.json'));
    const project = await detectProject(root);
    expect(project.ecosystem).toBe('expo');
    expect(project.expoConfig).toBeNull();
  });

  it('reads an installed package that node_modules links from outside the app folder', async () => {
    // pnpm and workspaces keep the package elsewhere and link it into the app's node_modules.
    const store = tree({
      '.pnpm/react-native@0.87.1/node_modules/react-native/package.json': '{ "version": "0.87.1" }',
    });
    const root = tree({
      'package.json': JSON.stringify({ dependencies: { 'react-native': '^0.87.0' } }),
      'ios/RNApp.xcodeproj/project.pbxproj': pbxproj,
    });
    mkdirSync(join(root, 'node_modules'));
    symlinkSync(
      join(store, '.pnpm/react-native@0.87.1/node_modules/react-native'),
      join(root, 'node_modules', 'react-native'),
    );
    const project = await detectProject(root);
    expect(project.packages.get('react-native')).toMatchObject({
      version: '0.87.1',
      source: 'installed',
    });
  });

  it('does not read an installed package.json linked to another file outside the project', async () => {
    const outside = tree({ 'secrets.json': '{ "version": "4.0.0-SECRETTOKEN123" }' });
    const root = tree({
      'package.json': JSON.stringify({ dependencies: { 'react-native': '^0.87.0' } }),
      'ios/RNApp.xcodeproj/project.pbxproj': pbxproj,
      'node_modules/react-native/README.md': '',
    });
    symlinkSync(
      join(outside, 'secrets.json'),
      join(root, 'node_modules/react-native/package.json'),
    );
    const project = await detectProject(root);
    expect(project.packages.get('react-native')).toMatchObject({
      version: '0.87.0',
      source: 'declared',
    });
  });

  it('skips an installed package.json that is /dev/zero', { timeout: 2000 }, async () => {
    const root = tree({
      'package.json': JSON.stringify({ dependencies: { 'react-native': '^0.87.0' } }),
      'ios/RNApp.xcodeproj/project.pbxproj': pbxproj,
      'node_modules/react-native/README.md': '',
    });
    symlinkSync('/dev/zero', join(root, 'node_modules/react-native/package.json'));
    const project = await detectProject(root);
    expect(project.packages.get('react-native')).toMatchObject({
      version: '0.87.0',
      source: 'declared',
    });
  });
});
