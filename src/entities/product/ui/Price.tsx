import { Box, Typography } from '@mui/material'
import { formatPrice } from '@/shared/lib'

export function Price({ price, oldPrice, className }: { price: number; oldPrice?: number | null; className?: string }) {
  return (
    <Box className={className}>
      <Typography component="span" color="text.primary">
        {formatPrice(price)}
      </Typography>
      {oldPrice && oldPrice > price ? (
        <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1, textDecoration: 'line-through' }}>
          {formatPrice(oldPrice)}
        </Typography>
      ) : null}
    </Box>
  )
}
