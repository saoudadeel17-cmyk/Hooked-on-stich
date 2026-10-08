export const SITE = {
  name: 'Hooked on Stitch',
  tagline: 'Handmade crochet, made with love',
  phone: '+92 370 4842423',
  wa: '923704842423',
  instagram: 'hooked_on_stich',
  currency: 'Rs',
}
export const money = (n) => `${SITE.currency} ${Number(n).toLocaleString('en-US')}`
export const waLink = (t = '') => `https://wa.me/${SITE.wa}${t ? `?text=${encodeURIComponent(t)}` : ''}`
export const igLink = `https://instagram.com/${SITE.instagram}`
