#!/bin/sh
# Lists the findings that stop an app at launch or leave it on a black screen (errors that no
# installed workaround handles), one per line as file:line rule title. Needs jq.
#
#   sh examples/shell/launch-blockers.sh [project folder]
#
# Prints nothing when there are none. Inside this repository it runs the build in dist/; elsewhere
# set SDKBUMP to the command you run sdkbump with (for example "npx --yes @mcamdali/sdkbump@0.1").
set -eu
project="${1:-.}"
here="$(cd "$(dirname "$0")" && pwd)"
sdkbump="${SDKBUMP:-node $here/../../dist/cli/main.js}"
$sdkbump "$project" --format json --fail-on none |
  jq -r '.findings[]
    | select(.severity == "error" and .mitigation == null)
    | "\(.file)\(if .line then ":\(.line)" else "" end) \(.rule) \(.title)"'
