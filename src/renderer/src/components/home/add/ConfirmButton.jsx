import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const ConfirmButton = ({extra, name = "Confirm", onClick}) => {
  return (
      <div className={`add-button scale-hover confirm ${extra}`} onClick={extra != "disactive" ? onClick : null}>
        <p class="text">{name}</p>
      </div>
  )
}
