export function formatTimestamp(value) {
  if (!value) return 'Date unavailable'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Date unavailable'
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function formatScore(value) {
  const score = Number(value)
  return Number.isFinite(score) ? `${Math.round(score)}%` : '—'
}

export function truncateHash(value, visibleCharacters = 8) {
  if (!value || value.length <= visibleCharacters * 2) return value || ''
  return `${value.slice(0, visibleCharacters)}…${value.slice(-visibleCharacters)}`
}

export async function copyToClipboard(value) {
  if (!navigator.clipboard?.writeText) {
    throw new Error('Clipboard access is unavailable in this browser.')
  }
  await navigator.clipboard.writeText(String(value))
}
