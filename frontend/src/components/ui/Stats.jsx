import './Stats.css'

export function StatsCard({ icon, label, value, trend, trendValue, variant = 'default' }) {
  return (
    <div className={`stats-card stats-card-${variant}`}>
      <div className="stats-card-header">
        <span className="stats-card-icon">{icon}</span>
        <span className="stats-card-label">{label}</span>
      </div>
      <div className="stats-card-value">{value}</div>
      {trend && (
        <div className={`stats-card-trend stats-card-trend-${trend}`}>
          <span className="stats-card-trend-icon">
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
          </span>
          <span className="stats-card-trend-value">{trendValue}</span>
        </div>
      )}
    </div>
  )
}

export function StatsGrid({ children }) {
  return <div className="stats-grid">{children}</div>
}
