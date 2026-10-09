import crypto from 'crypto'
import { cookies } from 'next/headers'
const sign = (v) => crypto.createHmac('sha256', process.env.ADMIN_SECRET || 'dev-secret').update(v).digest('hex')
export const makeToken = () => { const e = String(Date.now() + 7 * 864e5); return e + '.' + sign(e) }
export async function isAdmin() {
  const t = (await cookies()).get('hs_admin')?.value
  if (!t) return false
  const [e, s] = t.split('.')
  return !!s && s === sign(e) && Date.now() < Number(e)
}
export function checkPassword(p) {
  const w = (process.env.ADMIN_PASSWORD || '').trim()
  if (!w || typeof p !== 'string') return false
  const a = Buffer.from(p.trim()), b = Buffer.from(w)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}
