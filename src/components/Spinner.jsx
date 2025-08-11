import { motion } from 'framer-motion'
import { FaHeadphones } from 'react-icons/fa'

export default function Spinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Fun spinning earphone icon */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        }}
        className={`${sizeClasses[size]} text-neon-pink`}
      >
        <FaHeadphones className="w-full h-full" />
      </motion.div>

      {/* Pulsing dots */}
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
            className="w-2 h-2 bg-neon-purple rounded-full"
          />
        ))}
      </div>

      {/* Fun loading text */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${textSizeClasses[size]} text-gray-600 font-medium text-center`}
      >
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
          className="text-neon-pink ml-1"
        >
          ✨
        </motion.span>
      </motion.div>
    </div>
  )
}
