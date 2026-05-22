import { useAuth } from '../auth/AuthContext'

/** @deprecated Profile and session state are exposed by useAuth() in ../auth/AuthContext. */
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
