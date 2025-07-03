import React, { useState } from 'react'


export const NumberInputElement = ({name, min=1, max=null, onChange, value}) => {

  return (
    <div className='input-container number'>
        <p>{name}</p>
        <input type='number' value={value} max={max} min={min} onChange={(event)=>onChange(event.target.value)}/>
    </div>
  )
}
