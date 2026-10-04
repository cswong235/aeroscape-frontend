import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { Navbar, Container } from 'react-bootstrap'
import { AuthProvider, useAuth } from './context/login'
import LogoutModal from './components/LogoutModal'
import Signup from './pages/signup'
import Login from './pages/login'
import Feed from './pages/feed'
import Friends from './pages/friends'
import NotFound from './pages/notFound'
import './App.css';
import logo from './assets/Aeroscape.png'

export const ENDPOINTS = {
  signup: 'https://aeroscape-backend.vercel.app/signup',
  login: 'https://aeroscape-backend.vercel.app/login',
  refresh: 'https://aeroscape-backend.vercel.app/refresh',

  posts: 'https://aeroscape-backend.vercel.app/posts',
  createPost: 'https://aeroscape-backend.vercel.app/posts',

  users: 'https://aeroscape-backend.vercel.app/users',

  friends: 'https://aeroscape-backend.vercel.app/friendships',
  getFriends: 'https://aeroscape-backend.vercel.app/friendships',
  removeFriends: 'https://aeroscape-backend.vercel.app/friendships'
}

function RequireAuth({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

function GuestOnly({ children }) {
  const { token } = useAuth()
  return token ? <Navigate to="/feed" replace /> : children
}

function Nav() {
  const { token } = useAuth()
  if (!token) {
    return (
      <Navbar sticky="top" className="aero-navbar">
        <Container className="aero-navbar-inner">
          <Navbar.Brand className="aero-brand">
            <img src={logo} alt="Aeroscape" className="aero-logo" />
          </Navbar.Brand>
          <div className="aero-nav-links">
            <Link to="/login" className="aero-nav-link">Login</Link>
            <Link to="/signup" className="aero-nav-link">Sign up</Link>
          </div>
        </Container>
      </Navbar>
    )
  }
  return (
    <Navbar sticky="top" className="aero-navbar">
      <Container className="aero-navbar-inner">
        <Navbar.Brand className="aero-brand">
          <img src={logo} alt="Aeroscape" className="aero-logo" />
        </Navbar.Brand>
        <div className="aero-nav-links">
          <Link to="/feed" className="aero-nav-link">Feed</Link>
          <Link to="/friends" className="aero-nav-link">Friends</Link>
          <LogoutModal />
        </div>
      </Container>
    </Navbar>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <main className="aero-main">
          <Container className="aero-container">
            <Routes>
              <Route path="/signup" element={<GuestOnly><Signup /></GuestOnly>} />
              <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
              <Route path="/feed" element={<RequireAuth><Feed /></RequireAuth>} />
              <Route path="/friends" element={<RequireAuth><Friends /></RequireAuth>} />
              <Route path="/" element={<Navigate to="/feed" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}