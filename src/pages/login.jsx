import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../context/login'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/feed')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="aero-auth">
      <Card className="aero-glass aero-auth-card">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <img src="../src/assets/Aeroscape.png" alt="Aeroscape logo" height="100px"/>
            <hr/>
            <h1 className="aero-title aero-auth-title">Welcome.</h1>
            <Form.Group className="mb-3">
              <Form.Control className="aero-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control className="aero-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            <Button type="submit" className="aero-btn aero-btn-block">Log in</Button>
            {error && <Alert variant="danger" className="aero-alert mt-3"><img src="../src/assets/error.png" alt="Error" height="40px" style={{ marginRight: "10px" }}/>{error}</Alert>}
            <p className="aero-auth-switch">No account? <Link to="/signup" className="aero-link">Sign up</Link></p>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}