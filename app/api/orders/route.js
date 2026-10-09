import { saveImage } from '../../../lib/storage'
import { getProducts, getOrders, saveOrders } from '../../../lib/db'
import { sendOrderEmails } from '../../../lib/mail'

const words = (t) => (t.trim() ? t.trim().split(/\s+/).length : 0)

export async function POST(req) {
  const fd = await req.formData().catch(() => null)
  if (!fd) return Response.json({ error: 'Bad request' }, { status: 400 })
  if (fd.get('website')) return Response.json({ ok: true }) // honeypot
  const g = (k, n = 300) => String(fd.get(k) ?? '').trim().slice(0, n)
  const qty = Math.min(50, Math.max(1, parseInt(g('qty')) || 1))
  const p = (await getProducts()).find((x) => x.id === g('productId'))
  const email = g('email', 120), custom = g('custom', 1500), size = g('size', 80)
  if (!p || !p.inStock) return Response.json({ error: 'Product not available' }, { status: 400 })
  if (!g('name') || !g('phone', 30) || !g('address') || !g('city', 60) || !/^\S+@\S+\.\S+$/.test(email))
    return Response.json({ error: 'Please fill all fields with a valid email.' }, { status: 400 })
  if (p.sizes?.length && !(p.sizes.includes(size) || size.startsWith('Custom size')))
    return Response.json({ error: 'Please select a size.' }, { status: 400 })
  if (words(custom) > 150) return Response.json({ error: 'Custom request is limited to 150 words.' }, { status: 400 })

  const id = 'HS-' + Date.now().toString(36).toUpperCase()
  let refImage = ''
  const file = fd.get('ref')
  if (file && typeof file === 'object' && file.size > 0) {
    const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[file.type]
    if (!ext || file.size > 4e6) return Response.json({ error: 'Reference photo must be a JPG/PNG/WEBP under 4 MB.' }, { status: 400 })
    refImage = await saveImage(Buffer.from(await file.arrayBuffer()), `orders/${id}.${ext}`, file.type)
  }
  const order = {
    id, createdAt: new Date().toISOString(), status: 'Pending',
    productId: p.id, productName: p.name, qty, total: p.price * qty, size, custom, refImage,
    name: g('name', 80), email, phone: g('phone', 30), address: g('address'), city: g('city', 60),
    payment: g('payment') === 'Online Payment' ? 'Online Payment' : 'Cash on Delivery', notes: '',
  }
  const orders = await getOrders(); orders.unshift(order); await saveOrders(orders)
  const mail = await sendOrderEmails(order)
  return Response.json({ ok: true, id, emailed: mail.customer })
}
