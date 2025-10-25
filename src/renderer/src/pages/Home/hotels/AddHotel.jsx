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
import { baseSchema, hotelSchema } from '../../../functions/schema';
import { setPriceCurr } from '../../../functions/filters';
import { AutoCompleteField } from '../../../components/inputs/AutoCompleteField';
import { faHotel } from '@fortawesome/free-solid-svg-icons';
import { useAppStore } from '../../../store';
import { useNavigate } from 'react-router-dom';

export const AddHotel = ({ page = false }) => {
  const navigate = useNavigate();
  const [reqState, setReqState] = useState("success");
  const [validConfirm, setValidConfirm] = useState("disactive");
  const [validAdd, setValidAdd] = useState("disactive");
  const [hotels, setHotels] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [currency, setCurrency] = useState("DA");
  const skipName = useRef(true)
  const {agency, setPages} = useAppStore();

  useEffect (() => {
    setPages(['Hotels', 'Add Hotel'])
  }, []);
  
  useEffect(() => {
    setValidConfirm(hotels.length === 0 ? "disactive" : "");
  }, [hotels]);



    const formik = useFormik({
      initialValues: {
        name: "",
        phoneNumber: "",
        location: "",
        roomPrice: "",
      },
      validationSchema: hotelSchema,
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
    console.log("Submitting hotels:", hotels);

    const response = await apiPost("/hotels", hotels);

    if (!response.error) {
      navigate(-1);
    } else {
      setReqState(response.error.source);
    }
  }

  function refreshPage() {
    setReqState("success");
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
      price: values.roomPrice,
      currency: currency,
    };

    setHotels((prev) => [...prev, newItem]);
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
      roomPrice: values.roomPrice,
      currency: currency,
    };

    setHotels((prev) =>
      prev.map((item, index) => (index === selected ? newItem : item))
    );

    cancelSelect();
  }


  function deleteItem(i) {
    setHotels((prev) => prev.filter((_, index) => index !== i));
    if (selected === i) cancelSelect();
  }

  function selectEdit(i) {
    if (i !== selected) {
      setSelected(i);
      populateInputs(hotels[i]);
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
      roomPrice: item.price,
    });

    setCurrency(item.currency || "DA")
  }

  function emptyInputs() {
    formik.resetForm();
    setCurrency("DA")
  }


  
  function selectHotel(hotel) {
    skipName.current = true;
    console.log("selected", hotel)
    formik.setFieldValue("name", hotel.name);
    formik.setFieldValue("location", hotel.location);
    formik.setFieldValue("phoneNumber", hotel.phone_number);
    formik.setFieldValue("roomPrice", hotel.room_price);
    setCurrency(hotel.currency)
  }

    const fetchHotelsData = async (query) => {
      try {
        const res = await apiGet(`/hotels/search?query=${encodeURIComponent(query)}`, {
          cache: { ttl: 1000 * 60 * 5 },
        });
        return res.data.map(hotel => ({
          ...hotel,
          display_name: hotel.name,
        }));
      } catch (err) {
        console.error("❌ Failed to fetch hotels:", err.message);
        return [];
      }
    };

  return (
    <HandleRequest
      reqState={reqState}
      retry={refreshPage}
      layout={
        <>
          {hotels.length > 0 && (
            <ItemAddedCards
              page={page}
              selectEdit={selectEdit}
              selected={selected}
              deleteItem={deleteItem}
              title = {"Hotels"}
              items={hotels.map((item) => item.name)}
            />
          )}

          <div className="inputs-holder">
            <AutoCompleteField
            icon={faHotel}
            fetchData={{ fetch: fetchHotelsData, skipRef: skipName }}
            onSelect={selectHotel}
              name="name"
              display="Name*"
              value={values.name}
              onChange={handleChange}
               onBlur={handleBlur}
                error={errors.name}
                touched={touched.name}   />

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
            display={"Room Price"}
            name = {"roomPrice"}
            value={values.roomPrice}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.roomPrice}
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
