export function getReportId(report) {
  return String(report?.id || report?._id || '')
}

export function getImprovement(report) {
  const before = Number(report?.scoreBefore)
  const after = Number(report?.scoreAfter)
  if (!Number.isFinite(before) || !Number.isFinite(after)) return null
  return after - before
}
