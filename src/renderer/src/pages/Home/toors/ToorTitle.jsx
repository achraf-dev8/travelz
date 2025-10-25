import React from 'react'
import { PenItem } from '../../../components/home/info/PenItem'
import { faEye, faPen } from '@fortawesome/free-solid-svg-icons'

export const ToorTitle = ({name, edit, eye, showTravs, shownTravs, fontSize}) => {
  return (
            <div style={{display : 'flex', gap: '3px', alignItems : 'center'}}>
            <h4 className="form-section-header first" style={{fontSize : fontSize ?? "18px"}}>{name}</h4>
           { eye && (<PenItem  style = {{fontSize : '18px', color:  shownTravs ? '' : 'var(--grey-brown-dark)' }} edit={showTravs} icon={eye}/>)}
            <PenItem style = {{fontSize : '18px'}} edit={edit}/>
        </div>
  )
}
