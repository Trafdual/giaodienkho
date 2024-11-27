import { Modal } from "~/components/Modal";
function ModalQrThanhToan({onClose,isOpen,Tongtien,sotk,nganhang,name}) {
    const noidung = 'Thanh toan hoa don'
    return ( 
        <Modal isOpen={isOpen} onClose={onClose}>
            <img src={`https://img.vietqr.io/image/VPB-17128052003-compact2.png?amount=${Tongtien}&addInfo=${noidung}&accountName=NGUYEN HOANG TRA`} alt="" />
        </Modal>
     );
}

export default ModalQrThanhToan;