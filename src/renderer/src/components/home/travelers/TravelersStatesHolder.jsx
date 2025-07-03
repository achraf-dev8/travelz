import React from 'react'
import { StateCard } from '../filters/StateCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSliders } from '@fortawesome/free-solid-svg-icons'
import { AddButton } from '../add/AddButton'
import { SearchField } from '../SearchField'


export const TravelersStatesHolder = ({ active, travelerStateEvent, state }) => {
  return (
    <div className="states-holder">
      <div className='states-row'>
        <StateCard text="Travelers" active={active} event={travelerStateEvent} />
        <StateCard text="Families" active={active} event={travelerStateEvent} />
      </div>
      <SearchField />
      <AddButton state={`Add ${state}`} noChange={true} />
    </div>

  )
}



