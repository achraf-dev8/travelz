import React from 'react'

export const CheckBox = ({display, name, checked, onChange}) => {
  return (
     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto', justifyContent: 'center'
          ,  transform: 'translateY(50%)'
         }}>
          <p>{display}</p>
          <input
            type="checkbox"
            name={name}
            id={name}
            checked={checked}
            onChange={onChange}
          />
        </div>
  )
}
