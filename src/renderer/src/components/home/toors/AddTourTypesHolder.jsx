import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FilterCard } from '../filters/FilterCard'

export const AddTourTypesHolder = ({ setFilterEvent, activeFilters }) => {
  return (
    <div className=''>
      <div className="toor-filter-holder">
        <FilterCard title="Type" active={activeFilters["Type"]} items={["Individual", "Group"]}
          setFilterEvent={setFilterEvent} />
        <FilterCard title="Location" active={activeFilters["Location"]} items={["National", "International"]}
          setFilterEvent={setFilterEvent} />
        <FilterCard title="Transport" active={activeFilters["Transport"]} items={["Bus", "Plane"]}
          setFilterEvent={setFilterEvent} />
      </div>
    </div>
  )
}



