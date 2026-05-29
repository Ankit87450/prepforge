export default function Input({ label, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '0.875rem', color: '#8a8a8a', fontWeight: 500 }}>
          {label}
        </label>
      )}
      <input {...props} style={{
        background: '#1a1a1a', border: `1px solid ${error ? '#f87171' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '10px', padding: '0.625rem 0.875rem', color: '#f5f5f3',
        fontSize: '0.9375rem', outline: 'none', width: '100%',
        transition: 'border-color 150ms',
      }} />
      {error && <span style={{ fontSize: '0.8125rem', color: '#f87171' }}>{error}</span>}
    </div>
  )
}
