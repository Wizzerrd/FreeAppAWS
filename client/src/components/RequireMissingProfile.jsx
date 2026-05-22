import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

/** For /profile/setup — signed-in users with a DB profile go to landing. */
export default function RequireMissingProfile() {
  const { profile, profileNotFound } = useAuth()

  if (profile && !profileNotFound) {
    return <Navigate to="/profile" replace />
  }

  return <Outlet />
}
