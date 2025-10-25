import React, { useEffect, useState } from 'react'
import { SettingsStateHolder } from '../../../components/settings/SettingsStateHolder'
import { PriceInput } from '../../../components/inputs/PriceInput'
import { FixedInputContainer } from '../../../components/inputs/FIxedInputContainer'
import { ProfileInfoItem } from '../../../components/settings/ProfileInfoItem'
import { faEnvelope, faMailBulk, faPhone, faUser } from '@fortawesome/free-solid-svg-icons'
import { ConfirmButton } from '../../../components/home/add/ConfirmButton'
import { width } from '@fortawesome/free-regular-svg-icons/faAddressBook'
import { color } from 'chart.js/helpers'
import { AddButton } from '../../../components/home/add/AddButton'
import { HandleRequest } from '../HandleRequest'
import { Settings } from './Settings'
import { Profile } from './Profile'
import { Agency } from './Agency'
import { useAppStore } from '../../../store'

export const FullSettings = () => {
  const [page, setPage] = useState('Profile')
  const [reqState, setReqState] = useState("success");
  const {setPages} = useAppStore();
  useEffect(() => {
    setPages(['Settings'])
  }, [])
  return (
    <HandleRequest 
    layout={    <>
        <SettingsStateHolder active = {page} event={setPage}/>
        <hr className='divider' style={{marginTop : '10px'}}></hr>
        {page == 'Profile' ? <Profile setReqState={setReqState}/> : page == 'Settings' ? 
        <Settings setReqState={setReqState}/>  : <Agency setReqState={setReqState}/>}
    </>} reqState={reqState} retry={()=>setReqState("success")}
    />
  )
}
