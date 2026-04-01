import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { apiFetch, buildBackendUrl } from '../utils/api.js'
import { showToast } from '../components/Toast.jsx'

/* ─── SVG Icons ─── */
const EyeOffIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)
const EyeOnIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
)
const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
)

/* ─── Styles ─── */
const s = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#e2e4ea',
    backgroundImage: 'radial-gradient(circle at 18% 28%,rgba(79,115,223,.22) 0,transparent 52%), radial-gradient(circle at 82% 72%,rgba(185,28,28,.14) 0,transparent 52%)',
  },
  wrap: { display: 'flex', alignItems: 'stretch', filter: 'drop-shadow(0 30px 60px rgba(0,0,0,.22))' },
  brand: {
    width: 260, background: '#fff', borderRadius: '20px 0 0 20px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '40px 28px', gap: 20,
  },
  circle: {
    width: 168, height: 168, borderRadius: '50%',
    background: 'linear-gradient(145deg,#4c6ef5 0%,#74a0f5 50%,#a5c8ff 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  brandTitle: { fontSize: 12, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', textAlign: 'center', color: '#111', lineHeight: 1.6 },
  brandSub: { fontSize: 11, color: '#9ca3af', textAlign: 'center', lineHeight: 1.5 },
  card: {
    width: 430, background: '#fff', borderRadius: '0 20px 20px 0',
    padding: '36px 44px 40px', boxShadow: '6px 0 40px rgba(0,0,0,.12)',
  },
  tabs: { display: 'flex', gap: 30, borderBottom: '1.5px solid #e5e7eb', marginBottom: 26 },
  field: { marginBottom: 15 },
  label: { display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 },
  input: (focus) => ({
    width: '100%', height: 48, border: `1.5px solid ${focus ? '#b91c1c' : '#e5e7eb'}`,
    borderRadius: 8, padding: '0 14px', fontSize: 14, color: '#111', outline: 'none',
    background: '#fff', boxShadow: focus ? '0 0 0 3px rgba(185,28,28,.08)' : 'none',
    transition: 'border-color .2s, box-shadow .2s', fontFamily: 'DM Sans, sans-serif',
  }),
  inputWrap: { position: 'relative' },
  eyeBtn: {
    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af',
    display: 'flex', alignItems: 'center', padding: 4,
  },
  ferr: (show) => ({ fontSize: 11.5, color: '#b91c1c', marginTop: 4, display: show ? 'block' : 'none' }),
  select: {
    width: '100%', height: 48, border: '1.5px solid #e5e7eb', borderRadius: 8,
    padding: '0 14px', fontSize: 14, color: '#111', outline: 'none',
    background: '#fff', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
  },
  submitBtn: (loading) => ({
    width: '100%', height: 48, background: loading ? '#94a3b8' : '#b91c1c', color: '#fff',
    border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
    marginTop: 4, transition: 'background .2s, box-shadow .2s',
    fontFamily: 'DM Sans, sans-serif',
  }),
  divider: { display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 16px' },
  dividerLine: { flex: 1, height: 1, background: '#e5e7eb' },
  dividerText: { fontSize: 12, color: '#9ca3af', fontWeight: 500, letterSpacing: '.05em', whiteSpace: 'nowrap' },
  socialBtn: (hover, dark) => ({
    width: '100%', height: 46, border: `1.5px solid ${hover && dark ? '#111' : '#e5e7eb'}`,
    borderRadius: 8, background: hover ? (dark ? '#111' : '#fafafa') : '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    fontSize: 14, fontWeight: 500, color: hover && dark ? '#fff' : '#374151',
    cursor: 'pointer', transition: 'all .2s', textDecoration: 'none', marginBottom: 10,
    fontFamily: 'DM Sans, sans-serif',
  }),
  socialNote: { fontSize: 11.5, color: '#9ca3af', textAlign: 'center', marginTop: 14, lineHeight: 1.6 },
  noteCode: { fontSize: 10.5, background: '#f3f4f6', padding: '1px 5px', borderRadius: 3 },
  noteLink: { color: '#4c6ef5', textDecoration: 'none' },
}

/* ─── Tab button ─── */
function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', fontFamily: 'DM Sans, sans-serif',
      fontSize: 13.5, fontWeight: active ? 700 : 500, letterSpacing: '.09em',
      textTransform: 'uppercase', color: active ? '#111827' : '#9ca3af',
      cursor: 'pointer', padding: '0 0 14px', position: 'relative',
    }}>
      {children}
      {active && (
        <span style={{
          position: 'absolute', bottom: -1.5, left: 0, width: '100%', height: 2.5,
          background: '#b91c1c', borderRadius: '2px 2px 0 0', display: 'block',
        }} />
      )}
    </button>
  )
}

/* ─── Social button ─── */
function SocialBtn({ href, dark, children }) {
  const [hover, setHover] = useState(false)
  return (
    <a href={href} style={s.socialBtn(hover, dark)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {children}
    </a>
  )
}

/* ─── Password field ─── */
function PasswordField({ id, value, onChange, placeholder, error, errorMsg }) {
  const [show, setShow] = useState(false)
  const [focus, setFocus] = useState(false)
  return (
    <div style={s.field}>
      <label style={s.label} htmlFor={id}>Password</label>
      <div style={s.inputWrap}>
        <input
          id={id} type={show ? 'text' : 'password'}
          value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder || '••••••••'}
          style={{ ...s.input(focus), paddingRight: 48 }}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          autoComplete={id === 's-pass' ? 'new-password' : 'current-password'}
        />
        <button type="button" style={s.eyeBtn} onClick={() => setShow(v => !v)}>
          {show ? <EyeOnIcon /> : <EyeOffIcon />}
        </button>
      </div>
      <div style={s.ferr(error)}>{errorMsg}</div>
    </div>
  )
}

/* ─── Email field ─── */
function EmailField({ id, value, onChange, error }) {
  const [focus, setFocus] = useState(false)
  return (
    <div style={s.field}>
      <label style={s.label} htmlFor={id}>Username / Email</label>
      <input
        id={id} type="email" value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="you@example.com"
        style={s.input(focus)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        autoComplete="email"
      />
      <div style={s.ferr(error)}>Please enter a valid email address</div>
    </div>
  )
}

/* ─── Social buttons block ─── */
function SocialButtons() {
  return (
    <>
      <div style={s.divider}>
        <div style={s.dividerLine} />
        <span style={s.dividerText}>or continue with</span>
        <div style={s.dividerLine} />
      </div>
      <SocialBtn href={buildBackendUrl('/oauth2/authorization/google')} dark={false}>
        <GoogleIcon /> Continue with Google
      </SocialBtn>
      <SocialBtn href={buildBackendUrl('/oauth2/authorization/github')} dark={true}>
        <GitHubIcon /> Continue with GitHub
      </SocialBtn>
      <p style={s.socialNote}>
        Social login requires OAuth2 credentials in{' '}
        <code style={s.noteCode}>application.properties</code>.<br />
        <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" style={s.noteLink}>
          Get Google credentials
        </a>
        {' · '}
        <a href="https://github.com/settings/developers" target="_blank" rel="noreferrer" style={s.noteLink}>
          Get GitHub credentials
        </a>
      </p>
    </>
  )
}

/* ═══════════════════════════════════
   LOGIN FORM
══════════════════════════════════ */
function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [pass, setPass]         = useState('')
  const [errEmail, setErrEmail] = useState(false)
  const [errPass, setErrPass]   = useState(false)
  const [loading, setLoading]   = useState(false)

  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  async function handleLogin() {
    const emailOk = isEmail(email)
    const passOk  = pass.length > 0
    setErrEmail(!emailOk)
    setErrPass(!passOk)
    if (!emailOk || !passOk) return

    setLoading(true)
    try {
      const { ok, data } = await apiFetch('/auth/login', {
        method: 'POST',
        body: { username: email, password: pass },
      })
      if (!ok) throw new Error(typeof data === 'string' ? data : (data.message || 'Invalid credentials'))
      login(data.token, data.username || email)
      showToast('Welcome back! Redirecting…', 'ok')
      navigate('/app')
    } catch (e) {
      showToast(e.message, 'err')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <EmailField id="l-email" value={email} onChange={setEmail} error={errEmail} />
      <PasswordField id="l-pass" value={pass} onChange={setPass}
        error={errPass} errorMsg="Please enter your password" />
      <button style={s.submitBtn(loading)} onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in…' : 'Login'}
      </button>
      <SocialButtons />
    </div>
  )
}

/* ═══════════════════════════════════
   REGISTER FORM
══════════════════════════════════ */
function RegisterForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [pass, setPass]         = useState('')
  const [role, setRole]         = useState('USER')
  const [errEmail, setErrEmail] = useState(false)
  const [errPass, setErrPass]   = useState(false)
  const [loading, setLoading]   = useState(false)

  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  async function handleRegister() {
    const emailOk = isEmail(email)
    const passOk  = pass.length >= 6
    setErrEmail(!emailOk)
    setErrPass(!passOk)
    if (!emailOk || !passOk) return

    setLoading(true)
    try {
      const { ok, data } = await apiFetch('/auth/register', {
        method: 'POST',
        body: { username: email, password: pass, role },
      })
      if (!ok) throw new Error(typeof data === 'string' ? data : (data.message || 'Registration failed'))
      login(data.token, data.username || email)
      showToast('Account created! Redirecting…', 'ok')
      navigate('/app')
    } catch (e) {
      showToast(e.message, 'err')
    } finally {
      setLoading(false)
    }
  }

  const [focusSelect, setFocusSelect] = useState(false)

  return (
    <div>
      <EmailField id="s-email" value={email} onChange={setEmail} error={errEmail} />
      <PasswordField id="s-pass" value={pass} onChange={setPass}
        placeholder="Min. 6 characters"
        error={errPass} errorMsg="Minimum 6 characters required" />
      <div style={s.field}>
        <label style={s.label}>Account Type</label>
        <select value={role} onChange={e => setRole(e.target.value)}
          style={{ ...s.select, borderColor: focusSelect ? '#b91c1c' : '#e5e7eb' }}
          onFocus={() => setFocusSelect(true)} onBlur={() => setFocusSelect(false)}>
          <option value="USER">User (standard access)</option>
          <option value="ADMIN">Admin (full access)</option>
        </select>
      </div>
      <button style={s.submitBtn(loading)} onClick={handleRegister} disabled={loading}>
        {loading ? 'Creating account…' : 'Create Account'}
      </button>
      <SocialButtons />
    </div>
  )
}

/* ═══════════════════════════════════
   BRAND ILLUSTRATION SVG
══════════════════════════════════ */
function BrandSvg() {
  return (
    <svg width="150" height="150" viewBox="0 0 150 150" fill="none">
      <rect x="22" y="60" width="106" height="32" rx="5"
        fill="rgba(255,255,255,.25)" stroke="rgba(255,255,255,.8)" strokeWidth="2"/>
      <line x1="38"  y1="60" x2="38"  y2="76" stroke="rgba(255,255,255,.8)" strokeWidth="1.8"/>
      <line x1="54"  y1="60" x2="54"  y2="70" stroke="rgba(255,255,255,.6)" strokeWidth="1.5"/>
      <line x1="70"  y1="60" x2="70"  y2="76" stroke="rgba(255,255,255,.8)" strokeWidth="1.8"/>
      <line x1="86"  y1="60" x2="86"  y2="70" stroke="rgba(255,255,255,.6)" strokeWidth="1.5"/>
      <line x1="102" y1="60" x2="102" y2="76" stroke="rgba(255,255,255,.8)" strokeWidth="1.8"/>
      <line x1="118" y1="60" x2="118" y2="70" stroke="rgba(255,255,255,.6)" strokeWidth="1.5"/>
      <text x="35"  y="88" fill="rgba(255,255,255,.75)" fontSize="7" textAnchor="middle">1</text>
      <text x="67"  y="88" fill="rgba(255,255,255,.75)" fontSize="7" textAnchor="middle">2</text>
      <text x="99"  y="88" fill="rgba(255,255,255,.75)" fontSize="7" textAnchor="middle">3</text>
      <line x1="75" y1="26" x2="75" y2="58" stroke="rgba(255,255,255,.85)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="44" y1="42" x2="106" y2="42" stroke="rgba(255,255,255,.85)" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M34 42 Q44 50 54 42" stroke="rgba(255,255,255,.75)" strokeWidth="2" fill="none"/>
      <ellipse cx="44" cy="50" rx="10" ry="4" fill="rgba(255,255,255,.3)" stroke="rgba(255,255,255,.7)" strokeWidth="1.5"/>
      <path d="M96 42 Q106 50 116 42" stroke="rgba(255,255,255,.75)" strokeWidth="2" fill="none"/>
      <ellipse cx="106" cy="50" rx="10" ry="4" fill="rgba(255,255,255,.3)" stroke="rgba(255,255,255,.7)" strokeWidth="1.5"/>
      <rect x="38" y="44" width="12" height="9" rx="2" fill="rgba(255,255,255,.7)"/>
      <text x="38"  y="116" fill="rgba(255,255,255,.9)" fontSize="8.5" textAnchor="middle" fontWeight="600">kg</text>
      <text x="75"  y="116" fill="rgba(255,255,255,.9)" fontSize="8.5" textAnchor="middle" fontWeight="600">°C</text>
      <text x="112" y="116" fill="rgba(255,255,255,.9)" fontSize="8.5" textAnchor="middle" fontWeight="600">m</text>
      <circle cx="56" cy="113" r="2" fill="rgba(255,255,255,.4)"/>
      <circle cx="93" cy="113" r="2" fill="rgba(255,255,255,.4)"/>
    </svg>
  )
}

/* ═══════════════════════════════════
   PAGE
══════════════════════════════════ */
export default function LoginPage() {
  const [tab, setTab] = useState('login')

  return (
    <div style={s.page}>
      <div style={s.wrap}>

        {/* Brand */}
        <div style={s.brand}>
          <div style={s.circle}><BrandSvg /></div>
          <p style={s.brandTitle}>Quantity<br/>Measurement</p>
          <p style={s.brandSub}>Convert · Compare<br/>Add · Subtract</p>
        </div>

        {/* Card */}
        <div style={s.card}>
          <div style={s.tabs}>
            <TabBtn active={tab === 'login'}  onClick={() => setTab('login')}>Login</TabBtn>
            <TabBtn active={tab === 'signup'} onClick={() => setTab('signup')}>Register</TabBtn>
          </div>
          {tab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>

      </div>
    </div>
  )
}
