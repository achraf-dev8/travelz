import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FilterCard } from '../filters/FilterCard'

export const DocumentsFilterHolder = ({ setFilterEvent, activeFilters, types}) => {
  return (

        <FilterCard title="Type" active={activeFilters["Type"]} items={types}
          setFilterEvent={setFilterEvent} />
  )
}
