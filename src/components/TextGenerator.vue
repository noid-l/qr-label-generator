<template>
  <section class="space-y-5">
    <article class="panel-card px-5 py-5 sm:px-6">
      <div class="mb-6">
        <h2 class="panel-title">文本模式</h2>
        <p class="panel-subtitle">输入任意文本内容，生成对应二维码。</p>
      </div>

      <form class="space-y-5" @submit.prevent>
        <div>
          <label class="field-label" for="text-input">文本内容</label>
          <textarea
            id="text-input"
            v-model="text"
            class="input-base textarea-base"
            placeholder="输入需要编码的文本内容"
            rows="4"
          />
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="field-label" for="text-size">二维码尺寸 (px)</label>
            <input
              id="text-size"
              v-model.number="qrSize"
              class="input-base"
              type="number"
              min="128"
              max="2048"
              step="64"
            />
          </div>

          <div>
            <label class="field-label" for="text-error">纠错等级</label>
            <select id="text-error" v-model="errorLevel" class="input-base">
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
import { ERROR_CORRECTION_LEVELS, DEFAULT_QR_SIZE } from '@/utils/constants'
import { downloadQrImage } from '@/utils/downloader'
import type { ErrorCorrectionLevel } from '@/types'

const text = ref('')
const qrSize = ref(DEFAULT_QR_SIZE)
const errorLevel = ref<ErrorCorrectionLevel>('M')
const qrRef = ref<InstanceType<typeof QrCode> | null>(null)
const { success, error } = useToast()

const qrValue = computed(() => text.value.trim())

watch(text, (val) => {
  if (!val.trim()) {
    qrRef.value = null
  }
})

function handleDownload(): void {
  const canvas = (qrRef.value?.$el as HTMLCanvasElement | undefined)
  if (!canvas) {
    error('请先输入文本内容')
    return
  }
  downloadQrImage(canvas, `qrcode_text_${Date.now()}.png`, qrSize.value)
  success('下载成功')
}
</script>
