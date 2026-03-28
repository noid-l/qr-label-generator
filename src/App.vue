<template>
  <div class="flex min-h-screen flex-col text-slate-900">
    <header class="px-4 pt-4 sm:px-6 sm:pt-6">
      <div class="mx-auto max-w-6xl">
        <div class="overflow-hidden rounded-[32px] border border-white/20 bg-slate-900 px-6 py-8 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.7)] sm:px-8">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-3xl">
              <h1 class="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
                通用二维码生成工具
              </h1>
              <p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                支持文本、URL、WiFi、名片四种模式，自定义尺寸与纠错等级，一键下载 PNG。
              </p>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                <p class="text-xs uppercase tracking-[0.18em] text-slate-300">交互层</p>
                <p class="mt-1 text-base font-semibold text-white">Headless UI</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                <p class="text-xs uppercase tracking-[0.18em] text-slate-300">样式层</p>
                <p class="mt-1 text-base font-semibold text-white">Tailwind CSS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="mx-auto flex w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <TabGroup
        class="w-full"
        :selected-index="selectedTabIndex"
        @change="selectedTabIndex = $event"
      >
        <div class="panel-card p-3 sm:p-4">
          <TabList class="grid gap-2 rounded-[24px] bg-slate-100/80 p-2 sm:grid-cols-4">
            <Tab v-for="tab in tabs" :key="tab.key" as="template" v-slot="{ selected }">
              <button
                type="button"
                class="rounded-2xl px-4 py-3 text-sm font-semibold transition sm:text-base"
                :class="tabButtonClass(selected)"
              >
                <span class="block">{{ tab.label }}</span>
                <span
                  class="mt-1 block text-xs font-normal sm:text-sm"
                  :class="selected ? 'text-teal-100' : 'text-slate-500'"
                >
                  {{ tab.description }}
                </span>
              </button>
            </Tab>
          </TabList>

          <TabPanels class="mt-4 sm:mt-6">
            <TabPanel class="focus:outline-none">
              <TextGenerator />
            </TabPanel>

            <TabPanel class="focus:outline-none">
              <UrlGenerator />
            </TabPanel>

            <TabPanel class="focus:outline-none">
              <WifiGenerator />
            </TabPanel>

            <TabPanel class="focus:outline-none">
              <VcardGenerator />
            </TabPanel>
          </TabPanels>
        </div>
      </TabGroup>
    </main>

    <footer class="px-4 pb-6 sm:px-6">
      <div class="mx-auto max-w-6xl rounded-2xl border border-white/30 bg-white/70 px-4 py-4 text-center text-sm text-slate-500 shadow-sm backdrop-blur">
        通用二维码生成工具
      </div>
    </footer>

    <div class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-end">
      <TransitionGroup name="toast" tag="div" class="flex w-full max-w-sm flex-col gap-3">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto rounded-2xl border px-4 py-3 shadow-xl backdrop-blur"
          :class="toastToneClass(toast.type)"
        >
          <div class="flex items-start gap-3">
            <div
              class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              :class="toastIconToneClass(toast.type)"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                class="h-4 w-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :d="toastIconPath(toast.type)"
                />
              </svg>
            </div>

            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold">{{ toast.title }}</p>
              <p class="mt-1 text-sm leading-6 text-slate-600">{{ toast.message }}</p>
            </div>

            <button
              type="button"
              class="rounded-full p-1 text-slate-400 transition hover:bg-white/80 hover:text-slate-700"
              @click="removeToast(toast.id)"
            >
              <span class="sr-only">关闭通知</span>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
                <path stroke-linecap="round" d="M6 6l8 8M14 6l-8 8" />
              </svg>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import TextGenerator from '@/components/TextGenerator.vue'
import UrlGenerator from '@/components/UrlGenerator.vue'
import WifiGenerator from '@/components/WifiGenerator.vue'
import VcardGenerator from '@/components/VcardGenerator.vue'
import { useToast, type ToastType } from '@/composables/useToast'

const tabs = [
  { key: 'text', label: '文本', description: '任意文本内容' },
  { key: 'url', label: 'URL', description: '链接地址' },
  { key: 'wifi', label: 'WiFi', description: 'WiFi 连接' },
  { key: 'vcard', label: '名片', description: '联系人信息' },
] as const

const activeTab = ref<(typeof tabs)[number]['key']>('text')
const selectedTabIndex = computed({
  get: () => tabs.findIndex((tab) => tab.key === activeTab.value),
  set: (index: number) => {
    const nextTab = tabs[index]
    if (nextTab) {
      activeTab.value = nextTab.key
    }
  },
})

const { toasts, removeToast } = useToast()

function tabButtonClass(selected: boolean): string {
  return selected
    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
    : 'bg-white/70 text-slate-700 hover:bg-white hover:text-slate-900'
}

function toastToneClass(type: ToastType): string {
  switch (type) {
    case 'success':
      return 'border-emerald-200 bg-white/90 text-slate-900'
    case 'error':
      return 'border-rose-200 bg-white/90 text-slate-900'
    case 'warning':
      return 'border-amber-200 bg-white/90 text-slate-900'
    default:
      return 'border-sky-200 bg-white/90 text-slate-900'
  }
}

function toastIconToneClass(type: ToastType): string {
  switch (type) {
    case 'success':
      return 'bg-emerald-100 text-emerald-700'
    case 'error':
      return 'bg-rose-100 text-rose-700'
    case 'warning':
      return 'bg-amber-100 text-amber-700'
    default:
      return 'bg-sky-100 text-sky-700'
  }
}

function toastIconPath(type: ToastType): string {
  switch (type) {
    case 'success':
      return 'M5 10.5l3.2 3.2L15 7'
    case 'error':
      return 'M10 6v4m0 4h.01M10 18a8 8 0 100-16 8 8 0 000 16z'
    case 'warning':
      return 'M10 7v4m0 3h.01M8.62 3.58l-6 10.5A1 1 0 003.5 15.5h13a1 1 0 00.87-1.42l-6-10.5a1 1 0 00-1.74 0z'
    default:
      return 'M10 6.75h.01M9.25 9.5h1.5v4h-1.5m.75 4.5a8 8 0 100-16 8 8 0 000 16z'
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active,
.toast-move {
  transition: all 0.22s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
</style>
