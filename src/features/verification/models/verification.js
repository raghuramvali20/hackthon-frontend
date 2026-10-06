export function normalizeCertificate(certificate) {
  if (!certificate || typeof certificate !== 'object') return null
  return {
    ...certificate,
    checksPerformed: Array.isArray(certificate.checksPerformed) ? certificate.checksPerformed : [],
    theoremProofs: Array.isArray(certificate.theoremProofs) ? certificate.theoremProofs : [],
  }
}
