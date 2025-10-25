import React, { useState, useRef } from 'react';

export const TableElement = ({ clickable, text = null }) => {
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

  text = text == '' ? null : text

  return (
    <td className={clickable && text != null && text != undefined
     ? 'clickable' : ''} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >

      <p onClick={clickable} style={{color : text == null ? 'grey': null}}>{text == null ||text == undefined  ? 'N/A' : text}    
      </p>
      <span  className={`custom-tooltip ${showTooltip}`}>{text == null ||text == undefined  ? 'N/A' : text}</span>
    </td>
  );
};
