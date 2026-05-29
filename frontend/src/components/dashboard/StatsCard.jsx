export default function StatsCard({ label, value, sub, accent = false }) {
  return (
    <div style={{
      background: accent ? 'rgba(232,255,107,0.06)' : '#1a1a1a',
      border: `1px solid ${accent ? 'rgba(232,255,107,0.2)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: '16px', padding: '1.25rem 1.5rem',
    }}>
      <p style={{ fontSize: '0.8125rem', color: '#555', marginBottom: '6px' }}>{label}</p>
      <p style={{ fontSize: '1.875rem', fontWeight: 600, color: accent ? '#e8ff6b' : '#f5f5f3', letterSpacing: '-0.02em' }}>
        {value ?? '—'}
      </p>
      {sub && <p style={{ fontSize: '0.8rem', color: '#555', marginTop: '4px' }}>{sub}</p>}
    </div>
  )
}
