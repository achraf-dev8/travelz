import React, { useRef } from 'react'
import { FilterDropDown } from './FilterDropDown';

export const FilterCard = ({dialog = false, price, hidden, title, active, setFilterEvent, items = [], form = false}) => {
  return (
    <div className={`filter-container ${price ? 'price' : ''} ${form ? 'form' : ''}`}>
      {!dialog && <p style={title == "empty" ? {color:'transparent'} : {}} className='text'>{title}</p>}
      <FilterDropDown hidden={hidden} title={title} active={active} setFilterEvent={setFilterEvent} items={items} />
    </div>
  )
}

