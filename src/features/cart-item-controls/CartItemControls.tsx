import { Add, DeleteOutlined, Remove } from '@mui/icons-material'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { useState } from 'react'
import { useCartActions, type CartItem } from '@/entities/cart'
import { getErrorMessage } from '@/shared/lib'

/** Управление количеством и удалением позиции в корзине. */
export function CartItemControls({ item }: { item: CartItem }) {
  const { setQuantity, removeFromCart, pending } = useCartActions()
  const [error, setError] = useState<string>()
  const max = Math.min(item.product.stock, 20)

  const run = async (action: () => Promise<unknown>) => {
    setError(undefined)
    try {
      await action()
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', border: 1, borderColor: 'divider', borderRadius: 2 }}>
          <IconButton aria-label="Уменьшить" size="small" disabled={pending || item.quantity <= 1} onClick={() => void run(() => setQuantity(item.product.id, item.quantity - 1))}>
            <Remove fontSize="small" />
          </IconButton>
          <Typography component="span" sx={{ minWidth: 28, textAlign: 'center' }}>
            {item.quantity}
          </Typography>
          <IconButton aria-label="Увеличить" size="small" disabled={pending || item.quantity >= max} onClick={() => void run(() => setQuantity(item.product.id, item.quantity + 1))}>
            <Add fontSize="small" />
          </IconButton>
        </Box>
        <Button size="small" color="inherit" startIcon={<DeleteOutlined />} disabled={pending} onClick={() => void run(() => removeFromCart(item.product.id))}>
          Удалить
        </Button>
      </Box>
      {error && (
        <Typography role="alert" variant="caption" color="error" sx={{ display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}
