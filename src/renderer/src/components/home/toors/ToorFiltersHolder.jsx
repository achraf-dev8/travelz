import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { TourFilter } from './TourFilter'
import RangeToorFilter from './RangeToorFilter'

export const FiltersHolder = ({ setFilterEvent, activeFilters }) => {
  return (
    <div className=''>
      <div className="toor-filter-holder">
        <TourFilter title="Type" active={activeFilters["Type"]} items={["All", "Individual", "Group"]}
          setFilterEvent={setFilterEvent} />
        <TourFilter title="Destination" active={activeFilters["Destination"]} items={["All", "National", "International"]}
          setFilterEvent={setFilterEvent} />
        <TourFilter title="Transport" active={activeFilters["Transport"]} items={["All", "Bus", "Plane"]}
          setFilterEvent={setFilterEvent} />
        <TourFilter title="Umrah" active={activeFilters["Umrah"]} items={["All", "Umrah", "Not Umrah"]}
          setFilterEvent={setFilterEvent} />
      </div>
      <div className="toor-filter-holder range">
        <RangeToorFilter to={activeFilters["Departure Date To"]} from={activeFilters["Departure Date From"]} title="Departure Date" setFilterEvent={setFilterEvent} />
        <RangeToorFilter to={activeFilters["Return Date To"]} from={activeFilters["Return Date From"]} title="Return Date" setFilterEvent={setFilterEvent} />
      </div>
    </div>
  )
}
