import React, { useRef, useState } from 'react'
import { SideBarElement } from './SideBarElement'
import { faBus, faGaugeHigh, faGear, faHiking, faHistory, faHotel, faPassport, faPerson, faPlane, faPlaneArrival, faPlaneDeparture, faSuitcase, faSuitcaseRolling } from '@fortawesome/free-solid-svg-icons'
import icon from '../../assets/icon.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toursPath } from '../../routes'
import '../../styles/SideBar.css';

export const SideBar = ({}) => {
    const [minimized, setMinimized] = useState(false);
    function minimizeSideBar(event) {
        setMinimized(m=> !m);}

  return (
      <div className={`side-bar ${minimized ? "minmized" : ""}`}>
        <img src={icon} className='home-icon'/>
        <div className='dissmis-sidebar-button' onClick={minimizeSideBar}>
            <FontAwesomeIcon icon={faPlane} className={`icon ${minimized ? "rotate" : ""}`} />
        </div>
        <SideBarElement icon={faGaugeHigh} text={"Dashboard"}  route={'/dashboard'}/>
        <SideBarElement icon={faSuitcaseRolling} text={"Tours"} route={'/tours'}/>
        <SideBarElement icon={faPerson} text = {"Travelers"} route={'/travelers'}/>
        <SideBarElement icon={faHotel} text = {"Hotels"} iconSize={17} route={'/hotels'}/>
        <SideBarElement icon={faPlaneDeparture} text = {"Airports"} route={'/airports'}/>
        <SideBarElement icon={faBus} text = {"Buses"} route={'/buses'}/>
        <SideBarElement icon={faHiking} text = {"Guides"} route={'/guides'}/>
        <SideBarElement icon={faPassport} text = {"Documents"} route={'/documents'}/>
        <SideBarElement icon={faGear} text = {"Settings"} iconSize={17} route={'/settings'}/>              
      </div>
  )
}
