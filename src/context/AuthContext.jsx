import { createContext, useContext, useEffect, useState } from 'react'
import { auth, googleProvider } from '../firebase.js'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const signInGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      toast.success('Signed in with Google')
    } catch (e) {
      console.error(e)
      toast.error(e.message)
    }
  }

  const signInEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('Signed in')
    } catch (e) {
      toast.error(e.message)
    }
  }

  const signUpEmail = async (email, password, displayName) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName) {
        await updateProfile(cred.user, { displayName })
      }
      toast.success('Welcome!')
    } catch (e) {
      toast.error(e.message)
    }
  }

  const signOut = async () => {
    await fbSignOut(auth)
    toast('Signed out', { icon: '👋' })
  }

  const value = { user, loading, signInGoogle, signInEmail, signUpEmail, signOut }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
