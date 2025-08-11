import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { intentBadge } from '../utils/intents.js'
import { timeAgo } from '../utils/format.js'
import PostReactions from './PostReactions.jsx'
import LazyImage from './LazyImage.jsx'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { FaHeadphones, FaMapMarkerAlt, FaUser, FaClock, FaHeart } from 'react-icons/fa'

export default function PostCard({ post }) {
  const cover = post.imageUrls?.[0]
  const { toggleFavorite, isFavorited } = useFavorites()
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="card-neon p-0 overflow-hidden group cursor-pointer"
    >
      <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden rounded-t-3xl">
        <Link to={`/post/${post.id}`} className="block w-full h-full">
          {cover ? (
            <LazyImage
              src={cover}
              alt={post.model || post.brand}
              className="w-full h-full transition-all duration-700 group-hover:scale-110"
              fetchPriority="low"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <FaHeadphones className="text-6xl opacity-30" />
            </div>
          )}
          
          {/* Hover overlay (non-interactive so it doesn't block buttons) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Link>
        
        {/* Brand badge */}
        <motion.div 
          className="absolute top-3 left-3 badge badge-primary shadow-glow"
          whileHover={{ scale: 1.1 }}
        >
          {post.brand}
        </motion.div>
        
        {/* Intent badge */}
        <motion.div 
          className={`absolute top-3 right-3 badge ${intentBadge(post.intention)} shadow-glow`}
          whileHover={{ scale: 1.1 }}
        >
          {post.intentionLabel}
        </motion.div>
        
        {/* Favorite heart button */}
        <motion.button 
          className={`absolute bottom-3 left-3 w-10 h-10 rounded-full backdrop-blur-sm border-2 flex items-center justify-center transition-all duration-300 z-30 ${
            isFavorited(post.id) 
              ? 'bg-neon-pink/90 border-neon-pink text-white shadow-glow' 
              : 'bg-white/80 border-white/50 text-gray-600 hover:bg-neon-pink/20 hover:border-neon-pink hover:text-neon-pink'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleFavorite(post.id)
          }}
          title={isFavorited(post.id) ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FaHeart className="text-sm" />
        </motion.button>

        {/* Image count indicator */}
        {post.imageUrls && post.imageUrls.length > 1 && (
          <motion.div 
            className="absolute bottom-3 right-3 badge bg-black/70 text-white text-xs backdrop-blur-sm"
            whileHover={{ scale: 1.1 }}
          >
            📸 {post.imageUrls.length} photos
          </motion.div>
        )}
      </div>

      <div className="p-6">
        {/* Title and time */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-800 group-hover:text-neon-pink transition-colors duration-300">
            {post.model || 'Unknown model'}
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <FaClock className="text-neon-purple" />
            {timeAgo(post.createdAt)}
          </div>
        </div>
        
        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-neon-pink rounded-full"></div>
            <span className="font-medium">{post.side}</span>
            <span className="text-gray-400">•</span>
            <span>{post.color || 'Color N/A'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaMapMarkerAlt className="text-neon-blue" />
            <span>{post.location || 'Singapore'}</span>
          </div>
        </div>
        
        {/* User info */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <FaUser className="text-neon-green" />
          <span>by <span className="font-medium text-gray-700">{post.userDisplayName || 'Anonymous'}</span></span>
        </div>
        
        {/* Reactions */}
        <PostReactions postId={post.id} />
        
        {/* Fun call to action */}
        <motion.div 
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-xs text-neon-pink font-semibold">
            🎯 Click to see details and connect!
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
