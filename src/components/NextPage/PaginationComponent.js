import React, { useState, useEffect } from 'react';
import './PaginationComponent.scss';
import { Loading } from '../Loading';

const PaginationComponent = ({ 
    totalResults, 
    totalPages, 
    currentPage, 
    handlePageChange, 
    itemsPerPage, 
    setItemsPerPage,
    fetchData
}) => {
    const [pageInput, setPageInput] = useState(currentPage);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setPageInput(currentPage);
    }, [currentPage]);

    const handleReload = async () => {
      setIsLoading(true); // Bắt đầu trạng thái loading
    
      if (fetchData) {
          await fetchData();
          setIsLoading(false); // Dừng trạng thái loading khi fetchData xong
      } else {
          // Nếu không có fetchData, đặt thời gian dừng loading sau 2 giây
          setTimeout(() => {
              setIsLoading(false); // Dừng trạng thái loading sau 2 giây
          }, 2000);
      }
  };
  

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

    const start = ((currentPage || 1) - 1) * (itemsPerPage || 10) + 1;
    const end = Math.min((currentPage || 1) * (itemsPerPage || 10), totalResults || 0);

    return (
        <div className="pagination-container">
            {isLoading && <Loading />} {/* Hiển thị Loading khi đang tải */}

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

            <button onClick={handleReload}>⟳</button>

            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                <option value={5}>5</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
            </select>

            <span className="results-info">
                Hiển thị {start} - {end} trên {totalResults} kết quả
            </span>
        </div>
    );
};

export default PaginationComponent;
