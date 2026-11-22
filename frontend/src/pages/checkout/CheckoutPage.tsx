import { useCart } from '@/entities/cart'
import { Price } from '@/entities/product'
import { useMe } from '@/entities/user'
import { CheckoutForm } from '@/features/place-order'
import { usePageTitle } from '@/shared/lib'
import { ErrorState, PageLoader, SafeImage } from '@/shared/ui'
import { CartSummary } from '@/widgets/cart-summary'

export function CheckoutPage() {
  usePageTitle('Оформление заказа')
  const me = useMe()
  const cart = useCart({ fresh: true })
  const user = me.data?.me
  const cartData = cart.data?.cart

  if (!user || !cartData) {
    return me.loading || cart.loading ? (
      <PageLoader />
    ) : (
      <ErrorState
        message="Не удалось загрузить данные оформления"
        onRetry={() => {
          void me.refetch()
          void cart.refetch()
        }}
      />
    )
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Оформление заказа</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <CheckoutForm
          key={user.id}
          defaults={{
            recipientName: `${user.firstName} ${user.lastName}`.trim(),
            phone: user.phone ?? '',
            address: user.address ?? '',
          }}
        />

        <div className="space-y-4">
          <CartSummary cart={cartData} />
          <ul className="space-y-2 rounded-2xl bg-white p-4 shadow-sm">
            {cartData.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <SafeImage src={item.product.images[0]} alt="" className="size-12 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.product.title}</p>
                  <p className="text-xs text-slate-400">{item.quantity} шт.</p>
                </div>
                <Price price={item.lineTotal} className="text-sm" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
