/** Заглушка для картинок товаров, которые не удалось загрузить. */
export const IMAGE_FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#e2e8f0"/><path d="M120 250l60-60 45 45 55-70" fill="none" stroke="#94a3b8" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><circle cx="150" cy="140" r="22" fill="#94a3b8"/></svg>',
  )
