import { faPerson } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const SelectElementItem = ({icon, enabled, onClick, name}) => {
  
  return (
          <div className={`select-item ${enabled ? "active" : ""}`}onClick={enabled ? onClick : null} 
          style={{color : (name == "Delete" && enabled) ? "var(--red)" : "default"}}>
            <FontAwesomeIcon icon={icon} style={{fontSize : "12px"}}/>
            <p>{name}</p>
          </div>
  )
}
