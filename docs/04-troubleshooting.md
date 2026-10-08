# 教程④：常见问题排查（一步步解决）

## Q1：Safari 打不开 `http://127.0.0.1:8765/`

检查本地服务有没有启动：

```bash
cd "$HOME/Documents/ZhuRi"
python3 -m http.server 8765 --bind 127.0.0.1
```

如果出现 `Serving HTTP`，让终端保持打开，再去 Safari 输入网址（注意是 `http`，不是 `https`）。如果 `cd` 报错，说明你的文件夹不在 `Documents/ZhuRi`，先去 Finder 核对实际位置。

## Q2：提示 `Address already in use`（端口被占用）

可能之前安装了自启动服务，已经运行着，就**不用再重复运行一份**。先直接用 Safari 打开网址即可。

需要查询谁使用端口：

```bash
lsof -nP -iTCP:8765 -sTCP:LISTEN
```

如果是逐日旧服务，你可以按照 README 的卸载脚本关闭，或换端口：

```bash
cd "$HOME/Documents/ZhuRi"
python3 -m http.server 8766 --bind 127.0.0.1
```

使用新端口时，Plash 的网址也要改成 `http://127.0.0.1:8766/`。注意 `install-mac-launch-agent.sh` 默认仍是 8765，不能同时不修改就改用 8766 自启。

## Q3：终端说 `command not found: python3`

访问 https://www.python.org/downloads/macos/ 下载官方 Python 3 安装包 `.pkg`，按提示安装。重新打开终端输入 `python3 --version`。不要随意复制网上来历不明的 `curl | sh` 安装指令。

## Q4：脚本显示 `Permission denied`

终端依次运行：

```bash
cd "$HOME/Documents/ZhuRi"
chmod +x scripts/*.sh scripts/*.command
./scripts/install-mac-launch-agent.sh
```

如果 Mac 系统明确弹出安全警告，请先确认是从本项目下载的原始脚本，不要关闭系统全部安全保护。实在不想运行脚本，用第1题手动开启服务即可。

## Q5：Plash 桌面没变，但 Safari 可以打开

1. 打开 Plash 顶部菜单栏图标。
2. 确认添加的网址与 Safari 完全相同，并已选中显示。
3. 尝试在菜单里选择重新加载，或在终端执行：

```bash
open -g plash:reload
```

4. 检查是否已经打开了一个不同的 Plash 网址（例如之前的 GitHub Pages）；替换为这次本机的网址。

## Q6：桌面能看到但不能点击

在 Plash 菜单里打开 **Browsing Mode**。退出浏览模式才能继续正常使用 Finder 桌面文件。如果你没有菜单栏图标，请查看 Plash 官方支持页并确认应用正在运行。

## Q7：Mac 重启后怎么让它自动出现？

登录后自启可用：

```bash
cd "$HOME/Documents/ZhuRi"
./scripts/install-mac-launch-agent.sh
```

确认 Plash 已在 **系统设置 → 通用 → 登录项与扩展** 中允许开机登录启动（不同 macOS 版本菜单名称略有区别）。注册本机后台服务并不等于自动启动 Plash App，这两件事都要检查。

## Q8：时间不对、倒计时不更新

- 在系统设置里检查 **日期与时间、时区**。
- 检查 Safari 中页面是否正常刷新并有 JavaScript 功能。
- 如果 Mac 睡眠了，恢复后页面可能需要短暂刷新；Plash 也可能暂停刷新以节电。
- 时间表每周重复是依据本地时间，不会自动从系统日历导入事件。

## Q9：表格变得很窄，文字挤在一起

- 先把留白胶囊向右拖一些，让学习面板更宽。
- Plash 浏览模式下右键网页，试着把放大级别调整为正常；显示缩放可能改变网页的实际可用像素。
- 这个项目有响应式排布，窄到一定程度会变成上下排列，不是程序崩溃。
- 若仍有横向溢出，请报告屏幕尺寸、缩放设置、Plash 版本与截图。

## Q10：GitHub Pages 404 / 缺少样式

请确认是在**你自己的 GitHub 仓库**中进入 Settings → Pages，选择正确的分支和 **/(root)**；仓库根目录包含 `index.html`，同时 `src/`、`assets/` 目录完整。初次发布需要等待 Pages 完成构建，可以去 Actions 查看。

## Q11：记录不见了，怎么恢复？

先检查是否切换了 Safari / Plash，或从 `127.0.0.1` 变到了 GitHub Pages 地址；它们各有独立存储。若以前已经导出了 JSON 备份，可在当前网页 **调整日程 → 导入 JSON 备份**。**没有备份时不能保证恢复**。

## Q12：如何彻底停止本地自动服务？

```bash
cd "$HOME/Documents/ZhuRi"
./scripts/uninstall-mac-launch-agent.sh
```

这一步不会删除个人数据或下载的源代码；之后可以手动停止 Plash 或从桌面网站列表里移除逐日。

返回：[README](../README.md) ｜ [Plash 官网](https://sindresorhus.com/plash)
