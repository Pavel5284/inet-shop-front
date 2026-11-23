const KEY = 'market.token'
let memory: string | null = null // запасной вариант, если localStorage недоступен

/** Хранилище JWT-токена. Единственный источник правды о токене. */
export const tokenStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(KEY) ?? memory
    } catch {
      return memory
    }
  },
  set(token: string): void {
    memory = token
    try {
      localStorage.setItem(KEY, token)
    } catch {
      /* localStorage недоступен — токен живёт в памяти до перезагрузки */
    }
  },
  clear(): void {
    memory = null
    try {
      localStorage.removeItem(KEY)
    } catch {
      /* ничего */
    }
  },
}
