import clsx from 'clsx'
import { ORDER_STATUS_LABEL, type OrderStatus } from '../model/types'

const TONES: Record<OrderStatus, string> = {
  NEW: 'bg-amber-100 text-amber-800',
  PAID: 'bg-emerald-100 text-emerald-800',
  SHIPPED: 'bg-sky-100 text-sky-800',
  DELIVERED: 'bg-slate-200 text-slate-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={clsx('inline-flex rounded-full px-3 py-1 text-xs font-bold', TONES[status])}>{ORDER_STATUS_LABEL[status]}</span>
}
