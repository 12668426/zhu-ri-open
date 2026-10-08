# 教程②：在自己的 GitHub 上发布逐日桌面壁纸（新手版）

> **不必先部署也能试用：** [点击这里直接打开「逐日」网页版](https://12668426.github.io/zhu-ri-open/)。不用 GitHub 账号、无需 Fork；已经安装 Plash 的用户，也可以直接粘贴该网址当桌面壁纸。想要**属于自己的独立网址**，再按下文教程在**自己的 GitHub 账号**上部署。

你可以把逐日发布成**自己的壁纸网址**，再用 Plash 放到 Mac 桌面上。**每个人都在自己的 GitHub 账号上部署**；开源仓库 `12668426/zhu-ri-open` 用于提供源码，不是所有人共同编辑计划的地方。

## 先理解：Fork、仓库与 Pages

- **GitHub 账号**：你自己的用户名和登录密码。
- **Fork**：复制一份开源项目到**你自己的账号**，不用输入终端命令。
- **Repository（仓库）**：你自己的那份代码。
- **GitHub Pages**：将你自己的仓库发布为你的网址。

> 在线部署的网站默认可以被别人访问。**不要把隐私资料、账号密码、私人备份 JSON 放进公开仓库里**。逐日运行时的本地计划默认不会自动上传到 GitHub。

## 第 1 步：注册并登录自己的 GitHub

1. 打开 https://github.com/signup 。已有账号直接打开 https://github.com/login 。
2. 按页面提示填写邮箱、密码、用户名，完成验证。
3. 登录后浏览器右上角显示你的头像，说明已经登录。

## 第 2 步：复制这个开源项目到你自己的账号

1. 打开项目开源地址：**https://github.com/12668426/zhu-ri-open**。
2. 点击右上角 **Fork** 按钮。
3. 在 **Owner（所有者）**里选**你自己的 GitHub 用户名**，不是 `12668426`。
4. 仓库名可以保留 `zhu-ri-open`，也可以改名，例如 `my-desktop-planner`。
5. 点击 **Create fork**，等待 GitHub 创建完成。
6. 看浏览器地址栏：它应该是 `https://github.com/你的用户名/你的仓库名`。**只要这里是你自己的账号，才算完成这一步。**

如果原仓库暂时没有 Fork 按钮，可以从绿色 **Code → Download ZIP** 下载源码后，在你的账号点击 **New repository** 创建新仓库，再用网页的 **Add file → Upload files** 上传**解压后的内容**（保留 `src`、`assets` 等目录结构）。建议优先使用 Fork，避免不小心漏传文件。

## 第 3 步：在**你自己的仓库**开启 Pages

1. 进入上一步得到的 `https://github.com/你的用户名/你的仓库名`。
2. 点击仓库顶部的 **Settings（设置）**。
3. 左侧找到 **Pages**（一般在 Code and automation 分组下面）。
4. 在 **Build and deployment** 中将 **Source** 选为 **Deploy from a branch**。
5. 在 **Branch** 下拉框选择你自己仓库的**默认分支**（可能叫 `main`，也可能像开源源仓库一样叫 `主要的`，**以你自己仓库显示的名称为准**）。
6. 文件夹选择 **/(root)**，点击 **Save**。
7. 等待 GitHub 发布；回到 Settings → Pages，查看官方显示的 **Visit site / Your site is live at...** 地址。

## 第 4 步：找到并确认属于自己的网址

网址**通常**像这样（请替换成你的 GitHub 用户名与仓库名）：

```text
https://你的用户名.github.io/你的仓库名/
```

例如用户名是 `alice`, 仓库叫 `my-desktop-planner`，则示例网址是：

```text
https://alice.github.io/my-desktop-planner/
```

**上面只是示例，真正网址以 GitHub Settings → Pages 给出的为准。** 不要把开源项目作者的 GitHub Pages 地址复制为自己的部署链接。打开网页看到「逐日」首次使用画面即可继续。

如果 Pages 显示 404，请等发布完成、检查 Branch/Folder 是否正确，确认仓库根目录有 `index.html`，再刷新；还可以去仓库 **Actions** 查看部署进度。

## 第 5 步：用 Plash 将自己的网址设置为桌面壁纸

1. 去 https://sindresorhus.com/plash ，通过官方 **Get** / Mac App Store 下载安装 **Plash**。
2. 打开 Plash，点击顶部菜单栏图标，选 **Add Website**。
3. 贴入**第 4 步由你自己 GitHub Pages 生成的完整网址**。
4. 确认保存并显示到 Mac 桌面。
5. 要点击卡片、打卡或拖动胶囊时，切换 Plash **Browsing Mode（浏览模式）**；不需要操作时关闭它。

## 第 6 步：以后如何更新到新版？

Fork 之后，你的仓库由你自己维护。你可以查看 GitHub Fork 页面上的 **Sync fork**（若 GitHub 提供），选择从源仓库获取公开更新；更新可能覆盖你直接修改过的代码，请先确认变更，计划数据也请定期备份。你的 Pages 网站网址通常不用改变。

## 想完全独立、不保留 Fork 关系？（进阶，可跳过）

可以自行创建一个全新仓库，并重新提交代码。操作需要先在 Mac 下载并安装 Git（若没有），不是初学者必需。已经有 Git 的用户可以：

```bash
# 从公开项目下载源代码，只作为起点
 git clone https://github.com/12668426/zhu-ri-open.git
 cd zhu-ri-open
# 删除源仓库历史，重新开始属于你自己的提交
 rm -rf .git
 git init
 git add .
 git commit -m "Initial commit: my ZhuRi"
 git branch -M main
# 在你自己 GitHub 账号创建一个空白仓库后，再替换下面的值
 git remote add origin https://github.com/你的用户名/你的仓库名.git
 git push -u origin main
```

**注意：** 上面的 `你的用户名`、`你的仓库名` 必须替换为你自己的真实值；不要直接执行包含占位符的两行命令。请先创建空仓库（不要勾 README），并且让终端处于刚克隆的项目文件夹中。若不会终端，请用上面的 Fork 方式。

## 离线说明

GitHub Pages **首次**打开需要联网。本项目有基础 Service Worker 缓存，在支持的浏览器里首次成功访问后可能离线加载，但**Plash 断网重启是否可用没有经过全面验证**。需要稳定离线桌面请使用[教程① 本地部署](01-mac-local.md)。

来源参考：[GitHub 官方 Pages 配置](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[Plash 官网](https://sindresorhus.com/plash)。

返回：[README](../README.md)
