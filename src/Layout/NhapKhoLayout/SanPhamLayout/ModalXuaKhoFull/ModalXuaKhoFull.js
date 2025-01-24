/* eslint-disable react-hooks/exhaustive-deps */
import { useToast } from '../../../../components/GlobalStyles/ToastContext'
import { Modal } from '../../../../components/Modal'
function ModalXuaKhoFull ({
  isOpen,
  onClose,
  fetchData,
  selectedItems,
  setSelectedItems,
  setSelectAll,
  fetchlohang,
  idloaisp,
  khoID
}) {
  const { showToast } = useToast()

  const XuatKhoHangLoat = async () => {
    if (selectedItems.length > 0) {
      try {
        const response = await fetch(
          `https://ansuataohanoi.com/xuatkho1/${idloaisp}/${khoID}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              idsanpham1: selectedItems
            })
          }
        )
        const data = await response.json()

        if (data) {
          showToast(`Xuất kho thành công`)
          fetchData()
          fetchlohang()
          onClose()
          setSelectedItems([])
          setSelectAll(false)
        } else {
          console.error('Failed to fetch data')
          showToast('xuất kho thất bại', 'error')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    } else {
      showToast('Chưa chọn sản phẩm để xuất kho', 'error')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h4>Bạn có chắc chắn muốn xuất kho ?</h4>
      <button
        onClick={XuatKhoHangLoat}
        className='btnAddNhaCungCap
'
      >
        Xuất kho
      </button>
      <button onClick={onClose} className='btnhuyAddNhaCungCap'>
        Hủy
      </button>
    </Modal>
  )
}

export default ModalXuaKhoFull
