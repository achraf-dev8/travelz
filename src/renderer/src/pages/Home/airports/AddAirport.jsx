import React, { useEffect, useRef, useState } from 'react';
import { AddHolder } from '../../../components/home/add/AddHolder';
import { InputElement } from '../../../components/inputs/InputElement';
import '../../../styles/Inputs.css';
import { NumberInputElement } from '../../../components/inputs/NumberInputElement';
import { ItemAddedCards } from '../../../components/home/add/ItemAddedCards';
import { SectionHeader } from '../../../components/inputs/SectionHeader';
import { apiGet, apiPost } from '../../../functions/api';
import { FilterDropDown } from '../../../components/home/filters/FilterDropDown';
import { HandleRequest } from '../HandleRequest';
import { PriceInput } from '../../../components/inputs/PriceInput';
import { useFormik } from 'formik';
import { baseSchema, airportSchema, allAirportSchema } from '../../../functions/schema';
import { setPriceCurr } from '../../../functions/filters';
import { AutoCompleteField } from '../../../components/inputs/AutoCompleteField';
import { faPlaneDeparture } from '@fortawesome/free-solid-svg-icons';
import { useAppStore } from '../../../store';
import { useNavigate } from 'react-router-dom';

export const AddAirport = ({ page = false }) => {
  const navigate = useNavigate();
  const [reqState, setReqState] = useState("success");
  const [validConfirm, setValidConfirm] = useState("disactive");
  const [validAdd, setValidAdd] = useState("disactive");
  const [airports, setAirports] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [currency, setCurrency] = useState("DA");
  const skipName = useRef(true)
  const {agency, setPages} = useAppStore();

  useEffect (() => {
    setPages(['Airports', 'Add Airport'])
  }, []);

  useEffect(() => {
    setValidConfirm(airports.length === 0 ? "disactive" : "");
  }, [airports]);

  const formik = useFormik({
    initialValues: {
      name: "",
      phoneNumber: "",
      location: "",
      ticketPrice: "",
    },
    validationSchema: allAirportSchema,
    onSubmit: () => { },
    validateOnBlur: false,
    validateOnChange: false,
  });

  const { values, errors, touched, handleChange, handleBlur, setFieldValue, setValues } = formik;

  useEffect(() => {
    if (values.name.trim()) {
      setValidAdd("");
    } else {
      setValidAdd("disactive");
    }
  }, [values.name])

  async function confirm() {
    if (validConfirm === "disactive") return;
    console.log("Submitting airports:", airports);

    const response = await apiPost("/airports", airports);

    if (!response.error) {
      navigate(-1);
    } else {
      setReqState(response.error.source);
    }
  }

  function refreshPage() {
    setReqState("success");
    skipName.current = true
  }

  async function addItem() {
    if (validAdd === "disactive") return;
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0 || validAdd === 'disactive') return;

    const newItem = {
      agency_id : agency.id,
      name: values.name,
      phoneNumber: values.phoneNumber,
      location: values.location,
      price: values.ticketPrice,
      currency: currency,
    };

    setAirports((prev) => [...prev, newItem]);
    emptyInputs();
  }
    
  async function editItem() {
    if (validAdd === "disactive") return;
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0 || validAdd === 'disactive') return;

    const newItem = {
      name: values.name,
      phoneNumber: values.phoneNumber,
      location: values.location,
      price: values.ticketPrice,
      currency: currency,
    };

    setAirports((prev) =>
      prev.map((item, index) => (index === selected ? newItem : item))
    );

    cancelSelect();
  }

  function deleteItem(i) {
    setAirports((prev) => prev.filter((_, index) => index !== i));
    if (selected === i) cancelSelect();
  }

  function selectEdit(i) {
    if (i !== selected) {
      setSelected(i);
      populateInputs(airports[i]);
    } else {
      cancelSelect();
    }
  }

  function cancelSelect() {
    setSelected(-1);
    emptyInputs();
  }

  function populateInputs(item) {
    setValues({
      name: item.name,
      phoneNumber: item.phoneNumber,
      location: item.location,
      ticketPrice: item.price,
    });
    setCurrency(item.currency);
  }

  function emptyInputs() {
    formik.resetForm();
    setCurrency("DA")
  }


  function selectAirport(airport) {
    skipName.current = true;
    console.log("selected", airport)
    formik.setFieldValue("name", airport.name);
    formik.setFieldValue("location", airport.location);
    formik.setFieldValue("phoneNumber", airport.phone_number);
    formik.setFieldValue("ticketPrice", airport.ticket_price);
    setCurrency(airport.currency)
  }

  const fetchAirportsData = async (query) => {
    try {
      const res = await apiGet(`/airports/search?query=${encodeURIComponent(query)}`, {
        cache: { ttl: 1000 * 60 * 5 },
      });
      return res.data.map(airport => ({
        ...airport,
        display_name: airport.name,
      }));
    } catch (err) {
      console.error("❌ Failed to fetch airports:", err.message);
      return [];
    }
  };

  return (
    <HandleRequest
      reqState={reqState}
      retry={refreshPage}
      layout={
        <>
          {airports.length > 0 && (
            <ItemAddedCards
              page={page}
              selectEdit={selectEdit}
              selected={selected}
              deleteItem={deleteItem}
              title={"Airports"}
              items={airports.map((item) => item.name)}
            />
          )}

          <div className="inputs-holder">
            <AutoCompleteField
              icon={faPlaneDeparture}
              fetchData={{ fetch: fetchAirportsData, skipRef: skipName }}
              onSelect={selectAirport}
              name="name"
              display="Name*"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
            />

            <InputElement
              name="location"
              display="Location"
              value={values.location}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.location}
              touched={touched.location}
            />
          </div>

          <div className="inputs-holder">
            <InputElement
              name="phoneNumber"
              display="Phone Number"
              value={values.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.phoneNumber}
              touched={touched.phoneNumber}
            />

            <PriceInput
              display={"Ticket Price"}
              name={"ticketPrice"}
              value={values.ticketPrice}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.ticketPrice}
              activeCurr={currency}
              setActiveCurr={(titles, names, ref) => setPriceCurr(names[0], setCurrency, ref)}
            />
          </div>

          <AddHolder
            page={true}
            confirm={confirm}
            cancelSelect={cancelSelect}
            state={selected == -1 ? "Add" : "Edit"}
            validConfirm={validConfirm}
            validAdd={validAdd}
            addEvent={addItem}
            editEvent={editItem}
          />
        </>
      }
    />
  );
};