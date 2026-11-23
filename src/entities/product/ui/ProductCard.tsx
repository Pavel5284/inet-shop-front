import { Box, Card, CardContent, Chip, Link, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router'
import { paths } from '@/shared/config'
import { IMAGE_FALLBACK, pluralize } from '@/shared/lib'
import type { Product } from '../model/types'
import { Price } from './Price'

interface Props {
  product: Product
  /** Сюда виджет вставляет кнопку «в избранное» (фича). Сущность о фичах ничего не знает. */
  favoriteSlot?: ReactNode
  /** Сюда виджет вставляет кнопку «В корзину». */
  actionSlot?: ReactNode
}

export function ProductCard({ product, favoriteSlot, actionSlot }: Props) {
  const inStock = product.stock > 0
  return (
    <Card component="article" sx={{ position: 'relative', display: 'flex', flexDirection: 'column', p: 1.5, height: '100%' }}>
      <Box sx={{ position: 'relative' }}>
        <Link component={RouterLink} to={paths.product(product.slug)} aria-hidden tabIndex={-1} sx={{ display: 'block' }}>
          <Box
            component="img"
            src={product.images[0] ?? IMAGE_FALLBACK}
            alt=""
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = IMAGE_FALLBACK
            }}
            sx={{ width: 1, aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: 2, display: 'block' }}
          />
        </Link>
        {product.discountPercent ? (
          <Chip label={`−${product.discountPercent}%`} size="small" color="secondary" sx={{ position: 'absolute', top: 8, left: 8, fontWeight: 700 }} />
        ) : null}
        {favoriteSlot && <Box sx={{ position: 'absolute', top: 8, right: 8 }}>{favoriteSlot}</Box>}
      </Box>

      <CardContent sx={{ px: 0.5, pb: 0, '&:last-child': { pb: 0 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Price price={product.price} oldPrice={product.oldPrice} />
        <Link component={RouterLink} to={paths.product(product.slug)} underline="hover" sx={{ mt: 0.5, fontSize: 14, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.title}
        </Link>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
          {product.reviewsCount > 0
            ? `★ ${product.rating.toFixed(1)} · ${product.reviewsCount} ${pluralize(product.reviewsCount, ['отзыв', 'отзыва', 'отзывов'])}`
            : 'Пока без отзывов'}
        </Typography>
        <Box sx={{ mt: 'auto', pt: 1.5 }}>
          {inStock ? (
            actionSlot
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover', borderRadius: 2 }}>
              Нет в наличии
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export function ProductCardSkeleton() {
  return (
    <Card sx={{ p: 1.5 }}>
      <Box sx={{ aspectRatio: '1 / 1', borderRadius: 2, bgcolor: 'action.hover' }} />
      <Box sx={{ mt: 1.5, height: 24, width: '50%', borderRadius: 1, bgcolor: 'action.hover' }} />
      <Box sx={{ mt: 1, height: 40, borderRadius: 1, bgcolor: 'action.hover' }} />
      <Box sx={{ mt: 1.5, height: 40, borderRadius: 2, bgcolor: 'action.hover' }} />
    </Card>
  )
}
