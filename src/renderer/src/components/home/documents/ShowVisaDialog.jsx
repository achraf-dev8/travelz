import { faDownload, faFile, faHotel, faLocationDot, faPassport, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { ConfirmButton } from '../add/ConfirmButton';
import { acceptedFiles, getDocumentLink } from '../../../functions/document';
import { apiGet, apiPatch, apiPut } from '../../../functions/api';
import { AutoCompleteField } from '../../inputs/AutoCompleteField';
import { Formik, isString, useFormik } from 'formik';
import { PriceInput } from '../../inputs/PriceInput';
import { DocumentsSection } from './DocumentsSection';
import { setPriceCurr } from '../../../functions/filters';
import { globalOpenDocumentDialog, globalRemoveDocument, globalSetFile } from '../../../functions/handleDocuments';
import { ShowDocumentDialog } from './ShowDocumentDialog';
import { InputElement } from '../../inputs/InputElement';
import { FixedInputContainer } from '../../inputs/FIxedInputContainer';

export const ShowVisaDialog = ({ showOnly = false, refDialog, visa, reOpen, setVisa, soft = false}) => {
  const skipRef = useRef(false);
  const [currVisa, setCurrVisa] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [documentIndex, setDocumentIndex] = useState(false);
  const [reDocOpen, setReDocOpen] = useState(0);
  const [document, setDocument] = useState(null);
  const [priceCurr, setRealPriceCurr] = useState('DA');
  const [expenseCurr, setExpenseCurr] = useState('DA');
  const refDocumentDialog = useRef(null)

  const formik = useFormik({
    initialValues: {country: '' ,
      expense : ''
    },
    onSubmit: (values) => {},
    validateOnBlur: false,
    validateOnChange: false,
  });

  useEffect(() => {
    skipRef.current = true
    setCurrVisa(visa || null);
    
    if (visa) {
      if(!confirmed) {
        formik.setFieldValue('country', visa.country || '');
        formik.setFieldValue('expense', visa.expense || '');
        formik.setFieldValue('price', visa.price || '');
        setRealPriceCurr(visa.price_curr)
        setExpenseCurr(visa.expense_curr)
        setDocuments(visa.documents)
      }else{
        setConfirmed(false);
      }
      
    }else{
      formik.setFieldValue('country', '');
      formik.setFieldValue('expense', '');
      formik.setFieldValue('price', '');
      setRealPriceCurr('DA')
      setExpenseCurr('DA')
      setDocuments([])
    }

  }, [visa, reOpen]);

  const onCancelDialog = () => {
    refDialog.current?.close();
  };


async function confirm() {
  
  const updatedVisa = { ...currVisa, country: formik.values.country, expense: formik.values.expense, 
    price: formik.values.price,
    documents : documents};
  console.log("updatedVisa", updatedVisa)
    
  setUploading(true);
  
  const formData = new FormData();
  formData.append('visa', JSON.stringify(updatedVisa)); 
  formData.append('originalVisa', JSON.stringify(visa)); 

  for (let i = 0; i < documents.length; i++) {
    console.log("doc", documents[i])
    formData.append(`visas[0][0][${i}]`, documents[i].file);
  }

  console.log("aaaaaaaaaaaa", updatedVisa)
  const res = await apiPatch(`/visa/${updatedVisa.id}`, formData);

  setUploading(false);

  if (!res.error) {
    setVisa(res.data);    
    setConfirmed(true);
  }

}

function softConfirm(){
  const country = formik.values.country;
  const expense = formik.values.expense;
  const price = formik.values.price;
  const updatedDoc = {id : currVisa?.id,
    country, expense, price_curr : priceCurr,  expense_curr : expenseCurr, price : price, documents : documents};
  setVisa(updatedDoc);
  setConfirmed(true);
  refDialog.current?.close();
}


    const fetcVisaCountriesData = async (query) => {
      try {
        const res = await apiGet(`/visa/search-countrie?query=${encodeURIComponent(query)}`, {
          cache: { ttl: 1000 * 60 * 5 },
        });
        return res.data?.map(country => ({
          ...country,
          display_name: type.country,
        }));

      } catch (err) {
        console.error("❌ Failed to fetch types:", err.message);
        return [];
      }
    };

  const onCancelDocDialog = () => {
    refDocumentDialog.current?.close();
  };
  const openDocumentDialog = (doc, i) => globalOpenDocumentDialog(doc, i, setDocument, setDocumentIndex, setReDocOpen, refDocumentDialog)
  const removeDocument = (index) => globalRemoveDocument(index, (index) => setDocuments(prev => prev.filter((_, i) => i !== index)), setReDocOpen)
  const setFile = (updatedFile, type) => globalSetFile(updatedFile, type, documentIndex, (documentIndex, newDoc)=>
          setDocuments(documents => {
      if (documentIndex === -1) {
        // Add new document
        const documents2 = documents || []
        return [...documents2, newDoc]
      } else {
        // Update existing document
        return documents?.map((doc, i) =>
            i === documentIndex ? { ...doc, ...newDoc } : doc
          )
      }}), setReDocOpen, setDocument)

  return (
     <dialog
      ref={refDialog}
      onClick={(e) => {
        if (e.currentTarget === e.target) onCancelDialog();
      }}
    >
      <div className="show-visa-dialog">
        <h3>Visa Preview</h3>
       { !showOnly ?
        (
        <>
        <div className="inputs-holder"> 
       <AutoCompleteField
       style={{flex:'1 1 250px'}}
        value={formik.values.country}
        name="country"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        touched={formik.touched.country}
        display = {"Country"}
        error={formik.errors.country}
        icon={faLocationDot}
        fetchData={{ fetch: fetcVisaCountriesData, skipRef: skipRef }}
        onSelect={(item) => {
        formik.setFieldValue("country", item.display_name);
        }} 
      />
      <PriceInput
        display={'Expense'}
        name={'expense'}
        value={formik.values.expense}
        onChange={formik.handleChange}
        setActiveCurr={(titles, names, ref) => setPriceCurr(names[0], setExpenseCurr, ref)}
        onBlur={formik.handleBlur}
        touched={formik.touched.expense}
        error={formik.errors.expense}
        activeCurr={expenseCurr}
        style={{flex:'1 1 100px'}}
      />

        <PriceInput
        display={'Price'}
        name={'price'}
        value={formik.values.price}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        touched={formik.touched.price}
        error={formik.errors.price}
        activeCurr={priceCurr}
        setActiveCurr={(titles, names, ref) => setPriceCurr(names[0], setRealPriceCurr, ref)}
        style={{flex:'1 1 100px'}}
      />
        </div>
      
      <div style={{height : '10px'}}> </div>
       <DocumentsSection
       documents={documents} travelerExists={true} openDocumentDialog={openDocumentDialog} removeDocument={removeDocument}
       />
       <div style={{height : '10px'}}> </div>
       
        {formik.values.country && (<div style={{display : 'flex', justifyContent : 'end'}}>
          <ConfirmButton extra={uploading ? 'disactive' : ''} onClick={soft ? softConfirm : confirm} />
        </div>)}

             <ShowDocumentDialog
                 visa = {visa?.id}
                 soft={true}
                 setFile={setFile}
                 reOpen={reDocOpen}
                 refDialog={refDocumentDialog}
                 doc={document}
                 onConfirm={() => console.log('Document confirmed')}
                 onCancel={onCancelDocDialog}
               />
               </>) : (<>
               <div className="inputs-holder">
                  <FixedInputContainer
                                          flex={'1.5'} 
                                          display={"Country"} 
                                          value={visa?.country || 0}
                                        />

                  <FixedInputContainer
                                          flex={'1'} 
                                          display={"Price"} 
                                          value={`${visa?.price || 0} ${visa?.price_curr || 0}`}
                                        />
                  <FixedInputContainer
                                          flex={'1'} 
                                          display={"Expense"}
                                          value={`${visa?.expense || 0} ${visa?.expense_curr || 0}`}
                                        />
               </div>
               <div style={{height : '10px'}}> </div>
               <p>Documents</p>
               
                {visa?.documents?.map((item, i)=><FixedInputContainer
                                        icon={faFile}
                                       flex={'1'} 
                                          display={""} 
                                          value={item.type}
                                          onClick = {()=> openDocumentDialog(item)}
                                        />)}
               <div style={{height : '4px'}}> </div>
               </>)}
      </div>
      
    </dialog>)
  ;
};
