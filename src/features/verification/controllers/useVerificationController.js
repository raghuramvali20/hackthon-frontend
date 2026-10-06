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
    verificationService.getCertificate(reportId)
      .then((certificateResult) => {
        if (active) setState({ reportId, result: certificateResult, error: '' })
      })
      .catch((requestError) => {
        if (active) {
          setState({
            reportId,
            result: null,
            error: requestError.message || 'Unable to load certificate.',
          })
        }
      })
    return () => { active = false }
  }, [reportId])

  if (state.reportId !== reportId) {
    return { report: null, certificate: null, error: '', isLoading: true }
  }
  return { ...state.result, error: state.error, isLoading: false }
}
