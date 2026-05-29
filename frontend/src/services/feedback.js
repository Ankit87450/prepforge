import api from './api'

export const feedbackService = {
  submit: (questionId, answer) => api.post('/feedback/submit/', { question_id: questionId, answer }),
  getForInterview: (interviewId) => api.get(`/feedback/${interviewId}/`),
}
