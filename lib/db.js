// Simple JSON-file storage. Works locally and on any server with a writable disk.
// (For Vercel/serverless, swap these 4 functions for a database such as Supabase.)
import fs from 'fs/promises'
import path from 'path'
const dir = path.join(process.cwd(), 'data')
async function rd(f) { try { return JSON.parse(await fs.readFile(path.join(dir, f), 'utf8')) } catch { return [] } }
const wr = (f, v) => fs.writeFile(path.join(dir, f), JSON.stringify(v, null, 2))
export const getProducts = () => rd('products.json')
export const saveProducts = (v) => wr('products.json', v)
export const getOrders = () => rd('orders.json')
export const saveOrders = (v) => wr('orders.json', v)
