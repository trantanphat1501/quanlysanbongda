import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

export function Sidebar({ items, logo }) {
  const location = useLocation()

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {logo && <div className="sidebar-logo">{logo}</div>}
        
        <nav className="sidebar-nav">
          {items.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                {item.icon && <span className="sidebar-link-icon">{item.icon}</span>}
                <span className="sidebar-link-text">{item.label}</span>
                {item.badge && (
                  <span className="sidebar-link-badge">{item.badge}</span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
