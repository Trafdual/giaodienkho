import React from "react";
import Draggable from "react-draggable";
import "./TestLungTung.scss";
function DraggableModal() {
  const [isOpen, setIsOpen] = React.useState(true); // Modal mở sẵn khi load trang

  const closeModal = () => setIsOpen(false);

  if (!isOpen) return null;

  return (
    <Draggable handle=".modal-header">
      <div className="modal">
        <div className="modal-header">
          <span>Kéo Thả Modal</span>
          <button onClick={closeModal}>X</button>
        </div>
        <div className="modal-content">
          <p>Nội dung của modal. Kéo header để di chuyển modal này.</p>
        </div>
      </div>
    </Draggable>
  );
}

export default DraggableModal;
