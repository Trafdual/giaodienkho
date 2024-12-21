import React from "react";
import "./ThanhDinhHuong.scss"; 
function ThanhDinhHuong({ breadcrumbs, placeholder, onSearch }) {
  return (
    <div className="app-container1">
      <nav className="breadcrumbs">
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            {breadcrumb.link ? (
              <a href={breadcrumb.link} className="breadcrumb-link">
                {breadcrumb.label}
              </a>
            ) : (
              <span className="breadcrumb-current">{breadcrumb.label}</span>
            )}
            {index < breadcrumbs.length - 1 && (
              <span className="breadcrumb-separator">&gt;</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      <div className="search-tq">
        <input
          type="text"
          placeholder={placeholder || "Search..."}
          className="search-input-tq"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && onSearch) onSearch(e.target.value);
          }}
        />
        <button 
          className="search-button-tq" 
          onClick={() => {
            const input = document.querySelector('.search-input');
            if (onSearch) onSearch(input.value);
          }}
        >
          <span className="search-icon">🔍</span>
        </button>
      </div>
    </div>
  );
}

export default ThanhDinhHuong;
