import { faAngleDown, faAngleUp, faArrowUp, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const TableHeaderElement = ({name, onSortAsc, onSortDesc}) => {
  return (
    <th>
        <div className='header-container'>
            {name}
            {(onSortAsc || onSortDesc) && <div className='arrow-container up'>
                <div className='icon-container arrow' onClick={onSortAsc}>
                <FontAwesomeIcon icon={faCaretUp}/>
                </div>
                <div className='icon-container arrow down'>
                <FontAwesomeIcon icon={faCaretDown} onClick={onSortDesc}/>
                </div>
            </div>}
        </div>
    </th>
    
  )
}
