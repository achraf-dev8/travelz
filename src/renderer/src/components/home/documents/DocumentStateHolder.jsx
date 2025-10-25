import React from 'react'
import { SearchField } from '../main/SearchField'
import { AddButton } from '../add/AddButton'
import { StateCard } from '../filters/StateCard'

export const DocumentsStateHolder = ({setSearch, searchVal, active = "All", state, changeState =null}) => {
  return (
    <div className="states-holder">
      <div className='states-row'>
        <StateCard text="Documents" active={active} event={changeState} />
        <StateCard text="Visa" active={active} event={changeState} />
      </div>
      <SearchField searchValue={searchVal} setSearch={setSearch}/>
    </div>
  )
}

