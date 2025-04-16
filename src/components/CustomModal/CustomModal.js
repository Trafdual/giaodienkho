import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import './CustomModal.scss' // CSS riêng biệt cho modal

function CustomKhoModal ({ isOpen, onClose, children }) {
  useEffect(() => {
    const handleEsc = e => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='custom_modal_overlay' onClick={onClose}>
          <motion.div
            className='custom_modal_container'
            initial={{ opacity: 0, scale: 0.8, y: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: '0%' }}
            exit={{ opacity: 0, scale: 0.8, y: '-50%' }}
            transition={{ duration: 0.3 }}
            onClick={e => e.stopPropagation()}
          >
            <button className='custom_modal_close' onClick={onClose}>
              &times;
            </button>
            <div className='custom_modal_content'>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CustomKhoModal
