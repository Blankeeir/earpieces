import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext.jsx'
import { MdEmail } from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'

export default function AuthModal({ open, onClose }) {
  const { signInGoogle, signInEmail, signUpEmail } = useAuth()
  const [tab, setTab] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')

  useEffect(() => {
    if (!open) {
      setEmail(''); setPassword(''); setDisplayName(''); setTab('signin')
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass rounded-2xl w-full max-w-md p-6"
          >
            <h3 className="text-xl font-extrabold mb-4">Welcome!</h3>
            <div className="flex items-center gap-2 mb-4">
              <button className={`btn ${tab === 'signin' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('signin')}>Sign in</button>
              <button className={`btn ${tab === 'signup' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('signup')}>Sign up</button>
            </div>

            <div className="space-y-3">
              {tab === 'signup' && (
                <input className="input" placeholder="Display name" value={displayName} onChange={e => setDisplayName(e.target.value)} />
              )}
              <input className="input" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              <input className="input" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
              {tab === 'signin' ? (
                <button className="btn btn-primary w-full" onClick={() => signInEmail(email, password)}>
                  <MdEmail className="mr-2" /> Sign in with Email
                </button>
              ) : (
                <button className="btn btn-primary w-full" onClick={() => signUpEmail(email, password, displayName)}>
                  <MdEmail className="mr-2" /> Create account
                </button>
              )}
              <div className="relative text-center my-2">
                <span className="text-xs text-gray-500 bg-white px-2 relative z-10">or</span>
                <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200 -z-0"></div>
              </div>
              <button className="btn btn-outline w-full" onClick={signInGoogle}>
                <FcGoogle className="mr-2" /> Continue with Google
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
