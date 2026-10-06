const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')
export const TOKEN_STORAGE_KEY = 'accessibility_engine_token'

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {})
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)

  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (options.body !== undefined && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      body:
        options.body !== undefined && !(options.body instanceof FormData)
          ? JSON.stringify(options.body)
          : options.body,
    })
  } catch (error) {
    throw new ApiError(
      `Could not connect to the API at ${API_BASE_URL}. Check the backend server and network connection.`,
      0,
      { cause: error },
    )
  }

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && data.message
        ? data.message
        : `Request failed with status ${response.status}.`
    throw new ApiError(message, response.status, data)
  }

  return data
}
