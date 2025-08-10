import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '../firebase.js'
import { BRANDS } from '../utils/categories.js'
import { INTENTS } from '../utils/intents.js'
import ImageUploader from './ImageUploader.jsx'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'

const SIDE_OPTIONS = ['Left', 'Right', 'Both', 'Case']

export default function PostForm({ onCreated }) {
  const { user } = useAuth()
  const [data, setData] = useState({
    brand: 'AirPods',
    model: '',
    side: 'Left',
    color: '',
    intention: 'looking',
    price: '',
    story: '',
    contactEmail: '',
    contactWhatsapp: '',
    contactTelegram: '',
    contactInstagram: '',
    location: 'Singapore',
  })
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onChange = (key, val) => setData((d) => ({ ...d, [key]: val }))

  const submit = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('Please sign in first')

    if (!data.model || !data.side) {
      return toast.error('Please fill in model and side')
    }

    setSubmitting(true)
    try {
      console.debug('[PostForm] Submit start', {
        userId: user?.uid,
        imagesCount: images?.length || 0,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      })
      // 1) Create the doc to get an id
      const base = {
        userId: user.uid,
        userDisplayName: user.displayName || user.email?.split('@')[0] || 'User',
        brand: data.brand,
        model: data.model,
        side: data.side,
        color: data.color || '',
        intention: data.intention,
        intentionLabel: INTENTS.find(i => i.id === data.intention)?.label || '',
        price: data.price ? Number(data.price) : null,
        story: data.story || '',
        contact: {
          email: data.contactEmail || user.email || '',
          whatsapp: data.contactWhatsapp || '',
          telegram: data.contactTelegram || '',
          instagram: data.contactInstagram || '',
        },
        location: data.location || 'Singapore',
        imageUrls: [],
        createdAt: serverTimestamp(),
        status: 'active',
      }
      const refDoc = await addDoc(collection(db, 'posts'), base)

      // 2) Upload images (if any) then update doc
      let urls = []
      let failures = 0
      const totalImages = images.length
      console.debug('[PostForm] Storage bucket (resolved)', {
        bucketFromEnv: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        bucketFromAppOptions: storage?.app?.options?.storageBucket,
      })
      
      for (let i = 0; i < Math.min(images.length, 6); i++) {
        const imageObj = images[i]
        try {
          const file = imageObj.file
          console.debug('[PostForm] Upload start', {
            fileName: file?.name,
            fileSize: file?.size,
            postId: refDoc.id,
          })
          const storageRef = ref(storage, `postImages/${user.uid}/${refDoc.id}/${file.name}`)
          const uploadTask = uploadBytesResumable(storageRef, file, {
            contentType: file?.type || 'application/octet-stream',
            cacheControl: 'public, max-age=31536000, immutable',
          })
          
          await new Promise((resolve, reject) => {
            uploadTask.on('state_changed', (snapshot) => {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
              console.debug('[PostForm] Upload progress', {
                fileName: file?.name,
                state: snapshot.state,
                progress,
              })
            }, (error) => {
              console.error('[PostForm] Upload error', {
                fileName: file?.name,
                code: error?.code,
                message: error?.message,
              })
              reject(error)
            }, () => resolve())
          })
          
          const url = await getDownloadURL(storageRef)
          console.debug('[PostForm] Upload complete; download URL obtained', { fileName: file?.name, url })
          urls.push(url)
          
          // Update progress
          const completed = i + 1
          setUploadProgress((completed / totalImages) * 100)
        } catch (err) {
          console.error('[PostForm] Skipping file due to error', {
            fileName: imageObj?.file?.name,
            code: err?.code,
            message: err?.message,
          })
          failures += 1
        }
      }
      console.debug('[PostForm] Uploads finished', { successCount: urls.length, failureCount: failures })
      await updateDoc(refDoc, { imageUrls: urls })
      if (failures > 0) {
        toast.error(`${failures} image${failures > 1 ? 's' : ''} failed to upload`)
      }
      if (urls.length === 0) {
        toast.error('No images were uploaded. Please try again.')
      }

      // Reset form
      setData({
        brand: 'AirPods',
        model: '',
        side: 'Left',
        color: '',
        intention: 'looking',
        price: '',
        story: '',
        contactEmail: '',
        contactWhatsapp: '',
        contactTelegram: '',
        contactInstagram: '',
        location: 'Singapore',
      })
      setImages([])
      setUploadProgress(0)

      // confetti!
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } })

      toast.success('Post created!')
      onCreated?.(refDoc.id)
    } catch (e) {
      console.error('[PostForm] Submit failed', { code: e?.code, message: e?.message, name: e?.name })
      toast.error(`Failed to create post${e?.message ? `: ${e.message}` : ''}`)
    } finally {
      setSubmitting(false)
      setUploadProgress(0)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          <select
            className="input"
            value={data.brand}
            onChange={(e) => onChange('brand', e.target.value)}
          >
            {BRANDS.filter(b => b.id !== 'All').map((b) => (
              <option key={b.id} value={b.id}>{b.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Model</label>
          <input className="input" value={data.model} onChange={(e) => onChange('model', e.target.value)} placeholder="e.g., AirPods Pro (2nd gen)"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Side</label>
          <select className="input" value={data.side} onChange={(e) => onChange('side', e.target.value)}>
            {SIDE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <input className="input" value={data.color} onChange={(e) => onChange('color', e.target.value)} placeholder="e.g., White"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Intent</label>
          <select className="input" value={data.intention} onChange={(e) => onChange('intention', e.target.value)}>
            {INTENTS.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price (if selling)</label>
          <input className="input" type="number" min="0" value={data.price} onChange={(e) => onChange('price', e.target.value)} placeholder="Optional"/>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Your story</label>
          <textarea className="input h-28" value={data.story} onChange={(e) => onChange('story', e.target.value)} placeholder="Tell us how your earpiece got separated 🥲" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Contact email</label>
          <input className="input" type="email" value={data.contactEmail} onChange={(e) => onChange('contactEmail', e.target.value)} placeholder="you@example.com"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">WhatsApp</label>
          <input className="input" value={data.contactWhatsapp} onChange={(e) => onChange('contactWhatsapp', e.target.value)} placeholder="+65 8xxxxxxx"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Telegram</label>
          <input className="input" value={data.contactTelegram} onChange={(e) => onChange('contactTelegram', e.target.value)} placeholder="@yourhandle"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Instagram</label>
          <input className="input" value={data.contactInstagram} onChange={(e) => onChange('contactInstagram', e.target.value)} placeholder="@yourinsta"/>
        </div>
      </div>

      <ImageUploader
        images={images}
        onChange={setImages}
        maxImages={6}
      />

      <motion.button 
        whileTap={{ scale: 0.98 }} 
        className="btn btn-primary relative overflow-hidden" 
        type="submit" 
        disabled={submitting}
      >
        {submitting ? (
          <div className="flex items-center gap-2">
            {images.length > 0 && uploadProgress > 0 ? (
              <>
                <span>Uploading images... {Math.round(uploadProgress)}%</span>
                <div className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-300" 
                     style={{ width: `${uploadProgress}%` }} />
              </>
            ) : (
              'Creating post...'
            )}
          </div>
        ) : (
          'Publish post'
        )}
      </motion.button>
    </form>
  )
}
