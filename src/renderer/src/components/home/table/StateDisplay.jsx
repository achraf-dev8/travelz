import React from 'react'

export const StateDisplay = ({text}) => {
  return (
    <div className={`state-display ${text}`}>
        <p>{text}</p>
    </div>
  )
}
