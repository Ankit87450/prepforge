import { useState } from 'react'
import { feedbackService } from '../services/feedback'

export const useFeedback = () => {
  const [loading, setLoading] = useState(false)
  const submit = async (questionId, answer) => {
    setLoading(true)
    try { return (await feedbackService.submit(questionId, answer)).data }
    finally { setLoading(false) }
  }
  return { submit, loading }
}
