import './globals.css'
import { SITE } from '../lib/site'

export const metadata = {
  title: `${SITE.name} — Handmade Crochet`,
  description: 'Handmade crochet gajras, bags, keychains and gifts. Order online with Cash on Delivery or online payment.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
