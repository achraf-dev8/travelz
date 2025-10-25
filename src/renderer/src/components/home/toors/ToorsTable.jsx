import React, { useEffect, useRef, useState } from 'react';
import { Table } from '../table/Table';
import { getExpenses, getProfit } from '../../../functions/money';
import { getFullName } from '../../../functions/traveler';
import { TableElement } from '../table/TableElement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StateDisplay } from '../table/StateDisplay';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { formatApiDate, formatApiDateTime } from '../../../functions/dates';
import { globalCheck, handleCheck } from '../../../functions/tableOperations';
import { SelectElement } from '../table/selectElement';
import { useNavigate } from 'react-router-dom';

export const ToorsTable = ({operations, tours = [], state, sortFunctions }) => {

  const [currentSortFn, setCurrentSortFn] = useState(() => sortFunctions.byState);
  const [sortOrder, setSortOrder] = useState('asc');
  const [checkedIds, setcheckedIds] = useState([]);
  const navigate = useNavigate();

    const handleSort = (sortFn, order = 'asc') => {
    setCurrentSortFn(() => sortFn);
    setSortOrder(order);
  };

  // Apply sorting
  const sortedTours = React.useMemo(() => {
    if (!currentSortFn) return tours;
    setcheckedIds(prev =>     {if (prev.length != tours.length) {
      return [];
    } else {
      return prev      
    }})

    return [...tours].sort(currentSortFn(sortOrder === 'desc'));
  }, [tours, currentSortFn, sortOrder]);

  const lines = sortedTours.map((item, i) => (
    <tr key={i}>
      <td><input checked={checkedIds.includes(sortedTours[i].id)} 
      onChange={() => handleCheck(sortedTours[i], setcheckedIds)} type="checkbox" /></td>
      <TableElement text={item.destination} clickable={()=>5} />
      <TableElement text={formatApiDateTime(item.departure_date)} />
      <TableElement text={formatApiDateTime(item.return_date)} />
      <TableElement 
        text={
          item.travelers?.length == 1
            ? getFullName(item.travelers[0])
            : item.travelers?.length
        }
        clickable={item.travelers?.length == 1 ? ()=>navigate('/traveler-info' + `${item?.travelers[0].id}`) : null}
      />
      <TableElement text={`${item.expenses} ${item.expenses_currency}`} />
      <TableElement text={`${item.revenue} ${item.revenue_currency}`} />
      <TableElement text={`${item.note}`} />
      <td><StateDisplay text={item.state} /></td>
      <td><SelectElement operations = {operations} id={sortedTours[i].id}/></td>
    </tr>
  ));

  return (
    <Table operations = {operations}  selectedItems={checkedIds}
      globalCheck = {() => globalCheck(setcheckedIds, tours)}
      lines={lines}
      headerItems={[
        { name: "Destination" },
        {
          name: "Departure Date",
          sorting: {
            asc: () => handleSort(sortFunctions.byDepartureDate, 'asc'),
            desc: () => handleSort(sortFunctions.byDepartureDate, 'desc'),
          }
        },
        {
          name:
            state === "Canceled" || state === "Ended"
              ? state
              : state === "All"
              ? "End Date"
              : "Return Date",
          sorting: {
            asc: () => handleSort(sortFunctions.byReturnDate, 'asc'),
            desc: () => handleSort(sortFunctions.byReturnDate, 'desc'),
          }
        },
        { name: "Traveler(s)" },
        {
          name: "Expenses",
          sorting: {
            asc: () => handleSort(sortFunctions.byExpenses, 'asc'),
            desc: () => handleSort(sortFunctions.byExpenses, 'desc'),
          }
        },
        {
          name: "Revenue",
          sorting: {
            asc: () => handleSort(sortFunctions.byPrice, 'asc'),
            desc: () => handleSort(sortFunctions.byPrice, 'desc'),
          }
        },
        {
          name: "Note",
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
