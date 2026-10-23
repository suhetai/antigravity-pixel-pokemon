# ⚡ Antigravity Pixel Pokémon (`antigravity-pixel-pokemon`)

专为 **Antigravity Desktop App** 打造的左下角像素宝可梦桌宠伴侣插件。每次打开 App 或重新唤出（聚焦）窗口时，左下角会自动随机召唤一只高清透明背景的像素宝可梦 GIF 动图（数据源来自 [Tenor Pixel Pokémon GIFs](https://tenor.com/zh-CN/search/pixel-pokemon-gifs)）。

---

## ✨ 核心特性

1. **打开 App / 唤出窗口自动随机切换**
   - 每次启动 Antigravity、打开新窗口，或从其他应用切回（聚焦）Antigravity 窗口时，左下角 `Settings` 按钮正上方会自动随机召唤一只像素宝可梦并播放弹出动效。
   - 内置 **38 只纯透明背景动态像素宝可梦**（0ms 瞬时加载），已剔除带有背景框、边缘噪点或单帧静态的图片。

2. **像素级包围盒比例统一（拒绝忽大忽小）**
   - 通过 `ImageDecoder` 预扫描每只宝可梦全帧动画的实际非透明像素包围盒 (`bbox`)，自动按宝可梦主体尺寸进行归一化缩放与中心对齐。无论是原生 `37×38` 的妙蛙种子、`54×47` 的异色基拉祈，还是带画布留白的超梦、杰尼龟，视觉比例完全统一。

3. **纯净无边框桌宠体验 & 内置图鉴画廊**
   - **完全透明无边框**：去除一切外框与阴影裁切边界，像素宝可梦纯净悬浮在左下角。
   - **点击即换 (`🎲`)**：直接点击宝可梦动图（或悬停点击右上角 `🎲`），立即随机切换下一只宝可梦。
   - **伴侣锁定 (`🔓 / 📌`)**：遇到喜欢的宝可梦（如异色耿鬼、皮卡丘、喷火龙、梦幻、异色超级烈空座等），点击 `📌` 即可锁定，切换窗口时不再自动替换。
   - **内置宝可梦图鉴弹窗 (`📖`)**：点击右上角 `📖` 呼出宝可梦图鉴画廊，一览全部 38 只像素宝可梦动图，点击任意一只即可立即召唤至左下角。

---

## 🚀 一键安装（无需重启 Antigravity）

在终端执行以下命令即可完成安装并**立即在当前窗口左下角生效**：

```bash
git clone https://github.com/suhetai/antigravity-pixel-pokemon.git ~/.gemini/config/plugins/pixel-pokemon-widget
sh ~/.gemini/config/plugins/pixel-pokemon-widget/install.sh
```

> 如果已经克隆到本地其他目录，直接执行 `sh install.sh` 即可自动复制安装到 `~/.gemini/config/plugins/pixel-pokemon-widget` 并实时激活。

---

## 🧹 停用与卸载

- **停用并实时清理窗口左下角组件**（保留插件文件）：
  ```bash
  sh ~/.gemini/config/plugins/pixel-pokemon-widget/uninstall.sh
  ```
- **彻底卸载并删除插件目录**：
  ```bash
  sh ~/.gemini/config/plugins/pixel-pokemon-widget/uninstall.sh --delete
  ```

---

## 📁 目录结构

```text
antigravity-pixel-pokemon/
├── plugin.json                        # Antigravity 插件清单
├── install.sh                         # 一键安装与实时热注入脚本
├── uninstall.sh                       # 一键停用/卸载与 DOM 实时清理脚本
├── README.md                          # 说明文档
├── assets/
│   └── logo.svg                       # 像素精灵球图标
├── skills/
│   └── pixel-pokemon-control/
│       └── SKILL.md                   # 对话端控制技能
└── sidecars/
    └── pokemon/
        ├── sidecar.json               # Sidecar 声明 (含 Aux Pane 图鉴视图)
        ├── run.sh                     # 跨环境 Node 启动器
        ├── server.mjs                 # CDP 实时注入守护服务 & 图鉴 API
        └── client-widget.js           # 左下角像素宝可梦前端组件 (比例归一化 + 唤出窗口自动切换 + 图鉴弹窗)
```
