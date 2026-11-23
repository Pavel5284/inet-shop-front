import { Box } from '@mui/material'
import { ProductCard, ProductCardSkeleton, type Product } from '@/entities/product'
import { AddToCartButton } from '@/features/add-to-cart'
import { FavoriteButton } from '@/features/toggle-favorite'

const GRID = {
  display: 'grid',
  gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))', xl: 'repeat(5, minmax(0, 1fr))' },
  gap: 1.5,
}

/** Сетка карточек. Собирает сущность «товар» с фичами «в избранное» и «в корзину». */
export function ProductGrid({ products, loading = false, skeletons = 10 }: { products?: Product[]; loading?: boolean; skeletons?: number }) {
  if (loading && !products?.length) {
    return (
      <Box sx={GRID}>
        {Array.from({ length: skeletons }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </Box>
    )
  }
  return (
    <Box sx={GRID}>
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} favoriteSlot={<FavoriteButton productId={product.id} />} actionSlot={<AddToCartButton product={product} />} />
      ))}
    </Box>
  )
}
