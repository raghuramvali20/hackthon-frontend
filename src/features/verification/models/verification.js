export function normalizeVerification(verification) {
  if (!verification || typeof verification !== 'object') return null
  return {
    ...verification,
    checksPerformed: Array.isArray(verification.checksPerformed) ? verification.checksPerformed : [],
    findings: Array.isArray(verification.findings) ? verification.findings : [],
    findingsAfter: Array.isArray(verification.findingsAfter) ? verification.findingsAfter : [],
    issueCounts: verification.issueCounts || null,
    reportHash:
      verification.schemaVersion === 1 &&
      /^[a-f0-9]{64}$/i.test(verification.reportHash || '')
        ? verification.reportHash
        : null,
  }
}
