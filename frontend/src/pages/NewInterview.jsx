import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { interviewService } from '../services/interview'
import Button from '../components/ui/Button'
import { ROLES, DIFFICULTIES } from '../utils/constants'

export default function NewInterview() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ role: 'swe', difficulty: 'medium', total_questions: 5 })
  const [loading, setLoading] = useState(false)

  const selectStyle = {
    background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px', padding: '0.75rem 1rem', color: '#f5f5f3',
    fontSize: '0.9375rem', outline: 'none', width: '100%', cursor: 'pointer',
  }

  const handleStart = async () => {
    setLoading(true)
    try {
      const res = await interviewService.create(form)
      const id = res.data.id
      await interviewService.start(id)
      navigate(`/interview/${id}`)
    } catch {
      toast.error('Failed to start interview. Try again.')
      setLoading(false)
    }
  }

  const Option = ({ value, label, selected, onClick }) => (
    <button
      onClick={onClick}
      style={{
        padding: '0.625rem 1.25rem', borderRadius: '100px', border: `1px solid`,
        borderColor: selected ? '#e8ff6b' : 'rgba(255,255,255,0.08)',
        background: selected ? 'rgba(232,255,107,0.1)' : 'transparent',
        color: selected ? '#e8ff6b' : '#8a8a8a',
        fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
        transition: '150ms',
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{ maxWidth: '600px', animation: 'fadeUp 0.3s ease' }}>
      <h1 style={{ fontSize: '1.625rem', fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
        Configure your interview
      </h1>
      <p style={{ color: '#555', marginBottom: '2.5rem' }}>
        Pick a role and difficulty — we'll generate tailored questions and give you AI feedback on every answer.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <p style={{ fontSize: '0.875rem', color: '#8a8a8a', fontWeight: 500, marginBottom: '12px' }}>Target role</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {ROLES.map(r => (
              <Option key={r.value} value={r.value} label={r.label}
                selected={form.role === r.value}
                onClick={() => setForm({ ...form, role: r.value })} />
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontSize: '0.875rem', color: '#8a8a8a', fontWeight: 500, marginBottom: '12px' }}>Difficulty</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {DIFFICULTIES.map(d => (
              <Option key={d.value} value={d.value} label={d.label}
                selected={form.difficulty === d.value}
                onClick={() => setForm({ ...form, difficulty: d.value })} />
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontSize: '0.875rem', color: '#8a8a8a', fontWeight: 500, marginBottom: '12px' }}>
            Number of questions
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[3, 5, 7, 10].map(n => (
              <Option key={n} value={n} label={`${n} questions`}
                selected={form.total_questions === n}
                onClick={() => setForm({ ...form, total_questions: n })} />
            ))}
          </div>
        </div>

        <div style={{
          background: '#141414', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '14px', padding: '1.25rem 1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <p style={{ fontWeight: 500, fontSize: '0.9375rem', marginBottom: '2px' }}>Ready to start?</p>
            <p style={{ fontSize: '0.8125rem', color: '#555' }}>
              {form.total_questions} questions · {form.difficulty} · {ROLES.find(r => r.value === form.role)?.label}
            </p>
          </div>
          <Button onClick={handleStart} loading={loading} size="lg">
            Start session
          </Button>
        </div>
      </div>
    </div>
  )
}
