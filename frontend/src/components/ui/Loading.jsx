import './Loading.css'

export function Loading({ size = 'md', fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        <div className={`loading-spinner loading-spinner-${size}`} />
      </div>
    )
  }

  return <div className={`loading-spinner loading-spinner-${size}`} />
}

export function LoadingOverlay({ children, loading }) {
  return (
    <div className="loading-overlay-container">
      {children}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner loading-spinner-lg" />
        </div>
      )}
    </div>
  )
}
