import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import AuthCard from '../components/auth/AuthCard'
import AuthInput from '../components/auth/AuthInput'
import PasswordInput from '../components/auth/PasswordInput'
import AuthButton from '../components/auth/AuthButton'
import GoogleButton from '../components/auth/GoogleButton'
import Divider from '../components/auth/Divider'
import AuthFooter from '../components/auth/AuthFooter'
import AuthAlert from '../components/auth/AuthAlert'
import { useAuth } from '../hooks/useAuth'
import { validateSignup } from '../utils/authValidation'
import { DEFAULT_LOGIN_REDIRECT } from '../utils/protectedRoute'

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreedToTerms: false,
}

export default function Signup() {
  const navigate = useNavigate()
  const { signUp, signInWithGoogle } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => ({ ...current, [name]: '' }))
    setFormError('')
    setSuccessMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const errors = validateSignup(form)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) return

    setLoading(true)
    setFormError('')
    setSuccessMessage('')

    const { data, error } = await signUp({
      email: form.email,
      password: form.password,
      fullName: form.fullName,
    })

    setLoading(false)

    if (error) {
      setFormError(error.message)
      return
    }

    if (data.session) {
      navigate(DEFAULT_LOGIN_REDIRECT, { replace: true })
      return
    }

    setSuccessMessage('Check your email to confirm your account, then log in.')
  }

  async function handleGoogleSignUp() {
    setLoading(true)
    setFormError('')
    setSuccessMessage('')

    const { error } = await signInWithGoogle()

    setLoading(false)

    if (error) {
      setFormError(error.message)
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Create your account"
        description="Start exploring careers, degrees, and skills with AI-powered guidance."
      >
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <AuthAlert type="error" message={formError} />
          <AuthAlert type="success" message={successMessage} />

          <AuthInput
            id="fullName"
            label="Full Name"
            type="text"
            placeholder="Your full name"
            value={form.fullName}
            onChange={(event) => updateField('fullName', event.target.value)}
            error={fieldErrors.fullName}
            required
            autoComplete="name"
          />

          <AuthInput
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            error={fieldErrors.email}
            required
            autoComplete="email"
            icon="@"
          />

          <PasswordInput
            id="password"
            label="Password"
            placeholder="Create a password"
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
            error={fieldErrors.password}
            helperText="Use at least 6 characters."
            required
            autoComplete="new-password"
          />

          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={(event) => updateField('confirmPassword', event.target.value)}
            error={fieldErrors.confirmPassword}
            required
            autoComplete="new-password"
          />

          <div className="space-y-1.5">
            <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <input
                type="checkbox"
                checked={form.agreedToTerms}
                onChange={(event) => updateField('agreedToTerms', event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-stone-300 text-emerald-800 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-950"
              />
              <span>
                I agree to the{' '}
                <Link to="/terms" className="font-medium text-emerald-800 dark:text-emerald-400">
                  Terms
                </Link>{' '}
                &amp;{' '}
                <Link to="/privacy" className="font-medium text-emerald-800 dark:text-emerald-400">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {fieldErrors.agreedToTerms && (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                {fieldErrors.agreedToTerms}
              </p>
            )}
          </div>

          <AuthButton type="submit" loading={loading}>
            Create Account
          </AuthButton>
        </form>

        <Divider />

        <GoogleButton loading={loading} onClick={handleGoogleSignUp} />

        <AuthFooter
          text="Already have an account?"
          linkText="Login"
          linkTo="/login"
        />
      </AuthCard>
    </AuthLayout>
  )
}
