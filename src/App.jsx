import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import CreatePost from './pages/CreatePost.jsx'
import PostPage from './pages/PostPage.jsx'
import Profile from './pages/Profile.jsx'
import AuthModal from './components/AuthModal.jsx'
import FloatingActionWidget from './components/FloatingActionWidget.jsx'
import { useAuth } from './context/AuthContext.jsx'

export default function App() {
  const [authOpen, setAuthOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState('All')
  const { user } = useAuth()

  return (
    <div className="min-h-screen relative">
      {/* floating playful blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
        <div className="absolute top-40 -right-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-lime-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <Navbar
        onOpenAuth={() => setAuthOpen(true)}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        authOpen={authOpen}
      />

      <Routes>
        <Route path="/" element={<Home selectedBrand={selectedBrand} />} />
        <Route path="/create" element={<CreatePost onAskAuth={() => setAuthOpen(true)} />} />
        <Route path="/post/:id" element={<PostPage onAskAuth={() => setAuthOpen(true)} />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <FloatingActionWidget />
    </div>
  )
}
