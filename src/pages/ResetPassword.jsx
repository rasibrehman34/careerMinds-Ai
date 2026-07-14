import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import AuthCard from '../components/auth/AuthCard'
import AuthButton from '../components/auth/AuthButton'
import AuthAlert from '../components/auth/AuthAlert'
import PasswordInput from '../components/auth/PasswordInput'
import { supabase } from '../supabase/supabaseClient'
import { updatePassword } from '../services/authService'
import { validateResetPassword } from '../utils/authValidation'

/**
 * ResetPassword page — users land here after clicking the password-reset
 * email link. Supabase embeds the recovery token in the URL hash; the client
 * picks it up automatically and fires an INITIAL_SESSION / PASSWORD_RECOVERY
 * auth event that we listen for.
 */
export default function ResetPassword() {
  const navigate = useNavigate()

  const [ready, setReady] = useState(false)         // true once recovery session is active
  const [invalid, setInvalid] = useState(false)     // true if link is expired / missing

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let settled = false

    // Listen for Supabase to exchange the URL hash token for a recovery session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        settled = true
        setReady(true)
        setInvalid(false)
      }
    })

    // Also check if there's already an active session (e.g. after a page reload)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        settled = true
        setReady(true)
      }
    })

    // If neither fires within 3 s, the link is expired/invalid
    const timer = setTimeout(() => {
      if (!settled) setInvalid(true)
    }, 3000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timer)
    }
  }, [])


  async function handleSubmit(event) {
    event.preventDefault()

    const errors = validateResetPassword({ password, confirmPassword })
    setFieldErrors(errors)
    setFormError('')

    if (Object.keys(errors).length > 0) return

    setLoading(true)

    const { error } = await updatePassword(password)

    setLoading(false)

    if (error) {
      setFormError(error.message)
      return
    }

    setSuccess(true)
    // Redirect to login after 2 seconds so user sees the success message
    setTimeout(() => navigate('/login', { replace: true }), 2000)
  }

  // ── Expired / invalid link ──────────────────────────────────────────────────
  if (invalid && !ready) {
    return (
      <AuthLayout>
        <AuthCard
          title="Link expired"
          description="This password-reset link is invalid or has already been used."
        >
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
            Request a new link from the forgot-password page and try again.
          </p>
          <Link
            to="/forgot-password"
            className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-700 dark:hover:bg-emerald-600 dark:focus:ring-offset-zinc-900 sm:text-base"
          >
            Request new link
          </Link>
          <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
            <Link
              to="/login"
              className="font-semibold text-emerald-800 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              ← Back to Login
            </Link>
          </p>
        </AuthCard>
      </AuthLayout>
    )
  }

  // ── Loading / waiting for Supabase token exchange ───────────────────────────
  if (!ready) {
    return (
      <AuthLayout>
        <AuthCard title="Verifying link…">
          <div className="flex items-center justify-center py-8 gap-3 text-zinc-500 dark:text-zinc-400">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-emerald-600 dark:border-zinc-700 dark:border-t-emerald-400" />
            <span className="text-sm">Please wait…</span>
          </div>
        </AuthCard>
      </AuthLayout>
    )
  }

  // ── Set new password form ───────────────────────────────────────────────────
  return (
    <AuthLayout>
      <AuthCard
        title="Set new password"
        description="Choose a strong password for your account."
      >
        {success ? (
          <div className="space-y-4">
            <AuthAlert
              type="success"
              message="Password updated! Redirecting you to login…"
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <AuthAlert type="error" message={formError} />

            <PasswordInput
              id="new-password"
              label="New Password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setFieldErrors((prev) => ({ ...prev, password: undefined }))
                setFormError('')
              }}
              error={fieldErrors.password}
              required
              autoComplete="new-password"
            />

            <PasswordInput
              id="confirm-password"
              label="Confirm New Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                setFormError('')
              }}
              error={fieldErrors.confirmPassword}
              required
              autoComplete="new-password"
            />

            <AuthButton type="submit" loading={loading}>
              Save New Password
            </AuthButton>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <Link
            to="/login"
            className="font-semibold text-emerald-800 transition-colors hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:text-emerald-400 dark:hover:text-emerald-300 dark:focus:ring-offset-zinc-900"
          >
            ← Back to Login
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  )
}
