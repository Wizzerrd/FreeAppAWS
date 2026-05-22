import { useAuth } from '../auth/AuthContext'

/** @deprecated Prefer useAuth() — profile state lives on the auth context globally. */
export function useProfile() {
  const {
    user,
    sessionLoading: authLoading,
    profile,
    profileLoading,
    profileNotFound: notFound,
    profileError: error,
    configured,
  } = useAuth()

  return {
    profile,
    profileLoading,
    notFound,
    error,
    authLoading,
    configured,
    user,
  }
}
