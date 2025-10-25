import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const AddButton = ({type = "button", state, extra = '', onClick, noChange = false}) => {
  return (
      <button className={`add-button scale-hover ${extra}`} onClick={onClick} type= {type} 
      style={{display : 'flex', gap : '20px', paddingInline : '15px'}}
      >
        <p class="text" style={{fontSize : '16px'}}>{state}</p>
        <FontAwesomeIcon icon={noChange || state == "Add" ? faPlus : faPen}/>
      </button>
  )
}
