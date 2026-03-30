import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { apiFetch, UNITS, LABEL, OPERATIONS } from '../utils/api.js'
import { showToast } from '../components/Toast.jsx'
import HistoryModal from '../components/HistoryModal.jsx'

/* ══════════════════════════════════
   TYPE CARD SVGs
══════════════════════════════════ */
const TypeSvgs = {
  LengthUnit: (
    <svg viewBox="0 0 42 70" fill="none" style={{ width: 42, height: 56 }}>
      <rect x="11" y="2" width="20" height="66" rx="4"
        fill="#e2e8f0" stroke="#2dd4bf" strokeWidth="2.5"/>
      <line x1="11" y1="14" x2="19" y2="14" stroke="#0d9488" strokeWidth="2" strokeLinecap="round"/>
      <line x1="11" y1="24" x2="23" y2="24" stroke="#0d9488" strokeWidth="2" strokeLinecap="round"/>
      <line x1="11" y1="34" x2="19" y2="34" stroke="#0d9488" strokeWidth="2" strokeLinecap="round"/>
      <line x1="11" y1="44" x2="23" y2="44" stroke="#0d9488" strokeWidth="2" strokeLinecap="round"/>
      <line x1="11" y1="54" x2="19" y2="54" stroke="#0d9488" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  TemperatureUnit: (
    <svg viewBox="0 0 42 70" fill="none" style={{ width: 42, height: 56 }}>
      <rect x="15" y="4" width="12" height="46" rx="6" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2"/>
      <circle cx="21" cy="58" r="10" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2"/>
      <rect x="18" y="32" width="6" height="18" rx="3" fill="#94a3b8"/>
      <circle cx="21" cy="58" r="6" fill="#94a3b8"/>
    </svg>
  ),
  VolumeUnit: (
    <svg viewBox="0 0 42 70" fill="none" style={{ width: 42, height: 56 }}>
      <rect x="13" y="4" width="16" height="8" rx="2" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2"/>
      <path d="M13 12 L7 58 Q7 66 21 66 Q35 66 35 58 L29 12 Z" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2"/>
      <path d="M9 42 Q21 38 33 42 L35 56 Q35 64 21 64 Q7 64 7 56 Z" fill="#94a3b8" opacity=".3"/>
    </svg>
  ),
  WeightUnit: (
    <svg viewBox="0 0 42 70" fill="none" style={{ width: 42, height: 56 }}>
      <ellipse cx="21" cy="58" rx="15" ry="6" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2"/>
      <rect x="18" y="30" width="6" height="28" fill="#94a3b8" opacity=".3"/>
      <circle cx="21" cy="22" r="14" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2"/>
      <text x="21" y="26" textAnchor="middle" fontSize="10" fill="#94a3b8"
        fontFamily="sans-serif" fontWeight="700">kg</text>
    </svg>
  ),
}

const TYPES = [
  { key: 'LengthUnit',      label: 'Length'      },
  { key: 'TemperatureUnit', label: 'Temperature' },
  { key: 'VolumeUnit',      label: 'Volume'      },
  { key: 'WeightUnit',      label: 'Weight'      },
]

const TEMP_NO_ARITH = ['add', 'subtract', 'divide']

/* ══════════════════════════════════
   UNIT DROPDOWN
══════════════════════════════════ */
function UnitDropdown({ curType, value, onChange, disabledValue, label }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.13em',
        textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 8 }}>
        {label}
      </span>
      <button onClick={() => setOpen(v => !v)} style={{
        width: '100%', height: 42, background: '#f8fafc',
        border: `1.5px solid ${open ? '#2dd4bf' : '#e2e8f0'}`, borderRadius: 8,
        padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        cursor: 'pointer', fontSize: 14, color: '#1e293b', fontFamily: 'DM Sans, sans-serif',
        transition: 'border-color .2s',
      }}>
        <span>{LABEL[value] || value}</span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10,
          boxShadow: '0 8px 28px rgba(0,0,0,.13)', zIndex: 50,
          maxHeight: 224, overflowY: 'auto',
          animation: 'ddIn .16s ease',
        }}>
          <style>{`@keyframes ddIn{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}`}</style>
          {UNITS[curType].map(u => {
            const isSelected = u === value
            const isDisabled = u === disabledValue
            return (
              <div key={u} onClick={() => { if (!isDisabled) { onChange(u); setOpen(false) } }}
                style={{
                  padding: '10px 14px', fontSize: 13.5, cursor: isDisabled ? 'default' : 'pointer',
                  color: isDisabled ? '#cbd5e1' : isSelected ? '#0d9488' : '#1e293b',
                  background: isSelected ? '#ccfbf1' : 'transparent',
                  fontWeight: isSelected ? 500 : 400,
                  transition: 'background .12s',
                }}
                onMouseEnter={e => { if (!isDisabled && !isSelected) e.currentTarget.style.background = '#f0fdfa' }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}>
                {LABEL[u] || u}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════
   RESULT BOX
══════════════════════════════════ */
function ResultBox({ result }) {
  if (!result) return null
  return (
    <div style={{
      marginTop: 20, padding: '18px 22px', borderRadius: 12,
      background: result.isErr ? '#fef2f2' : '#f0fdfa',
      border: `1.5px solid ${result.isErr ? '#fca5a5' : '#99f6e4'}`,
      animation: 'resIn .28s ease',
    }}>
      <style>{`@keyframes resIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{
        fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase',
        color: result.isErr ? '#ef4444' : '#0d9488', marginBottom: 6,
      }}>{result.isErr ? 'Error' : 'Result'}</div>
      <div style={{
        fontSize: result.isErr ? 14.5 : 30, fontWeight: result.isErr ? 400 : 300,
        color: result.isErr ? '#ef4444' : '#0d9488',
      }}>{result.value}</div>
      {result.meta && <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 5 }}>{result.meta}</div>}
    </div>
  )
}

/* ══════════════════════════════════
   APP PAGE
══════════════════════════════════ */
export default function AppPage() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()

  // Capture OAuth2 ?token= from URL after social login
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')
    if (urlToken) {
      localStorage.setItem('qm_token', urlToken)
      history.replaceState({}, document.title, window.location.pathname)
      window.location.reload()
    }
  }, [])

  const [curType, setCurType]     = useState('LengthUnit')
  const [curOp, setCurOp]         = useState('convert')
  const [fromUnit, setFromUnit]   = useState('FEET')
  const [toUnit, setToUnit]       = useState('INCHES')
  const [fromVal, setFromVal]     = useState('1')
  const [toVal, setToVal]         = useState('')
  const [result, setResult]       = useState(null)
  const [loading, setLoading]     = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // Reset units when type changes
  function pickType(typeKey) {
    const units = UNITS[typeKey]
    setCurType(typeKey)
    setFromUnit(units[0])
    setToUnit(units.length > 1 ? units[1] : units[0])
    setResult(null)
    setToVal('')
  }

  function pickOp(opKey) {
    if (curType === 'TemperatureUnit' && TEMP_NO_ARITH.includes(opKey)) {
      showToast('Temperature does not support arithmetic operations', 'err')
      return
    }
    setCurOp(opKey)
    setResult(null)
  }

  function swapUnits() {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    setResult(null)
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  async function doOperation() {
    const fv = parseFloat(fromVal)
    const tv = parseFloat(toVal)
    const needTo = ['compare', 'add', 'subtract', 'divide'].includes(curOp)

    if (isNaN(fv)) { showToast('Please enter a number in the FROM field', 'err'); return }
    if (needTo && isNaN(tv)) { showToast('Please enter a number in the TO / With field', 'err'); return }
    if (curType === 'TemperatureUnit' && TEMP_NO_ARITH.includes(curOp)) {
      showToast('Temperature does not support arithmetic operations', 'err'); return
    }

    setLoading(true)
    setResult(null)

    const thisQ = { value: fv, unit: fromUnit, measurementType: curType }
    const thatQ = { value: curOp === 'convert' ? fv : tv, unit: toUnit, measurementType: curType }

    const endpoint = OPERATIONS.find(o => o.key === curOp)?.endpoint

    try {
      const { ok, status, data } = await apiFetch(endpoint, {
        method: 'POST',
        body: { thisQuantityDTO: thisQ, thatQuantityDTO: thatQ },
        token,
      })

      if (status === 401 || status === 403) { handleLogout(); return }

      if (!ok) {
        const msg = typeof data === 'string' ? data : (data.message || 'Server error')
        setResult({ isErr: true, value: msg, meta: '' })
        return
      }
      if (data.error === true || data.errorMessage) {
        setResult({ isErr: true, value: data.errorMessage || 'An error occurred', meta: '' })
        return
      }

      // Build result display
      let value = '', meta = ''
      const fromLabel = LABEL[fromUnit] || fromUnit
      const toLabel   = LABEL[toUnit]   || toUnit

      if (curOp === 'convert') {
        const rv = data.resultValue ?? '?'
        const ru = LABEL[data.resultUnit] || data.resultUnit || toLabel
        value = `${rv} ${ru}`
        meta  = `${fv} ${fromLabel} → ${toLabel}`
        setToVal(String(rv))
      } else if (curOp === 'compare') {
        const eq = data.resultString === 'true'
        value = eq ? '✓  Equal' : '✗  Not Equal'
        meta  = `${fv} ${fromLabel}  vs  ${tv} ${toLabel}`
      } else {
        const rv = data.resultValue ?? '?'
        const ru = LABEL[data.resultUnit] || data.resultUnit || ''
        value = `${rv}${ru ? ' ' + ru : ''}`
        const sym = { add: '+', subtract: '−', divide: '÷' }[curOp] || curOp
        meta  = `${fv} ${fromLabel} ${sym} ${tv} ${toLabel}`
      }

      setResult({ isErr: false, value, meta })
    } catch {
      setResult({ isErr: true, value: 'Cannot reach the backend. Make sure Spring Boot is running (mvn spring-boot:run).', meta: '' })
    } finally {
      setLoading(false)
    }
  }

  const opLabel = OPERATIONS.find(o => o.key === curOp)?.label || 'Go'
  const toColLabel = curOp === 'compare' ? 'With' : 'To'

  return (
    <div>
      {/* Header */}
      <header style={{
        background: '#3b5bdb', color: '#fff', height: 56,
        padding: '0 36px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 12px rgba(59,91,219,.3)',
      }}>
        <span style={{ fontSize: 19, fontWeight: 500, letterSpacing: '.01em' }}>
          Quantity Measurement
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {user && <span style={{ fontSize: 13, opacity: .82 }}>{user}</span>}
          <button onClick={handleLogout} style={{
            background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.3)',
            color: '#fff', padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
          }}>Logout</button>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '36px 20px' }}>

        {/* Type chooser */}
        <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.16em',
          textTransform: 'uppercase', color: '#64748b', marginBottom: 14 }}>
          Choose Type
        </p>
        <div style={{ display: 'flex', gap: 14, marginBottom: 32, flexWrap: 'wrap' }}>
          {TYPES.map(({ key, label }) => (
            <div key={key} onClick={() => pickType(key)} style={{
              flex: 1, minWidth: 128, maxWidth: 185,
              background: curType === key ? '#f0fdfa' : '#fff',
              border: `2px solid ${curType === key ? '#0d9488' : '#e2e8f0'}`,
              borderRadius: 14, padding: '22px 12px 18px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
              cursor: 'pointer', transition: 'border-color .2s, box-shadow .2s, transform .15s',
              boxShadow: curType === key ? '0 4px 14px rgba(13,148,136,.18)' : 'none',
              userSelect: 'none',
            }}
            onMouseEnter={e => { if (curType !== key) e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}>
              {TypeSvgs[key]}
              <span style={{
                fontSize: 14.5, fontWeight: curType === key ? 600 : 500,
                color: curType === key ? '#0d9488' : '#64748b',
              }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Operation tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {OPERATIONS.map(({ key, label }) => (
            <button key={key} onClick={() => pickOp(key)} style={{
              padding: '8px 18px', borderRadius: 100,
              border: `1.5px solid ${curOp === key ? '#0d9488' : '#e2e8f0'}`,
              background: curOp === key ? '#0d9488' : '#fff',
              color: curOp === key ? '#fff' : '#64748b',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', transition: 'all .2s',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Converter box */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: '28px 26px',
          boxShadow: '0 2px 14px rgba(0,0,0,.07)',
        }}>
          {/* Unit row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 56px 1fr',
            gap: 16, alignItems: 'start', marginBottom: 22,
          }}>
            {/* FROM */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <UnitDropdown curType={curType} value={fromUnit}
                onChange={u => { setFromUnit(u); setResult(null) }}
                disabledValue={toUnit} label="From" />
              <input
                type="number" value={fromVal} step="any" min="0"
                onChange={e => { setFromVal(e.target.value); setResult(null) }}
                style={{
                  fontSize: 34, fontWeight: 300, border: 'none',
                  borderBottom: '2px solid #e2e8f0', padding: '6px 0',
                  width: '100%', outline: 'none', color: '#1e293b',
                  background: 'transparent', fontFamily: 'DM Sans, sans-serif',
                  MozAppearance: 'textfield',
                }}
              />
            </div>

            {/* SWAP */}
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 8, justifyContent: 'center' }}>
              <button onClick={swapUnits} title="Swap units" style={{
                width: 38, height: 38, borderRadius: '50%',
                background: '#f0fdfa', border: '1.5px solid #2dd4bf',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#0d9488', transition: 'all .28s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#2dd4bf'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'rotate(180deg)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f0fdfa'; e.currentTarget.style.color = '#0d9488'; e.currentTarget.style.transform = 'none' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="17 1 21 5 17 9"/>
                  <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                  <polyline points="7 23 3 19 7 15"/>
                  <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                </svg>
              </button>
            </div>

            {/* TO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <UnitDropdown curType={curType} value={toUnit}
                onChange={u => { setToUnit(u); setResult(null) }}
                disabledValue={curOp !== 'compare' ? fromUnit : null}
                label={toColLabel} />
              <input
                type="number" value={toVal} step="any" min="0"
                placeholder="—"
                onChange={e => { setToVal(e.target.value); setResult(null) }}
                style={{
                  fontSize: 34, fontWeight: 300, border: 'none',
                  borderBottom: '2px solid #e2e8f0', padding: '6px 0',
                  width: '100%', outline: 'none', color: '#1e293b',
                  background: 'transparent', fontFamily: 'DM Sans, sans-serif',
                  MozAppearance: 'textfield',
                }}
              />
            </div>
          </div>

          {/* Action row */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={doOperation} disabled={loading} style={{
              flex: 1, height: 50, background: loading ? '#94a3b8' : '#0d9488',
              color: '#fff', border: 'none', borderRadius: 10,
              fontSize: 15, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '.02em', fontFamily: 'DM Sans, sans-serif',
              transition: 'box-shadow .2s',
            }}>
              {loading
                ? <><span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .65s linear infinite', verticalAlign: 'middle', marginRight: 7 }}/> Processing…</>
                : opLabel
              }
            </button>
            <button onClick={() => setShowHistory(true)} style={{
              height: 50, padding: '0 18px',
              background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10,
              fontSize: 13.5, fontWeight: 500, color: '#64748b', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap', transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#2dd4bf'; e.currentTarget.style.color = '#0d9488' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b' }}>
              History
            </button>
          </div>

          <ResultBox result={result} />
        </div>
      </main>

      {showHistory && (
        <HistoryModal curType={curType} onClose={() => setShowHistory(false)} />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none }
        input[type=number] { -moz-appearance: textfield }
      `}</style>
    </div>
  )
}
