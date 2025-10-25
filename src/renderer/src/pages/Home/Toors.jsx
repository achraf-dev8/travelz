import React, { useEffect, useState } from 'react'
import '../../styles/Toors.css';
import '../../styles/Filters.css'
import { ToorsSection } from '../../components/home/toors/ToorsSection';
import {apiGet, fetchItems } from '../../functions/api';
import { HandleRequest } from './HandleRequest';
import { useAppStore } from '../../store';

export const Toors = () => {

  const {agency, setPages, setUnRead, setNotifications, notifications, unRead} = useAppStore()
  const [reqState, setReqState] = useState("loading")
  const [tours, setTours] = useState([])
  
  useEffect(() => {
    setPages(['Tours'])
    fetchTours()
  }, [])

  async function fetchTours (){
     setReqState("loading");
     try {
       const res = await apiGet('/tours', { params: { ...agency } });
   
       if (!res.error) {
         const tours = res.data.tours;
         const newNotifications = res.data.newNotifications;
         if (tours.length > 0) {
           setTours(tours);
           setNotifications([...notifications, ...newNotifications]);
           setUnRead([...unRead, ...newNotifications]);
           setReqState("success");
         } else {
           setReqState("empty");
         }

       } else {
         setReqState(res.error.source);
       }
       
     } catch (err) {
       console.error("Error fetching items:", err);
       setReqState("error");
     }
  }

  return (
    <HandleRequest reqState={reqState} subject="Tour" add={null} retry={fetchTours} layout = {(
      <ToorsSection main={true} tours = {tours} setReqState={setReqState} setTours = {setTours}/>
    )}/>
  )
}

