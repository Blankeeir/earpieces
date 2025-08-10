import PostGrid from '../components/PostGrid.jsx'

export default function Home({ selectedBrand }) {
  return (
    <main className="container-narrow pb-20">
      <section className="px-3 py-4 glass rounded-2xl mb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold">
          Welcome to <span className="text-gradient">Matching Your Earpieces</span> 🎧
        </h1>
        <p className="text-gray-600 mt-2">
          Lost your left or right earpiece? Browse posts by brand, or create your own and tell your story.
        </p>
      </section>
      <PostGrid selectedBrand={selectedBrand} />
    </main>
  )
}
