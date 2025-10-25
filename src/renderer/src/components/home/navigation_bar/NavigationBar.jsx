import { faAngleRight, faArrowLeft, faBell, faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AccountDropdown } from './AccountDropdown'
import { NotificationsDropdown } from './NotificationsDropdown'
import { useEffect, useState } from 'react'
import '../../../styles/NavigationBar.css';
import { apiGet } from '../../../functions/api';
import React from 'react';
import { useAppStore } from '../../../store'


export const NavigationBar = ({ hidden, page, canGoBack, goBack }) => {
  const {notifications, setNotifications, unRead, setUnRead} = useAppStore();

  const [opened, setOpened] = useState(false);
  const [notificationsState, setNotificationsState] = useState(false);
  const [accountState, setAccountState] = useState(false);

  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (event) => {
      if (!event.target.closest('.notifications')) {
        setNotificationsState(false);
      }
      if (!event.target.closest('.account-container')) {
        setAccountState(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // 🔥 Fetch first page of notifications when component mounts
  useEffect(() => {
    fetchNotifications(1);
  }, []);

  // 🔥 Fetch notifications page by page
  async function fetchNotifications(nextPage = 1) {
    if (loading || nextPage > totalPages) return;
    setLoading(true);
    
    const { data, error } = await apiGet('/notifications', {
      params: { page: nextPage, limit: 10 },
    });

   /* // Simple delay function
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  await delay(2000);
*/

    if (!error) {
      if (nextPage === 1) {
        setNotifications(data.notifications);
        setUnRead(data.unread); // This is the array of unread notifications
      } else {
        setNotifications((prev) => [...prev, ...data.notifications]);
      }
      setTotalPages(data.totalPages);
      setPageNum(nextPage);

    } else {
      console.error("Failed to fetch notifications", error);
    }

    setLoading(false);
  }

  async function toggleNotifications() {
    setOpened(true)
    const newState = !notificationsState;
    setNotificationsState(newState);

    // Optional: Refresh notifications when opening dropdown
    if (newState) {
      await fetchNotifications(1);
    }
  }

  function toggleAccount() {
    setAccountState(n => !n);
  }

  return (
    <div className={`navigation-bar ${hidden}`}>
      <span style={{ display: "flex", alignItems: "end" }}>
        <div className={`navigation-buttons ${!canGoBack ? 'disactive' : ''}`}>
          <div className="back scale-hover" onClick={goBack}>
            <FontAwesomeIcon icon={faArrowLeft} className="icon" />
          </div>
        </div>

        <h1 className="title-holder">
          {page.map((item, index) => {
            const isLast = index === page.length - 1;
            return (
              <span key={index}>
                {!isLast ? (
                  <span className='sub-page'>
                    <span className="link">{item}</span>
                    <FontAwesomeIcon icon={faAngleRight} className="breadcrumb-separator" />
                  </span>
                ) : (
                  <span className="current">{item}</span>
                )}
              </span>
            );
          })}
        </h1>
      </span>

      <div className="navigation-buttons">
        {/* 🔔 Notifications */}
        <div className="notifications scale-hover" onClick={toggleNotifications}>
          <FontAwesomeIcon icon={faBell} className="icon" />
          {!opened && unRead.length > 0 && ( // Check if the unRead array has items
            <div className='new-notification active'>
              <p className='count'>{unRead.length}</p> {/* Show count of unread items */}
            </div>
          )}
          <NotificationsDropdown
            state={notificationsState}
            notifications={notifications}
            loading={loading}
            hasMore={pageNum < totalPages}
            fetchMore={() => fetchNotifications(pageNum + 1)}
          />
        </div>

        {/* 👤 Account */}
        <div className='account-container' onClick={toggleAccount}>
          <div className="account scale-hover">
            <FontAwesomeIcon icon={faCircleUser} className="icon" />
          </div>
          <AccountDropdown state={accountState} />
        </div>
      </div>
    </div>
  );
};