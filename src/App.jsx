import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import LoginPage      from './pages/LoginPage.jsx'
import AppPage        from './pages/AppPage.jsx'
import OAuth2Callback from './pages/OAuth2Callback.jsx'
import Toast          from './components/Toast.jsx'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/" replace />
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/app" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <PublicRoute><LoginPage /></PublicRoute>
          } />
          <Route path="/app" element={
            <ProtectedRoute><AppPage /></ProtectedRoute>
          } />
          <Route path="/oauth2/callback" element={<OAuth2Callback />} />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toast />
      </BrowserRouter>
    </AuthProvider>
  )
}
