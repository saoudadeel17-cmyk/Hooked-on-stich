import { SITE, igLink, waLink } from '../lib/site'
export default function Footer() {
  return (
    <footer>
      <div className="wrap fgrid">
        <div><div className="logo">{SITE.name}</div><p>{SITE.tagline}.</p></div>
        <div><b>Contact</b><p><a href={waLink()} target="_blank" rel="noreferrer">WhatsApp {SITE.phone}</a><br /><a href={igLink} target="_blank" rel="noreferrer">Instagram @{SITE.instagram}</a></p></div>
        <div><b>Payment</b><p>Cash on Delivery<br />Online payment (JazzCash / Easypaisa / Bank)</p></div>
      </div>
      <div className="copy">© {new Date().getFullYear()} {SITE.name}. Handmade with love.</div>
    </footer>
  )
}
