import { formatDate, getScoreColor } from '../../utils/helpers'

export default function SessionHistory({ interviews }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {interviews?.map((iv) => (
        <div key={iv.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px' }}>
          <span style={{ fontSize: '0.875rem' }}>{iv.role} · {iv.difficulty}</span>
          <span style={{ fontSize: '0.875rem', color: getScoreColor(iv.overall_score) }}>{iv.overall_score ?? '—'}/10</span>
        </div>
      ))}
    </div>
  )
}
