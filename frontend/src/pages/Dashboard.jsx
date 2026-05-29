import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { interviewService } from '../services/interview'
import StatsCard from '../components/dashboard/StatsCard'
import RecentActivity from '../components/dashboard/RecentActivity'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

export default function Dashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [interviews, setInterviews] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([interviewService.list(), interviewService.stats()])
      .then(([listRes, statsRes]) => {
        setInterviews(listRes.data.results || listRes.data)
        setStats(statsRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '5rem' }}>
      <Spinner size={28} />
    </div>
  )

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ animation: 'fadeUp 0.3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '4px' }}>
            {greeting}, {user?.first_name || user?.full_name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: '#555', fontSize: '0.9375rem' }}>
            {stats?.total_interviews === 0
              ? 'Start your first mock interview to get feedback.'
              : `You've completed ${stats?.total_interviews} interview${stats?.total_interviews > 1 ? 's' : ''}.`}
          </p>
        </div>
        <Button onClick={() => navigate('/interview/new')} size="md">
          + New interview
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '2.5rem' }}>
        <StatsCard label="Total sessions" value={stats?.total_interviews ?? 0} accent />
        <StatsCard label="Avg. score" value={stats?.average_score ? `${stats.average_score}/10` : '—'} />
        <StatsCard label="Target role" value={user?.role?.toUpperCase()} />
      </div>

      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#8a8a8a', letterSpacing: '0.01em' }}>
          Recent interviews
        </h2>
        <RecentActivity interviews={interviews.slice(0, 8)} />
      </div>
    </div>
  )
}
