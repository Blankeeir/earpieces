import { motion } from 'framer-motion'
import PostGrid from '../components/PostGrid.jsx'
import HeroSection from '../components/HeroSection.jsx'
import { FaPlus, FaUsers, FaStar, FaLightbulb } from 'react-icons/fa'

export default function Home({ selectedBrand }) {
  return (
    <main className="pb-20">
      {/* Compact hero section */}
      <section className="container-narrow px-6 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            <span className="text-gradient-rainbow">Find Your Missing Earpiece</span> 🎧
          </h1>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Lost your left or right earpiece? Join thousands who've found their 
            <span className="text-gradient font-semibold"> perfect audio match</span> in Singapore! ✨
          </p>
        </motion.div>
      </section>

      {/* Posts section - now first */}
      <section className="container-narrow px-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass rounded-3xl p-6 mb-6"
        >
          <h2 className="text-2xl font-bold mb-3">
            <span className="text-gradient">Latest Earpiece Posts</span> 🔍
          </h2>
          <p className="text-gray-600">
            Browse through the latest posts from people looking for their missing earpiece! 
            <span className="font-semibold text-neon-pink"> Found a match?</span> Reach out and make someone's day! ✨
          </p>
        </motion.div>
        
        <PostGrid selectedBrand={selectedBrand} />
      </section>

      {/* Why choose us - more compact */}
      <section className="container-narrow px-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-gradient rounded-3xl p-6 text-center"
        >
          <h2 className="text-2xl font-bold mb-6">
            <span className="text-gradient">Why Choose Us?</span> 🤔
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center group">
              <div className="text-3xl mb-2 group-hover:animate-bounce">
                <FaPlus className="mx-auto text-neon-pink" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Easy to Use</h3>
              <p className="text-gray-600 text-xs">Post in seconds!</p>
            </div>
            
            <div className="text-center group">
              <div className="text-3xl mb-2 group-hover:animate-bounce">
                <FaUsers className="mx-auto text-neon-purple" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Active Community</h3>
              <p className="text-gray-600 text-xs">Thousands of users</p>
            </div>
            
            <div className="text-center group">
              <div className="text-3xl mb-2 group-hover:animate-bounce">
                <FaStar className="mx-auto text-neon-blue" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Verified Users</h3>
              <p className="text-gray-600 text-xs">Safe & secure</p>
            </div>
            
            <div className="text-center group">
              <div className="text-3xl mb-2 group-hover:animate-bounce">
                <FaLightbulb className="mx-auto text-neon-green" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Smart Matching</h3>
              <p className="text-gray-600 text-xs">AI powered</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats section */}
      <section className="container-narrow px-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
        >
          <div className="text-center card">
            <div className="text-2xl font-bold text-neon-pink mb-1">2,847</div>
            <div className="text-xs text-gray-600">Matches Found</div>
          </div>
          <div className="text-center card">
            <div className="text-2xl font-bold text-neon-purple mb-1">15.4K</div>
            <div className="text-xs text-gray-600">Happy Users</div>
          </div>
          <div className="text-center card">
            <div className="text-2xl font-bold text-neon-blue mb-1">98.7%</div>
            <div className="text-xs text-gray-600">Success Rate</div>
          </div>
          <div className="text-center card">
            <div className="text-2xl font-bold text-neon-green mb-1">24hrs</div>
            <div className="text-xs text-gray-600">Avg. Match Time</div>
          </div>
        </motion.div>
      </section>

      {/* Call to action */}
      <section className="container-narrow px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card-neon text-center"
        >
          <h3 className="text-xl font-bold mb-3">
            <span className="text-gradient-rainbow">Join the Fun!</span> 🎉
          </h3>
          <p className="text-gray-700 text-sm mb-4">
            Don't let your lonely earpiece collect dust! Create a post and join thousands of people 
            who've found their perfect audio match. It's like dating, but for earpieces! 😄
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-neon-pink rounded-full"></span>
              Free to use
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-neon-purple rounded-full"></span>
              Instant matching
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-neon-blue rounded-full"></span>
              Safe & secure
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-neon-green rounded-full"></span>
              Community driven
            </span>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
