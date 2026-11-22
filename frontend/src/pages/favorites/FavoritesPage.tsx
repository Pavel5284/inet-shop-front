import { Heart } from 'lucide-react'
import { useFavoriteProducts } from '@/entities/product'
import { usePageTitle } from '@/shared/lib'
import { EmptyState, ErrorState, PageLoader } from '@/shared/ui'
import { ProductGrid } from '@/widgets/product-grid'

export function FavoritesPage() {
  usePageTitle('Избранное')
  const { data, loading, error, refetch } = useFavoriteProducts()

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Избранное</h1>
      {!data ? (
        loading ? (
          <PageLoader />
        ) : (
          <ErrorState message={error ? 'Не удалось загрузить избранное' : 'Избранное недоступно'} onRetry={() => void refetch()} />
        )
      ) : data.favorites.length === 0 ? (
        <EmptyState icon={<Heart className="size-8" />} title="В избранном пока пусто" description="Нажимайте на сердечко у понравившихся товаров." />
      ) : (
        <ProductGrid products={data.favorites} />
      )}
    </div>
  )
}
