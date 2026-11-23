import { Alert, Box, Button, CircularProgress, List, Typography } from '@mui/material'
import { ReviewItem, useReviews } from '@/entities/review'
import { useIsAuthenticated } from '@/entities/session'
import { ReviewForm } from '@/features/create-review'
import { getErrorMessage } from '@/shared/lib'

/** Блок отзывов товара: список, форма для вошедших и все состояния загрузки. */
export function ProductReviews({ productId }: { productId: string }) {
  const { data, loading, error, refetch } = useReviews(productId)
  const isAuth = useIsAuthenticated()

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Typography component="h2" variant="h5">
        Отзывы ({data?.reviews.length ?? 0})
      </Typography>
      {isAuth && <ReviewForm productId={productId} />}

      {!data ? (
        loading ? (
          <CircularProgress sx={{ justifySelf: 'center' }} />
        ) : (
          <Alert severity="error" action={<Button size="small" onClick={() => void refetch()}>Повторить</Button>}>
            {error ? getErrorMessage(error) : 'Не удалось загрузить отзывы'}
          </Alert>
        )
      ) : data.reviews.length === 0 ? (
        <Typography color="text.secondary">Отзывов пока нет</Typography>
      ) : (
        <List sx={{ display: 'grid', gap: 1.5, p: 0 }}>
          {data.reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </List>
      )}
    </Box>
  )
}
