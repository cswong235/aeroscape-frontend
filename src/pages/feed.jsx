import { useEffect, useState } from 'react'
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { useAuth } from '../context/login'
import { ENDPOINTS } from '../App'

export default function Feed() {
  const { apiFetch } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [visibility, setVisibility] = useState('')
  const [posting, setPosting] = useState(false)

  function loadPosts() {
    return apiFetch(ENDPOINTS.posts)
      .then((data) => setPosts(Array.isArray(data) ? data : data.posts || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadPosts()
  }, [])

  async function handlePost(e) {
    e.preventDefault()
    setError('')
    if (!title.trim()) return setError('Add a title')
    if (!content.trim()) return setError('Write something first')
    if (!visibility) return setError('Choose Public or Friends only')

    setPosting(true)
    try {
      await apiFetch(ENDPOINTS.createPost, {
        method: 'POST',
        body: JSON.stringify({ title, content, visibility }),
      })
      setTitle('')
      setContent('')
      setVisibility('')
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
        <Card className="aero-glass aero-composer">
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

        <hr className="my-4" />

        {loading && <p className="aero-status">Loading posts...</p>}
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
    </div>
  )
}