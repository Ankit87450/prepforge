export const formatDuration = (seconds) => {
  if (!seconds) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

export const getInitials = (name) => {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export const getRoleBadgeColor = (role) => {
  const map = {
    frontend: '#60a5fa',
    backend: '#a78bfa',
    fullstack: '#34d399',
    swe: '#e8ff6b',
    dsa: '#fb923c',
  }
  return map[role] || '#8a8a8a'
}
export { getScoreColor, getScoreLabel } from './constants'
