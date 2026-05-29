const styles = {
  base: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: '0.5rem', fontFamily: 'inherit', fontWeight: 500, borderRadius: '10px',
    transition: '150ms cubic-bezier(0.4,0,0.2,1)', cursor: 'pointer',
    border: 'none', outline: 'none', whiteSpace: 'nowrap',
  },
  variant: {
    primary: { background: '#e8ff6b', color: '#0d0d0d' },
    secondary: { background: 'rgba(255,255,255,0.06)', color: '#f5f5f3', border: '1px solid rgba(255,255,255,0.08)' },
    ghost: { background: 'transparent', color: '#8a8a8a' },
    danger: { background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' },
  },
  size: {
    sm: { fontSize: '0.8125rem', padding: '0.375rem 0.75rem', height: '32px' },
    md: { fontSize: '0.9375rem', padding: '0.5rem 1.125rem', height: '40px' },
    lg: { fontSize: '1rem', padding: '0.75rem 1.5rem', height: '48px' },
  },
}

export default function Button({
  children, variant = 'primary', size = 'md',
  disabled = false, loading = false, fullWidth = false,
  onClick, type = 'button', style: extraStyle = {},
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...styles.base,
        ...styles.variant[variant],
        ...styles.size[size],
        width: fullWidth ? '100%' : undefined,
        opacity: disabled || loading ? 0.5 : 1,
        ...extraStyle,
      }}
    >
      {loading && (
        <span style={{
          width: 14, height: 14, border: '2px solid currentColor',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
      )}
      {children}
    </button>
  )
}
