import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import AuthCard from '../components/auth/AuthCard'
import AuthInput from '../components/auth/AuthInput'
import AuthButton from '../components/auth/AuthButton'
import AuthAlert from '../components/auth/AuthAlert'
import { useAuth } from '../hooks/useAuth'
import { validateForgotPassword } from '../utils/authValidation'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    const errors = validateForgotPassword({ email })
    setFieldErrors(errors)
    setFormError('')
    setSuccessMessage('')

    if (Object.keys(errors).length > 0) return

    setLoading(true)

    const { error } = await resetPassword(email)

    setLoading(false)

    if (error) {
      setFormError(error.message)
      return
    }

    setSuccessMessage('Check your email for a password reset link.')
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Reset your password"
        description="Enter your email and we will send you a link to reset your password."
      >
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <AuthAlert type="error" message={formError} />
          <AuthAlert type="success" message={successMessage} />

          <AuthInput
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setFieldErrors({})
              setFormError('')
              setSuccessMessage('')
            }}
            error={fieldErrors.email}
            required
            autoComplete="email"
            icon="@"
          />

          <AuthButton type="submit" loading={loading}>
            Reset Password
          </AuthButton>
        </form>

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
