import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faPerson, faUser } from '@fortawesome/free-solid-svg-icons'

export const InfoRow = ({icon, type, info, edit = true}) => {
  return (
        <div className='info-row'>
            <div className='group type'>
                <FontAwesomeIcon icon={icon} className='icon'/>
                <p className='title'>{type}</p>
            </div>
            <div className='group info'>
                <p className='title'>{info}</p>
                <div className={`icon-container ${!edit ? 'blank' : ""}`} onClick={edit}>
                    <FontAwesomeIcon icon={faPen} className='icon'/>
                </div>
            </div>
        </div>
  )
}
