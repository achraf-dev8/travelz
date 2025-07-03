import React, { useState } from 'react'
import { Table } from '../../components/home/table/Table'
import { TravelersStatesHolder } from '../../components/home/travelers/TravelersStatesHolder'

export const Travelers = () => {
    const [travelersState, setTravelersState] = useState("Travelers");
      function setTravelersStateEvent(state) {
      setTravelersState(state); }


  return (
    <>
        <TravelersStatesHolder active={travelersState} travelerStateEvent={setTravelersStateEvent} state={travelersState=="Travelers"?
            "Traveler" : "Family"}/>
        <hr className='divider' />
        <Table headerItems={[{ name: "Name" }, { name: "Age" }, { name: "Residence Location" }, { name: "Phone Number", sorting: false }, { name: "Payments" }, { name: "Added" }, { name: "State" }]}/>
    </>
  )
}
 