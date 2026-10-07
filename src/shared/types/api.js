export function unwrapData(response, key) {
  if (!response || response.success !== true) {
    throw new Error(response?.message || 'The server returned an invalid response.')
  }
  return key ? response[key] : response
}

export function normalizeReport(report) {
  const legacyVerification = !report.verification && report.formalCertificate
    ? {
        schemaVersion: 0,
        verificationStatus: 'LEGACY_UNVERIFIED',
        scope: 'Legacy report format; previous verification claims were not independently verified.',
        checksPerformed: [],
        findings: [],
        issueCounts: null,
        reportHash: null,
        legacyStatus: report.formalCertificate.verificationStatus || 'UNKNOWN',
      }
    : null

  return {
    ...report,
    id: String(report.id || report._id || ''),
    sourceType: report.sourceType === 'url' ? 'url' : 'html',
    sourceUrl: typeof report.sourceUrl === 'string' ? report.sourceUrl : '',
    appliedFixes: Array.isArray(report.appliedFixes) ? report.appliedFixes : [],
    findings: Array.isArray(report.findings) ? report.findings : [],
    aiSuggestions: Array.isArray(report.aiSuggestions) ? report.aiSuggestions : [],
    aiChanges: Array.isArray(report.aiChanges) ? report.aiChanges : [],
    aiRepairStatus: report.aiRepairStatus || 'NOT_NEEDED',
    aiRepairMessage: report.aiRepairMessage || '',
    verification: report.verification || legacyVerification,
  }
}
