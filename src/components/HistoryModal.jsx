import { useEffect, useState } from 'react'
import { apiFetch, LABEL } from '../utils/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const s = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,.42)', backdropFilter: 'blur(4px)',
    zIndex: 200, display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: 20,
    animation: 'fadeIn .2s ease',
  },
  modal: {
    background: '#fff', borderRadius: 16,
    width: '100%', maxWidth: 540, maxHeight: '78vh',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 20px 55px rgba(0,0,0,.22)',
    animation: 'modalIn .28s cubic-bezier(.34,1.56,.64,1)',
  },
  head: {
    padding: '18px 22px', borderBottom: '1px solid #e2e8f0',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  title: { fontSize: 16, fontWeight: 600 },
  closeBtn: {
    width: 30, height: 30, borderRadius: '50%', border: 'none',
    background: '#f1f5f9', cursor: 'pointer', fontSize: 17, color: '#64748b',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  body: { padding: '14px 22px', overflowY: 'auto', flex: 1 },
  item: { padding: '13px 0', borderBottom: '1px solid #e2e8f0' },
  op: { fontSize: 10.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#0d9488' },
  detail: { fontSize: 13.5, color: '#1e293b', marginTop: 3 },
  result: { fontSize: 12.5, color: '#64748b', marginTop: 2 },
  empty: { textAlign: 'center', padding: '36px 20px', color: '#64748b', fontSize: 14.5 },
}

export default function HistoryModal({ curType, onClose }) {
  const { token } = useAuth()
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { ok, data } = await apiFetch(
          '/api/v1/quantities/history/type/' + curType, { token }
        )
        if (ok && Array.isArray(data)) setItems([...data].reverse())
        else setItems([])
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [curType, token])

  return (
    <>
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes modalIn {
          from{opacity:0;transform:scale(.93) translateY(18px)}
          to  {opacity:1;transform:scale(1)   translateY(0)}
        }
      `}</style>
      <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
        <div style={s.modal}>
          <div style={s.head}>
            <span style={s.title}>Operation History — {curType.replace('Unit', '')}</span>
            <button style={s.closeBtn} onClick={onClose}>✕</button>
          </div>
          <div style={s.body}>
            {loading ? (
              <div style={s.empty}>Loading…</div>
            ) : items.length === 0 ? (
              <div style={s.empty}>No history found for {curType.replace('Unit', '')}.</div>
            ) : items.map((item, i) => {
              const fu = LABEL[item.thisUnit]   || item.thisUnit   || ''
              const tu = LABEL[item.thatUnit]   || item.thatUnit   || ''
              const ru = LABEL[item.resultUnit] || item.resultUnit || ''
              const resultText = item.error
                ? '⚠ Error: ' + (item.errorMessage || '')
                : 'Result: ' + (item.resultString || ((item.resultValue ?? '') + (ru ? ' ' + ru : '')))
              return (
                <div key={i} style={{ ...s.item, borderBottom: i === items.length - 1 ? 'none' : '1px solid #e2e8f0' }}>
                  <div style={s.op}>{item.operation || 'operation'}</div>
                  <div style={s.detail}>
                    {item.thisValue ?? ''} {fu} ↔ {item.thatValue ?? ''} {tu}
                  </div>
                  <div style={s.result}>{resultText}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
