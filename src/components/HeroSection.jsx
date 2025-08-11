import { motion } from 'framer-motion'
import { FaHeadphones, FaSearch, FaHeart, FaRocket } from 'react-icons/fa'
import { MdLocationOn, MdTrendingUp } from 'react-icons/md'

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <section className="relative overflow-hidden py-16 px-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/5 via-neon-purple/5 to-neon-blue/5" />
      <div className="absolute inset-0 bg-dots opacity-30" />
      
      {/* Floating orbs */}
      <motion.div 
        className="floating-orb bg-neon-pink top-20 left-10"
        animate="float"
        variants={floatingVariants}
      />
      <motion.div 
        className="floating-orb bg-neon-purple top-40 right-20"
        animate="float"
        variants={floatingVariants}
        style={{ animationDelay: '1s' }}
      />
      <motion.div 
        className="floating-orb bg-neon-blue bottom-20 left-1/4"
        animate="float"
        variants={floatingVariants}
        style={{ animationDelay: '2s' }}
      />

      {/* Sparkles */}
      <div className="sparkle top-32 left-1/3" />
      <div className="sparkle top-48 right-1/4" style={{ animationDelay: '0.5s' }} />
      <div className="sparkle bottom-32 right-1/3" style={{ animationDelay: '1s' }} />

      <div className="container-narrow relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Main heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-responsive font-black mb-6"
          >
            <span className="text-gradient-rainbow">Find Your Missing Earpiece</span>
            <br />
            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">🎧✨</span>
          </motion.h1>

          {/* Fun subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Lost your left or right earpiece? Don't panic! Join thousands of people who've found their 
            <span className="text-gradient font-semibold"> perfect audio match</span> in Singapore! 🚀
          </motion.p>

          {/* Fun stats */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-pink mb-2">🎯</div>
              <div className="text-2xl font-bold text-gray-800">2,847</div>
              <div className="text-sm text-gray-600">Matches Found</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-purple mb-2">👥</div>
              <div className="text-2xl font-bold text-gray-800">15,392</div>
              <div className="text-sm text-gray-600">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-blue mb-2">⚡</div>
              <div className="text-2xl font-bold text-gray-800">98.7%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-green mb-2">🏆</div>
              <div className="text-2xl font-bold text-gray-800">24hrs</div>
              <div className="text-sm text-gray-600">Avg. Match Time</div>
            </div>
          </motion.div>

          {/* Feature highlights */}
          <motion.div 
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
          >
            <div className="card text-center hover-lift group">
              <div className="text-4xl mb-4 group-hover:animate-bounce">
                <FaSearch className="mx-auto text-neon-pink" />
              </div>
              <h3 className="text-lg font-bold mb-2">Smart Matching</h3>
              <p className="text-gray-600 text-sm">AI-powered matching finds your perfect earpiece pair</p>
            </div>
            <div className="card text-center hover-lift group">
              <div className="text-4xl mb-4 group-hover:animate-bounce">
                <MdLocationOn className="mx-auto text-neon-purple" />
              </div>
              <h3 className="text-lg font-bold mb-2">Local Connections</h3>
              <p className="text-gray-600 text-sm">Connect with people in your area for easy meetups</p>
            </div>
            <div className="card text-center hover-lift group">
              <div className="text-4xl mb-4 group-hover:animate-bounce">
                <FaHeart className="mx-auto text-neon-blue" />
              </div>
              <h3 className="text-lg font-bold mb-2">Community First</h3>
              <p className="text-gray-600 text-sm">Join a friendly community of audio enthusiasts</p>
            </div>
          </motion.div>

          {/* Fun call to action */}
          <motion.div 
            variants={itemVariants}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-neon-pink to-neon-purple text-white px-6 py-3 rounded-full text-lg font-semibold shadow-glow hover:shadow-neon transition-all duration-300 hover:scale-105">
              <FaRocket className="animate-bounce" />
              Ready to find your match?
            </div>
            <p className="text-gray-600 mt-4 text-sm">
              Join the <span className="font-semibold text-neon-pink">#EarpieceMatchmakers</span> community today! 🎉
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Wave line decoration */}
      <div className="wave-line bottom-0 left-0 right-0 w-full" />
    </section>
  )
}
