import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '../services/auth'
import { useAuthStore } from '../store/authStore'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { ROLES } from '../utils/constants'

export default function Register() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [form, setForm] = useState({ email: '', full_name: '', role: 'swe', experience_years: 0, password: '', confirm_password: '' })
  const [loading, setLoading] = useState(false)

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      const res = await authService.register(form)
      setAuth(res.data.user, res.data.tokens.access, res.data.tokens.refresh)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      const errors = err.response?.data?.detail
      toast.error(typeof errors === 'string' ? errors : 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectStyle = {
    background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', padding: '0.625rem 0.875rem', color: '#f5f5f3',
    fontSize: '0.9375rem', outline: 'none', width: '100%',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '440px', animation: 'fadeUp 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2.5rem' }}>
          <div style={{ width: 32, height: 32, background: '#e8ff6b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={17} color="#0d0d0d" fill="#0d0d0d" />
          </div>
          <span style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.02em' }}>PrepForge</span>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '0.375rem' }}>Create account</h1>
        <p style={{ color: '#555', fontSize: '0.9375rem', marginBottom: '2rem' }}>Start your interview prep journey.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input label="Full name" placeholder="Ankit Modi" value={form.full_name} onChange={update('full_name')} required />
          <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.875rem', color: '#8a8a8a', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Target role</label>
              <select value={form.role} onChange={update('role')} style={selectStyle}>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <Input label="Years of experience" type="number" min={0} max={20} value={form.experience_years} onChange={update('experience_years')} />
          </div>
          <Input label="Password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={update('password')} required />
          <Input label="Confirm password" type="password" placeholder="••••••••" value={form.confirm_password} onChange={update('confirm_password')} required />
          <Button type="submit" loading={loading} fullWidth size="lg" style={{ marginTop: '8px' }}>
            Create account
          </Button>
        </form>

        <p style={{ textAlign: 'center', color: '#555', fontSize: '0.875rem', marginTop: '1.5rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#e8ff6b' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
