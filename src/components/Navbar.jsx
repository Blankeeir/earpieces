import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { BRANDS } from '../utils/categories.js'
import { motion } from 'framer-motion'
import { FaPlusCircle } from 'react-icons/fa'
import { MdLogin, MdLogout } from 'react-icons/md'

export default function Navbar({ onOpenAuth, selectedBrand, setSelectedBrand }) {
  const { user, signOut } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()

  return (
    <header className="sticky top-0 z-30">
      <div className="container-narrow">
        <div className="mt-4 mb-2 px-3 py-3 glass rounded-2xl flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/favicon.svg" alt="logo" className="w-8 h-8 animate-floaty" />
            <div className="leading-tight">
              <div className="font-extrabold text-lg text-gradient">Matching Your Earpieces</div>
              <div className="text-xs text-gray-600">Singapore · find your other half</div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              className="btn btn-outline hidden sm:inline-flex"
              onClick={() => nav('/create')}
            >
              <FaPlusCircle className="mr-2" /> Create post
            </button>
            {user ? (
              <button className="btn btn-outline" onClick={signOut} title="Sign out">
                <MdLogout className="mr-2" /> Sign out
              </button>
            ) : (
              <button className="btn btn-primary" onClick={onOpenAuth} title="Sign in">
                <MdLogin className="mr-2" /> Sign in
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category bar */}
      <div className="container-narrow mb-3">
        <div className="px-3 py-2 glass rounded-2xl overflow-x-auto no-scrollbar">
          <div className="flex gap-2">
            {BRANDS.map((b) => (
              <motion.button
                key={b.id}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedBrand(b.id)}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-sm border ${
                  selectedBrand === b.id
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                {b.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
