import React, { useEffect, useRef, useState } from 'react';
import '../../../styles/Info.css';
import {
  faCalendarAlt,
  faCalendarDay,
  faDollarSign,
  faHouse,
  faPhone,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { InfoRow } from '../../../components/home/info/InfoRow';
import { ToorsSection } from '../../../components/home/toors/ToorsSection';
import { InfoConfirmHolder } from '../../../components/home/info/InfoConfirmHolder';
import { EditDialog } from '../../../components/home/info/EditDialog';
import { checkInput } from '../../../functions/input';
import Calender from '../../../components/home/Calender';
import { formatApiDate } from '../../../functions/dates';
import { DocumentsSection } from '../../../components/home/documents/DocumentsSection';
import { ShowDocumentDialog } from '../../../components/home/documents/ShowDocumentDialog';
import {
  globalOpenDocumentDialog,
  globalOpenVisaDialog,
  globalRemoveDocument,
  globalSetFile,
  globalSetVisa,
} from '../../../functions/handleDocuments';
import { ShowVisaDialog } from '../../../components/home/documents/ShowVisaDialog';
import { HandleRequest } from '../HandleRequest';
import { apiGet, apiPut } from '../../../functions/api';
import { useParams } from 'react-router-dom';
import { FixedInputContainer } from '../../../components/inputs/FIxedInputContainer';
import { useAppStore } from '../../../store';

export const TravelerInfo = () => {
  const editDialogRef = useRef(null);
  const birthDialogRef = useRef(null);
  const refDocumentDialog = useRef(null);
  const refVisaDialog = useRef(null);

  // ✅ Get traveler ID directly farom URL
  const { id } = useParams();
  const { agency } = useAppStore();
  console.log("Traveler ID:", id);

  const [document, setDocument] = useState(null);
  const [documentIndex, setDocumentIndex] = useState(-1);
  const [visa, setVisa] = useState(null);
  const [visaIndex, setVisaIndex] = useState(-1);
  const [reOpen, setReOpen] = useState(0);
  const [reqState, setReqState] = useState("loading");
  const [tours, setTours] = useState([]);
  const [confirming, setConfirming] = useState(false);
  const [originalTraveler, setOriginalTraveler] = useState({});
  const [traveler, setTraveler] = useState({});
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [inputError, setInputError] = useState(null);

  useEffect(() => {
    if (id) fetchTraveler();
  }, [id]);

  async function fetchTraveler() {

    const res = await apiGet(`/travelers/${id}`, { params: {...agency} });
    
    if (!res.error) {
      setTours(res.data.tours);
      console.log(res);
      setOriginalTraveler(res.data);
      setTraveler(res.data);
      setReqState('success');
    } else {
      setReqState(res.error.source);
    }
  }

  const formatDate = (date) => formatApiDate(date) ?? 'N/A';

  const clnFieldName = (fieldName) =>
    fieldName === 'First Name'
      ? 'first_name'
      : fieldName === 'Last Name'
      ? 'last_name'
      : fieldName;

  const openEditDialog = (fieldName) => {
    const cleanFieldName = clnFieldName(fieldName);
    if (fieldName === 'birth_date') {
      birthDialogRef.current?.showModal();
      return;
    }

    setEditField(fieldName);
    const currentValue = traveler[cleanFieldName]?.toString() || '';
    setTempValue(currentValue);
    setInputError(null);
    editDialogRef.current?.showModal();
  };

  const closeEditDialog = () => {
    setEditField(null);
    setTempValue('');
    setInputError(null);
    editDialogRef.current?.close();
  };

  const closeBirthDialog = () => birthDialogRef.current?.close();

  const confirmBirthDate = (newDate) => {
    const formatted = newDate.toISOString().split('T')[0];
    setTraveler((prev) => ({ ...prev, birth_date: formatted }));
    closeBirthDialog();
  };

  const confirmEdit = () => {
    const checkField =
      editField === 'First Name' || editField === 'Last Name'
        ? 'name'
        : editField;
    const error = checkInput(checkField, tempValue);
    if (error) {
      setInputError(error);
      return;
    }

    const cleanFieldName = clnFieldName(editField);
    if (editField === 'age') {
      setTraveler({ ...traveler, age: Number(tempValue) });
    } else {
      setTraveler({ ...traveler, [cleanFieldName]: tempValue });
    }

    closeEditDialog();
  };

  const confirmAllChanges = async () => {
    const formData = new FormData();
    const completeTraveler = { ...traveler, originalTraveler };

    formData.append('traveler', JSON.stringify(completeTraveler));

    completeTraveler.documents?.forEach((doc, dIndex) => {
      if (doc.file) {
        formData.append(`files[0][${dIndex}]`, doc.file);
      }
    });

    completeTraveler.visas?.forEach((visa, vIndex) => {
      visa.documents?.forEach((doc, dIndex) => {
        if (doc.file) {
          formData.append(`visas[0][${vIndex}][${dIndex}]`, doc.file);
        }
      });
    });

    setConfirming(true);
    const res = await apiPut(`/travelers/${id}`, formData);
    setConfirming(false);

    if (!res.error) {
      const traveler = res.data;
      setOriginalTraveler(traveler);
      setTraveler(traveler);
    } else {
      setReqState(res.error.source);
    }
  };

  const cancelAllChanges = () => {
    setTraveler(originalTraveler);
  };

  const hasChanges = () =>
    traveler.first_name !== originalTraveler.first_name ||
    traveler.last_name !== originalTraveler.last_name ||
    traveler.phone_number !== originalTraveler.phone_number ||
    traveler.age !== originalTraveler.age ||
    traveler.address !== originalTraveler.address ||
    formatDate(traveler.birth_date) !== formatDate(originalTraveler.birth_date) ||
    JSON.stringify(originalTraveler.documents || []) !== JSON.stringify(traveler.documents || []) ||
    JSON.stringify(originalTraveler.visas || []) !== JSON.stringify(traveler.visas || []);

  const openDocumentDialog = (doc, i) =>
    globalOpenDocumentDialog(doc, i, setDocument, setDocumentIndex, setReOpen, refDocumentDialog);

  const openVisaDialog = (visa, i) =>
    globalOpenVisaDialog(visa, i, setVisa, setVisaIndex, setReOpen, refVisaDialog);

  const removeDocument = (index) =>
    globalRemoveDocument(
      index,
      (index) =>
        setTraveler((prev) => ({
          ...prev,
          documents: prev.documents.filter((_, i) => i !== index),
        })),
      setReOpen
    );

  const removeVisa = (index) =>
    globalRemoveDocument(
      index,
      (index) =>
        setTraveler((prev) => ({
          ...prev,
          visas: prev.visas.filter((_, i) => i !== index),
        })),
      setReOpen
    );

  const setFile = (updatedFile, type) =>
    globalSetFile(
      updatedFile,
      type,
      documentIndex,
      (documentIndex, newDoc) =>
        setTraveler((prev) => {
          if (documentIndex === -1) {
            return { ...prev, documents: [...prev.documents, newDoc] };
          } else {
            return {
              ...prev,
              documents: prev.documents.map((doc, i) =>
                i === documentIndex ? { ...doc, ...newDoc } : doc
              ),
            };
          }
        }),
      setReOpen,
      setDocument
    );

  const setFullVisa = (updatedVisa) =>
    globalSetVisa(
      updatedVisa,
      (newVisa) =>
        setTraveler((prev) => {
          if (visaIndex === -1) {
            return { ...prev, visas: [...prev.visas, updatedVisa] };
          } else {
            return {
              ...prev,
              visas: prev.visas.map((visa, i) =>
                i === visaIndex ? { ...newVisa, traveler: visa.traveler } : visa
              ),
            };
          }
        }),
      setReOpen,
      setVisa
    );

  const onCancelVisaDialog = () => refVisaDialog.current?.close();
  const onCancelDocDialog = () => refDocumentDialog.current?.close();

  return (
    <HandleRequest
      reqState={reqState}
      retry={fetchTraveler}
      layout={
        <>
          <p className="info-card-title">Traveler Information</p>
          <div className="info-card">
            <div className="info-card-holder">
              <InfoRow
                icon={faUser}
                type="First Name"
                info={traveler.first_name}
                edit={() => openEditDialog('First Name')}
              />
              <InfoRow
                icon={faUser}
                type="Last Name"
                info={traveler.last_name}
                edit={() => openEditDialog('Last Name')}
              />
              <InfoRow
                icon={faUser}
                type="Age"
                info={`${traveler.age} years`}
                edit={() => openEditDialog('age')}
              />
              <InfoRow
                icon={faCalendarAlt}
                type="Birth Date"
                info={formatApiDate(traveler.birth_date) || 'N/A'}
                edit={() => openEditDialog('birth_date')}
              />
            </div>

            <div className="info-card-holder">
              <InfoRow
                icon={faPhone}
                type="Phone Number"
                info={traveler.phone_number || 'N/A'}
                edit={() => openEditDialog('phone_number')}
              />
              <InfoRow
                icon={faHouse}
                type="Address"
                info={traveler.address || 'N/A'}
                edit={() => openEditDialog('address')}
              />
              <InfoRow
                icon={faDollarSign}
                type="Total Earnings"
                info={`${traveler.total_earnings} ${traveler.total_earnings_currency}`}
                edit={false}
              />
              <InfoRow
                icon={faCalendarDay}
                type="Added"
                info={formatApiDate(traveler.creation_date)}
                edit={false}
              />
            </div>
          </div>

          {/* Edit Dialog */}
          <dialog
            ref={editDialogRef}
            onClick={(e) => {
              if (e.currentTarget === e.target) closeEditDialog();
            }}
          >
            <EditDialog
              name={editField && editField.replace(/([A-Z])/g, ' $1')}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onCancel={closeEditDialog}
              onConfirm={confirmEdit}
              error={inputError}
              useNumber={editField === 'age'}
            />
          </dialog>

          {/* Birth Date Calendar Dialog */}
          <dialog
            ref={birthDialogRef}
            onClick={(e) => {
              if (e.currentTarget === e.target) closeBirthDialog();
            }}
          >
            <Calender
              date={traveler.birth_date}
              close={closeBirthDialog}
              confirm={confirmBirthDate}
            />
          </dialog>

          <p
            className="info-card-title"
            style={{ fontSize: '15px', marginTop: '7px', marginBottom: '6px' }}
          >
            Documents
          </p>

          <DocumentsSection
            visas={traveler.visas}
            openVisaDialog={openVisaDialog}
            removeVisa={removeVisa}
            documents={traveler.documents}
            openDocumentDialog={openDocumentDialog}
            removeDocument={removeDocument}
          />

          {hasChanges() && (
            <InfoConfirmHolder
              extra={confirming ? 'disactive' : ''}
              onConfirm={confirmAllChanges}
              onCancel={cancelAllChanges}
              name="Confirm Changes"
            />
          )}

          <hr className="divider info" style={{ marginBlock: '15px' }} />

          <p style={{ marginBottom: '0px' }} className="info-card-title">
            Tours History
          </p>

          <ToorsSection
            tours={tours}
            setReqState={setReqState}
            setTours={setTours}
          />

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
            onConfirm={() => console.log('Visa confirmed')}
            onCancel={onCancelVisaDialog}
          />
        </>
      }
    />
  );
};
