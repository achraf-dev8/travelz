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
import { baseSchema, guideSchema } from '../../../functions/schema';
import { setPriceCurr } from '../../../functions/filters';
import { AutoCompleteField } from '../../../components/inputs/AutoCompleteField';
import { faHiking, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { useAppStore } from '../../../store';
import { useNavigate } from 'react-router-dom';

export const AddGuide = ({ page = false }) => {
  const navigate = useNavigate();
  const [reqState, setReqState] = useState("success");
  const [validConfirm, setValidConfirm] = useState("disactive");
  const [validAdd, setValidAdd] = useState("disactive");
  const [guides, setGuides] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [currency, setCurrency] = useState("DA");
  const skipName = useRef(true)
  const {agency, setPages} = useAppStore();

  useEffect (() => {
    setPages(['Guides', 'Add Guide'])
  }, []);

  useEffect(() => {
    setValidConfirm(guides.length === 0 ? "disactive" : "");
  }, [guides]);

  const formik = useFormik({
    initialValues: {
      name: "",
      phoneNumber: "",
      pricePerDay: "",
    },
    validationSchema: guideSchema,
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
    console.log("Submitting guides:", guides);

    const response = await apiPost("/guides", guides);

    if (!response.error) {
      navigate(-1)
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
      price: values.pricePerDay,
      currency: currency,
    };

    setGuides((prev) => [...prev, newItem]);
    emptyInputs();
  }
    
  async function editItem() {
    if (validAdd === "disactive") return;
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0 || validAdd === 'disactive') return;

    const newItem = {
      name: values.name,
      phoneNumber: values.phoneNumber,
      price: values.pricePerDay,
      currency: currency,
    };

    setGuides((prev) =>
      prev.map((item, index) => (index === selected ? newItem : item))
    );

    cancelSelect();
  }

  function deleteItem(i) {
    setGuides((prev) => prev.filter((_, index) => index !== i));
    if (selected === i) cancelSelect();
  }

  function selectEdit(i) {
    if (i !== selected) {
      setSelected(i);
      populateInputs(guides[i]);
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
      pricePerDay: item.price,
    });
    setCurrency(item.currency)
  }

    function emptyInputs() {
    formik.resetForm();
    setCurrency("DA")
  }


  function selectGuide(guide) {
    skipName.current = true;
    console.log("selected", guide)
    formik.setFieldValue("name", guide.name);
    formik.setFieldValue("phoneNumber", guide.phone_number);
    formik.setFieldValue("pricePerDay", guide.price_per_day);
    setCurrency(guide.currency)
  }

  const fetchGuidesData = async (query) => {
    try {
      const res = await apiGet(`/guides/search?query=${encodeURIComponent(query)}`, {
        cache: { ttl: 1000 * 60 * 5 },
      });
      return res.data.map(guide => ({
        ...guide,
        display_name: guide.name,
      }));
    } catch (err) {
      console.error("❌ Failed to fetch guides:", err.message);
      return [];
    }
  };

  return (
    <HandleRequest
      reqState={reqState}
      retry={refreshPage}
      layout={
        <>
          {guides.length > 0 && (
            <ItemAddedCards
              page={page}
              selectEdit={selectEdit}
              selected={selected}
              deleteItem={deleteItem}
              title={"Guides"}
              items={guides.map((item) => item.name)}
            />
          )}

          <div className="inputs-holder">
            <AutoCompleteField
              icon={faHiking}
              fetchData={{ fetch: fetchGuidesData, skipRef: skipName }}
              onSelect={selectGuide}
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
              display={"Price Per Day"}
              name={"pricePerDay"}
              value={values.pricePerDay}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.pricePerDay}
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