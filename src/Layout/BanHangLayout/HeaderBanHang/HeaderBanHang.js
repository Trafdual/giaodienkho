import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCaretDown, faMessage, faBell, faQuestion } from "@fortawesome/free-solid-svg-icons";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "./HeaderBanHang.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function HeaderBanHang({ userId }) {
  const [khoList, setKhoList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedKho, setSelectedKho] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  console.log(userId)

  // Fetch kho data using axios
  useEffect(() => {
    if (!userId) return;

    const fetchKhoData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://www.ansuataohanoi.com/getdepot/${userId}`);
        setKhoList(response.data);
      } catch (error) {
        console.error("Error fetching kho data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKhoData();
  }, [userId]);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleSelectKho = (kho) => {
    setSelectedKho(kho);
    setDropdownVisible(false); // Close dropdown after selection
  };

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/search-products?keyword=${keyword}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false); // Close dropdown when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="topbar1">
      <div className="logo">
        <img src="/path-to-logo.png" alt="Logo" />
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <FontAwesomeIcon className="icon-search" icon={faSearch} onClick={handleSearch} />
      </div>

      <div className="dropdown">
        <button className="dropdown-button" onClick={toggleDropdown}>
          {selectedKho ? selectedKho.name : "Chọn kho"}
          <FontAwesomeIcon icon={faCaretDown} />
        </button>
        {isDropdownVisible && (
          <ul className="dropdown-list" ref={dropdownRef}>
            {khoList.map((kho) => (
              <li key={kho._id} onClick={() => handleSelectKho(kho)}>
                {kho.name} - {kho.address}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="user">
        <div className="user-info">
          <img
            src="https://gcs.tripi.vn/public-tripi/tripi-feed/img/474014bom/anh-gai-xinh-cute-de-thuong-hot-girl-2.jpg"
            alt=""
          />
          <h4>{userId}</h4>
        </div>
        <div className="help">
          <Tippy content="Tin nhắn" placement="bottom">
            <button className="btn-icon">
              <FontAwesomeIcon className="icon-help" icon={faMessage} />
            </button>
          </Tippy>
          <Tippy content="Thông báo" placement="bottom">
            <button className="btn-icon">
              <FontAwesomeIcon className="icon-help" icon={faBell} />
            </button>
          </Tippy>
          <Tippy content="Trợ giúp" placement="bottom">
            <button className="btn-icon">
              <FontAwesomeIcon className="icon-help" icon={faQuestion} />
            </button>
          </Tippy>
        </div>
      </div>

      {isLoading && <div className="loading-overlay">Loading...</div>}
    </div>
  );
}

export default HeaderBanHang;
