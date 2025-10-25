import { faPlus, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const ConfirmButton = ({icon, style, type = "button", extra, name = "Confirm", onClick}) => {
  return (
    type === "submit" ?
      <button type={type} style={style} className={`add-button scale-hover confirm ${extra}`} onClick={extra != "disactive" ? onClick : null}>
        <p class="text">{name}</p>
        {icon && <FontAwesomeIcon icon={icon}/>}
      </button>: <div style={style} className={`add-button scale-hover confirm ${extra}`} onClick={extra != "disactive" ? onClick : null}>
        <p class="text">{name}</p>
        {icon && <FontAwesomeIcon icon={icon}/>}
      </div>
  )
}
