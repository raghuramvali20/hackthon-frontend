import { Card } from '../../../shared/components/Card.jsx'
import { ScanProgress } from '../components/ScanProgress.jsx'

export function ScanningScreen({ active, error }) {
  if (!active && !error) return null
  return (
    <Card className="mb-4 p-4">
      {error ? (
        <p className="text-sm text-danger" role="alert">{error}</p>
      ) : (
        <ScanProgress active label="Running supported checks and preparing the report…" />
      )}
    </Card>
  )
}
