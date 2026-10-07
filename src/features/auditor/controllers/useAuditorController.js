import { useCallback, useState } from 'react'
import { auditorService } from '../services/auditorService.js'

export function useAuditorController() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

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

  return { isSubmitting, error, submitRepair }
}
