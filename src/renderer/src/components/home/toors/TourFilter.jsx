import React, { useRef } from 'react'
import { FilterDropDown } from './FilterDropDown';

export const TourFilter = ({title, active, setFilterEvent, items = []}) => {
  return (
    <div className='filter-container'>
        <p className='text'>{title}</p>
        <FilterDropDown title={title} active={active} setFilterEvent={setFilterEvent} items={items}/>
    </div>
  )
}

