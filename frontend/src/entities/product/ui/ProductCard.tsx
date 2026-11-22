import { Star } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { paths } from '@/shared/config'
import { pluralize } from '@/shared/lib'
import { SafeImage } from '@/shared/ui'
import type { Product } from '../model/types'
import { Price } from './Price'

interface Props {
  product: Product
  /** Сюда виджет вставляет кнопку «в избранное» (фича). Сущность о фичах ничего не знает. */
  favoriteSlot?: ReactNode
  /** Сюда виджет вставляет кнопку «В корзину». */
  actionSlot?: ReactNode
}

export function ProductCard({ product, favoriteSlot, actionSlot }: Props) {
  const inStock = product.stock > 0
  return (
    <article className="relative flex flex-col rounded-2xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        <Link to={paths.product(product.slug)} tabIndex={-1} aria-hidden>
          <SafeImage src={product.images[0]} alt="" className="aspect-square w-full rounded-xl" />
        </Link>
        {product.discountPercent ? (
          <span className="absolute left-2 top-2 rounded-md bg-accent px-1.5 py-0.5 text-xs font-bold text-white">−{product.discountPercent}%</span>
        ) : null}
        {favoriteSlot && <div className="absolute right-2 top-2">{favoriteSlot}</div>}
      </div>

      <div className="mt-3">
        <Price price={product.price} oldPrice={product.oldPrice} />
      </div>
      <Link to={paths.product(product.slug)} className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 hover:text-brand">
        {product.title}
      </Link>
      <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
        {product.reviewsCount > 0 ? (
          <>
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-700">{product.rating.toFixed(1)}</span>
            <span>
              · {product.reviewsCount} {pluralize(product.reviewsCount, ['отзыв', 'отзыва', 'отзывов'])}
            </span>
          </>
        ) : (
          <span>Пока без отзывов</span>
        )}
      </div>

      <div className="mt-auto pt-3">
        {inStock ? actionSlot : <p className="flex h-10 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500">Нет в наличии</p>}
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-3">
      <div className="aspect-square rounded-xl bg-slate-100" />
      <div className="mt-3 h-6 w-1/2 rounded bg-slate-100" />
      <div className="mt-2 h-10 rounded bg-slate-100" />
      <div className="mt-3 h-10 rounded-xl bg-slate-100" />
    </div>
  )
}
