import { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db, serverTimestamp } from '../firebase.js'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const REASONS = [
  'Suspicious / scam',
  'Inaccurate / misleading',
  'Offensive content',
  'Duplicate',
  'Other',
]

export default function ReportModal({ open, onClose, post }) {
  const [reason, setReason] = useState('Suspicious / scam')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()

  const submit = async () => {
    if (!user) return toast.error('Please sign in to report')
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'reports'), {
        postId: post.id,
        postOwnerId: post.userId,
        reporterId: user.uid,
        reason,
        details,
        createdAt: serverTimestamp(),
        status: 'new'
      })
      toast.success('Report submitted — thanks for keeping the community safe!')
      onClose()
    } catch (e) {
      console.error(e)
      toast.error('Failed to submit report')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass rounded-2xl p-5 w-full max-w-md"
          >
            <h3 className="text-lg font-bold mb-3">Report Post</h3>
            <p className="text-sm text-gray-600 mb-3">Help us keep things safe and honest. Choose a reason and add more info if useful.</p>
            <div className="space-y-2">
              {REASONS.map(r => (
                <label key={r} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
            <textarea
              className="input mt-3 h-24"
              placeholder="Details (optional)"
              value={details}
              onChange={e => setDetails(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-outline" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={submit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit report'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
