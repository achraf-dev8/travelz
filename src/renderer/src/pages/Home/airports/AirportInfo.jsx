import React, { useEffect, useRef, useState } from 'react';
import '../../../styles/Info.css';
import {
  faLocationDot,
  faTicketAlt,
  faCalendarDay,
  faPhone,
  faPlaneDeparture,
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

export const AirportInfo = () => {
  const editDialogRef = useRef(null);

  const [reqState, setReqState] = useState("loading");
  const [tours, setTours] = useState([]);
  const [confirming, setConfirming] = useState(false);
  const [originalAirport, setOriginalAirport] = useState({});
  const [airport, setAirport] = useState({});
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [inputError, setInputError] = useState(null);
  const [ticketPriceCurr, setTicketPriceCurr] = useState('DA');

  const { id } = useParams();
  const { agency, setPages } = useAppStore();
  useEffect(() => {
    setPages(['Airports', 'Airport Information']);
  }, []);

  useEffect(() => {
    if (id) fetchAirport();
  }, [id]);

  async function fetchAirport() {
    const res = await apiGet(`/airports/${id}`, { params: { ...agency } });
    console.log("✈️ Airport response:", res);

    if (!res.error) {
      const data = res.data;

      // 🧠 Remove duplicate tours (unique by id)
      const uniqueTours = [];
      const seen = new Set();
      for (const t of data.tours || []) {
        if (!seen.has(t.id)) {
          uniqueTours.push(t);
          seen.add(t.id);
        }
      }

      // 🧩 Include total_earnings fields directly in airport object
      const airportObj = {
        ...data,
        total_earnings: data.total_earnings,
        total_earnings_currency: data.total_earnings_currency,
      };

      setOriginalAirport(airportObj);
      setAirport(airportObj);
      setTours(uniqueTours);
      setTicketPriceCurr(data.currency || 'DA');
      setReqState('success');
    } else {
      setReqState(res.error.source);
    }
  }

  const clnFieldName = (fieldName) => 
    fieldName === 'Airport Name' ? 'name' : 
    fieldName === 'Location' ? 'location' : 
    fieldName === 'Ticket Price' ? 'ticket_price' : 
    fieldName === 'Phone Number' ? 'phone_number' : fieldName;

  const openEditDialog = (fieldName) => {
    const cleanFieldName = clnFieldName(fieldName);
    setEditField(fieldName);
    setTicketPriceCurr(airport.currency || 'DA');
    const currentValue = airport[cleanFieldName]?.toString() || '';
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
    const checkField = 
      editField === 'Airport Name' ? 'res name' :
      editField === 'Location' ? 'location' :
      editField === 'Ticket Price' ? 'price' :
      editField === 'Phone Number' ? 'phone' : editField;

    const error = checkInput(checkField, tempValue);
    if (error) {
      setInputError(error);
      return;
    }

    const cleanFieldName = clnFieldName(editField);

    if (editField === 'Ticket Price') {
      setAirport({ ...airport, ticket_price: Number(tempValue), currency: ticketPriceCurr });
    } else {
      setAirport({ ...airport, [cleanFieldName]: tempValue });
    }

    closeEditDialog();
  };

  const confirmAllChanges = async () => {
    setConfirming(true);
    const res = await apiPut(`/airports/${id}`, airport);
    setConfirming(false);

    if (!res.error) {
      setOriginalAirport(airport);
      console.log("✅ Airport updated successfully");
    } else {
      setReqState(res.error.source);
    }
  };

  const cancelAllChanges = () => {
    setAirport(originalAirport);
  };

  const hasChanges = () =>
    airport.name !== originalAirport.name ||
    airport.location !== originalAirport.location ||
    airport.ticket_price !== originalAirport.ticket_price || 
    airport.currency !== originalAirport.currency || 
    airport.phone_number !== originalAirport.phone_number;

  return (
    <HandleRequest 
      reqState={reqState} 
      retry={fetchAirport} 
      layout={(
        <>
          <p className='info-card-title'>Airport Information</p>

          <div className='info-card'>
            <div className='info-card-holder'>
              <InfoRow
                icon={faPlaneDeparture}
                type='Airport Name'
                info={airport.name || 'N/A'}
                edit={() => openEditDialog('Airport Name')}
              />
              <InfoRow
                icon={faLocationDot}
                type='Location'
                info={airport.location || 'N/A'}
                edit={() => openEditDialog('Location')}
              />
              <InfoRow
                icon={faPhone}
                type='Phone Number'
                info={airport.phone_number || 'N/A'}
                edit={() => openEditDialog('Phone Number')}
              />
            </div>

            <div className='info-card-holder'>
              <InfoRow
                icon={faTicketAlt}
                type='Ticket Price'
                info={
                  airport.ticket_price
                    ? `${airport.ticket_price} ${airport.currency || 'DA'}`
                    : 'N/A'
                }
                edit={() => openEditDialog('Ticket Price')}
              />
              <InfoRow
                icon={faDollarSign}
                type='Total Expenses'
                info={`${airport.total_expenses || 0} ${airport.total_expenses_currency || 'DA'}`}
                edit={false}
              />
              <InfoRow
                icon={faCalendarDay}
                type='Added'
                info={formatApiDate(airport.creation_date)}
                edit={false}
              />
            </div>
          </div>

          {/* ✏️ Edit Dialog */}
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

          <p className='info-card-title' style={{ marginBottom: 0 }}>
            Tours History
          </p>

          <ToorsSection
            tours={tours}
            setReqState={setReqState}
            setTours={setTours}
          />
        </>
      )}
    />
  );
};
