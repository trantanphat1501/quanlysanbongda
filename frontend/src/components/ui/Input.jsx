import './Input.css'

export function Input({ 
  label, 
  error, 
  helperText,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  ...props 
}) {
  return (
    <div className={`input-wrapper ${fullWidth ? 'input-full' : ''} ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
        {icon && iconPosition === 'left' && (
          <span className="input-icon input-icon-left">{icon}</span>
        )}
        <input 
          className={`input ${error ? 'input-error' : ''} ${icon ? `input-with-icon-${iconPosition}` : ''}`}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <span className="input-icon input-icon-right">{icon}</span>
        )}
      </div>
      {error && <span className="input-error-text">{error}</span>}
      {helperText && !error && <span className="input-helper-text">{helperText}</span>}
    </div>
  )
}

export function Select({ 
  label, 
  error, 
  helperText,
  fullWidth = false,
  children,
  className = '',
  ...props 
}) {
  return (
    <div className={`input-wrapper ${fullWidth ? 'input-full' : ''} ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <select 
        className={`input input-select ${error ? 'input-error' : ''}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="input-error-text">{error}</span>}
      {helperText && !error && <span className="input-helper-text">{helperText}</span>}
    </div>
  )
}

export function Textarea({ 
  label, 
  error, 
  helperText,
  fullWidth = false,
  className = '',
  ...props 
}) {
  return (
    <div className={`input-wrapper ${fullWidth ? 'input-full' : ''} ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <textarea 
        className={`input input-textarea ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <span className="input-error-text">{error}</span>}
      {helperText && !error && <span className="input-helper-text">{helperText}</span>}
    </div>
  )
}
