import { reportService } from '../../report/services/reportService.js'
import { normalizeVerification } from '../models/verification.js'

export const verificationService = {
  async getVerification(reportId) {
    const report = await reportService.getReportById(reportId)
    const verification = normalizeVerification(report.verification)
    if (!verification) throw new Error('This report has no supported-check verification data.')
    return { report, verification }
  },

  async verifyPublicHash() {
    throw new Error(
      'Public hash verification is not available: the backend does not currently expose a /api/verify/:hash endpoint.',
    )
  },
}
