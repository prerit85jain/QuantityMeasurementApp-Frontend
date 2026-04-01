// In production set VITE_API_BASE_URL to your Railway backend URL.
// In development leave it unset so Vite proxies /api, /auth, /oauth2 and /login.
const rawBase = (import.meta.env.VITE_API_BASE_URL || '').trim()

function stripTrailingSlash(value) {
  return value.replace(/\/+$/, '')
}

function withLeadingSlash(path) {
  return path.startsWith('/') ? path : `/${path}`
}

export const API_BASE_URL = rawBase ? stripTrailingSlash(rawBase) : ''

export function buildApiUrl(path) {
  return API_BASE_URL + withLeadingSlash(path)
}

export function buildBackendUrl(path) {
  return API_BASE_URL
    ? buildApiUrl(path)
    : withLeadingSlash(path)
}

export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = 'Bearer ' + token

  const res = await fetch(buildApiUrl(path), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const ct = res.headers.get('Content-Type') || ''
  const data = ct.includes('application/json') ? await res.json() : await res.text()

  return { ok: res.ok, status: res.status, data }
}

export const UNITS = {
  LengthUnit: ['FEET', 'INCHES', 'YARDS', 'CENTIMETERS'],
  TemperatureUnit: ['CELSIUS', 'FAHRENHEIT', 'KELVIN'],
  VolumeUnit: ['LITRE', 'MILLILITRE', 'GALLON'],
  WeightUnit: ['MILLIGRAM', 'GRAM', 'KILOGRAM', 'POUND', 'TONNE'],
}

export const LABEL = {
  FEET: 'Feet', INCHES: 'Inches', YARDS: 'Yards', CENTIMETERS: 'Centimetres',
  CELSIUS: 'Celsius', FAHRENHEIT: 'Fahrenheit', KELVIN: 'Kelvin',
  LITRE: 'Litre', MILLILITRE: 'Millilitre', GALLON: 'Gallon',
  MILLIGRAM: 'Milligram', GRAM: 'Gram', KILOGRAM: 'Kilogram',
  POUND: 'Pound', TONNE: 'Tonne',
}

export const OPERATIONS = [
  { key: 'convert', label: 'Convert', endpoint: '/api/v1/quantities/convert' },
  { key: 'compare', label: 'Compare', endpoint: '/api/v1/quantities/compare' },
  { key: 'add', label: 'Add', endpoint: '/api/v1/quantities/add' },
  { key: 'subtract', label: 'Subtract', endpoint: '/api/v1/quantities/subtract' },
  { key: 'divide', label: 'Divide', endpoint: '/api/v1/quantities/divide' },
]
