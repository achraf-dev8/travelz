import React from 'react'

export const StateCard = ({text, active, event}) => {
  return (
    <div className={`state-card scale-hover ${active==text ? 'active' : ''}`} onClick={() => event(text)}>
        <p>{text}</p>
    </div>
  )
}
