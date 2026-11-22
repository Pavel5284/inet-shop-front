import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { DEMO_CREDENTIALS, SHOW_DEMO_LOGIN, paths } from '@/shared/config'
import { getErrorMessage, getRedirectTarget, usePageTitle, type AuthRedirectState } from '@/shared/lib'
import { Alert, Button, Input } from '@/shared/ui'
import { useLogin } from '../api/auth.api'

/** Форма входа: обычный вход по email и кнопка демо-входа. После входа возвращает на исходную страницу. */
export function LoginForm() {
  usePageTitle('Вход')
  const navigate = useNavigate()
  const location = useLocation()
  const login = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  const state = location.state as AuthRedirectState | null
  const target = getRedirectTarget(state, paths.home)

  const submit = async (loginEmail: string, loginPassword: string) => {
    setError(undefined)
    setLoading(true)
    try {
      await login({ email: loginEmail, password: loginPassword })
      navigate(target, { replace: true })
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submit(email, password)
  }

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold">Вход</h1>
      {state?.reason && <Alert tone="info">{state.reason}</Alert>}
      {error && <Alert>{error}</Alert>}
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input
          label="Пароль"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" fullWidth loading={loading}>
          Войти
        </Button>
      </form>
      {SHOW_DEMO_LOGIN && (
        <Button variant="outline" fullWidth loading={loading} onClick={() => void submit(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password)}>
          Войти как демо-пользователь
        </Button>
      )}
    </div>
  )
}
