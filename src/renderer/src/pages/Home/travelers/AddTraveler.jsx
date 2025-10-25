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
import { apiGet, apiPost } from '../../../functions/api';
import { getFullName } from '../../../functions/traveler';
import { HandleRequest } from '../HandleRequest';
import { DocumentsSection } from '../../../components/home/documents/DocumentsSection';
import { ShowVisaDialog } from '../../../components/home/documents/ShowVisaDialog';
import { globalOpenDocumentDialog, globalOpenVisaDialog, globalRemoveDocument, globalSetFile, globalSetVisa } from '../../../functions/handleDocuments';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store';

export const AddTraveler = ({ page = false }) => {
  const navigate = useNavigate();
  const [reqState, setReqState] = useState("success")
  const [birthDate, setBirthDate] = useState('any');
  const [validConfirm, setValidConfirm] = useState('disactive');
  const [validAdd, setValidAdd] = useState('disactive');
  const [travelers, setTravelers] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [document, setDocument] = useState(null);
  const [documentIndex, setDocumentIndex] = useState(-1);
  const [documents, setDocuments] = useState([]);

  const [visa, setVisa] = useState(null);
  const [visaIndex, setVisaIndex] = useState(-1);
  const [visas, setVisas] = useState([]);

  const [reOpen, setReOpen] = useState(0);

  const refDocumentDialog = useRef(null);
  const refVisaDialog = useRef(null);
  const skipFirstName = useRef(false);

  const {agency, setPages} = useAppStore();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      age: '',
      phoneNumber: ''
    },
    validationSchema: travelerSchema,
    onSubmit: () => { },
    validateOnBlur: false,
    validateOnChange: false,
  });

  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;

  useEffect(() => {
    checkAdd();
  }, [values.firstName, values.lastName, values.age]);

  useEffect(() => {
    setPages(['Travelers', 'Add Traveler']);
  }, []);

  useEffect(() => {
    setValidConfirm(travelers.length === 0 ? 'disactive' : '');
  }, [travelers]);

  function checkAdd() {
    if (values.firstName !== '' && values.lastName !== '' && values.age !== '' && values.age >= 1) {
      setValidAdd('');
    } else {
      setValidAdd('disactive');
    }
  }

  async function confirm() {
    console.log("confirm", travelers)
    if (validConfirm === 'disactive') return;
    console.log(travelers)
    const formData = new FormData();
    formData.append("travelers", JSON.stringify(travelers));
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
    })})
    });

    for (let [key, value] of formData.entries()) {
  console.log(key, value instanceof File ? value.name : value);
}
    formData.append("agency_id", agency.id);
    const response = await apiPost('/travelers', formData)

    if(!response.error){
      console.log("Traveler(s) added successfully:", response);
      navigate('/travelers', { replace: true });
    }else{
      setReqState(response.error.source)
  }} 

    function refreshPage() {
      skipFirstName.current = true
      setReqState("success")
  }

  async function addItem() {
    if (validAdd === 'disactive') return;
     
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0 || validAdd === 'disactive') return;
    
    
      
      const birth = birthDate === 'any' ? '' : birthDate;
      const newItem = {
        firstName: values.firstName,
        lastName: values.lastName,
        age: values.age,
        birthDate: birth,
        phoneNumber: values.phoneNumber,
        documents: documents,
        visas: visas,
      };

      setTravelers((prev) => [...prev, newItem]);
      emptyInputs();
    
  }

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

      const removeVisa = (index) => 
          globalRemoveDocument(index, (index) => setVisas(preVisas => preVisas.filter((_, i) => i !== index)), setReOpen)

      const openVisaDialog = (visa, i) => 
          globalOpenVisaDialog(visa, i, setVisa, setVisaIndex, setReOpen, refVisaDialog)

    async function editItem() {
    if (validAdd === 'disactive') return;
    
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0 || validAdd === 'disactive') return;
      
      const birth = birthDate === 'any' ? '' : birthDate;
      const newItem = {
        firstName: values.firstName,
        lastName: values.lastName,
        age: values.age,
        birthDate: birth,
        phoneNumber: values.phoneNumber,
        documents: documents,
        visas: visas,
      };

    setTravelers((prev) =>
      prev.map((item, index) => (index === selected ? newItem : item))
    );
    cancelSelect();
  }

  function deleteItem(i) {
    setTravelers((prev) => prev.filter((_, index) => index !== i));
    if (selected === i) {
      cancelSelect();
    }
  }

  function selectEdit(i) {
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
  }

  function populateInputs(item) {
    const birthDate = item.birthDate || 'any';
    setBirthDate(birthDate);
    setFieldValue('firstName', item.firstName);
    setFieldValue('lastName', item.lastName);
    setFieldValue('age', item.age);
    setFieldValue('phoneNumber', item.phoneNumber);
    setDocuments(item.documents || []);
    setVisas(item.visas || []);
    skipFirstName.current = true;
  }

  function emptyInputs() {
    setFieldValue('firstName', '');
    setFieldValue('lastName', '');
    setFieldValue('age', '');
    setBirthDate('any');
    setFieldValue('phoneNumber', '');
    setDocuments([]);
    setVisas([]);
    skipFirstName.current = true;
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

  const removeDocument = (index) => 
      globalRemoveDocument(index, (index) => setDocuments(prevDocs => prevDocs.filter((_, i) => i !== index)), setReOpen)

  const onCancelDocDialog = () => {
    refDocumentDialog.current?.close();
  };

  const openDocumentDialog = (doc, i) => 
      globalOpenDocumentDialog(doc, i, setDocument, setDocumentIndex, setReOpen, refDocumentDialog)

  function selectTraveler(traveler) {
    skipFirstName.current = true;
    const cleanFirstName = traveler.first_name?.trim() || "";
    const cleanLastName = traveler.last_name?.trim() || "";
    const cleanPhone = traveler.phone_number?.trim() || "";
    const cleanAge = traveler.age || "";
    const cleanBirthDate = traveler.birth_date || "any";
    const clearDocuments = traveler.documents || [];

    formik.setFieldValue("firstName", cleanFirstName);
    formik.setFieldValue("lastName", cleanLastName);
    formik.setFieldValue("phoneNumber", cleanPhone);
    formik.setFieldValue("age", cleanAge);
    setBirthDate(cleanBirthDate);
    setDocuments(clearDocuments);
    setVisas(traveler.visas || []);
  }

  const fetchTraverlersData = async (query) => {
    try {
      const res = await apiGet(`/travelers/search?query=${encodeURIComponent(query)}`, {
        cache: { ttl: 1000 * 60 * 5 },
      });
      return res.data.map(traveler => ({
        ...traveler,
        display_name: getFullName(traveler),
      }));
    } catch (err) {
      console.error("❌ Failed to fetch travelers:", err.message);
      return [];
    }
  };

  return (
    <HandleRequest reqState={reqState} retry={refreshPage} layout={(<>
      {travelers.length > 0 && (
        <ItemAddedCards
          page={page}
          selectEdit={selectEdit}
          selected={selected}
          deleteItem={deleteItem}
          items={travelers.map((item) => `${item.firstName} ${item.lastName}`)}
        />
      )}
      <div className='inputs-holder'>
        
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
          name='lastName'
          display='Last Name*'
          value={values.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.lastName}
          touched={touched.lastName}
        />

        <NumberInputElement
          name='age'
          display='Age*'
          value={values.age}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.age}
        />
      </div>

      <div className='inputs-holder'>
        <DatePickerCard name='Birth Date' setDate={setBirthDate} date={birthDate} />
        <InputElement
          name="phoneNumber"
          display="Phone Number"
          type="tel"
          value={values.phoneNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.phoneNumber}
          touched={touched.phoneNumber}/>
      </div>

      
        <p className='text'>Documents</p>

        <DocumentsSection visas={visas} documents={documents} 
        openDocumentDialog={openDocumentDialog} removeDocument={removeDocument} openVisaDialog={openVisaDialog}
        removeVisa={removeVisa} travelerExists = {true}/>
        

        <ShowDocumentDialog
          soft={document?.id ? false : true}
          setFile={setFile}
          reOpen={reOpen}
          refDialog={refDocumentDialog}
          doc={document}
          onConfirm={() => console.log('Document confirmed')}
          onCancel={onCancelDocDialog}/>

        <ShowVisaDialog
          soft={true}
          setVisa={setFullVisa}
          reOpen={reOpen}
          refDialog={refVisaDialog}
          visa={visa}/>

      <AddHolder
        page={true}
        confirm={confirm}
        cancelSelect={cancelSelect}
        state={selected == -1 ? 'Add' : 'Edit'}
        validConfirm={validConfirm}
        validAdd={validAdd}
        addEvent={addItem}
        editEvent={editItem}/>

    </>)}/>
    
  );
};
