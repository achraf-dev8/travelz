import { faAngleDown, faAngleUp, faArrowUp, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const TableHeaderElement = ({name, sorting=true}) => {
  return (
    <th>
        <div className='header-container'>
            {name}
            {sorting && <div className='arrow-container up'>
                <div className='icon-container arrow'>
                <FontAwesomeIcon icon={faCaretUp}/>
                </div>
                <div className='icon-container arrow down'>
                <FontAwesomeIcon icon={faCaretDown}/>
                </div>
            </div>}
        </div>
    </th>
    
  )
}
