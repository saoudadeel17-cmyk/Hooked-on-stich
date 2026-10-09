import { isAdmin } from '../../lib/auth'
import Admin, { Login } from '../../components/Admin'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Admin — Hooked on Stitch', robots: { index: false } }
export default async function AdminPage() { return (await isAdmin()) ? <Admin /> : <Login /> }
