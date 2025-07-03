import React, { useState } from 'react'
import { TourStatesHolder } from '../../components/home/toors/TourStatesHolder'
import '../../styles/Toors.css';
import '../../styles/Filters.css'
import { FiltersHolder } from '../../components/home/toors/ToorFiltersHolder';
import { Table } from '../../components/home/table/Table';
import { ToorsSection } from '../../components/home/toors/ToorsSection';


export const Toors = () => {

  return (
    <>
      <ToorsSection main={true}/>
    </>
  )
}
