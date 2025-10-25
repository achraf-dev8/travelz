
import React, { useEffect, useState } from 'react'
import { ItemAddedCard } from './ItemAddedCard'
import { FixedInputContainer } from '../../inputs/FIxedInputContainer'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { ItemsGrid } from './ItemsGrid'

export const ItemAddedCardsInfo = ({openDocumentDialog, openVisaDialog,
   selectEdit, selected, items, deleteItem, sub = '', subCondition, tour}) => {

    const pairs = items.reduce((acc, item, index) => {
      if (index % 2 === 0) {
        // start new pair with current item
        acc.push([item]);
      } else {
        // add to last pair
        acc[acc.length - 1].push(item);
      }
      return acc;
    }, []);
    
  return (
    <>
    <div className='items-added-cards'>

      {pairs.map((pair, i) => (
        <ItemsGrid openVisaDialog={openVisaDialog} openDocumentDialog = {openDocumentDialog} showDoc pair={pair} 
        selectEdit={selectEdit} selected={selected} deleteItem={deleteItem}
        sub={sub} subCondition={subCondition} i={i} tour={tour} last={pairs.length-1 == i}/>
      ))}

      
    </div>
    </>
  )
}
