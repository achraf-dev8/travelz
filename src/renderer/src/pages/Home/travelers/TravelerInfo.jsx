import React, { useRef, useState } from 'react';
import '../../../styles/Info.css';
import {
  faCalendarAlt,
  faCalendarDay,
  faPhone,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

import { InfoRow } from '../../../components/home/info/InfoRow';
import { ToorsSection } from '../../../components/home/toors/ToorsSection';
import { InfoConfirmHolder } from '../../../components/home/info/InfoConfirmHolder';
import { EditDialog } from '../../../components/home/info/EditDialog';
import { checkInput } from '../../../functions/input';
import Calender from '../../../components/home/Calender';

export const TravelerInfo = () => {
  const editDialogRef = useRef(null);
  const birthDialogRef = useRef(null);

  const [originalTraveler, setOriginalTraveler] = useState({
    firstName: 'Achraf eddine',
    lastName: 'Laifa',
    phoneNumber: '',
    birthDate: new Date(2004, 8, 18),
    age: 20,
  });

  const [traveler, setTraveler] = useState(originalTraveler);

  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [inputError, setInputError] = useState(null);

  const formatDate = (date) => {
    if (!date || date === 'N/A') return 'N/A';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const openEditDialog = (fieldName) => {
    if (fieldName === 'birthDate') {
      birthDialogRef.current?.showModal();
      return;
    }
    setEditField(fieldName);
    const currentValue = traveler[fieldName]?.toString() || '';
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

  const closeBirthDialog = () => {
    birthDialogRef.current?.close();
  };

  const confirmBirthDate = (newDate) => {
    setTraveler((prev) => ({ ...prev, birthDate: newDate }));
    closeBirthDialog();
  };

  const confirmEdit = () => {
    const checkField = editField === 'firstName' || editField === 'lastName' ? 'name' : editField;
    const error = checkInput(checkField, tempValue);
    if (error) {
      setInputError(error);
      return;
    }

    if (editField === 'age') {
      setTraveler({ ...traveler, age: Number(tempValue) });
    } else {
      setTraveler({ ...traveler, [editField]: tempValue });
    }

    closeEditDialog();
  };

  const confirmAllChanges = () => {
    setOriginalTraveler(traveler); // Save new state as original
  };

  const cancelAllChanges = () => {
    setTraveler(originalTraveler); // Revert to original values
  };

  // Simple deep comparison to detect change
  const hasChanges =
    traveler.firstName !== originalTraveler.firstName ||
    traveler.lastName !== originalTraveler.lastName ||
    traveler.phoneNumber !== originalTraveler.phoneNumber ||
    traveler.age !== originalTraveler.age ||
    formatDate(traveler.birthDate) !== formatDate(originalTraveler.birthDate);

  return (
    <>
      <p className='info-card-title'>Traveler Information</p>
      <div className='info-card'>
        <div className='info-card-holder'>
          <InfoRow
            icon={faUser}
            type='First Name'
            info={traveler.firstName}
            edit={() => openEditDialog('firstName')}
          />
          <InfoRow
            icon={faUser}
            type='Last Name'
            info={traveler.lastName}
            edit={() => openEditDialog('lastName')}
          />
          <InfoRow
            icon={faUser}
            type='Age'
            info={`${traveler.age} years`}
            edit={() => openEditDialog('age')}
          />
        </div>
        <div className='info-card-holder'>
          <InfoRow
            icon={faCalendarAlt}
            type='Birth Date'
            info={formatDate(traveler.birthDate)}
            edit={() => openEditDialog('birthDate')}
          />
          <InfoRow
            icon={faPhone}
            type='Phone Number'
            info={traveler.phoneNumber || 'N/A'}
            edit={() => openEditDialog('phoneNumber')}
          />
          <InfoRow
            icon={faCalendarDay}
            type='Added'
            info='18/09/2004'
            edit={false}
          />
        </div>

        {hasChanges && (
          <InfoConfirmHolder
            onConfirm={confirmAllChanges}
            onCancel={cancelAllChanges}
            name='Confirm Changes'
          />
        )}
      </div>

      <hr className='divider info' />

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
          onChange={(val) => setTempValue(val)}
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
          date={traveler.birthDate}
          close={closeBirthDialog}
          confirm={confirmBirthDate}
        />
      </dialog>

      <p className='info-card-title'>Tours History</p>
      <ToorsSection />
    </>
  );
};
