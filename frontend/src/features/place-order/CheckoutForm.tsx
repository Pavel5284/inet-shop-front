import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useNavigate } from 'react-router'
import { useCreateOrder, type PaymentMethod } from '@/entities/order'
import { paths } from '@/shared/config'
import { getErrorMessage } from '@/shared/lib'
import { Alert, Button, Input, Select, Textarea } from '@/shared/ui'

export interface CheckoutDefaults {
  recipientName: string
  phone: string
  address: string
}

const PAYMENT_OPTIONS = [
  { value: 'CARD', label: 'Картой онлайн' },
  { value: 'CASH', label: 'При получении' },
]

/** Форма оформления заказа: создаёт заказ и уводит на его страницу. */
export function CheckoutForm({ defaults }: { defaults: CheckoutDefaults }) {
  const navigate = useNavigate()
  const createOrder = useCreateOrder()
  const [recipientName, setRecipientName] = useState(defaults.recipientName)
  const [phone, setPhone] = useState(defaults.phone)
  const [address, setAddress] = useState(defaults.address)
  const [comment, setComment] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(undefined)
    setLoading(true)
    void createOrder({ recipientName, phone, address, comment, paymentMethod })
      .then((order) => navigate(paths.order(order.id), { replace: true }))
      .catch((e: unknown) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false))
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <Input label="Получатель" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} required />
      <Input label="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      <Input label="Адрес доставки" value={address} onChange={(e) => setAddress(e.target.value)} required />
      <Textarea label="Комментарий курьеру" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Например, код домофона" />
      <Select
        label="Способ оплаты"
        options={PAYMENT_OPTIONS}
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
      />
      {error && <Alert>{error}</Alert>}
      <Button type="submit" size="lg" fullWidth loading={loading}>
        Оформить заказ
      </Button>
    </form>
  )
}
