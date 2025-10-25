import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const FixedInputContainer = ({
  display,
  value, flex, icon , onClick
}) => {
  return (
    <div style={{paddingBlock : icon ? '3px' : '', flex}} className={`input-container`}>
      <p style={display == "empty" ? {color : "transparent"} : {}}>{display}</p>
      <div className='fixed-container' style={{paddingBlock : icon ? '3px' : ''}}>
        <p style={{fontSize: "1.1vw"}}>{value}</p>
        {icon && (
          <div style={{padding : '7px'}} className='icon-container' onClick={onClick}>
            <FontAwesomeIcon style={{fontSize : '20px'}} icon={icon} className='icon' color='var(--grey-dark)'/>
          </div>   
        )
          }
      </div>
    </div>
  );
};
