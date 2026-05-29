export default function Badge({ children, color = '#e8ff6b' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '2px 10px', borderRadius: '100px',
      fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.02em',
      background: `${color}18`, color, border: `1px solid ${color}30`,
    }}>
      {children}
    </span>
  )
}
