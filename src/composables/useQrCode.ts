import { ref } from 'vue'
import type { ErrorCorrectionLevel, WifiConfig, VcardData } from '@/types'
import { DEFAULT_QR_SIZE } from '@/utils/constants'

/**
 * 通用二维码生成 Composable
 */
export function useQrCode() {
  const qrValue = ref<string>('')
  const qrSize = ref<number>(DEFAULT_QR_SIZE)
  const errorLevel = ref<ErrorCorrectionLevel>('M')

  /**
   * 编码纯文本
   */
  function encodeText(text: string): void {
    qrValue.value = text
  }

  /**
   * 编码 URL
   */
  function encodeUrl(url: string): void {
    qrValue.value = url
  }

  /**
   * 编码 WiFi 配置
   * 格式: WIFI:T:{加密};S:{SSID};P:{密码};;
   */
  function encodeWifi(config: WifiConfig): void {
    const { ssid, password, encryption } = config
    qrValue.value = `WIFI:T:${encryption};S:${ssid};P:${password};;`
  }

  /**
   * 编码 vCard 3.0
   */
  function encodeVcard(data: VcardData): void {
    const lines: string[] = [
      'BEGIN:VCARD',
      'VERSION:3.0',
    ]

    lines.push(`FN:${data.name}`)

    if (data.company) {
      lines.push(`ORG:${data.company}`)
    }
    if (data.title) {
      lines.push(`TITLE:${data.title}`)
    }
    if (data.phone) {
      lines.push(`TEL:${data.phone}`)
    }
    if (data.email) {
      lines.push(`EMAIL:${data.email}`)
    }
    if (data.address) {
      lines.push(`ADR:;;${data.address};;;;`)
    }
    if (data.website) {
      lines.push(`URL:${data.website}`)
    }

    lines.push('END:VCARD')

    qrValue.value = lines.join('\n')
  }

  /**
   * 清空二维码内容
   */
  function clear(): void {
    qrValue.value = ''
  }

  return {
    qrValue,
    qrSize,
    errorLevel,
    encodeText,
    encodeUrl,
    encodeWifi,
    encodeVcard,
    clear,
  }
}
