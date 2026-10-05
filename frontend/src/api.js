import { demoSources, runDemoAssistant } from './demoEngine'

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

export async function askAssistant(payload) {
  try {
    const data = await request('/chat', { method: 'POST', body: JSON.stringify(payload) })
    return { ...data, prototype_mode: false }
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 450))
    return runDemoAssistant(payload)
  }
}

export async function getSources() {
  try {
    return await request('/sources')
  } catch {
    return demoSources
  }
}

export function classifyFormulation(description) {
  return request('/classify', { method: 'POST', body: JSON.stringify({ description }) })
}
