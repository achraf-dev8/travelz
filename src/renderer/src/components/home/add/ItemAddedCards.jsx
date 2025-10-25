
import React, { useEffect, useState } from 'react'
import { ItemAddedCard } from './ItemAddedCard'
import { FixedInputContainer } from '../../inputs/FIxedInputContainer'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { travelerSchema } from '../../../functions/schema'

export const ItemAddedCards = ({title = 'Travelers',
  simple = false, selectEdit, selected, items, deleteItem, sub = '', subCondition, page,
  tour
}) => {

  return (
    <>
    {!page && !simple && (<p style={{fontSize : "19px", fontWeight : "500", marginBottom : "8px"}}>{`${title} (${items.length})`}</p>)}
        <div className={`items-added-cards original ${items.length != 0 ? "not-empty" : ""}`}>
      {items.map((item, i)=>
        <ItemAddedCard simple = {simple} item = {item} i={i} selectEdit={selectEdit} selected={selected} deleteItem={deleteItem}
        sub = {sub} subCondition = {subCondition}
      />)}

    </div>
    </>
  )
}
