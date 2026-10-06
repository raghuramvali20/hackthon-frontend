import { Badge } from '../../../shared/components/Badge.jsx'

export function CertificateBadge({ status }) {
  return <Badge status={status} className="px-3 py-1.5 text-sm" />
}
