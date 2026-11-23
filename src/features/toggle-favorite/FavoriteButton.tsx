import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
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
    <Tooltip title={error ?? ''}>
      <IconButton
        aria-label={active ? 'Убрать из избранного' : 'В избранное'}
        aria-pressed={active}
        onClick={onClick}
        className={className}
        sx={{ bgcolor: 'background.paper', color: active ? 'secondary.main' : 'text.secondary' }}
      >
        {active ? <Favorite /> : <FavoriteBorder />}
      </IconButton>
    </Tooltip>
  )
}
