import React, { useState, useEffect } from "react";
import "../../styles/Calender.css";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calender = ({ date = "any", close, confirm, maxToday=true }) => {
  const min = 1
  const max = 9999
  const getInitialDate = () => (date === "any" || date === "N/A" ? new Date() : new Date(date));

  const [disDate, setDisDate] = useState(getInitialDate);
  const [currDate, setCurrDate] = useState(getInitialDate);
  const [inputYear, setInputYear] = useState(disDate.getFullYear());

  const setValueCheck = (value) => {
    setInputYear(value);
    if (!value) return;
    let clampedYear = Math.max(min, Math.min(max, value));
    let d = new Date(clampedYear, disDate.getMonth(), 1);
    setDisDate(d);
  };
  

  useEffect(() => {
    const freshDate = getInitialDate();
    setDisDate(freshDate);
    setCurrDate(freshDate);
    setInputYear(freshDate.getFullYear());
  }, [date]);

  const firstDayOfMonth = new Date(disDate.getFullYear(), disDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(disDate.getFullYear(), disDate.getMonth() + 1, 0).getDate();

  const prevMonth = () => {
    setDisDate(new Date(disDate.getFullYear(), disDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setDisDate(new Date(disDate.getFullYear(), disDate.getMonth() + 1, 1));
  };

  const selectDay = (day) => {
    setCurrDate(new Date(disDate.getFullYear(), disDate.getMonth(), day));
  };

  const fullClose = () => {
    const freshDate = getInitialDate();
    setDisDate(freshDate);
    setCurrDate(freshDate);
    close();
  };

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isActive =
        disDate.getFullYear() === currDate.getFullYear() &&
        disDate.getMonth() === currDate.getMonth() &&
        day === currDate.getDate();

      const isOld =
        date !== "any" &&
        disDate.getFullYear() === new Date(date).getFullYear() &&
        disDate.getMonth() === new Date(date).getMonth() &&
        day === new Date(date).getDate();

      days.push(
        <div
          onClick={() => selectDay(day)}
          key={day}
          className={`calendar-day ${isActive ? "active" : ""} ${isOld ? "old" : ""}`}
        >
          {day}
        </div>
      );
    }

    return days;
  };
  
  const canceled = (maxToday && currDate.getTime() > new Date().setHours(0, 0, 0, 0)) || currDate.getFullYear()>9999 || currDate.getFullYear()<1000;

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <h2>
          {disDate.toLocaleString("en-us", { month: "long" })}
          &nbsp;
        <input
          type="number"
          className="calendar-year-input"
          value={inputYear}
          onChange={(e) => setValueCheck(parseInt(e.target.value))}
          min={min}
          max={max}
        />
        </h2>
        <button onClick={nextMonth}>&gt;</button>
      </div>

      <div className="calendar-grid">
        {daysOfWeek.map((day) => (
          <div key={day} className="calendar-day-name">
            {day}
          </div>
        ))}
        {renderDays()}
      </div>

      <div className="calendar-actions">
        <p className="calendar-btn cancel" onClick={fullClose}>
          Cancel
        </p>
        <button
  className={`calendar-btn confirm ${canceled ? "disactive" : ""}`}
  onClick={() => confirm(currDate)}
  disabled={canceled}
>
  Confirm
</button>
      </div>
    </div>
  );
};

export default Calender;
