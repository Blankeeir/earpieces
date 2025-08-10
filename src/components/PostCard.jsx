import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { intentBadge } from '../utils/intents.js'
import { timeAgo } from '../utils/format.js'

export default function PostCard({ post }) {
  const cover = post.imageUrls?.[0]
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-0 overflow-hidden group"
    >
      <Link to={`/post/${post.id}`}>
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          {cover ? (
            <img
              src={cover}
              alt={post.model || post.brand}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No photo</div>
          )}
          <div className="absolute top-2 left-2 badge bg-white/80">{post.brand}</div>
          <div className={`absolute top-2 right-2 badge ${intentBadge(post.intention)}`}>
            {post.intentionLabel}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{post.model || 'Unknown model'}</h3>
          <div className="text-xs text-gray-500">{timeAgo(post.createdAt)}</div>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {post.side} · {post.color || '—'} · {post.location || 'Singapore'}
        </div>
        <div className="text-xs text-gray-500 mt-2">by {post.userDisplayName || 'Someone'}</div>
      </div>
    </motion.div>
  )
}
