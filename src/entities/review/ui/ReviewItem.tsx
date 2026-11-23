import { Card, CardContent, Rating, Typography } from '@mui/material'
import { formatDate } from '@/shared/lib'
import type { Review } from '../model/types'

export function ReviewItem({ review }: { review: Review }) {
  return (
    <Card component="li">
      <CardContent>
        <Typography variant="subtitle1">
          {review.authorName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatDate(review.createdAt)}
        </Typography>
        <Rating value={review.rating} readOnly size="small" sx={{ display: 'inline-flex', my: 0.5 }} />
        <Typography variant="body2">{review.text}</Typography>
      </CardContent>
    </Card>
  )
}
