import Link from 'next/link'
import { money } from '../lib/site'
export default function ProductCard({ p }) {
  return (
    <Link href={`/product/${p.id}`} className="card">
      <div className="im"><img src={p.images[0]} alt={p.name} loading="lazy" />{!p.inStock && <span className="tag">Sold out</span>}</div>
      <div className="cat">{p.category}</div>
      <div className="nm">{p.name}</div>
      <div className="pr">{money(p.price)}</div>
    </Link>
  )
}
