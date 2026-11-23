import { Alert, Box, Button } from '@mui/material'
import { useState } from 'react'
import { useCancelOrder, usePayOrder, type Order } from '@/entities/order'
import { getErrorMessage } from '@/shared/lib'

/** Действия над заказом: тестовая оплата и отмена (только для подходящих статусов). */
export function OrderActions({ order }: { order: Order }) {
  const payOrder = usePayOrder()
  const cancelOrder = useCancelOrder()
  const [error, setError] = useState<string>()
  const [busy, setBusy] = useState(false)

  const canPay = order.status === 'NEW' && order.paymentMethod === 'CARD'
  const canCancel = order.status === 'NEW' || order.status === 'PAID'
  if (!canPay && !canCancel) return null

  const run = async (action: () => Promise<unknown>) => {
    setError(undefined)
    setBusy(true)
    try {
      await action()
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Box sx={{ display: 'grid', gap: 1 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {canPay && (
          <Button variant="contained" loading={busy} onClick={() => void run(() => payOrder(order.id))}>
            Оплатить (тест)
          </Button>
        )}
        {canCancel && (
          <Button
            variant="outlined"
            color="error"
            disabled={busy}
            onClick={() => {
              if (window.confirm('Отменить заказ?')) void run(() => cancelOrder(order.id))
            }}
          >
            Отменить заказ
          </Button>
        )}
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  )
}
