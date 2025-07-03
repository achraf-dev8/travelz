
import React from 'react'
import { ItemAddedCard } from './ItemAddedCard'

export const ItemAddedCards = ({selectEdit, selected, items=["dodpfjo", "jdojjod"], deleteItem, sub = '', subCondition}) => {
  return (
    <div className={`items-added-cards ${items.length != 0 ? "not-empty" : ""}`}>
      {items.map((item, i)=><ItemAddedCard item = {item} i={i} selectEdit={selectEdit} selected={selected} deleteItem={deleteItem}
      sub = {sub} subCondition = {subCondition } 
      />)}
    </div>
  )
}
