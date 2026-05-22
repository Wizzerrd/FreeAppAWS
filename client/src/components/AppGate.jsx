import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import GlobalLoading from './GlobalLoading'

const PROFILE_SETUP_PATH = '/profile/setup'
const PROFILE_REDIRECT_EXEMPT = new Set(['/callback', PROFILE_SETUP_PATH])

export default function AppGate() {
  const { user, appLoading, profileNotFound } = useAuth()
  const location = useLocation()

  if (appLoading) {
    return <GlobalLoading />
  }

  if (
    user &&
    profileNotFound &&
    !PROFILE_REDIRECT_EXEMPT.has(location.pathname)
  ) {
    return <Navigate to={PROFILE_SETUP_PATH} replace state={{ from: location }} />
  }

  return <Outlet />
}
