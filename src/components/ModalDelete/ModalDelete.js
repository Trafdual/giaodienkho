import {
  faCircleQuestion,
  faFloppyDisk,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import { Modal } from '../Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function ModalDelete ({ Save, Cancel, isOpen, content }) {
  return (

    <Modal isOpen={isOpen} onClose={Cancel}>

      <div className='divModalOnClose'>
        <div className='divModalBodyOnClose'>
          <FontAwesomeIcon
            icon={faCircleQuestion}
            className='iconBodyOnclose'
          />
          <p className='pModalBodyOnClose'>{content}</p>
        </div>
        <div className='divModalFooterOnClose'>
          <button onClick={Save} className='btnsaveClose'>
            <FontAwesomeIcon icon={faFloppyDisk} className='iconSaveOnclose' />
            <p>Có</p>
          </button>
          <button onClick={Cancel} className='btncancelClose'>
            <FontAwesomeIcon icon={faXmark} className='iconCancelOnclose' />
            <p>Không</p>
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ModalDelete
