import React, { useEffect, useState } from 'react';
import { TableElement } from './TableElement';
import { StateDisplay } from './StateDisplay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faPlus, faMinus, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import '../../../styles/Table.css';
import { TableHeaderElement } from './TableHeaderElement';
import { NumberInputElement } from '../../inputs/NumberInputElement';

export const Table = ({ headerItems = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [shownElements, setShownElements] = useState(20);
  const totalElements = 500

  const locationTest = "Algeria Algeria Algeria Algeria Algeria Algeria Algeria Algeria Algeria Algeria Algeria Algeria Algeria Algeria Algeria";
  
  const rows = Array.from({ length: 10 }, (_, i) => (
    <tr key={i}>
      <td><input type="checkbox" /></td>
      <TableElement text={locationTest} clickable={true} />
      <TableElement text="2023-17-5 10:30" clickable={false} />
      <TableElement text="2023-17-5 10:50" clickable={false} />
      <TableElement text="Traveler 1" clickable={true} />
      <TableElement text="200$" clickable={false} />
      <TableElement text="200$" clickable={false} />
      <td><StateDisplay text={i === 0 || i === 1 || i === 5 || i === 9 ? "Canceled" : i === 3 ? "Active" : i === 4 ? "Ended" : "Waiting"} /></td>
      <td><div className='icon-container ellipsis td'>
        <FontAwesomeIcon icon={faEllipsis} />
      </div></td>
    </tr>
  ));

    useEffect(() => {
      if(shownElements>totalElements) shownElements = totalElements
    definePageNumber(shownElements)
  }, [])

  const handlePageChange = (delta) => {
    setCurrentPage((prev) => Math.min(Math.max(prev + delta, 1), totalPages));
  };

  const changeShownElements = (value) => {

    if(value.trim() == ''){
      setShownElements(value); 
      return
    }
    if(value != shownElements){
    let realValue = parseInt(value || 0, 10)
    if(realValue<1) realValue = 1
    if(realValue>totalElements) realValue = totalElements
    setShownElements(realValue)
    definePageNumber(realValue)
    }

  };

  function definePageNumber(realValue){
    const totalPages = Math.ceil(totalElements / realValue)
    setTotalPages(totalPages);
    setCurrentPage(1)
  }


  return (
    <div className='table-container'>
      <table className="table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            {headerItems.map((item, i) => (
              <TableHeaderElement key={i} name={item.name} sorting={item.sorting} />
            ))}
            <th><div className='icon-container ellipsis'>
              <FontAwesomeIcon icon={faEllipsis} />
            </div></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>

      <div className='table-pages-holder'>
        {/* Left - Current Page */}
        <div className='current-page-controller'>
          <p className='page-plain'>Page </p>
          <button className='change-page-button' onClick={() => handlePageChange(-1)} disabled={currentPage === 1}>
            <FontAwesomeIcon icon={faAngleLeft}/>
          </button>
          <p className='page-number'>{`${currentPage}`}</p>
          <button className='change-page-button' onClick={() => handlePageChange(1)} disabled={currentPage === totalPages}>
             <FontAwesomeIcon icon={faAngleRight}/>
          </button>
          <p className='max-pages'>{`\u00A0/${totalPages}`}</p>
        </div>

        {/* Right - Total Pages Controller */}
        <div className='total-pages-controller'>
            <p className='elements-plain'>{`Elements:\u00A0\u00A0`}</p>
            <input type='number' min={1} max={totalElements}
            value={shownElements}
            onChange={(event)=>{changeShownElements(event.target.value)}} 
            >
            
            </input>
            <p className='max-elements'>{`\u00A0/${totalElements}`}</p>
        </div>
      </div>
    </div>
  );
};
