#!/bin/zsh
# Double-click this file in Finder to start offline ZhuRi on your Mac.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
if ! command -v python3 >/dev/null 2>&1; then
  echo '需要 Python 3。请安装 Python 3 后再试。'
  read '?按回车键关闭...'
  exit 1
fi
printf '\n逐日已在本机启动： http://127.0.0.1:8765/\n按 Control+C 可以停止。\n\n'
exec python3 -m http.server 8765 --bind 127.0.0.1 --directory "$ROOT"
