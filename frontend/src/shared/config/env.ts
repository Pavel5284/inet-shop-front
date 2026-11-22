export const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL ?? '/graphql'
export const CURRENCY = import.meta.env.VITE_CURRENCY ?? 'RUB'
export const SHOW_DEMO_LOGIN = import.meta.env.VITE_SHOW_DEMO_LOGIN !== 'false'

export const APP_NAME = 'Маркет'
export const LOCALE = 'ru-RU'

/** Учётные данные демо-аккаунта из seed бэкенда. */
export const DEMO_CREDENTIALS = { email: 'demo@example.com', password: 'Demo12345!' } as const
