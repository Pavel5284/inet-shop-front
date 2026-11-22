import { Chip } from '@mui/material'
import { ORDER_STATUS_LABEL, type OrderStatus } from '../model/types'

const TONES: Record<OrderStatus, 'warning' | 'success' | 'info' | 'default' | 'error'> = {
  NEW: 'warning',
  PAID: 'success',
  SHIPPED: 'info',
  DELIVERED: 'default',
  CANCELLED: 'error',
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Chip label={ORDER_STATUS_LABEL[status]} color={TONES[status]} size="small" />
}
