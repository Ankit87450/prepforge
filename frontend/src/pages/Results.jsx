import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { interviewService } from '../services/interview'
import { feedbackService } from '../services/feedback'
import { questionService } from '../services/question'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import Badge from '../components/ui/Badge'
import { getScoreColor, getScoreLabel } from '../utils/constants'
import { formatDuration } from '../utils/helpers'

export default function Results() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [interview, setInterview] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      interviewService.get(id),
      questionService.getForInterview(id),
      feedbackService.getForInterview(id),
    ]).then(([ivRes, qRes, fbRes]) => {
      setInterview(ivRes.data)
      const fbMap = {}
      ;(fbRes.data.results || fbRes.data).forEach((f) => { fbMap[f.question] = f })
      setItems(qRes.data.map((q) => ({ question: q, feedback: fbMap[q.id] })))
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '5rem' }}><Spinner size={28} /></div>

  const score = interview?.overall_score

  return (
    <div style={{ maxWidth: '760px', animation: 'fadeUp 0.3s ease' }}>
      <button onClick={() => navigate('/dashboard')} style={{ color: '#555', fontSize: '0.875rem', marginBottom: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
        ← Back to dashboard
      </button>

      {/* Hero score */}
      <div style={{
        background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '20px', padding: '2.5rem', marginBottom: '2rem', textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.875rem', color: '#555', marginBottom: '0.5rem' }}>Overall score</p>
        <p style={{ fontSize: '3.5rem', fontWeight: 700, color: getScoreColor(score), letterSpacing: '-0.04em', lineHeight: 1 }}>
          {score ?? '—'}<span style={{ fontSize: '1.5rem', color: '#555', fontWeight: 400 }}>/10</span>
        </p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Badge color={getScoreColor(score)}>{getScoreLabel(score)}</Badge>
          <Badge color="#8a8a8a">{interview?.role}</Badge>
          <Badge color="#8a8a8a">{interview?.difficulty}</Badge>
          <Badge color="#8a8a8a">{formatDuration(interview?.duration_seconds)}</Badge>
        </div>
      </div>

      {/* Per-question breakdown */}
      <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#8a8a8a', marginBottom: '1rem' }}>Question breakdown</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map(({ question, feedback }, idx) => (
          <div key={question.id} style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.55, flex: 1 }}>
                <span style={{ color: '#555', fontFamily: 'DM Mono, monospace', marginRight: '8px' }}>Q{idx + 1}</span>
                {question.text}
              </p>
              {feedback && (
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.95rem', color: getScoreColor(feedback.score), flexShrink: 0 }}>
                  {feedback.score}/10
                </span>
              )}
            </div>
            {feedback?.improvements && (
              <p style={{ fontSize: '0.85rem', color: '#8a8a8a', lineHeight: 1.55, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                <span style={{ color: '#fbbf24' }}>Improve: </span>{feedback.improvements}
              </p>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '2rem' }}>
        <Button onClick={() => navigate('/interview/new')}>Practice again</Button>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>Done</Button>
      </div>
    </div>
  )
}
