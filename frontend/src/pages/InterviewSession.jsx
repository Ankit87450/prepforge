import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { questionService } from '../services/question'
import { feedbackService } from '../services/feedback'
import { interviewService } from '../services/interview'
import QuestionCard from '../components/interview/QuestionCard'
import AnswerBox from '../components/interview/AnswerBox'
import Timer from '../components/interview/Timer'
import ProgressBar from '../components/interview/ProgressBar'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import { getScoreColor, getScoreLabel } from '../utils/constants'

export default function InterviewSession() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [finishing, setFinishing] = useState(false)

  useEffect(() => {
    questionService.getForInterview(id)
      .then((res) => setQuestions(res.data.results || res.data))
      .catch(() => toast.error('Could not load questions.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (answer) => {
    setSubmitting(true)
    try {
      const res = await feedbackService.submit(questions[currentIdx].id, answer)
      setFeedback(res.data)
    } catch {
      toast.error('Failed to submit. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleNext = () => {
    setFeedback(null)
    setCurrentIdx((i) => i + 1)
  }

  const handleFinish = async () => {
    setFinishing(true)
    try {
      await interviewService.complete(id)
      navigate(`/interview/${id}/results`)
    } catch {
      toast.error('Failed to complete session.')
      setFinishing(false)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '5rem' }}><Spinner size={28} /></div>
  )

  const question = questions[currentIdx]
  const isLast = currentIdx === questions.length - 1
  const isAllDone = currentIdx >= questions.length

  return (
    <div style={{ maxWidth: '700px', animation: 'fadeUp 0.3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <ProgressBar current={Math.min(currentIdx + 1, questions.length)} total={questions.length} />
        <div style={{ marginLeft: '1.5rem', flexShrink: 0 }}>
          <Timer running={!feedback && !isAllDone} />
        </div>
      </div>

      {isAllDone ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>All questions answered</h2>
          <p style={{ color: '#555', marginBottom: '2rem' }}>Complete the session to see your full score and feedback.</p>
          <Button onClick={handleFinish} loading={finishing} size="lg">View results</Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <QuestionCard question={question} index={currentIdx} />

          {!feedback ? (
            <AnswerBox onSubmit={handleSubmit} loading={submitting} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeUp 0.3s ease' }}>
              {/* Score */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '14px', padding: '1.25rem 1.5rem',
              }}>
                <div>
                  <p style={{ fontSize: '0.8125rem', color: '#555', marginBottom: '4px' }}>Your score</p>
                  <p style={{ fontSize: '2rem', fontWeight: 700, color: getScoreColor(feedback.score), letterSpacing: '-0.03em' }}>
                    {feedback.score}<span style={{ fontSize: '1rem', color: '#555', fontWeight: 400 }}>/10</span>
                  </p>
                </div>
                <span style={{
                  padding: '4px 14px', borderRadius: '100px', fontSize: '0.8125rem', fontWeight: 500,
                  background: `${getScoreColor(feedback.score)}18`, color: getScoreColor(feedback.score),
                  border: `1px solid ${getScoreColor(feedback.score)}30`,
                }}>
                  {getScoreLabel(feedback.score)}
                </span>
              </div>

              {/* Strengths */}
              {feedback.strengths && (
                <div style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                  <p style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Strengths</p>
                  <p style={{ fontSize: '0.9rem', color: '#c6f1d6', lineHeight: 1.6 }}>{feedback.strengths}</p>
                </div>
              )}

              {/* Improvements */}
              {feedback.improvements && (
                <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                  <p style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Areas to improve</p>
                  <p style={{ fontSize: '0.9rem', color: '#fef3c7', lineHeight: 1.6 }}>{feedback.improvements}</p>
                </div>
              )}

              {/* Model answer */}
              {feedback.model_answer && (
                <details style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                  <summary style={{ fontSize: '0.875rem', color: '#8a8a8a', cursor: 'pointer', fontWeight: 500 }}>
                    View ideal answer
                  </summary>
                  <p style={{ fontSize: '0.9rem', color: '#8a8a8a', lineHeight: 1.65, marginTop: '0.75rem' }}>{feedback.model_answer}</p>
                </details>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {isLast ? (
                  <Button onClick={handleFinish} loading={finishing}>Finish & view results</Button>
                ) : (
                  <Button onClick={handleNext}>Next question →</Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
