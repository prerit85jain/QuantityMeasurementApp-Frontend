import { useState, useCallback, useEffect, useRef } from 'react'

const styles = {
  container: {
    position: 'fixed', top: 22, right: 22,
    zIndex: 9999, pointerEvents: 'none',
  },
  toast: (visible, type) => ({
    padding: '13px 20px',
    borderRadius: 10,
    fontSize: 13.5,
    fontWeight: 500,
    color: '#fff',
    maxWidth: 320,
    boxShadow: '0 8px 28px rgba(0,0,0,.2)',
    transform: visible ? 'translateX(0)' : 'translateX(140%)',
    transition: 'transform .35s cubic-bezier(.34,1.56,.64,1)',
    background: type === 'ok' ? '#059669' : type === 'err' ? '#dc2626' : '#3b5bdb',
    marginBottom: 8,
  }),
}

// Singleton toast bus
let _show = null
export function showToast(msg, type = 'info') {
  if (_show) _show(msg, type)
}

export default function Toast() {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  useEffect(() => {
    _show = (msg, type) => {
      const id = ++idRef.current
      setToasts(prev => [...prev, { id, msg, type, visible: false }])
      // Animate in
      setTimeout(() => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: true } : t))
      }, 10)
      // Auto-remove
      setTimeout(() => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: false } : t))
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 400)
      }, 3600)
    }
    return () => { _show = null }
  }, [])

  return (
    <div style={styles.container}>
      {toasts.map(t => (
        <div key={t.id} style={styles.toast(t.visible, t.type)}>{t.msg}</div>
      ))}
    </div>
  )
}
