import { FilterDropDown } from './FilterDropDown';
import React, { useRef, useState } from 'react';
import Calender from '../Calender';

export const  RangeToorFilter = ({ title, from, to, setFilterEvent, maxToday = false, remove = true }) => {
  const fromFormated = from !== "any" ? formatDate(from) : "any";
  const toFormated = to !== "any" ? formatDate(to) : "any";

  const toRefDialog = useRef(null);
  const fromRefDialog = useRef(null);

  const [fromDialogOpen, setFromDialogOpen] = useState(false);
  const [toDialogOpen, setToDialogOpen] = useState(false);

  function toggleDialog(ref, isFrom = true) {

    if (!ref.current) return;

    if (ref.current.hasAttribute("open")) {
      ref.current.close();
      isFrom ? setFromDialogOpen(false) : setToDialogOpen(false);
    } else {
      ref.current.showModal();
      isFrom ? setFromDialogOpen(true) : setToDialogOpen(true);
    }
  }

  function confirmFrom(date) {
    toggleDialog(fromRefDialog, true);

    const titles = [`${title} From`];
    const names = [date];

    if (to !== "any" && date > to) {
      titles.push(`${title} To`);
      names.push(date);
    }

    setFilterEvent(titles, names, fromRefDialog);
  }

  function confirmTo(date) {
    toggleDialog(toRefDialog, false);

    const titles = [`${title} To`];
    const names = [date];

    if (from !== "any" && date < from) {
      titles.push(`${title} From`);
      names.push(date);
    }

    setFilterEvent(titles, names, toRefDialog);
  }



  function removeFrom() {
    setFilterEvent([`${title} From`], ["any"]);
  }

  function removeTo() {
    setFilterEvent([`${title} To`], ["any"]);
  }

  function formatDate(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = days[date.getDay()];
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${day} ${dd}/${mm}/${yyyy}`;
  }

  return (
    <div className="filter-container selector">
      <p className="text">{title}</p>
      <div className="selector-filters-holder">
        <p className="text">From</p>
        <FilterDropDown 
          onClick={() => toggleDialog(fromRefDialog, true)}
          title={title}
          active={fromFormated}
          setFilterEvent={removeFrom}
          remove={remove}
        />

        <dialog
          onClick={(e) => {
            if (e.currentTarget === e.target) {
              toggleDialog(fromRefDialog, true);
            }
          }}
          ref={fromRefDialog}
        >
          <Calender
          
            key={fromDialogOpen ? "open" : "closed"}
            date={from}
            close={() => toggleDialog(fromRefDialog, true)}
            confirm={confirmFrom}
            maxToday={maxToday}
          />
        </dialog>

        <p className="text">To</p>
        <FilterDropDown
          onClick={() => toggleDialog(toRefDialog, false)}
          title={title}
          active={toFormated}
          setFilterEvent={removeTo}
          remove={remove}
        />

        <dialog
          onClick={(e) => {
            if (e.currentTarget === e.target) {
              toggleDialog(toRefDialog, false);
            }
          }}
          ref={toRefDialog}
        >
          <Calender
            
            key={toDialogOpen ? "open" : "closed"}
            date={to}
            close={() => toggleDialog(toRefDialog, false)}
            confirm={confirmTo}
            maxToday={false}
          />
        </dialog>
      </div>
    </div>
  );
}
