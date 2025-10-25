import React, { useRef } from 'react';
import { InputElement } from '../../inputs/InputElement';
import { InfoConfirmHolder } from './InfoConfirmHolder';
import { apiPost } from '../../../functions/api';

export const CurrentPassword = ({
  onChange,
  value,
  onCancel,
  username,
  error,
  setError,
  setStep,
  confirming,
  setConfirming,
}) => {
  const controllerRef = useRef(null);

  async function checkNext() {
    setError(null);
    setConfirming(true);

    // Create AbortController for this request
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    try {
      const response = await apiPost(
        '/settings/verify_password',
        { username, password: value },
        { signal }
      );

      if (!response.error) {
        if (response.data.success) {
          console.log('✅ Password verified successfully');
          setStep(2);
        } else {
          setError('Password is incorrect');
        }
      } else {
        setError('Something went wrong, please try again!');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('⏹ Password verification aborted');
      } else {
        setError('Something went wrong, please try again!');
      }
    } finally {
      setConfirming(false);
    }
  }

  // Handle dialog cancel (abort any ongoing requests)
  function handleCancel() {
    if (controllerRef.current) controllerRef.current.abort();
    onCancel();
  }

  return (
    <div>
      <p className="title">Change Password</p>

      <InputElement
        type="password"
        display="Current Password"
        error={error}
        touched={true}
        value={value}
        onChange={onChange}
      />

      <div style={{ height: '20px' }} />

      <InfoConfirmHolder
        style={{ marginTop: '0px' }}
        onCancel={handleCancel}
        name="Next"
        extra={value === '' || confirming ? 'disactive' : ''}
        onConfirm={checkNext}
      />
    </div>
  );
};
