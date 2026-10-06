import { useCallback, useState } from 'react'
import { auditorService } from '../services/auditorService.js'

export function useAuditorController() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const submitRepair = useCallback(async (rawCode) => {
    setIsSubmitting(true)
    setError('')
    try {
      return await auditorService.repairCode(rawCode)
    } catch (requestError) {
      setError(requestError.message || 'Unable to repair this code.')
      return null
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return { isSubmitting, error, submitRepair }
}
