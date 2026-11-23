import { Alert, Box, Button, CircularProgress, Paper, Typography } from '@mui/material'
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
      <Paper sx={{ p: { xs: 3, sm: 4 } }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Всё, что нужно, — в одном магазине
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
          Электроника, одежда, товары для дома и многое другое с быстрой доставкой.
        </Typography>
      </Paper>

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
