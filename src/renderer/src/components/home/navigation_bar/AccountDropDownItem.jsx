
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const AccountDropDownItem = ({name, icon}) => {
  return (
    <li>
        <p>{name}</p>
        <FontAwesomeIcon icon={icon} className="icon" />
    </li>
  )
}
