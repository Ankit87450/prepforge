import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: '220px', flex: 1, padding: '2.5rem', minHeight: '100vh' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
