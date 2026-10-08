import { isAdmin } from '../../lib/auth'
import Admin, { Login } from '../../components/Admin'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Admin — Hooked on Stitch', robots: { index: false } }
export default function AdminPage() { return isAdmin() ? <Admin /> : <Login /> }
