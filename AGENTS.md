# AGENTS.md - 通用二维码生成工具

**项目**: 通用二维码生成工具 (qr-label-generator)
**技术栈**: Vue 3.5 + Vite 7 + @headlessui/vue + Tailwind CSS 4 + TypeScript
**部署**: Cloudflare Pages

本文档为 AI 智能体在 qr-label-generator 代码库中工作提供编码指南。

---

## 快速参考

| 任务 | 命令 |
|------|------|
| 安装依赖 | `bun install` |
| 开发 | `bun run dev` |
| 构建 | `bun run build` |
| 预览 | `bun run preview` |
| 部署 (默认) | `bun run deploy` |
| 部署 (生产) | `bun run deploy:prod` |

---

## 项目结构

```
src/
├── App.vue                # 根组件（TabGroup 四标签页 + Toast 容器）
├── main.ts                # 应用入口（极简，仅 createApp + mount）
├── style.css              # Tailwind CSS 4 全局样式 + @layer components 工具类
├── components/
│   ├── TextGenerator.vue  # 文本模式：textarea 输入 + 预览 + 下载
│   ├── UrlGenerator.vue   # URL 模式：URL 输入 + 预览 + 下载
│   ├── WifiGenerator.vue  # WiFi 模式：SSID/密码/加密 + 预览 + 下载
│   └── VcardGenerator.vue # 名片模式：vCard 表单 + 预览 + 下载
├── composables/
│   ├── useQrCode.ts       # QR 编码逻辑（文本/URL/WiFi/vCard 四种编码函数）
│   └── useToast.ts        # 全局 Toast 通知系统
├── types/
│   └── index.ts           # QrMode, ErrorCorrectionLevel, WifiConfig, VcardData
└── utils/
    ├── constants.ts       # 纠错等级选项、WiFi 加密类型、尺寸预设
    └── downloader.ts      # Canvas DataURL → PNG 下载
```

---

## 代码风格

- **缩进**: 2 空格
- **引号**: 单引号 `'`
- **分号**: 无分号
- **组件命名**: PascalCase
- **文件命名**: 组件 PascalCase，工具/composable camelCase

### Composition API 模式

```typescript
<script setup lang="ts">
import { computed, ref } from 'vue'
import QrCode from 'qrcode.vue'

const text = ref('')
const qrValue = computed(() => text.value.trim())
const qrRef = ref<InstanceType<typeof QrCode> | null>(null)
</script>
```

### 类型安全
- 所有组件 props 使用 `defineProps<Props>()` 宏
- 事件使用 `defineEmits<Emits>()` 定义类型
- 严格模式开启，未使用变量/参数会报错

---

## 技术架构

### 核心依赖
- **Vue 3.5** - Composition API + `<script setup>`
- **Vite 7** - 构建工具
- **@headlessui/vue 1** - 无样式可访问组件（TabGroup、Tab、TabList、TabPanel）
- **Tailwind CSS 4** - 原子化 CSS，`@tailwindcss/vite` 插件
- **qrcode.vue 3** - 二维码渲染（Canvas 模式）
- **TypeScript 5.9** - 严格类型检查

### 构建配置
- **Base**: `/`
- **输出**: `dist/`
- **代码分割**: `vue-vendor`（vue + pinia）
- **压缩**: Terser，无 sourcemap

### 类型配置
- `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`

---

## QR 编码格式

| 模式 | 编码 |
|------|------|
| 文本 | 原始文本直接编码 |
| URL | URL 字符串直接编码 |
| WiFi | `WIFI:T:{WPA/WEP/nopass};S:{SSID};P:{password};;` |
| vCard | vCard 3.0 格式：`BEGIN:VCARD\nVERSION:3.0\nFN:{name}\n...\nEND:VCARD` |

---

## 常见问题

### Q: 如何添加新的 QR 模式？
A: 1) 在 `types/index.ts` 添加 `QrMode` 变体；2) 创建新 Generator 组件；3) 在 `App.vue` 的 tabs 数组添加新标签页。

### Q: 下载如何工作？
A: 通过 `qrcode.vue` 渲染的 `<canvas>` 元素，调用 `canvas.toDataURL('image/png')` 获取 DataURL 后触发下载。

---

## 相关文档

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Headless UI](https://headlessui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [qrcode.vue](https://github.com/scopewu/qrcode.vue)
- [Cloudflare Pages](https://pages.cloudflare.com/)
