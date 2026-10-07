import { useEffect, useState } from 'react'
import { verificationService } from '../services/verificationService.js'

export function useVerificationController(reportId) {
  const [state, setState] = useState({
    reportId: null,
    result: null,
    error: '',
  })

  useEffect(() => {
    let active = true
    verificationService.getVerification(reportId)
      .then((verificationResult) => {
        if (active) setState({ reportId, result: verificationResult, error: '' })
      })
      .catch((requestError) => {
        if (active) {
          setState({
            reportId,
            result: null,
            error: requestError.message || 'Unable to load report details.',
          })
        }
      })
    return () => { active = false }
  }, [reportId])

  if (state.reportId !== reportId) {
    return { report: null, verification: null, error: '', isLoading: true }
  }
  return { ...state.result, error: state.error, isLoading: false }
}
