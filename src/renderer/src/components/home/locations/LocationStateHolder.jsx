import React from 'react'
import { AddButton } from '../add/AddButton'
import { SearchField } from '../SearchField'

export const LocationStateHolder = () => {
  return (
    <div className='states-holder'>
      <SearchField />
      <AddButton state={`Add Location`} noChange={true} />
    </div>
  )
}
