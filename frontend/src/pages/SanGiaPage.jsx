import { useEffect, useState } from 'react'
import api from '../api'

function SanGiaPage() {
  const [sanList, setSanList] = useState([])
  const [selectedSan, setSelectedSan] = useState(null)
  const [showCreatePopup, setShowCreatePopup] = useState(false)
  const [sanForm, setSanForm] = useState({ soNguoi: 10, baoTri: false })
  const [createImages, setCreateImages] = useState([])
  const [createGiaList, setCreateGiaList] = useState([])
  const [createGiaForm, setCreateGiaForm] = useState({
    gioBatDau: '18:00',
    gioKetThuc: '19:00',
    giaTien: 0,
  })
  const [giaForm, setGiaForm] = useState({
    sanBongId: null,
    gioBatDau: '18:00',
    gioKetThuc: '19:00',
    giaTien: 0,
  })

  const loadSan = async () => {
    const res = await api.get('/san-bong/admin/all')
    setSanList(res.data)
  }

  const loadGia = async (sanId) => {
    if (!sanId) return
    const res = await api.get(`/san-bong/${sanId}`)
    setSelectedSan(res.data)
  }

  useEffect(() => {
    loadSan().catch(() => {})
  }, [])

  const createSan = async () => {
    // Tạo sân trước
    const sanRes = await api.post('/san-bong', sanForm)
    const newSanId = sanRes.data.id

    // Upload hình ảnh nếu có
    for (const file of createImages) {
      const formData = new FormData()
      formData.append('file', file)
      try {
        await api.post(`/san-bong/${newSanId}/upload-anh`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } catch (err) {
        console.error('Upload image error:', err)
      }
    }

    // Tạo giá nếu có
    for (const gia of createGiaList) {
      try {
        await api.post('/gia-tien', {
          ...gia,
          sanBongId: newSanId,
        })
      } catch (err) {
        console.error('Create price error:', err)
      }
    }

    // Reset form
    setSanForm({ soNguoi: 10, baoTri: false })
    setCreateImages([])
    setCreateGiaList([])
    setCreateGiaForm({
      gioBatDau: '18:00',
      gioKetThuc: '19:00',
      giaTien: 0,
    })
    setShowCreatePopup(false)
    await loadSan()
  }

  const createGia = async () => {
    if (!giaForm.sanBongId) return
    await api.post('/gia-tien', giaForm)
    await loadGia(giaForm.sanBongId)
  }

  const deleteSan = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa sân này?')) return
    await api.delete(`/san-bong/${id}`)
    await loadSan()
  }

  const restoreSan = async (id) => {
    await api.put(`/san-bong/${id}/restore`)
    await loadSan()
  }

  const deleteGia = async (id) => {
    await api.delete(`/gia-tien/${id}`)
    await loadGia(selectedSan?.id)
  }

  const uploadImage = async (e) => {
    if (!selectedSan) return
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    try {
      await api.post(`/san-bong/${selectedSan.id}/upload-anh`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await loadGia(selectedSan.id)
    } finally {
      e.target.value = ''
    }
  }

  const deleteImage = async (imageId) => {
    await api.delete(`/hinh-anh/${imageId}`)
    await loadGia(selectedSan?.id)
  }

  const onSelectSan = (san) => {
    setSelectedSan(san)
    setGiaForm({
      sanBongId: san.id,
      gioBatDau: '18:00',
      gioKetThuc: '19:00',
      giaTien: 0,
    })
    loadGia(san.id).catch(() => {})
  }

  return (
    <div className="page-full">
      <div className="card">
          <div className="card-header">
            <div>
            <div className="card-title">Danh sách sân bóng</div>
            <div className="card-subtitle">Chọn sân để xem chi tiết.</div>
            </div>
          <button className="btn-primary" onClick={() => setShowCreatePopup(true)}>
            Tạo sân mới
          </button>
          </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 16,
          }}
        >
          {sanList.map((s) => {
            const images = s.hinhAnhs || []
            const cover =
              images.length > 0
                ? [...images].sort((a, b) => (a.thuTu ?? 9999) - (b.thuTu ?? 9999))[0]
                : null
            const isDeleted = s.deleted === true

            return (
              <div
                key={s.id}
                className="card"
                style={{ 
                  padding: 12, 
                  cursor: 'pointer',
                  opacity: isDeleted ? 0.5 : 1,
                  position: 'relative',
                  border: isDeleted ? '2px dashed #ef4444' : undefined
                }}
                onClick={() => !isDeleted && onSelectSan(s)}
              >
                {isDeleted && (
                  <div style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: '#fee2e2',
                    color: '#991b1b',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: '600',
                    zIndex: 1
                  }}>
                    Đã xóa
                  </div>
                )}
                {cover ? (
                  <img
                    src={cover.url}
                    alt=""
                    style={{
                      width: '100%',
                      height: 140,
                      objectFit: 'cover',
                      borderRadius: 12,
                      border: '1px solid #e5e7eb',
                      marginBottom: 8,
                      filter: isDeleted ? 'grayscale(100%)' : 'none'
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: 140,
                      borderRadius: 12,
                      border: '1px dashed #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <span className="muted">Chưa có ảnh</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div className="card-title" style={{ fontSize: 16 }}>
                      Sân {s.soNguoi} người
                    </div>
                    <div className="muted">
                      {isDeleted ? 'Đã xóa' : s.baoTri ? 'Đang bảo trì' : 'Sẵn sàng đặt lịch'}
                    </div>
                  </div>
                  <div>
                    {isDeleted ? (
                      <span className="pill" style={{ background: '#fee2e2', color: '#991b1b' }}>
                        Đã xóa
                      </span>
                    ) : s.baoTri ? (
                      <span className="pill">Bảo trì</span>
                    ) : (
                      <span
                        className="pill"
                        style={{ background: '#ecfdf3', color: '#166534' }}
                      >
                        Hoạt động
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                  {!isDeleted ? (
                    <>
                      <button
                        className="btn-ghost"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectSan(s)
                        }}
                      >
                        Xem chi tiết
                      </button>
                      <button
                        className="btn-ghost"
                        type="button"
                        style={{ color: '#dc2626' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSan(s.id)
                        }}
                      >
                        Xóa
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn-ghost"
                      type="button"
                      style={{ color: '#16a34a' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        restoreSan(s.id)
                      }}
                    >
                      Khôi phục
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {sanList.length === 0 && (
          <p className="muted" style={{ marginTop: 8 }}>
            Chưa có sân nào. Nhấn "Tạo sân mới" để bắt đầu.
          </p>
        )}
      </div>

      {selectedSan && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
          onClick={() => setSelectedSan(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: 720,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header">
              <div>
                <div className="card-title">
                  Chi tiết sân {selectedSan.soNguoi} người
                </div>
                <div className="card-subtitle">
                  Cấu hình ảnh và giá cho sân này.
                </div>
              </div>
              <button
                className="btn-ghost"
                type="button"
                onClick={() => setSelectedSan(null)}
              >
                Đóng
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Trạng thái sân */}
              <div style={{ padding: 16, background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 16 }}>Trạng thái sân</h4>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedSan.baoTri || false}
                      onChange={async (e) => {
                        const newStatus = e.target.checked
                        try {
                          await api.put(`/san-bong/${selectedSan.id}/bao-tri?baoTri=${newStatus}`)
                          setSelectedSan({ ...selectedSan, baoTri: newStatus })
                          await loadSan()
                          alert(newStatus ? 'Đã chuyển sân sang trạng thái bảo trì' : 'Đã mở lại sân')
                        } catch (err) {
                          alert('Lỗi: ' + (err.response?.data || err.message))
                        }
                      }}
                    />
                    <span style={{ fontWeight: 500 }}>Đang bảo trì</span>
                  </label>
                  <div style={{ 
                    padding: '4px 12px', 
                    borderRadius: '999px',
                    fontSize: 13,
                    fontWeight: 600,
                    background: selectedSan.baoTri ? '#fef3c7' : '#ecfdf3',
                    color: selectedSan.baoTri ? '#92400e' : '#166534'
                  }}>
                    {selectedSan.baoTri ? '⚠️ Sân đang bảo trì' : '✓ Sân đang hoạt động'}
                  </div>
                </div>
                <p className="muted" style={{ margin: '8px 0 0', fontSize: 13 }}>
                  {selectedSan.baoTri 
                    ? 'Sân đang bảo trì sẽ không hiển thị cho người dùng đặt lịch'
                    : 'Sân đang hoạt động và sẵn sàng cho người dùng đặt lịch'}
                </p>
              </div>
              <div>
                <h4 style={{ margin: '0 0 8px' }}>Hình ảnh sân</h4>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(selectedSan.hinhAnhs || []).map((img) => (
                    <div key={img.id} style={{ position: 'relative' }}>
                      <img
                        src={img.url}
                        alt=""
                        style={{
                          width: 96,
                          height: 64,
                          objectFit: 'cover',
                          borderRadius: 8,
                          border: '1px solid #e5e7eb',
                        }}
                      />
                      <button
                        type="button"
                        className="btn-ghost"
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          padding: '0 6px',
                          fontSize: 10,
                        }}
                        onClick={() => deleteImage(img.id)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                  <label
                    className="btn-ghost"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    Thêm ảnh
                    <input
                      type="file"
                      accept="image/*"
                      onChange={uploadImage}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr) 1.2fr',
                  gap: 10,
                }}
              >
                <div className="field-group">
                  <label>Giờ bắt đầu (HH:mm)</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <select
                      value={giaForm.gioBatDau.split(':')[0] || '18'}
                      onChange={(e) => {
                        const h = e.target.value.padStart(2, '0')
                        const m = giaForm.gioBatDau.split(':')[1] || '00'
                        setGiaForm({ ...giaForm, gioBatDau: `${h}:${m}` })
                      }}
                    >
                      {Array.from({ length: 24 }).map((_, i) => {
                        const v = String(i).padStart(2, '0')
                        return (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        )
                      })}
                    </select>
                    <select
                      value={giaForm.gioBatDau.split(':')[1] || '00'}
                      onChange={(e) => {
                        const m = e.target.value.padStart(2, '0')
                        const h = giaForm.gioBatDau.split(':')[0] || '18'
                        setGiaForm({ ...giaForm, gioBatDau: `${h}:${m}` })
                      }}
                    >
                      {['00', '15', '30', '45'].map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="field-group">
                  <label>Giờ kết thúc (HH:mm)</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <select
                      value={giaForm.gioKetThuc.split(':')[0] || '19'}
                      onChange={(e) => {
                        const h = e.target.value.padStart(2, '0')
                        const m = giaForm.gioKetThuc.split(':')[1] || '00'
                        setGiaForm({ ...giaForm, gioKetThuc: `${h}:${m}` })
                      }}
                    >
                      {Array.from({ length: 24 }).map((_, i) => {
                        const v = String(i).padStart(2, '0')
                        return (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        )
                      })}
                    </select>
                    <select
                      value={giaForm.gioKetThuc.split(':')[1] || '00'}
                      onChange={(e) => {
                        const m = e.target.value.padStart(2, '0')
                        const h = giaForm.gioKetThuc.split(':')[0] || '19'
                        setGiaForm({ ...giaForm, gioKetThuc: `${h}:${m}` })
                      }}
                    >
                      {['00', '15', '30', '45'].map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="field-group">
                  <label>Giá (VND)</label>
                  <input
                    type="text"
                    value={
                      giaForm.giaTien
                        ? giaForm.giaTien.toLocaleString('vi-VN')
                        : ''
                    }
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d]/g, '')
                      const num = raw ? Number(raw) : 0
                      setGiaForm({
                        ...giaForm,
                        giaTien: num,
                      })
                    }}
                    placeholder="200.000"
                  />
                </div>
                <div className="field-group">
                  <label>&nbsp;</label>
                  <button className="btn-primary" onClick={createGia}>
                    Thêm khung giá
                  </button>
                </div>
              </div>

              <h4 style={{ margin: '8px 0 4px' }}>Giá theo khung giờ</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Khung giờ</th>
                    <th>Giá</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedSan.giaTiens || []).map((g) => (
                    <tr key={g.id}>
                      <td>{g.id}</td>
                      <td>
                        {g.gioBatDau} - {g.gioKetThuc}
                      </td>
                      <td>{g.giaTien?.toLocaleString?.('vi-VN')} đ</td>
                      <td>
                        <button
                          className="btn-ghost"
                          onClick={() => deleteGia(g.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(selectedSan.giaTiens || []).length === 0 && (
                <p className="muted">
                  Chưa có bảng giá nào cho sân này. Thêm khung giá mới ở trên.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {showCreatePopup && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
          onClick={() => setShowCreatePopup(false)}
        >
          <div
            className="card"
            style={{
              maxWidth: 680,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header">
              <div>
                <div className="card-title">Tạo sân bóng mới</div>
                <div className="card-subtitle">
                  Nhập thông tin sân bóng cần tạo.
                </div>
              </div>
              <button
                className="btn-ghost"
                type="button"
                onClick={() => setShowCreatePopup(false)}
              >
                Đóng
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="field-group">
                <label>Số người</label>
                <select
                  value={sanForm.soNguoi}
                  onChange={(e) =>
                    setSanForm({ ...sanForm, soNguoi: Number(e.target.value) })
                  }
                >
                  <option value={5}>5 người</option>
                  <option value={7}>7 người</option>
                  <option value={10}>10 người</option>
                  <option value={11}>11 người</option>
                </select>
              </div>

              <div className="field-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={sanForm.baoTri}
                    onChange={(e) =>
                      setSanForm({ ...sanForm, baoTri: e.target.checked })
                    }
                  />
                  Đang bảo trì
                </label>
              </div>

              <div>
                <h4 style={{ margin: '0 0 8px' }}>Hình ảnh sân (tùy chọn)</h4>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {createImages.map((file, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt=""
                        style={{
                          width: 96,
                          height: 64,
                          objectFit: 'cover',
                          borderRadius: 8,
                          border: '1px solid #e5e7eb',
                        }}
                      />
                      <button
                        type="button"
                        className="btn-ghost"
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          padding: '0 6px',
                          fontSize: 10,
                        }}
                        onClick={() => {
                          setCreateImages(createImages.filter((_, i) => i !== idx))
                        }}
                      >
                        X
                      </button>
                    </div>
                  ))}
                  <label
                    className="btn-ghost"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    Thêm ảnh
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || [])
                        setCreateImages([...createImages, ...files])
                        e.target.value = ''
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 8px' }}>Giá theo khung giờ (tùy chọn)</h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr) 1.2fr',
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <div className="field-group">
                    <label>Giờ bắt đầu</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <select
                        value={createGiaForm.gioBatDau.split(':')[0] || '18'}
                        onChange={(e) => {
                          const h = e.target.value.padStart(2, '0')
                          const m = createGiaForm.gioBatDau.split(':')[1] || '00'
                          setCreateGiaForm({ ...createGiaForm, gioBatDau: `${h}:${m}` })
                        }}
                      >
                        {Array.from({ length: 24 }).map((_, i) => {
                          const v = String(i).padStart(2, '0')
                          return (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          )
                        })}
                      </select>
                      <select
                        value={createGiaForm.gioBatDau.split(':')[1] || '00'}
                        onChange={(e) => {
                          const m = e.target.value.padStart(2, '0')
                          const h = createGiaForm.gioBatDau.split(':')[0] || '18'
                          setCreateGiaForm({ ...createGiaForm, gioBatDau: `${h}:${m}` })
                        }}
                      >
                        {['00', '15', '30', '45'].map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="field-group">
                    <label>Giờ kết thúc</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <select
                        value={createGiaForm.gioKetThuc.split(':')[0] || '19'}
                        onChange={(e) => {
                          const h = e.target.value.padStart(2, '0')
                          const m = createGiaForm.gioKetThuc.split(':')[1] || '00'
                          setCreateGiaForm({ ...createGiaForm, gioKetThuc: `${h}:${m}` })
                        }}
                      >
                        {Array.from({ length: 24 }).map((_, i) => {
                          const v = String(i).padStart(2, '0')
                          return (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          )
                        })}
                      </select>
                      <select
                        value={createGiaForm.gioKetThuc.split(':')[1] || '00'}
                        onChange={(e) => {
                          const m = e.target.value.padStart(2, '0')
                          const h = createGiaForm.gioKetThuc.split(':')[0] || '19'
                          setCreateGiaForm({ ...createGiaForm, gioKetThuc: `${h}:${m}` })
                        }}
                      >
                        {['00', '15', '30', '45'].map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="field-group">
                    <label>Giá (VND)</label>
                    <input
                      type="text"
                      value={
                        createGiaForm.giaTien
                          ? createGiaForm.giaTien.toLocaleString('vi-VN')
                          : ''
                      }
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^\d]/g, '')
                        const num = raw ? Number(raw) : 0
                        setCreateGiaForm({
                          ...createGiaForm,
                          giaTien: num,
                        })
                      }}
                      placeholder="200.000"
                    />
                  </div>
                  <div className="field-group">
                    <label>&nbsp;</label>
                    <button
                      className="btn-primary"
                      onClick={() => {
                        if (createGiaForm.giaTien > 0) {
                          setCreateGiaList([...createGiaList, { ...createGiaForm }])
                          setCreateGiaForm({
                            gioBatDau: '18:00',
                            gioKetThuc: '19:00',
                            giaTien: 0,
                          })
                        }
                      }}
                    >
                      Thêm
                    </button>
                  </div>
                </div>

                {createGiaList.length > 0 && (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Khung giờ</th>
                        <th>Giá</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {createGiaList.map((g, idx) => (
                        <tr key={idx}>
                          <td>
                            {g.gioBatDau} - {g.gioKetThuc}
                          </td>
                          <td>{g.giaTien?.toLocaleString?.('vi-VN')} đ</td>
                          <td>
                            <button
                              className="btn-ghost"
                              onClick={() => {
                                setCreateGiaList(createGiaList.filter((_, i) => i !== idx))
                              }}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  className="btn-ghost"
                  onClick={() => {
                    setShowCreatePopup(false)
                    setSanForm({ soNguoi: 10, baoTri: false })
                    setCreateImages([])
                    setCreateGiaList([])
                    setCreateGiaForm({
                      gioBatDau: '18:00',
                      gioKetThuc: '19:00',
                      giaTien: 0,
                    })
                  }}
                >
                  Hủy
                </button>
                <button className="btn-primary" onClick={createSan}>
                  Tạo sân
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SanGiaPage

