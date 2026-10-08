import { isAdmin } from '../../../../lib/auth'
import { getProducts, saveProducts } from '../../../../lib/db'
const no = () => Response.json({ error: 'Unauthorized' }, { status: 401 })
const arr = (a) => (Array.isArray(a) ? a : [])
function clean(b) {
  return {
    name: String(b.name || '').trim().slice(0, 100), price: Math.max(0, Number(b.price) || 0),
    category: String(b.category || '').trim().slice(0, 40), short: String(b.short || '').slice(0, 300),
    description: String(b.description || '').slice(0, 4000),
    details: arr(b.details).filter((d) => d.label && d.value).map((d) => ({ label: String(d.label), value: String(d.value) })),
    features: arr(b.features).map(String).filter(Boolean),
    images: arr(b.images).map(String).filter((u) => u.startsWith('/')),
    inStock: b.inStock !== false,
    sizeLabel: String(b.sizeLabel || '').trim().slice(0, 40),
    sizes: arr(b.sizes).map((x) => String(x).trim()).filter(Boolean),
  }
}
export async function GET() { return isAdmin() ? Response.json(await getProducts()) : no() }
export async function POST(req) {
  if (!isAdmin()) return no()
  const c = clean(await req.json()); if (!c.name) return Response.json({ error: 'Name required' }, { status: 400 })
  const slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const list = await getProducts(); const p = { id: `${slug}-${Date.now().toString(36).slice(-4)}`, ...c }
  list.push(p); await saveProducts(list); return Response.json(p)
}
export async function PUT(req) {
  if (!isAdmin()) return no()
  const b = await req.json(); const list = await getProducts(); const i = list.findIndex((x) => x.id === b.id)
  if (i < 0) return Response.json({ error: 'Not found' }, { status: 404 })
  list[i] = { id: b.id, ...clean(b) }; await saveProducts(list); return Response.json(list[i])
}
export async function DELETE(req) {
  if (!isAdmin()) return no()
  const id = new URL(req.url).searchParams.get('id')
  await saveProducts((await getProducts()).filter((x) => x.id !== id)); return Response.json({ ok: true })
}
