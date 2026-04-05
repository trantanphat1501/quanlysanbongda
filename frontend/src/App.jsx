import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'
import LoginRegisterPage from './pages/LoginRegisterPage'
import UsersPage from './pages/UsersPage'
import SanGiaPage from './pages/SanGiaPage'
import BookingPage from './pages/BookingPage'
import MyBookingsPage from './pages/MyBookingsPage'
import BookingManagementPage from './pages/BookingManagementPage'
import TournamentsPage from './pages/TournamentsPage'
import TournamentDetailPage from './pages/TournamentDetailPage'
import TeamsPage from './pages/TeamsPage'
import { useAuth } from './AuthContext.jsx'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { Badge, Button } from './components/ui'
import api from './api'

function RequireAuth({ children, adminOnly = false }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/auth" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/san-gia" replace />
  return children
}

function App() {
  const { user, isAdmin, logout } = useAuth()
  const location = useLocation()
  const isAuthPage = location.pathname === '/auth'
  const [invitationCount, setInvitationCount] = useState(0)

  useEffect(() => {
    if (user && !isAdmin) {
      loadInvitationCount()
      // Poll every 30 seconds
      const interval = setInterval(loadInvitationCount, 30000)
      return () => clearInterval(interval)
    }
  }, [user, isAdmin])

  const loadInvitationCount = async () => {
    try {
      const res = await api.get('/teams/my-invitations')
      const pending = res.data.filter(inv => inv.trangThai === 'CHO_XAC_NHAN')
      setInvitationCount(pending.length)
    } catch (err) {
      console.error(err)
    }
  }

  // Layout cho trang login (không có sidebar)
  if (isAuthPage) {
    return (
      <Routes>
        <Route
          path="/auth"
          element={
            user ? (
              <Navigate to={isAdmin ? '/san-gia' : '/booking'} replace />
            ) : (
              <LoginRegisterPage />
            )
          }
        />
      </Routes>
    )
  }

  // Sidebar items dựa trên role
  const sidebarItems = isAdmin
    ? [
        { path: '/san-gia', label: 'Quản lý sân', icon: '⚽' },
        { path: '/bookings-management', label: 'Quản lý đặt sân', icon: '📋' },
        { path: '/tournaments', label: 'Giải đấu', icon: '🏆' },
        { path: '/users', label: 'Người dùng', icon: '👥' },
      ]
    : [
        { path: '/booking', label: 'Đặt sân', icon: '⚽' },
        { path: '/my-bookings', label: 'Lịch sử đặt sân', icon: '📋' },
        { path: '/tournaments', label: 'Giải đấu', icon: '🏆' },
        { path: '/teams', label: 'Đội của tôi', icon: '👥', badge: invitationCount > 0 ? invitationCount : null },
      ]

  const logo = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: '700',
          color: 'white',
          boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
        }}
      >
        ⚽
      </div>
      <span style={{ fontSize: '18px', fontWeight: '600', letterSpacing: '-0.02em' }}>
        Soccer Pro
      </span>
    </div>
  )

  // Layout chính với sidebar
  return (
    <div className="app-layout">
      {user && <Sidebar items={sidebarItems} logo={logo} />}

      <div className="app-main-shell">
        {user && (
          <Header
            title="Quản lý sân bóng"
            actions={
              <>
                <Badge variant={isAdmin ? 'info' : 'success'} size="md">
                  {user.name}
                </Badge>
                <Badge variant={isAdmin ? 'purple' : 'primary'} size="md">
                  {isAdmin ? 'Quản trị' : 'Người dùng'}
                </Badge>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Đăng xuất
                </Button>
              </>
            }
          />
        )}

        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={<Navigate to={user ? (isAdmin ? '/san-gia' : '/booking') : '/auth'} replace />}
            />
            <Route
              path="/users"
              element={
                <RequireAuth adminOnly>
                  <UsersPage />
                </RequireAuth>
              }
            />
            <Route
              path="/san-gia"
              element={
                <RequireAuth adminOnly>
                  <SanGiaPage />
                </RequireAuth>
              }
            />
            <Route
              path="/bookings-management"
              element={
                <RequireAuth adminOnly>
                  <BookingManagementPage />
                </RequireAuth>
              }
            />
            <Route
              path="/booking"
              element={
                <RequireAuth>
                  <BookingPage />
                </RequireAuth>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <RequireAuth>
                  <MyBookingsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/tournaments"
              element={
                <RequireAuth>
                  <TournamentsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/tournaments/:id"
              element={
                <RequireAuth>
                  <TournamentDetailPage />
                </RequireAuth>
              }
            />
            <Route
              path="/teams"
              element={
                <RequireAuth>
                  <TeamsPage />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
