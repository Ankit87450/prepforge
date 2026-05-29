import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, children, title }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px', padding: '2rem', width: '100%',
          maxWidth: '480px', animation: 'fadeUp 0.2s ease',
        }}
      >
        {title && <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>{title}</h2>}
        {children}
      </div>
    </div>
  )
}
