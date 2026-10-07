import { useCallback, useState } from 'react'
import { auditorService } from '../services/auditorService.js'

export function useAuditorController() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const previewSource = useCallback(async (source) => {
    setIsSubmitting(true)
    setError('')
    try {
      return await auditorService.previewSource(source)
    } catch (requestError) {
      setError(requestError.message || 'Unable to scan this source.')
      return null
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  const applyApprovedRepairs = useCallback(async (payload) => {
    setIsSubmitting(true)
    setError('')
    try {
      return await auditorService.applyApprovedRepairs(payload)
    } catch (requestError) {
      setError(requestError.message || 'Unable to apply approved repairs.')
      return null
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  const submitRepair = useCallback(async (source) => {
    setIsSubmitting(true)
    setError('')
    try {
      return source.type === 'url'
        ? await auditorService.repairSite(source.value)
        : await auditorService.repairCode(source.value)
    } catch (requestError) {
      setError(requestError.message || 'Unable to repair this code.')
      return null
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return { isSubmitting, error, previewSource, applyApprovedRepairs, submitRepair }
}
