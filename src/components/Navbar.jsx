import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { BRANDS } from '../utils/categories.js'
import { motion } from 'framer-motion'
import { FaPlusCircle, FaHeadphones } from 'react-icons/fa'
import { MdLogin, MdLogout, MdPerson, MdSearch } from 'react-icons/md'

export default function Navbar({ onOpenAuth, selectedBrand, setSelectedBrand }) {
  const { user, signOut } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-br from-rose-50/80 via-sky-50/80 to-lime-50/80 backdrop-blur-sm">
      <motion.div 
        className="container-narrow"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main navbar */}
        <motion.div 
          variants={itemVariants}
          className="mx-auto mt-4 mb-3 px-4 sm:px-6 py-3 glass-gradient rounded-3xl flex items-center justify-between shadow-float max-w-5xl"
        >
          <Link to="/" className="flex items-center gap-4 group">
            <motion.div 
              className="relative"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-neon-pink to-neon-purple rounded-2xl flex items-center justify-center shadow-glow">
                <FaHeadphones className="text-white text-xl" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-neon-green rounded-full animate-pulse"></div>
            </motion.div>
            
            <div className="leading-tight">
              <div className="font-black text-xl text-gradient">
                Earpiece Matchmaker
              </div>
              <div className="text-xs text-gray-600 font-medium">
                <span className="text-neon-pink">Singapore</span> · find your audio soulmate ✨
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-secondary hidden sm:inline-flex shadow-glow hover:shadow-neon"
              onClick={() => nav('/create')}
            >
              <FaPlusCircle className="mr-2" /> Create Post
            </motion.button>
            
            {user ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/profile" className="btn btn-outline" title="My Profile">
                    <MdPerson className="mr-2" /> Profile
                  </Link>
                </motion.div>
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-ghost" 
                  onClick={signOut} 
                  title="Sign out"
                >
                  <MdLogout className="mr-2" /> Sign out
                </motion.button>
              </>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary shadow-glow hover:shadow-neon" 
                onClick={onOpenAuth} 
                title="Sign in"
              >
                <MdLogin className="mr-2" /> Sign in
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Category bar - only show on home page */}
        {loc.pathname === '/' && (
          <motion.div 
            variants={itemVariants}
            className="mx-auto px-4 sm:px-6 py-4 glass rounded-3xl shadow-soft max-w-5xl"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <MdSearch className="text-neon-purple text-lg" />
              <span className="text-sm font-semibold text-gray-700">Filter by Brand:</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {BRANDS.map((b) => (
                <motion.button
                  key={b.id}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedBrand(b.id)}
                  className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold border-2 transition-all duration-300 ${
                    selectedBrand === b.id
                      ? 'bg-gradient-to-r from-neon-pink to-neon-purple text-white border-transparent shadow-glow'
                      : 'bg-white/80 hover:bg-white border-gray-200 hover:border-neon-pink hover:shadow-soft'
                  }`}
                >
                  {b.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </header>
  )
}
