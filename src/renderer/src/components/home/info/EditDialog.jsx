import React from 'react';
import { InputElement } from '../../inputs/InputElement';
import { InfoConfirmHolder } from './InfoConfirmHolder';
import { NumberInputElement } from '../../inputs/NumberInputElement';
import { PriceInput } from '../../inputs/PriceInput';
import { setPriceCurr } from '../../../functions/filters';

export const EditDialog = ({
  name,
  onChange,
  error,
  value,
  onConfirm,
  onCancel,
  useNumber = false,
  curr, setCurr, confiriming = false
}) => {
  console.log(name)
  return (
    <div className='edit-dialog'>
      <p className='title'>Edit {name}</p>

      {useNumber ? (
        <NumberInputElement  value={value} onChange={onChange} />
      ) : curr ? (
        <PriceInput dialog={true} style={{alignItems : 'center'}} touched={true} name={null} value={value} onChange={onChange} activeCurr={curr} 
        setActiveCurr={(titles, names, ref) => setPriceCurr(names[0], setCurr, ref)}
         />
      ) :  (
        <InputElement error={error} touched={true} name={null} value={value} onChange={onChange} />
      )}

      <div style={{ height: '20px' }} />
      <InfoConfirmHolder style={{marginTop : '0px'}}
        onCancel={onCancel}
        extra={(((name == 'Name' || name == 'username' ||
          name == 'name' || name == 'age' || name == ' First  Name' || name == ' Last  Name') && (value == '')) || confiriming 
        )
          ? 'disactive' : ''}
        onConfirm={onConfirm}
      />
    </div>
  );
};
