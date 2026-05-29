import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Plus, User, LogOut, Zap } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/auth'
import { getInitials } from '../../utils/helpers'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/interview/new', icon: Plus, label: 'New Interview' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function Sidebar() {
  const { user, logout, refreshToken } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await authService.logout(refreshToken) } catch {}
    logout()
    navigate('/login')
  }

  return (
    <aside style={{
      width: '220px', minHeight: '100vh', background: '#0d0d0d',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem',
      position: 'fixed', top: 0, left: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 0.5rem', marginBottom: '2.5rem' }}>
        <div style={{
          width: 28, height: 28, background: '#e8ff6b', borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Zap size={15} color="#0d0d0d" fill="#0d0d0d" />
        </div>
        <span style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.02em' }}>PrepForge</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '0.5rem 0.75rem', borderRadius: '10px',
              fontSize: '0.9rem', fontWeight: 500,
              color: isActive ? '#e8ff6b' : '#8a8a8a',
              background: isActive ? 'rgba(232,255,107,0.08)' : 'transparent',
              transition: '150ms',
            })}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.5rem 0.75rem', marginBottom: '4px' }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'rgba(232,255,107,0.15)', color: '#e8ff6b',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 600,
          }}>
            {getInitials(user?.full_name)}
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#f5f5f3' }}>
              {user?.full_name?.split(' ')[0]}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#555' }}>{user?.role}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            width: '100%', padding: '0.5rem 0.75rem', borderRadius: '10px',
            fontSize: '0.875rem', color: '#555', background: 'transparent',
            border: 'none', cursor: 'pointer', transition: '150ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#555'; e.currentTarget.style.background = 'transparent' }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
