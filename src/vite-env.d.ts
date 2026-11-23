/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Адрес GraphQL API. По умолчанию '/graphql' (проксируется Vite в dev и nginx в Docker). */
  readonly VITE_GRAPHQL_URL?: string
  /** Код валюты ISO 4217, например RUB, KZT, USD. */
  readonly VITE_CURRENCY?: string
  /** 'false' — скрыть кнопку «Войти как демо-пользователь» (для боевого сервера). */
  readonly VITE_SHOW_DEMO_LOGIN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
