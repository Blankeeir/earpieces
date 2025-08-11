import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { db } from '../firebase.js'
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { motion } from 'framer-motion'
import { timeAgo } from '../utils/format.js'
import { intentBadge } from '../utils/intents.js'
import toast from 'react-hot-toast'
import Spinner from '../components/Spinner.jsx'
import FavoritePosts from '../components/FavoritePosts.jsx'
import { useSearchParams } from 'react-router-dom'

export default function Profile() {
  const { user, loading: authLoading } = useAuth()
  const { favorites } = useFavorites()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('posts')

  // Check for tab query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    // Support both spelling variants: favorites / favourites
    if (tabParam === 'favorites' || tabParam === 'favourites') {
      setActiveTab('favorites')
    }
  }, [searchParams])

  useEffect(() => {
    if (!user) return

    console.log('Profile: Setting up query for user:', user.uid)
    
    try {
      // First try with orderBy
      let q = query(
        collection(db, 'posts'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )

      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log('Profile: Received snapshot with', snapshot.docs.length, 'posts')
        const postsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setPosts(postsData)
        setLoading(false)
      }, (error) => {
        console.error('Profile: Error with orderBy query:', error)
        // If orderBy fails, try without it (for users with no posts)
        if (error.code === 'failed-precondition') {
          console.log('Profile: Trying query without orderBy')
          const simpleQ = query(
            collection(db, 'posts'),
            where('userId', '==', user.uid)
          )
          
          const simpleUnsubscribe = onSnapshot(simpleQ, (snapshot) => {
            console.log('Profile: Simple query successful with', snapshot.docs.length, 'posts')
            const postsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
            setPosts(postsData)
            setLoading(false)
          }, (simpleError) => {
            console.error('Profile: Simple query also failed:', simpleError)
            setLoading(false)
            toast.error('Failed to load posts')
          })
          
          return () => simpleUnsubscribe()
        } else {
          setLoading(false)
          toast.error('Failed to load posts')
        }
      })

      return () => unsubscribe()
    } catch (error) {
      console.error('Profile: Error setting up query:', error)
      setLoading(false)
      toast.error('Failed to load posts')
    }
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

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    )
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

  console.log('Profile: Rendering for user:', user.uid, 'Display name:', user.displayName)

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
          {/* Tab navigation */}
          <div className="flex items-center gap-2 mb-6 bg-gray-100/50 rounded-2xl p-1">
            <motion.button 
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'posts' 
                  ? 'bg-white text-neon-pink shadow-soft' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('posts')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              My Posts ({posts.length})
            </motion.button>
            <motion.button 
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'favorites' 
                  ? 'bg-white text-neon-pink shadow-soft' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('favorites')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Favorites ❤️ ({favorites.length})
            </motion.button>
          </div>

          {/* Tab content */}
          {activeTab === 'posts' ? (
            posts.length === 0 ? (
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
            )
          ) : (
            <FavoritePosts />
          )}
        </div>
      </div>
    </main>
  )
}
