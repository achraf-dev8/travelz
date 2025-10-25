import React from 'react';

export const NumberInputElement = ({
  display,
  name,
  min = 1,
  max = null,
  step = 'any', // allows decimal input
  onChange,
  value,
  onBlur,
  touched, hidden = false, error
}) => {
  const handleChange = (event) => {
    const newValue = event.target.value;

    // Prevent negative values
    if (Number(newValue) < 0) return;

    onChange(event); // let Formik handle it
  };

  return (
    <div className={`input-container  ${hidden ? 'hidden' : 'number'}`}>
      {display && (<p>{display}</p>)}
      <input className={`${touched && error ? "input-error" : ""}`}
        name={name}
        type='number'
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        touched={touched}
      />
      <p className='error'>{touched && error}</p>

    </div>
  );
};
