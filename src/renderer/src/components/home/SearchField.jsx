import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import '../../styles/Search.css'

export const SearchField = () => {
  return (
    <div className='search-field-container'>
        <input placeholder='Search...' />
      <FontAwesomeIcon icon={faSearch} className="search-icon" />
    </div>
  )
}
