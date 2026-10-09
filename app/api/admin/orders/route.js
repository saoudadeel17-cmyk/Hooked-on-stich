import { isAdmin } from '../../../../lib/auth'
import { getOrders, saveOrders } from '../../../../lib/db'
export async function GET() { return (await isAdmin()) ? Response.json(await getOrders()) : Response.json({ error: 'Unauthorized' }, { status: 401 }) }
export async function PATCH(req) {
  if (!(await isAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, status } = await req.json()
  if (!['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) return Response.json({ error: 'Bad status' }, { status: 400 })
  const list = await getOrders(); const o = list.find((x) => x.id === id); if (o) o.status = status
  await saveOrders(list); return Response.json({ ok: true })
}
