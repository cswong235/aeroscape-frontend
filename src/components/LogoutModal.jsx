import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/login'

export default function LogoutModal() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  // Clear the stored tokens and send the user back to the login page
  function handleLogOut() {
    setShow(false)
    logout()
    navigate('/login')
  }

  return (
    <>
      <Button onClick={handleShow} className="aero-btn aero-btn-ghost aero-btn-small">
        Log out
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        contentClassName="aero-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="aero-modal-title">Log Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} className="aero-btn aero-btn-ghost">
            Cancel
          </Button>
          <Button onClick={handleLogOut} className="aero-btn aero-btn-danger">
            Log out
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
