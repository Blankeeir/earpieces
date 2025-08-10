import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'

export default function ImageGallery({ images, title }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
        No photos
      </div>
    )
  }

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      <div className="space-y-3">
        {/* Main Image */}
        <div className="relative group">
          <motion.img
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={images[selectedIndex]}
            alt={title}
            className="w-full aspect-video rounded-xl object-cover cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
          
          {/* Navigation arrows on main image */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiChevronLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiChevronRight size={20} />
              </button>
            </>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((url, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === selectedIndex
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Full-screen modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="relative max-w-7xl max-h-full w-full flex flex-col">
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
              >
                <FiX size={24} />
              </button>

              {/* Main modal image */}
              <div className="relative flex-1 flex items-center justify-center">
                <motion.img
                  key={`modal-${selectedIndex}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={images[selectedIndex]}
                  alt={title}
                  className="max-w-full max-h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />

                {/* Modal navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        prevImage()
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
                    >
                      <FiChevronLeft size={24} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        nextImage()
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
                    >
                      <FiChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>

              {/* Modal thumbnail strip */}
              {images.length > 1 && (
                <div className="mt-4 flex justify-center gap-2 overflow-x-auto pb-2">
                  {images.map((url, index) => (
                    <motion.button
                      key={index}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedIndex(index)
                      }}
                      className={`flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                        index === selectedIndex
                          ? 'border-white ring-2 ring-white/50'
                          : 'border-white/30 hover:border-white/60'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Image info */}
              <div className="text-center text-white/70 mt-2 text-sm">
                {selectedIndex + 1} of {images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}