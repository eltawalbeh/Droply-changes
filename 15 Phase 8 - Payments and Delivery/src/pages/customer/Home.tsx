import { MapPin, Minus, Plus, RotateCcw, WalletCards } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useCustomerSession } from '../../context/CustomerSessionContext'
import { useApiData } from '../../hooks/useApiData'
import { droplyApi } from '../../services/droply-api'

type Product = {
  id: string
  name: string
  price: number
  size_liters?: number | null
}

export function CustomerHome() {
  const { session } = useCustomerSession()
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'cliq' | 'coupon'>('cash')
  const [message, setMessage] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data, error, isLoading, reload } = useApiData(
    async () => {
      if (!session?.token) throw new Error('Customer session required')
      const [me, orders] = await Promise.all([
        droplyApi.customerMe(session.token),
        droplyApi.customerOrders(session.token),
      ])
      return { me, orders: orders.orders }
    },
    [session?.token],
  )

  const products = (data?.me.containerTypes ?? []) as unknown as Product[]
  const address = (data?.me.addresses?.[0] ?? null) as Record<string, unknown> | null
  const location = data?.me.location as Record<string, unknown> | null
  const lastOrder = data?.orders?.[0]
  const activeOrder = data?.orders?.find((order) =>
    ['new', 'accepted', 'out_for_delivery'].includes(order.status),
  )

  const total = useMemo(
    () =>
      products.reduce(
        (sum, product) => sum + (quantities[product.id] ?? 0) * Number(product.price),
        0,
      ),
    [products, quantities],
  )

  function change(productId: string, delta: number) {
    setQuantities((current) => ({
      ...current,
      [productId]: Math.max(0, (current[productId] ?? 0) + delta),
    }))
  }

  function reorderLast() {
    if (!lastOrder?.items?.length) return
    const next: Record<string, number> = {}
    lastOrder.items.forEach((item) => {
      next[item.containerTypeId] = item.quantity
    })
    setQuantities(next)
    if (lastOrder.paymentMethod) setPaymentMethod(lastOrder.paymentMethod)
  }

  async function placeOrder() {
    if (!session?.token) return
    const items = Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([containerTypeId, quantity]) => ({ containerTypeId, quantity }))

    if (!items.length) {
      setSubmitError('Choose at least one container.')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setMessage(null)

    try {
      const result = await droplyApi.createCustomerOrder(session.token, {
        items,
        paymentMethod,
        idempotencyKey: crypto.randomUUID(),
      })

      setQuantities({})
      setMessage(result.duplicate ? 'This order was already received.' : 'Order received.')
      await reload()
    } catch (reason) {
      setSubmitError(reason instanceof Error ? reason.message : 'Unable to place order')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <div className="py-12 text-center text-sm text-slate-500">Loading your station…</div>
  if (error || !data) return <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error || 'Unable to load account'}</div>

  return (
    <section>
      <p className="text-sm font-medium text-slate-500">
        {(data.me.station as Record<string, unknown> | null)?.name as string || 'Droply'}
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Quick order</h1>

      {activeOrder ? (
        <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">Active order</p>
          <p className="mt-2 text-lg font-semibold">{activeOrder.status.split('_').join(' ')}</p>
          <p className="mt-1 text-sm text-slate-300">{activeOrder.totalAmount.toFixed(3)} JOD</p>
        </div>
      ) : null}

      {lastOrder?.items?.length ? (
        <button onClick={reorderLast} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700">
          <RotateCcw size={17} />
          Same as last order
        </button>
      ) : null}

      <div className="mt-5 grid gap-3">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
            <div>
              <p className="font-medium text-slate-800">{product.name}</p>
              <p className="mt-1 text-sm text-slate-500">{Number(product.price).toFixed(3)} JOD</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => change(product.id, -1)} className="grid size-10 place-items-center rounded-xl border border-slate-200"><Minus size={17} /></button>
              <span className="w-7 text-center text-lg font-semibold">{quantities[product.id] ?? 0}</span>
              <button onClick={() => change(product.id, 1)} className="grid size-10 place-items-center rounded-xl bg-slate-950 text-white"><Plus size={17} /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
        <MapPin size={18} className="mt-0.5 text-slate-400" />
        <div>
          <p className="text-sm font-medium text-slate-800">Delivery address</p>
          <p className="mt-1 text-sm text-slate-500">
            {(address?.address_text as string) || 'No default address'}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
          <WalletCards size={18} className="text-slate-400" />
          Payment
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(['cash', 'cliq', 'coupon'] as const).map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={[
                'rounded-xl border px-3 py-2 text-sm capitalize',
                paymentMethod === method
                  ? 'border-slate-950 bg-slate-950 text-white'
                  : 'border-slate-200 text-slate-600',
              ].join(' ')}
            >
              {method === 'cliq' ? 'CliQ' : method}
            </button>
          ))}
        </div>
        {paymentMethod === 'cliq' && location?.cliq_alias ? (
          <p className="mt-3 text-xs text-slate-500">CliQ: {String(location.cliq_alias)}</p>
        ) : null}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-sm text-slate-500">Total</span>
        <strong className="text-xl text-slate-950">{total.toFixed(3)} JOD</strong>
      </div>

      {message ? <p className="mt-3 text-sm text-emerald-700">{message}</p> : null}
      {submitError ? <p className="mt-3 text-sm text-rose-600">{submitError}</p> : null}

      <button onClick={placeOrder} disabled={isSubmitting || total <= 0} className="mt-5 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400">
        {isSubmitting ? 'Sending order…' : 'Order Now'}
      </button>
    </section>
  )
}
