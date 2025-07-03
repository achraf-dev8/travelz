import React from 'react';
import '../../../styles/EditDialog.css';
import { InputElement } from '../../inputs/InputElement';
import { InfoConfirmHolder } from './InfoConfirmHolder';
import { NumberInputElement } from '../../inputs/NumberInputElement';

export const EditDialog = ({
  name = 'First name',
  onChange,
  error,
  value,
  onConfirm,
  onCancel,
  useNumber = false,
}) => {
  return (
    <div className='edit-dialog'>
      <p className='title'>Edit {name}</p>

      {useNumber ? (
        <NumberInputElement value={value} onChange={onChange} />
      ) : (
        <InputElement name={null} value={value} onChange={onChange} error={error} />
      )}

      <div style={{ height: '20px' }} />
      <InfoConfirmHolder
        onCancel={onCancel}
        extra={value === '' ? 'disactive' : ''}
        onConfirm={onConfirm}
      />
    </div>
  );
};
