import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase.js'
import { doc, getDoc } from 'firebase/firestore'
import Spinner from '../components/Spinner.jsx'
import { timeAgo } from '../utils/format.js'
import { intentBadge } from '../utils/intents.js'
import ReportModal from '../components/ReportModal.jsx'
import PostReactions from '../components/PostReactions.jsx'
import ImageGallery from '../components/ImageGallery.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { motion } from 'framer-motion'
import { FaHeart } from 'react-icons/fa'
import { useFavorites } from '../context/FavoritesContext.jsx'

export default function PostPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reportOpen, setReportOpen] = useState(false)
  const { user } = useAuth()
  const { toggleFavorite, isFavorited } = useFavorites()

  useEffect(() => {
    (async () => {
      setLoading(true)
      const snap = await getDoc(doc(db, 'posts', id))
      setPost(snap.exists() ? { id: snap.id, ...snap.data() } : null)
      setLoading(false)
    })()
  }, [id])

  if (loading) return <div className="flex items-center justify-center py-16"><Spinner /></div>
  if (!post) return <div className="container-narrow"><div className="glass rounded-2xl p-6 my-6">Post not found.</div></div>

  const images = post.imageUrls || []

  return (
    <main className="container-narrow">
      <div className="glass rounded-2xl p-4 sm:p-6 my-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <ImageGallery images={images} title={post.model || post.brand} />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-extrabold">{post.model || post.brand}</h1>
              <span className={`badge ${intentBadge(post.intention)}`}>{post.intentionLabel}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">Posted {timeAgo(post.createdAt)} · {post.location || 'Singapore'}</div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <Info title="Brand" value={post.brand} />
              <Info title="Side" value={post.side} />
              <Info title="Color" value={post.color || '—'} />
              <Info title="Price" value={post.price ? `SGD ${post.price}` : '—'} />
            </div>

            {post.story && (
              <div className="mt-4">
                <h3 className="font-semibold mb-1">Story</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{post.story}</p>
              </div>
            )}

            <div className="mt-4">
              <h3 className="font-semibold mb-1">Contact</h3>
              <div className="text-gray-700 space-y-1 text-sm">
                {post.contact?.email && <div>Email: <a className="underline" href={`mailto:${post.contact.email}`}>{post.contact.email}</a></div>}
                {post.contact?.whatsapp && <div>WhatsApp: <a className="underline" href={`https://wa.me/${post.contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">{post.contact.whatsapp}</a></div>}
                {post.contact?.telegram && <div>Telegram: <a className="underline" href={`https://t.me/${post.contact.telegram.replace(/^@/, '')}`} target="_blank" rel="noreferrer">@{post.contact.telegram.replace(/^@/, '')}</a></div>}
                {post.contact?.instagram && <div>Instagram: <a className="underline" href={`https://instagram.com/${post.contact.instagram.replace(/^@/, '')}`} target="_blank" rel="noreferrer">@{post.contact.instagram.replace(/^@/, '')}</a></div>}
              </div>
            </div>

            <PostReactions postId={post.id} />
            
            <div className="mt-6 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleFavorite(post.id)}
                className={`btn ${isFavorited(post.id) ? 'btn-primary' : 'btn-outline'}`}
                title={isFavorited(post.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <FaHeart className="mr-2" />
                {isFavorited(post.id) ? 'Favorited' : 'Add to Favorites'}
              </motion.button>
              <motion.button whileTap={{ scale: 0.98 }} className="btn btn-outline" onClick={() => setReportOpen(true)}>
                Report
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} post={post} />
    </main>
  )
}

function Info({ title, value }) {
  return (
    <div className="p-3 rounded-xl bg-white border border-gray-200">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="font-semibold">{value}</div>
    </div>
  )
}
