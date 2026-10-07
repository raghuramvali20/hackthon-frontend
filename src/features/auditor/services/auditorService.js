import { apiRequest } from '../../../shared/services/apiClient.js'
import { normalizeReport, unwrapData } from '../../../shared/types/api.js'

export const auditorService = {
  async previewSource(source) {
    const response = await apiRequest('/repair/preview', {
      method: 'POST',
      body: source.type === 'url'
        ? { siteUrl: source.value }
        : { rawCode: source.value },
    })
    return unwrapData(response, 'preview')
  },
  async applyApprovedRepairs(payload) {
    const response = await apiRequest('/repair/apply', {
      method: 'POST',
      body: payload,
    })
    return normalizeReport(unwrapData(response, 'report'))
  },
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
