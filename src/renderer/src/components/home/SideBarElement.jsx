import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Navigate, useNavigate } from 'react-router-dom';

export const SideBarElement = ({icon, iconSize = 20, text, currentPage, setCurrentPageEvent, page}) => {
  
  return (
    <div className = {`side-bar-full-item ${currentPage == text ? 'active' : ''}`} onClick={() => setCurrentPageEvent(text)}>
        <FontAwesomeIcon icon={icon} className="icon" style={{ fontSize: `${iconSize}px` }} />
        <span className='text'>{text}</span> 
    </div>
  )
}
