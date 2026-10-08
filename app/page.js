import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../lib/db'
import { SITE, waLink, igLink } from '../lib/site'
export const dynamic = 'force-dynamic'

export default async function Home() {
  const products = await getProducts()
  return (
    <>
      <Header />
      <section className="hero">
        <div className="wrap hgrid">
          <div>
            <p className="eyebrow">Handmade crochet</p>
            <h1>Made slowly,<br /><em>stitch by stitch.</em></h1>
            <p className="lead">{SITE.tagline}. Gajras, bags, keychains and gifts — each piece is crocheted by hand and made to order.</p>
            <div className="cta"><a className="btn" href="#shop">Shop the collection</a><a className="btn ghost" href={waLink('Hi! I would like a custom crochet order.')} target="_blank" rel="noreferrer">Custom order</a></div>
          </div>
          <div className="arch"><img src={products[0]?.images[0] || '/products/p1.jpg'} alt="Handmade crochet" /></div>
        </div>
      </section>

      <section id="shop">
        <div className="wrap">
          <p className="eyebrow">The collection</p>
          <h2>Our handmade pieces</h2>
          <div className="grid">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="wrap agrid">
          <div className="arch sq"><img src="/products/p2.jpg" alt="Crochet flowers on a braid" /></div>
          <div>
            <p className="eyebrow">Our story</p>
            <h2>Crafted with patience</h2>
            <p>Hooked on Stitch began with one hook and a ball of yarn. Today every gajra, bag and keepsake is still crocheted by hand, one stitch at a time, using soft quality yarns.</p>
            <p>Because each piece is made to order, we can match your colours, your outfit or your gift idea. Just tell us what you have in mind.</p>
          </div>
        </div>
      </section>

      <section id="how">
        <div className="wrap">
          <p className="eyebrow">Simple &amp; secure</p>
          <h2>How to order</h2>
          <div className="steps">
            <div><span>1</span><h4>Choose</h4><p>Open any product to see full details, sizes and care.</p></div>
            <div><span>2</span><h4>Order</h4><p>Fill in your details and pick Cash on Delivery or online payment.</p></div>
            <div><span>3</span><h4>Confirmation</h4><p>You instantly receive an email confirmation, and we contact you to finalise delivery.</p></div>
          </div>
        </div>
      </section>

      <section className="about" id="contact">
        <div className="wrap">
          <p className="eyebrow">Say hello</p>
          <h2>Get in touch</h2>
          <p className="sub">Custom colours, bulk orders, gifting or a question? We reply fastest on WhatsApp.</p>
          <div className="cta">
            <a className="btn" href={waLink('Hi! I have a question.')} target="_blank" rel="noreferrer">WhatsApp {SITE.phone}</a>
            <a className="btn ghost" href={igLink} target="_blank" rel="noreferrer">Instagram @{SITE.instagram}</a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
