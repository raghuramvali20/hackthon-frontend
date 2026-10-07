import { CodeDiff } from '../../../shared/components/CodeDiff.jsx'

export function SideBySideDiff({ report }) {
  return (
    <CodeDiff
      originalCode={report?.originalCode || ''}
      repairedCode={report?.repairedCode || ''}
      sourceFileName={report?.sourceFileName || ''}
      sourceType={report?.sourceType || 'html'}
    />
  )
}
