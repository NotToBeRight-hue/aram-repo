const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options)
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || 'API request failed')
  }
  return data
}

export async function login(credentials) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
  return response.json().catch(() => ({}))
}

export async function getInventory() {
  return request('/inventory')
}

export async function addInventory(item) {
  return request('/inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })
}

export async function getDashboardSummary() {
  return request('/dashboard/summary')
}

export async function getSystemStatus() {
  return request('/system-status')
}

export async function postGrievance(issue) {
  return request('/grievance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(issue),
  })
}

export async function getAnalytics() {
  return request('/analytics')
}

export async function getRecommendation() {
  return request('/recommendation')
}

export async function postApproval(decision) {
  return request('/approval', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decision }),
  })
}
