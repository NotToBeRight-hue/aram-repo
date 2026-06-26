import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import InventoryPage from './pages/InventoryPage'
import AnalyticsPage from './pages/AnalyticsPage'
import RecommendationPage from './pages/RecommendationPage'
import ApprovalPage from './pages/ApprovalPage'
import Sidebar from './components/Sidebar'

function RequireAuth({ authenticated, children }) {
  return authenticated ? children : <Navigate to="/login" replace />
}

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState('District Administrator')
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      {authenticated && <Sidebar />}
      <main className={`pt-6 pb-10 px-4 md:px-8 ${authenticated ? 'ml-0 md:ml-80' : ''}`}>
          <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => setDarkMode((current) => !current)}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        <Routes>
          <Route
            path="/login"
            element={
              authenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={(name) => { setAuthenticated(true); setUsername(name) }} />
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth authenticated={authenticated}>
                <DashboardPage username={username} />
              </RequireAuth>
            }
          />
          <Route
            path="/inventory"
            element={
              <RequireAuth authenticated={authenticated}>
                <InventoryPage />
              </RequireAuth>
            }
          />
          <Route
            path="/analytics"
            element={
              <RequireAuth authenticated={authenticated}>
                <AnalyticsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/recommendations"
            element={
              <RequireAuth authenticated={authenticated}>
                <RecommendationPage />
              </RequireAuth>
            }
          />
          <Route
            path="/approval"
            element={
              <RequireAuth authenticated={authenticated}>
                <ApprovalPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to={authenticated ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
