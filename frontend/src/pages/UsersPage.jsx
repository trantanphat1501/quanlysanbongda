import { useEffect, useState } from 'react'
import api from '../api'

function UsersPage() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    name: '',
    soDienThoai: '',
    password: '',
    vaiTroId: null,
  })

  const load = async () => {
    const res = await api.get('/nguoi-dung')
    setUsers(res.data)
  }

  useEffect(() => {
    load().catch(() => { })
  }, [])

  const startEdit = (user) => {
    setEditing(user.id)
    setForm({
      name: user.name || '',
      soDienThoai: user.soDienThoai || '',
      password: '',
      vaiTroId: user.vaiTro?.id || null,
    })
  }

  const save = async () => {
    await api.put(`/nguoi-dung/${editing}`, form)
    setEditing(null)
    await load()
  }

  const remove = async (id) => {
    await api.delete(`/nguoi-dung/${id}`)
    await load()
  }

  const filtered = users.filter((u) => {
    const term = search.trim().toLowerCase()
    if (!term) return true
    return (
      String(u.id).includes(term) ||
      (u.name || '').toLowerCase().includes(term) ||
      (u.soDienThoai || '').toLowerCase().includes(term) ||
      (u.vaiTro?.name || '').toLowerCase().includes(term)
    )
  })

  return (
    <div className="page-full">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Quản lý người dùng</div>
            <div className="card-subtitle">
              Danh sách tài khoản với quyền truy cập hệ thống.
            </div>
          </div>
          <div className="field-group" style={{ marginBottom: 0, minWidth: 260 }}>
            <label>Tìm kiếm</label>
            <input
              placeholder="Tìm theo tên, SĐT, vai trò..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>SĐT</th>
              <th>Vai trò</th>
              <th style={{ width: 160 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>
                  {editing === u.id ? (
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      style={{ width: '100%' }}
                    />
                  ) : (
                    u.name
                  )}
                </td>
                <td>
                  {editing === u.id ? (
                    <input
                      value={form.soDienThoai}
                      onChange={(e) =>
                        setForm({ ...form, soDienThoai: e.target.value })
                      }
                      style={{ width: '100%' }}
                    />
                  ) : (
                    u.soDienThoai
                  )}
                </td>
                <td>
                  {u.vaiTro?.name && (
                    <span className="pill">{u.vaiTro.name}</span>
                  )}
                </td>
                <td>
                  {editing === u.id ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-primary" onClick={save}>
                        Lưu
                      </button>
                      <button
                        className="btn-ghost"
                        onClick={() => setEditing(null)}
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="btn-ghost"
                        onClick={() => startEdit(u)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn-ghost"
                        onClick={() => remove(u.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="muted" style={{ marginTop: 8 }}>
            Chưa có người dùng nào hoặc bạn không có quyền xem danh sách.
          </p>
        )}
      </div>
    </div>
  )
}

export default UsersPage

