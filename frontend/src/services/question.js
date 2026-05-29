import api from './api'

export const questionService = {
  getForInterview: (interviewId) => api.get(`/questions/${interviewId}/`),
}
