import { ProductCard, ProductCardSkeleton, type Product } from '@/entities/product'
import { AddToCartButton } from '@/features/add-to-cart'
import { FavoriteButton } from '@/features/toggle-favorite'

const GRID = 'grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'

/** Сетка карточек. Собирает сущность «товар» с фичами «в избранное» и «в корзину». */
export function ProductGrid({ products, loading = false, skeletons = 10 }: { products?: Product[]; loading?: boolean; skeletons?: number }) {
  if (loading && !products?.length) {
    return (
      <div className={GRID}>
        {Array.from({ length: skeletons }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }
  return (
    <div className={GRID}>
      {products?.map((p) => (
        <ProductCard key={p.id} product={p} favoriteSlot={<FavoriteButton productId={p.id} />} actionSlot={<AddToCartButton product={p} />} />
      ))}
    </div>
  )
}
