import React, { useEffect, useRef, useState } from 'react';
import '../../../styles/Info.css';
import {
  faBus,
  faTicketAlt,
  faCalendarDay,
  faPhone,
  faCoins,
  faDollarSign,
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

export const BusInfo = () => {
  const editDialogRef = useRef(null);
  const [reOpen, setReOpen] = useState(0);
  const [reqState, setReqState] = useState("loading");
  const [tours, setTours] = useState([]);
  const [confirming, setConfirming] = useState(false);
  const [originalBus, setOriginalBus] = useState({});
  const [bus, setBus] = useState(originalBus);
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [inputError, setInputError] = useState(null);
  const [ticketPriceCurr, setTicketPriceCurr] = useState('DA');
  // ✅ Get ID and agency from store
  const { id } = useParams();
  const { agency, setPages } = useAppStore();// Assuming this would come from props or route params

  useEffect(() => {
    setPages(['Buses', 'Bus Information']);
  }, []);
  useEffect(() => {
    fetchBus();
  }, []);

  async function fetchBus() {
    const res = await apiGet(`/buses/${id}/`, { params: { ...agency } });
    console.log(res);

    if (!res.error) {
      setTours(res.data.tours || []);
      setOriginalBus(res.data);
      setBus(res.data);
      setTicketPriceCurr(res.data.currency || 'DA');
      setReqState('success');
    } else {
      setReqState(res.error.source);
    }
  }

  const clnFieldName = (fieldName) => 
    fieldName === 'Bus Name' ? 'name' : 
    fieldName === 'Ticket Price' ? 'ticket_price' : 
    fieldName === 'Phone Number' ? 'phone_number' : fieldName;

  const openEditDialog = (fieldName) => {
    const cleanFieldName = clnFieldName(fieldName);
    setEditField(fieldName);
    setTicketPriceCurr(bus.currency || 'DA');
    const currentValue = bus[cleanFieldName]?.toString() || '';
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
    const checkField = editField === 'Bus Name' ? 'name' : 
                     editField === 'Ticket Price' ? 'price' : 
                     editField === 'Phone Number' ? 'phone' : editField;
    
    const error = checkInput(checkField, tempValue);
    if (error) {
      setInputError(error);
      return;
    }

    const cleanFieldName = clnFieldName(editField);

    if (editField === 'Ticket Price') {
      setBus({ ...bus, ticket_price: Number(tempValue), currency: ticketPriceCurr });
    } else {
      setBus({ ...bus, [cleanFieldName]: tempValue });
    }

    closeEditDialog();
  };

  const confirmAllChanges = async () => {
    setConfirming(true);
    const res = await apiPut(`/buses/${id}`, bus);

    setConfirming(false);

    if (!res.error) {
      console.log("Bus updated", bus);
      setOriginalBus(bus);
    } else {
      console.log(res.error);
      setReqState(res.error.source);
    }
  };

  const cancelAllChanges = () => {
    setBus(originalBus);
  };

  const hasChanges = () =>
    bus.name !== originalBus.name ||
    bus.ticket_price !== originalBus.ticket_price || 
    bus.currency !== originalBus.currency || 
    bus.phone_number !== originalBus.phone_number;

  return (
    <HandleRequest 
      reqState={reqState} 
      retry={fetchBus} 
      layout={(
        <>
          <p className='info-card-title'>Bus Information</p>
          <div className='info-card'>
            <div className='info-card-holder'>
              <InfoRow
                icon={faBus}
                type='Bus Name'
                info={bus.name || 'N/A'}
                edit={() => openEditDialog('Bus Name')}
              />
              <InfoRow
                icon={faPhone}
                type='Phone Number'
                info={bus.phone_number || 'N/A'}
                edit={() => openEditDialog('Phone Number')}
              />
              <InfoRow
                icon={faTicketAlt}
                type='Ticket Price'
                info={`${bus.ticket_price ? bus.ticket_price + ' ' + (bus.currency || 'DA') : 'N/A'}`}
                edit={() => openEditDialog('Ticket Price')}
              />
                            <InfoRow
                              icon={faDollarSign}
                              type='Total Expenses'
                              info={`${bus.total_expenses || 0} ${bus.total_expenses_currency || 'DA'}`}
                              edit={false}
                            />
              <InfoRow
                icon={faCalendarDay}
                type='Added'
                info={formatApiDate(bus.creation_date)}
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
              curr={editField === 'Ticket Price' ? ticketPriceCurr : null}
              setCurr={editField === 'Ticket Price' ? setTicketPriceCurr : null}
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