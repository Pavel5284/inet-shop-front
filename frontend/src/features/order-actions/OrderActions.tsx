import { useState } from 'react'
import { useCancelOrder, usePayOrder, type Order } from '@/entities/order'
import { getErrorMessage } from '@/shared/lib'
import { Alert, Button } from '@/shared/ui'

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
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {canPay && (
          <Button loading={busy} onClick={() => void run(() => payOrder(order.id))}>
            Оплатить (тест)
          </Button>
        )}
        {canCancel && (
          <Button
            variant="danger"
            disabled={busy}
            onClick={() => {
              if (window.confirm('Отменить заказ?')) void run(() => cancelOrder(order.id))
            }}
          >
            Отменить заказ
          </Button>
        )}
      </div>
      {error && <Alert>{error}</Alert>}
    </div>
  )
}
