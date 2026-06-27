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
import { validateLogin } from '../utils/authValidation'
import { DEFAULT_LOGIN_REDIRECT } from '../utils/protectedRoute'

const initialForm = {
  email: '',
  password: '',
  rememberMe: false,
}

export default function Login() {
  const navigate = useNavigate()
  const { signIn, signInWithGoogle } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => ({ ...current, [name]: '' }))
    setFormError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const errors = validateLogin(form)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) return

    setLoading(true)
    setFormError('')

    const { error } = await signIn({
      email: form.email,
      password: form.password,
    })

    setLoading(false)

    if (error) {
      setFormError(error.message)
      return
    }

    navigate(DEFAULT_LOGIN_REDIRECT, { replace: true })
  }

  async function handleGoogleSignIn() {
    setLoading(true)
    setFormError('')

    const { error } = await signInWithGoogle()

    setLoading(false)

    if (error) {
      setFormError(error.message)
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        description="Sign in to continue your career journey with CareerMind AI."
      >
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <AuthAlert type="error" message={formError} />

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
            placeholder="Enter your password"
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
            error={fieldErrors.password}
            required
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <input
                type="checkbox"
                checked={form.rememberMe}
                onChange={(event) => updateField('rememberMe', event.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-emerald-800 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-950"
              />
              Remember me
            </label>

            <Link
              to="/forgot-password"
              className="text-sm font-medium text-emerald-800 transition-colors hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:text-emerald-400 dark:hover:text-emerald-300 dark:focus:ring-offset-zinc-900"
            >
              Forgot password?
            </Link>
          </div>

          <AuthButton type="submit" loading={loading}>
            Login
          </AuthButton>
        </form>

        <Divider />

        <GoogleButton loading={loading} onClick={handleGoogleSignIn} />

        <AuthFooter
          text="Don't have an account?"
          linkText="Create Account"
          linkTo="/signup"
        />
      </AuthCard>
    </AuthLayout>
  )
}
