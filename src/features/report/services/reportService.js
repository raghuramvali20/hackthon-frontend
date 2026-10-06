import { apiRequest } from '../../../shared/services/apiClient.js'
import { normalizeReport, unwrapData } from '../../../shared/types/api.js'

export const reportService = {
  async getHistory() {
    const reports = unwrapData(await apiRequest('/repair/history'), 'reports')
    if (!Array.isArray(reports)) throw new Error('The server returned an invalid report history.')
    return reports.map(normalizeReport)
  },

  async getReportById(reportId) {
    const reports = await reportService.getHistory()
    const report = reports.find((item) => item.id === String(reportId))
    if (!report) throw new Error('Report not found in your scan history.')
    return report
  },
}
