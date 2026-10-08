# 逐日 ZhuRi · 桌面计划时间管理

> 把「现在要做什么、还剩多久、下一件是什么」留在 Mac 桌面上。

**逐日**是一个免费开源、本地优先的桌面时间管理网页，适合学习、工作、阅读、运动与日常安排。**不是考试专用软件**，也**没有内置开发者的个人学习数据**。不需要注册账号，也不需要把自己的计划上传给仓库作者。

![逐日亮色桌面](assets/preview-light.webp)

**你只需要一台 Mac，就能按教程把它装成桌面计划面板。** 首次使用时选择空白计划或通用示例，再改成自己的安排即可。

## ✅ 已有功能

- **当前任务**：显示正在进行的安排、精确到秒的倒计时、进度条和下一项预告。
- **每日时间表**：开始时间、结束时间、安排、类别、科目/项目、自动计算的时长，按星期重复。
- **计划/任务**：自定义项目、阶段、任务，手动打卡并显示进度；时间表与计划可关联。
- **卡片内导航**：只替换时间表卡片的内容，不打开多个窗口。
- **桌面留白**：拖动细胶囊，给 Finder 桌面文件图标留空间；可用方向键微调、双击重置。
- **自动适配屏幕**：在 MacBook Air、MacBook Pro、MacBook Neo 等不同尺寸和显示缩放下，依据**实际面板宽度**调整字号、列宽和排布，窗口过窄时重排内容；并非只识别某种电脑型号。
- **跟随系统外观**：macOS 深色/浅色变化时自动同步，不添加手动模式按钮。
- **本地存储**：无账号、无统计追踪；可导出/导入 JSON 备份。
- **两种部署**：本机离线使用，或者放在**你自己的 GitHub 仓库**里通过 Pages 在线访问。

## 🧭 新手从这里开始

**完全没接触过代码？照着下面对应教程做就行。** 每份教程从下载软件、点击哪个菜单、输入什么命令写起。

| 你的目标 | 推荐教程 | 是否需要互联网 |
|---|---|---|
| **最推荐**：断网也能用，Mac 桌面长期显示 | [教程① Mac 本地离线部署：下载→安装 Python→Plash→开机启动](docs/01-mac-local.md) | 下载软件时需要；**使用时不需要** |
| 网页可以分享，用自己的 GitHub 账号发布 | [教程② GitHub Pages 在线部署：Fork 到**你自己的账号**→开启 Pages→接入 Plash](docs/02-github-pages.md) | 首次打开需要；后续离线缓存不保证 Plash 断网可启动 |
| 不知道怎么创建时间表和任务 | [教程③ 从第一次打开到每天使用](docs/03-how-to-use.md) | 不需要 |
| 显示异常、没有倒计时、忘记如何停服务 | [教程④ 常见问题排查](docs/04-troubleshooting.md) | 不需要 |
| 更换 Mac 或怕丢数据 | [教程⑤ 备份、恢复与隐私说明](docs/05-data-and-privacy.md) | 不需要 |
| 不同尺寸 MacBook 如何自适应 | [教程⑥ 屏幕适配与测试范围](docs/06-screen-support.md) | 不需要 |

**下载项目源码：** 本页面右上角点击绿色 **Code** → **Download ZIP** → 在「下载」文件夹双击解压。解压后得到的整个项目文件夹都要保留，**不要只拿走 `index.html`**。

**如果你只想体验网页：** 项目文件夹里有 `index.html`，但某些浏览器在 `file://` 地址下会限制存储或离线能力。请按教程用本地服务打开，不要把直接双击 HTML 作为正式方案。

## 📌 一定要分清这两个 GitHub 仓库

- **本仓库 `12668426/zhu-ri-open`：只发布开源源代码。** 它不是所有用户共用的个人计划存储空间。
- **你的仓库：** 你登录**自己的 GitHub** 后 Fork 或复制本项目，再在**你自己的仓库 Settings → Pages** 开启网站。你的网站地址应类似 `https://你的用户名.github.io/zhu-ri-open/`，不是作者的网址。详细见[教程②](docs/02-github-pages.md)。
- GitHub 仓库代码公开 ≠ 用户本地 `localStorage` 自动公开。仍不要把含私人计划的备份 JSON 提交到公开仓库。

## 🗂 项目结构

```text
zhu-ri-open/
├── index.html                     网页入口
├── src/
│   ├── style.css                  基础样式及 macOS 深浅色
│   ├── adaptive.css               自适应 Mac 屏幕、容器布局与显示缩放
│   └── app.js                     日程、任务、倒计时、存储及交互
├── assets/                        原创图标、界面预览
├── docs/                          完整中文入门教程
├── scripts/
│   ├── run-local.command          双击启动本地服务
│   ├── install-mac-launch-agent.sh  登录自动启动本地服务
│   └── uninstall-mac-launch-agent.sh 停止自启动
├── sw.js                          在线版基础离线资源缓存
├── manifest.webmanifest           网页应用元数据
├── tests/                         静态及浏览器基础测试
├── .github/workflows/check.yml    自动代码检查
├── README_EN.md                   English overview
├── LICENSE                        MIT 许可证
└── SECURITY.md                    安全与隐私信息
```

## ⚠️ 离线和数据重要说明

- **本地模式**：网页请求 `http://127.0.0.1:8765/`，访问的是**你自己的 Mac**，无互联网也能用，但本机 Python 服务需保持运行；`file://` 文件地址不能直接作为 Plash 的有效网址。
- **在线模式**：GitHub Pages 首次加载需要联网，虽然包含基础 Service Worker 缓存，但 Plash 的离线缓存和断网重启行为尚未在所有 macOS/Plash 版本上验证。
- **计划数据只默认存于当前网页的浏览器存储**。Safari、Plash、本地 URL、GitHub Pages URL 之间可能相互隔离，不会自动同步。**迁移、清理缓存、换网址前务必「调整日程 → 导出 JSON」备份**。
- 本项目不是日历系统通知应用；倒计时仅在页面运行时更新，不会在系统后台推送提醒。

## 参与贡献与授权

本仓库遵循 [MIT License](LICENSE)，欢迎问题反馈与代码贡献，见 [CONTRIBUTING.md](CONTRIBUTING.md)。

需要开发测试：

```bash
node --check src/app.js
node tests/static-check.mjs
python3 tests/smoke.py
```

以上命令用于开发者检查，**普通用户不需要学这些命令才能使用逐日**。测试环境中模拟浏览器不能代表所有真实 MacBook/Plash 组合，更多见[屏幕适配说明](docs/06-screen-support.md)。
