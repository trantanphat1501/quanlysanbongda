import { useEffect, useState } from 'react'
import api from '../api'
import { Card, Button, Modal, Input, Badge } from '../components/ui'
import { useAuth } from '../AuthContext'

function TournamentsPage() {
  const { isAdmin } = useAuth()
  const [tournaments, setTournaments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedTournament, setSelectedTournament] = useState(null)
  const [form, setForm] = useState({
    tenGiai: '',
    moTa: '',
    ngayBatDau: '',
    ngayKetThuc: '',
    soDoiToiDa: 16,
    trangThai: 'DANG_MO'
  })

  useEffect(() => {
    loadTournaments()
  }, [])

  const loadTournaments = async () => {
    try {
      const res = await api.get('/tournaments')
      setTournaments(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedTournament) {
        await api.put(`/tournaments/${selectedTournament.id}`, form)
      } else {
        await api.post('/tournaments', form)
      }
      setShowModal(false)
      resetForm()
      loadTournaments()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data || err.message))
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa giải đấu này?')) return
    try {
      await api.delete(`/tournaments/${id}`)
      loadTournaments()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data || err.message))
    }
  }

  const resetForm = () => {
    setForm({
      tenGiai: '',
      moTa: '',
      ngayBatDau: '',
      ngayKetThuc: '',
      soDoiToiDa: 16,
      trangThai: 'DANG_MO'
    })
    setSelectedTournament(null)
  }

  const openEdit = (tournament) => {
    setSelectedTournament(tournament)
    setForm({
      tenGiai: tournament.tenGiai,
      moTa: tournament.moTa || '',
      ngayBatDau: tournament.ngayBatDau,
      ngayKetThuc: tournament.ngayKetThuc,
      soDoiToiDa: tournament.soDoiToiDa,
      trangThai: tournament.trangThai
    })
    setShowModal(true)
  }

  const getStatusBadge = (status) => {
    const map = {
      DANG_MO: { variant: 'success', label: 'Đang mở' },
      DANG_DIEN_RA: { variant: 'info', label: 'Đang diễn ra' },
      KET_THUC: { variant: 'default', label: 'Kết thúc' }
    }
    const config = map[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="page-full">
      <Card>
        <div className="card-header">
          <div>
            <div className="card-title">Quản lý giải đấu</div>
            <div className="card-subtitle">Danh sách các giải bóng đá</div>
          </div>
          {isAdmin && (
            <Button onClick={() => { resetForm(); setShowModal(true) }}>
              + Tạo giải mới
            </Button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {tournaments.map((t) => (
            <Card key={t.id} style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                <div className="card-title" style={{ fontSize: 18 }}>{t.tenGiai}</div>
                {getStatusBadge(t.trangThai)}
              </div>
              <p className="muted" style={{ marginBottom: 12 }}>{t.moTa}</p>
              <div style={{ fontSize: 14, marginBottom: 8 }}>
                <div>📅 {t.ngayBatDau} → {t.ngayKetThuc}</div>
                <div>👥 Tối đa: {t.soDoiToiDa} đội</div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <Button variant="ghost" size="sm" onClick={() => window.location.href = `/tournaments/${t.id}`}>
                  Chi tiết
                </Button>
                {isAdmin && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(t)}>Sửa</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id)}>Xóa</Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>

        {tournaments.length === 0 && <p className="muted">Chưa có giải đấu nào</p>}
      </Card>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm() }}>
        <div className="modal-header">
          <h2 className="modal-title">{selectedTournament ? 'Sửa giải đấu' : 'Tạo giải mới'}</h2>
          <button className="modal-close" onClick={() => { setShowModal(false); resetForm() }}>×</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label="Tên giải"
              value={form.tenGiai}
              onChange={(e) => setForm({ ...form, tenGiai: e.target.value })}
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
            <Input
              label="Ngày bắt đầu"
              type="date"
              value={form.ngayBatDau}
              onChange={(e) => setForm({ ...form, ngayBatDau: e.target.value })}
              required
            />
            <Input
              label="Ngày kết thúc"
              type="date"
              value={form.ngayKetThuc}
              onChange={(e) => setForm({ ...form, ngayKetThuc: e.target.value })}
              required
            />
            <Input
              label="Số đội tối đa"
              type="number"
              value={form.soDoiToiDa}
              onChange={(e) => setForm({ ...form, soDoiToiDa: parseInt(e.target.value) })}
              required
            />
            {selectedTournament && (
              <div className="field-group">
                <label>Trạng thái</label>
                <select
                  value={form.trangThai}
                  onChange={(e) => setForm({ ...form, trangThai: e.target.value })}
                  style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                >
                  <option value="DANG_MO">Đang mở</option>
                  <option value="DANG_DIEN_RA">Đang diễn ra</option>
                  <option value="KET_THUC">Kết thúc</option>
                </select>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button type="button" variant="ghost" onClick={() => { setShowModal(false); resetForm() }}>
                Hủy
              </Button>
              <Button type="submit">
                {selectedTournament ? 'Cập nhật' : 'Tạo'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}

export default TournamentsPage
