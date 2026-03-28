# 通用二维码生成工具

一个支持多种输入类型的二维码生成器，可生成纯文本、URL 链接、WiFi 配置、名片 vCard 等类型的二维码。纯前端 Web 应用，无需后端服务。

## 功能特性

- **文本模式** - 输入任意文本内容生成二维码
- **URL 模式** - 输入链接，扫码即可跳转
- **WiFi 模式** - 填写 SSID、密码、加密类型，扫码自动连接 WiFi
- **名片模式** - 填写联系人信息，生成 vCard 格式二维码，扫码即可添加联系人
- **自定义尺寸** - 自由输入像素值（建议 128–2048），控制输出图片大小
- **纠错等级** - L / M / Q / H 四档可选，控制容错能力与数据容量
- **下载 PNG** - 一键下载生成的二维码图片

## 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite 7
- **UI 组件**: @headlessui/vue + Tailwind CSS 4
- **二维码库**: qrcode.vue

## 安装和运行

### 安装依赖

```bash
bun install
```

### 开发环境

```bash
bun run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
bun run build
```

构建产物位于 `dist/` 目录。

### 预览生产构建

```bash
bun run preview
```

## 使用说明

### 文本模式

1. 切换到「文本」标签页
2. 在文本框中输入任意内容
3. 调整二维码尺寸和纠错等级（可选）
4. 预览区实时显示二维码
5. 点击「下载」保存 PNG 图片

### URL 模式

1. 切换到「URL」标签页
2. 输入完整的 URL 地址（如 `https://example.com`）
3. 调整二维码尺寸和纠错等级（可选）
4. 预览区实时显示二维码
5. 点击「下载」保存 PNG 图片

### WiFi 模式

1. 切换到「WiFi」标签页
2. 填写以下信息：
   - **网络名称（SSID）** - WiFi 名称
   - **密码** - WiFi 密码
   - **加密类型** - WPA/WEP/无加密
3. 调整二维码尺寸和纠错等级（可选）
4. 预览区实时显示二维码
5. 点击「下载」保存 PNG 图片

WiFi 二维码编码格式：`WIFI:T:{加密类型};S:{SSID};P:{密码};;`

### 名片模式

1. 切换到「名片」标签页
2. 填写联系人信息：
   - **姓名**（必填）
   - **电话**
   - **邮箱**
   - **公司**
   - **职位**
   - **地址**
   - **网站**
3. 调整二维码尺寸和纠错等级（可选）
4. 预览区实时显示二维码
5. 点击「下载」保存 PNG 图片

名片二维码编码格式为 vCard 3.0 标准。

## 二维码技术参考

### 尺寸说明

输入的像素值决定输出图片的分辨率，**不影响二维码可存储的数据量**。二维码的数据容量由纠错等级和编码模式决定。

建议尺寸：
| 场景 | 推荐尺寸 |
|------|---------|
| 屏幕显示 | 256×256 |
| 普通打印 | 512×512 |
| 高清打印 / 海报 | 1024×1024 或更大 |

### 纠错等级

纠错等级越高，二维码能容忍的损坏越多，但可存储的数据量越少。

| 等级 | 容错率 | 适用场景 |
|------|--------|---------|
| L | ~7% | 数据量大、环境干净 |
| M | ~15% | 通用场景（默认） |
| Q | ~25% | 可能部分遮挡或磨损 |
| H | ~30% | 需要嵌入 Logo 或恶劣环境 |

### 数据容量参考

二维码版本 40（最大）在不同纠错等级下的最大数据容量：

| 纠错等级 | 纯数字 | 字母数字 | 字节（含中文） |
|---------|--------|---------|--------------|
| L | 7,089 字符 | 4,296 字符 | 2,953 字节 |
| M | 5,596 字符 | 3,391 字符 | 2,331 字节 |
| Q | 3,993 字符 | 2,420 字符 | 1,663 字节 |
| H | 3,057 字符 | 1,852 字符 | 1,273 字节 |

> 实际容量由二维码库根据内容自动选择最优版本和编码模式，无需手动配置。

## 项目结构

```
qr-label-generator/
├── public/                 # 静态资源
├── src/
│   ├── components/         # Vue 组件
│   │   ├── TextGenerator.vue       # 文本模式
│   │   ├── UrlGenerator.vue        # URL 模式
│   │   ├── WifiGenerator.vue       # WiFi 模式
│   │   └── VcardGenerator.vue      # 名片模式
│   ├── composables/        # Composables
│   │   └── useQrCode.ts            # 二维码生成逻辑
│   ├── types/              # TypeScript 类型定义
│   │   └── index.ts
│   ├── utils/              # 工具函数
│   │   ├── downloader.ts           # 图片下载工具
│   │   └── constants.ts            # 常量配置
│   ├── App.vue             # 主应用组件
│   ├── main.ts             # 应用入口
│   └── style.css           # 全局样式
├── index.html              # HTML 模板
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
└── package.json            # 项目依赖
```

## 部署到 Cloudflare Pages

### 方式 1: 通过 Git 自动部署 (推荐)

1. 推送代码到 GitHub/GitLab
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 进入 **Pages** → **创建项目**
4. 连接 Git 仓库，配置构建设置:
   ```
   构建命令: bun run build
   构建输出目录: dist
   Root 目录: /
   Node.js 版本: 18
   ```
5. 点击 **部署**，自动获得 `https://your-project.pages.dev`

### 方式 2: 通过 Wrangler CLI 手动部署

```bash
# 1. 安装 Wrangler
bun add -D wrangler

# 2. 登录 Cloudflare
npx wrangler login

# 3. 构建并部署
bun run deploy
```

### 自定义域名

1. 在 Cloudflare Pages 项目中进入 **Custom domains**
2. 添加自定义域名 (如 `qr.example.com`)
3. DNS 自动配置，SSL 证书自动生成

### 环境变量配置

在 Pages 设置中添加环境变量:
```
VITE_APP_TITLE = 通用二维码生成工具
```

## 许可证

MIT
