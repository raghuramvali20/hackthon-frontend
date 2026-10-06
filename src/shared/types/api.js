export function unwrapData(response, key) {
  if (!response || response.success !== true) {
    throw new Error(response?.message || 'The server returned an invalid response.')
  }
  return key ? response[key] : response
}

export function normalizeReport(report) {
  return {
    ...report,
    id: String(report.id || report._id || ''),
    appliedFixes: Array.isArray(report.appliedFixes) ? report.appliedFixes : [],
    formalCertificate: report.formalCertificate || null,
  }
}
