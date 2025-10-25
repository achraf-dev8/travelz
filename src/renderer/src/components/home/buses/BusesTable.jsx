import React, { useEffect, useState } from "react";
import { Table } from '../table/Table';
import { TableElement } from '../table/TableElement';
import { StateDisplay } from '../table/StateDisplay';
import { globalCheck, handleCheck } from '../../../functions/tableOperations';
import { SelectElement } from '../table/selectElement';

export const BusesTable = ({ operations, buses = [], sortFunctions }) => {

  const [currentSortFn, setCurrentSortFn] = useState(() => sortFunctions.byState);
  const [sortOrder, setSortOrder] = useState('asc');
  const [checkedIds, setcheckedIds] = useState([]);

  const handleSort = (sortFn, order = 'asc') => {
    setCurrentSortFn(() => sortFn);
    setSortOrder(order);
  };

  // Apply sorting
  const sortedBuses = React.useMemo(() => {
    if (!currentSortFn) return buses;
    setcheckedIds(prev => prev.filter(id => buses.some(b => b.id === id)));
    return [...buses].sort(currentSortFn(sortOrder === 'desc'));
  }, [buses, currentSortFn, sortOrder]);

  const lines = sortedBuses.map((item, i) => (
    <tr key={i}>
      <td>
        <input
          checked={checkedIds.includes(item.id)}
          onChange={() => handleCheck(item, setcheckedIds)}
          type="checkbox"
        />
      </td>
      <TableElement text={item.name} />
      <TableElement text={item.phone_number} />
      <TableElement text={`${item.expenses} ${item.expenses_currency}`} />
      <td><StateDisplay text={item.state} /></td>
      <td><SelectElement operations={operations} id={item.id} /></td>
    </tr>
  ));

  return (
    <Table
      operations={operations}
      selectedItems={checkedIds}
      globalCheck={() => globalCheck(setcheckedIds, buses)}
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
          name: "Phone Number",
        },
        {
          name: "Expenses",
          sorting: {
            asc: () => handleSort(sortFunctions.byExpenses, 'asc'),
            desc: () => handleSort(sortFunctions.byExpenses, 'desc'),
          }
        },
        {
          name: "State",
          sorting: {
            asc: () => handleSort(sortFunctions.byState, 'asc'),
            desc: () => handleSort(sortFunctions.byState, 'desc'),
          }
        }
      ]}
    />
  );
};
