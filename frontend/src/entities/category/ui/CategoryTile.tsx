import { Link } from 'react-router'
import { paths } from '@/shared/config'
import type { Category } from '../model/types'

/** Плитка категории на главной странице. */
export function CategoryTile({ category }: { category: Category }) {
  return (
    <Link
      to={`${paths.catalog}?category=${encodeURIComponent(category.slug)}`}
      className="flex flex-col items-center gap-1 rounded-2xl bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md"
    >
      <span className="text-3xl" aria-hidden>
        {category.icon}
      </span>
      <span className="text-sm font-semibold text-slate-800">{category.name}</span>
      <span className="text-xs text-slate-400">
        {category.productsCount} товаров
      </span>
    </Link>
  )
}
