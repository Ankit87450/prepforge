import { useNavigate } from 'react-router-dom'
import Badge from '../ui/Badge'
import { getRoleBadgeColor, formatDate, getScoreColor } from '../../utils/helpers'

export default function RecentActivity({ interviews }) {
  const navigate = useNavigate()
  if (!interviews?.length) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0', color: '#555' }}>
        No interviews yet. Start one to see your history.
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {interviews.map((iv) => (
        <div
          key={iv.id}
          onClick={() => iv.status === 'completed' && navigate(`/interview/${iv.id}/results`)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.25rem', background: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px',
            cursor: iv.status === 'completed' ? 'pointer' : 'default',
            transition: '150ms',
          }}
          onMouseEnter={(e) => { if (iv.status === 'completed') e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Badge color={getRoleBadgeColor(iv.role)}>{iv.role}</Badge>
            <span style={{ fontSize: '0.875rem', color: '#8a8a8a' }}>{iv.difficulty}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {iv.overall_score != null && (
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.875rem', color: getScoreColor(iv.overall_score) }}>
                {iv.overall_score}/10
              </span>
            )}
            <span style={{ fontSize: '0.8125rem', color: '#555' }}>{formatDate(iv.created_at)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
