import React, { useEffect, useState } from 'react';
import { TableHeaderElement } from './TableHeaderElement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import '../../../styles/Table.css';
import { SelectElement } from './selectElement';

export const Table = ({ edit= true
  , headerItems = [], lines = [], globalCheck, operations, selectedItems = [], setDeletEvent }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [shownElements, setShownElements] = useState(20);
  const [inputValue, setInputValue] = useState(shownElements);

  const totalElementsCount = lines.length;

  
  useEffect(() => {
    const newShownElements = shownElements
    if (totalElementsCount === 0) {
      setTotalPages(1);
      setCurrentPage(1);
      return;
    }
     
    const newTotalPages = Math.ceil(totalElementsCount / newShownElements);
    setTotalPages(newTotalPages);

    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  }, [totalElementsCount]);

  useEffect(() => {
    setInputValue(shownElements);
  }, [shownElements]);

  const definePageNumber = (count) => {
    const pages = Math.ceil(totalElementsCount / count);
    setTotalPages(pages);
    setCurrentPage(1);
  };

  const handlePageChange = (delta) => {
    setCurrentPage((prev) => Math.min(Math.max(prev + delta, 1), totalPages));
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputDone = () => {
    let parsed = parseInt(inputValue, 10);
    if (isNaN(parsed)) return;

    parsed = Math.max(1, parsed);
    setShownElements(parsed);
    definePageNumber(parsed);
  };

  const paginatedLines = lines.slice(
    (currentPage - 1) * shownElements,
    currentPage * shownElements
  );

  return (
    <div className='table-container'>
      {/* ✅ Move pagination + count to top */}
      <div className='table-pages-holder top'>
        <div className='current-page-controller'>
          <p className='page-plain'>Page </p>
          <button
            className='change-page-button'
            onClick={() => handlePageChange(-1)}
            disabled={currentPage <= 1}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <p className='page-number'>{currentPage}</p>
          <button
            className='change-page-button'
            onClick={() => handlePageChange(1)}
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
          <p className='max-pages'>{`\u00A0/${totalPages}`}</p>
        </div>

        <div className='total-pages-controller'>
          <p className='elements-plain'>Elements:&nbsp;&nbsp;</p>
          <input
            type='number'
            min={1}
            max={totalElementsCount}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputDone}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.target.blur();
            }}
          />
          <p className='max-elements'>{`\u00A0/${totalElementsCount}`}</p>
        </div>
      </div>

      <table className='table'>
        <thead>
          <tr>
            <th>
              <input
                type='checkbox'
                checked={selectedItems.length >= lines.length && lines.length !== 0}
                onChange={globalCheck}
              />
            </th>
            {headerItems.map((item, i) => (
              <TableHeaderElement
                key={i}
                name={item.name}
                onSortAsc={item.sorting?.asc}
                onSortDesc={item.sorting?.desc}
              />
            ))}
            {edit && <th>
              <SelectElement setDeletEvent={setDeletEvent} operations={operations} id={selectedItems} />
            </th>}
          </tr>
        </thead>

        <tbody>
          {paginatedLines.length === 0 ? (
            <tr>
              <td colSpan={headerItems.length + 2}>No data available</td>
            </tr>
          ) : (
            paginatedLines
          )}
        </tbody>
      </table>
    </div>
  );
};
