import React from 'react'
import { faEye, faPen, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { color } from 'chart.js/helpers';
import { PenItem } from '../home/info/PenItem';
import { PriceInput } from '../inputs/PriceInput';
import { setPriceCurr } from '../../functions/filters';
import { FilterCard } from '../home/filters/FilterCard';

export const ProfileInfoItem = ({
  display, value, flex, icon , onClick
}) => {
  return ( 
    <div style={{
      paddingBlock : icon ? '3px' : '', flex
    }} className={`input-container`}>
       <div style={{display : 'flex', alignItems : 'center', gap : '5px'}}>
        <FontAwesomeIcon style={{fontSize : '15px'}} icon={icon} className='icon' color='var(--grey-dark)'/>
        <p style={{color : 'var(--grey-dark)'}}>{display}</p>
      </div>
      <div className='fixed-container' style={{paddingBlock : '3px'}}>
        <>
        <p style={{fontSize: "1.15vw", fontWeight : '500'}}>{value}</p>
        <PenItem edit={onClick} style={{fontSize : '20px'}}/>  
      </>
        
      </div>
    </div>
  );
};