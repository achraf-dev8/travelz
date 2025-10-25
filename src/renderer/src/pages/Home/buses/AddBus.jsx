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
import { allBusSchema, baseSchema, busSchema } from '../../../functions/schema';
import { setPriceCurr } from '../../../functions/filters';
import { AutoCompleteField } from '../../../components/inputs/AutoCompleteField';
import { faBus } from '@fortawesome/free-solid-svg-icons';
import { useAppStore } from '../../../store';
import { useNavigate } from 'react-router-dom';

export const AddBus = ({ page = false }) => {
  const navigate = useNavigate();
  const [reqState, setReqState] = useState("success");
  const [validConfirm, setValidConfirm] = useState("disactive");
  const [validAdd, setValidAdd] = useState("disactive");
  const [buses, setBuses] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [currency, setCurrency] = useState("DA");
  const skipName = useRef(true)
  const {agency, setPages} = useAppStore();

  useEffect (() => {
    setPages(['Buses', 'Add Bus'])
  }, []);

  useEffect(() => {
    setValidConfirm(buses.length === 0 ? "disactive" : "");
  }, [buses]);

  const formik = useFormik({
    initialValues: {
      name: "",
      phoneNumber: "",
      ticketPrice: "",
    },
    validationSchema: allBusSchema,
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
    console.log("Submitting buses:", buses);

    const response = await apiPost("/buses", buses);

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
      price: values.ticketPrice,
      currency: currency,
    };

    setBuses((prev) => [...prev, newItem]);
    emptyInputs();
  }
    
  async function editItem() {
    if (validAdd === "disactive") return;
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0 || validAdd === 'disactive') return;

    const newItem = {
      name: values.name,
      phoneNumber: values.phoneNumber,
      price: values.ticketPrice,
      currency: currency,
    };

    setBuses((prev) =>
      prev.map((item, index) => (index === selected ? newItem : item))
    );

    cancelSelect();
  }

  function deleteItem(i) {
    setBuses((prev) => prev.filter((_, index) => index !== i));
    if (selected === i) cancelSelect();
  }

  function selectEdit(i) {
    if (i !== selected) {
      setSelected(i);
      populateInputs(buses[i]);
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
      ticketPrice: item.price,
    });
    setCurrency(item.currency)
  }

  function emptyInputs() {
    formik.resetForm();
    setCurrency("DA")
  }

  function selectBus(bus) {
    skipName.current = true;
    console.log("selected", bus)
    formik.setFieldValue("name", bus.name);
    formik.setFieldValue("phoneNumber", bus.phone_number);
    formik.setFieldValue("ticketPrice", bus.ticket_price);
    setCurrency(bus.currency)
  }

  const fetchBusesData = async (query) => {
    try {
      const res = await apiGet(`/buses/search?query=${encodeURIComponent(query)}`, {
        cache: { ttl: 1000 * 60 * 5 },
      });
      return res.data.map(bus => ({
        ...bus,
        display_name: bus.name,
      }));
    } catch (err) {
      console.error("❌ Failed to fetch buses:", err.message);
      return [];
    }
  };

  return (
    <HandleRequest
      reqState={reqState}
      retry={refreshPage}
      layout={
        <>
          {buses.length > 0 && (
            <ItemAddedCards
              page={page}
              selectEdit={selectEdit}
              selected={selected}
              deleteItem={deleteItem}
              title={"Bus Companies"}
              items={buses.map((item) => item.name)}
            />
          )}

          <div className="inputs-holder">
            <AutoCompleteField
              icon={faBus}
              fetchData={{ fetch: fetchBusesData, skipRef: skipName }}
              onSelect={selectBus}
              name="name"
              display="Name*"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
            />

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