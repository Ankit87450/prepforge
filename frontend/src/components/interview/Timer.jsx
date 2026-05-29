import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

export default function Timer({ running }) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      fontFamily: 'DM Mono, monospace', fontSize: '0.9rem',
      color: seconds > 180 ? '#fbbf24' : '#8a8a8a',
    }}>
      <Clock size={15} />
      {m}:{s}
    </div>
  )
}
