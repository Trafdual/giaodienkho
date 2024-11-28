import { Modal } from "~/components/Modal";
function ModalQrThanhToan({onClose,isOpen,Tongtien,sotk,nganhang,name}) {
    const noidung = 'Thanh toan hoa don'
    return ( 
        <Modal isOpen={isOpen} onClose={onClose}>
            <img src={`https://img.vietqr.io/image/MB-2220198032222-compact2.png?amount=${Tongtien}&addInfo=${noidung}&accountName=NGUYEN NGOC CHIEN`} alt="" />
        </Modal>
     );
}

export default ModalQrThanhToan;