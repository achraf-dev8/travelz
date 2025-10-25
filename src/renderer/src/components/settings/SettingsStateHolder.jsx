import React from 'react'
import { StateCard } from '../home/filters/StateCard'
import { faGear, faHotdog, faHouseUser, faUser, faUserTie } from '@fortawesome/free-solid-svg-icons'

export const SettingsStateHolder = ({active, event}) => {
  return (
    <div className='states-row' style={{justifyContent : 'start'}}>
        <StateCard active={active} text={"Profile"} icon = {faUser} event={event}/>
        <StateCard active={active} text={"Settings"} icon = {faGear} event={event}/>
        <StateCard active={active} text={"Agency"} icon = {faHouseUser} event={event}/>
    </div>
  )
}
