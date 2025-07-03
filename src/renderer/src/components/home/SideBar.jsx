import React, { useRef, useState } from 'react'
import { SideBarElement } from './SideBarElement'
import { faGaugeHigh, faHistory, faPassport, faPerson, faPlane, faPlaneArrival, faSuitcase, faSuitcaseRolling } from '@fortawesome/free-solid-svg-icons'
import icon from '../../assets/icon.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toursPath } from '../../routes'
import '../../styles/SideBar.css';

export const SideBar = ({currentPage, setCurrentPageEvent}) => {
    const [minimized, setMinimized] = useState(false);
    function minimizeSideBar(event) {
        setMinimized(m=> !m);
    }
  return (
      <div className={`side-bar ${minimized ? "minmized" : ""}`}>
        <img src={icon} className='home-icon'/>
        <div className='dissmis-sidebar-button' onClick={minimizeSideBar}>
            <FontAwesomeIcon icon={faPlane} className={`icon ${minimized ? "rotate" : ""}`} />
        </div>
        <SideBarElement icon={faGaugeHigh} text={["Dashboard"]} currentPage = {currentPage} setCurrentPageEvent={setCurrentPageEvent}/>
        <SideBarElement page={toursPath} icon={faSuitcaseRolling} text={["Tours"]} currentPage = {currentPage} setCurrentPageEvent={setCurrentPageEvent}/>
        <SideBarElement icon={faHistory} text = {["History"]} currentPage = {currentPage} iconSize={17} setCurrentPageEvent={setCurrentPageEvent}/>
        <SideBarElement icon={faPerson} text = {["Travelers"]} currentPage = {currentPage} setCurrentPageEvent={setCurrentPageEvent}/>
        <SideBarElement icon={faPassport} text = {["Documents"]} currentPage = {currentPage} setCurrentPageEvent={setCurrentPageEvent}/>           
      </div>
  )
}
