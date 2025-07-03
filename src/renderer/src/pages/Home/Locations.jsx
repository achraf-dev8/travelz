import React from 'react'
import { Table } from '../../components/home/table/Table'
import { AddButton } from '../../components/home/add/AddButton'
import '../../styles/Locations.css'
import { LocationStateHolder } from '../../components/home/locations/LocationStateHolder'

export const Locations = () => {
    return (
        <>
            <LocationStateHolder />
            <hr className='divider' />
            <Table headerItems={[{ name: "Name" }, { name: "Age" }, { name: "Residence Location" }, { name: "Phone Number", sorting: false }, { name: "Payments" }, { name: "Added" }, { name: "State" }]} />
        </>
    )
}
