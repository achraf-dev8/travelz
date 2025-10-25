import React from 'react';
import { CurrentPassword } from './CurrentPassword';
import { ChangePassword } from './ChangePassword';
import { ChangedPasswordSuccess } from './ChangedPasswordSuccess';

export const ChangePasswordDialog = ({
  onChange,
  value,
  confirming,
  setConfirming,
  onCancel,
  username,
  error,
  setError,
  step,
  setStep,
}) => {
  return (
    <div className="edit-dialog">
      {step === 1 ? (
        <CurrentPassword
          onChange={onChange}
          value={value}
          confirming={confirming}
          setConfirming={setConfirming}
          onCancel={onCancel}
          username={username}
          error={error}
          setError={setError}
          setStep={setStep}
        />
      ) : step === 2 ? (
        <ChangePassword
        username={username} onCancel={onCancel} setStep={setStep}
        />
      ) : <ChangedPasswordSuccess onCancel= {onCancel}/>}
    </div>
  );
};
