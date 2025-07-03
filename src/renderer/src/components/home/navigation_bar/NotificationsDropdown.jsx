import { faArrowRightToBracket, faGear, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { AccountDropDownItem } from './AccountDropDownItem'

export const NotificationsDropdown = ({ state }) => {
  const items = [
    "The tour #5878458 was ended",
    "The tour #5878458 was not ended",
    "The tour #58kpkf78458 was ended jfojfojf",
    "The tour #1234567 was started",
    "The tour #7654321 was delayed",
    "The tour #9988776 was ended successfully",
    "The tour #4567890 encountered an issue",
    "The tour #1029384 was canceled",
    "The tour #5647382 is ongoing",
    "The tour #8374652 was not ended",
    "The tour #1111111 is awaiting confirmation",
    "The tour #2222222 was completed",
    "The tour #3333333 has no data",
    "The tour #4444444 was interrupted",
    "The tour #5555555 is under review",
    "The tour #6666666 was ended early",
    "The tour #7777777 was ended late",
    "The tour #8888888 was successful",
    "The tour #9999999 needs attention",
    "The tour #0000001 is pending approval",
    "The tour #1010101 was rejected",
    "The tour #2020202 was approved",
    "The tour #3030303 has a warning",
    "The tour #4040404 was restored",
    "The tour #5050505 was archived",
    "The tour #6060606 was modified",
    "The tour #7070707 was viewed",
    "The tour #8080808 was not started",
    "The tour #9090909 has feedback",
    "The tour #1212121 was completed successfully"
  ];

  return (
    <ul className={`notifications-dropdown dropdown ${state ? "active" : ""}`}>
      {items.map((item, i) => (<div className='notifications-dropdown-element' key={i} onClick={() => { }}>
        <p>{item}</p>
        <p className='time'>3 seconds ago</p>
      </div>))}
    </ul>
  )
}