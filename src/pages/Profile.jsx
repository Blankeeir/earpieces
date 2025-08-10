import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { db } from '../firebase.js'
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { motion } from 'framer-motion'
import { timeAgo } from '../utils/format.js'
import { intentBadge } from '../utils/intents.js'
import toast from 'react-hot-toast'
import Spinner from '../components/Spinner.jsx'

export default function Profile() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'posts'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setPosts(postsData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await deleteDoc(doc(db, 'posts', postId))
      toast.success('Post deleted successfully')
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    }
  }

  if (!user) {
    return (
      <div className="container-narrow">
        <div className="glass rounded-2xl p-6 my-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <p className="text-gray-600">Please sign in to view your profile.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    )
  }

  return (
    <main className="container-narrow">
      <div className="glass rounded-2xl p-6 my-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-sky-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.displayName || 'User'}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">My Posts ({posts.length})</h2>
          
          {posts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>You haven't created any posts yet.</p>
              <a href="/create" className="text-sky-600 hover:underline">Create your first post</a>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {post.imageUrls?.[0] ? (
                        <img
                          src={post.imageUrls[0]}
                          alt={post.model}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No photo</div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold truncate">{post.model || post.brand}</h3>
                        <span className={`badge ${intentBadge(post.intention)}`}>
                          {post.intentionLabel}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        {post.brand} · {post.side} · {post.color || '—'} · {post.location || 'Singapore'}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Posted {timeAgo(post.createdAt)}
                      </div>
                    </div>
                    
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeletePost(post.id)}
                      className="btn btn-outline btn-sm text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
