// Runs sdkbump from JavaScript and prints one line per project: the verdict and the rules found.
//
//   node examples/api/verdicts.mjs [project ...]
//
// Without arguments it checks the fixtures in this repository. In your own code, install @mcamdali/sdkbump
// and pass the folders of your apps.
import { fileURLToPath } from 'node:url';
import { scan } from '@mcamdali/sdkbump';

const root = fileURLToPath(new URL('../../', import.meta.url));
const projects =
  process.argv.length > 2
    ? process.argv.slice(2)
    : [
        'native-uikit',
        'native-swiftui',
        'flutter-custom-appdelegate',
        'expo-57',
        'rn-087-bridge',
      ].map((name) => `${root}fixtures/${name}`);

for (const path of projects) {
  const report = await scan(path);
  const rules = [...new Set(report.findings.map((finding) => finding.rule))].join(', ') || 'none';
  console.log(
    `${report.project.name} (${report.project.ecosystem}): ${report.verdict.text} Rules: ${rules}.`,
  );
}
