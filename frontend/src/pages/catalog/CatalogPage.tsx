import { Alert, Box, Button, CircularProgress, Pagination, Typography } from '@mui/material'
import { useSearchParams } from 'react-router'
import { useCategories } from '@/entities/category'
import { useProducts } from '@/entities/product'
import { pluralize, usePageTitle } from '@/shared/lib'
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
  const categoryName = categoriesData?.categories.find((category) => category.slug === categorySlug)?.name
  const title = categorySlug ? (categoryName ?? 'Все товары') : search ? `Результаты поиска: «${search}»` : 'Все товары'

  const pageData = data?.products ?? previousData?.products
  const count = pageData?.total ?? 0

  const goToPage = (page: number) => {
    const next = new URLSearchParams(params)
    next.set('page', String(page))
    setParams(next)
  }

  return (
    <Box sx={{ display: 'grid', gap: 2.5 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography component="h1" variant="h4">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {`Найдено ${count} ${pluralize(count, ['товар', 'товара', 'товаров'])}`}
          </Typography>
        </Box>
        <CatalogSort />
      </Box>

      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', lg: '240px 1fr' } }}>
        <CatalogFilters />
        <Box sx={{ display: 'grid', gap: 2, minWidth: 0 }}>
          {pageData ? (
            pageData.items.length === 0 ? (
              <Alert severity="info">Ничего не найдено</Alert>
            ) : (
              <ProductGrid products={pageData.items} loading={loading && !data} />
            )
          ) : loading ? (
            <CircularProgress sx={{ justifySelf: 'center' }} />
          ) : (
            <Alert severity="error" action={<Button onClick={() => void refetch()}>Повторить</Button>}>
              {error ? 'Не удалось загрузить каталог' : 'Каталог недоступен'}
            </Alert>
          )}
          <Pagination page={variables.page} count={pageData?.totalPages ?? 0} onChange={(_, page) => goToPage(page)} sx={{ justifySelf: 'center' }} />
        </Box>
      </Box>
    </Box>
  )
}
