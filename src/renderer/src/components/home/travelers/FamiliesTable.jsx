
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

export const FamiliesTable = ({operations, families = [], sortFunctions }) => {

  const [currentSortFn, setCurrentSortFn] = useState(() => sortFunctions.byState);
  const [sortOrder, setSortOrder] = useState('asc');
  const [checkedIds, setcheckedIds] = useState([]);

    const handleSort = (sortFn, order = 'asc') => {
    setCurrentSortFn(() => sortFn);
    setSortOrder(order);
  };

  // Apply sorting
// ✅ Keep this clean
const sortedfamilies = React.useMemo(() => {
  if (!currentSortFn) return families;
  return [...families].sort(currentSortFn(sortOrder === 'desc'));
}, [families, currentSortFn, sortOrder]);

// ✅ Move setcheckedIds into useEffect
useEffect(() => {
  setcheckedIds(prev => {
    if (prev.length !== families.length) {
      return [];
    }
    return prev;
  });
}, [families]);


  const lines = sortedfamilies.map((item, i) => (
    <tr key={i}>
      <td><input checked={checkedIds.includes(sortedfamilies[i].id)} 
      onChange={() => handleCheck(sortedfamilies[i], setcheckedIds)} type="checkbox" /></td>
      <TableElement text={item.family_name} clickable={true} />
      <TableElement text={item.members} clickable={true} />
      <TableElement text={getExpenses(item)} />
      <TableElement text={getProfit(item)} />
      <TableElement text={formatApiDate(item.creation_date)} />
      <td><StateDisplay text = {item.state}/></td>
      <td><SelectElement operations = {operations} id={sortedfamilies[i].id}/></td>
    </tr>
  ));

  return (
    <Table operations = {operations}  selectedItems={checkedIds}
      globalCheck = {() => globalCheck(setcheckedIds, families)}
      lines={lines}
      headerItems={[
        { name: "Family Name",  sorting: {
            asc: () => handleSort(sortFunctions.byFamilyName, 'asc'),
            desc: () => handleSort(sortFunctions.byFamilyName, 'desc'),
          }
        },
        {
          name: "Members",
          sorting: {
            asc: () => handleSort(sortFunctions.byMembers, 'asc'),
            desc: () => handleSort(sortFunctions.byMembers, 'desc'),
          }
        },
        {
          name: "Expenses",
          sorting: {
            asc: () => handleSort(sortFunctions.byExpenses, 'asc'),
            desc: () => handleSort(sortFunctions.byExpenses, 'desc'),
          }
        },
        {
          name: "Payements",
          sorting: {
            asc: () => handleSort(sortFunctions.byPayements, 'asc'),
            desc: () => handleSort(sortFunctions.byPayements, 'desc'),
          }
        },
        {
          name: "Added",
          sorting: {
            asc: () => handleSort(sortFunctions.byAdded, 'asc'),
            desc: () => handleSort(sortFunctions.byAdded, 'desc'),
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
}
