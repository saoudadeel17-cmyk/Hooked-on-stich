# Hooked on Stitch — Next.js shop

## Run
1. `npm install`
2. Open `.env.local` and set: ADMIN_PASSWORD, and SMTP_USER / SMTP_PASS (Gmail App Password) for order emails
3. `npm run dev` -> http://localhost:3000
   Admin panel: http://localhost:3000/admin

## Edit
- Products & prices: from the Admin panel (or `data/products.json`)
- Orders are saved in `data/orders.json` and shown in Admin > Orders
- Contact details: `lib/site.js`

## Production
`npm run build` then `npm start` on a server with a writable disk (VPS, Render with disk, etc.).
On Vercel/serverless the disk is read-only: replace the functions in `lib/db.js` with a database (e.g. Supabase) and use cloud image storage.
