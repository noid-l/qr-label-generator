/**
 * 默认二维码尺寸
 */
export const DEFAULT_QR_SIZE = 256

/**
 * 二维码纠错等级选项
 */
export const ERROR_CORRECTION_LEVELS = [
  { value: 'L' as const, label: 'L - ~7% 容错', description: '数据量大、环境干净' },
  { value: 'M' as const, label: 'M - ~15% 容错', description: '通用场景（默认）' },
  { value: 'Q' as const, label: 'Q - ~25% 容错', description: '可能部分遮挡或磨损' },
  { value: 'H' as const, label: 'H - ~30% 容错', description: '嵌入 Logo 或恶劣环境' },
]

/**
 * WiFi 加密类型选项
 */
export const WIFI_ENCRYPTION_OPTIONS = [
  { value: 'WPA' as const, label: 'WPA/WPA2' },
  { value: 'WEP' as const, label: 'WEP' },
  { value: 'nopass' as const, label: '无加密' },
]

/**
 * 尺寸预设选项
 */
export const SIZE_PRESETS = [128, 256, 512, 1024, 2048]
