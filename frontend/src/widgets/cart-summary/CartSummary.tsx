import type { ReactNode } from 'react'
import type { Cart } from '@/entities/cart'
import { formatPrice, pluralize } from '@/shared/lib'

interface Props {
  cart: Cart
  action?: ReactNode
}

/** Сводка заказа: количество, скидка, итог и кнопка действия. */
export function CartSummary({ cart, action }: Props) {
  const count = `${cart.totalCount} ${pluralize(cart.totalCount, ['товар', 'товара', 'товаров'])}`

  return (
    <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold">Ваш заказ</h2>
      <p className="mt-1 text-sm text-slate-500">{count}</p>

      {cart.totalDiscount > 0 && (
        <div className="mt-4 flex justify-between text-sm text-emerald-700">
          <span>Скидка</span>
          <span>−{formatPrice(cart.totalDiscount)}</span>
        </div>
      )}

      <div className="mt-4 flex items-baseline justify-between border-t border-slate-100 pt-4">
        <span className="font-semibold">Итого</span>
        <strong className="text-xl font-extrabold">{formatPrice(cart.totalPrice)}</strong>
      </div>

      {action && <div className="mt-5">{action}</div>}
    </aside>
  )
}
