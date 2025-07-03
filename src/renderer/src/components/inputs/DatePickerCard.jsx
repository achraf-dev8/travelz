import { faCalendarAlt, faCalendarDay, faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef, useState } from 'react'
import Calender from '../home/Calender'

export const DatePickerCard = ({ name, setDate, date }) => {
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

  function formatDate(date) {
    if (date == 'any' || !date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <div className='date-picker-card-container'>
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
