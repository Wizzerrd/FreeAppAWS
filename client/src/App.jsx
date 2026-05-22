import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import AppGate from './components/AppGate';
import ProtectedRoute from './components/ProtectedRoute';
import RequireMissingProfile from './components/RequireMissingProfile';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Callback from './pages/Callback';
import Profile from './pages/Profile';
import ProfileSetup from './pages/ProfileSetup';
import User from './pages/User';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppGate />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/callback" element={<Callback />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route element={<RequireMissingProfile />}>
                <Route path="/profile/setup" element={<ProfileSetup />} />
              </Route>
            </Route>
            <Route path="/user" element={<User />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
