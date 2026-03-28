/**
 * 从 Canvas DataURL 下载 PNG 图片
 * @param canvas QR 码渲染的 canvas 元素
 * @param filename 文件名
 * @param size 输出尺寸
 */
export function downloadQrImage(
  canvas: HTMLCanvasElement,
  filename: string,
  size?: number
): void {
  let dataUrl: string

  if (size && size !== canvas.width) {
    const output = document.createElement('canvas')
    output.width = size
    output.height = size
    const ctx = output.getContext('2d')
    if (ctx) {
      ctx.drawImage(canvas, 0, 0, size, size)
      dataUrl = output.toDataURL('image/png')
    } else {
      dataUrl = canvas.toDataURL('image/png')
    }
  } else {
    dataUrl = canvas.toDataURL('image/png')
  }

  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
