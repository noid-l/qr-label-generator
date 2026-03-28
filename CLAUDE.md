# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

通用二维码生成工具 — 支持文本、URL、WiFi、名片 vCard 四种模式的纯前端 Web 应用。可自定义尺寸与纠错等级，一键下载 PNG。

## 技术栈

- **框架**: Vue 3.5 (Composition API + `<script setup>`)
- **构建工具**: Vite 7
- **UI 组件**: @headlessui/vue 1（TabGroup 等无样式组件）
- **样式**: Tailwind CSS 4（通过 `@tailwindcss/vite` 插件集成，自定义组件层在 `style.css`）
- **二维码**: qrcode.vue 3
- **类型检查**: vue-tsc + TypeScript strict mode
- **包管理器**: Bun
- **部署**: Cloudflare Pages (Wrangler CLI)

## 开发命令

```bash
bun install              # 安装依赖
bun run dev              # 开发服务器 (localhost:5173)
bun run build            # vue-tsc 类型检查 + vite 构建
bun run preview          # 预览构建产物
bun run deploy           # 构建 + 部署到 Cloudflare Pages (默认分支)
bun run deploy:prod      # 构建 + 部署到 production 分支
```

注意：没有配置 linter、formatter 或测试框架。`bun run build` 会执行 vue-tsc 类型检查。

## 架构

纯前端 SPA，无路由、无 API 调用、无后端依赖。所有状态在浏览器本地管理。

### 数据流

```
App.vue (根组件, Headless UI TabGroup 四标签页: 文本 / URL / WiFi / 名片)
├── TextGenerator.vue    ← 文本输入 + QR 预览 + 下载
├── UrlGenerator.vue     ← URL 输入 + QR 预览 + 下载
├── WifiGenerator.vue    ← WiFi 配置 + QR 预览 + 下载
└── VcardGenerator.vue   ← vCard 联系人 + QR 预览 + 下载
```

### 状态管理

**没有使用 Pinia**。Pinia 在 `package.json` 中声明但未实际使用。每个 Generator 组件内部自行管理状态，通过 `computed` 实时生成 QR 编码内容。全局 Toast 通过 composable (`useToast.ts`) 管理。

### 二维码编码格式

| 模式 | 编码格式 |
|------|---------|
| 文本 | 直接编码原始文本 |
| URL | 直接编码 URL 字符串 |
| WiFi | `WIFI:T:{加密};S:{SSID};P:{密码};;` |
| 名片 | vCard 3.0 标准格式 |

### 样式体系

`src/style.css` 使用 Tailwind CSS 4 的 `@layer components` 定义了全局复用的工具类：

| 类名 | 用途 |
|------|------|
| `panel-card` | 卡片容器（圆角、阴影、毛玻璃） |
| `panel-title` / `panel-subtitle` | 面板标题/副标题 |
| `field-label` | 表单标签 |
| `input-base` | 输入框基础样式 |
| `btn-base` / `btn-primary` / `btn-secondary` | 按钮变体 |

### 关键模块

| 文件 | 职责 |
|------|------|
| `src/composables/useQrCode.ts` | QR 编码逻辑：文本、URL、WiFi、vCard 四种编码函数 |
| `src/composables/useToast.ts` | 全局 Toast 通知系统（success/error/warning/info） |
| `src/utils/downloader.ts` | 从 Canvas DataURL 下载 PNG 图片 |
| `src/utils/constants.ts` | 纠错等级选项、WiFi 加密类型、尺寸预设 |
| `src/types/index.ts` | 类型定义：QrMode、ErrorCorrectionLevel、WifiConfig、VcardData |

## 构建配置

`vite.config.ts`：
- 路径别名 `@` → `./src`
- 插件：`@vitejs/plugin-vue` + `@tailwindcss/vite`
- manualChunks: `vue-vendor`（vue + pinia）分离打包
- terser 压缩，不生成 sourcemap

`tsconfig.app.json`：
- `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`
- `erasableSyntaxOnly: true`, `noUncheckedSideEffectImports: true`

## 环境变量

参考 `.env.example`，可配置 `VITE_API_BASE_URL`、`VITE_APP_TITLE`、`VITE_QR_CODE_PREFIX_URL`。创建 `.env.local` 使用（已 gitignore）。

## 代码风格

- 2 空格缩进，单引号，无尾分号
- 组件文件 PascalCase，工具/类型文件 camelCase
- 不使用 Element Plus，UI 通过 Headless UI 无样式组件 + Tailwind CSS 手写样式构建
- `main.ts` 极简：仅创建 Vue 应用实例并挂载，无全局组件注册
