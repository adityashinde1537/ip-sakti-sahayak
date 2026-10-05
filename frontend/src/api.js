const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed with status ${response.status}`)
  }
  return response.json()
}

export function askAssistant(payload) {
  return request('/chat', { method: 'POST', body: JSON.stringify(payload) })
}

export function classifyFormulation(description) {
  return request('/classify', { method: 'POST', body: JSON.stringify({ description }) })
}
