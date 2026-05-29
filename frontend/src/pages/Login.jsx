import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '../services/auth'
import { useAuthStore } from '../store/authStore'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authService.login(form)
      setAuth(res.data.user, res.data.tokens.access, res.data.tokens.refresh)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail?.non_field_errors?.[0] || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '400px', animation: 'fadeUp 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2.5rem' }}>
          <div style={{ width: 32, height: 32, background: '#e8ff6b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={17} color="#0d0d0d" fill="#0d0d0d" />
          </div>
          <span style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.02em' }}>PrepForge</span>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '0.375rem' }}>Welcome back</h1>
        <p style={{ color: '#555', fontSize: '0.9375rem', marginBottom: '2rem' }}>Sign in to continue your prep.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <Button type="submit" loading={loading} fullWidth size="lg" style={{ marginTop: '8px' }}>
            Sign in
          </Button>
        </form>

        <p style={{ textAlign: 'center', color: '#555', fontSize: '0.875rem', marginTop: '1.5rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#e8ff6b' }}>Create one</Link>
        </p>
      </div>
    </div>
  )
}
