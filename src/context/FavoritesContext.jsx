import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  onSnapshot 
} from 'firebase/firestore'
import { db } from '../firebase.js'
import toast from 'react-hot-toast'

const FavoritesContext = createContext()

export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setFavorites([])
      setLoading(false)
      return
    }

    // Listen to user's favorites document
    const userFavoritesRef = doc(db, 'userFavorites', user.uid)
    const unsubscribe = onSnapshot(userFavoritesRef, (docSnap) => {
      if (docSnap.exists()) {
        setFavorites(docSnap.data().postIds || [])
      } else {
        setFavorites([])
      }
      setLoading(false)
    }, (error) => {
      console.error('Error listening to favorites:', error)
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  const toggleFavorite = async (postId) => {
    if (!user) {
      toast.error('Please sign in to save favorites')
      return
    }

    const userFavoritesRef = doc(db, 'userFavorites', user.uid)
    const isFavorited = favorites.includes(postId)

    try {
      // Check if document exists
      const docSnap = await getDoc(userFavoritesRef)
      
      if (!docSnap.exists()) {
        // Create document if it doesn't exist
        await setDoc(userFavoritesRef, {
          userId: user.uid,
          postIds: [postId],
          createdAt: new Date(),
          updatedAt: new Date()
        })
        toast.success('Added to favorites! ❤️')
      } else {
        // Update existing document
        if (isFavorited) {
          await updateDoc(userFavoritesRef, {
            postIds: arrayRemove(postId),
            updatedAt: new Date()
          })
          toast.success('Removed from favorites')
        } else {
          await updateDoc(userFavoritesRef, {
            postIds: arrayUnion(postId),
            updatedAt: new Date()
          })
          toast.success('Added to favorites! ❤️')
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('Failed to update favorites')
    }
  }

  const isFavorited = (postId) => {
    return favorites.includes(postId)
  }

  const value = {
    favorites,
    loading,
    toggleFavorite,
    isFavorited
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}