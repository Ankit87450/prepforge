export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.8125rem', color: '#8a8a8a' }}>Question {current} of {total}</span>
        <span style={{ fontSize: '0.8125rem', color: '#8a8a8a' }}>{pct}%</span>
      </div>
      <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '100px' }}>
        <div style={{
          height: '100%', width: `${pct}%`, background: '#e8ff6b',
          borderRadius: '100px', transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  )
}
