import { checkPassword, makeToken } from '../../../../lib/auth'
export async function POST(req) {
  const { password } = await req.json().catch(() => ({}))
  if (!checkPassword(password)) return Response.json({ error: 'Wrong password' }, { status: 401 })
  const res = Response.json({ ok: true })
  res.headers.append('Set-Cookie', `hs_admin=${makeToken()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`)
  return res
}
