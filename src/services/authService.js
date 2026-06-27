import { supabase } from '../supabase/supabaseClient'

/**
 * Maps Supabase auth errors to user-friendly messages.
 */
export function getAuthErrorMessage(error) {
  if (!error) return 'Something went wrong. Please try again.'

  const message = (error.message || '').toLowerCase()
  const code = error.code || ''

  if (
    message.includes('invalid login credentials') ||
    code === 'invalid_credentials'
  ) {
    return 'Wrong email or password. Please try again.'
  }

  if (message.includes('invalid email') || code === 'validation_failed') {
    return 'Invalid email address.'
  }

  if (
    message.includes('user already registered') ||
    message.includes('already been registered')
  ) {
    return 'An account with this email already exists.'
  }

  if (
    message.includes('password') &&
    (message.includes('weak') || message.includes('short') || message.includes('least'))
  ) {
    return 'Password is too weak. Use at least 6 characters.'
  }

  if (message.includes('email not confirmed')) {
    return 'Please confirm your email before logging in.'
  }

  if (message.includes('rate limit') || code === 'over_request_rate_limit') {
    return 'Too many attempts. Please wait a moment and try again.'
  }

  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('failed to fetch')
  ) {
    return 'Network error. Check your internet connection and try again.'
  }

  return error.message || 'Something went wrong. Please try again.'
}

export async function signUp({ email, password, fullName }) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName.trim(),
      },
    },
  })

  return { data, error: error ? { ...error, message: getAuthErrorMessage(error) } : null }
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })

  return { data, error: error ? { ...error, message: getAuthErrorMessage(error) } : null }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()

  return { error: error ? { ...error, message: getAuthErrorMessage(error) } : null }
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/chat`,
    },
  })

  return { data, error: error ? { ...error, message: getAuthErrorMessage(error) } : null }
}

export async function resetPassword(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/login`,
  })

  return { data, error: error ? { ...error, message: getAuthErrorMessage(error) } : null }
}

export async function getSession() {
  return supabase.auth.getSession()
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback)
}
