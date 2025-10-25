import React from 'react'
import { CancelButton } from '../CancelButton'
import { ConfirmButton } from '../add/ConfirmButton'

export const InfoConfirmHolder = ({onCancel, name, extra, onConfirm, style}) => {
  return (
        <div className='info-confirm-holder' style={style}>
          <CancelButton onClick={onCancel}/>
          <ConfirmButton extra={extra} name={name} onClick={onConfirm}/>
        </div>
  )
}
