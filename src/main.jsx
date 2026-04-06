import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './AuthContext'

// Lazy load the heavy App component (Recharts, Framer Motion, SheetJS, etc.)
const App = lazy(() => import('./App.jsx'))

function LoadingFallback() {
  return (
    <div style={{ minHeight: '100vh', background: '#0B0E11', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <img src="/logo.png" alt="Leomars" style={{ width: '64px', height: '64px', borderRadius: '16px', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ color: '#848E9C', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Loading Portfolio...</div>
      <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    </AuthProvider>
  </StrictMode>,
)
