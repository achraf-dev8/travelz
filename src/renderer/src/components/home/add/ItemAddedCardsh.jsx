import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const ItemAddedCards = ({selectEdit, selected, items=["dodpfjo", "jdojjod"], deleteItem}) => {
  return (
    <div className={`items-added-cards ${items.length != 0 ? "not-empty" : ""}`}>
      {items.map((item, i)=><div key={i} className={`item-added-card ${selected ==i ? 'selected' : ''}`}>
          <p>{item}</p>
          <div className='controllers'>
            <div className='icon-container delete' onClick={()=>deleteItem(i)}><FontAwesomeIcon icon={faTrash}/></div>
            <div className='icon-container edit' onClick={()=>selectEdit(i)}><FontAwesomeIcon icon={faPen}/></div>
          </div>
      </div>)}
    </div>
  )
}

      <div className='item-added-card'>
          <p>Achraf</p>
          <div className='controllers'>
            <div className='icon-container delete'><FontAwesomeIcon icon={faTrash}/></div>
            <div className='icon-container edit'><FontAwesomeIcon icon={faPen}/></div>
          </div>
      </div>
