import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import AuthModal from '../components/AuthModal.jsx'
import PostForm from '../components/PostForm.jsx'
import { useState } from 'react'

export default function CreatePost({ onAskAuth }) {
  const { user } = useAuth()
  const [needAuth, setNeedAuth] = useState(false)
  const nav = useNavigate()

  const handleCreated = (id) => {
    nav(`/post/${id}`)
  }

  if (!user) {
    return (
      <main className="container-narrow">
        <div className="glass rounded-2xl p-6 my-6 text-center">
          <h2 className="text-xl font-bold mb-2">Sign in to create a post</h2>
          <p className="text-gray-600 mb-4">Use Google or Email to continue.</p>
          <button className="btn btn-primary" onClick={() => setNeedAuth(true)}>Open sign in</button>
        </div>
        <AuthModal open={needAuth} onClose={() => setNeedAuth(false)} />
      </main>
    )
  }

  return (
    <main className="container-narrow">
      <div className="glass rounded-2xl p-6 my-6">
        <h2 className="text-2xl font-bold mb-4">Create a new post</h2>
        <PostForm onCreated={handleCreated} />
      </div>
    </main>
  )
}
