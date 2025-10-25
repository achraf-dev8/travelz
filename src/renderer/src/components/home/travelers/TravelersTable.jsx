
import React, { useEffect, useRef, useState } from 'react';
import { Table } from '../table/Table';
import { getExpenses, getProfit } from '../../../functions/money';
import { getFullName } from '../../../functions/traveler';
import { TableElement } from '../table/TableElement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StateDisplay } from '../table/StateDisplay';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { formatApiDate } from '../../../functions/dates';
import { globalCheck, handleCheck } from '../../../functions/tableOperations';
import { SelectElement } from '../table/selectElement';

export const TravelersTable = ({operations, travelers = [], sortFunctions }) => {

  const [currentSortFn, setCurrentSortFn] = useState(() => sortFunctions.byState);
  const [sortOrder, setSortOrder] = useState('asc');
  const [checkedIds, setcheckedIds] = useState([]);

    const handleSort = (sortFn, order = 'asc') => {
    setCurrentSortFn(() => sortFn);
    setSortOrder(order);
  };

  // Apply sorting
  const sortedtravelers = React.useMemo(() => {
    if (!currentSortFn) return travelers;

    setcheckedIds(prev => prev.filter(id => travelers.some(h => h.id === id)));

    return [...travelers].sort(currentSortFn(sortOrder === 'desc'));
    
  }, [travelers, currentSortFn, sortOrder]);

  const lines = sortedtravelers.map((item, i) => (
    <tr key={i}>
      <td><input checked={checkedIds.includes(sortedtravelers[i].id)} 
      onChange={() => handleCheck(sortedtravelers[i], setcheckedIds)} type="checkbox" /></td>
      <TableElement text={getFullName(item)} />
      <TableElement text={item.age} />
      <TableElement text={item.address} />
      <TableElement text={`${item.revenue} ${item.revenue_currency}`} />
      <TableElement text={item.phone_number} />
      <TableElement text={formatApiDate(item.creation_date)} />
      <td><StateDisplay text={item.state} /></td>
      <td><SelectElement operations = {operations} id={sortedtravelers[i].id}/></td>
    </tr>
  ));

  return (
    <Table operations = {operations}  selectedItems={checkedIds}
      globalCheck = {() => globalCheck(setcheckedIds, travelers)}
      lines={lines}
      headerItems={[
        { name: "Name",  sorting: {
            asc: () => handleSort(sortFunctions.byName, 'asc'),
            desc: () => handleSort(sortFunctions.byName, 'desc'),
          }
        },
        {
          name: "Age",
          sorting: {
            asc: () => handleSort(sortFunctions.byAge, 'asc'),
            desc: () => handleSort(sortFunctions.byAge, 'desc'),
          }
        },
        {
          name: "Address"
        },
        {
          name: "Revenue",
          sorting: {
            asc: () => handleSort(sortFunctions.byPayements, 'asc'),
            desc: () => handleSort(sortFunctions.byPayements, 'desc'),
          }
        },
        {name : "Phone Number"},
        {name : "Added", sorting : {
           asc: () => handleSort(sortFunctions.byAdded, 'asc'),
            desc: () => handleSort(sortFunctions.byAdded, 'desc'),
        }},
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
}
