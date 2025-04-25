import { useState, useCallback } from 'react'

import { Modal } from '~/components/Modal'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import { getApiUrl } from '~/api/api'

function ModalTraNo ({ isOpen, onClose, idtrano, fetchdata, iddonno, fetchtrano }) {
  const [sotientra, setsotientra] = useState('')
  const { showToast } = useToast()

  const validateInputs = () => {
    let valid = true

    if (!sotientra) {
      showToast('Vui lòng nhập số tiền trả')
      valid = false
    }

    return valid
  }

  const handleModalTraNo = async () => {
    if (validateInputs()) {
      try {
        const response = await fetch(
          `${getApiUrl('domain')}/tranonhacungcap/${idtrano}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              payments: [
                {
                  iddonno: iddonno,
                  sotientra: Number(sotientra)
                }
              ]
            })
          }
        )

        if (response.ok) {
          fetchdata()
          fetchtrano()
          handelsave()
          showToast('trả nợ thành công')
        } else {
          showToast('trả nợ thất bại', 'error')
          onClose()
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu trả nợ:', error)
        showToast('trả nợ thất bại', 'error')
        onClose()
      }
    }
  }

  const resetForm = useCallback(() => {
    setsotientra('')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handelsave = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='divAddNhaCungCap'>
        <h2>Trả nợ lô hàng</h2>
        <div className='divtenkho'>
          <input
            type='number'
            className={`tenkho`}
            placeholder=''
            value={sotientra}
            onChange={e => {
              setsotientra(e.target.value)
            }}
          />
          <label htmlFor='' className='label'>
            Nhập số tiền trả (*)
          </label>
        </div>
        <button onClick={handleModalTraNo} className='btnAddNhaCungCap'>
          Trả Nợ
        </button>
        <button onClick={onClose} className='btnhuyAddNhaCungCap'>
          Hủy
        </button>
      </div>
    </Modal>
  )
}

export default ModalTraNo
