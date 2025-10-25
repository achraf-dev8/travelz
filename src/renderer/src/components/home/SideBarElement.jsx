import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';

export const SideBarElement = ({icon, iconSize = 20, text, route}) => {
  const navigate = useNavigate();
  const {pages} = useAppStore();
  const currentPage = pages[0];
  return (
    <div className = {`side-bar-full-item ${currentPage == text ? 'active' : ''}`} onClick={() => navigate(route)}>
        <FontAwesomeIcon icon={icon} className="icon" style={{ fontSize: `${iconSize}px` }} />
        <span className='text'>{text}</span> 
    </div>
  )
}
