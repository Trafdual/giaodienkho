import {
  faCircleQuestion,
  faFloppyDisk,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import { Modal } from '../Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useToast } from '../GlobalStyles/ToastContext'
import { fetchWithHMAC } from '../VerifyAxios'

function ModalDelete2 ({
  onClose,
  isOpen,
  content,
  seletecids,
  fetchdata,
  link,
  setSelectedIds,
  message
}) {
  const { showToast } = useToast()
  const handeldelte = async () => {
    try {
      const response = await fetchWithHMAC('POST', `${link}`, {
        ids: seletecids
      })
      if (response.ok) {
        fetchdata()
        onClose()
        setSelectedIds([])
        showToast(message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='divModalOnClose'>
        <div className='divModalBodyOnClose'>
          <FontAwesomeIcon
            icon={faCircleQuestion}
            className='iconBodyOnclose'
          />
          <p className='pModalBodyOnClose'>{content}</p>
        </div>
        <div className='divModalFooterOnClose'>
          <button onClick={handeldelte} className='btnsaveClose'>
            <FontAwesomeIcon icon={faFloppyDisk} className='iconSaveOnclose' />
            <p>Có</p>
          </button>
          <button onClick={onClose} className='btncancelClose'>
            <FontAwesomeIcon icon={faXmark} className='iconCancelOnclose' />
            <p>Không</p>
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ModalDelete2
