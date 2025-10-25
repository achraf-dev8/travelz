import React, { act, useRef } from 'react'
import { faAngleDown, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
 
export const FilterDropDown = ({remove = true,
  title, active, setFilterEvent, items = [], onClick = ()=>{}, document = false, hidden = false}) => {
  const ref = useRef(null);
  const rRemove = remove && items.length == 0 && !document &&  (active != "any" && active != "Undefined")
  return (
    <div className={`full-filter-dropdown ${hidden ? 'hidden': ''}`}>
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
          {rRemove && <div className='icon-container remove' onClick={setFilterEvent}>
                        <FontAwesomeIcon icon={faXmark} className="icon" />
                    </div>
          }
        </div>
    </div>
    
      
  )
}


