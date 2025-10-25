import React, { useEffect, useRef, useState } from 'react'
import { ConfrimDialog } from '../../components/home/main/ConfirmDialog';
import { HandleRequest } from './HandleRequest'
import { apiDelete, fetchItems } from '../../functions/api'
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons'
import { buildSortFunction, compareAdded, compareExpenses, compareStates } from '../../functions/tableOperations'
import { SimpleStateHolder } from '../../components/home/main/SimpleStateHolder'
import { BusesTable } from '../../components/home/buses/BusesTable';
import { useAppStore } from '../../store';
import { useNavigate } from 'react-router-dom';

export const Buses = () => {
  const navigate = useNavigate()
  const {agency, setPages} = useAppStore()
  const [reqState, setReqState] = useState("success");
  const [buses, setBuses] = useState([]);
  const [searchedBuses, setSearchedBuses] = useState([]);

  const refDialog = useRef(null);
  const [operation, setOperation] = useState('Delete');
  const [length, setlength] = useState(0);
  const [operationOnClick, setOperationOnClick] = useState(null);

  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    setPages(['Buses'])
    fetchBuses();
  }, []);

  async function fetchBuses() {
    await fetchItems("/buses", setBuses, setReqState, agency);
  }

  useEffect(() => {
    if (searchVal.trim() !== '') {
      search(buses);
    } else {
      setSearchedBuses(buses);
    }
  }, [searchVal, buses]);

  function search(buses) {
    if (searchVal.trim() !== '') {
      const lower = searchVal.toLowerCase();
      const filtered = buses.filter(itm =>
        itm.name.toLowerCase().includes(lower)
      );
      setSearchedBuses(filtered);
    } else {
      setSearchedBuses(buses);
    }
  }

  // Sorting
  const compareName = (a, b) => a.name.localeCompare(b.name);
  const sortFunctions = {
    byName: (reverse = false) => buildSortFunction(compareName, compareStates, reverse),
    byState: (reverse = false) => buildSortFunction(compareStates, compareName, reverse),
    byExpenses: (reverse = false) => buildSortFunction(compareExpenses, compareStates, reverse),
    byAdded: (reverse = false) => buildSortFunction(compareAdded, compareStates, reverse),
  };

  // Delete
  const delet = async (id) => {
    const isArray = Array.isArray(id);
    const url = isArray ? `/buses` : `/buses/${id}`;
    const config = isArray ? { data: { ids: id } } : {};
    const res = await apiDelete(url, config);

    if (!res.error) {
      setBuses(prev =>
        isArray
          ? prev.filter(bus => !id.includes(bus.id))
          : prev.filter(bus => bus.id !== id)
      );
    } else {
      console.log(res);
      setReqState(res.error.source);
    }
  };

  const enabled = (id) => true;
  const onViewBus = (id) => {
        navigate(`/bus-info/${id}`)
    };
  // ✅ Operations: View + Delete
  const operations = [
    { name: "View", onClick: onViewBus, icon: faEye, enabledFun: enabled },
    { name: "Delete", onClick: (id) => openDialg(id, "Delete", () => delet(id, "buses")), icon: faTrash, enabledFun: enabled },
  ];

  // Dialog
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

  return (
    <HandleRequest
      reqState={reqState}
      retry={fetchBuses}
      add={null}
      subject={"Bus"}
      layout={(
        <>
          <SimpleStateHolder setSearch={setSearchVal} searchVal={searchVal} subject={"Bus"} route={'/add-bus'} />
          <hr className='divider' />
          <BusesTable
            operations={operations}
            buses={!searchVal.trim() ? buses : searchedBuses}
            sortFunctions={sortFunctions}
          />
          <ConfrimDialog
            sub={"buses"}
            refDialog={refDialog}
            operation={operation}
            onConfirm={operationOnClick}
            length={length}
            onCancel={onCancelDialog}
            onCancelDialog={onCancelDialog}
          />
        </>
      )}
    />
  );
};
