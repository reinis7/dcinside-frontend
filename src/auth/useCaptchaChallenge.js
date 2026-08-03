import { useCallback, useEffect, useState } from 'react'
import { firstGraphQLErrorMessage } from '../api/firstGraphQLErrorMessage'
import { fetchCaptchaChallenge } from './registerApi'

export function useCaptchaChallenge() {
  const [challenge, setChallenge] = useState(null)
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const refresh = useCallback(async ({ signal } = {}) => {
    setLoading(true)
    setLoadError('')
    setAnswer('')
    try {
      const next = await fetchCaptchaChallenge({ signal })
      setChallenge(next)
      if (!next?.id) {
        setLoadError('캡차를 불러오지 못했습니다.')
      }
    } catch (err) {
      setChallenge(null)
      setLoadError(firstGraphQLErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    refresh({ signal: controller.signal })
    return () => controller.abort()
  }, [refresh])

  return {
    challenge,
    answer,
    setAnswer,
    loading,
    loadError,
    refresh,
  }
}
