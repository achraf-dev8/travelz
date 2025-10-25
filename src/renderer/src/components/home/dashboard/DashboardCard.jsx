import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const DashboardCard = ({
  display,
  value, curr, onClick
}) => {
  return (
    <div style={{paddingBlock : ''}} className={`input-container`}>
      <div className='fixed-container' style={{paddingBlock : '', display : 'block'}}>
        <p style={{fontSize: "15px"}}>{display}</p>
        <div style={{height : '5px'}}></div>
        <p style={{fontSize: "21px", fontWeight : '500'}}>{value}
          <span onClick={onClick} style={{fontSize: "18px", cursor:'pointer'}}>{` ${curr}`}</span>
        </p>
          
      </div>
    </div>
  );
};
