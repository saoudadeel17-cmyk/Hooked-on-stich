'use client'
import { useState } from 'react'
import { money, waLink } from '../lib/site'

const MAX = 150
const wc = (t) => (t.trim() ? t.trim().split(/\s+/).length : 0)

export default function OrderForm({ product }) {
  const [qty, setQty] = useState(1)
  const [txt, setTxt] = useState('')
  const [state, setState] = useState({ s: 'idle' })
  const sizes = product.sizes || []

  const onTxt = (e) => {
    const v = e.target.value
    setTxt(wc(v) <= MAX ? v : v.trim().split(/\s+/).slice(0, MAX).join(' '))
  }
  async function submit(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const ref = fd.get('ref')
    if (ref && ref.size > 4e6) return setState({ s: 'err', msg: 'Reference photo must be under 4 MB.' })
    fd.append('productId', product.id)
    setState({ s: 'busy' })
    try {
      const r = await fetch('/api/orders', { method: 'POST', body: fd })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Something went wrong')
      setState({ s: 'done', id: d.id, emailed: d.emailed, email: fd.get('email') })
    } catch (err) { setState({ s: 'err', msg: err.message }) }
  }
  if (state.s === 'done') return (
    <div className="ok">
      <h3>Thank you! Your order is placed 🎉</h3>
      <p>Order number <b>{state.id}</b>.</p>
      <p>{state.emailed ? <>A confirmation email has been sent to <b>{state.email}</b>.</> : <>We will confirm your order shortly by phone / WhatsApp.</>}</p>
      <a className="btn ghost" href={waLink(`Hi! I just placed order ${state.id} for ${product.name}.`)} target="_blank" rel="noreferrer">Message us on WhatsApp</a>
    </div>
  )
  if (!product.inStock) return <div className="ok"><p>This piece is currently sold out. Message us on WhatsApp for a custom order.</p></div>
  return (
    <form className="oform" onSubmit={submit}>
      <h3>Order this piece</h3>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
      <div className="two">
        <label>Full name<input name="name" required /></label>
        <label>Phone / WhatsApp<input name="phone" required inputMode="tel" /></label>
      </div>
      <label>Email (for confirmation)<input name="email" type="email" required /></label>
      <label>Delivery address<input name="address" required /></label>
      <div className="two">
        <label>City<input name="city" required /></label>
        <label>Quantity<input name="qty" type="number" min="1" max="50" value={qty} onChange={(e) => setQty(e.target.value)} required /></label>
      </div>
      {sizes.length > 0 && (
        <label>{product.sizeLabel || 'Size'}
          <select name="size" required defaultValue=""><option value="" disabled>Select…</option>{sizes.map((s) => <option key={s}>{s}</option>)}<option>Custom size (describe below)</option></select>
        </label>
      )}
      <label>Custom request / reference (optional) <span className={wc(txt) >= MAX ? 'cnt full' : 'cnt'}>{wc(txt)}/{MAX} words</span>
        <textarea name="custom" rows={4} value={txt} onChange={onTxt} placeholder="Want a different colour, size or design? Describe it here, or refer to a photo you like (e.g. “like the red roses bag but in blue, medium size”)." />
      </label>
      <label>Reference photo (optional)<input name="ref" type="file" accept="image/*" /></label>
      <label>Payment method
        <select name="payment"><option>Cash on Delivery</option><option>Online Payment</option></select>
      </label>
      <div className="total"><span>Total</span><b>{money(product.price * (parseInt(qty) || 1))}</b></div>
      <p className="fine">Prices for custom requests are confirmed by us before we start.</p>
      {state.s === 'err' && <p className="err">{state.msg}</p>}
      <button className="btn full" disabled={state.s === 'busy'}>{state.s === 'busy' ? 'Placing order…' : 'Place order'}</button>
    </form>
  )
}
