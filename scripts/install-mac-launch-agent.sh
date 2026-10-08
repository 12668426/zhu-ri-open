#!/bin/zsh
# Install an optional per-user background server for offline Plash use.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PYTHON="$(command -v python3 || true)"
if [[ -z "$PYTHON" ]]; then
  echo '需要 Python 3，请先安装。' >&2; exit 1
fi
LABEL="io.zhuri.localserver"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
mkdir -p "$HOME/Library/LaunchAgents" "$HOME/Library/Logs"
"$PYTHON" - "$PLIST" "$PYTHON" "$ROOT" "$HOME/Library/Logs" <<'PY'
import pathlib, sys, plistlib
plist,python,root,logs=sys.argv[1:]
config={
 'Label':'io.zhuri.localserver',
 'ProgramArguments':[python,'-m','http.server','8765','--bind','127.0.0.1','--directory',root],
 'RunAtLoad':True,'KeepAlive':True,
 'StandardOutPath':str(pathlib.Path(logs)/'zhuri.log'),
 'StandardErrorPath':str(pathlib.Path(logs)/'zhuri-error.log'),
}
with open(plist,'wb') as f:plistlib.dump(config,f)
PY
UID_NUM="$(id -u)"
launchctl bootout "gui/$UID_NUM/$LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$UID_NUM" "$PLIST"
printf '安装成功： http://127.0.0.1:8765/\nPlash 添加这个网址即可；断网也可以访问。\n'
