import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { InputElement } from './InputElement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHotel } from '@fortawesome/free-solid-svg-icons';

export const AutoCompleteField = ({
  onSelect, style,
  value,
  name,
  onChange,
  onBlur,
  touched,
  display,
  error,
  fetchData,
  onBlurSelect = false,
  hidden,
  icon
}) => {
  const [debouncedQuery] = useDebounce(value, 500);
  const [results, setResults] = useState([]);

  // Support `skipRef` inside fetchData or create default
  const skipFetchRef = fetchData.skipRef;
  const fetch = fetchData.fetch;

  const onChoose = (item) => {
    skipFetchRef.current = true;
    onChange({
      target: {
        name,
        value: item.display_name,
      },
    });
    onSelect(item);
  };

  useEffect(() => {
    if (
      !debouncedQuery ||
      skipFetchRef.current ||
      debouncedQuery.toLowerCase() === 'mecca'
    ) {
      skipFetchRef.current = false;
      setResults([]);
      return;
    }
    
    fetch(debouncedQuery)
      .then((data) => {
        setResults(data);
      })
      .catch((err) => {
        console.error('Failed to fetch:', err.message);
        setResults([]);
      });
      
  }, [debouncedQuery]);

  return (
    <div className={`input-autocomplete ${error ? 'error' : ''} ${hidden ? 'hidden' : ''}`} style={style}>
      <InputElement
        value={value}
        name={name}
        display={display}
        touched={touched}
        onBlur={(e) => {
          onBlur(e);
          if (onBlurSelect) {
            onSelect({ display_name: value });
          }
          setTimeout(() => setResults([]), 200);
        }}
        onChange={onChange}
        error={error}
        style={(results?.length || 0) > 0}
      />
      {((results?.length || 0) > 0) && (
        <ul className="autocomplete-list">
          {results.map((item, i) => {
            const isSaved = item.agency_id != null;
            return (
              <li
                key={i}
                className={`autocomplete-item ${isSaved ? 'saved' : ''}`}
                onClick={() => onChoose(item)}
              >
                {isSaved && (
                  <FontAwesomeIcon style={{ fontSize: '14px' }} icon={icon} />
                )}
                <p>{item.display_name}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
