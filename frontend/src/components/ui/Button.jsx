import './Button.css'

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  iconPosition = 'left',
  fullWidth = false,
  loading = false,
  disabled = false,
  ...props 
}) {
  const className = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full',
    loading && 'btn-loading',
  ].filter(Boolean).join(' ')

  return (
    <button className={className} disabled={disabled || loading} {...props}>
      {loading && <span className="btn-spinner" />}
      {!loading && icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{children}</span>
      {!loading && icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
    </button>
  )
}
