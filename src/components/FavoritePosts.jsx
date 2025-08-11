import { useEffect, useState } from 'react'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { db } from '../firebase.js'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { motion } from 'framer-motion'
import { timeAgo } from '../utils/format.js'
import { intentBadge } from '../utils/intents.js'
import { Link } from 'react-router-dom'
import Spinner from './Spinner.jsx'
import { FaHeart, FaHeadphones } from 'react-icons/fa'

export default function FavoritePosts() {
  const { favorites } = useFavorites()
  const [favoritePosts, setFavoritePosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavoritePosts = async () => {
      if (favorites.length === 0) {
        setFavoritePosts([])
        setLoading(false)
        return
      }

      try {
        // Firestore 'in' queries are limited to 10 items, so we need to batch
        const batchSize = 10
        const batches = []
        
        for (let i = 0; i < favorites.length; i += batchSize) {
          const batch = favorites.slice(i, i + batchSize)
          const q = query(
            collection(db, 'posts'),
            where('__name__', 'in', batch)
          )
          batches.push(getDocs(q))
        }

        const batchResults = await Promise.all(batches)
        const posts = []
        
        batchResults.forEach(snapshot => {
          snapshot.docs.forEach(doc => {
            posts.push({ id: doc.id, ...doc.data() })
          })
        })

        // Sort by creation date (newest first)
        posts.sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0
          const bTime = b.createdAt?.seconds || 0
          return bTime - aTime
        })

        setFavoritePosts(posts)
      } catch (error) {
        console.error('Error fetching favorite posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavoritePosts()
  }, [favorites])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    )
  }

  if (favoritePosts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gradient-to-br from-neon-pink to-neon-purple rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50">
          <FaHeart className="text-white text-xl" />
        </div>
        <p className="text-gray-500 mb-2">No favorite posts yet</p>
        <p className="text-sm text-gray-400">
          Click the ❤️ icon on posts to save them here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {favoritePosts.map((post) => (
        <motion.div
          key={post.id}
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-soft transition-shadow duration-300"
        >
          <Link to={`/post/${post.id}`} className="flex items-start gap-4 group">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {post.imageUrls?.[0] ? (
                <img
                  src={post.imageUrls[0]}
                  alt={post.model}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FaHeadphones className="text-2xl" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold truncate group-hover:text-neon-pink transition-colors duration-300">
                  {post.model || post.brand}
                </h3>
                <span className={`badge ${intentBadge(post.intention)}`}>
                  {post.intentionLabel}
                </span>
                <FaHeart className="text-neon-pink text-sm flex-shrink-0" />
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                {post.brand} · {post.side} · {post.color || '—'} · {post.location || 'Singapore'}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Posted {timeAgo(post.createdAt)} by {post.userDisplayName || 'Anonymous'}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}