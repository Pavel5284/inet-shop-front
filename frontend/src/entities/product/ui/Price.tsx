import { formatPrice } from '@/shared/lib'

export function Price({ price, oldPrice, className }: { price: number; oldPrice?: number | null; className?: string }) {
  return (
    <div className={className}>
      <span className="text-lg font-extrabold text-slate-900">{formatPrice(price)}</span>
      {oldPrice && oldPrice > price ? <span className="ml-2 text-sm text-slate-400 line-through">{formatPrice(oldPrice)}</span> : null}
    </div>
  )
}
