import { useState } from 'react'
import Button from '../ui/Button'

export default function AnswerBox({ onSubmit, loading }) {
  const [answer, setAnswer] = useState('')
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ position: 'relative' }}>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your answer here. Be as detailed as you can — explain your reasoning, mention trade-offs, use examples."
          rows={7}
          style={{
            width: '100%', resize: 'vertical', background: '#141414',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
            padding: '1rem', color: '#f5f5f3', fontSize: '0.9375rem',
            lineHeight: 1.65, outline: 'none',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'rgba(232,255,107,0.4)' }}
          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)' }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.8125rem', color: '#555', fontFamily: 'DM Mono, monospace' }}>
          {wordCount} words
        </span>
        <Button
          onClick={() => { if (answer.trim().length >= 10) { onSubmit(answer); setAnswer('') } }}
          disabled={answer.trim().length < 10}
          loading={loading}
          size="md"
        >
          Submit answer
        </Button>
      </div>
    </div>
  )
}
