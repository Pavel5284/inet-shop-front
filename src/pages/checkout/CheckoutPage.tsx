import { Alert, Box, Button, CircularProgress, List, ListItem, Typography } from '@mui/material'
import { useCart } from '@/entities/cart'
import { Price } from '@/entities/product'
import { useMe } from '@/entities/user'
import { CheckoutForm } from '@/features/place-order'
import { IMAGE_FALLBACK, usePageTitle } from '@/shared/lib'
import { CartSummary } from '@/widgets/cart-summary'

export function CheckoutPage() {
  usePageTitle('Оформление заказа')
  const me = useMe()
  const cart = useCart({ fresh: true })
  const user = me.data?.me
  const cartData = cart.data?.cart

  if (!user || !cartData) {
    return me.loading || cart.loading ? (
      <CircularProgress sx={{ display: 'block', mx: 'auto', my: 6 }} />
    ) : (
      <Alert
        severity="error"
        action={
          <Button
            onClick={() => {
              void me.refetch()
              void cart.refetch()
            }}
          >
            Повторить
          </Button>
        }
      >
        Не удалось загрузить данные оформления
      </Alert>
    )
  }

  return (
    <Box sx={{ display: 'grid', gap: 2.5 }}>
      <Typography component="h1" variant="h4">
        Оформление заказа
      </Typography>
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' } }}>
        <CheckoutForm
          key={user.id}
          defaults={{
            recipientName: `${user.firstName} ${user.lastName}`.trim(),
            phone: user.phone ?? '',
            address: user.address ?? '',
          }}
        />

        <Box sx={{ display: 'grid', gap: 2, alignContent: 'start' }}>
          <CartSummary cart={cartData} />
          <List sx={{ p: 2, m: 0 }}>
            {cartData.items.map((item) => (
              <ListItem key={item.id} sx={{ display: 'flex', gap: 1.5, px: 0 }}>
                <Box
                  component="img"
                  src={item.product.images[0] ?? IMAGE_FALLBACK}
                  alt=""
                  onError={(event) => {
                    event.currentTarget.src = IMAGE_FALLBACK
                  }}
                  sx={{ width: 48, height: 48, borderRadius: 1, objectFit: 'cover' }}
                />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="body2" noWrap>
                    {item.product.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.quantity} шт.
                  </Typography>
                </Box>
                <Price price={item.lineTotal} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  )
}
