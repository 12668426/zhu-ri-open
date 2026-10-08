# 教程①：Mac 本地离线部署（推荐，小白逐步照做）

这套方式最适合把逐日长期挂在 Mac 桌面：**不用买服务器，断开 Wi-Fi 后仍可使用**。前提是 Mac 本地服务在运行。第一次下载软件和项目文件时需要互联网。

## 需要的软件与对应网址

| 软件 | 用来干什么 | 官网 |
|---|---|---|
| Safari | 检查网页是否正常打开 | Mac 自带，不需要安装 |
| Python 3 | 让 Mac 在本地提供一个网址 | https://www.python.org/downloads/macos/ |
| Plash（不是“Plus”）| 把网页放到 Mac 桌面，交互时开启 Browsing Mode | https://sindresorhus.com/plash 或 App Store 搜索 **Plash** |
| 终端（Terminal）| 输入下文给出的命令 | Mac 自带，不需要安装 |

Plash 是第三方软件，由 Sindre Sorhus 开发。App Store 安装最省心；如果所在地区无法打开 App Store，查看官方页面提供的非 App Store 版本，确认适配你的 macOS 系统。不要从不明第三方下载站安装。

## 第 1 步：把项目下载到你的 Mac

1. 打开本开源仓库 `https://github.com/12668426/zhu-ri-open`。
2. 在项目页面点击绿色 **Code** 按钮。
3. 点击 **Download ZIP**，等待下载完成。
4. 打开「访达 Finder → 下载」，双击下载的 ZIP 解压。
5. **把解压后的整个文件夹**移动到「文稿 Documents」，建议重命名为 `ZhuRi`，保证里面有 `index.html`、`src`、`scripts` 等文件。
6. 以后先不要移动 `ZhuRi` 文件夹；开机启动脚本会保存它的位置。

你现在文件夹的位置应该是：`~/Documents/ZhuRi`（符号 `~` 就是你自己的个人主目录）。

## 第 2 步：检查有没有 Python 3

1. 按键盘 **Command（⌘）+ 空格**，出现聚焦搜索。
2. 输入 `终端` 或 `Terminal`，按 **Return 回车** 打开。
3. 把以下整行**复制粘贴**进去，再按回车：

```bash
python3 --version
```

如果出现 `Python 3.x.x`，就可以继续第 3 步。**如果提示 command not found 或者要求安装开发者工具**，请按下面安装 Python。

### 没有 Python？按这个方式安装

1. 打开 **https://www.python.org/downloads/macos/**。
2. 选择 Python 3 的稳定 macOS 安装包（官方 `macOS installer`）。
3. 在下载文件夹双击 `.pkg` 安装包，按 **Continue/继续 → Install/安装**，按系统要求输入密码。
4. 安装完成后**关闭终端并重新打开**，再次运行：

```bash
python3 --version
```

显示 `Python 3.x.x` 即可。官方安装包可能会在「应用程序」中附带证书安装工具，逐日的本机 HTTP 服务通常不需要额外配置证书。

## 第 3 步：启动逐日（先临时运行一次）

在终端里把下面**三行分开执行**：

```bash
cd "$HOME/Documents/ZhuRi"
python3 -m http.server 8765 --bind 127.0.0.1
```

你会看到类似 `Serving HTTP on 127.0.0.1 port 8765` 的字样。这时**不要关闭终端窗口**。

接下来打开 Safari，在地址栏输入：

```text
http://127.0.0.1:8765/
```

如果看到逐日欢迎界面，就成功了。第一次可选「空白计划」或「通用示例」；**这不是作者的个人计划**。

`127.0.0.1` 只代表本机；这个地址不需要连接互联网，别人也无法用这个地址远程打开你电脑中的网页。

> 关闭方式：回到刚才运行服务的终端窗口，按 **Control + C** 停止。关闭终端后本机地址会无法访问。也可以尝试在 Finder 里双击项目 `scripts/run-local.command`；如果 macOS 拦截，仍推荐使用终端命令。

## 第 4 步：下载安装 Plash

1. 打开 https://sindresorhus.com/plash ，点击官方的 **Get** 下载链接跳到 App Store。
2. 或直接打开 Mac 上的 App Store，在搜索框输入 **Plash**（不是 Plus）。
3. 认准开发者 **Sindre Sorhus**，点击 **获取/Get → 安装**。
4. 安装完成后打开「应用程序 → Plash」，按 macOS 提示授予必要权限。一般在屏幕**顶部菜单栏**会出现 Plash 图标。

## 第 5 步：把逐日设置成真正的桌面

1. **确认上面第 3 步的终端仍然运行**，并且 Safari 可以打开 `http://127.0.0.1:8765/`。
2. 点击 **Mac 顶部菜单栏的 Plash 图标**，选择 **Add Website / 添加网站**（不同版本菜单文字可能略有不同）。
3. 在网址框粘贴：`http://127.0.0.1:8765/`。
4. 保存添加的网站，并让 Plash 显示该网站。
5. 回到 Mac 桌面，应该能看到时钟、时间表和倒计时。
6. 需要点击时间表、打卡或拖动留白胶囊时，从 Plash 菜单打开 **Browsing Mode（浏览模式）**。完成操作后关闭它，继续正常使用 Finder 桌面文件。

如果桌面只显示空白，先回 Safari 测试地址，通常是本地服务没有运行，见[常见问题](04-troubleshooting.md)。

## 第 6 步：让 Mac 登录后自动启动本机服务（推荐）

如果你不想每次都开终端输入命令，可以安装项目提供的登录自启脚本。

**先按 Control + C 停掉之前测试用的临时服务**，避免端口 8765 被占用。然后在终端依次运行：

```bash
cd "$HOME/Documents/ZhuRi"
chmod +x scripts/*.sh scripts/*.command
./scripts/install-mac-launch-agent.sh
```

看到 `安装成功` 后，在 Safari 打开 `http://127.0.0.1:8765/` 检查。这个脚本会在你的个人 `~/Library/LaunchAgents/` 中注册一个仅当前用户运行的后台服务；通常下次**登录 Mac**时自动启动。

如果脚本提示 Permission denied，确认上一条 `chmod +x` 已运行；如果提示找不到文件夹，确认项目确实位于 `~/Documents/ZhuRi`。

### 以后想取消开机自动启动？

```bash
cd "$HOME/Documents/ZhuRi"
./scripts/uninstall-mac-launch-agent.sh
```

取消后不会删除你的学习计划数据，但停止服务后 Plash 的本地网址将无法加载。**不要一边保留旧的自启脚本，一边将项目文件夹搬到别处**；先卸载旧自启，再移动文件夹，再重新安装。

## 第 7 步：查看或重载

每次打开 Safari 输入 `http://127.0.0.1:8765/` 都能查看。想让 Plash 刷新（确认已装 Plash）可以在终端运行：

```bash
open -g plash:reload
```

> 数据不在 GitHub 仓库；它默认存在 **Plash 这份网页自己的浏览器存储**。从 Safari 里打卡不保证与 Plash 同步，更换网址或清理缓存前务必在相应环境中导出 JSON 备份。

## 什么时候需要联网？

安装和更新 Python、Plash、项目 ZIP 时需要网络。**本机 `127.0.0.1` 服务、页面倒计时、时间表和存储无需互联网**。只要 Mac 已开机登录、服务运行、Plash 工作正常，断网也能显示桌面。

上一页：[README](../README.md) ｜后续：[使用教程](03-how-to-use.md)
