import { ApolloProvider } from '@apollo/client/react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import type { ReactNode } from 'react'
import { apolloClient } from '@/shared/api'
import { theme } from '../theme'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ApolloProvider>
  )
}
