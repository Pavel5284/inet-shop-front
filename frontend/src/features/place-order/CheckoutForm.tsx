import { Alert, Box, Button, MenuItem, Paper, TextField } from '@mui/material'
import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useNavigate } from 'react-router'
import { useCreateOrder, type PaymentMethod } from '@/entities/order'
import { paths } from '@/shared/config'
import { getErrorMessage } from '@/shared/lib'

export interface CheckoutDefaults {
  recipientName: string
  phone: string
  address: string
}

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
    <Paper component="form" onSubmit={onSubmit} sx={{ p: 3 }}>
      <Box sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Получатель" id="recipient" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} fullWidth slotProps={{ htmlInput: { required: true } }} />
        <TextField label="Телефон" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth slotProps={{ htmlInput: { required: true } }} />
        <TextField label="Адрес доставки" id="address" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth slotProps={{ htmlInput: { required: true } }} />
        <TextField label="Комментарий курьеру" id="comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Например, код домофона" multiline minRows={2} fullWidth />
        <TextField select label="Способ оплаты" id="payment" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} fullWidth>
          <MenuItem value="CARD">Картой онлайн</MenuItem>
          <MenuItem value="CASH">При получении</MenuItem>
        </TextField>
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained" size="large" fullWidth loading={loading}>
          Оформить заказ
        </Button>
      </Box>
    </Paper>
  )
}
