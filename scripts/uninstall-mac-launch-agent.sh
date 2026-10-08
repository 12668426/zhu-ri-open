#!/bin/zsh
set -euo pipefail
LABEL="io.zhuri.localserver"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
rm -f "$PLIST"
echo '已关闭逐日本地自动启动服务；计划数据未删除。'
