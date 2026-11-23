import { ApolloProvider } from '@apollo/client/react'
import { CssBaseline } from '@mui/material'
import type { ReactNode } from 'react'
import { apolloClient } from '@/shared/api'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      {/* Стандартные стили Material UI: дефолтная тема, без кастомной палитры */}
      <CssBaseline />
      {children}
    </ApolloProvider>
  )
}
