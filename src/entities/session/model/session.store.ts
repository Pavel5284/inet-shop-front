import { create } from 'zustand'
import { tokenStorage } from '@/shared/lib'

export interface SessionUser {
  id: string
  email: string
  firstName: string
  lastName: string
}

const USER_KEY = 'market.user'

function loadUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as SessionUser) : null
  } catch {
    return null
  }
}

function saveUser(user: SessionUser | null) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  } catch {
    /* localStorage недоступен */
  }
}

interface SessionState {
  token: string | null
  user: SessionUser | null
  /** Кратковременный флаг: выход уже начался, но навигация на главную ещё не зафиксирована. */
  loggingOut: boolean
}

/** Состояние сессии. Токен хранится в tokenStorage (его читает Apollo), здесь — реактивная копия для React. */
export const useSessionStore = create<SessionState>(() => ({
  token: tokenStorage.get(),
  user: loadUser(),
  loggingOut: false,
}))

export const sessionActions = {
  beginLogout() {
    useSessionStore.setState({ loggingOut: true })
  },
  endLogout() {
    useSessionStore.setState({ loggingOut: false })
  },
  setSession(token: string, user: SessionUser) {
    tokenStorage.set(token)
    saveUser(user)
    useSessionStore.setState({ token, user, loggingOut: false })
  },
  updateUser(user: SessionUser) {
    saveUser(user)
    useSessionStore.setState({ user })
  },
  clear() {
    tokenStorage.clear()
    saveUser(null)
    useSessionStore.setState({ token: null, user: null })
  },
}

export const useIsAuthenticated = () => useSessionStore((s) => s.token !== null)
export const useSessionUser = () => useSessionStore((s) => s.user)
