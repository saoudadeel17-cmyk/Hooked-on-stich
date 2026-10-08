import nodemailer from 'nodemailer'
import path from 'path'
import { SITE, money } from './site'

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

export async function sendMail({ to, subject, html, attachments }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) { console.warn('[mail] SMTP not configured — email skipped'); return false }
  const port = Number(process.env.SMTP_PORT || 465)
  const t = nodemailer.createTransport({ host: process.env.SMTP_HOST || 'smtp.gmail.com', port, secure: port === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } })
  await t.sendMail({ from: `"${SITE.name}" <${process.env.SMTP_USER}>`, to, subject, html, attachments })
  return true
}

const wrap = (inner) => `<div style="background:#f6efe6;padding:28px 12px;font-family:Georgia,serif;color:#3b2f2a"><div style="max-width:560px;margin:auto;background:#fbf7f1;border:1px solid #d9ccb8;padding:32px">
<div style="text-align:center;font-size:28px;font-style:italic;margin-bottom:6px">${SITE.name}</div><div style="text-align:center;font-size:12px;letter-spacing:3px;color:#8a3b4a;margin-bottom:24px">HANDMADE CROCHET</div>${inner}
<hr style="border:0;border-top:1px solid #d9ccb8;margin:24px 0"><div style="font-size:13px;color:#7a6a5f;text-align:center">WhatsApp / Call: ${SITE.phone}<br>Instagram: @${SITE.instagram}</div></div></div>`

const rows = (o) => `<table style="width:100%;border-collapse:collapse;font-size:15px">
<tr><td style="padding:6px 0">${esc(o.productName)} × ${o.qty}</td><td style="text-align:right">${money(o.total)}</td></tr>
${o.size ? `<tr><td style="padding:6px 0;color:#7a6a5f">Size</td><td style="text-align:right">${esc(o.size)}</td></tr>` : ''}<tr><td style="padding:6px 0;color:#7a6a5f">Payment</td><td style="text-align:right">${esc(o.payment)}</td></tr>
<tr><td style="padding:6px 0;color:#7a6a5f">Deliver to</td><td style="text-align:right">${esc(o.address)}, ${esc(o.city)}</td></tr></table>${o.custom ? `<p style="background:#f1e6d6;padding:12px;font-size:14px"><b>Custom request:</b><br>${esc(o.custom).replace(/\n/g, '<br>')}</p>` : ''}`

export async function sendOrderEmails(o) {
  const pay = o.payment === 'Online Payment' && process.env.PAYMENT_INSTRUCTIONS ? `<p style="background:#f1e6d6;padding:12px;font-size:14px"><b>How to pay:</b><br>${esc(process.env.PAYMENT_INSTRUCTIONS)}</p>` : ''
  const cust = wrap(`<p>Dear ${esc(o.name)},</p><p>Thank you for your order! We have received it and our team will contact you shortly to confirm the details.</p>
<p style="font-size:13px;letter-spacing:2px;color:#8a3b4a">ORDER ${o.id}</p>${rows(o)}${pay}
<p style="font-size:14px;color:#7a6a5f">Delivery charges (if any) will be confirmed when we contact you. Each piece is handmade, so please allow a few working days.</p>`)
  const owner = wrap(`<p><b>New order ${o.id}</b></p>${rows(o)}<p style="font-size:14px">Customer: ${esc(o.name)}<br>Phone: ${esc(o.phone)}<br>Email: ${esc(o.email)}<br>Notes: ${esc(o.notes || '-')}${o.refImage ? '<br>Reference photo attached.' : ''}</p>`)
  const r = { customer: false, owner: false }
  try { r.customer = await sendMail({ to: o.email, subject: `Order confirmation ${o.id} — ${SITE.name}`, html: cust }) } catch (e) { console.error('[mail] customer', e.message) }
  try { const to = process.env.OWNER_EMAIL || process.env.SMTP_USER; if (to) r.owner = await sendMail({ to, subject: `New order ${o.id} — ${o.productName}`, html: owner, attachments: o.refImage ? [{ filename: path.basename(o.refImage), path: path.join(process.cwd(), 'public', o.refImage) }] : undefined }) } catch (e) { console.error('[mail] owner', e.message) }
  return r
}
