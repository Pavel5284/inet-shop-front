/** Что мы кладём в location.state, когда отправляем гостя на страницу входа. */
export interface AuthRedirectState {
  from?: { pathname: string; search?: string; hash?: string }
  reason?: string
}

/** Куда вернуть пользователя после входа. */
export function getRedirectTarget(state: unknown, fallback: string): string {
  const from = (state as AuthRedirectState | null)?.from
  return from ? `${from.pathname}${from.search ?? ''}${from.hash ?? ''}` : fallback
}
