import { useEffect, useState } from 'react'
import { Card, ListGroup, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../context/login'
import { ENDPOINTS } from '../App'
import LoadingCard from '../components/LoadingCard'
import errorIcon from '../assets/error.png'

export default function Friends() {
  const { apiFetch } = useAuth();
  const [users, setUsers] = useState([]);
  const [followed, setFollowed] = useState({});
  const [error, setError] = useState('');
  // Start as loading so the list never renders before both requests finish
  const [loading, setLoading] = useState(true);
  const [friendLoading, setFriendLoading] = useState(null);

  useEffect(() => {
    // Fetch users and friendships together, and only render once both are done
    Promise.all([apiFetch(ENDPOINTS.users), apiFetch(ENDPOINTS.getFriends)])
      .then(([data, friendships]) => {
        // Mark everyone the user already follows, e.g. { 2: true, 5: true }
        const alreadyFollowed = {};
        for(const friendship of friendships){
          alreadyFollowed[friendship.friend_id] = true;
        }
        setUsers(Array.isArray(data) ? data : data.users || []);
        setFollowed(alreadyFollowed);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
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
      {error && <Alert variant="danger" className="aero-alert"><img src={errorIcon} alt="Error" height="40px" style={{ marginRight: "10px" }}/>{error}</Alert>}
      {loading ? (<LoadingCard text="Loading people..." />) : users.length === 0 ? (
          <Card className="aero-glass">
            <Card.Body>
              <p className="aero-status mb-0">No users found.</p>
            </Card.Body>
          </Card>
        ) : (
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