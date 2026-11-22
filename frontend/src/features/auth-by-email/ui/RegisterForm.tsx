import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { paths } from '@/shared/config'
import { getErrorMessage, getRedirectTarget, usePageTitle, type AuthRedirectState } from '@/shared/lib'
import { Alert, Button, Input } from '@/shared/ui'
import { useRegister } from '../api/auth.api'

/** Регистрация нового покупателя. После успеха — сразу на главную (или на страницу, с которой пришли). */
export function RegisterForm() {
  usePageTitle('Регистрация')
  const navigate = useNavigate()
  const location = useLocation()
  const register = useRegister()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  const state = location.state as AuthRedirectState | null

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (password !== confirm) {
      setError('Пароли не совпадают')
      return
    }
    setError(undefined)
    setLoading(true)
    void register({ firstName, lastName, email, password })
      .then(() => navigate(getRedirectTarget(state, paths.home), { replace: true }))
      .catch((e: unknown) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false))
  }

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold">Регистрация</h1>
      {error && <Alert>{error}</Alert>}
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Имя" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <Input label="Фамилия" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        <Input label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input
          label="Пароль"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          label="Повторите пароль"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <Button type="submit" fullWidth loading={loading}>
          Зарегистрироваться
        </Button>
      </form>
    </div>
  )
}
