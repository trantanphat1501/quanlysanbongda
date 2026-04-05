import { useEffect, useState } from 'react'
import api from '../api'
import { Card, Button, Modal, Input, Badge } from '../components/ui'
import { useAuth } from '../AuthContext'

function TeamsPage() {
  const { user } = useAuth()
  const [myTeams, setMyTeams] = useState([])
  const [invitations, setInvitations] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [members, setMembers] = useState([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [searchPhone, setSearchPhone] = useState('')
  const [searchedUser, setSearchedUser] = useState(null)
  const [searchError, setSearchError] = useState('')
  const [form, setForm] = useState({ tenDoi: '', moTa: '' })

  useEffect(() => {
    loadMyTeams()
    loadInvitations()
  }, [])

  const loadMyTeams = async () => {
    try {
      const res = await api.get('/teams/my-teams')
      console.log('My teams response:', res.data)
      setMyTeams(res.data || [])
    } catch (err) {
      console.error('Error loading teams:', err)
      setMyTeams([])
    }
  }

  const loadInvitations = async () => {
    try {
      const res = await api.get('/teams/my-invitations')
      setInvitations(res.data.filter(inv => inv.trangThai === 'CHO_XAC_NHAN'))
    } catch (err) {
      console.error(err)
    }
  }

  const searchUserByPhone = async () => {
    if (!searchPhone.trim()) {
      setSearchError('Vui lòng nhập số điện thoại')
      return
    }
    
    try {
      const res = await api.get(`/nguoi-dung/search?soDienThoai=${searchPhone}`)
      if (res.data) {
        if (res.data.id === user.id) {
          setSearchError('Không thể mời chính mình')
          setSearchedUser(null)
        } else {
          setSearchedUser(res.data)
          setSearchError('')
        }
      }
    } catch (err) {
      setSearchError('Không tìm thấy người dùng với số điện thoại này')
      setSearchedUser(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedTeam) {
        await api.put(`/teams/${selectedTeam.id}`, form)
      } else {
        await api.post('/teams', form)
      }
      setShowModal(false)
      resetForm()
      loadMyTeams()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data || err.message))
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa đội này?')) return
    try {
      await api.delete(`/teams/${id}`)
      loadMyTeams()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data || err.message))
    }
  }

  const resetForm = () => {
    setForm({ tenDoi: '', moTa: '' })
    setSelectedTeam(null)
  }

  const openEdit = (team) => {
    setSelectedTeam(team)
    setForm({ tenDoi: team.tenDoi, moTa: team.moTa || '' })
    setShowModal(true)
  }

  const viewMembers = async (team) => {
    try {
      const res = await api.get(`/teams/${team.id}/members`)
      setMembers(res.data)
      setSelectedTeam(team)
      setShowMembersModal(true)
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data || err.message))
    }
  }

  const handleInvite = async () => {
    if (!searchedUser) {
      alert('Vui lòng tìm kiếm người dùng trước')
      return
    }
    
    try {
      await api.post(`/teams/${selectedTeam.id}/members`, { nguoiDungId: searchedUser.id })
      setShowInviteModal(false)
      setSearchPhone('')
      setSearchedUser(null)
      setSearchError('')
      alert('Đã gửi lời mời')
      viewMembers(selectedTeam)
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data || err.message))
    }
  }

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Xóa thành viên này?')) return
    try {
      await api.delete(`/teams/members/${memberId}`)
      viewMembers(selectedTeam)
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data || err.message))
    }
  }

  const handleInvitationResponse = async (memberId, status) => {
    try {
      await api.put(`/teams/members/${memberId}/status?status=${status}`)
      loadInvitations()
      loadMyTeams()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data || err.message))
    }
  }

  const getStatusBadge = (status) => {
    const map = {
      CHO_XAC_NHAN: { variant: 'warning', label: 'Chờ xác nhận' },
      DA_CHAP_NHAN: { variant: 'success', label: 'Đã chấp nhận' },
      TU_CHOI: { variant: 'danger', label: 'Từ chối' }
    }
    const config = map[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="page-full">
      {invitations.length > 0 && (
        <Card style={{ marginBottom: 16, border: '2px solid #f59e0b', background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' }}>
          <div className="card-header" style={{ borderBottom: '1px solid #fbbf24' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                background: '#f59e0b', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: 20
              }}>
                🔔
              </div>
              <div>
                <div className="card-title" style={{ color: '#92400e' }}>
                  Lời mời tham gia đội ({invitations.length})
                </div>
                <div className="card-subtitle" style={{ color: '#b45309' }}>
                  Bạn có {invitations.length} lời mời đang chờ xác nhận
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {invitations.map((inv) => (
              <div key={inv.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: 16, 
                background: 'white',
                border: '1px solid #fbbf24', 
                borderRadius: 12,
                boxShadow: '0 2px 4px rgba(245, 158, 11, 0.1)'
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
                    Đội: {inv.team?.tenDoi}
                  </div>
                  <div className="muted" style={{ fontSize: 14 }}>
                    👤 Chủ đội: {inv.team?.chuDoi?.name}
                  </div>
                  <div className="muted" style={{ fontSize: 14 }}>
                    📞 {inv.team?.chuDoi?.soDienThoai}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button size="sm" onClick={() => handleInvitationResponse(inv.id, 'DA_CHAP_NHAN')}>
                    ✓ Chấp nhận
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleInvitationResponse(inv.id, 'TU_CHOI')}>
                    ✕ Từ chối
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div className="card-header">
          <div>
            <div className="card-title">Đội của tôi</div>
            <div className="card-subtitle">Quản lý các đội bóng bạn tạo</div>
          </div>
          <Button onClick={() => { resetForm(); setShowModal(true) }}>
            + Tạo đội mới
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {myTeams.map((t) => {
            const isOwner = t.chuDoi && t.chuDoi.id === user.id
            return (
              <Card key={t.id} style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <div className="card-title" style={{ fontSize: 18 }}>{t.tenDoi}</div>
                  {isOwner ? (
                    <Badge variant="success">Chủ đội</Badge>
                  ) : (
                    <Badge variant="info">Thành viên</Badge>
                  )}
                </div>
                <p className="muted" style={{ marginBottom: 12 }}>{t.moTa}</p>
                <div style={{ fontSize: 14, marginBottom: 12 }}>
                  <div>👤 Chủ đội: {t.chuDoi?.name || 'N/A'}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Button variant="ghost" size="sm" onClick={() => viewMembers(t)}>
                    Thành viên
                  </Button>
                  {isOwner && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(t)}>Sửa</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id)}>Xóa</Button>
                    </>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {myTeams.length === 0 && <p className="muted">Bạn chưa tạo đội nào</p>}
      </Card>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm() }}>
        <div className="modal-header">
          <h2 className="modal-title">{selectedTeam ? 'Sửa đội' : 'Tạo đội mới'}</h2>
          <button className="modal-close" onClick={() => { setShowModal(false); resetForm() }}>×</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label="Tên đội"
              value={form.tenDoi}
              onChange={(e) => setForm({ ...form, tenDoi: e.target.value })}
              required
            />
            <div className="field-group">
              <label>Mô tả</label>
              <textarea
                value={form.moTa}
                onChange={(e) => setForm({ ...form, moTa: e.target.value })}
                rows={3}
                style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button type="button" variant="ghost" onClick={() => { setShowModal(false); resetForm() }}>
                Hủy
              </Button>
              <Button type="submit">
                {selectedTeam ? 'Cập nhật' : 'Tạo'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={showMembersModal} onClose={() => setShowMembersModal(false)}>
        <div className="modal-header">
          <h2 className="modal-title">Thành viên - {selectedTeam?.tenDoi}</h2>
          <button className="modal-close" onClick={() => setShowMembersModal(false)}>×</button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {selectedTeam && selectedTeam.chuDoi?.id === user.id && (
              <Button onClick={() => setShowInviteModal(true)}>+ Mời thành viên</Button>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {members.map((m) => (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{m.nguoiDung?.name}</div>
                    <div className="muted" style={{ fontSize: 14 }}>{m.nguoiDung?.soDienThoai}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {getStatusBadge(m.trangThai)}
                    {selectedTeam && selectedTeam.chuDoi?.id === user.id && (
                      <Button size="sm" variant="ghost" onClick={() => handleRemoveMember(m.id)}>
                        Xóa
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {members.length === 0 && <p className="muted">Chưa có thành viên nào</p>}
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showInviteModal} onClose={() => { setShowInviteModal(false); setSearchPhone(''); setSearchedUser(null); setSearchError('') }}>
        <div className="modal-header">
          <h2 className="modal-title">Mời thành viên</h2>
          <button className="modal-close" onClick={() => { setShowInviteModal(false); setSearchPhone(''); setSearchedUser(null); setSearchError('') }}>×</button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="field-group">
              <label>Số điện thoại</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                  style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  onKeyPress={(e) => e.key === 'Enter' && searchUserByPhone()}
                />
                <Button onClick={searchUserByPhone}>Tìm kiếm</Button>
              </div>
              {searchError && (
                <div style={{ color: '#dc2626', fontSize: 14, marginTop: 4 }}>{searchError}</div>
              )}
            </div>

            {searchedUser && (
              <div style={{ padding: 16, border: '2px solid #22c55e', borderRadius: 8, background: '#f0fdf4' }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{searchedUser.name}</div>
                <div className="muted" style={{ fontSize: 14 }}>{searchedUser.soDienThoai}</div>
                <div className="muted" style={{ fontSize: 14 }}>Vai trò: {searchedUser.vaiTro?.name === 'Quan_tri' ? 'Quản trị' : 'Người dùng'}</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => { setShowInviteModal(false); setSearchPhone(''); setSearchedUser(null); setSearchError('') }}>
                Hủy
              </Button>
              <Button onClick={handleInvite} disabled={!searchedUser}>
                Gửi lời mời
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default TeamsPage
