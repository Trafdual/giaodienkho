import { useState } from 'react'

import { Modal } from '../../../../components/Modal'
import { FormAddTay } from './FormAddTay'
import { FormAddImel } from './FormAddImel'

function AddSanPham ({ isOpen, onClose, loaispid, setsanpham }) {
  const [isOpenForm, setIsOpenForm] = useState(false)
  const [isOpenFormImel, setIsOpenFormImel] = useState(false)

  const OpenFormAddTay = () => {
    setIsOpenForm(true)
    onClose()
  }
  const OpenFormAddImel = () => {
    setIsOpenFormImel(true)
    onClose()
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className='divAddSanPham'>
          <h2>Thêm sản phẩm</h2>
          <button onClick={OpenFormAddTay} className='btnAddLoHang'>
            Nhập dữ liệu
          </button>
          <div className='separator'>
            <span>Hoặc</span>
          </div>
          <button onClick={OpenFormAddImel} className='btnhuyAddLoHang'>
            Quét Mã Imel
          </button>
        </div>
      </Modal>
      <FormAddTay
        isOpen={isOpenForm}
        onClose={() => setIsOpenForm(false)}
        loaispid={loaispid}
        setsanpham={setsanpham}
      />
      <FormAddImel
        isOpen={isOpenFormImel}
        onClose={() => setIsOpenFormImel(false)}
        loaispid={loaispid}
        setsanpham={setsanpham}
      />
    </>
  )
}

export default AddSanPham