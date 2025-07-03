import React, { useState, useRef } from 'react';

export const TableElement = ({ clickable, text }) => {
  const [showTooltip, setShowTooltip] = useState("");
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setShowTooltip("active");
    }, 1000); // 2 seconds
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setShowTooltip("");
  };

  return (
    <td className={clickable ? 'clickable' : ''} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >

      <p>{text}</p>
      <span className={`custom-tooltip ${showTooltip}`}>{text}</span>
    </td>
  );
};
