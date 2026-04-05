# Design System - Soccer Pro

## 🎨 Overview

Design system hiện đại cho Soccer Pro với phong cách SaaS, bao gồm components tái sử dụng, layout system, và utilities.

## 📦 Components

### Button

```jsx
import { Button } from '@/components/ui'

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>

// With Icon
<Button icon="⚽" iconPosition="left">Đặt sân</Button>
```

### Card

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui'

<Card hover>
  <CardHeader>
    <CardTitle>Tiêu đề</CardTitle>
    <CardDescription>Mô tả ngắn gọn</CardDescription>
  </CardHeader>
  <CardContent>
    Nội dung chính
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Input

```jsx
import { Input, Select, Textarea } from '@/components/ui'

<Input
  label="Tên sân"
  placeholder="Nhập tên sân"
  error="Lỗi validation"
  helperText="Gợi ý nhập liệu"
  icon="🔍"
  iconPosition="left"
  fullWidth
/>

<Select label="Loại sân" fullWidth>
  <option value="5">Sân 5</option>
  <option value="7">Sân 7</option>
</Select>

<Textarea
  label="Ghi chú"
  rows={4}
  fullWidth
/>
```

### Table

```jsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Tên</TableHead>
      <TableHead>Giá</TableHead>
      <TableHead>Hành động</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Sân 1</TableCell>
      <TableCell>200,000đ</TableCell>
      <TableCell>
        <Button size="sm">Sửa</Button>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Modal

```jsx
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui'
import { useModal } from '@/hooks'

const { isOpen, open, close } = useModal()

<Modal isOpen={isOpen} onClose={close} size="md">
  <ModalHeader onClose={close}>
    <ModalTitle>Tiêu đề Modal</ModalTitle>
  </ModalHeader>
  <ModalBody>
    Nội dung modal
  </ModalBody>
  <ModalFooter>
    <Button variant="ghost" onClick={close}>Hủy</Button>
    <Button onClick={handleSubmit}>Xác nhận</Button>
  </ModalFooter>
</Modal>
```

### Badge

```jsx
import { Badge } from '@/components/ui'

<Badge variant="default">Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

### Stats

```jsx
import { StatsCard, StatsGrid } from '@/components/ui'

<StatsGrid>
  <StatsCard
    icon="⚽"
    label="Tổng sân"
    value="24"
    trend="up"
    trendValue="+12%"
    variant="primary"
  />
  <StatsCard
    icon="📋"
    label="Đặt sân hôm nay"
    value="156"
    trend="up"
    trendValue="+8%"
    variant="success"
  />
</StatsGrid>
```

### Loading

```jsx
import { Loading, LoadingOverlay } from '@/components/ui'

// Spinner
<Loading size="sm" />
<Loading size="md" />
<Loading size="lg" />

// Full screen
<Loading fullScreen />

// Overlay
<LoadingOverlay loading={isLoading}>
  <YourContent />
</LoadingOverlay>
```

### EmptyState

```jsx
import { EmptyState } from '@/components/ui'

<EmptyState
  icon="📭"
  title="Chưa có dữ liệu"
  description="Bạn chưa có booking nào. Hãy đặt sân ngay!"
  action={<Button>Đặt sân ngay</Button>}
/>
```

### Toast

```jsx
import { useToast } from '@/hooks'

const { success, error, info, warning } = useToast()

// Usage
success('Thao tác thành công!')
error('Có lỗi xảy ra!')
info('Thông tin quan trọng')
warning('Cảnh báo!')
```

## 🏗️ Layout Components

### Sidebar

```jsx
import { Sidebar } from '@/components/layout'

const items = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/bookings', label: 'Đặt sân', icon: '⚽', badge: '5' },
]

<Sidebar items={items} logo={<YourLogo />} />
```

### Header

```jsx
import { Header } from '@/components/layout'

<Header
  title="Quản lý sân bóng"
  actions={
    <>
      <Badge>User Name</Badge>
      <Button onClick={logout}>Đăng xuất</Button>
    </>
  }
/>
```

### PageContainer

```jsx
import { PageContainer, PageHeader } from '@/components/layout'

<PageContainer maxWidth="lg">
  <PageHeader
    title="Quản lý sân"
    description="Quản lý thông tin các sân bóng"
    actions={<Button>Thêm sân mới</Button>}
  />
  {/* Your content */}
</PageContainer>
```

## 🎣 Custom Hooks

### useModal

```jsx
import { useModal } from '@/hooks'

const { isOpen, open, close, toggle } = useModal()

<Button onClick={open}>Mở Modal</Button>
<Modal isOpen={isOpen} onClose={close}>...</Modal>
```

### useToast

```jsx
import { useToast } from '@/hooks'

const toast = useToast()

// Methods
toast.success('Success message')
toast.error('Error message')
toast.info('Info message')
toast.warning('Warning message')
```

## 🎨 CSS Variables

```css
/* Colors */
--text-primary: #0f172a
--text-secondary: #64748b
--bg-primary: #ffffff
--bg-secondary: #f8fafc
--accent-primary: #22c55e
--success: #22c55e
--error: #ef4444
--warning: #f59e0b
--info: #3b82f6

/* Shadows */
--shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.05)
--shadow-md: 0 4px 6px rgba(15, 23, 42, 0.07)
--shadow-lg: 0 10px 40px rgba(15, 23, 42, 0.1)

/* Spacing */
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px

/* Border Radius */
--radius-sm: 8px
--radius-md: 12px
--radius-lg: 16px
--radius-full: 9999px
```

## 📱 Responsive Design

Tất cả components đều responsive và tối ưu cho mobile:

- Breakpoints: 640px, 768px, 1024px, 1280px
- Mobile-first approach
- Touch-friendly interactions
- Adaptive layouts

## ✨ Best Practices

1. **Sử dụng components thay vì HTML thuần**
   ```jsx
   // ❌ Bad
   <button className="btn-primary">Click</button>
   
   // ✅ Good
   <Button variant="primary">Click</Button>
   ```

2. **Sử dụng layout components**
   ```jsx
   // ✅ Good
   <PageContainer maxWidth="lg">
     <PageHeader title="..." />
     <Card>...</Card>
   </PageContainer>
   ```

3. **Sử dụng hooks cho logic tái sử dụng**
   ```jsx
   const { isOpen, open, close } = useModal()
   const toast = useToast()
   ```

4. **Consistent spacing và sizing**
   ```jsx
   <Button size="md">Medium</Button>
   <Input fullWidth />
   <Badge size="sm">Small</Badge>
   ```

## 🚀 Migration Guide

Để migrate từ code cũ sang design system mới:

1. Import components từ `@/components/ui`
2. Thay thế HTML/CSS thuần bằng components
3. Sử dụng props thay vì inline styles
4. Áp dụng layout components cho structure
5. Sử dụng hooks cho state management

## 📚 Examples

Xem các pages đã được refactor:
- `LoginRegisterPage.jsx` - Auth page với design mới
- Các pages khác sẽ được refactor dần

## 🎯 Next Steps

- [ ] Refactor tất cả pages sang design system mới
- [ ] Thêm dark mode support
- [ ] Thêm animations và transitions
- [ ] Tối ưu performance
- [ ] Thêm accessibility features
