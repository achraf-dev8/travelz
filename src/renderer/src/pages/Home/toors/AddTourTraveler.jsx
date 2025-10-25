import React, { useEffect, useRef, useState } from 'react';
import { AddHolder } from '../../../components/home/add/AddHolder';
import { InputElement } from '../../../components/inputs/InputElement';
import '../../../styles/Inputs.css';
import { NumberInputElement } from '../../../components/inputs/NumberInputElement';
import { ItemAddedCards } from '../../../components/home/add/ItemAddedCards';
import { DatePickerCard } from '../../../components/inputs/DatePickerCard';
import { useFormik } from 'formik';
import { baseSchema, travelerSchema } from '../../../functions/schema';
import { FilterDropDown } from '../../../components/home/filters/FilterDropDown';
import { ShowDocumentDialog } from '../../../components/home/documents/ShowDocumentDialog';
import { AutoCompleteField } from '../../../components/inputs/AutoCompleteField';
import { faPerson } from '@fortawesome/free-solid-svg-icons';
import { SectionHeader } from '../../../components/inputs/SectionHeader';
import { api, apiGet, apiPost, apiPut } from '../../../functions/api';
import { getFullName } from '../../../functions/traveler';
import { formatApiDate, formatDate } from '../../../functions/dates';
import { PriceInput } from '../../../components/inputs/PriceInput';
import { setPriceCurr } from '../../../functions/filters';
import { FixedInputContainer } from '../../../components/inputs/FIxedInputContainer';
import { useLocation, useNavigate, useNavigation } from 'react-router-dom';
import { ConfirmButton } from '../../../components/home/add/ConfirmButton';
import { HandleRequest } from '../HandleRequest';
import { formatNumber } from '../../../functions/money';
import { globalOpenDocumentDialog, globalOpenVisaDialog, globalRemoveDocument, globalSetFile, globalSetVisa } from '../../../functions/handleDocuments';
import { DocumentsSection } from '../../../components/home/documents/DocumentsSection';
import { ShowVisaDialog } from '../../../components/home/documents/ShowVisaDialog';
import { useAppStore } from '../../../store';

export const AddTourTraveler = ({ page = false }) => {
  const navigate = useNavigate();

  let firstChange = true;
  const {agency, setPages, user} = useAppStore()
  const [initialized, setInitialized] = useState(null);
  const [birthDate, setBirthDate] = useState('any');
  const [validConfirm, setValidConfirm] = useState('disactive');
  const [validAdd, setValidAdd] = useState('disactive');
  const [travelers, setTravelers] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [document, setDocument] = useState(null);
  const [documentIndex, setDocumentIndex] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [visa, setVisa] = useState([]);
  const [visas, setVisas] = useState([]);
  const [visaIndex, setVisaIndex] = useState([]);
  const [editAdd, setEditAdd] = useState("Edit");
  const [reOpen, setReOpen] = useState(0);
  const [originalTraveler, setOriginalTraveler] = useState(0);
  const [reqState, setReqState] = useState("success");
  const refDocumentDialog = useRef(null);
  const refVisaDialog = useRef(null);
  const skipFirstName = useRef(false);

  // Currency states
  const [roomPriceCurr, setRoomPriceCurr] = useState("DA");
  const [depTicketCurr, setDepTicketCurr] = useState("DA");
  const [retTicketCurr, setRetTicketCurr] = useState("DA");
  const [priceCurr, setPriceCurr1] = useState("DA");
  const [hotelExpensesCurr, setHotelExpensesCurr] = useState("DA");
  const [departureExpensesCurr, setDepartureExpensesCurr] = useState("DA");
  const [returnExpensesCurr, setReturnExpensesCurr] = useState("DA");
  const [otherExpensesCurr, setOtherExpensesCurr] = useState("DA");
  const [guideExpensesCurr, setGuideExpensesCurr] = useState("DA");


  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      age: '',
      phoneNumber: '',
      address: '',
      roomPrice: '',
      depTicketPrice: '',
      retTicketPrice: '',
      price: '',
    },
    validationSchema: travelerSchema,
    onSubmit: selected == -1 ? addItem : edit,
    validateOnBlur: false,
    validateOnChange: false,
  });

  const formik2 = useFormik({
    initialValues: {
      hotelExpenses: '',
      departureExpenses: '',
      returnExpenses: '',
      otherExpenses: '',
      guideExpenses: '',
      visaExpenses: '',
      totalVisaPrice: '',
      totalExpenses: '',
      totalTourPrice: '',
      totalPrice: '',
    },
    validationSchema: travelerSchema,
    onSubmit: addTour,
    validateOnBlur: false,
    validateOnChange: false,
  });

  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;

  const location = useLocation();
  const { tour } = location.state || {};

  console.log(tour)

      useEffect(() => {
        
        if(tour.guide){
          const departureDate = tour.general.departureDate
          const returnDate = tour.general.returnDate
          if(!departureDate || !returnDate) {
            console.log("no dates"); 
            formik2.setFieldValue('guideExpenses', tour.guide.price);}
          else{
            console.log("with dates");
            const d1 =departureDate.setHours(0, 0, 0, 0);
            const d2 = returnDate.setHours(0, 0, 0, 0);
            const diffTime = d2 - d1;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
            formik2.setFieldValue('guideExpenses', diffDays * tour.guide.price);
          }
          
        }
  }, [tour]);

    useEffect(() => {
      setDefPrices()
  }, [tour]);

  useEffect(() => {
    if(tour.travelers){
    firstChange = false
    const travs = tour.travelers || [];
    console.log("travs", travs)
    setTravelers(travs.map((traveler) => {
      return {
      firstName : traveler.first_name,
      lastName : traveler.last_name,
      age : traveler.age,
      birthDate : traveler.birth_date || 'any',
      phoneNumber : traveler.phone_number,
      address : traveler.address || '',
      documents : traveler.documents || [],
      visas : traveler.visas || [],
      roomPrice: traveler.roomPrice || 0,
      depTicketPrice: traveler.depTicketPrice || 0,
      retTicketPrice: traveler.retTicketPrice || 0,
      price: traveler.price || 0,
      id: traveler.id || null,
      edit_add: 'No',
      originalTraveler : traveler || null,
      }
    }));

    }

  }, [tour]);


  function setDefPrices(){
    if(tour.hotel){
    if (tour.general?.departureDate && tour.general?.returnDate) {
    const d1 = new Date(tour.general.departureDate).setHours(0, 0, 0, 0);
    const d2 = new Date(tour.general.returnDate).setHours(0, 0, 0, 0);
    const diffTime = d2 - d1;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    setFieldValue('roomPrice', diffDays * tour.hotel.price);
  } else{
    setFieldValue('roomPrice', tour.hotel.price);
  }}

        if(tour.departureAirport) setFieldValue('depTicketPrice',tour.departureAirport.price);
        if(tour.departureBus) setFieldValue('depTicketPrice', tour.departureBus.price);
        if(tour.returnAirport) setFieldValue('retTicketPrice', tour.returnAirport.price);
        if(tour.returnBus) setFieldValue('retTicketPrice', tour.returnBus.price);
  }
  
  useEffect(() => {
    if(values.firstName != '' && values.lastName != '' && values.age != '') setValidAdd('') 
    else setValidAdd('disactive') 
  }, [values.firstName, values.lastName, values.age]);

  function visasExists(){
      for(let i = 0; i < travelers.length; i++){  
      if(travelers[i].visas && travelers[i].visas.length > 0) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    if(initialized != null){
    if(!initialized && tour.travelers){

    setInitialized(true);
    formik2.setFieldValue('hotelExpenses', tour.hotelExpenses)
    formik2.setFieldValue('departureExpenses', tour.departureExpenses)
    formik2.setFieldValue('returnExpenses', tour.returnExpenses)
    
    setHotelExpensesCurr(tour.hotelExpensesCurr ||'DA')
    setDepartureExpensesCurr(tour.departureExpensesCurr || 'DA')
    setRetTicketCurr(tour.returnExpensesCurr || 'DA')
    setGuideExpensesCurr(tour.guideExpensesCurr || 'DA')

    }else{
    console.log("lllllllllllllll")
    // بعد التعديلات فقط نحسب

    const totalVisaExpenses = travelers.reduce((sum, traveler) => {
  if (!traveler.visas) return sum; 
  return (
    sum +
    traveler.visas.reduce((visaSum, visa) => {
      return visaSum + (parseFloat(visa.expense) || 0);
    }, 0)
  );
}, 0);

    formik2.setFieldValue('visaExpenses', totalVisaExpenses);

    const totalVisaPrice = travelers.reduce((sum, traveler) => {
  if (!traveler.visas) return sum; 
  return (
    sum +
    traveler.visas.reduce((visaSum, visa) => {
      return visaSum + (parseFloat(visa.price) || 0);
    }, 0)
  );
}, 0);

    formik2.setFieldValue('totalVisaPrice', totalVisaPrice);

    const totalTourPrice = travelers.reduce((sum, traveler) => sum + (parseFloat(traveler.price) || 0), 0);
    formik2.setFieldValue('totalTourPrice', totalTourPrice);

    formik2.setFieldValue('totalPrice', totalTourPrice + totalVisaPrice);

    const retTicketPrice = travelers.reduce((sum, traveler) => sum + (parseFloat(traveler.retTicketPrice) || 0), 0);
    formik2.setFieldValue('returnExpenses', retTicketPrice);

    const totalDepPrice = travelers.reduce((sum, traveler) => sum + (parseFloat(traveler.depTicketPrice) || 0), 0);
    formik2.setFieldValue('departureExpenses', totalDepPrice);

    const totalRoomPrice = travelers.reduce((sum, traveler) => sum + (parseFloat(traveler.roomPrice) || 0), 0);
    formik2.setFieldValue('hotelExpenses', totalRoomPrice);
  }}else{
    setInitialized(false)
  }

  }, [travelers]);


  useEffect(() => {
    const totalExpenses = (parseFloat(formik2.values.hotelExpenses) || 0) + 
                         (parseFloat(formik2.values.departureExpenses) || 0) +
                         (parseFloat(formik2.values.returnExpenses) || 0) + 
                         (parseFloat(formik2.values.otherExpenses) || 0) +
                         (parseFloat(formik2.values.guideExpenses) || 0) +
                        (parseFloat(formik2.values.visaExpenses) || 0);

    formik2.setFieldValue('totalExpenses', totalExpenses);
  }, [formik2.values.hotelExpenses, formik2.values.departureExpenses, 
    formik2.values.returnExpenses, formik2.values.otherExpenses, formik2.values.guideExpenses, formik2.values.visaExpenses]);

  function confirm() {
    if (validConfirm === 'disactive') return;
    // Final submission logic here if needed
  }

  async function addItem() {
    if (validAdd === 'disactive') return;
    
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0 || validAdd === 'disactive') {
      return;
    }

    const birth = birthDate === 'any' ? '' : birthDate;
    const newItem = {
      originalTraveler : originalTraveler,
      id: originalTraveler?.id || null,
      edit_add: checkSame() ? editAdd : originalTraveler ? 'No' : 'Add',
      firstName: formik.values.firstName,
      lastName: formik.values.lastName,
      age: formik.values.age,
      birthDate: birth,
      phoneNumber: formik.values.phoneNumber,
      documents: documents,
      visas : visas,
      address: formik.values.address,
      roomPrice: formik.values.roomPrice || 0,
      depTicketPrice: formik.values.depTicketPrice || 0,
      retTicketPrice: formik.values.retTicketPrice || 0,
      price: formik.values.price || 0,
    };

    setTravelers((prev) => [...prev, newItem]);
    emptyInputs();
  }

  function deleteItem(i) {
    setTravelers((prev) => prev.filter((_, index) => index !== i));
    if (selected === i) {
      cancelSelect();
    }
  }

  function selectEdit(i) {
    skipFirstName.current = true;
    if (i !== selected) {
      setSelected(i);
      populateInputs(travelers[i]);
    } else {
      cancelSelect();
    }
  }

  function cancelSelect(event) {
    event?.preventDefault();
    setSelected(-1);
    emptyInputs();
    setOriginalTraveler(null)
  }

async function addTour() {
  const errors = await formik2.validateForm();
  if (Object.keys(errors).length > 0) {
    return;
  }


  // Get current values at time of submission
  const currentTravelers = travelers;
  //console.log("currValues", currentValues)
  const fullTour = { 
    ...tour, 
    hotelExpenses:  formik2.values.hotelExpenses,
    hotelExpensesCurr : hotelExpensesCurr,
    departureExpenses: formik2.values.departureExpenses,
    departureExpensesCurr : departureExpensesCurr,
    returnExpenses: formik2.values.returnExpenses,
    returnExpensesCurr : returnExpensesCurr,
    guideExpenses: formik2.values.guideExpenses,
    guideExpensesCurr : guideExpensesCurr,
    otherExpenses: formik2.values.otherExpenses, 
    otherExpensesCurr : otherExpensesCurr,
    travelers: currentTravelers,
  };
  const formData = new FormData();
  formData.append("agency_id", agency.id);
  formData.append("user_id", user.id);
  formData.append("tour", JSON.stringify(fullTour));
  travelers.forEach((traveler, tIndex) => {
  traveler.documents.forEach((doc, dIndex) => {
    if(doc.file){
      formData.append(`files[${tIndex}][${dIndex}]`, doc.file);
    }
  })
});

    travelers.forEach((traveler, tIndex) => {
  traveler.documents.forEach((doc, dIndex) => {
    if(doc.file){
      formData.append(`files[${tIndex}][${dIndex}]`, doc.file);
    }
  })
});

        travelers.forEach((traveler, tIndex) => {
        traveler.visas.forEach((visa, vIndex) => {
  visa.documents.forEach((doc, dIndex) => {
    if(doc.file){
      formData.append(`visas[${tIndex}][${vIndex}][${dIndex}]`, doc.file);
    }
  })
});})


    let response;
    setReqState("loading")
    if(tour.id){
     response = await apiPut("/tours", formData)
    }else{
     response = await apiPost("/tours", formData)
}

      if (!response.error) {
        if(tour.id){
          navigate(`/tour-info/${tour.id}`, { replace: true });
        }else{
          navigate(`/tours/`, { replace: true });
        }

        
    } else {
      console.log(response.error);
      setReqState(response.error.source);
    }

}

  async function edit() {
        if (validAdd === 'disactive') return;
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0 || validAdd === 'disactive') {
      return;
    }


    const birth = birthDate === 'any' ? '' : birthDate;

    const newItem = {
      id: originalTraveler?.id,
      firstName: values.firstName,
      lastName: values.lastName,
      age: values.age,
      birthDate: birth,
      phoneNumber: values.phoneNumber,
      originalTraveler: originalTraveler,
      documents: documents,
      visas : visas,
      edit_add: checkSame() ? editAdd : originalTraveler ? 'No' : 'Add',
      address: values.address,
      roomPrice: values.roomPrice || 0,
      depTicketPrice: values.depTicketPrice || 0,
      retTicketPrice: values.retTicketPrice || 0,
      price: values.price || 0,
      guideExpenses: formik2.values.guideExpenses || 0
    };
    
    setTravelers((prev) =>
      prev.map((item, index) => (index === selected ? newItem : item))
    );
    cancelSelect();
  }

  function populateInputs(item) {
    setDocuments(item.documents)
    setVisas(item.visas)
    setOriginalTraveler(item.originalTraveler || null)
    formik.setErrors({});
    setEditAdd(item.edit_add != 'Add' && item.edit_add != 'Edit' ? 'Edit' : item.edit_add);
    const birthDate = item.birthDate || 'any';
    setBirthDate(birthDate);
    setFieldValue('firstName', item.firstName);
    setFieldValue('lastName', item.lastName);
    setFieldValue('age', item.age);
    setFieldValue('phoneNumber', item.phoneNumber);
    setFieldValue('guideExpenses', item.guideExpenses || '');
    setFieldValue('address', item.address || '');
    setFieldValue('roomPrice', item.roomPrice || '');
    setFieldValue('depTicketPrice', item.depTicketPrice || '');
    setFieldValue('retTicketPrice', item.retTicketPrice || '');
    setFieldValue('price', item.price || '');

  }
  function back(){

      navigate(-1);


  }
  function emptyInputs() {
    formik.setErrors({});
    setFieldValue('firstName', '');
    setFieldValue('lastName', '');
    setFieldValue('age', '');
    setBirthDate('any');
    setFieldValue('phoneNumber', '');
    setDocuments([]);
    setVisas([]);
    setFieldValue('address', '');
    setDefPrices()
    setFieldValue('price', travelers.length > 0 ? travelers[travelers.length-1].price : '');
    setOriginalTraveler(null);

  }

    const setFile = (updatedFile, type) => 
    globalSetFile(updatedFile, type, documentIndex, (documentIndex, newDoc) => {
      if (documentIndex === -1) {
        setDocuments(prevDocs => [...prevDocs, newDoc]);
      } else {
        setDocuments(prevDocs => prevDocs.map((doc, i) =>
          i === documentIndex ? { ...doc, ...newDoc } : doc
        ));
      }
    }, setReOpen)

    const setFullVisa = (updatedVisa) => 
    globalSetVisa(updatedVisa, (newVisa) => {

      if (visaIndex === -1) {
        setVisas(pevVisas => [...pevVisas, newVisa]);
      } else {
        setVisas(pevVisas => pevVisas.map((visa, i) =>
          i === visaIndex ? {...newVisa, traveler : visa.traveler} : visa
        ));
      }
    }, setReOpen, setVisa)

    const removeDocument = (index) => 
    globalRemoveDocument(index, (index) => setDocuments(prevDocs => prevDocs.filter((_, i) => i !== index)), setReOpen)

    const removeVisa = (index) => 
    globalRemoveDocument(index, (index) => setVisas(preVisas => preVisas.filter((_, i) => i !== index)), setReOpen)

  const onCancelDocDialog = () => {
    refDocumentDialog.current?.close();
  };

  const onCancelVisaDialog = () => {
    refVisaDialog.current?.close();
  };

  const openDocumentDialog = (doc, i) => 
    globalOpenDocumentDialog(doc, i, setDocument, setDocumentIndex, setReOpen, refDocumentDialog)

    const openVisaDialog = (visa, i) => 
    globalOpenVisaDialog(visa, i, setVisa, setVisaIndex, setReOpen, refVisaDialog)

  function selectTraveler(traveler) {
     console.log("Fetdgk^dk^pkp^g:", tour?.id, traveler);
    skipFirstName.current = true;
    setOriginalTraveler(traveler);

    const cleanFirstName = traveler.first_name?.trim() || "";
    const cleanLastName = traveler.last_name?.trim() || "";
    const cleanPhone = traveler.phone_number?.trim() || "";
    const cleanAge = traveler.age || "";
    const cleanBirthDate = traveler.birth_date || "any";
    const clearAddress = traveler.address?.trim() || "";
    setEditAdd(traveler.edit_add)
    formik.setFieldValue("firstName", cleanFirstName);
    formik.setFieldValue("lastName", cleanLastName);
    formik.setFieldValue("phoneNumber", cleanPhone);
    formik.setFieldValue("age", cleanAge);
    formik.setFieldValue("address", clearAddress);
    setEditAdd('Edit')

    setBirthDate(cleanBirthDate);
    setDocuments(traveler.documents);
    setVisas(traveler.visas);

    if (selected != -1) {
      travelers[selected] = traveler;
    }

  }


const fetchTraverlersData = async (query) => {
  try {
   
    const res = await apiGet(
      `/travelers/search?query=${encodeURIComponent(query)}&isTour=true&tourId=${tour?.id ?? ""}`,
      {
        cache: { ttl: 1000 * 60 * 5 }, // keep if apiGet supports it
      }
    );

    return res.data.map((traveler) => ({
      ...traveler,
      edit_add: "Edit",
      display_name: getFullName(traveler),
    }));
    
  } catch (err) {
    console.error("❌ Failed to fetch travelers:", err);
    return [];
  }
};


  function checkSame() {
    if (!originalTraveler) return false;
    console.log(originalTraveler.documents)
    console.log(documents)
    console.log(documents == originalTraveler.documents)
    return !(
      JSON.stringify(originalTraveler.documents || []) === JSON.stringify(documents || []) &&
      originalTraveler.first_name === values.firstName &&
      originalTraveler.last_name === values.lastName &&
      originalTraveler.age === values.age && 
      originalTraveler.address === values.address &&
      formatDate(originalTraveler.birth_date) === formatDate(birthDate) &&
      originalTraveler.phone_number === values.phoneNumber
    );
  }

  function checkAddTraveler(val) {
    setEditAdd(val);
  }

  function travelerExists() {
    return values.firstName.trim() == ''
  }

  function applyAll(attr, value, currAttr, curr) {
    setTravelers(prev =>
      prev.map(traveler => ({
        ...traveler,
        [attr]: value,
        [currAttr] : curr, 
      }))
    ) 
  }

    function checkAplly(attr, value, currAttr, curr) {
  if (!travelers || travelers.length === 0) return false;

  // Check if at least one traveler has a different value or currency
  return travelers.some(traveler => {
    const travelerValue = Number(traveler[attr]) || 0;
    const currentValue = Number(value) || 0;
    const travelerCurr = traveler[currAttr] || 'DA';
    const currentCurr = curr || 'DA';

    return travelerValue !== currentValue || travelerCurr !== currentCurr;
  });
}

  useEffect(() => {
    if(tour?.id){
      setPages(['Tours', 'Edit Tour']);
    }else{
      setPages(['Tours', 'Add Tour']);
    }
  }, []);
  return (
    <HandleRequest 
    reqState={reqState}
    retry={()=>setReqState("success")}
     layout={(<>
      <form onSubmit={formik.handleSubmit}>
        {travelers.length > 0 && (<ItemAddedCards
          page={page}
          selectEdit={selectEdit}
          selected={selected}
          deleteItem={deleteItem}
          items={travelers.map((item) => `${item.firstName} ${item.lastName}`)}
        />)}

        <SectionHeader extra={"no-margin"} header="Traveler" changed={checkSame()} checked={editAdd}
          setChecked={checkAddTraveler} />

        <div className={`inputs-holder ${travelerExists() ? 'hidden' : ''}`}>
          <AutoCompleteField
            icon={faPerson}
            onSelect={selectTraveler}
            name='firstName'
            display='First Name*'
            type="text"
            value={values.firstName || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.firstName}
            touched={touched.firstName}
            fetchData={{ fetch: fetchTraverlersData, skipRef: skipFirstName }}
          />

          <InputElement
            hidden={travelerExists()}
            name='lastName'
            display='Last Name*'
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.lastName}
            touched={touched.lastName}
          />

          <NumberInputElement
            error={errors.age}
            hidden={travelerExists()}
            name='age'
            display='Age*'
            value={values.age}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.age}
          />
        </div>

        <div className={`inputs-holder ${travelerExists() ? 'hidden' : ''}`}>
          <DatePickerCard hidden={travelerExists()} name='Birth Date' setDate={setBirthDate} date={birthDate} />
          <InputElement
            hidden={travelerExists()}
            name="phoneNumber"
            display="Phone Number"
            type="tel"
            value={values.phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.phoneNumber}
            touched={touched.phoneNumber}
          />
        </div>

        <div className={`inputs-holder ${travelerExists() ? 'hidden' : ''}`}>
          <InputElement
            hidden={travelerExists()}
            name="address"
            display="Address"
            value={values.address}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.address}
            touched={touched.address}
          />
        </div>

        <div className='filter-container selector' style={{ flex: '1' }}>
          {!travelerExists() && (<p className='text'>Documents</p>)}
           <DocumentsSection visas={visas} documents = {documents} travelerExists = {!travelerExists()}
          openDocumentDialog={openDocumentDialog} openVisaDialog={openVisaDialog} removeDocument={removeDocument}
          removeVisa={removeVisa}
          />
          </div>
          <ShowDocumentDialog
            soft={true}
            setFile={setFile}
            reOpen={reOpen}
            refDialog={refDocumentDialog}
            doc={document}
            onConfirm={() => console.log('Document confirmed')}
            onCancel={onCancelDocDialog}
          />

                <ShowVisaDialog
                    soft={true}
                    setVisa={setFullVisa}
                    reOpen={reOpen}
                    refDialog={refVisaDialog}
                    visa={visa}
                    onConfirm={() => console.log('Document confirmed')}
                    onCancel={onCancelVisaDialog}
                  />
        

        <div className={`inputs-holder ${travelerExists() ? 'hidden' : ''}`}>
          {tour.hotel != null && <PriceInput
            hidden={travelerExists()}
            display="Room Price"
            name={"roomPrice"}
            value={values.roomPrice || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.roomPrice}
            touched={touched.roomPrice}
            activeCurr={roomPriceCurr}
            apply={checkAplly('roomPrice', values.roomPrice, 'roomPriceCurr', roomPriceCurr) ? ()=>
              applyAll('roomPrice', values.roomPrice, 'roomPriceCurr', roomPriceCurr) : null}
            setActiveCurr={(titles, names, ref) => setPriceCurr(names[0], setRoomPriceCurr, ref)}
          />}

          {(tour.departureAirport  != null || tour.departureBus != null) && <PriceInput
            hidden={travelerExists()}
            display={"Dep Ticket Price"}
            name={"depTicketPrice"}
            value={values.depTicketPrice || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.depTicketPrice}
            apply={checkAplly('depTicketPrice', values.depTicketPrice, 'depTicketCurr', depTicketCurr) ? ()=>
              applyAll('depTicketPrice', values.depTicketPrice, 'depTicketCurr', depTicketCurr) : null}
            touched={touched.depTicketPrice}
            activeCurr={depTicketCurr}
            setActiveCurr={(titles, names, ref) => setPriceCurr(names[0], setDepTicketCurr, ref)}
          />}

          {(tour.returnAirport != null ||tour.returnBus != null) && <PriceInput
            hidden={travelerExists()}
            apply={checkAplly('retTicketPrice', values.retTicketPrice, 'retTicketCurr', retTicketCurr) ? 
              ()=>applyAll('retTicketPrice', values.retTicketPrice, 'retTicketCurr', retTicketCurr) : null}
            display={"Ret Ticket Price"}
            name={"retTicketPrice"}
            value={values.retTicketPrice || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.retTicketPrice}
            touched={touched.retTicketPrice}
            activeCurr={retTicketCurr}
            setActiveCurr={(titles, names, ref) => setPriceCurr(names[0], setRetTicketCurr, ref)}
          />}

          <PriceInput
            hidden={travelerExists()}
            apply={checkAplly('price', values.price, 'priceCurr', priceCurr) ? ()=>
              applyAll('price', values.price, 'priceCurr', priceCurr) : null}
            display={'Price'}
            name={"price"}
            value={values.price || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.price}
            touched={touched.price}
            activeCurr={priceCurr}
            setActiveCurr={(titles, names, ref) => setPriceCurr(names[0], setPriceCurr1, ref)}
          />
        </div>

        <AddHolder
          page={page}
          confirm={confirm}
          editEvent={edit}
          cancelSelect={cancelSelect}
          state={selected === -1 ? 'Add' : 'Edit'}
          validConfirm={validConfirm}
          validAdd={validAdd}
          addEvent={addItem}
          addType={"submit"}
        />
      </form>

      <form onSubmit={formik2.handleSubmit}>
      <SectionHeader extra={"no-margin"} header="Finance" changed={false} checked={"Add"}
        setChecked={()=>{}} />
      
      <div className={`documents-holder`}>
        { tour.hotel != null &&  <PriceInput
          display="Hotel Expenses"
          name={"hotelExpenses"}
          value={formik2.values.hotelExpenses || ''}
          onChange={formik2.handleChange}
          onBlur={formik2.handleBlur}
          error={formik2.errors.hotelExpenses}
          touched={formik2.touched.hotelExpenses}
          activeCurr={hotelExpensesCurr}
          setActiveCurr={(titles, names, ref) => setPriceCurr(names[0], setHotelExpensesCurr, ref)}
          readOnly
        />}
      { (tour.departureAirport != null || tour.departureBus != null) && <PriceInput
          display={"Departure Expenses"}
          name={"departureExpenses"}
          value={formik2.values.departureExpenses || ''}
          onChange={formik2.handleChange}
          onBlur={formik2.handleBlur}
          error={formik2.errors.departureExpenses}
          touched={formik2.touched.departureExpenses}
          activeCurr={departureExpensesCurr}
          setActiveCurr={(titles, names, ref) => setPriceCurr(names[0], setDepartureExpensesCurr, ref)}
          readOnly
        />}
{
        (tour.returnAirport != null || tour.returnBus != null) && < PriceInput
          display={"Return Expenses"}
          name={"returnExpenses"}
          value={formik2.values.returnExpenses || ''}
          onChange={formik2.handleChange}
          onBlur={formik2.handleBlur}
          error={formik2.errors.returnExpenses}
          touched={formik2.touched.returnExpenses}
          activeCurr={returnExpensesCurr}
          setActiveCurr={(titles, names, ref) => setPriceCurr(names[0], setReturnExpensesCurr, ref)}
          readOnly
        />}
        
        
{ (tour.guide != null) && <PriceInput

          display="Guide Expenses"
          name={"guideExpenses"}
          value={formik2.values.guideExpenses || ''}
          onChange={formik2.handleChange}
          onBlur={formik2.handleBlur}
          error={formik2.errors.guideExpenses}
          touched={formik2.touched.guideExpenses}
          activeCurr={guideExpensesCurr}
          setActiveCurr={(titles, names, ref) => setPriceCurr(names[0], setGuideExpensesCurr, ref)}
        />}

        <PriceInput
          display={'Other Expenses'}
          name={"otherExpenses"}
          value={formik2.values.otherExpenses || ''} 
          onChange={formik2.handleChange}
          onBlur={formik2.handleBlur}
          error={formik2.errors.otherExpenses}
          touched={formik2.touched.otherExpenses}
          activeCurr={otherExpensesCurr}
          setActiveCurr={(titles, names, ref) => setPriceCurr(names[0], setOtherExpensesCurr, ref)}
        />

        {visasExists() && <FixedInputContainer
          flex={'1 1 250px'} 
          display={"Total Visa Expenses"} 
          value={formik2.values.visaExpenses || 0}
        />}

        {visasExists() && <FixedInputContainer
          flex={'1 1 250px'} 
          display={"Total Visa Price"} 
          value={formik2.values.totalVisaPrice || 0}
        />}

        {visasExists() && <FixedInputContainer
          flex={'1 1 250px'} 
          display={"Total Tour Price"} 
          value={formik2.values.totalTourPrice || 0}
        />}

        
        
        <FixedInputContainer 
          flex={'1 1 250px'} 
          display={"Total Expenses"} 
          value={formik2.values.totalExpenses}
        />

        <FixedInputContainer 
          flex={'1 1 250px'} 
          display={"Total Price"}
          value={formik2.values.totalPrice || 0}
        />
        
        <FixedInputContainer 
          flex={'1 1 250px'} 
          display={"Profit"} 
          value={formatNumber( formik2.values.totalPrice - formik2.values.totalExpenses)}
        />
          
      </div>
      <div  style={{display : 'flex', justifyContent : 'right', gap: '10px'}}>
        
      <ConfirmButton name='Back' onClick={back} extra={`add-tour`} style = {{paddingInline : 'none', 
      color : 'var(--primary-color)', backgroundColor : 'white',
      }}/>

      <ConfirmButton type="submit" name={tour.id ? 'Edit Tour' : 'Add Tour'} extra={`add-tour`} />
      </div>
      </form>
    </>)}
    />
  );
} 