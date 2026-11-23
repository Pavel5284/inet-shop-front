import { CURRENCY, LOCALE } from '@/shared/config'

const priceFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 0,
})

/** 24990 -> «24 990 ₽» */
export const formatPrice = (value: number): string => priceFormatter.format(value)

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(LOCALE, { day: 'numeric', month: 'long', year: 'numeric' })

/** pluralize(3, ['товар', 'товара', 'товаров']) -> «товара» */
export function pluralize(n: number, forms: [one: string, few: string, many: string]): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]
  return forms[2]
}
