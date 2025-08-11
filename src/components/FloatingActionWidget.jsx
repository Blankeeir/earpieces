import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { FaPlus, FaHeadphones, FaSearch, FaHeart } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export default function FloatingActionWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const actions = [
    {
      icon: FaPlus,
      label: 'Create Post',
      color: 'from-neon-pink to-neon-purple',
      action: () => navigate('/create')
    },
    {
      icon: FaSearch,
      label: 'Browse Posts',
      color: 'from-neon-blue to-neon-green',
      action: () => navigate('/')
    },
    {
      icon: FaHeart,
      label: 'My Favorites',
      color: 'from-neon-purple to-neon-pink',
      // Accept both 'favorites' and 'favourites' by normalizing to 'favorites'
      action: () => navigate('/profile?tab=favorites')
    }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3 mb-4"
          >
            {actions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ scale: 0, y: 20 }}
                animate={{ 
                  scale: 1, 
                  y: 0,
                  transition: { delay: index * 0.1, type: "spring", stiffness: 260 }
                }}
                exit={{ 
                  scale: 0, 
                  y: 20,
                  transition: { delay: (actions.length - index - 1) * 0.1 }
                }}
                whileHover={{ scale: 1.1, x: -10 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.action}
                className={`flex items-center gap-3 bg-gradient-to-r ${action.color} text-white px-4 py-3 rounded-2xl shadow-glow hover:shadow-neon group`}
              >
                <action.icon className="text-lg group-hover:rotate-12 transition-transform" />
                <span className="font-semibold text-sm whitespace-nowrap">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 bg-gradient-to-r from-neon-pink to-neon-purple rounded-full shadow-glow flex items-center justify-center text-white text-xl relative overflow-hidden group`}
        animate={{ 
          rotate: isOpen ? 45 : 0,
          background: isOpen ? 'linear-gradient(to right, #ef4444, #dc2626)' : 'linear-gradient(to right, #ec4899, #a855f7)'
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated background pulse */}
        <motion.div
          className="absolute inset-0 rounded-full bg-white"
          initial={{ scale: 0, opacity: 0.3 }}
          animate={{ scale: isOpen ? 1.5 : 0, opacity: isOpen ? 0 : 0.3 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Main icon */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <FaPlus /> : <FaHeadphones className="group-hover:animate-bounce" />}
        </motion.div>

        {/* Floating sparkles */}
        <AnimatePresence>
          {!isOpen && (
            <>
              <motion.div
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  x: [0, 20, 0],
                  y: [0, -20, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: 0
                }}
                className="absolute w-1 h-1 bg-yellow-300 rounded-full"
              />
              <motion.div
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  x: [0, -15, 0],
                  y: [0, -25, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5
                }}
                className="absolute w-1 h-1 bg-blue-300 rounded-full"
              />
              <motion.div
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  x: [0, 10, 0],
                  y: [0, -30, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: 1
                }}
                className="absolute w-1 h-1 bg-green-300 rounded-full"
              />
            </>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Fun tooltip when closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-20 top-1/2 -translate-y-1/2 bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap"
          >
            Quick Actions ✨
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-l-6 border-l-black/80 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}