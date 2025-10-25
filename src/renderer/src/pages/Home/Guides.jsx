import React, { useEffect, useRef, useState } from 'react';
import { ConfrimDialog } from '../../components/home/main/ConfirmDialog';
import { HandleRequest } from './HandleRequest';
import { apiDelete, fetchItems } from '../../functions/api';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { buildSortFunction, compareAdded, compareExpenses, compareStates } from '../../functions/tableOperations';
import { GuidesTable } from '../../components/home/guides/GuidesTable';
import { SimpleStateHolder } from '../../components/home/main/SimpleStateHolder';
import { useAppStore } from '../../store';
import { useNavigate } from 'react-router-dom';

export const Guides = () => {
  const navigate = useNavigate();
  const { agency, setPages } = useAppStore();

  const [reqState, setReqState] = useState("success");
  const [guides, setGuides] = useState([]);
  const [searchedGuides, setSearchedGuides] = useState([]);

  const refDialog = useRef(null);
  const [operation, setOperation] = useState('Delete');
  const [length, setLength] = useState(0);
  const [operationOnClick, setOperationOnClick] = useState(null);
  const [searchVal, setSearchVal] = useState('');

  // 🧭 Page init
  useEffect(() => {
    setPages(['Guides']);
    fetchGuides();
  }, []);

  // 🧩 Fetch guides
  async function fetchGuides() {
    await fetchItems("/guides", setGuides, setReqState, agency);
  }

  // 🔍 Search logic
  useEffect(() => {
    if (searchVal.trim() !== '') {
      const lower = searchVal.toLowerCase();
      const filtered = guides.filter(itm =>
        itm.name.toLowerCase().includes(lower)
      );
      setSearchedGuides(filtered);
    } else {
      setSearchedGuides(guides);
    }
  }, [searchVal, guides]);

  // 🔃 Sorting setup
  const compareName = (a, b) => a.name.localeCompare(b.name);
  const sortFunctions = {
    byName: (reverse = false) => buildSortFunction(compareName, compareStates, reverse),
    byState: (reverse = false) => buildSortFunction(compareStates, compareName, reverse),
    byExpenses: (reverse = false) => buildSortFunction(compareExpenses, compareStates, reverse),
    byAdded: (reverse = false) => buildSortFunction(compareAdded, compareStates, reverse),
  };

  // ❌ Delete guide(s)
  const delet = async (id) => {
    const isArray = Array.isArray(id);
    const url = isArray ? `/guides` : `/guides/${id}`;
    const config = isArray ? { data: { ids: id } } : {};

    const res = await apiDelete(url, config);
    if (!res.error) {
      setGuides(prev =>
        isArray
          ? prev.filter(g => !id.includes(g.id))
          : prev.filter(g => g.id !== id)
      );
    } else {
      console.log(res);
      setReqState(res.error.source);
    }
  };

  // 👁️ View guide
  const onViewGuide = (id) => {
    navigate(`/guide-info/${id}`);
  };

  // ⚙️ Operations (View + Delete)
  const enabled = () => true;
  const operations = [
    { name: "View", onClick: onViewGuide, icon: faEye, enabledFun: enabled },
    { name: "Delete", onClick: (id) => openDialog(id, "Delete", () => delet(id)), icon: faTrash, enabledFun: enabled },
  ];

  // 💬 Confirm dialog
  const openDialog = (id, operation, onClick) => {
    setOperation(operation);
    setOperationOnClick(() => onClick);
    const ids = Array.isArray(id) ? id : [id];
    setLength(ids.length);
    refDialog.current?.showModal();
  };

  const onCancelDialog = () => {
    refDialog.current?.close();
  };

  // 🧱 Final Layout
  return (
    <HandleRequest
      reqState={reqState}
      retry={fetchGuides}
      add={null}
      subject={"Guide"}
      layout={(
        <>
          <SimpleStateHolder setSearch={setSearchVal} searchVal={searchVal} subject={"Guide"} route={'/add-guide'} />
          <hr className='divider' />
          <GuidesTable
            operations={operations}
            guides={!searchVal.trim() ? guides : searchedGuides}
            sortFunctions={sortFunctions}
          />
          <ConfrimDialog
            sub={"guides"}
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
