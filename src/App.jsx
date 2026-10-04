import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { Navbar, Container } from 'react-bootstrap'
import { AuthProvider, useAuth } from './context/login'
import LogoutModal from './components/LogoutModal'
import Signup from './pages/signup'
import Login from './pages/login'
import Feed from './pages/feed'
import Friends from './pages/friends'
import './App.css';

export const ENDPOINTS = {
  // signup: `${API_URL}/signup`, // POST { email, password, username }
  signup: 'http://localhost:3000/signup',
  // login: `${API_URL}/login`, // POST { email, password } -> token
  login: 'http://localhost:3000/login',
  // POST { refreshToken } -> new access token
  refresh: 'http://localhost:3000/refresh',
  // posts: `${API_URL}/posts`, // GET public + friends' posts
  posts: 'http://localhost:3000/posts',
  // createPost: `${API_URL}/posts`, // POST { title, content, visibility } -> new post
  createPost: 'http://localhost:3000/posts',
  // users: `${API_URL}/users`, // GET all users
  users: 'http://localhost:3000/users',
  // friends: `${API_URL}/friends`, // POST { friend_id } -> follow a user
  friends: 'http://localhost:3000/friendships',
  getFriends: 'http://localhost:3000/friendships',
  removeFriends: 'http://localhost:3000/friendships'
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
            <img src="/src/assets/Aeroscape.png" alt="Aeroscape" className="aero-logo" />
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
          <img src="/src/assets/Aeroscape.png" alt="Aeroscape" className="aero-logo" />
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
              <Route path="*" element={<Navigate to="/feed" replace />} />
            </Routes>
          </Container>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}