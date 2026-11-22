import { useParams } from 'react-router'
import { OrderStatusBadge, useOrder } from '@/entities/order'
import { OrderActions } from '@/features/order-actions'
import { formatDate, formatPrice, usePageTitle } from '@/shared/lib'
import { ErrorState, PageLoader, SafeImage } from '@/shared/ui'

export function OrderPage() {
  usePageTitle('Заказ')
  const { id = '' } = useParams()
  const { data, loading, error, refetch } = useOrder(id)
  const order = data?.order

  if (!order) {
    return loading ? (
      <PageLoader />
    ) : (
      <ErrorState message={error ? 'Заказ не найден' : 'Не удалось загрузить заказ'} onRetry={() => void refetch()} />
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Заказ №{order.number}</h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="text-sm text-slate-500">Оформлен {formatDate(order.createdAt)}</p>

      <OrderActions order={order} />

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-bold">Состав заказа</h2>
        <ul className="space-y-3">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <SafeImage src={item.image} alt="" className="size-14 rounded-lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="text-xs text-slate-400">{item.quantity} шт. × {formatPrice(item.price)}</p>
              </div>
              <span className="text-sm font-semibold">{formatPrice(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-lg font-bold">
          <span>Итого</span>
          <span>{formatPrice(order.totalPrice)}</span>
        </div>
      </section>

      <section className="grid gap-3 rounded-2xl bg-white p-5 text-sm shadow-sm sm:grid-cols-2">
        <div>
          <p className="text-slate-400">Получатель</p>
          <p className="font-medium">{order.recipientName}</p>
        </div>
        <div>
          <p className="text-slate-400">Телефон</p>
          <p className="font-medium">{order.phone}</p>
        </div>
        <div>
          <p className="text-slate-400">Адрес доставки</p>
          <p className="font-medium">{order.address}</p>
        </div>
        {order.comment && (
          <div>
            <p className="text-slate-400">Комментарий курьеру</p>
            <p className="font-medium">{order.comment}</p>
          </div>
        )}
      </section>
    </div>
  )
}
