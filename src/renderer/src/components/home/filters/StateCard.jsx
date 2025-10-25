import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toPadding } from 'chart.js/helpers'
import React from 'react'

export const StateCard = ({text, active, event, icon}) => {
  return (
    <div className={`state-card scale-hover ${active==text ? 'active' : ''}`}
    style={{gap : '8px', alignItems : 'center'}}
    onClick={() => event(text)}>
        {icon && <FontAwesomeIcon icon={icon}/>}
        <p>{text}</p>
    </div>
  )
}
