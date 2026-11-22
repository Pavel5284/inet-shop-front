import { useSearchParams } from 'react-router'
import { useCategories } from '@/entities/category'
import { useProducts } from '@/entities/product'
import { pluralize, usePageTitle } from '@/shared/lib'
import { EmptyState, ErrorState, Pagination, PageLoader } from '@/shared/ui'
import { CatalogFilters, CatalogSort, parseCatalogParams } from '@/widgets/catalog-filters'
import { ProductGrid } from '@/widgets/product-grid'

export function CatalogPage() {
  usePageTitle('Каталог')
  const [params, setParams] = useSearchParams()
  const variables = parseCatalogParams(params)
  const { data: categoriesData } = useCategories()
  const { data, previousData, loading, error, refetch } = useProducts(variables)

  const categorySlug = variables.filter.categorySlug
  const search = params.get('q')
  const categoryName = categoriesData?.categories.find((c) => c.slug === categorySlug)?.name
  const title = categorySlug ? (categoryName ?? 'Все товары') : search ? `Результаты поиска: «${search}»` : 'Все товары'

  const pageData = data?.products ?? previousData?.products
  const count = pageData?.total ?? 0

  const goToPage = (page: number) => {
    const next = new URLSearchParams(params)
    next.set('page', String(page))
    setParams(next)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">Найдено {count} {pluralize(count, ['товар', 'товара', 'товаров'])}</p>
        </div>
        <CatalogSort />
      </div>

      <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
        <CatalogFilters />

        <div className="min-w-0 space-y-4">
          {pageData ? (
            pageData.items.length === 0 ? (
              <EmptyState title="Ничего не найдено" description="Попробуйте изменить фильтры или поисковый запрос." />
            ) : (
              <ProductGrid products={pageData.items} loading={loading && !data} />
            )
          ) : loading ? (
            <PageLoader />
          ) : (
            <ErrorState message={error ? 'Не удалось загрузить каталог' : 'Каталог недоступен'} onRetry={() => void refetch()} />
          )}
          <Pagination page={variables.page} totalPages={pageData?.totalPages ?? 0} onPageChange={goToPage} />
        </div>
      </div>
    </div>
  )
}
