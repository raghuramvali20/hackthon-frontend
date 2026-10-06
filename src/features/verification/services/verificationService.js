import { reportService } from '../../report/services/reportService.js'
import { normalizeCertificate } from '../models/verification.js'

export const verificationService = {
  async getCertificate(reportId) {
    const report = await reportService.getReportById(reportId)
    const certificate = normalizeCertificate(report.formalCertificate)
    if (!certificate) throw new Error('This report does not contain a verification certificate.')
    return { report, certificate }
  },

  async verifyPublicHash() {
    throw new Error(
      'Public hash verification is not available: the backend does not currently expose a /api/verify/:hash endpoint.',
    )
  },
}
