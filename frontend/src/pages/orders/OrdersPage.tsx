import { Package } from 'lucide-react'
import { Link } from 'react-router'
import { OrderStatusBadge, useOrders } from '@/entities/order'
import { paths } from '@/shared/config'
import { formatDate, formatPrice, usePageTitle } from '@/shared/lib'
import { EmptyState, ErrorState, PageLoader } from '@/shared/ui'

export function OrdersPage() {
  usePageTitle('Мои заказы')
  const { data, loading, error, refetch } = useOrders()

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Мои заказы</h1>
      {!data ? (
        loading ? (
          <PageLoader />
        ) : (
          <ErrorState message={error ? 'Не удалось загрузить заказы' : 'Заказы недоступны'} onRetry={() => void refetch()} />
        )
      ) : data.orders.length === 0 ? (
        <EmptyState icon={<Package className="size-8" />} title="Заказов пока нет" description="Здесь появятся ваши заказы." />
      ) : (
        <ul className="space-y-3">
          {data.orders.map((order) => (
            <li key={order.id}>
              <Link
                to={paths.order(order.id)}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div>
                  <span className="font-semibold">Заказ №{order.number}</span>
                  <p className="text-xs text-slate-400">{formatDate(order.createdAt)}</p>
                </div>
                <OrderStatusBadge status={order.status} />
                <span className="font-bold">{formatPrice(order.totalPrice)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
