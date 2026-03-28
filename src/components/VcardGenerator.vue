<template>
  <section class="space-y-5">
    <article class="panel-card px-5 py-5 sm:px-6">
      <div class="mb-6">
        <h2 class="panel-title">名片模式</h2>
        <p class="panel-subtitle">填写联系人信息，生成 vCard 格式二维码。</p>
      </div>

      <form class="space-y-5" @submit.prevent>
        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="field-label" for="vcard-name">
              姓名
              <span class="text-xs text-rose-500">*必填</span>
            </label>
            <input
              id="vcard-name"
              v-model="name"
              class="input-base"
              type="text"
              placeholder="张三"
            />
          </div>

          <div>
            <label class="field-label" for="vcard-phone">电话</label>
            <input
              id="vcard-phone"
              v-model="phone"
              class="input-base"
              type="tel"
              placeholder="13800138000"
            />
          </div>

          <div>
            <label class="field-label" for="vcard-email">邮箱</label>
            <input
              id="vcard-email"
              v-model="email"
              class="input-base"
              type="email"
              placeholder="zhangsan@example.com"
            />
          </div>

          <div>
            <label class="field-label" for="vcard-company">公司</label>
            <input
              id="vcard-company"
              v-model="company"
              class="input-base"
              type="text"
              placeholder="XX科技有限公司"
            />
          </div>

          <div>
            <label class="field-label" for="vcard-title">职位</label>
            <input
              id="vcard-title"
              v-model="title"
              class="input-base"
              type="text"
              placeholder="高级工程师"
            />
          </div>

          <div>
            <label class="field-label" for="vcard-website">网站</label>
            <input
              id="vcard-website"
              v-model="website"
              class="input-base"
              type="url"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div>
          <label class="field-label" for="vcard-address">地址</label>
          <input
            id="vcard-address"
            v-model="address"
            class="input-base"
            type="text"
            placeholder="北京市朝阳区XX路XX号"
          />
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="field-label" for="vcard-size">二维码尺寸 (px)</label>
            <input
              id="vcard-size"
              v-model.number="qrSize"
              class="input-base"
              type="number"
              min="128"
              max="2048"
              step="64"
            />
          </div>

          <div>
            <label class="field-label" for="vcard-error">纠错等级</label>
            <select id="vcard-error" v-model="errorLevel" class="input-base">
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
import { computed, ref } from 'vue'
import QrCode from 'qrcode.vue'
import { useToast } from '@/composables/useToast'
import { ERROR_CORRECTION_LEVELS, DEFAULT_QR_SIZE } from '@/utils/constants'
import { downloadQrImage } from '@/utils/downloader'
import type { ErrorCorrectionLevel } from '@/types'

const name = ref('')
const phone = ref('')
const email = ref('')
const company = ref('')
const title = ref('')
const address = ref('')
const website = ref('')
const qrSize = ref(DEFAULT_QR_SIZE)
const errorLevel = ref<ErrorCorrectionLevel>('M')
const qrRef = ref<InstanceType<typeof QrCode> | null>(null)
const { success, error } = useToast()

const qrValue = computed(() => {
  if (!name.value.trim()) return ''

  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name.value}`,
  ]

  if (company.value) lines.push(`ORG:${company.value}`)
  if (title.value) lines.push(`TITLE:${title.value}`)
  if (phone.value) lines.push(`TEL:${phone.value}`)
  if (email.value) lines.push(`EMAIL:${email.value}`)
  if (address.value) lines.push(`ADR:;;${address.value};;;;`)
  if (website.value) lines.push(`URL:${website.value}`)

  lines.push('END:VCARD')

  return lines.join('\n')
})

function handleDownload(): void {
  const canvas = (qrRef.value?.$el as HTMLCanvasElement | undefined)
  if (!canvas) {
    error('请先填写姓名')
    return
  }
  downloadQrImage(canvas, `qrcode_vcard_${name.value}_${Date.now()}.png`, qrSize.value)
  success('下载成功')
}
</script>
