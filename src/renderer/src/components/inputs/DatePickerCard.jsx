import { faCalendarAlt, faCalendarDay, faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef, useState } from 'react'
import Calender from '../home/Calender'
import { formatDate } from '../../functions/dates'

export const DatePickerCard = ({ name, setDate, date, hidden }) => {
  const refDialog = useRef(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function toggleDialog() {
    if (!refDialog.current) return;

    if (refDialog.current.hasAttribute("open")) {
      refDialog.current.close();
      setDialogOpen(false)
    } else {
      refDialog.current.showModal();
      setDialogOpen(true)
    }
  }

  function confirm(date) {
    setDate(date)
    toggleDialog()
  }

  return (
    <div className={`date-picker-card-container ${hidden ? 'hidden' : ''}`}>
      <p>{name}</p>
      <div className='input-container date-picker-card' onClick={(e) => {
        if (e.currentTarget === e.target) {
          toggleDialog();
        }
      }}>
        <p>{formatDate(date)}</p>
        <input className='empty' />
        <FontAwesomeIcon icon={faCalendarDays} className='icon' />
      </div>
      <dialog onClick={(e) => {
        if (e.currentTarget === e.target) {
          toggleDialog();
        }
      }}
        ref={refDialog}><Calender key={dialogOpen ? "open" : "closed"}
          date={date}
          close={() => toggleDialog()}
          confirm={confirm} /></dialog>
    </div>

  )
}
