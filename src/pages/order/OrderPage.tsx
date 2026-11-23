import { Alert, Box, Button, CircularProgress, Divider, List, ListItem, Paper, Typography } from '@mui/material'
import { useParams } from 'react-router'
import { OrderStatusBadge, useOrder } from '@/entities/order'
import { OrderActions } from '@/features/order-actions'
import { formatDate, formatPrice, IMAGE_FALLBACK, usePageTitle } from '@/shared/lib'

export function OrderPage() {
  usePageTitle('Заказ')
  const { id = '' } = useParams()
  const { data, loading, error, refetch } = useOrder(id)
  const order = data?.order

  if (!order) {
    return loading ? (
      <CircularProgress sx={{ display: 'block', mx: 'auto', my: 6 }} />
    ) : (
      <Alert severity="error" action={<Button onClick={() => void refetch()}>Повторить</Button>}>
        {error ? 'Заказ не найден' : 'Не удалось загрузить заказ'}
      </Alert>
    )
  }

  return (
    <Box sx={{ display: 'grid', gap: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
        <Typography component="h1" variant="h4">
          {`Заказ №${order.number}`}
        </Typography>
        <OrderStatusBadge status={order.status} />
      </Box>
      <Typography variant="body2" color="text.secondary">
        {`Оформлен ${formatDate(order.createdAt)}`}
      </Typography>

      <OrderActions order={order} />

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Состав заказа
        </Typography>
        <List sx={{ p: 0 }}>
          {order.items.map((item) => (
            <ListItem key={item.id} sx={{ display: 'flex', gap: 1.5, px: 0, borderBottom: 1, borderColor: 'divider' }}>
              <Box
                component="img"
                src={item.image ?? IMAGE_FALLBACK}
                alt=""
                onError={(event) => {
                  event.currentTarget.src = IMAGE_FALLBACK
                }}
                sx={{ width: 56, height: 56, borderRadius: 1, objectFit: 'cover' }}
              />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body2" noWrap>
                  {item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {`${item.quantity} шт. × ${formatPrice(item.price)}`}
                </Typography>
              </Box>
              <Typography variant="body2">
                {formatPrice(item.lineTotal)}
              </Typography>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Итого</Typography>
          <Typography>{formatPrice(order.totalPrice)}</Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Получатель
          </Typography>
          <Typography>{order.recipientName}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Телефон
          </Typography>
          <Typography>{order.phone}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Адрес доставки
          </Typography>
          <Typography>{order.address}</Typography>
        </Box>
        {order.comment && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Комментарий курьеру
            </Typography>
            <Typography>{order.comment}</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
