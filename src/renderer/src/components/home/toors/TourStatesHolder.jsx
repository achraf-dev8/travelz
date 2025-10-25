import React from 'react'
import { StateCard } from '../filters/StateCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSliders } from '@fortawesome/free-solid-svg-icons'
import { AddButton } from '../add/AddButton'
import { useNavigate } from 'react-router-dom'


export const TourStatesHolder = ({main, active, tourStateEvent, setShowFilters }) => {
  const navigate = useNavigate();
  return (
    <div className="states-holder">
      <div className='states-row'>
        <StateCard text="All" active={active} event={tourStateEvent} />
        <StateCard text="Waiting" active={active} event={tourStateEvent} />
        <StateCard text="Active" active={active} event={tourStateEvent} />
        <StateCard text="Ended" active={active} event={tourStateEvent} />
        <StateCard text="Canceled" active={active} event={tourStateEvent} />
        <div onClick={setShowFilters} class="icon-container">
          <FontAwesomeIcon icon={faSliders} className='icon' />
        </div>
      </div>
      {main && (<AddButton state={"Add Tour"} noChange={true} onClick={()=>navigate('/add-tour')} />)}
    </div>

  )
}
