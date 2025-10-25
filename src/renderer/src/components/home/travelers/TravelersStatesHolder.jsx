import React from 'react'
import { StateCard } from '../filters/StateCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSliders } from '@fortawesome/free-solid-svg-icons'
import { AddButton } from '../add/AddButton'
import { SearchField } from '../main/SearchField'
import { useNavigate } from 'react-router-dom'


export const TravelersStatesHolder = ({setSearch, searchVal}) => {
  const navigate = useNavigate()
  return (
    <div className="states-holder">
      <SearchField searchValue={searchVal} setSearch={setSearch}/>
      <AddButton state={`Add Traveler`} noChange={true} onClick={()=>navigate('/add-traveler')}/>
    </div>

  )
}



