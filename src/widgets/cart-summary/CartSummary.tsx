import { Box, Divider, Paper, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import type { Cart } from '@/entities/cart'
import { formatPrice, pluralize } from '@/shared/lib'

interface Props {
  cart: Cart
  action?: ReactNode
}

/** Сводка заказа: количество, скидка, итог и кнопка действия. */
export function CartSummary({ cart, action }: Props) {
  const count = `${cart.totalCount} ${pluralize(cart.totalCount, ['товар', 'товара', 'товаров'])}`

  return (
    <Paper sx={{ p: 2.5, alignSelf: 'flex-start' }}>
      <Typography variant="h6">
        Ваш заказ
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {count}
      </Typography>

      {cart.totalDiscount > 0 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', color: 'success.dark' }}>
          <Typography variant="body2">Скидка</Typography>
          <Typography variant="body2">−{formatPrice(cart.totalDiscount)}</Typography>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Typography>Итого</Typography>
        <Typography variant="h5">
          {formatPrice(cart.totalPrice)}
        </Typography>
      </Box>

      {action && <Box sx={{ mt: 2.5 }}>{action}</Box>}
    </Paper>
  )
}
