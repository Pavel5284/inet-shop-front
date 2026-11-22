import clsx from 'clsx'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useFavoriteIds, useToggleFavorite } from '@/entities/favorite'
import { useIsAuthenticated } from '@/entities/session'
import { paths } from '@/shared/config'
import { getErrorMessage, type AuthRedirectState } from '@/shared/lib'

interface Props {
  productId: string
  className?: string
}

/** Сердечко: для гостя — вход, для вошедшего — переключение избранного. */
export function FavoriteButton({ productId, className }: Props) {
  const isAuth = useIsAuthenticated()
  const favoriteIds = useFavoriteIds({ skip: !isAuth })
  const toggleFavorite = useToggleFavorite()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState<string>()

  const active = favoriteIds.has(productId)

  const onClick = () => {
    setError(undefined)
    if (!isAuth) {
      const state: AuthRedirectState = { from: location, reason: 'Войдите, чтобы добавить товар в избранное' }
      navigate(paths.login, { state })
      return
    }
    void toggleFavorite(productId).catch((e: unknown) => setError(getErrorMessage(e)))
  }

  return (
    <>
      <button
        type="button"
        aria-label={active ? 'Убрать из избранного' : 'В избранное'}
        aria-pressed={active}
        onClick={onClick}
        title={error}
        className={clsx(
          'flex size-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white',
          active ? 'text-accent' : 'text-slate-400 hover:text-accent',
          className,
        )}
      >
        <Heart className={clsx('size-5', active && 'fill-current')} />
      </button>
      {error && (
        <span role="alert" className="sr-only">
          {error}
        </span>
      )}
    </>
  )
}
