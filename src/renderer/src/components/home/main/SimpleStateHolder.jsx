import React from 'react'
import { SearchField } from './SearchField'
import { AddButton } from '../add/AddButton'
import { useNavigate } from 'react-router-dom'

export const SimpleStateHolder = ({setSearch, searchVal, subject, route}) => {
  const navigate = useNavigate()
  return (
    <div className="states-holder">
      <SearchField searchValue={searchVal} setSearch={setSearch}/>
      <AddButton state={`Add ${subject}`} noChange={true} onClick={()=>navigate(route)} />
    </div>

  )
}

