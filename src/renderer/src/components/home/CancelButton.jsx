import React from 'react'

export const CancelButton = ({onClick, state}) => {
  return (
    <button className={`calendar-btn cancel large ${state ? "disactive" : ""}`} onClick={onClick}>Cancel</button>
  )
}
