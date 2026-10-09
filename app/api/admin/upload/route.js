import { isAdmin } from '../../../../lib/auth'
import { saveImage } from '../../../../lib/storage'
export async function POST(req) {
  if (!(await isAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const file = (await req.formData()).get('file')
  if (!file || !file.type?.startsWith('image/') || file.size > 4e6) return Response.json({ error: 'Upload an image under 4 MB' }, { status: 400 })
  const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[file.type]
  if (!ext) return Response.json({ error: 'Use JPG, PNG or WEBP' }, { status: 400 })
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`
  return Response.json({ url: await saveImage(Buffer.from(await file.arrayBuffer()), name, file.type) })
}
