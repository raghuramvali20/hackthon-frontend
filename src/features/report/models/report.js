export function getReportId(report) {
  return String(report?.id || report?._id || '')
}

export function getImprovement(report) {
  if (report?.scoreBefore == null || report?.scoreAfter == null) return null
  const before = Number(report?.scoreBefore)
  const after = Number(report?.scoreAfter)
  if (!Number.isFinite(before) || !Number.isFinite(after)) return null
  return after - before
}

export function getReportLabel(report) {
  if (report?.sourceType === 'react-jsx') {
    return report.sourceFileName || 'React source scan'
  }
  const readableText = String(report?.originalCode || '')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return readableText
    ? readableText.slice(0, 64)
    : `Accessibility scan · ${getReportId(report).slice(-8)}`
}

export function getVerificationStatus(report) {
  return report?.verification?.verificationStatus || 'LEGACY_UNVERIFIED'
}

export function getIssueCounts(report) {
  return report?.verification?.issueCounts || null
}
