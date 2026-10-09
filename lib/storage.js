// Images: Vercel Blob when BLOB_READ_WRITE_TOKEN exists, otherwise public/uploads locally.
import fs from 'fs/promises'
import path from 'path'
import { put } from '@vercel/blob'

export async function saveImage(buffer, name, type) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const b = await put('uploads/' + name, buffer, { access: 'public', contentType: type })
    return b.url
  }
  const full = path.join(process.cwd(), 'public/uploads', name)
  await fs.mkdir(path.dirname(full), { recursive: true })
  await fs.writeFile(full, buffer)
  return '/uploads/' + name
}
