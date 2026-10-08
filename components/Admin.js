'use client'
import { useEffect, useState } from 'react'
import { money } from '../lib/site'

const blank = { name: '', price: '', category: '', short: '', description: '', detailsText: '', featuresText: '', sizeLabel: '', sizesText: '', images: [], inStock: true }
const STATUS = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

export function Login() {
  const [err, setErr] = useState('')
  async function go(e) {
    e.preventDefault()
    const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: new FormData(e.target).get('password') }) })
    r.ok ? location.reload() : setErr('Wrong password')
  }
  return (
    <div className="wrap" style={{ maxWidth: 420, paddingTop: 100 }}>
      <h1 style={{ fontSize: 44 }}>Admin</h1>
      <form onSubmit={go} className="aform"><label>Password<input name="password" type="password" required autoFocus /></label>{err && <p className="err">{err}</p>}<button className="btn">Sign in</button></form>
    </div>
  )
}

export default function Admin() {
  const [tab, setTab] = useState('products')
  const [prods, setProds] = useState([])
  const [orders, setOrders] = useState([])
  const [f, setF] = useState(null)
  const [busy, setBusy] = useState(false)
  const load = async () => { setProds(await (await fetch('/api/admin/products')).json()); setOrders(await (await fetch('/api/admin/orders')).json()) }
  useEffect(() => { load() }, [])
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const edit = (p) => setF({ ...p, detailsText: (p.details || []).map((d) => `${d.label}: ${d.value}`).join('\n'), featuresText: (p.features || []).join('\n'), sizeLabel: p.sizeLabel || '', sizesText: (p.sizes || []).join('\n') })

  async function upload(files) {
    setBusy(true); const urls = []
    for (const file of files) { const fd = new FormData(); fd.append('file', file); const r = await fetch('/api/admin/upload', { method: 'POST', body: fd }); const d = await r.json(); r.ok ? urls.push(d.url) : alert(d.error) }
    setF((x) => ({ ...x, images: [...x.images, ...urls] })); setBusy(false)
  }
  async function save(e) {
    e.preventDefault(); setBusy(true)
    const details = f.detailsText.split('\n').map((l) => { const i = l.indexOf(':'); return i > 0 ? { label: l.slice(0, i).trim(), value: l.slice(i + 1).trim() } : null }).filter(Boolean)
    const body = { ...f, price: Number(f.price), details, features: f.featuresText.split('\n').map((x) => x.trim()).filter(Boolean), sizes: f.sizesText.split('\n').map((x) => x.trim()).filter(Boolean) }
    const r = await fetch('/api/admin/products', { method: f.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setBusy(false); if (!r.ok) return alert((await r.json()).error)
    setF(null); load()
  }
  async function del(p) { if (confirm(`Delete "${p.name}"?`)) { await fetch('/api/admin/products?id=' + p.id, { method: 'DELETE' }); load() } }
  async function status(id, s) { await fetch('/api/admin/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: s }) }); load() }
  async function out() { await fetch('/api/admin/logout', { method: 'POST' }); location.reload() }

  return (
    <div className="wrap adm">
      <div className="atop"><h1 style={{ fontSize: 42, margin: 0 }}>Admin panel</h1><div className="cta"><a className="btn ghost sm" href="/" target="_blank">View website</a><button className="btn sm" onClick={out}>Log out</button></div></div>
      <div className="tabs"><button className={tab === 'products' ? 'on' : ''} onClick={() => setTab('products')}>Products ({prods.length})</button><button className={tab === 'orders' ? 'on' : ''} onClick={() => setTab('orders')}>Orders ({orders.length})</button></div>

      {tab === 'products' && (<>
        {!f && <button className="btn" style={{ marginBottom: 20 }} onClick={() => setF({ ...blank })}>+ Add product</button>}
        {f && (
          <form className="aform" onSubmit={save}>
            <h3>{f.id ? 'Edit product' : 'New product'}</h3>
            <div className="two"><label>Name<input value={f.name} onChange={set('name')} required /></label><label>Price (Rs)<input type="number" min="0" value={f.price} onChange={set('price')} required /></label></div>
            <div className="two"><label>Category (e.g. Bags)<input value={f.category} onChange={set('category')} /></label><label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}><input style={{ width: 'auto', margin: 0 }} type="checkbox" checked={f.inStock} onChange={set('inStock')} /> In stock</label></div>
            <label>Short description<input value={f.short} onChange={set('short')} /></label>
            <label>Full description (new line = new paragraph)<textarea rows={5} value={f.description} onChange={set('description')} /></label>
            <label>Details — one per line as &quot;Label: value&quot; (e.g. Material: Cotton yarn)<textarea rows={4} value={f.detailsText} onChange={set('detailsText')} /></label>
            <label>Features — one per line<textarea rows={3} value={f.featuresText} onChange={set('featuresText')} /></label>
            <div className="two"><label>Size label (e.g. Bangle size, Bag size) — leave empty if no sizes<input value={f.sizeLabel} onChange={set('sizeLabel')} /></label><label>Size options — one per line<textarea rows={3} value={f.sizesText} onChange={set('sizesText')} placeholder={'2.2\n2.4\n2.6'} /></label></div>
            <div><label>Photos (first photo is the main one)<input type="file" accept="image/*" multiple onChange={(e) => upload([...e.target.files])} /></label>
              <div className="imgs" style={{ marginTop: 10 }}>{f.images.map((u) => <div key={u}><img src={u} alt="" /><button type="button" onClick={() => setF({ ...f, images: f.images.filter((x) => x !== u) })}>×</button></div>)}</div></div>
            <div className="cta"><button className="btn" disabled={busy}>{busy ? 'Please wait…' : 'Save product'}</button><button type="button" className="btn ghost" onClick={() => setF(null)}>Cancel</button></div>
          </form>
        )}
        <div className="plist">{prods.map((p) => (
          <div className="prow" key={p.id}><img src={p.images[0]} alt="" /><div className="g"><b>{p.name}</b><br /><small>{money(p.price)} · {p.category} · {p.inStock ? 'In stock' : 'Sold out'}</small></div>
            <button className="btn ghost sm" onClick={() => { edit(p); scrollTo({ top: 0, behavior: 'smooth' }) }}>Edit</button><button className="btn ghost sm danger" onClick={() => del(p)}>Delete</button></div>))}</div>
      </>)}

      {tab === 'orders' && (orders.length === 0 ? <p>No orders yet.</p> : orders.map((o) => (
        <div className="orow" key={o.id}>
          <div><b>{o.id}</b> · {new Date(o.createdAt).toLocaleString()}<br />{o.productName} × {o.qty} — <b>{money(o.total)}</b><br /><small>{o.payment}</small>{o.size && <><br />Size: <b>{o.size}</b></>}{o.custom && <><br /><small>Custom request: {o.custom}</small></>}{o.refImage && <><br /><a href={o.refImage} target="_blank"><img src={o.refImage} alt="Reference" style={{ width: 90, marginTop: 6 }} /></a></>}</div>
          <div>{o.name}<br /><small>{o.phone}<br />{o.email}<br />{o.address}, {o.city}{o.notes && <><br />Note: {o.notes}</>}</small></div>
          <select value={o.status} onChange={(e) => status(o.id, e.target.value)} style={{ margin: 0, height: 42 }}>{STATUS.map((s) => <option key={s}>{s}</option>)}</select>
        </div>)))}
    </div>
  )
}
