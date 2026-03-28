/**
 * 二维码模式
 */
export type QrMode = 'text' | 'url' | 'wifi' | 'vcard'

/**
 * 纠错等级
 */
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

/**
 * 二维码选项
 */
export interface QrOptions {
  size: number
  errorLevel: ErrorCorrectionLevel
}

/**
 * WiFi 配置
 */
export interface WifiConfig {
  ssid: string
  password: string
  encryption: 'WPA' | 'WEP' | 'nopass'
}

/**
 * vCard 联系人数据
 */
export interface VcardData {
  name: string
  phone?: string
  email?: string
  company?: string
  title?: string
  address?: string
  website?: string
}

/**
 * 标签页定义
 */
export interface QrTab {
  key: QrMode
  label: string
  description: string
}
