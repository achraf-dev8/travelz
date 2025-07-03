import React, { act, useRef } from 'react'
import { faAngleDown, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
export const FilterDropDown = ({title, active, setFilterEvent, items = [], onClick = ()=>{}}) => {
  const ref = useRef(null);
  return (
    <div className='full-filter-dropdown'>
        <div className='filter-dropdown' onClick={onClick}>
            <div className={`tour-filter`}>
                <p>{active}</p>
                {items.length != 0 && <FontAwesomeIcon icon={faAngleDown} className="icon" />}
            </div>
            <ul className='dropdown' ref={ref}>
              {items.map((item, i) =>  (<li key={i} onClick={()=>setFilterEvent([title], [item], ref)}>{item}</li>))}     
            </ul>
        </div> 
        <div>
          {items.length == 0 && active != "any" && 
                    <div className='icon-container remove' onClick={setFilterEvent}>
                        <FontAwesomeIcon icon={faXmark} className="icon" />
                    </div>
          }
        </div>
    </div>
    
      
  )
}


