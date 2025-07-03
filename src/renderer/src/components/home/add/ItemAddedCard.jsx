import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const ItemAddedCard = ({item, i, selectEdit, selected, deleteItem, sub = '', subCondition = true, add = null}) => {
  return (
    <div key={i} className={`item-added-card ${selected ==i && subCondition ? 'selected' : ''} ${sub}`}>
          <p>{item}</p>
          <div className='controllers'>
            {add && <div className='icon-container edit' onClick={()=>add(i)}><FontAwesomeIcon icon={faPlus}/></div>}
            <div className='icon-container edit' onClick={()=>selectEdit(i)}><FontAwesomeIcon icon={faPen}/></div>
            <div className='icon-container delete' onClick={()=>deleteItem(i)}><FontAwesomeIcon icon={faTrash}/></div>
          </div>
    </div>
  )
}
