import React, { useState,useEffect  } from 'react';
import './PaginationComponent.scss';
const PaginationComponent = ({ totalPages, currentPage, handlePageChange, itemsPerPage, setItemsPerPage }) => {
    const [pageInput, setPageInput] = useState(currentPage);
  
    // Cập nhật pageInput khi currentPage thay đổi
    useEffect(() => {
      setPageInput(currentPage);
    }, [currentPage]);
  
    const handleInputChange = (e) => {
      const value = e.target.value;
      if (value >= 1 && value <= totalPages) {
        setPageInput(value);
        handlePageChange(Number(value));
      }
    };
  
    const handleItemsPerPageChange = (e) => {
      setItemsPerPage(Number(e.target.value));
    };
  
    return (
      <div className="pagination-container">
        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
          ««
        </button>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          «
        </button>
  
        <span>Trang</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={pageInput}
          onChange={handleInputChange}
        />
        <span>trên {totalPages}</span>
  
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          »
        </button>
        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
          »»
        </button>
  
        <button onClick={() => handlePageChange(currentPage)}>
          ⟳
        </button>
  
        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value={5}>5</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    );
  };
  
  export default PaginationComponent;