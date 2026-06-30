/**
 * Route configuration for CareerMind AI authentication.
 */

export const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/chat',
  '/login',
  '/signup',
  '/forgot-password',
]

export const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/chat-history',
  '/saved-careers',
  '/saved-comparisons',
  '/skill-gap',
]

export const AUTH_ROUTES = ['/login', '/signup', '/forgot-password']

export const DEFAULT_LOGIN_REDIRECT = '/chat'
export const DEFAULT_LOGOUT_REDIRECT = '/'

export function isAuthRoute(pathname) {
  return AUTH_ROUTES.includes(pathname)
}

export function isProtectedRoute(pathname) {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )
}

export function isPublicRoute(pathname) {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || (route !== '/' && pathname.startsWith(`${route}/`)),
  )
}
