import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const AddButton = ({state, extra = '', onClick, noChange = false}) => {
  return (
      <div className={`add-button scale-hover ${extra}`} onClick={onClick} >
        <p class="text">{state}</p>
        <FontAwesomeIcon icon={noChange || state == "Add" ? faPlus : faPen}/>
      </div>
  )
}
