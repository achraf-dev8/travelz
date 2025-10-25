import React from "react";
import { format } from "timeago.js";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export const NotificationsDropdown = ({ state, notifications, fetchMore, hasMore, loading }) => {

  console.log("notificatiosfkpfdk^pk^fpd notificatio",  notifications)
  const handleLoadMore = async (e) => {
    e.stopPropagation(); 
    await fetchMore(e)
  };

  const handleScroll = (e) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target;
  
  // Calculate how far from the bottom we are
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
  
  // Load more when we're within 50px of the bottom
  if (distanceFromBottom <= 50 && hasMore && !loading) {
    fetchMore();
  }
};

  return (
    <ul className={`notifications-dropdown dropdown ${state ? "active" : ""}`} onScroll={handleScroll}>
      { notifications.map((item, i) => (
        <div className='notifications-dropdown-element' key={i}>
          <p>{item.notification}</p>
          <p className='time'>{format(item.creation_date)}</p>
        </div>
      ))}

      {loading &&  <div className="spinner"></div>}
    </ul>
  );
};

