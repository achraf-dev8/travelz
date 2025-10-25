import React from "react";
import { ConfirmButton } from "../../../components/home/add/ConfirmButton";

export const ChangedPasswordSuccess = ({ onCancel }) => {
  return (
    <div style={{textAlign: "center",}}>
      <p style={{    fontSize: "17px", fontWeight : '500'}}>Password was changed successfully!</p>

      <div style={{ height: "20px" }} />
      <div style={{display:'flex', justifyContent : 'end'}}>
      <ConfirmButton
        style={{width : '150px', justifyContent : 'center'}}
        onClick={onCancel}
      />
      </div>
    </div>
  );
};

