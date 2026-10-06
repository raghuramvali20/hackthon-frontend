import { statusStyles } from '../styles/theme.js'

export function Badge({ children, status, className = '' }) {
  const label = children || status || 'UNVERIFIED'
  const style = statusStyles[status || label] || statusStyles.UNVERIFIED

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${style} ${className}`}
    >
      {String(label).replaceAll('_', ' ')}
    </span>
  )
}
