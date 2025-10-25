import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../../../styles/Search.css';

export const SearchField = ({setSearch, searchValue}) => {

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  return (
    <div className="search-field-container">
      <input
        placeholder="Search..."
        value={searchValue}
        onChange={(e)=>handleChange(e)}
      />
      <FontAwesomeIcon icon={faSearch} className="search-icon" />
    </div>
  );
};
