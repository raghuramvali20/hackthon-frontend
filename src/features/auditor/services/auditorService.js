import { apiRequest } from '../../../shared/services/apiClient.js'
import { normalizeReport, unwrapData } from '../../../shared/types/api.js'

export const auditorService = {
  async repairCode(rawCode) {
    const response = await apiRequest('/repair', {
      method: 'POST',
      body: { rawCode },
    })
    return normalizeReport(unwrapData(response, 'report'))
  },
  async repairSite(siteUrl) {
    const response = await apiRequest('/repair', {
      method: 'POST',
      body: { siteUrl },
    })
    return normalizeReport(unwrapData(response, 'report'))
  },
}
