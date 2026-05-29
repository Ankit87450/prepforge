export default function Card({ children, style = {} }) {
  return (
    <div style={{
      background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px', padding: '1.5rem', ...style,
    }}>
      {children}
    </div>
  )
}
