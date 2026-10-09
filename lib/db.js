// Storage: Upstash Redis when configured (Vercel), otherwise local JSON files in /data.
import fs from 'fs/promises'
import path from 'path'
import { Redis } from '@upstash/redis'
import seedProducts from '../data/products.json'

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
const redis = url && token ? new Redis({ url, token }) : null
const file = (k) => path.join(process.cwd(), 'data', k + '.json')

async function rd(key) {
  if (redis) {
    let v = await redis.get(key)
    if (v == null) { v = key === 'products' ? seedProducts : []; await redis.set(key, v) }
    return v
  }
  try { return JSON.parse(await fs.readFile(file(key), 'utf8')) } catch { return [] }
}
const wr = (key, v) => (redis ? redis.set(key, v) : fs.writeFile(file(key), JSON.stringify(v, null, 2)))

export const getProducts = () => rd('products')
export const saveProducts = (v) => wr('products', v)
export const getOrders = () => rd('orders')
export const saveOrders = (v) => wr('orders', v)
