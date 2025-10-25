import React, { useEffect, useState } from "react";
import { Table } from '../table/Table';
import { TableElement } from '../table/TableElement';
import { globalCheck, handleCheck } from '../../../functions/tableOperations';
import { SelectElement } from '../table/selectElement';
import { formatApiDate } from "../../../functions/dates";
import { StateDisplay } from "../table/StateDisplay";
import { getFullName } from "../../../functions/traveler";
import { useNavigate } from "react-router-dom";

export const DocumentsTable = ({ operations, documents = [], sortFunctions }) => {
  const navigate = useNavigate()
  const [currentSortFn, setCurrentSortFn] = useState(() => sortFunctions.byName);
  const [sortOrder, setSortOrder] = useState('desc');
  const [checkedIds, setcheckedIds] = useState([]);

  useEffect(() => {
    setCurrentSortFn(() => sortFunctions.byName);
    setSortOrder('desc');
  }, [sortFunctions]);
  
  const handleSort = (sortFn, order = 'asc') => {
    setCurrentSortFn(() => sortFn);
    setSortOrder(order);
  };

  // Apply sorting
  const sortedDocuments = React.useMemo(() => {
    if (!currentSortFn) return documents;
    setcheckedIds(prev => prev.filter(id => documents.some(d => d.id === id)));
    return [...documents].sort(currentSortFn(sortOrder === 'desc'));
  }, [documents, currentSortFn, sortOrder]);

  const lines = sortedDocuments.map((item, i) => (
    <tr key={item.id || i}>
      <td>
        <input
          checked={checkedIds.includes(item.id)}
          onChange={() => handleCheck(item, setcheckedIds)}
          type="checkbox"
        />
      </td>
      <TableElement text={getFullName(item.traveler ?? {first_name: "", last_name: ""})} 
      clickable={()=>navigate(`/traveler-info` + `/${item.traveler?.id}`)} />
      <TableElement text={item.type}/> 
      <TableElement text={formatApiDate(item.creation_date)} />
      <td><SelectElement operations={operations} id={item.id} /></td>
    </tr>
  ));

  return (
    <Table
      operations={operations}
      selectedItems={checkedIds}
      globalCheck={() => globalCheck(setcheckedIds, documents)}
      lines={lines}
      headerItems={[
        {
          name: "Name",
          sorting: {
            asc: () => handleSort(sortFunctions.byName, 'asc'),
            desc: () => handleSort(sortFunctions.byName, 'desc'),
          }
        },
        { 
          name: "Type", 
          sorting: {
            asc: () => handleSort(sortFunctions.byType, 'asc'),
            desc: () => handleSort(sortFunctions.byType, 'desc'),
          }
        },
        {
          name: "Added",
          sorting: {
            asc: () => handleSort(sortFunctions.byAdded, 'asc'),
            desc: () => handleSort(sortFunctions.byAdded, 'desc'),
          }
        }
      ]}
    />
  );
};