import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FilterCard } from '../filters/FilterCard'
import {RangeToorFilter} from '../filters/RangeToorFilter'

export const ToorsFiltersHolder = ({ setFilterEvent, activeFilters, helpers = true }) => {
  return (
    <div className=''>
      <div className="toor-filter-holder">
        <FilterCard title="Type" active={activeFilters["Type"]} items={["All", "Individual", "Group"]}
          setFilterEvent={setFilterEvent} />
        <FilterCard title="Location" active={activeFilters["Location"]} items={["All", "National", "International"]}
          setFilterEvent={setFilterEvent} />
        <FilterCard title="Transport" active={activeFilters["Transport"]} items={["All", "Bus", "Plane"]}
          setFilterEvent={setFilterEvent} />
        <FilterCard title="Umrah" active={activeFilters["Umrah"]} items={["All", "Umrah", "Not Umrah"]}
          setFilterEvent={setFilterEvent} />
      </div>
      {helpers && (      <div className="toor-filter-holder range">
        <RangeToorFilter to={activeFilters["Departure Date To"]} from={activeFilters["Departure Date From"]} title="Departure Date" setFilterEvent={setFilterEvent} />
        <RangeToorFilter to={activeFilters["Return Date To"]} from={activeFilters["Return Date From"]} title="Return Date" setFilterEvent={setFilterEvent} />
      </div>)}

    </div>
  )
}
