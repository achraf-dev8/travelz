import React, { useEffect, useRef, useState } from 'react'
import { ConfrimDialog } from '../../components/home/main/ConfirmDialog';
import { HandleRequest } from './HandleRequest'
import { apiDelete, apiGet, fetchItems } from '../../functions/api'
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons'
import { buildSortFunction, compareAdded, compareExpenses, comparePrices, compareStates, makeCompare } from '../../functions/tableOperations'
import { DocumentsStateHolder } from '../../components/home/documents/DocumentStateHolder';
import { DocumentsTable } from '../../components/home/documents/DocumentsTable';
import { DocumentsFilterHolder } from '../../components/home/documents/DocumentsFilterHolder';
import { getFullName } from '../../functions/traveler';
import { VisaTable } from '../../components/home/documents/VisaTable';
import { ShowDocumentDialog } from '../../components/home/documents/ShowDocumentDialog';
import { ShowVisaDialog } from '../../components/home/documents/ShowVisaDialog';
import { useAppStore } from '../../store';

export const Documents = () => {
  const {agency, setPages} = useAppStore()
  const [reqState, setReqState] = useState("success");
  const [documents, setDocuments] = useState([]);
  const [visas, setVisas] = useState([]);
  const [types, setTypes] = useState(["All", "Passport", "Id"]);
  const [searchedDocs, setSearchedDocs] = useState([]);
  const [searchedVisas, setSearchedVisas] = useState([]);
  const refDialog = useRef(null);
  const refDocumentDialog = useRef(null);
  const refVisaDialog = useRef(null);
  const [operation, setOperation] = useState('Delete');
  const [length, setlength] = useState(0);
  const [operationOnClick, setOperationOnClick] = useState(null);
  const [document, setDocument] = useState(null);
  const [visa, setVisa] = useState(null);
  const [reOpen, setReOpen] = useState(0);
  const [searchVal, setSearchVal] = useState('');
  const [state, setState] = useState('Documents');
  const [activeFilters, setActiveFilters] = useState({ "Type": "All" });


  function getState() {
    return state == 'Visa' ? 'Visa File' : 'Document'
  }

  function setFilterEvent(titles, names, ref = null) {
    setActiveFilters(prev => {
      const updatedFilters = { ...prev };

      titles.forEach((title, index) => {
        updatedFilters[title] = names[index];
      });

      return updatedFilters;
    });

    //close dropdown
    if (ref) {
      ref.current.classList.add("disactive");

      setTimeout(() => {
        ref.current.classList.remove("disactive");
      }, 10);
    }
  }

  useEffect(() => {
    setPages(['Documents'])
    selectFetch()
  }, [state]);

  function selectFetch() {
    if (state == "Documents") {
      fetchDocuments()
    } else {
      fetchVisa()
    }

  }

  async function fetchVisa() {
    await fetchItems("/visa", setVisas, setReqState, agency);
  }

  async function fetchDocuments() {
    await fetchItems("/documents", setDocuments, setReqState, agency);
  }

  useEffect(() => {
    search();
  }, [searchVal, documents, activeFilters, state, visas]);

  function search() {
    const lower = searchVal.toLowerCase();
    const selectedType = activeFilters["Type"];

    if(state == "Documents"){
     const filtered = documents.filter(doc => {
      const matchName = getFullName(doc.traveler).toLowerCase().includes(lower);
      const matchType =
        state !== "Documents" || selectedType === "All" || doc.type === selectedType;
      console.log(state + selectedType + doc.type)

      return matchName && matchType;
    });
  setSearchedDocs(filtered);
  }else{
       const filtered = visas.filter(visa => {
      const matchName = getFullName(visa.traveler).toLowerCase().includes(lower);

      console.log(state + selectedType + visa.type)
      return matchName;
    })
  setSearchedVisas(filtered);
  }

    
    
  }


  // Sorting
   const compareName = makeCompare(
  a => getFullName(a.traveler ?? {first_name: "", last_name: ""}).toLowerCase(),
  (a, b) => a.localeCompare(b)
);

 const compareType = makeCompare(
  a => a.type?.toLowerCase() || "",
  (a, b) => {
    const priority = {
      Passport: 0,
      Ids: 1
    };

    const aPriority = priority[a.type] ?? 2;
    const bPriority = priority[b.type] ?? 2;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // Same priority (both fallback types), sort alphabetically
    return a.localeCompare(b);
  }
);

  const compareCountry = makeCompare(
  a => a.country?.toLowerCase() || "",
  (a, b) => a.localeCompare(b)
);

  const sortFunctions = {
    byName: (reverse = false) => buildSortFunction(compareName, compareAdded, reverse),
    byType: (reverse = false) => buildSortFunction(compareType, compareName, reverse),
    byAdded: (reverse = false) => buildSortFunction(compareAdded, compareName, reverse),
  };
  
  const visaSortFunctions = {
    byName: (reverse = false) => buildSortFunction(compareName, compareAdded, reverse),
    byExpenses: (reverse = false) => buildSortFunction(compareExpenses, compareName, reverse),
    byPrice: (reverse = false) => buildSortFunction(comparePrices, compareName, reverse),
    byAdded: (reverse = false) => buildSortFunction(compareAdded, compareName, reverse),
    byCountry: (reverse = false) => buildSortFunction(compareCountry, compareName, reverse),
    byState: (reverse = false) => buildSortFunction(compareStates, compareName, reverse),
  };

  // Delete
  const delet = async (id, state) => {
    const lowerCased = state.toLowerCase();
    const isArray = Array.isArray(id);
    const url = isArray ? `/${lowerCased}` : `/${lowerCased}/${id}`;
    const config = isArray ? { data: { ids: id } } : {};
    const res = await apiDelete(url, config);
    const setter = state == "Documents" ? setDocuments : setVisas;
    if (!res.error) {
      setter(prev =>
        isArray
          ? prev.filter(document => !id.includes(document.id))
          : prev.filter(document => document.id !== id)
      );
    } else {
      console.log(res);
      setReqState(res.error.source);
    }
  };

  const enabled = (id) => true;

  const openDocumentDialog = (id) => {
    setDocument(documents.find(d => d.id === id) || null);
    refDocumentDialog.current?.showModal();
  };

    const openVisaDialog = (id) => {
    setVisa(visas.find(d => d.id === id) || null);
    refVisaDialog.current?.showModal();
  };

  const operations = [
    {
      name: "Show",
      onClick: state ==  "Documents" ?  openDocumentDialog :  openVisaDialog,
      icon: faEye,
      enabledFun: enabled
    },
    {
      name: "Delete",
      onClick: (id) => openDialg(id, "Delete", () => delet(id, state)),
      icon: faTrash,
      enabledFun: enabled
    }
  ];

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

  const onCancelDocDialog = () => {
    refDocumentDialog.current?.close();
  };
  const onCancelVisaDialog = () => {
    refVisaDialog.current?.close();
  };
  function setFile(updatedFile, type) {

      setDocuments(prevDocs =>
      prevDocs.map(doc =>
        doc.id === document.id
          ? { ...doc, file_path: updatedFile.file_path, file_type: updatedFile.file_type, type: type, visa : updatedFile.visa }
          : doc
      )
    );
    setDocument(prev => ({
      ...prev,
      file_path: updatedFile.file_path, file_type: updatedFile.file_type, type: type, visa : updatedFile.visa 
    }));

    setReOpen(p => p + 1);
  }

  function setFullVisa(updatedVisa) {
      setVisas(prev =>
      prev.map(v =>
        v.id === visa.id
          ? { ...v, ...updatedVisa }
          : v
      )
    );
    setVisa(prev => ({
      ...prev, ...updatedVisa
    }));

    setReOpen(p => p + 1);
  }

  return (
    <HandleRequest
      reqState={reqState}
      retry={selectFetch}
      add={null}
      subject={"Document"}
      layout={
        (
          <>
            <DocumentsStateHolder active={state} state={getState()} changeState={setState}
              setSearch={setSearchVal} searchVal={searchVal}/>

            {state == "Documents" && (<DocumentsFilterHolder types={types}
              setFilterEvent={setFilterEvent} activeFilters={activeFilters} />)}

            <hr className='divider' />
            {
              state == "Documents" ? (<DocumentsTable
                operations={operations}
                documents={searchedDocs}
                sortFunctions={sortFunctions}
              />) : (<VisaTable
                operations={operations}
                Visa={searchedVisas}
                sortFunctions={visaSortFunctions}
              />)
            }
            <ConfrimDialog
              sub={state == "Documents" ? "documents" : "visa files"}
              refDialog={refDialog}
              operation={operation}
              onConfirm={operationOnClick}
              length={length}
              onCancel={onCancelDialog}
            />
            <ShowDocumentDialog
              setFile={setFile}
              reOpen={reOpen}
              refDialog={refDocumentDialog}
              doc={document}
              onConfirm={operationOnClick}
              onCancel={onCancelDocDialog}
            />
            <ShowVisaDialog
              setVisa={setFullVisa}
              reOpen={reOpen}
              refDialog={refVisaDialog}
              visa={visa}
              onConfirm={operationOnClick}
              onCancel={onCancelVisaDialog}
            />
          </>
        )}
    />
  );
};
