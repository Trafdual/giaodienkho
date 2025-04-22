import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'


const ModalBanhang = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className='modal-overlay-banhang' onClick={onClose}>
          <motion.div
            className='modal-content-banhang'
            initial={{ opacity: 0, scale: 0.8, y: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: '0%' }}
            exit={{ opacity: 0, scale: 0.8, y: '-50%' }}
            transition={{ duration: 0.3 }}
            onClick={e => e.stopPropagation()}
          >
            <button className='modal-close' onClick={onClose}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ModalBanhang