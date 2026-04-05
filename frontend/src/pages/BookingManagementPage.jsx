import { useEffect, useState } from 'react'
import api from '../api'

const STATUS_LABELS = {
  CHO_XAC_NHAN: 'Chờ xác nhận',
  DA_XAC_NHAN: 'Đã xác nhận',
  DA_HUY: 'Đã hủy',
  HOAN_THANH: 'Hoàn thành'
}

const STATUS_COLORS = {
  CHO_XAC_NHAN: { bg: '#fef3c7', color: '#92400e' },
  DA_XAC_NHAN: { bg: '#dbeafe', color: '#1e40af' },
  DA_HUY: { bg: '#fee2e2', color: '#991b1b' },
  HOAN_THANH: { bg: '#ecfdf3', color: '#166534' }
}

function BookingManagementPage() {
  const [bookings, setBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      const res = await api.get('/lich-su')
      setBookings(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/lich-su/${id}/status`, status, {
        headers: { 'Content-Type': 'application/json' }
      })
      await loadBookings()
      setSelectedBooking(null)
    } catch (err) {
      alert('Cập nhật thất bại: ' + (err.response?.data || err.message))
    }
  }

  const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('vi-VN')
  }

  return (
    <div className="page-full">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Quản lý đặt sân</div>
            <div className="card-subtitle">Xem và quản lý tất cả các đơn đặt sân</div>
          </div>
        </div>

        {bookings.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Người đặt</th>
                <th>Sân</th>
                <th>Ngày đặt</th>
                <th>Khung giờ</th>
                <th>Giá tiền</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.nguoiDungName}</td>
                  <td>Sân {b.soNguoi} người</td>
                  <td>{formatDate(b.ngayDat)}</td>
                  <td>{b.gioBatDau} - {b.gioKetThuc}</td>
                  <td>{b.giaTien ? `${Number(b.giaTien).toLocaleString('vi-VN')}đ` : 'Chưa xác định'}</td>
                  <td>
                    <span
                      className="pill"
                      style={STATUS_COLORS[b.trangThai] || {}}
                    >
                      {STATUS_LABELS[b.trangThai] || b.trangThai}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-ghost"
                      onClick={() => setSelectedBooking(b)}
                    >
                      Cập nhật
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">Chưa có đơn đặt sân nào</p>
        )}
      </div>

      {selectedBooking && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }}
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="card"
            style={{ maxWidth: 480, width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header">
              <div className="card-title">Cập nhật trạng thái</div>
              <button className="btn-ghost" onClick={() => setSelectedBooking(null)}>
                Đóng
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <strong>Người đặt:</strong> {selectedBooking.nguoiDungName}
              </div>
              <div>
                <strong>Sân:</strong> Sân {selectedBooking.soNguoi} người
              </div>
              <div>
                <strong>Ngày đặt:</strong> {formatDate(selectedBooking.ngayDat)}
              </div>
              <div>
                <strong>Khung giờ:</strong> {selectedBooking.gioBatDau} - {selectedBooking.gioKetThuc}
              </div>
              <div>
                <strong>Giá tiền:</strong> {selectedBooking.giaTien ? `${Number(selectedBooking.giaTien).toLocaleString('vi-VN')}đ` : 'Chưa xác định'}
              </div>
              <div>
                <strong>Trạng thái hiện tại:</strong>{' '}
                <span
                  className="pill"
                  style={STATUS_COLORS[selectedBooking.trangThai] || {}}
                >
                  {STATUS_LABELS[selectedBooking.trangThai]}
                </span>
              </div>
              <div style={{ marginTop: 8 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>
                  Chọn trạng thái mới:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {Object.keys(STATUS_LABELS).map((status) => (
                    <button
                      key={status}
                      className="btn-ghost"
                      style={{
                        justifyContent: 'flex-start',
                        ...(selectedBooking.trangThai === status ? { background: '#f3f4f6' } : {})
                      }}
                      onClick={() => updateStatus(selectedBooking.id, status)}
                    >
                      {STATUS_LABELS[status]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingManagementPage
