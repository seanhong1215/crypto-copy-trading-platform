// 解析当前主题下 CSS 自定义属性的实际颜色值，供 ECharts 使用（canvas 无法直接读取 var()）
export function cssVar(el, name) {
  return getComputedStyle(el).getPropertyValue(name).trim()
}

// avatarColor 存的是 'var(--chart-1)' 这种字符串，取出变量名后解析成实际颜色
export function resolveAvatarColor(el, avatarColor) {
  const match = /var\((--[\w-]+)\)/.exec(avatarColor)
  return match ? cssVar(el, match[1]) : avatarColor
}
