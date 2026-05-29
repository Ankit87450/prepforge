export const ROLES = [
  { value: 'swe', label: 'Software Engineer' },
  { value: 'frontend', label: 'Frontend Engineer' },
  { value: 'backend', label: 'Backend Engineer' },
  { value: 'fullstack', label: 'Full Stack Engineer' },
  { value: 'dsa', label: 'DSA Focus' },
]

export const DIFFICULTIES = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]

export const SCORE_COLORS = {
  great: '#4ade80',
  good: '#e8ff6b',
  average: '#fbbf24',
  poor: '#f87171',
}

export const getScoreColor = (score) => {
  if (score >= 8) return SCORE_COLORS.great
  if (score >= 6) return SCORE_COLORS.good
  if (score >= 4) return SCORE_COLORS.average
  return SCORE_COLORS.poor
}

export const getScoreLabel = (score) => {
  if (score >= 8) return 'Strong'
  if (score >= 6) return 'Good'
  if (score >= 4) return 'Average'
  return 'Needs work'
}
