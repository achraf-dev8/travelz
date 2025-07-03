import React from 'react'
import { StateCard } from '../filters/StateCard'
import { AddButton } from './AddButton'
import { SearchField } from '../SearchField'
import { ConfirmButton } from './ConfirmButton'
import { CancelButton } from '../CancelButton'

export const AddHolder = ({ confirm, cancelSelect, validConfirm, validAdd, addEvent, addFamily =false, state = "Add", editEvent =null, extraEvent}) => {
    return (
        <div className={`states-holder last`}>
            <CancelButton state={state == "Add"}
             onClick={(event) => cancelSelect(event)}/>
            <button className={`calendar-btn cancel large ${!addFamily ? "disactive" : "add-family"}`} onClick={(event) => extraEvent(event)}>Add Family</button>
            <AddButton state={state} extra={`simple ${validAdd}`} onClick={state == "Add" ? addEvent : editEvent} />
            <ConfirmButton extra={`${validConfirm}`} />
        </div>
    )
}