import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import { Card, Button, Badge, Modal, Input } from '../components/ui'
import { useAuth } from '../AuthContext'

function TournamentDetailPage() {
  const { id } = useParams()
  const { user, isAdmin } = useAuth()
  const [tournament, setTournament] = useState(null)
  const [teams, setTeams] = useState([])
  const [myTeams, setMyTeams] = useState([])
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [showStandingModal, setShowStandingModal] = useState(false)
  const [selectedTeamStanding, setSelectedTeamStanding] = useState(null)
  const [standingForm, setStandingForm] = useState({
    soTranThang: 0,
    soTranHoa: 0,
    soTranThua: 0,
    soBanThang: 0,
    soBanThua: 0,
    diem: 0
  })

  useEffect(() => {
    loadTournament()
    loadTeams()
    if (!isAdmin) loadMyTeams()
  }, [id])

  const loadTournament = async () => {
    try {
      const res = await api.get(`/tournaments/${id}`)
      setTournament(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const loadTeams = async () => {
    try {
      const res = await api.get(`/tournament-teams/tournament/${id}`)
      setTeams(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const loadMyTeams = async () => {
    try {
      const res = await api.get('/teams/my-teams')
      // Chỉ lấy các team mà user là chủ đội
      const ownedTeams = res.data.filter(t => t.chuDoi && t.chuDoi.id === user.id)
      setMyTeams(ownedTeams)
    } catch (err) {
      console.error(err)
    }
  }

  const handleRegister = async () => {
    if (!selectedTeamId) {
      alert('Vui lòng chọn đội')
      return
    }
    try {
      await api.post(`/teams/${selectedTeamId}/register-tournament/${id}`)
      alert('Đăng ký thành công! Chờ quản trị viên duyệt.')
      loadTeams()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data || err.message))
    }
  }

  const handleApprove = async (teamId, status) => {
    try {
      await api.put(`/tournament-teams/${teamId}/status?status=${status}`)
      loadTeams()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data || err.message))
    }
  }

  const openStandingModal = (tt) => {
    setSelectedTeamStanding(tt)
    setStandingForm({
      soTranThang: tt.soTranThang || 0,
      soTranHoa: tt.soTranHoa || 0,
      soTranThua: tt.soTranThua || 0,
      soBanThang: tt.soBanThang || 0,
      soBanThua: tt.soBanThua || 0,
      diem: tt.diem || 0
    })
    setShowStandingModal(true)
  }

  const handleUpdateStanding = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/tournament-teams/${selectedTeamStanding.id}/standing`, standingForm)
      setShowStandingModal(false)
      loadTeams()
      alert('Cập nhật bảng xếp hạng thành công')
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data || err.message))
    }
  }

  const getStatusBadge = (status) => {
    const map = {
      CHO_DUYET: { variant: 'warning', label: 'Chờ duyệt' },
      DA_DUYET: { variant: 'success', label: 'Đã duyệt' },
      TU_CHOI: { variant: 'danger', label: 'Từ chối' }
    }
    const config = map[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (!tournament) return <div>Loading...</div>

  return (
    <div className="page-full">
      <Card>
        <div className="card-header">
          <div>
            <div className="card-title">{tournament.tenGiai}</div>
            <div className="card-subtitle">{tournament.moTa}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 16 }}>
          <div>
            <div className="muted">Ngày bắt đầu</div>
            <div style={{ fontWeight: 500 }}>{tournament.ngayBatDau}</div>
          </div>
          <div>
            <div className="muted">Ngày kết thúc</div>
            <div style={{ fontWeight: 500 }}>{tournament.ngayKetThuc}</div>
          </div>
          <div>
            <div className="muted">Số đội tối đa</div>
            <div style={{ fontWeight: 500 }}>{tournament.soDoiToiDa}</div>
          </div>
          <div>
            <div className="muted">Trạng thái</div>
            <div style={{ fontWeight: 500 }}>{tournament.trangThai}</div>
          </div>
        </div>
      </Card>

      {!isAdmin && tournament.trangThai === 'DANG_MO' && (
        <Card style={{ marginTop: 16 }}>
          <div className="card-header">
            <div className="card-title">Đăng ký tham gia</div>
            <div className="card-subtitle">Chỉ chủ đội mới có thể đăng ký tham gia giải đấu</div>
          </div>
          {myTeams.length > 0 ? (
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <div className="field-group" style={{ flex: 1 }}>
                <label>Chọn đội của bạn (chỉ đội bạn làm chủ)</label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                >
                  <option value="">-- Chọn đội --</option>
                  {myTeams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.tenDoi} (Chủ đội)
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleRegister}>Đăng ký</Button>
            </div>
          ) : (
            <div style={{ padding: '16px', background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 8 }}>
              <p style={{ margin: 0, color: '#92400e' }}>
                Bạn chưa là chủ đội nào. Vui lòng tạo đội mới hoặc chờ được mời làm chủ đội để đăng ký giải đấu.
              </p>
            </div>
          )}
        </Card>
      )}

      <Card style={{ marginTop: 16 }}>
        <div className="card-header">
          <div className="card-title">Danh sách đội tham gia ({teams.length})</div>
        </div>
        
        {/* Bảng xếp hạng */}
        {teams.filter(tt => tt.trangThai === 'DA_DUYET').length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Bảng xếp hạng</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: 14, fontWeight: 600 }}>Hạng</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: 14, fontWeight: 600 }}>Đội</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: 14, fontWeight: 600 }}>Trận</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: 14, fontWeight: 600 }}>Thắng</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: 14, fontWeight: 600 }}>Hòa</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: 14, fontWeight: 600 }}>Thua</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: 14, fontWeight: 600 }}>Bàn thắng</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: 14, fontWeight: 600 }}>Bàn thua</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: 14, fontWeight: 600 }}>Hiệu số</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: 14, fontWeight: 600 }}>Điểm</th>
                    {isAdmin && <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: 14, fontWeight: 600 }}>Thao tác</th>}
                  </tr>
                </thead>
                <tbody>
                  {teams
                    .filter(tt => tt.trangThai === 'DA_DUYET')
                    .sort((a, b) => {
                      if ((b.diem || 0) !== (a.diem || 0)) return (b.diem || 0) - (a.diem || 0)
                      const hieuSoA = (a.soBanThang || 0) - (a.soBanThua || 0)
                      const hieuSoB = (b.soBanThang || 0) - (b.soBanThua || 0)
                      if (hieuSoB !== hieuSoA) return hieuSoB - hieuSoA
                      return (b.soBanThang || 0) - (a.soBanThang || 0)
                    })
                    .map((tt, index) => {
                      const soTran = (tt.soTranThang || 0) + (tt.soTranHoa || 0) + (tt.soTranThua || 0)
                      const hieuSo = (tt.soBanThang || 0) - (tt.soBanThua || 0)
                      return (
                        <tr key={tt.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '12px 8px', fontWeight: 600 }}>{index + 1}</td>
                          <td style={{ padding: '12px 8px' }}>{tt.team?.tenDoi}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'center' }}>{soTran}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'center' }}>{tt.soTranThang || 0}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'center' }}>{tt.soTranHoa || 0}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'center' }}>{tt.soTranThua || 0}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'center' }}>{tt.soBanThang || 0}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'center' }}>{tt.soBanThua || 0}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 600, color: hieuSo > 0 ? '#22c55e' : hieuSo < 0 ? '#ef4444' : '#6b7280' }}>
                            {hieuSo > 0 ? '+' : ''}{hieuSo}
                          </td>
                          <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 700, fontSize: 16 }}>{tt.diem || 0}</td>
                          {isAdmin && (
                            <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                              <Button size="sm" variant="ghost" onClick={() => openStandingModal(tt)}>
                                Cập nhật
                              </Button>
                            </td>
                          )}
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Danh sách đội đăng ký */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Tất cả đội đăng ký</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {teams.map((tt) => (
              <div key={tt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{tt.team?.tenDoi}</div>
                  <div className="muted" style={{ fontSize: 14 }}>Chủ đội: {tt.team?.chuDoi?.name}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {getStatusBadge(tt.trangThai)}
                  {isAdmin && tt.trangThai === 'CHO_DUYET' && (
                    <>
                      <Button size="sm" onClick={() => handleApprove(tt.id, 'DA_DUYET')}>
                        Duyệt
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleApprove(tt.id, 'TU_CHOI')}>
                        Từ chối
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {teams.length === 0 && <p className="muted">Chưa có đội nào đăng ký</p>}
          </div>
        </div>
      </Card>

      {/* Modal cập nhật bảng xếp hạng */}
      {showStandingModal && (
        <Modal isOpen={showStandingModal} onClose={() => setShowStandingModal(false)}>
          <div className="modal-header">
            <h2 className="modal-title">Cập nhật bảng xếp hạng - {selectedTeamStanding?.team?.tenDoi}</h2>
            <button className="modal-close" onClick={() => setShowStandingModal(false)}>×</button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleUpdateStanding} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                <Input
                  label="Số trận thắng"
                  type="number"
                  min="0"
                  value={standingForm.soTranThang}
                  onChange={(e) => setStandingForm({ ...standingForm, soTranThang: parseInt(e.target.value) || 0 })}
                />
                <Input
                  label="Số trận hòa"
                  type="number"
                  min="0"
                  value={standingForm.soTranHoa}
                  onChange={(e) => setStandingForm({ ...standingForm, soTranHoa: parseInt(e.target.value) || 0 })}
                />
                <Input
                  label="Số trận thua"
                  type="number"
                  min="0"
                  value={standingForm.soTranThua}
                  onChange={(e) => setStandingForm({ ...standingForm, soTranThua: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                <Input
                  label="Số bàn thắng"
                  type="number"
                  min="0"
                  value={standingForm.soBanThang}
                  onChange={(e) => setStandingForm({ ...standingForm, soBanThang: parseInt(e.target.value) || 0 })}
                />
                <Input
                  label="Số bàn thua"
                  type="number"
                  min="0"
                  value={standingForm.soBanThua}
                  onChange={(e) => setStandingForm({ ...standingForm, soBanThua: parseInt(e.target.value) || 0 })}
                />
              </div>
              <Input
                label="Điểm"
                type="number"
                min="0"
                value={standingForm.diem}
                onChange={(e) => setStandingForm({ ...standingForm, diem: parseInt(e.target.value) || 0 })}
              />
              <div style={{ padding: 12, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8 }}>
                <div style={{ fontSize: 14, marginBottom: 4 }}>Thống kê:</div>
                <div style={{ fontSize: 14 }}>
                  Tổng số trận: {standingForm.soTranThang + standingForm.soTranHoa + standingForm.soTranThua}
                </div>
                <div style={{ fontSize: 14 }}>
                  Hiệu số: {standingForm.soBanThang - standingForm.soBanThua > 0 ? '+' : ''}{standingForm.soBanThang - standingForm.soBanThua}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button type="button" variant="ghost" onClick={() => setShowStandingModal(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  Cập nhật
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default TournamentDetailPage
