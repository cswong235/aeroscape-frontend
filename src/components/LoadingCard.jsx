import { Card, Spinner } from 'react-bootstrap'

export default function LoadingCard({ text = 'Loading...' }) {
  return (
    <Card className="aero-glass aero-loading-card">
      <Card.Body className="d-flex flex-column align-items-center gap-3">
        <Spinner animation="border" role="status" className="aero-spinner" />
        <span className="aero-loading-text">{text}</span>
      </Card.Body>
    </Card>
  )
}
