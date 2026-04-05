import { useEffect } from 'react'
import './Modal.css'

export function Modal({ isOpen, onClose, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-content modal-${size}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export function ModalHeader({ children, onClose }) {
  return (
    <div className="modal-header">
      <div>{children}</div>
      {onClose && (
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      )}
    </div>
  )
}

export function ModalTitle({ children }) {
  return <h2 className="modal-title">{children}</h2>
}

export function ModalBody({ children }) {
  return <div className="modal-body">{children}</div>
}

export function ModalFooter({ children }) {
  return <div className="modal-footer">{children}</div>
}
