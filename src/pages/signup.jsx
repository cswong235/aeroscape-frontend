import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../context/login'
import errorIcon from '../assets/error.png'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) return setError('Passwords do not match')
    try {
      await signup(email, password, username)
      navigate('/login')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="aero-auth">
      <Card className="aero-glass aero-auth-card">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <h1 className="aero-title aero-auth-title">Sign up</h1>
            <p className="aero-auth-title">Your journey begins soon.</p>
            <Form.Group className="mb-3">
              <Form.Control className="aero-input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control className="aero-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control className="aero-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control className="aero-input" type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </Form.Group>
            <Button type="submit" className="aero-btn aero-btn-block">Sign up</Button>
            {error && <Alert variant="danger" className="aero-alert mt-3"><img src={errorIcon} alt="Error" height="40px" style={{ marginRight: "10px" }}/>{error}</Alert>}
            <p className="aero-auth-switch">Have an account? <Link to="/login" className="aero-link">Log in</Link></p>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}