import { Alert, Box, Button, CircularProgress, Paper, Rating, Typography } from '@mui/material'
import { useParams } from 'react-router'
import { AddToCartButton } from '@/features/add-to-cart'
import { FavoriteButton } from '@/features/toggle-favorite'
import { useProduct, useProducts, Price } from '@/entities/product'
import { IMAGE_FALLBACK, pluralize, usePageTitle } from '@/shared/lib'
import { ProductGrid } from '@/widgets/product-grid'
import { ProductReviews } from '@/widgets/product-reviews'

export function ProductPage() {
  usePageTitle('Товар')
  const { slug = '' } = useParams()
  const { data, loading, error, refetch } = useProduct(slug)
  const product = data?.product
  const related = useProducts({
    filter: { categorySlug: product?.category.slug },
    page: 1,
    pageSize: 6,
    sort: 'POPULAR',
  })

  if (!product) {
    return loading ? (
      <CircularProgress sx={{ display: 'block', mx: 'auto', my: 6 }} />
    ) : (
      <Alert severity="error" action={<Button onClick={() => void refetch()}>Повторить</Button>}>
        {error ? 'Товар не найден' : 'Не удалось загрузить товар'}
      </Alert>
    )
  }

  return (
    <Box sx={{ display: 'grid', gap: 4 }}>
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '440px 1fr' } }}>
        <Paper sx={{ p: 2 }}>
          <Box
            component="img"
            src={product.images[0] ?? IMAGE_FALLBACK}
            alt={product.title}
            onError={(event) => {
              event.currentTarget.src = IMAGE_FALLBACK
            }}
            sx={{ width: 1, aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 1, mt: 1.5, overflowX: 'auto' }}>
            {product.images.slice(1).map((image) => (
              <Box
                component="img"
                key={image}
                src={image}
                alt=""
                onError={(event) => {
                  event.currentTarget.src = IMAGE_FALLBACK
                }}
                sx={{ width: 64, height: 64, borderRadius: 1, objectFit: 'cover', flexShrink: 0 }}
              />
            ))}
          </Box>
        </Paper>

        <Box sx={{ display: 'grid', alignContent: 'start', gap: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            {product.brand}
          </Typography>
          <Typography component="h1" variant="h4">
            {product.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Rating value={product.rating} precision={0.1} readOnly size="small" />
            <Typography variant="body2">{product.rating.toFixed(1)}</Typography>
            <Typography variant="body2" color="text.secondary">
              {product.reviewsCount} {pluralize(product.reviewsCount, ['отзыв', 'отзыва', 'отзывов'])}
            </Typography>
          </Box>
          <Price price={product.price} oldPrice={product.oldPrice} />
          <Typography variant="body2" color="text.secondary">
            {product.stock > 0 ? `В наличии: ${product.stock} шт.` : 'Нет в наличии'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mt: 1 }}>
            {product.stock > 0 && (
              <Box sx={{ minWidth: 224 }}>
                <AddToCartButton product={product} size="lg" />
              </Box>
            )}
            <FavoriteButton productId={product.id} />
          </Box>
        </Box>
      </Box>

      <Paper component="section" sx={{ p: 3 }}>
        <Typography component="h2" variant="h5" gutterBottom>
          Описание
        </Typography>
        <Typography sx={{ lineHeight: 1.8 }}>{product.description}</Typography>
      </Paper>

      <ProductReviews productId={product.id} />

      <Box component="section">
        <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
          Похожие товары
        </Typography>
        <ProductGrid products={related.data?.products.items.filter((item) => item.id !== product.id)} loading={related.loading && !related.data} skeletons={5} />
      </Box>
    </Box>
  )
}
