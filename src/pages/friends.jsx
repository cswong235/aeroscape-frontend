import { useEffect, useState } from 'react'
import { useAuth } from '../context/login'
import { ENDPOINTS } from '../App'

export default function Friends() {
  const { apiFetch } = useAuth()
  const [users, setUsers] = useState([])
  const [followed, setFollowed] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch(ENDPOINTS.users)
      .then((data) => setUsers(Array.isArray(data) ? data : data.users || []))
      .catch((err) => setError(err.message))
  }, [])

  async function follow(userId) {
    setError('')
    try {
      await apiFetch(ENDPOINTS.friends, {
        method: 'POST',
        body: JSON.stringify({ friend_id: userId }),
      })
      setFollowed({ ...followed, [userId]: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h1>Friends</h1>
      {error && <p>{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username || user.email}{' '}
            <button onClick={() => follow(user.id)} disabled={followed[user.id]}>
              {followed[user.id] ? 'Following' : 'Follow'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
