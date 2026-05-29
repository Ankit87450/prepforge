import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'

export default function SkillRadar({ data }) {
  if (!data?.length) return null
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis dataKey="topic" tick={{ fill: '#8a8a8a', fontSize: 12 }} />
        <Radar dataKey="score" stroke="#e8ff6b" fill="#e8ff6b" fillOpacity={0.2} />
      </RadarChart>
    </ResponsiveContainer>
  )
}
