import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material'
import { useFavoriteProducts } from '@/entities/product'
import { usePageTitle } from '@/shared/lib'
import { ProductGrid } from '@/widgets/product-grid'

export function FavoritesPage() {
  usePageTitle('Избранное')
  const { data, loading, error, refetch } = useFavoriteProducts()

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Typography component="h1" variant="h4">
        Избранное
      </Typography>
      {!data ? (
        loading ? (
          <CircularProgress sx={{ justifySelf: 'center' }} />
        ) : (
          <Alert severity="error" action={<Button onClick={() => void refetch()}>Повторить</Button>}>
            {error ? 'Не удалось загрузить избранное' : 'Избранное недоступно'}
          </Alert>
        )
      ) : data.favorites.length === 0 ? (
        <Typography color="text.secondary">В избранном пока пусто</Typography>
      ) : (
        <ProductGrid products={data.favorites} />
      )}
    </Box>
  )
}
