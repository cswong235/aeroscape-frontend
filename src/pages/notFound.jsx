import { Link } from 'react-router-dom'
import { Card, Button } from 'react-bootstrap'
import { useAuth } from '../context/login'
import logo from '../assets/Aeroscape.png'

export default function NotFound() {
  const { token } = useAuth()

  return (
    <div className="aero-auth">
      <Card className="aero-glass aero-auth-card">
        <Card.Body>
          <img src={logo} alt="Aeroscape logo" height="100px"/>
          <hr/>
          <h1 className="aero-title aero-auth-title">Page not found.</h1>
          <p className="aero-auth-switch mb-4">The page you're looking for doesn't exist or has been moved.</p>
          <Button as={Link} to={token ? '/feed' : '/login'} className="aero-btn aero-btn-block">
            {token ? 'Back to feed' : 'Back to login'}
          </Button>
        </Card.Body>
      </Card>
    </div>
  )
}
