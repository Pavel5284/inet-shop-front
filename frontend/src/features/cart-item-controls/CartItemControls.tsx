import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useCartActions, type CartItem } from '@/entities/cart'
import { getErrorMessage } from '@/shared/lib'
import { QuantityStepper } from '@/shared/ui'

/** Управление количеством и удалением позиции в корзине. */
export function CartItemControls({ item }: { item: CartItem }) {
  const { setQuantity, removeFromCart, pending } = useCartActions()
  const [error, setError] = useState<string>()

  const run = async (action: () => Promise<unknown>) => {
    setError(undefined)
    try {
      await action()
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper
          value={item.quantity}
          max={Math.min(item.product.stock, 20)}
          disabled={pending}
          onChange={(q) => void run(() => setQuantity(item.product.id, q))}
        />
        <button
          type="button"
          disabled={pending}
          onClick={() => void run(() => removeFromCart(item.product.id))}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-red-600 disabled:opacity-50"
        >
          <Trash2 className="size-4" />
          Удалить
        </button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
