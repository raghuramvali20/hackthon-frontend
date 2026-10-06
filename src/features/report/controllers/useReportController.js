import { useCallback, useEffect, useState } from 'react'
import { reportService } from '../services/reportService.js'

export function useReportController() {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const history = await reportService.getHistory()
      setReports(history)
      return history
    } catch (requestError) {
      setError(requestError.message || 'Unable to load reports.')
      throw requestError
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    reportService.getHistory()
      .then((history) => {
        if (active) setReports(history)
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'Unable to load reports.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => { active = false }
  }, [])

  return { reports, isLoading, error, refresh }
}
