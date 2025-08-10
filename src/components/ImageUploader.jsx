import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiX, FiImage, FiUpload } from 'react-icons/fi'
import heic2any from 'heic2any'
import imageCompression from 'browser-image-compression'

export default function ImageUploader({ images, onChange, maxImages = 6 }) {
  const [dragOver, setDragOver] = useState(false)
  const [processing, setProcessing] = useState(false)
  const fileInputRef = useRef(null)

  const processFile = async (file) => {
    try {
      let processedFile = file

      // Convert HEIC to JPEG
      if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
        console.log('Converting HEIC file:', file.name)
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.8
        })
        
        // Handle array result from heic2any
        const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob
        
        processedFile = new File([blob], file.name.replace(/\.heic$/i, '.jpg'), {
          type: 'image/jpeg'
        })
      }

      // Compress image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: processedFile.type
      }

      const compressedFile = await imageCompression(processedFile, options)
      console.log(`Compressed from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`)

      return compressedFile
    } catch (error) {
      console.error('Error processing file:', error)
      throw error
    }
  }

  const createPreview = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.readAsDataURL(file)
    })
  }

  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return
    
    const remainingSlots = maxImages - images.length
    const filesToProcess = Array.from(fileList).slice(0, remainingSlots)
    
    if (filesToProcess.length === 0) return

    setProcessing(true)
    
    try {
      const newImages = []
      
      for (const file of filesToProcess) {
        try {
          const processedFile = await processFile(file)
          const preview = await createPreview(processedFile)
          
          newImages.push({
            file: processedFile,
            preview,
            id: Math.random().toString(36).substr(2, 9)
          })
        } catch (error) {
          console.error(`Failed to process ${file.name}:`, error)
        }
      }

      if (newImages.length > 0) {
        onChange([...images, ...newImages])
      }
    } finally {
      setProcessing(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleFileInput = (e) => {
    handleFiles(e.target.files)
    e.target.value = '' // Reset input
  }

  const removeImage = (id) => {
    onChange(images.filter(img => img.id !== id))
  }

  const canAddMore = images.length < maxImages

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium mb-2">
        Photos (up to {maxImages})
      </label>
      
      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-3">
        <AnimatePresence>
          {images.map((image) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group"
            >
              <img
                src={image.preview}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <FiX size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add More Button */}
        {canAddMore && (
          <motion.div
            layout
            className={`aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
              dragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            } ${processing ? 'opacity-50 pointer-events-none' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            {processing ? (
              <>
                <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mb-2" />
                <span className="text-xs text-gray-600">Processing...</span>
              </>
            ) : (
              <>
                <FiPlus className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-xs text-gray-600 text-center">
                  {dragOver ? 'Drop here' : 'Add photo'}
                </span>
              </>
            )}
          </motion.div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.heic,.HEIC"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Upload info */}
      <div className="text-xs text-gray-500 space-y-1">
        <div className="flex items-center gap-2">
          <FiImage className="w-4 h-4" />
          <span>Supports JPEG, PNG, HEIC formats</span>
        </div>
        <div className="flex items-center gap-2">
          <FiUpload className="w-4 h-4" />
          <span>Images will be compressed for faster upload</span>
        </div>
        {images.length > 0 && (
          <div className="text-green-600">
            {images.length} image{images.length !== 1 ? 's' : ''} ready to upload
          </div>
        )}
      </div>
    </div>
  )
}