import React, { useEffect, useRef, useState } from 'react'
import { TourStatesHolder } from './TourStatesHolder'
import '../../../styles/Toors.css';
import '../../../styles/Filters.css'
import { ToorsFiltersHolder } from './ToorsFilterHolder';
import { ToorsTable } from './ToorsTable';
import { normalizeDate } from '../../../functions/dates';
import { buildSortFunction, checkViewState, compareExpenses, comparePrices, compareStates, makeCompare, stateOrder } from '../../../functions/tableOperations';
import { apiDelete, apiPatch } from '../../../functions/api';
import { faEye, faHourglassEnd, faPlaneSlash, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ConfrimDialog } from '../main/ConfirmDialog';
import { setFilterEvent } from '../../../functions/filters';
import { useNavigate } from 'react-router-dom';


export const ToorsSection = ({ main = false, tours, setReqState, setTours, helpers = true }) => {

  const navigate = useNavigate()
  const [toorState, setToorState] = useState("All");
  const [filteredTours, setFilteredTours] = useState(tours);
  const [showFilter, setShowFilters] = useState(true);
  const refDialog = useRef(null);
  const [operation, setOperation] = useState('Delete');
  const [length, setlength] = useState(0);
  const [operationOnClick, setOperationOnClick] = useState(null);

  const [activeFilters, setActiveFilters] = useState({
    "Type": "All", "Location": "All", "Transport": "All", "Umrah": "All",
    "Departure Date From": "any", "Departure Date To": "any", "Return Date From": "any", "Return Date To": "any"
  });

  useEffect(() => {
    let filtered = tours;
    // Filter by toorState
    if (toorState !== 'All') {
      filtered = filtered.filter(t => t.state === toorState);
    }

    // Filter by Type
    if (activeFilters["Type"] !== 'All') {
      filtered = filtered.filter(t => t.type === activeFilters["Type"]);
    }

    // Filter by Location
    if (activeFilters["Location"] !== 'All') {
      filtered = filtered.filter(t => t.location === activeFilters["Location"]);
    }

    // Filter by Transport
    if (activeFilters["Transport"] !== 'All') {
      filtered = filtered.filter(t => t.transport === activeFilters["Transport"]);
    }

    // Filter by Umrah
    if (activeFilters["Umrah"] !== 'All') {
      filtered = filtered.filter(t => t.umrah === activeFilters["Umrah"]);
    }

    // Filter by departure and return dates
    const depFrom = activeFilters["Departure Date From"];
    const depTo = activeFilters["Departure Date To"];
    const retFrom = activeFilters["Return Date From"];
    const retTo = activeFilters["Return Date To"];

    if (depFrom !== "any") {
      const from = normalizeDate(depFrom);
      filtered = filtered.filter(t => normalizeDate(t.departure_date) >= from);
    }
    if (depTo !== "any") {
      const to = normalizeDate(depTo);
      filtered = filtered.filter(t => normalizeDate(t.departure_date) <= to);
    }
    if (retFrom !== "any") {
      const from = normalizeDate(retFrom);
      filtered = filtered.filter(t => normalizeDate(t.return_date) >= from);
    }
    if (retTo !== "any") {
      const to = normalizeDate(retTo);
      filtered = filtered.filter(t => normalizeDate(t.return_date) <= to);
    }

    setFilteredTours(filtered);
  }, [activeFilters, toorState, tours]);


  function setToorStateEvent(state) {
    setToorState(state);
  }

  //Sort Area
 const compareDepartureDates = makeCompare(
  a => a.departure_date ? new Date(a.departure_date) : null,
  (a, b) => b - a // newest first
);

 const compareReturnDates = makeCompare(
  a => a.return_date ? new Date(a.return_date) : null,
  (a, b) => b - a // newest first
);

  const sortFunctions = {
    byState: (reverse = false) => buildSortFunction(compareStates, compareDepartureDates, reverse),
    byDepartureDate: (reverse = false) => buildSortFunction(compareDepartureDates, compareStates, reverse),
    byReturnDate: (reverse = false) => buildSortFunction(compareReturnDates, compareStates, reverse),
    byExpenses: (reverse = false) => buildSortFunction(compareExpenses, compareStates, reverse),
    byPrice: (reverse = false) => buildSortFunction(comparePrices, compareStates, reverse),
  };

  const delet = async (id) => {

    const isArray = Array.isArray(id);
    const url = Array.isArray(id) ? '/tours' : `/tours/${id}`;
    const config = isArray ? { data: { ids: id } } : {};
    const res = await apiDelete(url, '/tours', config);
    if (!res.error) {
      setTours(prev =>
        isArray
          ? prev.filter(tour => !id.includes(tour.id))
          : prev.filter(tour => tour.id !== id)
      );
      console.log(res.data);
    } else {
      console.log(res);
      setReqState(res.error.source);
    }
  };

  const changeState = async (id, state, link) => {
    const isArray = Array.isArray(id);
    const today = new Date();

    // Normalize to array for filtering
    const ids = isArray ? id : [id];

    // 🔍 Filter out tours that already have the desired state
    const idsToUpdate = ids.filter(tourId => {
      const tour = tours.find(t => t.id === tourId);
      return tour && tour.state !== state;
    });

    // ⛔ Nothing to update
    if (idsToUpdate.length === 0) {
      console.log('No tours to update, all already in desired state:', state);
      return;
    }

    // 👇 Build request
    const url = idsToUpdate.length > 1 ? `/tours/${link}/` : `/tours/${idsToUpdate[0]}/${link}/`;
    const body = idsToUpdate.length > 1 ? { ids: idsToUpdate } : {};

    const res = await apiPatch(url, body, '/tours');

    if (!res.error) {
      setTours(prev =>
        prev.map(tour => {
          if (idsToUpdate.includes(tour.id)) {
            return {
              ...tour,
              state: state,
              return_date: today,
            };
          }
          return tour;
        })
      );
    } else {
      console.log(res.error);
      setReqState(res.error.source);
    }
  };


  const end = async (id) => {
    changeState(id, 'Ended', 'end')
  };

  const cancel = async (id) => {
    changeState(id, 'Canceled', 'cancel')
  };

  const checkEndState = (id) => {
    const isArray = Array.isArray(id);
    const ids = isArray ? id : [id];

    return ids.every(tourId => {
      const tour = tours.find(t => t.id === tourId);
      return tour && (tour.state === 'Active' || tour.state === 'Ended');
    });
  };

  const checkCancelState = (id) => {
    const isArray = Array.isArray(id);
    const ids = isArray ? id : [id];

    return ids.every(tourId => {
      const tour = tours.find(t => t.id === tourId);
      return tour && ['Waiting', 'Active', 'Canceled'].includes(tour.state);
    });
  };

  const enabled = (id) => {
    return true
  }

  const openDialg = (id, operation, onClick) => {
    setOperation(operation)
    setOperationOnClick(() => onClick)
    const ids = Array.isArray(id) ? id : [id]
    setlength(ids.length)
    refDialog.current?.showModal();
  }


  const onCancelDialog = () => {
    refDialog.current?.close();
  }

    const onViewTour = (id) => {
      navigate(`/tour-info/${id}`)
  }


  const operations = [
    { name: "View", onClick: onViewTour, icon: faEye, enabledFun: checkViewState },
    { name: "End", onClick: (id) => openDialg(id, "End", () => end(id)), icon: faHourglassEnd, enabledFun: checkEndState },
    { name: "Cancel", onClick: (id) => openDialg(id, "Cancel", () => cancel(id)), icon: faPlaneSlash, enabledFun: checkCancelState },
    { name: "Delete", onClick: (id) => openDialg(id, "Delete", () => delet(id)), icon: faTrash, enabledFun: enabled },
  ];

  return (
    <>
      {helpers ? (<>
    <TourStatesHolder setShowFilters={()=>setShowFilters(i=>!i)} main={main} active={toorState} tourStateEvent={setToorStateEvent} />
      {main && (<hr className='divider' />)}
      {showFilter && (
        <ToorsFiltersHolder setFilterEvent={(titles, names, ref)=>
        setFilterEvent(setActiveFilters, titles, names, ref)} activeFilters={activeFilters} />)}
      </>) : (
        
          <>
          <div style={{height: '20px'}}></div>
        <ToorsFiltersHolder setFilterEvent={(titles, names, ref)=>
        setFilterEvent(setActiveFilters, titles, names, ref)} activeFilters={activeFilters} helpers = {false} />
        </>
      )}

      <ToorsTable
        operations={operations} tours={filteredTours} state={toorState} sortFunctions={sortFunctions} />
      <ConfrimDialog
        sub={"tours"}
        refDialog={refDialog}
        operation={operation}
        onConfirm={operationOnClick}
        length={length}
        onCancel={onCancelDialog}
        onCancelDialog={onCancelDialog}
      />
    </>
  )
}
