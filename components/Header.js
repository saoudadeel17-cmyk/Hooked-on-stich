import Link from 'next/link'
import { SITE, waLink } from '../lib/site'
export default function Header() {
  return (
    <header>
      <div className="wrap">
        <Link className="logo" href="/">{SITE.name}</Link>
        <nav>
          <Link href="/#shop">Shop</Link><Link href="/#about">About</Link><Link href="/#how">How to order</Link><Link href="/#contact">Contact</Link>
          <a className="navwa" href={waLink('Hi! I would like to know more about your crochet products.')} target="_blank" rel="noreferrer">WhatsApp</a>
        </nav>
      </div>
    </header>
  )
}
