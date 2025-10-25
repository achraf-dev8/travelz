import React, { useState, useEffect } from "react";
import VerificationInput from "react-verification-input";
import { InfoConfirmHolder } from "./InfoConfirmHolder";
import { EmailVerficationPage } from "./EmailVerficationPage";
import { InfoUpdatedSuccess } from "./InfoUpdatedSuccess";

export const EmailVerifyDialog = ({ code, email, onCancel, step, confirmInformation, setStep, succText}) => {
  return step == 1 ? (<EmailVerficationPage code={code} email={email} onCancel={onCancel} 
  confirmInformation = {confirmInformation} setStep={setStep}
  />) : (<InfoUpdatedSuccess onCancel={onCancel} text={succText}
  />)
};
