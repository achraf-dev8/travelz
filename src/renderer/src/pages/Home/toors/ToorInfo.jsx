import React, { useEffect, useRef, useState } from 'react'
import { useParams } from "react-router-dom";
import { InfoRow } from '../../../components/home/info/InfoRow'
import { api, apiGet, apiPost } from '../../../functions/api';
import { InfoConfirmHolder } from '../../../components/home/info/InfoConfirmHolder'
import {
    faBus,
  faBusAlt,
  faBusSimple,
  faCalendarAlt,
  faCalendarDay,
  faH,
  faHotel,
  faLocation,
  faLocationDot,
  faPerson,
  faPhone,
  faUser, faBusinessTime,
  faBusSide,
  faHiking,
  faNoteSticky,
  faEye,
  faEyeSlash,
  faPlaneDeparture,
  faPlaneArrival,
  faKaaba
} from '@fortawesome/free-solid-svg-icons';
import { PenItem } from '../../../components/home/info/PenItem';
import { StateCard } from '../../../components/home/filters/StateCard';
import { StateDisplay } from '../../../components/home/table/StateDisplay';
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToorTitle } from './ToorTitle';
import { FixedInputContainer } from '../../../components/inputs/FIxedInputContainer';
import { ItemAddedCards } from '../../../components/home/add/ItemAddedCards';
import { HandleRequest } from '../HandleRequest';
import { formatApiDate, formatApiDateTime } from '../../../functions/dates';
import { ItemAddedCardsInfo } from '../../../components/home/add/ItemAddedCardsInfo';
import { ShowDocumentDialog } from '../../../components/home/documents/ShowDocumentDialog';
import { useNavigate } from 'react-router-dom';
import { ShowVisaDialog } from '../../../components/home/documents/ShowVisaDialog';
import { useAppStore } from '../../../store';
import { calculateProfit, convertAndSum } from '../../../functions/price';




export const ToorInfo = () => {

    const {agency, setPages} = useAppStore()
    const {primary_curr, exchange_rate_selling, exchange_rate_buying} = agency
    const location = useLocation()
    const navigate = useNavigate();
    const [tour, setTour] = useState({}); // Fixed: removed useRef
    const [selected, setSelected] = useState(-1);
    const [shownTravs, setShownTravs] = useState(false);
    
    const [state, setState] = useState("loading");
    const [doc, setDoc] = useState({});
    const [visa, setVisa] = useState({});
    const refDocumentDialog = useRef(null);
    const refVisaDialog = useRef(null);
    const [reOpen, setReOpen] = useState(0);

    // You'll need to get the actual tour ID from URL params or props
    const { id } = useParams();
    const tourId = Number(id);
    
    const selectEdit = (i) => {
      if(selected !== i){
        setSelected(i);
      }else{
        setSelected(-1);
      }
    }

    function showTravs(){
      setShownTravs(s => !s);
      setSelected(-1);
    }

  const isVisa = Array.isArray(tour.travelers) && tour.travelers.some(t => Array.isArray(t.visas) && t.visas.length > 0);
  function calculateVisaExpenses() {

  if (!isVisa) {
    return null;
  }

  const visaExpenses = [];

  for (const traveler of tour.travelers) {
    if (traveler.visas && traveler.visas.length > 0) {
      for (const visa of traveler.visas) {
        // Only take the expense if it exists, default to 0
        visaExpenses.push({
          value: visa.expense || 0,
          currency: visa.expense_curr || primary_curr
        });
      }
    }
  }

  return convertAndSum(visaExpenses, primary_curr, exchange_rate_selling, exchange_rate_buying);
}

  function calculateVisaPrice() {
  if (!isVisa) {
    return null;
  }

  const visaExpenses = [];

  for (const traveler of tour.travelers) {
    if (traveler.visas && traveler.visas.length > 0) {
      for (const visa of traveler.visas) {
        // Only take the expense if it exists, default to 0
        visaExpenses.push({
          value: visa.price || 0,
          currency: visa.price_curr || primary_curr
        });
      }
    }
  }

  return convertAndSum(visaExpenses, primary_curr, exchange_rate_selling, exchange_rate_buying);
}


    function calculateExpenses() {
  const expenseItems = [];

  // 🏨 Include hotel expenses only if hotel exists
  if (tour.hotel) {
    expenseItems.push({
      value: Number(tour.hotel_expenses) || 0,
      currency: tour.hotel_expenses_curr || primary_curr,
    });
  }

  // ✈️ Include departure expenses if airport or bus transport exists
  if (tour.departure_transport === "airport" || tour.departure_transport === "bus") {
    expenseItems.push({
      value: Number(tour.departure_expenses) || 0,
      currency: tour.departure_expenses_curr || primary_curr,
    });
  }

  // 🛬 Include return expenses if airport or bus transport exists
  if (tour.return_transport === "airport" || tour.return_transport === "bus") {
    expenseItems.push({
      value: Number(tour.return_expenses) || 0,
      currency: tour.return_expenses_curr || primary_curr,
    });
  }

  // 🧭 Include guide expenses only if guide exists
  if (tour.guide) {
    expenseItems.push({
      value: Number(tour.guide_expenses) || 0,
      currency: tour.guide_expenses_curr || primary_curr,
    });
  }

  // 💸 Always include "other" if present
    expenseItems.push({
      value: Number(tour.other_expenses) || 0,
      currency: tour.other_expenses_curr || primary_curr,
    });
  

  // 🧮 Convert and sum all valid items
  return convertAndSum(expenseItems, primary_curr, exchange_rate_selling, exchange_rate_buying);
}


function calculatePrice() {
  const travelerPrices = (tour.travelers || []).map(trav => ({
    value: trav.price || 0,
    currency: trav.currency || primary_curr,
  }));

  return convertAndSum(travelerPrices, primary_curr, exchange_rate_selling, exchange_rate_buying);
}

  const totalVisaExpenses = calculateVisaExpenses();

  const totalExpenses = !isVisa ? calculateExpenses() : 
  convertAndSum([calculateExpenses(), totalVisaExpenses], primary_curr, exchange_rate_selling, exchange_rate_buying);

  const totalVisaPrice = calculateVisaPrice();

  const totalTourPrice = calculatePrice();

  const totalPrice = !isVisa ? totalTourPrice : 
  convertAndSum([totalVisaPrice, totalTourPrice], primary_curr, exchange_rate_selling, exchange_rate_buying);

  const profit = calculateProfit(totalExpenses, totalPrice, primary_curr, exchange_rate_selling, exchange_rate_buying);

    useEffect(() => {
      setPages(['Tours', 'Tour Information'])
      getTour();

    }, [tourId]);

    const getTour = async() => {
      try {
        var res = await apiGet(`tours/${tourId}`);
        console.log("check tour", res);
        if(!res.error){
          setTour(res.data);
          console.log('tour second', res.data)
          setState("success");
        }else{
          setState("error"); // Fixed: changed from error.source to "error"
        }
      } catch (error) {
        setState("error");
      }
    }

    function openDocumentDialog(doc){
      setDoc(doc);
      refDocumentDialog.current?.showModal();
    }

    function openVisaDialog(visa){
      setVisa(visa);
      refVisaDialog.current?.showModal();
    }

        function editTour() {

        if (tour && Object.keys(tour).length > 0) {
            navigate('/edit-tour', { state: { tour: tour } });
        } else {
            console.error("Tour data is not available");
        }
    }

            function editTravelers() {

        if (tour && Object.keys(tour).length > 0) {
            navigate('/edit-tour-travelers', { state: { tour: compileTourForTravelers() } });
        } else {
            console.error("Tour data is not available");
        }
    }

    function compileTourForTravelers(){
      const test = {
        id : tour.id,
        general: {
        type: tour.type,
        locationType: tour.location,
        transportType: tour.transport,
        state: tour.state,
        destination:tour.destination,
        isUmrah: tour.umrah == 'Umrah',
        canceledExpenses : tour.canceled_expenses == 1,
        canceledRevenue : tour.canceled_revenue == 1,
        departureDate: tour.departure_date,
        returnDate: tour.return_date,
        note : tour.note,
      },
        hotel: tour.hotel ? {
        id: tour.hotel.id,
        name: tour.hotel.name,
        location: tour.hotel.location,
        phoneNumber: tour.hotel.phone_number,
        price: tour.hotel.price,
        currency: tour.hotel.currency,
        add_edit: 'No'
      } : null,

        departureAirport: tour.departureAirport ? {
        id: tour.departureAirport.id,
        name: tour.departureAirport.name,
        location: tour.departureAirport.location,
        phoneNumber: tour.departureAirport.phone_number,
        price: tour.departureAirport.price,
        currency: tour.departureAirport.currency,
        add_edit: 'No'
      } : null,


        returnAirport: tour.returnAirport ? {
        id: tour.returnAirport.id,
        name: tour.returnAirport.name,
        location: tour.returnAirport.location,
        phoneNumber: tour.returnAirport.phone_number,
        price: tour.returnAirport.price,
        currency: tour.returnAirport.currency,
        add_edit: 'No'
      } : null,

         departureBus: tour. departureBus ? {
        id: tour. departureBus.id,
        name: tour. departureBus.name,
        phoneNumber: tour. departureBus.phone_number,
        price: tour. departureBus.price,
        currency: tour. departureBus.currency,
        add_edit: 'No'
      } : null,

        returnBus: tour.returnBus ? {
        id: tour.returnBus.id,
        name: tour.returnBus.name,
        phoneNumber: tour.returnBus.phone_number,
        price: tour.returnBus.price,
        currency: tour.returnBus.currency,
        add_edit: 'No'
      } : null,

      guide: tour.guide ? {
        id: tour.guide.id,
        name: tour.guide.name,
        phoneNumber: tour.guide.phone_number,
        price: tour.guide.price,
        currency: tour.guide.currency,
        add_edit: 'No'
      } : null,

      travelers : tour.travelers,
      hotelExpenses : tour.hotel_expenses,
      hotelExpensesCurr: tour.hotel_expenses_curr,
      departureExpenses : tour.departure_expenses,
      departureExpenses : tour.departure_expenses_curr,
      returnExpenses : tour.return_expenses,
      returnExpensesCurr : tour.return_expenses_curr,
      guideExpenses : tour.guide_expenses,
      guideExpensesCurr : tour.guide_expenses_curr,
      otherExpenses : tour.other_expenses,
      otherExpensesCurr : tour.other_expenses_curr
     }
     console.log('test ', test)
     return test
    }



  return (
    <HandleRequest reqState={state} retry={getTour} add={""} subject={""} layout={(
    <div>
        <ToorTitle name = "Tour Information" edit={editTour}/>
              <div className='info-card'>
                <div className='info-card-holder' >
                 <InfoRow
                    icon={faLocationDot}
                    type='Destination'
                    info={tour.destination}
                  />

                <InfoRow
                    icon={faLocation}
                    type='Location'
                    info={tour.location}
                  />
            
                  <InfoRow
                    icon={faUser}
                    type='Type'
                    info={tour.type}
                  />
                  <InfoRow
                    icon={faBus}
                    type='Transport'
                    info={tour.transport}
                  />

                  {tour.umrah == 'Umrah' && (<InfoRow
                    icon={faKaaba}
                    info='Umrah'
                  />)}

                </div>
                <div className='info-card-holder' style={{justifyContent: 'space-between'}}>
                  <InfoRow
                    icon={faCalendarAlt}
                    type='Departure Date'
                    info={formatApiDateTime(tour.departure_date) ? formatApiDateTime(tour.departure_date) : "Undefined"}
                  />
                <InfoRow
                    icon={faCalendarAlt}
                    type='Return Date'
                    info={formatApiDate(tour.return_date) ? formatApiDate(tour.return_date) : "Undefined"} // Fixed: changed from departureDate to returnDate
                  />

                <InfoRow
                    icon={null}
                    type='State'
                    display = {tour.state}
                  />

                </div>
                <div className='info-card-holder' style={{justifyContent: 'space-between'}}>
                {tour.hotel &&                 <InfoRow
                    icon={faHotel}
                    type='Hotel'
                    info={tour.hotel?.name}
                    edit={false}
                  />}
                {(tour.departure_bus || tour.departure_airport) && <InfoRow
                    icon={tour.departure_bus ? faBusSide : faPlaneDeparture}
                    type={tour.departure_bus ? 'Departure Bus' : 'Departure Airport'}
                    info={tour.departure_bus?.name || tour.departure_airport?.name}
                    edit={false}
                  />}
                  { (tour.return_bus || tour.return_airport) &&   <InfoRow
                    style={tour.return_bus ? { transform: 'scaleX(-1)' } : null}
                    icon={tour.return_bus ? faBusSide : faPlaneArrival}
                    type={tour.return_bus ? 'Return Bus' : 'Return Airport'}
                    info={tour.return_bus?.name || tour.return_airport?.name}
                    edit={false}
                 />}
                 {tour.guide && (<InfoRow
                    icon={faHiking}
                    type='Guide'
                    info={tour.guide?.name}
                    edit={false}
                 />)}
                 {tour.note && (<InfoRow
                    icon={faNoteSticky}
                    type='Note'
                    info={tour.note}
                    edit={false}
                  />)}
                          <InfoRow
                    icon={faCalendarDay}
                    type='Added'
                    info={formatApiDate(tour.creation_date)}
                    edit={false}
                  />
                </div>
              </div>
              <div style={{height : '10px'}}></div>
              <ToorTitle name = {`Travelers  Information (${tour.travelers?.length || 0})`}  shownTravs={shownTravs}
              edit={editTravelers} eye={shownTravs ? faEyeSlash : faEye} showTravs = {showTravs}/>
              {shownTravs && <ItemAddedCardsInfo
                        openDocumentDialog = {openDocumentDialog}
                        openVisaDialog={openVisaDialog}
                        tour={tour}
                        simple = {true}
                        selectEdit={selectEdit}
                        selected={selected}
                        deleteItem={null}
                        items={tour.travelers || []}
                      /> }
                
              <ShowDocumentDialog refDialog={refDocumentDialog} openDocumentDialog = {openDocumentDialog} 
              reOpen={reOpen}  doc={doc} showOnly = {true} />

              <ShowVisaDialog visa = {visa} refDialog={refVisaDialog} openDocumentDialog = {openVisaDialog} 
              reOpen={reOpen} showOnly = {true} />

              <ToorTitle name={`Finance`} />
                <div className={`documents-holder`}>

                  {tour.hotel != null && (
                    <FixedInputContainer
                      flex={'1 1 220px'}
                      display={"Hotel Expenses"}
                      value={`${tour.hotel_expenses || 0} ${tour.hotel_expenses_curr || 'DA'}`}
                    />
                  )}

                  {(tour.departureAirport != null || tour.departureBus != null) && (
                    <FixedInputContainer
                      flex={'1 1 220px'}
                      display={"Departure Expenses"}
                      value={`${tour.departure_expenses || 0} ${tour.departure_expenses_curr || 'DA'}`}
                    />
                  )}

                  {(tour.returnAirport != null || tour.returnBus != null) && (
                    <FixedInputContainer
                      flex={'1 1 220px'}
                      display={"Return Expenses"}
                      value={`${tour.return_expenses || 0} ${tour.return_expenses_curr || 'DA'}`}
                    />
                  )}

                  {tour.guide != null && (
                    <FixedInputContainer
                      flex={'1 1 220px'}
                      display={"Guide Expenses"}
                      value={`${tour.guide_expenses || 0} ${tour.guide_expenses_curr || 'DA'}`}
                    />
                  )}

                  <FixedInputContainer
                    flex={'1 1 220px'}
                    display={"Other Expenses"}
                    value={`${tour.other_expenses || 0} ${tour.other_expenses_curr || 'DA'}`}
                  />
            {isVisa && 
            <FixedInputContainer flex={'1 1 220px'} display="Total Visa Expenses" value={`${totalVisaExpenses.value}
             ${totalVisaExpenses.currency}`} />}
            {isVisa &&
            <FixedInputContainer flex={'1 1 220px'} display="Total Visa Price" value={`${totalVisaPrice.value} 
            ${totalVisaPrice.currency}`} />}
            {isVisa &&
            <FixedInputContainer flex={'1 1 220px'} display="Total Tour Price" value={`${totalTourPrice.value} 
            ${totalTourPrice.currency}`} />}
          <FixedInputContainer flex={'1 1 220px'} display="Total Expenses" value={`${totalExpenses.value} 
          ${totalExpenses.currency}`} />

          <FixedInputContainer flex={'1 1 220px'} display="Total Price" value={`${totalPrice.value} ${totalPrice.currency}`}/>
            <FixedInputContainer flex={'1 1 220px'} display="Profit" value={`${profit.value} ${profit.currency}`} />
                </div>
          {tour.state == 'Canceled' &&
          <div style={{ display: "flex", marginTop : '10px', alignItems: "center", justifyContent : 'space-around'}}>
            <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <input
                type="checkbox"
                checked={tour.canceled_revenue}
                onChange={()=>{}}
              />
              <span>Included Revenue</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <input
                type="checkbox"
                checked={tour.canceled_expenses}
                onChange={()=>{}}
              />
              <span>Included Expenses</span>
            </label>
          </div>}

        
    </div>)} />
  )
}
