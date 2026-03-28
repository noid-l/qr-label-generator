<template>
  <section class="space-y-5">
    <article class="panel-card px-5 py-5 sm:px-6">
      <div class="mb-6">
        <h2 class="panel-title">WiFi 模式</h2>
        <p class="panel-subtitle">填写 WiFi 信息，扫码自动连接。</p>
      </div>

      <form class="space-y-5" @submit.prevent>
        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="field-label" for="wifi-ssid">网络名称 (SSID)</label>
            <input
              id="wifi-ssid"
              v-model="ssid"
              class="input-base"
              type="text"
              placeholder="WiFi 名称"
            />
          </div>

          <div>
            <label class="field-label" for="wifi-encryption">加密类型</label>
            <select id="wifi-encryption" v-model="encryption" class="input-base">
              <option
                v-for="opt in WIFI_ENCRYPTION_OPTIONS"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="field-label" for="wifi-password">密码</label>
          <input
            id="wifi-password"
            v-model="password"
            class="input-base"
            type="text"
            placeholder="WiFi 密码"
            :disabled="encryption === 'nopass'"
          />
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="field-label" for="wifi-size">二维码尺寸 (px)</label>
            <input
              id="wifi-size"
              v-model.number="qrSize"
              class="input-base"
              type="number"
              min="128"
              max="2048"
              step="64"
            />
          </div>

          <div>
            <label class="field-label" for="wifi-error">纠错等级</label>
            <select id="wifi-error" v-model="errorLevel" class="input-base">
              <option
                v-for="opt in ERROR_CORRECTION_LEVELS"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>
      </form>
    </article>

    <article v-if="qrValue" class="panel-card px-5 py-5 sm:px-6">
      <div class="mb-6">
        <h2 class="panel-title">预览</h2>
        <p class="panel-subtitle">二维码实时预览，点击下方按钮下载 PNG 图片。</p>
      </div>

      <div class="flex justify-center">
        <div class="rounded-2xl bg-slate-50 p-6">
          <QrCode
            ref="qrRef"
            :value="qrValue"
            :size="256"
            :level="errorLevel"
          />
        </div>
      </div>

      <p class="mt-4 text-center text-xs text-slate-500 break-all">{{ qrValue }}</p>

      <div class="mt-6 flex justify-center">
        <button type="button" class="btn-base btn-primary" @click="handleDownload">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 4v8m0 0l-3-3m3 3l3-3M4 14.5V16h12v-1.5" />
          </svg>
          下载 PNG
        </button>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import QrCode from 'qrcode.vue'
import { useToast } from '@/composables/useToast'
import { ERROR_CORRECTION_LEVELS, WIFI_ENCRYPTION_OPTIONS, DEFAULT_QR_SIZE } from '@/utils/constants'
import { downloadQrImage } from '@/utils/downloader'
import type { ErrorCorrectionLevel } from '@/types'

const ssid = ref('')
const password = ref('')
const encryption = ref<'WPA' | 'WEP' | 'nopass'>('WPA')
const qrSize = ref(DEFAULT_QR_SIZE)
const errorLevel = ref<ErrorCorrectionLevel>('M')
const qrRef = ref<InstanceType<typeof QrCode> | null>(null)
const { success, error } = useToast()

watch(encryption, (val) => {
  if (val === 'nopass') {
    password.value = ''
  }
})

const qrValue = computed(() => {
  if (!ssid.value.trim()) return ''
  const enc = encryption.value === 'nopass' ? 'nopass' : encryption.value
  return `WIFI:T:${enc};S:${ssid.value};P:${password.value};;`
})

function handleDownload(): void {
  const canvas = (qrRef.value?.$el as HTMLCanvasElement | undefined)
  if (!canvas) {
    error('请先填写 WiFi 信息')
    return
  }
  downloadQrImage(canvas, `qrcode_wifi_${ssid.value}_${Date.now()}.png`, qrSize.value)
  success('下载成功')
}
</script>
