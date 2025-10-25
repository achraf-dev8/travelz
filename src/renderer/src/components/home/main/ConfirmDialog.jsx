import React, { useState } from 'react';
import { InfoConfirmHolder } from '../info/InfoConfirmHolder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getDialogInfo } from '../../../functions/dialog';

export const ConfrimDialog = ({operation, length, onConfirm, onCancel, refDialog, sub}) => {
  const {icon, color, msg} = getDialogInfo(operation, length, sub)
  const [waiting, setWaiting] = useState(false);
  
  return (
  <dialog ref={refDialog}  onClick={(e) => {
          if (e.currentTarget === e.target) onCancel();
        }}>
    <div className='confirm-dialog'>
      <FontAwesomeIcon icon={icon} style={{color:`var(--${color})`, fontSize : "25px", marginBottom : "10px"}}/>
      <p className='title'>{msg}</p>
      <div style={{ height: '0px' }} />
      <InfoConfirmHolder
       extra={waiting ? "disactive" : ""}
        onConfirm={async() => {
          setWaiting(true)
          await onConfirm()
          onCancel()
          setWaiting(false)
        }}
        onCancel={onCancel}
      />
    </div>
  </dialog>
  );
};
