import { Link } from 'react-router-dom'
import ProfileDetails from '../components/profile/ProfileDetails'
import { useAuth } from '../auth/AuthContext'
import '../App.css'

export default function Profile() {
  const { signOut, profile, profileError } = useAuth()

  if (profileError) {
    return (
      <main className="auth-shell">
        <h1 className="auth-title">Profile</h1>
        <p className="auth-error">{profileError}</p>
        <p className="auth-footer">
          <Link to="/">Home</Link>
        </p>
      </main>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <main className="auth-shell">
      <ProfileDetails
        firstName={profile.firstName}
        lastName={profile.lastName}
        onSignOut={() => signOut?.()}
      />
    </main>
  )
}
