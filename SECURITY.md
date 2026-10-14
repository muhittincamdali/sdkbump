# Security policy

## Supported versions

Security fixes are made for the latest release of each project. If you are on an older version,
the fix will be in a new release and the upgrade notes will say if anything changes for you.

## Reporting a vulnerability

Please report vulnerabilities privately, not in a public issue, pull request or discussion.

1. **Preferred:** open the repository's **Security** tab and choose
   **Report a vulnerability** ([how private reporting works](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/report-privately)).
2. **Or** email [muhittincamdali@gmail.com](mailto:muhittincamdali@gmail.com) with
   "Security" in the subject.

Include what you can of the following:

- the affected repository and version (tag or commit),
- what an attacker can do and under which conditions,
- steps or a small project that reproduces it,
- any fix or mitigation you already have in mind.

## What happens next

- You get a reply within 7 days confirming that the report arrived.
- I confirm the issue, work on a fix and agree a disclosure date with you. Fixes are released as
  soon as they are ready, together with a GitHub security advisory.
- You are credited in the advisory unless you prefer not to be.

Please give a reasonable amount of time to fix the issue before disclosing it publicly.

## Scope for sdkbump

sdkbump reads files of the project you point it at (project.pbxproj, Info.plist, Swift and
Objective-C sources, package.json, package-lock.json, app.json, pubspec.yaml, .fvmrc and the
package.json of five packages in node_modules) and writes only the report you ask for with
`--output`. It makes no network requests and never runs project code (app.config.js is not
evaluated). Reports that fit this policy include, for example: a crafted project file that makes
sdkbump write outside the `--output` file, run code, hang or exhaust memory, or print terminal
escape sequences from file names or plist values.
