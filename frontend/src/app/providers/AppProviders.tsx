import { ApolloProvider } from '@apollo/client/react'
import type { ReactNode } from 'react'
import { apolloClient } from '@/shared/api'

export function AppProviders({ children }: { children: ReactNode }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
