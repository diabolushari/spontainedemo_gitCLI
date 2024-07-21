import { showError } from '@/ui/alerts'
import { useCallback, useState } from 'react'
import { router } from '@inertiajs/react'
import { LaravelFlash } from '@/ui/ui_interfaces'

export interface PostOptions {
  showErrorToast?: boolean
  forceFormData?: boolean
  replace?: boolean
  preserveState?: boolean
  preserveScroll?: boolean
  onComplete?: (() => unknown) | null
}

const useInertiaPost = <T,>(url: string, options?: PostOptions) => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const post = useCallback(
    (form: T) => {
      setLoading(true)
      router.post(
        url,
        {
          ...form,
        } as any,
        {
          forceFormData: options?.forceFormData ?? false,
          preserveState: options?.preserveState ?? true,
          preserveScroll: options?.preserveScroll ?? false,
          onFinish: () => {
            setLoading(false)
          },
          onSuccess: (data) => {
            const flash = data.props.flash as LaravelFlash
            setErrors({})
            if (flash.error == null && options?.onComplete != null) {
              options.onComplete()
            }
          },
          onError: (errors) => {
            const keys = Object.keys(errors)
            if (options?.showErrorToast) {
              keys.forEach((key) => {
                showError(errors[key])
              })
            }
            if (keys.length > 0) {
              showError(
                'Data Submitted Is Incomplete/Invalid, Please Try Again After Fixing All Errors.'
              )
            }
            setErrors(errors)
          },
          replace: options?.replace ?? true,
        }
      )
    },
    [
      options?.onComplete,
      url,
      options?.showErrorToast,
      options?.forceFormData,
      options?.replace,
      options?.preserveState,
      options?.preserveScroll,
    ]
  )

  return { post, loading, errors }
}

export default useInertiaPost
