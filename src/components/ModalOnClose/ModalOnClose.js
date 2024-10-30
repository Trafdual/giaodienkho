import { faCircleQuestion, faFileCircleXmark, faFloppyDisk, faXmark } from '@fortawesome/free-solid-svg-icons'
import { Modal } from '../Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './ModalClose.scss'

function ModalOnClose ({ Save, DontSave, Cancel, isOpen }) {
  return (
    <Modal isOpen={isOpen} onClose={Cancel}>
      <div className='divModalOnClose'>
        <h3 className='h3ModalOnClose'>Dữ liệu chưa được lưu</h3>
        <div className='divModalBodyOnClose'>
          <FontAwesomeIcon
            icon={faCircleQuestion}
            className='iconBodyOnclose'
          />
          <p className='pModalBodyOnClose'>
            Dữ liệu đã thay đổi, bạn có muốn lưu không?
          </p>
        </div>
        <div className='divModalFooterOnClose'>
          <button onClick={Save} className='btnsaveClose'>
            <FontAwesomeIcon
              icon={faFloppyDisk}
              className='iconSaveOnclose'
            />
            <p>Lưu</p>
          </button>
          <button onClick={DontSave} className='btndontsaveClose'>
           <FontAwesomeIcon
              icon = { faFileCircleXmark }
              className='iconDontSaveOnclose'
            />
            <p>Không lưu</p>
          </button>
          <button onClick={Cancel} className='btncancelClose'>
           <FontAwesomeIcon
              icon={faXmark}
              className='iconCancelOnclose'
            />
            <p>Hủy bỏ</p>
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ModalOnClose
