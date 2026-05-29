import { Menu } from 'lucide-react'

export default function Navbar({ onMenuClick, title }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <button onClick={onMenuClick} aria-label="Open menu" style={{ background: 'none', border: 'none', color: '#8a8a8a', cursor: 'pointer', display: 'flex' }}>
        <Menu size={20} />
      </button>
      <span style={{ fontSize: '1rem', fontWeight: 600 }}>{title}</span>
    </header>
  )
}
