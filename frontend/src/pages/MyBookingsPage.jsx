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

function MyBookingsPage() {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      const res = await api.get('/lich-su/my-bookings')
      setBookings(res.data)
    } catch (err) {
      console.error(err)
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
            <div className="card-title">Lịch sử đặt sân</div>
            <div className="card-subtitle">Xem tất cả các lần đặt sân của bạn</div>
          </div>
        </div>

        {bookings.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Sân</th>
                <th>Ngày đặt</th>
                <th>Khung giờ</th>
                <th>Giá tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">Bạn chưa có lịch đặt sân nào</p>
        )}
      </div>
    </div>
  )
}

export default MyBookingsPage
