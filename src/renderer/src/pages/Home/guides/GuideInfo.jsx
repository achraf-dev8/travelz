import React, { useEffect, useRef, useState } from 'react';
import '../../../styles/Info.css';
import {
  faHiking,
  faDollarSign,
  faCalendarDay,
  faPhone,
  faCoins,
} from '@fortawesome/free-solid-svg-icons';

import { InfoRow } from '../../../components/home/info/InfoRow';
import { ToorsSection } from '../../../components/home/toors/ToorsSection';
import { InfoConfirmHolder } from '../../../components/home/info/InfoConfirmHolder';
import { EditDialog } from '../../../components/home/info/EditDialog';
import { checkInput } from '../../../functions/input';
import { formatApiDate } from '../../../functions/dates';
import { HandleRequest } from '../HandleRequest';
import { apiGet, apiPut } from '../../../functions/api';
import { useParams } from 'react-router-dom';
import { useAppStore } from '../../../store';

export const GuideInfo = () => {
  const editDialogRef = useRef(null);
  const [reOpen, setReOpen] = useState(0);
  const [reqState, setReqState] = useState("loading");
  const [tours, setTours] = useState([]);
  const [confirming, setConfirming] = useState(false);
  const [originalGuide, setOriginalGuide] = useState({});
  const [guide, setGuide] = useState(originalGuide);
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [inputError, setInputError] = useState(null);
  const [priceCurr, setPriceCurr] = useState('DA');
    // ✅ Get ID and agency from store
  const { id } = useParams();
  const { agency, setPages } = useAppStore();

  useEffect(() => {
    setPages(['Guides', 'Guide Information']);
  }, []);

  useEffect(() => {
    fetchGuide();
  }, []);

  async function fetchGuide() {
    const res = await apiGet(`/guides/${id}`, { params: { ...agency } });
    console.log(res);

    if (!res.error) {
      setTours(res.data.tours || []);
      setOriginalGuide(res.data);
      setGuide(res.data);
      setPriceCurr(res.data.currency || 'DA');
      setReqState('success');
    } else {
      setReqState(res.error.source);
    }
  }

  const clnFieldName = (fieldName) => 
    fieldName === 'Guide Name' ? 'name' : 
    fieldName === 'Price Per Day' ? 'price' : 
    fieldName === 'Phone Number' ? 'phone_number' : fieldName;

  const openEditDialog = (fieldName) => {
    const cleanFieldName = clnFieldName(fieldName);
    setEditField(fieldName);
    setPriceCurr(guide.currency || 'DA');
    const currentValue = guide[cleanFieldName]?.toString() || '';
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

  const confirmEdit = () => {
    const checkField = editField === 'Guide Name' ? 'name' : 
                     editField === 'Price Per Day' ? 'price' : 
                     editField === 'Phone Number' ? 'phone' : editField;
    
    const error = checkInput(checkField, tempValue);
    if (error) {
      setInputError(error);
      return;
    }

    const cleanFieldName = clnFieldName(editField);

    if (editField === 'Price Per Day') {
      setGuide({ ...guide, price: Number(tempValue), currency: priceCurr });
    } else {
      setGuide({ ...guide, [cleanFieldName]: tempValue });
    }

    closeEditDialog();
  };

  const confirmAllChanges = async () => {
    setConfirming(true);
    const res = await apiPut(`/guides/${id}`, guide);

    setConfirming(false);

    if (!res.error) {
      console.log("Guide updated", guide);
      setOriginalGuide(guide);
    } else {
      console.log(res.error);
      setReqState(res.error.source);
    }
  };

  const cancelAllChanges = () => {
    setGuide(originalGuide);
  };

  const hasChanges = () =>
    guide.name !== originalGuide.name ||
    guide.price !== originalGuide.price || 
    guide.currency !== originalGuide.currency || 
    guide.phone_number !== originalGuide.phone_number;

  return (
    <HandleRequest 
      reqState={reqState} 
      retry={fetchGuide} 
      layout={(
        <>
          <p className='info-card-title'>Guide Information</p>
          <div className='info-card'>
            <div className='info-card-holder'>
              <InfoRow
                icon={faHiking}
                type='Guide Name'
                info={guide.name || 'N/A'}
                edit={() => openEditDialog('Guide Name')}
              />
              <InfoRow
                icon={faPhone}
                type='Phone Number'
                info={guide.phone_number || 'N/A'}
                edit={() => openEditDialog('Phone Number')}
              />
              <InfoRow
                icon={faCoins}
                type='Price Per Day'
                info={`${guide.price ? guide.price + ' ' + (guide.currency || 'DA') : 'N/A'}`}
                edit={() => openEditDialog('Price Per Day')}
              />
                                        <InfoRow
                                          icon={faDollarSign}
                                          type='Total Expenses'
                                          info={`${guide.total_expenses || 0} ${guide.total_expenses_currency || 'DA'}`}
                                          edit={false}
                                        />
              <InfoRow
                icon={faCalendarDay}
                type='Added'
                info={formatApiDate(guide.creation_date)}
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
              curr={editField === 'Price Per Day' ? priceCurr : null}
              setCurr={editField === 'Price Per Day' ? setPriceCurr : null}
            />
          </dialog>

          {hasChanges() && (
            <InfoConfirmHolder
              extra={confirming ? "disactive" : ""}
              onConfirm={confirmAllChanges}
              onCancel={cancelAllChanges}
              name='Confirm Changes'
            />
          )}

          <hr className='divider info' style={{ marginBlock: '15px' }} />
          <p style={{ marginBottom: '0px' }} className='info-card-title'>Tours History</p>
          <ToorsSection tours={tours} setReqState={setReqState} setTours={setTours} />
        </>
      )}
    />
  );
};