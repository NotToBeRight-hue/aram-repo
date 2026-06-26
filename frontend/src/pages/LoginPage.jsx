import { useState } from 'react'
import { login } from '../services/api'

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const result = await login({ username, password })
      if (result.success) {
        onLogin(username)
      } else {
        setError(result.message || 'Unable to login')
      }
    } catch (err) {
      setError(err.message || 'Unable to login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-white px-4 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-10 shadow-xl dark:border-slate-700 dark:bg-slate-900/95">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            ARAM
            </h1>

            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
            District Administrator Portal
            </h2>

            <p className="mt-6 text-slate-600 dark:text-slate-400">
            Secure access reserved for authorized district administrators.
        </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-2xl bg-aramBlue-500 px-4 py-3 text-white transition hover:bg-aramBlue-700 dark:bg-aramBlue-600 dark:hover:bg-aramBlue-700"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-sm text-slate-600 dark:text-slate-400">
            <p>  © 2026 ARAM • Resource Intelligence Platform</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
