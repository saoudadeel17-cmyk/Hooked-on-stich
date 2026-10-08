export async function POST() {
  const res = Response.json({ ok: true })
  res.headers.append('Set-Cookie', 'hs_admin=; Path=/; HttpOnly; Max-Age=0')
  return res
}
