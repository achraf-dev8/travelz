import { faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const PenItem = ({edit, style, icon}) => {
  icon = icon ? icon : faPen
  return (
     <div className={`icon-container ${!edit ? 'blank' : ""}`} onClick={edit}>
                    <FontAwesomeIcon style={style} icon={icon} className='icon' color='var(--primary-color)'/>
      </div>
  )
}
