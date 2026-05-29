import api from './api'

export const interviewService = {
  create: (data) => api.post('/interviews/', data),
  list: () => api.get('/interviews/'),
  get: (id) => api.get(`/interviews/${id}/`),
  start: (id) => api.post(`/interviews/${id}/start/`),
  complete: (id) => api.post(`/interviews/${id}/complete/`),
  stats: () => api.get('/interviews/stats/'),
}
