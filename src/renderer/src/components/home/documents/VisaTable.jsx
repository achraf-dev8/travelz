import React, { useEffect, useState } from "react";
import { Table } from '../table/Table';
import { TableElement } from '../table/TableElement';
import { globalCheck, handleCheck } from '../../../functions/tableOperations';
import { SelectElement } from '../table/selectElement';
import { formatApiDate } from "../../../functions/dates";
import { StateDisplay } from "../table/StateDisplay";
import { getFullName } from "../../../functions/traveler";
import { useNavigate } from "react-router-dom";

export const VisaTable = ({ operations, Visa = [], sortFunctions }) => {
  const navigate = useNavigate()
  const [currentSortFn, setCurrentSortFn] = useState(() => sortFunctions.byName);
  const [sortOrder, setSortOrder] = useState('desc');
  const [checkedIds, setcheckedIds] = useState([]);

  const handleSort = (sortFn, order = 'asc') => {
    setCurrentSortFn(() => sortFn);
    setSortOrder(order);
  };

  // Apply sorting
  const sortedVisa = React.useMemo(() => {
    if (!currentSortFn) return Visa;
    setcheckedIds(prev => prev.filter(id => Visa.some(d => d.id === id)));
    return [...Visa].sort(currentSortFn(sortOrder === 'desc'));
  }, [Visa, currentSortFn, sortOrder]);

  const lines = sortedVisa.map((item, i) => (
    <tr key={i}>
      <td>
        <input
          checked={checkedIds.includes(item.id)}
          onChange={() => handleCheck(item, setcheckedIds)}
          type="checkbox"
        />
      </td>
      <TableElement text={getFullName(item.traveler)} 
      clickable={()=>navigate('/traveler-info', {state: { id: item.traveler.id }})}/>
      <TableElement text={item.country} />
      <TableElement text={item.documents?.length ?? 0} />
      <TableElement text={`${item.expenses} ${item.expense_curr}`} />
      <TableElement text={`${item.price} ${item.price_curr}`} />
      <TableElement text={formatApiDate(item.creation_date)} />
      <TableElement text={item.tour} 
      clickable={()=>navigate(`/tour-info/${item.tour}`)}/>
      {item.state ?  <td><StateDisplay text={item.state}/></td> : <TableElement text={null} />}
      <td><SelectElement operations={operations} id={item.id} /></td>
    </tr>
  ));

  return (
    <Table
      operations={operations}
      selectedItems={checkedIds}
      globalCheck={() => globalCheck(setcheckedIds, Visa)}
      lines={lines}
      headerItems={[
        {
          name: "Name",
          sorting: {
            asc: () => handleSort(sortFunctions.byName, 'asc'),
            desc: () => handleSort(sortFunctions.byName, 'desc'),
          }
        },{
          name: "Country",
          sorting: {
            asc: () => handleSort(sortFunctions.byCountry, 'asc'),
            desc: () => handleSort(sortFunctions.byCountry, 'desc'),
          }
        },
        
        {
          name: "Documents",
        },
        { name: "Expenses", 
                sorting: {
            asc: () => handleSort(sortFunctions.byExpenses, 'asc'),
            desc: () => handleSort(sortFunctions.byExpenses, 'desc'),
          }
        }, { name: "Price", 
              sorting: {
            asc: () => handleSort(sortFunctions.byPrice, 'asc'),
            desc: () => handleSort(sortFunctions.byPrice, 'desc'),
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
          name: "Tour Id",
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
