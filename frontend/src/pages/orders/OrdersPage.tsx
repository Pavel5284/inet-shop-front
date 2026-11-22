import { Alert, Box, Button, CircularProgress, List, ListItem, ListItemButton, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router'
import { OrderStatusBadge, useOrders } from '@/entities/order'
import { paths } from '@/shared/config'
import { formatDate, formatPrice, usePageTitle } from '@/shared/lib'

export function OrdersPage() {
  usePageTitle('Мои заказы')
  const { data, loading, error, refetch } = useOrders()

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Typography component="h1" variant="h4">
        Мои заказы
      </Typography>
      {!data ? (
        loading ? (
          <CircularProgress sx={{ justifySelf: 'center' }} />
        ) : (
          <Alert severity="error" action={<Button onClick={() => void refetch()}>Повторить</Button>}>
            {error ? 'Не удалось загрузить заказы' : 'Заказы недоступны'}
          </Alert>
        )
      ) : data.orders.length === 0 ? (
        <Typography color="text.secondary">Заказов пока нет</Typography>
      ) : (
        <List sx={{ display: 'grid', gap: 1.5, p: 0 }}>
          {data.orders.map((order) => (
            <ListItem key={order.id} disableGutters sx={{ p: 0 }}>
              <ListItemButton component={RouterLink} to={paths.order(order.id)} sx={{ bgcolor: 'background.paper', borderRadius: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography>{`Заказ №${order.number}`}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(order.createdAt)}
                  </Typography>
                </Box>
                <OrderStatusBadge status={order.status} />
                <Typography>{formatPrice(order.totalPrice)}</Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}
