import { ShoppingCart } from 'lucide-react'
import { Link } from 'react-router'
import { useCart, useCartActions } from '@/entities/cart'
import { Price } from '@/entities/product'
import { CartItemControls } from '@/features/cart-item-controls'
import { paths } from '@/shared/config'
import { getErrorMessage, usePageTitle } from '@/shared/lib'
import { Button, buttonClasses, EmptyState, ErrorState, PageLoader, SafeImage } from '@/shared/ui'
import { CartSummary } from '@/widgets/cart-summary'

export function CartPage() {
  usePageTitle('Корзина')
  const { data, loading, error, refetch } = useCart({ fresh: true })
  const { clearCart, pending } = useCartActions()
  const cart = data?.cart

  if (!cart) {
    if (loading) return <PageLoader />
    return <ErrorState message={error ? getErrorMessage(error) : 'Не удалось загрузить корзину'} onRetry={() => void refetch()} />
  }

  if (cart.items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingCart className="size-8" />}
        title="В корзине пока пусто"
        description="Загляните в каталог — там много интересного."
        action={<Link to={paths.catalog} className={buttonClasses()}>Перейти в каталог</Link>}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Корзина</h1>
        <Button variant="ghost" size="sm" disabled={pending} onClick={() => void clearCart().catch(() => undefined)}>
          Очистить корзину
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <ul className="space-y-3">
          {cart.items.map((item) => (
            <li key={item.id} className="flex gap-4 rounded-2xl bg-white p-4">
              <Link to={paths.product(item.product.slug)} className="shrink-0">
                <SafeImage src={item.product.images[0]} alt="" className="size-24 rounded-xl" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Link to={paths.product(item.product.slug)} className="line-clamp-2 font-medium hover:text-brand">
                  {item.product.title}
                </Link>
                <CartItemControls item={item} />
              </div>
              <div className="text-right">
                <Price price={item.lineTotal} />
                {item.quantity > 1 && <p className="text-xs text-slate-400">{item.quantity} × {item.product.price} ₽</p>}
              </div>
            </li>
          ))}
        </ul>

        <CartSummary
          cart={cart}
          action={
            <Link to={paths.checkout} className={buttonClasses({ size: 'lg', fullWidth: true })}>
              Перейти к оформлению
            </Link>
          }
        />
      </div>
    </div>
  )
}
