import React, { useState } from 'react'
import { TourStatesHolder } from './TourStatesHolder'
import '../../../styles/Toors.css';
import '../../../styles/Filters.css'
import { FiltersHolder } from './ToorFiltersHolder';
import { Table } from '../table/Table';


export const ToorsSection = ({main = false}) => {
  const [toorState, setToorState] = useState("All");

  const [activeFilters, setActiveFilters] = useState({
    "Type": "All", "Destination": "All", "Transport": "All", "Umrah": "All",
    "Departure Date From": "any", "Departure Date To": "any", "Return Date From": "any", "Return Date To": "any"
  });

  function setToorStateEvent(state) {
    setToorState(state);
  }

  function setFilterEvent(titles, names, ref = null) {
    setActiveFilters(prev => {
      const updatedFilters = { ...prev };

      titles.forEach((title, index) => {
        updatedFilters[title] = names[index];
      });

      return updatedFilters;
    });

    if (ref) {
      ref.current.classList.add("disactive");

      setTimeout(() => {
        ref.current.classList.remove("disactive");
      }, 10);
    }
  }

  return (
    <>
      <TourStatesHolder main={main} active={toorState} tourStateEvent={setToorStateEvent} />
      {main && (<hr className='divider'/>)}
      <FiltersHolder setFilterEvent={setFilterEvent} activeFilters={activeFilters} />
      <Table headerItems={[{name:"Location"},{name:"Departure Date"},{name:"Return Date"},{name:"Traveler"},{name:"Expenses"},{name:"Total Profit"},{name:"State"}]} />
    </>
  )
}
