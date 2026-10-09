import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Gallery from '../../../components/Gallery'
import OrderForm from '../../../components/OrderForm'
import ProductCard from '../../../components/ProductCard'
import { getProducts } from '../../../lib/db'
import { money, waLink } from '../../../lib/site'
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { id } = await params
  const p = (await getProducts()).find((x) => x.id === id)
  return { title: p ? `${p.name} — Hooked on Stitch` : 'Not found', description: p?.short }
}

export default async function ProductPage({ params }) {
  const { id } = await params
  const all = await getProducts()
  const p = all.find((x) => x.id === id)
  if (!p) notFound()
  const more = all.filter((x) => x.id !== p.id).slice(0, 4)
  return (
    <>
      <Header />
      <main className="wrap pd">
        <div className="crumb"><Link href="/">Home</Link> / <Link href="/#shop">Shop</Link> / {p.name}</div>
        <div className="pgrid">
          <Gallery images={p.images.length ? p.images : ['/products/p1.jpg']} name={p.name} />
          <div className="pinfo">
            <p className="eyebrow">{p.category}</p>
            <h1>{p.name}</h1>
            <div className="price">{money(p.price)}</div>
            <p className="short">{p.short}</p>
            {p.description.split('\n').filter(Boolean).map((t, i) => <p key={i} className="desc">{t}</p>)}
            {p.features?.length > 0 && <ul className="feat">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>}
            {p.details?.length > 0 && <table className="spec"><tbody>{p.details.map((d) => <tr key={d.label}><th>{d.label}</th><td>{d.value}</td></tr>)}</tbody></table>}
            <a className="wa" href={waLink(`Hi! I have a question about "${p.name}".`)} target="_blank" rel="noreferrer">Questions? Chat on WhatsApp →</a>
          </div>
        </div>
        <div className="orderbox"><OrderForm product={p} /></div>
        {more.length > 0 && (<><h2 style={{ marginTop: 64 }}>You may also like</h2><div className="grid">{more.map((x) => <ProductCard key={x.id} p={x} />)}</div></>)}
      </main>
      <Footer />
    </>
  )
}
