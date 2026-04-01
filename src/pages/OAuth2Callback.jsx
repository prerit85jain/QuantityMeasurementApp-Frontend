import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * OAuth2Callback
 *
 * After a successful Google/GitHub login, the Spring Boot backend redirects to:
 *   <FRONTEND_URL>/oauth2/callback?token=<JWT>
 *
 * This page captures the token, stores it, and navigates to /app.
 */
export default function OAuth2Callback() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token  = params.get('token')
    if (token) {
      login(token, '')
      navigate('/app', { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif', color: '#64748b', fontSize: 16,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#0d9488',
          borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto 16px',
        }} />
        Completing login…
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
