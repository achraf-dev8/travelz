import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { FilterCard } from '../home/filters/FilterCard'
import { setPriceCurr } from '../../functions/filters'

export const SettingsInfoItem = (  {display, setCurrency,
 flex, icon, widget
}) => {
  return (
    <div style={{
      paddingBlock : icon ? '3px' : '', flex, display : flex, alignItems : 'center'
    }} className={`input-container`}>
        
    <div className='fixed-container' style={{display : 'flex', alignItems : 'center', gap : '10px'}}>
            <div style={{display : 'flex', alignItems : 'center', gap : '10px'}}>
            <FontAwesomeIcon style={{fontSize : '22px'}} icon={icon} className='icon' color='var(--grey-dark)'/>
            <p style={{color : 'var(--grey-dark)'}}>{display}</p>
            </div>
             {widget}
          </div>

        </div>
        
  )
}
