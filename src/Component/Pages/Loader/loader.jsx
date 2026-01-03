// src/Component/Common/Loader/Loader.jsx
import React from "react";

const Loader = ({ active, children }) => {
  return (
    <div className="loader-wrapper">
      {active && (
        <div className="loader-overlay">
          <div className="spinner"></div>
          <p className="text-white">Loading...</p>
        </div>
      )}
      {children}
    </div>
  );
};

export default Loader;
