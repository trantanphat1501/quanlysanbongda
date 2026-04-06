import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'
import { Button, Input } from '../components/ui'
import api from '../api'
import './LoginRegisterPage.css'

function LoginRegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [tab, setTab] = useState('login')
  const [loginForm, setLoginForm] = useState({
    soDienThoai: '',
    password: '',
  })
  const [registerForm, setRegisterForm] = useState({
    name: '',
    soDienThoai: '',
    password: '',
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)
    try {
      const user = await login(loginForm.soDienThoai, loginForm.password)
      setMessage('success:Đăng nhập thành công!')
      const isAdmin = user?.vaiTro?.name === 'Quan_tri'
      setTimeout(() => {
        navigate(isAdmin ? '/san-gia' : '/booking', { replace: true })
      }, 500)
    } catch (err) {
      setMessage('error:Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)
    try {
      await api.post('/auth/dang-ky', registerForm)
      setMessage('success:Đăng ký thành công! Hãy đăng nhập.')
      setTab('login')
      setRegisterForm({ name: '', soDienThoai: '', password: '' })
    } catch (err) {
      setMessage('error:Đăng ký thất bại. Số điện thoại có thể đã được sử dụng.')
    } finally {
      setLoading(false)
    }
  }

  const [type, msg] = message.split(':')

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="auth-brand-icon">⚽</div>
          <h1 className="auth-brand-title">Soccer Pro</h1>
          <p className="auth-brand-subtitle">Hệ thống quản lý sân bóng hiện đại</p>
        </div>

        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => setTab('login')}
            >
              Đăng nhập
            </button>
            <button
              className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => setTab('register')}
            >
              Đăng ký
            </button>
          </div>

          {message && (
            <div className={`auth-alert auth-alert-${type}`}>
              {msg}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="auth-form">
              <Input
                label="Số điện thoại"
                type="tel"
                value={loginForm.soDienThoai}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, soDienThoai: e.target.value })
                }
                placeholder="0901234567"
                fullWidth
                required
              />
              <Input
                label="Mật khẩu"
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                placeholder="••••••••"
                fullWidth
                required
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
              >
                Đăng nhập
              </Button>

              <div className="auth-demo">
                <div className="auth-demo-title">Tài khoản demo</div>
                <div className="auth-demo-accounts">
                  <div className="auth-demo-account">
                    <span className="auth-demo-account-icon">👤</span>
                    <span>Admin: 0000000000 / 123456</span>
                  </div>
                  <div className="auth-demo-account">
                    <span className="auth-demo-account-icon">👤</span>
                    <span>User: 1111111111 / 123456</span>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <Input
                label="Tên hiển thị"
                value={registerForm.name}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, name: e.target.value })
                }
                placeholder="Nguyễn Văn A"
                fullWidth
                required
              />
              <Input
                label="Số điện thoại"
                type="tel"
                value={registerForm.soDienThoai}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    soDienThoai: e.target.value,
                  })
                }
                placeholder="0901234567"
                fullWidth
                required
              />
              <Input
                label="Mật khẩu"
                type="password"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, password: e.target.value })
                }
                placeholder="Tối thiểu 6 ký tự"
                helperText="Mật khẩu phải có ít nhất 6 ký tự"
                fullWidth
                required
                minLength={6}
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
              >
                Đăng ký
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginRegisterPage

