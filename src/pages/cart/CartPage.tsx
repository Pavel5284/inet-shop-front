import { Alert, Box, Button, CircularProgress, Link, List, ListItem, Paper, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router'
import { useCart, useCartActions } from '@/entities/cart'
import { Price } from '@/entities/product'
import { CartItemControls } from '@/features/cart-item-controls'
import { paths } from '@/shared/config'
import { getErrorMessage, IMAGE_FALLBACK, usePageTitle } from '@/shared/lib'
import { CartSummary } from '@/widgets/cart-summary'

export function CartPage() {
  usePageTitle('Корзина')
  const { data, loading, error, refetch } = useCart({ fresh: true })
  const { clearCart, pending } = useCartActions()
  const cart = data?.cart

  if (!cart) {
    return loading ? (
      <CircularProgress sx={{ display: 'block', mx: 'auto', my: 6 }} />
    ) : (
      <Alert severity="error" action={<Button onClick={() => void refetch()}>Повторить</Button>}>
        {error ? getErrorMessage(error) : 'Не удалось загрузить корзину'}
      </Alert>
    )
  }

  if (cart.items.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <Typography component="h1" variant="h5">
          В корзине пока пусто
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Загляните в каталог — там много интересного.
        </Typography>
        <Button component={RouterLink} to={paths.catalog} variant="contained" sx={{ mt: 2 }}>
          Перейти в каталог
        </Button>
      </Paper>
    )
  }

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography component="h1" variant="h4">
          Корзина
        </Typography>
        <Button size="small" disabled={pending} onClick={() => void clearCart().catch(() => undefined)}>
          Очистить корзину
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' } }}>
        <List sx={{ display: 'grid', gap: 1.5, p: 0 }}>
          {cart.items.map((item) => (
            <ListItem key={item.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, bgcolor: 'background.paper', borderRadius: 2, p: 2 }}>
              <Link component={RouterLink} to={paths.product(item.product.slug)} sx={{ flexShrink: 0 }}>
                <Box
                  component="img"
                  src={item.product.images[0] ?? IMAGE_FALLBACK}
                  alt=""
                  onError={(event) => {
                    event.currentTarget.src = IMAGE_FALLBACK
                  }}
                  sx={{ width: 96, height: 96, borderRadius: 2, objectFit: 'cover' }}
                />
              </Link>
              <Box sx={{ flex: 1, minWidth: 0, display: 'grid', gap: 1 }}>
                <Link component={RouterLink} to={paths.product(item.product.slug)} underline="hover" variant="body1">
                  {item.product.title}
                </Link>
                <CartItemControls item={item} />
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Price price={item.lineTotal} />
                {item.quantity > 1 && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {`${item.quantity} × ${item.product.price} ₽`}
                  </Typography>
                )}
              </Box>
            </ListItem>
          ))}
        </List>

        <CartSummary
          cart={cart}
          action={
            <Button component={RouterLink} to={paths.checkout} variant="contained" size="large" fullWidth>
              Перейти к оформлению
            </Button>
          }
        />
      </Box>
    </Box>
  )
}
