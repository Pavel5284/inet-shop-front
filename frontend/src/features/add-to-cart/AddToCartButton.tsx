import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useCart, useCartActions } from '@/entities/cart'
import { useIsAuthenticated } from '@/entities/session'
import { paths } from '@/shared/config'
import { getErrorMessage, type AuthRedirectState } from '@/shared/lib'
import { Button, QuantityStepper } from '@/shared/ui'

/**
 * Кнопка «В корзину». Если товар уже в корзине — превращается в счётчик (как на Ozon).
 * Гостя отправляет на страницу входа и после входа возвращает обратно.
 */
export function AddToCartButton({ product, size = 'md' }: { product: { id: string; stock: number }; size?: 'md' | 'lg' }) {
  const isAuth = useIsAuthenticated()
  const navigate = useNavigate()
  const location = useLocation()
  const { data } = useCart({ skip: !isAuth })
  const { addToCart, setQuantity, pending } = useCartActions()
  const [error, setError] = useState<string>()

  const run = async (action: () => Promise<unknown>) => {
    setError(undefined)
    try {
      await action()
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  if (!isAuth) {
    const state: AuthRedirectState = { from: location, reason: 'Войдите, чтобы добавить товар в корзину' }
    return (
      <Button fullWidth size={size} onClick={() => navigate(paths.login, { state })}>
        В корзину
      </Button>
    )
  }

  const item = data?.cart.items.find((i) => i.product.id === product.id)

  return (
    <div className="space-y-1">
      {item ? (
        <div className="flex items-center justify-between gap-2">
          <QuantityStepper value={item.quantity} max={Math.min(product.stock, 20)} disabled={pending} onChange={(q) => void run(() => setQuantity(product.id, q))} />
          <Link to={paths.cart} className="text-sm font-semibold text-brand hover:underline">
            В корзине
          </Link>
        </div>
      ) : (
        <Button fullWidth size={size} loading={pending} onClick={() => void run(() => addToCart(product.id))}>
          В корзину
        </Button>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
