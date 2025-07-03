import React from 'react'
import { StateCard } from '../filters/StateCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSliders } from '@fortawesome/free-solid-svg-icons'
import { AddButton } from '../add/AddButton'


export const TourStatesHolder = ({main, active, tourStateEvent }) => {
  return (
    <div className="states-holder">
      <div className='states-row'>
        <StateCard text="All" active={active} event={tourStateEvent} />
        <StateCard text="Active" active={active} event={tourStateEvent} />
        <StateCard text="Completed" active={active} event={tourStateEvent} />
        <div class="icon-container">
          <FontAwesomeIcon icon={faSliders} className='icon' />
        </div>
      </div>
      {main && (<AddButton state={"Add Tour"} noChange={true} />)}
    </div>

  )
}
