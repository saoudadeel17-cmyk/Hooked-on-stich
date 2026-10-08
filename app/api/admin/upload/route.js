import fs from 'fs/promises'
import path from 'path'
import { isAdmin } from '../../../../lib/auth'
export async function POST(req) {
  if (!isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const file = (await req.formData()).get('file')
  if (!file || !file.type?.startsWith('image/') || file.size > 8e6) return Response.json({ error: 'Upload an image under 8 MB' }, { status: 400 })
  const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[file.type]
  if (!ext) return Response.json({ error: 'Use JPG, PNG or WEBP' }, { status: 400 })
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`
  await fs.mkdir(path.join(process.cwd(), 'public/uploads'), { recursive: true })
  await fs.writeFile(path.join(process.cwd(), 'public/uploads', name), Buffer.from(await file.arrayBuffer()))
  return Response.json({ url: `/uploads/${name}` })
}
