import { faArrowRightToBracket, faGear, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { AccountDropDownItem } from './AccountDropDownItem'

export const AccountDropdown = ({ state }) => {

  return (
    <ul className={`account-dropdown dropdown ${state ? "active" : ""}`}>
      <AccountDropDownItem name="Profile" icon={faUser} />
      <AccountDropDownItem name="Settings" icon={faGear} />
      <div className='divider-container'>
        <hr className='divider' />
      </div>
      <AccountDropDownItem name="Log out" icon={faArrowRightToBracket} />
      
    </ul>
  )
}

