// 解析目前主題的 CSS 自訂屬性，供無法直接讀取 var() 的 ECharts canvas 使用。
export function cssVar(el, name) {
  return getComputedStyle(el).getPropertyValue(name).trim()
}

// avatarColor 儲存 var(--chart-1) 格式，先取得變數名稱再解析實際色彩。
export function resolveAvatarColor(el, avatarColor) {
  const match = /var\((--[\w-]+)\)/.exec(avatarColor)
  return match ? cssVar(el, match[1]) : avatarColor
}
