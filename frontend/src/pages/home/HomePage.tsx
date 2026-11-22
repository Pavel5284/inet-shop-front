import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material'
import { CategoryTile, useCategories } from '@/entities/category'
import { useProducts } from '@/entities/product'
import { usePageTitle } from '@/shared/lib'
import { ProductGrid } from '@/widgets/product-grid'

export function HomePage() {
  usePageTitle()
  const popular = useProducts({ sort: 'POPULAR', page: 1, pageSize: 12 })
  const newest = useProducts({ sort: 'NEWEST', page: 1, pageSize: 10 })
  const categories = useCategories()

  return (
    <Box sx={{ display: 'grid', gap: 4 }}>
      <Box sx={{ borderRadius: 4, background: 'linear-gradient(90deg, #005bff, #0047cc)', color: 'white', px: { xs: 3, sm: 5 }, py: 5 }}>
        <Typography component="h1" variant="h4">
          Всё, что нужно, — в одном магазине
        </Typography>
        <Typography sx={{ mt: 1.5, maxWidth: 560, color: 'rgba(255,255,255,0.8)' }}>
          Электроника, одежда, товары для дома и многое другое с быстрой доставкой.
        </Typography>
      </Box>

      <Box component="section">
        <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
          Категории
        </Typography>
        {categories.data ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }, gap: 1.5 }}>
            {categories.data.categories.map((category) => (
              <CategoryTile key={category.id} category={category} />
            ))}
          </Box>
        ) : categories.loading ? (
          <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
        ) : (
          <Alert severity="error" action={<Button onClick={() => void categories.refetch()}>Повторить</Button>}>
            Не удалось загрузить категории
          </Alert>
        )}
      </Box>

      <Box component="section">
        <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
          Популярное
        </Typography>
        {popular.data ? (
          <ProductGrid products={popular.data.products.items} loading={popular.loading} />
        ) : popular.loading ? (
          <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
        ) : (
          <Alert severity="error" action={<Button onClick={() => void popular.refetch()}>Повторить</Button>}>
            Не удалось загрузить товары
          </Alert>
        )}
      </Box>

      <Box component="section">
        <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
          Новинки
        </Typography>
        {newest.data ? (
          <ProductGrid products={newest.data.products.items} loading={newest.loading} />
        ) : newest.loading ? (
          <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
        ) : (
          <Alert severity="error" action={<Button onClick={() => void newest.refetch()}>Повторить</Button>}>
            Не удалось загрузить новинки
          </Alert>
        )}
      </Box>
    </Box>
  )
}
