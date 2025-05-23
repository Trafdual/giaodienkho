import { useState } from 'react'

import { Modal } from '../../../../components/Modal'
import { FormAddTay } from './FormAddTay'
import { FormAddImel } from './FormAddImel'

function AddSanPham ({ isOpen, onClose, loaispid, fetchData, fetchlohang }) {
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
          <button onClick={OpenFormAddTay} className='btnAddNhaCungCap'>
            Nhập dữ liệu
          </button>
          <div className='separator'>
            <span>Hoặc</span>
          </div>
          <button onClick={OpenFormAddImel} className='btnhuyAddNhaCungCap'>
            Quét Mã Imel
          </button>
        </div>
      </Modal>
      <FormAddTay
        isOpen={isOpenForm}
        onClose={() => setIsOpenForm(false)}
        loaispid={loaispid}
        fetchData={fetchData}
        fetchlohang={fetchlohang}
      />
      <FormAddImel
        isOpen={isOpenFormImel}
        onClose={() => setIsOpenFormImel(false)}
        loaispid={loaispid}
        fetchData={fetchData}
      />
    </>
  )
}

export default AddSanPham
