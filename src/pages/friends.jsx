import { useEffect, useState } from 'react'
import { Card, ListGroup, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../context/login'
import { ENDPOINTS } from '../App'

export default function Friends() {
  const { apiFetch } = useAuth();
  const [users, setUsers] = useState([]);
  const [followed, setFollowed] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [friendLoading, setFriendLoading] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiFetch(ENDPOINTS.users)
      .then((data) => setUsers(Array.isArray(data) ? data : data.users || []))
      .catch((err) => setError(err.message));

    // Mark everyone the user already follows, e.g. { 2: true, 5: true }
    apiFetch(ENDPOINTS.getFriends)
      .then((friendships) => {
        const alreadyFollowed = {};
        for(const friendship of friendships){
          alreadyFollowed[friendship.friend_id] = true;
        }
        setFollowed(alreadyFollowed);
      })
      .catch((err) => setError(err.message));
    setLoading(false);
  }, [])

  async function follow(userId) {
    setFriendLoading(userId);
    setError('')
    try {
      await apiFetch(ENDPOINTS.friends, {
        method: 'POST',
        body: JSON.stringify({ friend_id: userId }),
      })
      setFollowed({ ...followed, [userId]: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setFriendLoading(null);
    }
  }

  async function unfollow(userId) {
    setFriendLoading(userId);
    setError('')
    try {
      await apiFetch(`${ENDPOINTS.friends}/${userId}`, { method: 'DELETE' })
      setFollowed({ ...followed, [userId]: false })
    } catch (err) {
      setError(err.message)
    } finally {
      setFriendLoading(null);
    }
  };

  return (
    <div>
      <h1 className="aero-title">Friends</h1>
      {error && <Alert variant="danger" className="aero-alert"><img src="../src/assets/error.png" alt="Error" height="40px" style={{ marginRight: "10px" }}/>{error}</Alert>}
      {loading ? (<p className="aero-status">Loading...</p>) : (
          <Card className="aero-glass">
            <Card.Body>
              <ListGroup className="aero-list">
                <p className="mb-2">Go say hi to one or few people amongst {users.length} people here!</p>
                {users.map((user) => (
                  <ListGroup.Item key={user.id} className="aero-list-item">
                    <span className="aero-orb" />
                    <span className="aero-username">{user.username || user.email}</span>
                    {followed[user.id] ? (
                      <Button onClick={() => unfollow(user.id)} disabled={friendLoading === user.id} className="aero-btn aero-btn-ghost aero-btn-small">
                        {friendLoading === user.id ? 'Unfollowing...' : 'Unfollow'}
                      </Button>
                    ) : (
                      <Button onClick={() => follow(user.id)} disabled={friendLoading === user.id} className="aero-btn aero-btn-small">
                        {friendLoading === user.id ? 'Following...' : 'Follow'}
                      </Button>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        )
      }
    </div>
  )
}