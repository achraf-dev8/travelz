import React, { useEffect, useRef, useState } from 'react';
import '../../../styles/Info.css';

import {
  faLocationDot,
  faDollarSign,
  faCalendarDay,
  faPhone,
  faHotel,
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

export const HotelInfo = () => {
  const editDialogRef = useRef(null);

  const [reqState, setReqState] = useState("loading");
  const [tours, setTours] = useState([]);
  const [confirming, setConfirming] = useState(false);
  const [originalHotel, setOriginalHotel] = useState({});
  const [hotel, setHotel] = useState({});
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [inputError, setInputError] = useState(null);
  const [roomPriceCurr, setRoomPriceCurr] = useState('DA');

  // ✅ Get ID and agency from store
  const { id } = useParams();
  const { agency, setPages } = useAppStore();

  useEffect(() => {
    setPages(['Hotels', 'Hotel Information']);
  }, []);
  useEffect(() => {
    if (id) fetchHotel();
  }, [id]);

  // ✅ Fetch hotel data including total expenses
  async function fetchHotel() {
    const res = await apiGet(`/hotels/${id}`, { params: { ...agency } });
    console.log("Hotel response:", res);

    if (!res.error) {
      setTours(res.data.tours || []);
      setOriginalHotel(res.data);
      setHotel(res.data);
      setReqState('success');
    } else {
      setReqState(res.error.source);
    }
  }

  const clnFieldName = (fieldName) =>
    fieldName === 'Hotel Name' ? 'name' :
    fieldName === 'Location' ? 'location' :
    fieldName === 'Room Price' ? 'room_price' :
    fieldName === 'Phone Number' ? 'phone_number' :
    fieldName;

  const openEditDialog = (fieldName) => {
    const cleanFieldName = clnFieldName(fieldName);
    setEditField(fieldName);
    setRoomPriceCurr(hotel.currency || 'DA');
    const currentValue = hotel[cleanFieldName]?.toString() || '';
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
      editField === 'Hotel Name' ? 'res name' :
      editField === 'Location' ? 'location' :
      editField === 'Room Price' ? 'price' :
      editField;

    const error = checkInput(checkField, tempValue);
    if (error) {
      setInputError(error);
      return;
    }

    const cleanFieldName = clnFieldName(editField);

    if (editField === 'Room Price') {
      setHotel({ ...hotel, room_price: Number(tempValue), currency: roomPriceCurr });
    } else {
      setHotel({ ...hotel, [cleanFieldName]: tempValue });
    }

    closeEditDialog();
  };

  const confirmAllChanges = async () => {
    setConfirming(true);
    const res = await apiPut(`/hotels/${id}`, hotel);
    setConfirming(false);

    if (!res.error) {
      setOriginalHotel(hotel);
      setHotel(hotel);
    } else {
      setReqState(res.error.source);
    }
  };

  const cancelAllChanges = () => {
    setHotel(originalHotel);
  };

  const hasChanges = () =>
    hotel.name !== originalHotel.name ||
    hotel.location !== originalHotel.location ||
    hotel.room_price !== originalHotel.room_price ||
    hotel.currency !== originalHotel.currency ||
    hotel.phone_number !== originalHotel.phone_number;

  return (
    <HandleRequest
      reqState={reqState}
      retry={fetchHotel}
      layout={(
        <>
          <p className='info-card-title'>Hotel Information</p>

          <div className='info-card'>
            <div className='info-card-holder'>
              <InfoRow
                icon={faHotel}
                type='Hotel Name'
                info={hotel.name || 'N/A'}
                edit={() => openEditDialog('Hotel Name')}
              />
              <InfoRow
                icon={faLocationDot}
                type='Location'
                info={hotel.location || 'N/A'}
                edit={() => openEditDialog('Location')}
              />
              <InfoRow
                icon={faPhone}
                type='Phone Number'
                info={hotel.phone_number || 'N/A'}
                edit={() => openEditDialog('Phone Number')}
              />
            </div>

            <div className='info-card-holder'>
              <InfoRow
                icon={faCoins}
                type='Room Price'
                info={hotel.room_price ? `${hotel.room_price} ${hotel.currency}` : 'N/A'}
                edit={() => openEditDialog('Room Price')}
              />
              <InfoRow
                icon={faDollarSign}
                type='Total Expenses'
                info={`${hotel.total_expenses || 0} ${hotel.total_expenses_currency || 'DA'}`}
                edit={false}
              />
              <InfoRow
                icon={faCalendarDay}
                type='Added'
                info={formatApiDate(hotel.creation_date)}
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
              curr={editField === 'Room Price' ? roomPriceCurr : null}
              setCurr={editField === 'Room Price' ? setRoomPriceCurr : null}
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

          <p style={{ marginBottom: '0px' }} className='info-card-title'>
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
