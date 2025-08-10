import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { db } from '../firebase.js'
import { doc, setDoc, deleteDoc, onSnapshot, collection } from 'firebase/firestore'
import { motion } from 'framer-motion'
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function PostReactions({ postId }) {
  const { user } = useAuth()
  const [reactions, setReactions] = useState({ likes: 0, dislikes: 0 })
  const [userReaction, setUserReaction] = useState(null) // 'like', 'dislike', or null
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!postId) return

    // Listen to reactions count
    const reactionsRef = collection(db, 'posts', postId, 'reactions')
    const unsubscribe = onSnapshot(reactionsRef, (snapshot) => {
      let likes = 0
      let dislikes = 0
      
      snapshot.docs.forEach((doc) => {
        const data = doc.data()
        if (data.type === 'like') likes++
        else if (data.type === 'dislike') dislikes++
      })
      
      setReactions({ likes, dislikes })
    })

    return () => unsubscribe()
  }, [postId])

  useEffect(() => {
    if (!user || !postId) return

    // Get user's current reaction
    const userReactionRef = doc(db, 'posts', postId, 'reactions', user.uid)
    const unsubscribe = onSnapshot(userReactionRef, (doc) => {
      if (doc.exists()) {
        setUserReaction(doc.data().type)
      } else {
        setUserReaction(null)
      }
    })

    return () => unsubscribe()
  }, [user, postId])

  const handleReaction = async (type) => {
    if (!user) {
      toast.error('Please sign in to react to posts')
      return
    }

    if (loading) return
    setLoading(true)

    try {
      const reactionRef = doc(db, 'posts', postId, 'reactions', user.uid)
      
      if (userReaction === type) {
        // Remove reaction if clicking the same type
        await deleteDoc(reactionRef)
        setUserReaction(null)
        toast.success('Reaction removed')
      } else {
        // Set new reaction
        await setDoc(reactionRef, {
          type,
          userId: user.uid,
          timestamp: new Date()
        })
        setUserReaction(type)
        toast.success(`Post ${type === 'like' ? 'liked' : 'disliked'}!`)
      }
    } catch (error) {
      console.error('Error updating reaction:', error)
      toast.error('Failed to update reaction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-4 mt-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleReaction('like')}
        disabled={loading}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
          userReaction === 'like'
            ? 'bg-green-100 border-green-300 text-green-700'
            : 'bg-white border-gray-200 hover:bg-gray-50'
        }`}
      >
        <FaThumbsUp className={userReaction === 'like' ? 'text-green-600' : 'text-gray-500'} />
        <span className="font-medium">{reactions.likes}</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleReaction('dislike')}
        disabled={loading}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
          userReaction === 'dislike'
            ? 'bg-red-100 border-red-300 text-red-700'
            : 'bg-white border-gray-200 hover:bg-gray-50'
        }`}
      >
        <FaThumbsDown className={userReaction === 'dislike' ? 'text-red-600' : 'text-gray-500'} />
        <span className="font-medium">{reactions.dislikes}</span>
      </motion.button>
    </div>
  )
}
