import React, { useEffect, useRef, useState } from 'react'
import { ConfrimDialog } from '../../components/home/main/ConfirmDialog';
import { HandleRequest } from './HandleRequest'
import { apiDelete, fetchItems } from '../../functions/api'
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons'
import { buildSortFunction, compareAdded, compareExpenses, compareStates } from '../../functions/tableOperations'
import { SimpleStateHolder } from '../../components/home/main/SimpleStateHolder'
import { AirportsTable } from '../../components/home/airports/AirportsTable';
import { useAppStore } from '../../store';
import { useNavigate } from 'react-router-dom';

export const Airports = () => {
  const { agency, setPages } = useAppStore();
  const navigate = useNavigate();

  const [reqState, setReqState] = useState("success");
  const [airports, setAirports] = useState([]);
  const [searchedAirports, setSearchedAirports] = useState([]);
  const [searchVal, setSearchVal] = useState('');

  const refDialog = useRef(null);
  const [operation, setOperation] = useState('Delete');
  const [length, setlength] = useState(0);
  const [operationOnClick, setOperationOnClick] = useState(null);

  useEffect(() => {
    setPages(['Airports']);
    fetchAirports();
  }, []);

  async function fetchAirports() {
    await fetchItems("/airports", setAirports, setReqState, agency);
  }

  useEffect(() => {
    if (searchVal.trim() !== '') {
      search(airports);
    } else {
      setSearchedAirports(airports);
    }
  }, [searchVal, airports]);

  function search(airports) {
    if (searchVal.trim() !== '') {
      const lower = searchVal.toLowerCase();
      const filtered = airports.filter(itm =>
        itm.name.toLowerCase().includes(lower)
      );
      setSearchedAirports(filtered);
    } else {
      setSearchedAirports(airports);
    }
  }

  // Sorting Area
  const compareName = (a, b) => a.name.localeCompare(b.name);

  const sortFunctions = {
    byName: (reverse = false) => buildSortFunction(compareName, compareStates, reverse),
    byState: (reverse = false) => buildSortFunction(compareStates, compareName, reverse),
    byExpenses: (reverse = false) => buildSortFunction(compareExpenses, compareStates, reverse),
    byAdded: (reverse = false) => buildSortFunction(compareAdded, compareStates, reverse),
  };

  // 🧩 Operations
  const delet = async (id) => {
    const isArray = Array.isArray(id);
    const url = isArray ? `/airports` : `/airports/${id}`;
    const config = isArray ? { data: { ids: id } } : {};
    const res = await apiDelete(url, config);

    if (!res.error) {
      setAirports(prev =>
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

  const enabled = () => true;

  // 🧭 View airport details
  const onViewAirport = (id) => {
    navigate(`/airport-info/${id}`);
  };

  const openDialg = (id, operation, onClick) => {
    setOperation(operation);
    setOperationOnClick(() => onClick);
    const ids = Array.isArray(id) ? id : [id];
    setlength(ids.length);
    refDialog.current?.showModal();
  };

  const onCancelDialog = () => {
    refDialog.current?.close();
  };

  const operations = [
    {
      name: "View",
      onClick: onViewAirport,
      icon: faEye,
      enabledFun: enabled
    },
    {
      name: "Delete",
      onClick: (id) => openDialg(id, "Delete", () => delet(id, "airports")),
      icon: faTrash,
      enabledFun: enabled
    }
  ];

  return (
    <HandleRequest
      reqState={reqState}
      retry={fetchAirports}
      add={null}
      subject={"Airport"}
      layout={
        <>
          <SimpleStateHolder
            setSearch={setSearchVal}
            searchVal={searchVal}
            subject={"Airport"}
            route={'/add-airport'}
          />
          <hr className='divider' />
          <AirportsTable
            operations={operations}
            airports={!searchVal.trim() ? airports : searchedAirports}
            sortFunctions={sortFunctions}
          />
          <ConfrimDialog
            sub={"airports"}
            refDialog={refDialog}
            operation={operation}
            onConfirm={operationOnClick}
            length={length}
            onCancel={onCancelDialog}
            onCancelDialog={onCancelDialog}
          />
        </>
      }
    />
  );
};
