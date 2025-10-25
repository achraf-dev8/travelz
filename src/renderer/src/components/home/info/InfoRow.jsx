import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faPerson, faUser } from '@fortawesome/free-solid-svg-icons'
import { PenItem } from './PenItem'

export const InfoRow = ({fullStyle, icon, type, info, edit = false, display = null, style}) => {
  return (
    
        <div className='info-row' style={fullStyle}>
            <div className='group type'>
                <FontAwesomeIcon 
                style={style} 
                icon={icon} className='icon'/>
                <p className='title'>{type}</p>
            </div>
        {!display ? (<div className='group info'>
                <p className='title'>{info}</p>
                 <PenItem edit={edit}/>
            </div>) :
            <div className='group info'>
            <div style={{width : '100px', alignItems: 'center'}} className={`state-display ${display}`}>
                <p>{display}</p>
            </div>
            <PenItem edit={edit}/>
            </div>
            }
        </div>
  )
}
