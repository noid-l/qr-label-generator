import { readonly, ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  type: ToastType
  title: string
  message: string
}

interface ToastOptions {
  type?: ToastType
  title?: string
  message: string
  duration?: number
}

const DEFAULT_TITLES: Record<ToastType, string> = {
  success: '操作成功',
  error: '操作失败',
  warning: '请注意',
  info: '提示',
}

const toasts = ref<ToastItem[]>([])
const toastTimers = new Map<string, number>()

function clearToastTimer(id: string): void {
  const timer = toastTimers.get(id)
  if (timer !== undefined) {
    window.clearTimeout(timer)
    toastTimers.delete(id)
  }
}

function removeToast(id: string): void {
  clearToastTimer(id)
  toasts.value = toasts.value.filter((item) => item.id !== id)
}

function showToast(options: ToastOptions): string {
  const type = options.type ?? 'info'
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const toast: ToastItem = {
    id,
    type,
    title: options.title ?? DEFAULT_TITLES[type],
    message: options.message,
  }

  toasts.value = [...toasts.value, toast]

  const duration = options.duration ?? 2600
  if (duration > 0) {
    const timer = window.setTimeout(() => {
      removeToast(id)
    }, duration)
    toastTimers.set(id, timer)
  }

  return id
}

export function useToast() {
  return {
    toasts: readonly(toasts),
    removeToast,
    showToast,
    success(message: string, title?: string): string {
      return showToast({ type: 'success', title, message })
    },
    error(message: string, title?: string): string {
      return showToast({ type: 'error', title, message, duration: 3200 })
    },
    warning(message: string, title?: string): string {
      return showToast({ type: 'warning', title, message, duration: 3000 })
    },
    info(message: string, title?: string): string {
      return showToast({ type: 'info', title, message })
    },
  }
}
