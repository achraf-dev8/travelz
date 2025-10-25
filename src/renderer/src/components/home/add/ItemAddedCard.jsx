import { faEye, faEyeSlash, faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { isString } from 'formik'
import React from 'react'
import { getFullName } from '../../../functions/traveler'

export const ItemAddedCard = ({simple = false, item, i, selectEdit, 
  selected, deleteItem, sub = '', subCondition = true, add = null}) => {
  return (
    <div key={i} className={`item-added-card ${selected ==i && subCondition ? 'selected' : ''} ${sub}`}>
          <p>{isString(item) ? item : getFullName(item)}</p>
          <div className='controllers'>
            {add && <div className='icon-container edit' onClick={()=>add(i)}><FontAwesomeIcon icon={faPlus}/></div>}
            
            {!simple ? (
              <>
              <div className='icon-container edit' onClick={()=>selectEdit(i)}><FontAwesomeIcon icon={faPen}/></div>
            <div className='icon-container delete' onClick={()=>deleteItem(i)}><FontAwesomeIcon icon={faTrash}/></div>
            </>) : (<div className='icon-container edit' onClick={()=>selectEdit(i)}><FontAwesomeIcon icon={
              selected == i ? faEyeSlash : faEye} style={{color : selected==i ? 'var(--primary-color)' : 'var(--grey-brown-dark)'}}/></div>)}
          </div>
    </div>
  )
}
