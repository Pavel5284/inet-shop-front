import { ApolloClient, ApolloLink, CombinedGraphQLErrors, HttpLink, InMemoryCache } from '@apollo/client'
import { SetContextLink } from '@apollo/client/link/context'
import { ErrorLink } from '@apollo/client/link/error'
import { GRAPHQL_URL } from '@/shared/config'
import { tokenStorage } from '@/shared/lib'

/**
 * Если сервер ответил UNAUTHENTICATED (токен просрочен или подделан), вызываем этот обработчик.
 * Зарегистрирует его слой app — там известно, как «разлогинить» пользователя.
 */
let onUnauthorized: (() => void) | undefined
export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler
}

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error) && error.errors.some((e) => e.extensions?.code === 'UNAUTHENTICATED')) {
    // Не разлогиниваем, если токена и не было (обычный гость).
    if (tokenStorage.get()) onUnauthorized?.()
  }
})

/** Подставляет Authorization: Bearer <token> в каждый запрос. */
const authLink = new SetContextLink((prevContext) => {
  const token = tokenStorage.get()
  return { headers: { ...prevContext.headers, ...(token ? { authorization: `Bearer ${token}` } : {}) } }
})

export const apolloClient = new ApolloClient({
  // Сначала мгновенно показываем данные из кэша, затем обновляем с сервера (остатки, цены, статусы).
  defaultOptions: { watchQuery: { fetchPolicy: 'cache-and-network' } },
  link: ApolloLink.from([errorLink, authLink, new HttpLink({ uri: GRAPHQL_URL })]),
  cache: new InMemoryCache({
    typePolicies: {
      // Корзина у пользователя одна: делаем её «синглтоном» в кэше, чтобы любая мутация
      // (добавить/изменить/удалить) автоматически обновляла все места, где корзина показана.
      Cart: { keyFields: [] },
    },
  }),
})
