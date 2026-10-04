import { useEffect, useState } from 'react'
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { useAuth } from '../context/login'
import { ENDPOINTS } from '../App'
import LoadingCard from '../components/LoadingCard'

export default function Feed() {
  const { apiFetch } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [visibility, setVisibility] = useState('public')
  const [posting, setPosting] = useState(false)

  // Fetch posts from the database
  function loadPosts() {
    return apiFetch(ENDPOINTS.posts)
      // If successful, set the fetched data in setPosts as an array
      .then((data) => setPosts(Array.isArray(data) ? data : data.posts || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  // Load posts on first mount
  useEffect(() => {
    loadPosts()
  }, [])

  async function handlePost(e) {
    e.preventDefault()
    setError('')
    // Input validation
    if (!title.trim()) return setError('Add a title')
    if (!content.trim()) return setError('Write something first')
    if (!visibility) return setError('Choose Public or Friends only')

    // Start loading state
    setPosting(true)
    // Send a request to the API for post submission
    try {
      await apiFetch(ENDPOINTS.createPost, {
        method: 'POST',
        body: JSON.stringify({ title, content, visibility }),
      })
      // Clear input fields
      setTitle('')
      setContent('')
      setVisibility('public')
      // Refresh the post list to show the new post
      await loadPosts()
    } catch (err) {
      setError(err.message)
    } finally {
      setPosting(false)
    }
  }

  return (
    <div>
      <h1 className="aero-title">Feed</h1>
      <Row>
        <Col xs={3}>
          <Card className="aero-glass">
            <Card.Body>
              <Card.Title as="h2" className="aero-post-title mb-4">Create A Post</Card.Title>
              <Form onSubmit={handlePost}>
                <Form.Group className="mb-3">
                  <Form.Control
                    className="aero-input w-100"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    className="aero-input w-100"
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                  />
                </Form.Group>
                {error && <Alert variant="danger" className="aero-alert"><img src="../src/assets/error.png" alt="Error" height="40px" style={{ marginRight: "10px" }}/>{error}</Alert>}

                <hr />

                <div className="aero-visibility mb-3">
                  <Form.Check
                    inline
                    type="radio"
                    id="visibility-public"
                    className="aero-radio"
                    name="visibility"
                    value="public"
                    label="Public"
                    checked={visibility === 'public'}
                    onChange={(e) => setVisibility(e.target.value)}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    id="visibility-friends"
                    className="aero-radio"
                    name="visibility"
                    value="friends_only"
                    label="Friends only"
                    checked={visibility === 'friends_only'}
                    onChange={(e) => setVisibility(e.target.value)}
                  />
                </div>

                <div className="text-center">
                  <Button type="submit" disabled={posting} className="aero-btn px-5">
                    {posting ? 'Posting...' : 'Post'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={9}>
          {loading && <LoadingCard text="Loading posts..." />}
          {!loading && posts.length === 0 && <p className="aero-status">No posts yet.</p>}

          <Row md={2} className="g-3">
            {posts.map((post) => (
              <Col key={post.id}>
                <Card as="article" className="aero-glass aero-post h-100">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title as="h3" className="aero-post-title">{post.title}</Card.Title>
                    <Card.Text className="aero-post-content flex-grow-1">{post.content}</Card.Text>
                    <small className="aero-post-meta align-self-start">
                      {post.username}
                      {post.created_at && ` · ${new Date(post.created_at).toLocaleString()}`}
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  )
}