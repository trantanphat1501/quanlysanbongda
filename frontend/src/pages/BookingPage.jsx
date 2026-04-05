import { useEffect, useState } from 'react'
import api from '../api'

function BookingPage() {
  const [sanList, setSanList] = useState([])
  const [selectedSan, setSelectedSan] = useState(null)
  const [viewDetailSan, setViewDetailSan] = useState(null)
  const [bookingDate, setBookingDate] = useState('')
  const [selectedGiaTien, setSelectedGiaTien] = useState(null)
  const [bookedSlots, setBookedSlots] = useState([])

  useEffect(() => {
    loadSan()
  }, [])

  useEffect(() => {
    if (selectedSan && bookingDate) {
      loadBookedSlots()
    }
  }, [selectedSan, bookingDate])

  const loadSan = async () => {
    try {
      const res = await api.get('/san-bong')
      // Filter out deleted and maintenance fields
      setSanList(res.data.filter(s => !s.baoTri && !s.deleted))
    } catch (err) {
      console.error(err)
    }
  }

  const loadSanDetail = async (sanId) => {
    try {
      const res = await api.get(`/san-bong/${sanId}`)
      setViewDetailSan(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const loadBookedSlots = async () => {
    try {
      const res = await api.get(`/lich-su/san/${selectedSan.id}`)
      const booked = res.data
        .filter(b => b.ngayDat === bookingDate && b.trangThai !== 'DA_HUY')
        .map(b => `${b.gioBatDau}-${b.gioKetThuc}`)
      setBookedSlots(booked)
    } catch (err) {
      console.error(err)
    }
  }

  const handleBooking = async () => {
    if (!selectedSan || !bookingDate || !selectedGiaTien) {
      alert('Vui lòng chọn sân, ngày và khung giờ')
      return
    }

    try {
      await api.post('/lich-su/dat-san', {
        sanBongId: selectedSan.id,
        giaTienId: selectedGiaTien.id,
        ngayDat: bookingDate
      })
      alert('Đặt sân thành công! Vui lòng chờ xác nhận.')
      setSelectedSan(null)
      setBookingDate('')
      setSelectedGiaTien(null)
    } catch (err) {
      alert('Đặt sân thất bại: ' + (err.response?.data || err.message))
    }
  }

  const isSlotBooked = (giaTien) => {
    return bookedSlots.includes(`${giaTien.gioBatDau}-${giaTien.gioKetThuc}`)
  }

  return (
    <div className="page-full">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Đặt sân bóng</div>
            <div className="card-subtitle">Chọn sân và khung giờ để đặt lịch</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {sanList.map((s) => {
            const images = s.hinhAnhs || []
            const cover = images.length > 0 
              ? [...images].sort((a, b) => (a.thuTu ?? 9999) - (b.thuTu ?? 9999))[0]
              : null

            return (
              <div
                key={s.id}
                className="card"
                style={{
                  padding: 12,
                  cursor: 'pointer',
                  border: selectedSan?.id === s.id ? '2px solid #3b82f6' : '1px solid #e5e7eb'
                }}
                onClick={() => {
                  setSelectedSan(s)
                  setSelectedGiaTien(null)
                }}
              >
                {cover ? (
                  <img
                    src={cover.url}
                    alt=""
                    style={{
                      width: '100%',
                      height: 140,
                      objectFit: 'cover',
                      borderRadius: 12,
                      marginBottom: 8
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: 140,
                    borderRadius: 12,
                    border: '1px dashed #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8
                  }}>
                    <span className="muted">Chưa có ảnh</span>
                  </div>
                )}
                <div className="card-title" style={{ fontSize: 16 }}>
                  Sân {s.soNguoi} người
                </div>
                <div className="muted">
                  {s.giaTiens && s.giaTiens.length > 0 
                    ? `${s.giaTiens.length} khung giờ khả dụng`
                    : 'Chưa có khung giờ'}
                </div>
                <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                  <button
                    className="btn-ghost"
                    style={{ flex: 1 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      loadSanDetail(s.id)
                    }}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {sanList.length === 0 && (
          <p className="muted">Hiện không có sân nào khả dụng</p>
        )}
      </div>

      {selectedSan && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="card-header">
            <div className="card-title">Thông tin đặt sân</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="field-group">
              <label>Sân đã chọn</label>
              <input type="text" value={`Sân ${selectedSan.soNguoi} người`} disabled />
            </div>
            <div className="field-group">
              <label>Ngày đặt</label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => {
                  setBookingDate(e.target.value)
                  setSelectedGiaTien(null)
                }}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {bookingDate && selectedSan.giaTiens && selectedSan.giaTiens.length > 0 && (
              <div className="field-group">
                <label>Chọn khung giờ</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                  {selectedSan.giaTiens.map((g) => {
                    const isBooked = isSlotBooked(g)
                    return (
                      <button
                        key={g.id}
                        className="btn-ghost"
                        disabled={isBooked}
                        style={{
                          justifyContent: 'space-between',
                          padding: '12px',
                          border: selectedGiaTien?.id === g.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                          background: isBooked ? '#f3f4f6' : selectedGiaTien?.id === g.id ? '#eff6ff' : 'white',
                          opacity: isBooked ? 0.5 : 1,
                          cursor: isBooked ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => !isBooked && setSelectedGiaTien(g)}
                      >
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontWeight: 500 }}>
                            {g.gioBatDau} - {g.gioKetThuc}
                          </div>
                          <div style={{ fontSize: 14, color: '#6b7280' }}>
                            {g.giaTien?.toLocaleString('vi-VN')}đ
                          </div>
                        </div>
                        {isBooked && (
                          <span className="pill" style={{ background: '#fee2e2', color: '#991b1b' }}>
                            Đã đặt
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {bookingDate && (!selectedSan.giaTiens || selectedSan.giaTiens.length === 0) && (
              <p className="muted">Sân này chưa có khung giờ nào. Vui lòng chọn sân khác.</p>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                className="btn-primary" 
                onClick={handleBooking}
                disabled={!selectedGiaTien}
              >
                Xác nhận đặt sân
              </button>
              <button className="btn-ghost" onClick={() => {
                setSelectedSan(null)
                setBookingDate('')
                setSelectedGiaTien(null)
              }}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {viewDetailSan && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '20px'
          }}
          onClick={() => setViewDetailSan(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: 900,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header với gradient */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '24px',
              borderRadius: '16px 16px 0 0',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{
                    color: 'white',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    margin: '0 0 8px'
                  }}>
                    Sân {viewDetailSan.soNguoi} người
                  </h2>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    color: 'white',
                    fontSize: '14px'
                  }}>
                    <span style={{ fontSize: '16px' }}>✓</span>
                    Sẵn sàng đặt lịch
                  </div>
                </div>
                <button
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    color: 'white',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setViewDetailSan(null)}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                >
                  ×
                </button>
              </div>
            </div>

            <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Hình ảnh sân - Gallery style */}
              {viewDetailSan.hinhAnhs && viewDetailSan.hinhAnhs.length > 0 && (
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    margin: '0 0 16px',
                    color: '#1f2937',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>📸</span>
                    Hình ảnh sân
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: viewDetailSan.hinhAnhs.length === 1 ? '1fr' : 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '12px'
                  }}>
                    {viewDetailSan.hinhAnhs.map((img, index) => (
                      <div
                        key={img.id}
                        style={{
                          position: 'relative',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          transition: 'transform 0.2s',
                          cursor: 'pointer',
                          gridColumn: index === 0 && viewDetailSan.hinhAnhs.length > 1 ? 'span 2' : 'span 1'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <img
                          src={img.url}
                          alt=""
                          style={{
                            width: '100%',
                            height: index === 0 && viewDetailSan.hinhAnhs.length > 1 ? '280px' : '180px',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {index + 1}/{viewDetailSan.hinhAnhs.length}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Thông tin sân - Card style */}
              <div style={{
                background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 16px',
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>ℹ️</span>
                  Thông tin sân
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  <div style={{
                    background: 'white',
                    padding: '16px',
                    borderRadius: '10px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Loại sân</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                      Sân {viewDetailSan.soNguoi} người
                    </div>
                  </div>
                  <div style={{
                    background: 'white',
                    padding: '16px',
                    borderRadius: '10px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Trạng thái</div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#ecfdf3',
                      color: '#166534',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
                      Hoạt động
                    </div>
                  </div>
                  <div style={{
                    background: 'white',
                    padding: '16px',
                    borderRadius: '10px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Khung giờ</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                      {viewDetailSan.giaTiens?.length || 0} khung
                    </div>
                  </div>
                </div>
              </div>

              {/* Bảng giá - Modern table */}
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 16px',
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>💰</span>
                  Bảng giá theo khung giờ
                </h3>
                {viewDetailSan.giaTiens && viewDetailSan.giaTiens.length > 0 ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '12px'
                  }}>
                    {viewDetailSan.giaTiens
                      .sort((a, b) => a.gioBatDau.localeCompare(b.gioBatDau))
                      .map((g) => (
                        <div
                          key={g.id}
                          style={{
                            background: 'white',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            padding: '16px',
                            transition: 'all 0.2s',
                            cursor: 'default'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#667eea'
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e5e7eb'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px'
                          }}>
                            <span style={{ fontSize: '20px' }}>🕐</span>
                            <span style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1f2937'
                            }}>
                              {g.gioBatDau} - {g.gioKetThuc}
                            </span>
                          </div>
                          <div style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#667eea'
                          }}>
                            {g.giaTien?.toLocaleString?.('vi-VN')}đ
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    color: '#6b7280'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>📋</div>
                    <div>Chưa có bảng giá cho sân này</div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                paddingTop: '16px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <button
                  className="btn-ghost"
                  onClick={() => setViewDetailSan(null)}
                  style={{
                    padding: '12px 24px',
                    fontSize: '15px'
                  }}
                >
                  Đóng
                </button>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setSelectedSan(viewDetailSan)
                    setViewDetailSan(null)
                    setSelectedGiaTien(null)
                    setBookingDate('')
                  }}
                  style={{
                    padding: '12px 32px',
                    fontSize: '15px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    fontWeight: '600'
                  }}
                >
                  Đặt sân ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingPage
