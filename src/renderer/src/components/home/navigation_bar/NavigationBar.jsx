import { faAngleRight, faArrowLeft, faArrowRight, faBell, faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AccountDropdown } from './AccountDropdown'
import { NotificationsDropdown } from './NotificationsDropdown'
import { useEffect, useRef, useState } from 'react'
import '../../../styles/NavigationBar.css';
import { NavigationType, useNavigate, useNavigationType } from 'react-router-dom'


export const NavigationBar = ({ hidden, page, canGoBack, goBack }) => {
  const [notificationsState, setNotificationsState] = useState(false);
  const [accountState, setAccountState] = useState(false);
  const notificationElement = document.querySelector('.notifications');
  const accountElement = document.querySelector('.account-container');

  useEffect(() => {

    const handleClick = (event) => {
      if (notificationElement && !notificationElement.contains(event.target)) {
        setNotificationsState(false);
      }

      if (accountElement && !accountElement.contains(event.target)) {
        setAccountState(false);
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [notificationsState]);

  function toggleNotifications() {
    setNotificationsState(n => !n);
  }
  function toggleAccount() {
    setAccountState(n => !n);
  }

  return (
    <div className={`navigation-bar ${hidden}`}>
    <span style={{display:"flex", alignItems:"end"}}>
        <div className={`navigation-buttons ${!canGoBack ? 'disactive' : ''}`}>
      <div className="back scale-hover" onClick={goBack}>
          <FontAwesomeIcon icon={faArrowLeft} className="icon" />
      </div>
      </div>
        
      <h1 className="title-holder">
      {page.map((item, index) => {
        const isLast = index === page.length - 1;
        return (
          <>
            {!isLast ? (
              <span className='sub-page'>
                <span className="link">{item}</span>
                <FontAwesomeIcon icon={faAngleRight} className="breadcrumb-separator" />
              </span>
            ) : (
              <span className="current">{item}</span>
            )}
          </>
        );
      })}

      
    </h1>
    </span>
      <div className="navigation-buttons">
        <div className="notifications scale-hover" onClick={toggleNotifications}>
          <FontAwesomeIcon icon={faBell} className="icon" />
          <div className='new-notification active'>
            <p className='count'>15</p>
          </div>
          <NotificationsDropdown state={notificationsState} />
        </div>
        <div className='account-container' onClick={toggleAccount}>
          <div className="account scale-hover">
            <FontAwesomeIcon icon={faCircleUser} className="icon" />
          </div>
          <AccountDropdown state={accountState} />
        </div>
      </div>
    </div>
  )
}
