import { CombinedGraphQLErrors } from '@apollo/client'

/** Превращает любую ошибку (GraphQL, сеть, JS) в понятный пользователю текст. */
export function getErrorMessage(error: unknown): string {
  if (CombinedGraphQLErrors.is(error)) {
    return error.errors.map((e) => e.message).join('. ')
  }
  if (error instanceof Error) {
    if (/fetch/i.test(error.message)) return 'Не удалось связаться с сервером. Проверьте соединение.'
    return error.message
  }
  return 'Что-то пошло не так. Попробуйте ещё раз.'
}
