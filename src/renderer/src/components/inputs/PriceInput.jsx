import React from 'react'
import { NumberInputElement } from './NumberInputElement'
import { FilterCard } from '../home/filters/FilterCard'

export const PriceInput = ({
  style, hidden, display, name, value, onChange, onBlur, touched, activeCurr, setActiveCurr, 
  dialog = false, ration = 138, apply = null
}) => {

  // wrapper around your setActiveCurr
  const handleCurrencyChange = (titles, names, ref) => {
    
    const newCurr = names[0];

    if (newCurr === activeCurr) {
      setActiveCurr(titles, names, ref);
      return;
    }

    let newValue = value;

    if (activeCurr === "€" && newCurr === "DA") {
      // EUR → DA
      newValue = (value * ration).toFixed(2);
    } else if (activeCurr === "DA" && newCurr === "€") {
      // DA → EUR
      newValue = (value / ration).toFixed(2);
    }

    // update the price field
    onChange({
      target: {
        name,
        value: newValue,
      },
    });

    // call your original handler to update currency
    setActiveCurr(titles, names, ref);
  };

  return (
    <div className={`full-container ${hidden ? "hidden" : ""}`} >
      <div  className={`price-input-container ${hidden ? "hidden" : ""}`}
      style={style}>
      <NumberInputElement
        hidden={hidden}
        display={display}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        touched={touched}
      />
      <FilterCard
        dialog={dialog}
        price={true}
        hidden={hidden}
        title="empty"
        active={activeCurr}
        items={["DA", "€"]}
        setFilterEvent={handleCurrencyChange} // 👈 wrapped now
      />
      </div>

      {/* 👇 extra text */}
      {apply && <span
        className="apply-all-text"
        onClick={apply}
      >
        Apply At All
      </span>}
    </div>
  );
};
