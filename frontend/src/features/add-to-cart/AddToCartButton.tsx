import { Add, Remove } from '@mui/icons-material'
import { Box, Button, IconButton, Link, Typography } from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router'
import { useCart, useCartActions } from '@/entities/cart'
import { useIsAuthenticated } from '@/entities/session'
import { paths } from '@/shared/config'
import { getErrorMessage, type AuthRedirectState } from '@/shared/lib'

/** Кнопка «В корзину». Если товар уже в корзине — превращается в счётчик (как на Ozon). */
export function AddToCartButton({ product, size = 'md' }: { product: { id: string; stock: number }; size?: 'md' | 'lg' }) {
  const isAuth = useIsAuthenticated()
  const navigate = useNavigate()
  const location = useLocation()
  const { data } = useCart({ skip: !isAuth })
  const { addToCart, setQuantity, pending } = useCartActions()
  const [error, setError] = useState<string>()

  const run = async (action: () => Promise<unknown>) => {
    setError(undefined)
    try {
      await action()
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  if (!isAuth) {
    const state: AuthRedirectState = { from: location, reason: 'Войдите, чтобы добавить товар в корзину' }
    return (
      <Button fullWidth size={size === 'lg' ? 'large' : 'medium'} variant="contained" onClick={() => navigate(paths.login, { state })}>
        В корзину
      </Button>
    )
  }

  const item = data?.cart.items.find((i) => i.product.id === product.id)
  const max = Math.min(product.stock, 20)

  return (
    <Box>
      {item ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <IconButton aria-label="Уменьшить" size="small" disabled={pending || item.quantity <= 1} onClick={() => void run(() => setQuantity(product.id, item.quantity - 1))}>
              <Remove fontSize="small" />
            </IconButton>
            <Typography component="span" sx={{ minWidth: 28, textAlign: 'center' }}>
              {item.quantity}
            </Typography>
            <IconButton aria-label="Увеличить" size="small" disabled={pending || item.quantity >= max} onClick={() => void run(() => setQuantity(product.id, item.quantity + 1))}>
              <Add fontSize="small" />
            </IconButton>
          </Box>
          <Link component={RouterLink} to={paths.cart} underline="hover" variant="body2">
            В корзине
          </Link>
        </Box>
      ) : (
        <Button fullWidth size={size === 'lg' ? 'large' : 'medium'} variant="contained" loading={pending} onClick={() => void run(() => addToCart(product.id))}>
          В корзину
        </Button>
      )}
      {error && (
        <Typography role="alert" variant="caption" color="error" sx={{ display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}
