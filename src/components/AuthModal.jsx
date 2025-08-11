import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext.jsx'
import { MdEmail } from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'
import { FaHeadphones, FaHeart, FaRocket } from 'react-icons/fa'

export default function AuthModal({ open, onClose }) {
  const { signInGoogle, signInEmail, signUpEmail, user } = useAuth()
  const [tab, setTab] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')

  useEffect(() => {
    if (!open) {
      setEmail(''); setPassword(''); setDisplayName(''); setTab('signin')
    }
  }, [open])

  // Auto-close modal when user successfully signs in
  useEffect(() => {
    if (user && open) {
      onClose()
    }
  }, [user, open, onClose])

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  }

  const contentVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.1
      }
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="glass-gradient rounded-3xl w-full max-w-md p-8 shadow-float border border-white/30"
          >
            {/* Header */}
            <motion.div 
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="text-center mb-8"
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-neon-pink to-neon-purple rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <FaHeadphones className="text-white text-2xl" />
              </motion.div>
              
              <h3 className="text-2xl font-black text-gradient-rainbow mb-2">
                Welcome to Earpiece Matchmaker! 🎧
              </h3>
              <p className="text-gray-600 text-sm">
                Join thousands of people finding their perfect audio match! ✨
              </p>
            </motion.div>

            {/* Tab switcher */}
            <motion.div 
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-2 mb-6 bg-gray-100/50 rounded-2xl p-1"
            >
              <motion.button 
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  tab === 'signin' 
                    ? 'bg-white text-neon-pink shadow-soft' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setTab('signin')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign In
              </motion.button>
              <motion.button 
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  tab === 'signup' 
                    ? 'bg-white text-neon-pink shadow-soft' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setTab('signup')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign Up
              </motion.button>
            </motion.div>

            {/* Form */}
            <motion.div 
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {tab === 'signup' && (
                <motion.input 
                  className="input"
                  placeholder="Display name (optional)"
                  value={displayName} 
                  onChange={e => setDisplayName(e.target.value)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              
              <motion.input 
                className="input"
                placeholder="Email address"
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              />
              
              <motion.input 
                className="input"
                placeholder="Password"
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
              
              {/* Action buttons */}
              {tab === 'signin' ? (
                <motion.button 
                  className="btn btn-primary w-full shadow-glow hover:shadow-neon"
                  onClick={() => signInEmail(email, password, onClose)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MdEmail className="mr-2" /> Sign in with Email
                </motion.button>
              ) : (
                <motion.button 
                  className="btn btn-primary w-full shadow-glow hover:shadow-neon"
                  onClick={() => signUpEmail(email, password, displayName, onClose)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaRocket className="mr-2" /> Create Account
                </motion.button>
              )}
              
              {/* Divider */}
              <div className="relative text-center my-6">
                <span className="text-xs text-gray-500 bg-white px-4 relative z-10 font-medium">
                  or continue with
                </span>
                <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200"></div>
              </div>
              
              {/* Google sign in */}
              <motion.button 
                className="btn btn-outline w-full hover:border-neon-purple hover:bg-neon-purple/5"
                onClick={() => signInGoogle(onClose)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <FcGoogle className="mr-2 text-lg" /> Continue with Google
              </motion.button>
            </motion.div>

            {/* Fun footer */}
            <motion.div 
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="text-center mt-6 pt-6 border-t border-gray-200"
            >
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <FaHeart className="text-neon-pink animate-pulse" />
                <span>Join the <span className="font-semibold text-neon-pink">#EarpieceMatchmakers</span> community!</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
