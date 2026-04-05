import './Header.css'

export function Header({ title, children, actions }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          {title && <h1 className="header-title">{title}</h1>}
          {children}
        </div>
        {actions && <div className="header-actions">{actions}</div>}
      </div>
    </header>
  )
}
