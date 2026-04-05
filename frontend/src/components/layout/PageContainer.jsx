import './PageContainer.css'

export function PageContainer({ children, maxWidth = 'lg' }) {
  return (
    <div className={`page-container page-container-${maxWidth}`}>
      {children}
    </div>
  )
}

export function PageHeader({ title, description, actions }) {
  return (
    <div className="page-header">
      <div className="page-header-content">
        {title && <h2 className="page-header-title">{title}</h2>}
        {description && <p className="page-header-description">{description}</p>}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  )
}
