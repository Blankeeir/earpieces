import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query, where, limit, startAfter } from 'firebase/firestore'
import { db } from '../firebase.js'
import PostCard from './PostCard.jsx'
import Spinner from './Spinner.jsx'

export default function PostGrid({ selectedBrand }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [last, setLast] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  const load = async (reset=false) => {
    setLoading(true)
    try {
      const baseRef = collection(db, 'posts')
      const isFiltered = selectedBrand && selectedBrand !== 'All'
      const commonLimit = limit(12)

      // Attempt indexed query (brand + orderBy createdAt). If index missing, fallback.
      try {
        const clauses = isFiltered
          ? [where('brand', '==', selectedBrand), orderBy('createdAt', 'desc'), commonLimit]
          : [orderBy('createdAt', 'desc'), commonLimit]
        if (last && !reset) clauses.push(startAfter(last))
        const q = query(baseRef, ...clauses)
        const snap = await getDocs(q)
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setLast(snap.docs[snap.docs.length - 1])
        if (reset) setPosts(items)
        else setPosts(prev => [...prev, ...items])
        setHasMore(items.length === 12)
      } catch (err) {
        // Fallback when composite index is missing: drop orderBy and sort client-side.
        console.warn('[PostGrid] Indexed query failed; falling back without orderBy', err?.code || err)
        const clauses = isFiltered ? [where('brand', '==', selectedBrand), commonLimit] : [commonLimit]
        if (last && !reset) clauses.push(startAfter(last))
        const q = query(baseRef, ...clauses)
        const snap = await getDocs(q)
        let items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        // Client-side sort by createdAt desc
        items.sort((a, b) => {
          const ad = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt || 0)
          const bd = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt || 0)
          return bd - ad
        })
        setLast(snap.docs[snap.docs.length - 1])
        if (reset) setPosts(items)
        else setPosts(prev => [...prev, ...items])
        setHasMore(items.length === 12)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLast(null)
    setPosts([])
    load(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrand])

  return (
    <div>
      {posts.length === 0 && loading && (
        <div className="flex items-center justify-center py-16"><Spinner /></div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(p => <PostCard key={p.id} post={p} />)}
      </div>
      <div className="flex justify-center py-8">
        {hasMore && (
          <button onClick={() => load()} className="btn btn-outline">Load more</button>
        )}
      </div>
    </div>
  )
}
