import { CategoryTile, useCategories } from '@/entities/category'
import { useProducts } from '@/entities/product'
import { usePageTitle } from '@/shared/lib'
import { ErrorState, PageLoader } from '@/shared/ui'
import { ProductGrid } from '@/widgets/product-grid'

export function HomePage() {
  usePageTitle()
  const popular = useProducts({ sort: 'POPULAR', page: 1, pageSize: 12 })
  const newest = useProducts({ sort: 'NEWEST', page: 1, pageSize: 10 })
  const categories = useCategories()

  return (
    <div className="space-y-9">
      <section className="rounded-3xl bg-gradient-to-r from-brand to-brand-dark px-6 py-10 text-white sm:px-10">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Всё, что нужно, — в одном магазине</h1>
        <p className="mt-3 max-w-xl text-white/80">Электроника, одежда, товары для дома и многое другое с быстрой доставкой.</p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Категории</h2>
        {categories.data ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.data.categories.map((category) => (
              <CategoryTile key={category.id} category={category} />
            ))}
          </div>
        ) : categories.loading ? (
          <PageLoader />
        ) : (
          <ErrorState
            message={categories.error ? 'Не удалось загрузить категории' : 'Категории недоступны'}
            onRetry={() => void categories.refetch()}
          />
        )}
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Популярное</h2>
        {popular.data ? (
          <ProductGrid products={popular.data.products.items} loading={popular.loading} />
        ) : popular.loading ? (
          <PageLoader />
        ) : (
          <ErrorState message="Не удалось загрузить товары" onRetry={() => void popular.refetch()} />
        )}
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Новинки</h2>
        {newest.data ? (
          <ProductGrid products={newest.data.products.items} loading={newest.loading} />
        ) : newest.loading ? (
          <PageLoader />
        ) : (
          <ErrorState message="Не удалось загрузить новинки" onRetry={() => void newest.refetch()} />
        )}
      </section>
    </div>
  )
}
