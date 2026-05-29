import Badge from '../ui/Badge'

const TOPIC_COLORS = {
  dsa: '#fb923c', react: '#60a5fa', django: '#4ade80',
  python: '#f59e0b', system_design: '#a78bfa', oops: '#f472b6',
  dbms: '#34d399', behavioral: '#e8ff6b', os: '#94a3b8',
  networking: '#38bdf8', javascript: '#facc15',
}

export default function QuestionCard({ question, index }) {
  const color = TOPIC_COLORS[question.topic] || '#8a8a8a'
  return (
    <div style={{
      background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px', padding: '1.75rem',
      animation: 'fadeUp 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.8125rem', color: '#555', fontFamily: 'DM Mono, monospace' }}>
          Q{index + 1}
        </span>
        <Badge color={color}>{question.topic.replace('_', ' ').toUpperCase()}</Badge>
      </div>
      <p style={{ fontSize: '1.0625rem', lineHeight: 1.65, color: '#f5f5f3', fontWeight: 400 }}>
        {question.text}
      </p>
    </div>
  )
}
