import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { authService } from '../services/auth'
import { useAuthStore } from '../store/authStore'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { ROLES } from '../utils/constants'
import { getInitials } from '../utils/helpers'

export default function Profile() {
  const { user, setUser } = useAuthStore()
  const [form, setForm] = useState({ full_name: '', role: 'swe', experience_years: 0 })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) setForm({ full_name: user.full_name, role: user.role, experience_years: user.experience_years })
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await authService.updateProfile(form)
      setUser(res.data)
      toast.success('Profile updated')
    } catch {
      toast.error('Update failed')
    } finally {
      setSaving(false)
    }
  }

  const selectStyle = {
    background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', padding: '0.625rem 0.875rem', color: '#f5f5f3',
    fontSize: '0.9375rem', outline: 'none', width: '100%',
  }

  return (
    <div style={{ maxWidth: '520px', animation: 'fadeUp 0.3s ease' }}>
      <h1 style={{ fontSize: '1.625rem', fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '2rem' }}>Profile</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '2.5rem' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(232,255,107,0.15)', color: '#e8ff6b',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.25rem', fontWeight: 600,
        }}>
          {getInitials(user?.full_name)}
        </div>
        <div>
          <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>{user?.full_name}</p>
          <p style={{ color: '#555', fontSize: '0.9rem' }}>{user?.email}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input label="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        <div>
          <label style={{ fontSize: '0.875rem', color: '#8a8a8a', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Target role</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={selectStyle}>
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <Input label="Years of experience" type="number" min={0} max={20} value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: e.target.value })} />
        <Button onClick={handleSave} loading={saving} style={{ marginTop: '8px', alignSelf: 'flex-start' }}>
          Save changes
        </Button>
      </div>
    </div>
  )
}
