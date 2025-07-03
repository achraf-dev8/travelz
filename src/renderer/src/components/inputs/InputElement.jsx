import React from 'react'


export const InputElement = ({name, type= "text", onChange, value, error = null}) => {
  return (
    <div className='input-container'>
        <p>{name}</p>
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)}/>
        <p className='error'>{error}</p>
    </div>
  )
}
