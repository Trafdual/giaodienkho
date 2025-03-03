import {
  faCircleQuestion,
  faRightFromBracket,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import { Modal } from '~/components/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function ModalDangXuat ({ dangxuat, Cancel, isOpen }) {
  return (
    <Modal isOpen={isOpen} onClose={Cancel}>
      <div className='divModalOnClose'>
        <h3 className='h3ModalOnClose'>Đăng xuất</h3>
        <div className='divModalBodyOnClose'>
          <FontAwesomeIcon
            icon={faCircleQuestion}
            className='iconBodyOnclose'
          />
          <p className='pModalBodyOnClose'>
           Bạn có chắc chắn là muốn đăng xuất?
          </p>
        </div>
        <div className='divModalFooterOnClose'>
          <button onClick={dangxuat} className='btnsaveClose'>
            <FontAwesomeIcon icon={faRightFromBracket} className='iconSaveOnclose' />
            <p>Đăng xuất</p>
          </button>
          <button onClick={Cancel} className='btncancelClose'>
            <FontAwesomeIcon icon={faXmark} className='iconCancelOnclose' />
            <p>Hủy bỏ</p>
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ModalDangXuat
